
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
            alert("Please fill in all fields");
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
            alert("Failed to create task");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input 
                placeholder="What will you study?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <input 
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
            />
            <input 
                placeholder="Duration (min)"
                type="number"
                min="10"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
            />
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
            </select>
            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Task"}
            </button>
        </form>
    );
};

export default CreateTaskInline;