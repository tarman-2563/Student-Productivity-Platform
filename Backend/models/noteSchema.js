const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
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
    content: {
        type: String,
        required: true,
        maxLength: 50000
    },
    category: {
        type: String,
        trim: true,
        enum: ["personal", "work", "study", "ideas", "todo", ""],
        default: ""
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium"
    },
    tags: [{
        type: String,
        trim: true,
        maxLength: 20
    }],
    isPinned: {
        type: Boolean,
        default: false
    },
    isArchived: {
        type: Boolean,
        default: false
    },
    lastViewedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

noteSchema.index({ 
    title: 'text', 
    content: 'text', 
    tags: 'text' 
});

noteSchema.index({ userId: 1, createdAt: -1 });
noteSchema.index({ userId: 1, updatedAt: -1 });
noteSchema.index({ userId: 1, category: 1 });
noteSchema.index({ userId: 1, isPinned: -1, updatedAt: -1 });

noteSchema.virtual('wordCount').get(function() {
    return this.content.trim().split(/\s+/).filter(word => word.length > 0).length;
});

noteSchema.virtual('readingTime').get(function() {
    return Math.ceil(this.wordCount / 200);
});

const Note = mongoose.model("Note", noteSchema);
module.exports = Note;