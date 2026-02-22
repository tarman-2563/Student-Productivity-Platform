const Resource = require("../models/resourceSchema");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs").promises;

const createResource = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log("Validation errors:", errors.array());
            return res.status(400).json({ 
                message: "Validation failed", 
                errors: errors.array().map(err => `${err.param}: ${err.msg}`)
            });
        }

        const { title, description, type, category, subject, externalUrl, tags, linkedNotes, linkedTasks, linkedGoals } = req.body;
        
        // Additional validation
        if (!title || title.trim() === '') {
            return res.status(400).json({ message: "Title is required" });
        }
        if (!type) {
            return res.status(400).json({ message: "Type is required" });
        }
        if (!category || category.trim() === '') {
            return res.status(400).json({ message: "Category is required" });
        }
        if (!subject || subject.trim() === '') {
            return res.status(400).json({ message: "Subject is required" });
        }
        
        let resourceData = {
            userId: req.user.id,
            title: title.trim(),
            description: description ? description.trim() : '',
            type,
            category: category.trim(),
            subject: subject.trim(),
            tags: [],
            linkedNotes: linkedNotes || [],
            linkedTasks: linkedTasks || [],
            linkedGoals: linkedGoals || []
        };

        if (tags) {
            try {
                if (typeof tags === 'string') {
                    resourceData.tags = JSON.parse(tags);
                } else if (Array.isArray(tags)) {
                    resourceData.tags = tags;
                }
            } catch (e) {
                console.error('Error parsing tags:', e);
                resourceData.tags = [];
            }
        }

        if (req.file) {
            resourceData.fileUrl = `/uploads/${req.file.filename}`;
            resourceData.fileName = req.file.originalname;
            resourceData.fileSize = req.file.size;
            resourceData.mimeType = req.file.mimetype;
            resourceData.cloudProvider = "local";
        }

        if (externalUrl && externalUrl.trim() !== '') {
            resourceData.externalUrl = externalUrl.trim();
        }

        const newResource = await Resource.create(resourceData);
        
        res.status(201).json({
            message: "Resource created successfully",
            resource: newResource
        });
    } catch (err) {
        console.error("Create resource error:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};

const getResources = async (req, res) => {
    try {
        const { 
            type, 
            category, 
            subject, 
            search, 
            sortBy = 'createdAt', 
            sortOrder = 'desc',
            page = 1,
            limit = 20,
            favorites = false
        } = req.query;

        const filter = { userId: req.user.id };
        
        if (type && type !== 'all') filter.type = type;
        if (category && category !== 'all') filter.category = category;
        if (subject && subject !== 'all') filter.subject = subject;
        if (favorites === 'true') filter.isFavorite = true;

        let query = Resource.find(filter);

        // Text search
        if (search) {
            query = query.find({ $text: { $search: search } });
        }

        // Sorting
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
        query = query.sort(sortOptions);

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        query = query.skip(skip).limit(parseInt(limit));

        const resources = await query;
        const totalResources = await Resource.countDocuments(filter);

        res.status(200).json({
            resources,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalResources / parseInt(limit)),
                totalResources,
                hasNext: skip + resources.length < totalResources,
                hasPrev: parseInt(page) > 1
            }
        });
    } catch (err) {
        console.error("Get resources error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getResourceById = async (req, res) => {
    try {
        const resourceId = req.params.id;
        const resource = await Resource.findOne({ _id: resourceId, userId: req.user.id })
            .populate('linkedNotes', 'title')
            .populate('linkedTasks', 'title')
            .populate('linkedGoals', 'title');

        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }

        res.status(200).json({ resource });
    } catch (err) {
        console.error("Get resource by ID error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const updateResource = async (req, res) => {
    try {
        const resourceId = req.params.id;
        const resource = await Resource.findOne({ _id: resourceId, userId: req.user.id });

        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }

        // Update fields
        const allowedUpdates = ['title', 'description', 'category', 'subject', 'tags', 'linkedNotes', 'linkedTasks', 'linkedGoals'];
        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                resource[field] = req.body[field];
            }
        });

        await resource.save();

        res.status(200).json({
            message: "Resource updated successfully",
            resource
        });
    } catch (err) {
        console.error("Update resource error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const deleteResource = async (req, res) => {
    try {
        const resourceId = req.params.id;
        const resource = await Resource.findOne({ _id: resourceId, userId: req.user.id });

        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }

        // Delete file from storage if it exists
        if (resource.fileUrl && resource.cloudProvider === 'local') {
            try {
                const filePath = path.join(__dirname, '..', resource.fileUrl);
                await fs.unlink(filePath);
            } catch (fileErr) {
                console.error("Error deleting file:", fileErr);
            }
        }

        await resource.deleteOne();

        res.status(200).json({ message: "Resource deleted successfully" });
    } catch (err) {
        console.error("Delete resource error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const toggleFavorite = async (req, res) => {
    try {
        const resourceId = req.params.id;
        const resource = await Resource.findOne({ _id: resourceId, userId: req.user.id });

        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }

        resource.isFavorite = !resource.isFavorite;
        await resource.save();

        res.status(200).json({
            message: `Resource ${resource.isFavorite ? 'added to' : 'removed from'} favorites`,
            resource
        });
    } catch (err) {
        console.error("Toggle favorite error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const downloadResource = async (req, res) => {
    try {
        const resourceId = req.params.id;
        const resource = await Resource.findOne({ _id: resourceId, userId: req.user.id });

        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }

        if (!resource.fileUrl) {
            return res.status(400).json({ message: "No file available for download" });
        }

        const filePath = path.join(__dirname, '..', resource.fileUrl);
        res.download(filePath, resource.fileName);
    } catch (err) {
        console.error("Download resource error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getResourceStats = async (req, res) => {
    try {
        const userId = req.user.id;

        const stats = await Resource.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: null,
                    totalResources: { $sum: 1 },
                    totalSize: { $sum: "$fileSize" },
                    favoriteCount: { $sum: { $cond: ["$isFavorite", 1, 0] } }
                }
            }
        ]);

        const typeBreakdown = await Resource.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            { $group: { _id: "$type", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        const subjectBreakdown = await Resource.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            { $group: { _id: "$subject", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        const result = stats[0] || {
            totalResources: 0,
            totalSize: 0,
            favoriteCount: 0
        };

        result.typeBreakdown = typeBreakdown;
        result.subjectBreakdown = subjectBreakdown;

        res.status(200).json({ stats: result });
    } catch (err) {
        console.error("Get resource stats error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getResourcesBySubject = async (req, res) => {
    try {
        const { subject } = req.params;
        const resources = await Resource.find({
            userId: req.user.id,
            subject: subject
        }).sort({ createdAt: -1 }).limit(10);

        res.status(200).json({ resources });
    } catch (err) {
        console.error("Get resources by subject error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Link resource to note/task/goal
const linkResource = async (req, res) => {
    try {
        const resourceId = req.params.id;
        const { linkType, linkId } = req.body; // linkType: 'note', 'task', 'goal'

        const resource = await Resource.findOne({ _id: resourceId, userId: req.user.id });

        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }

        const linkField = `linked${linkType.charAt(0).toUpperCase() + linkType.slice(1)}s`;
        
        if (!resource[linkField].includes(linkId)) {
            resource[linkField].push(linkId);
            await resource.save();
        }

        res.status(200).json({
            message: "Resource linked successfully",
            resource
        });
    } catch (err) {
        console.error("Link resource error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const unlinkResource = async (req, res) => {
    try {
        const resourceId = req.params.id;
        const { linkType, linkId } = req.body;

        const resource = await Resource.findOne({ _id: resourceId, userId: req.user.id });

        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }

        const linkField = `linked${linkType.charAt(0).toUpperCase() + linkType.slice(1)}s`;
        resource[linkField] = resource[linkField].filter(id => id.toString() !== linkId);
        await resource.save();

        res.status(200).json({
            message: "Resource unlinked successfully",
            resource
        });
    } catch (err) {
        console.error("Unlink resource error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = {
    createResource,
    getResources,
    getResourceById,
    updateResource,
    deleteResource,
    toggleFavorite,
    getResourceStats
};
