
import { useState } from "react";
import { createStudyTask } from "../services/studyTask.api";

const CreateTaskInline = ({ selectedDate, onTaskCreated }) => {
    const [title, setTitle] = useState("");
    const [subject, setSubject] = useState("");
    const [duration, setDuration] = useState("");
    const [priority, setPriority] = useState("Medium");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!title || !subject || !duration) {
            alert("Please fill in all fields to create your quest!");
            return;
        }

        setIsSubmitting(true);
        try {
            await createStudyTask({
                title,
                subject,
                scheduledFor: selectedDate,
                duration: Number(duration),
                priority
            });
            
            setTitle("");
            setSubject("");
            setDuration("");
            setPriority("Medium");
            
            if (onTaskCreated) {
                onTaskCreated();
            }
        } catch (err) {
            alert("Failed to create quest. Try again, brave scholar!");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getXPPreview = () => {
        if (!duration) return 0;
        const baseXP = Math.floor(Number(duration) / 10) * 10;
        const priorityMultiplier = priority === "High" ? 1.5 : priority === "Medium" ? 1.2 : 1;
        return Math.floor(baseXP * priorityMultiplier);
    };

    const getGemPreview = () => {
        return Math.floor(getXPPreview() / 4);
    };

    return (
        <div className="create-task-form animate-fadeIn">
            <h3 className="form-title">⚔️ Create New Quest</h3>
            
            <form onSubmit={handleSubmit}>
                <div className="form-grid">
                    <div className="form-group">
                        <input 
                            className="form-input"
                            placeholder="What will you study? (Quest Name)"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <input 
                            className="form-input"
                            placeholder="Subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <input 
                            className="form-input"
                            placeholder="Duration"
                            type="number"
                            min="10"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <select 
                            className="form-select priority-select"
                            value={priority} 
                            onChange={(e) => setPriority(e.target.value)}
                        >
                            <option value="Low">⭐ Easy</option>
                            <option value="Medium">⭐⭐ Medium</option>
                            <option value="High">⭐⭐⭐ Hard</option>
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Creating..." : "🚀 Launch Quest"}
                        </button>
                    </div>
                </div>
                
                {duration && (
                    <div className="quest-preview">
                        <div className="preview-rewards">
                            <span>Reward Preview: {getXPPreview()} XP + {getGemPreview()}💎</span>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default CreateTaskInline;