const express = require("express");
const { body } = require("express-validator");
const authMiddleware = require("../middleware/auth.middleware");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
    createResource,
    getResources,
    getResourceById,
    updateResource,
    deleteResource,
    toggleFavorite,
    downloadResource,
    getResourceStats,
    getResourcesBySubject,
    linkResource,
    unlinkResource
} = require("../controllers/resource.controller");

const resourceRouter = express.Router();

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|ppt|pptx|xls|xlsx|zip|mp4|mp3/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images, PDFs, documents, and media files are allowed.'));
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024
    },
    fileFilter: fileFilter
});

const resourceValidation = [
    body('title').trim().notEmpty().withMessage('Title is required').isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters'),
    body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
    body('type').notEmpty().withMessage('Type is required').isIn(['pdf', 'image', 'link', 'document', 'video', 'other']).withMessage('Invalid resource type'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('subject').trim().notEmpty().withMessage('Subject is required')
];

resourceRouter.post(
    "/",
    authMiddleware,
    upload.single('file'),
    resourceValidation,
    createResource
);

resourceRouter.get("/", authMiddleware, getResources);
resourceRouter.get("/stats", authMiddleware, getResourceStats);
resourceRouter.get("/subject/:subject", authMiddleware, getResourcesBySubject);
resourceRouter.get("/:id", authMiddleware, getResourceById);
resourceRouter.put("/:id", authMiddleware, updateResource);
resourceRouter.delete("/:id", authMiddleware, deleteResource);
resourceRouter.patch("/:id/favorite", authMiddleware, toggleFavorite);
resourceRouter.get("/:id/download", authMiddleware, downloadResource);
resourceRouter.post("/:id/link", authMiddleware, linkResource);
resourceRouter.post("/:id/unlink", authMiddleware, unlinkResource);

module.exports = resourceRouter;
