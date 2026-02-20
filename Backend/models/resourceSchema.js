const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxLength: 200
    },
    description: {
        type: String,
        trim: true,
        maxLength: 1000
    },
    type: {
        type: String,
        enum: ["pdf", "image", "link", "document", "video", "other"],
        required: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    // For uploaded files
    fileUrl: {
        type: String,
        trim: true
    },
    fileName: {
        type: String,
        trim: true
    },
    fileSize: {
        type: Number // in bytes
    },
    mimeType: {
        type: String,
        trim: true
    },
    // For links
    externalUrl: {
        type: String,
        trim: true
    },
    // Cloud storage info
    cloudProvider: {
        type: String,
        enum: ["local", "cloudinary", "s3", "drive", "dropbox"],
        default: "local"
    },
    cloudFileId: {
        type: String,
        trim: true
    },
    // Organization
    tags: [{
        type: String,
        trim: true,
        maxLength: 30
    }],
    isFavorite: {
        type: Boolean,
        default: false
    },
    // Associations
    linkedNotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Note"
    }],
    linkedTasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "StudyTask"
    }],
    linkedGoals: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Goal"
    }],
    // Access tracking
    viewCount: {
        type: Number,
        default: 0
    },
    lastAccessedAt: {
        type: Date,
        default: Date.now
    },
    downloadCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Indexes for better query performance
resourceSchema.index({ userId: 1, category: 1 });
resourceSchema.index({ userId: 1, subject: 1 });
resourceSchema.index({ userId: 1, type: 1 });
resourceSchema.index({ userId: 1, isFavorite: -1, createdAt: -1 });
resourceSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Virtual for formatted file size
resourceSchema.virtual('formattedSize').get(function() {
    if (!this.fileSize) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (this.fileSize === 0) return '0 Bytes';
    const i = Math.floor(Math.log(this.fileSize) / Math.log(1024));
    return Math.round(this.fileSize / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
});

// Method to increment view count
resourceSchema.methods.incrementView = function() {
    this.viewCount += 1;
    this.lastAccessedAt = new Date();
    return this.save();
};

// Method to increment download count
resourceSchema.methods.incrementDownload = function() {
    this.downloadCount += 1;
    return this.save();
};

const Resource = mongoose.model("Resource", resourceSchema);
module.exports = Resource;
