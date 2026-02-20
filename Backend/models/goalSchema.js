const mongoose = require("mongoose");

const milestoneSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Date,
        default: null
    }
});

const progressLogSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxLength: 500
    },
    timeSpent: {
        type: Number, 
        min: 0
    },
    progressBefore: {
        type: Number,
        min: 0,
        max: 100
    },
    progressAfter: {
        type: Number,
        min: 0,
        max: 100
    },
    mood: {
        type: String,
        enum: ['frustrated', 'neutral', 'satisfied', 'excited'],
        default: 'neutral'
    }
});

const goalSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Medium"
    },
    status: {
        type: String,
        enum: ["active", "completed", "paused", "cancelled"],
        default: "active"
    },
    targetDate: {
        type: Date,
        required: true
    },
    progress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    milestones: [milestoneSchema],
    progressLogs: [progressLogSchema],
    tags: [{
        type: String,
        trim: true
    }],
    completedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

goalSchema.virtual('isOverdue').get(function() {
    return this.status === 'active' && new Date() > this.targetDate;
});

goalSchema.methods.updateProgress = function() {
    if (this.milestones.length === 0) return;
    
    const completedMilestones = this.milestones.filter(m => m.completed).length;
    this.progress = Math.round((completedMilestones / this.milestones.length) * 100);
    
    if (this.progress === 100 && this.status === 'active') {
        this.status = 'completed';
        this.completedAt = new Date();
    }
};

goalSchema.methods.addProgressLog = function(description, timeSpent, newProgress, mood = 'neutral') {
    const progressBefore = this.progress;
    const progressAfter = Math.min(100, Math.max(0, newProgress || progressBefore));
    
    this.progressLogs.push({
        description,
        timeSpent,
        progressBefore,
        progressAfter,
        mood
    });
    
    this.progress = progressAfter;
    
    if (this.progress === 100 && this.status === 'active') {
        this.status = 'completed';
        this.completedAt = new Date();
    }
    
    return this.progressLogs[this.progressLogs.length - 1];
};

const Goal = mongoose.model("Goal", goalSchema);
module.exports = Goal;