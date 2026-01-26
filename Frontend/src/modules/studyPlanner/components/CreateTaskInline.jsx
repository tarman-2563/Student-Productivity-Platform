
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
        <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 mt-8 transition-all duration-200 hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50">
            <h3 className="text-lg font-semibold text-blue-600 text-center mb-6">⚔️ Create New Quest</h3>
            
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <div className="md:col-span-2">
                        <input 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="What will you study? (Quest Name)"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div>
                        <input 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div>
                        <input 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Duration"
                            type="number"
                            min="10"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div>
                        <select 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                            value={priority} 
                            onChange={(e) => setPriority(e.target.value)}
                        >
                            <option value="Low" className="text-green-600">⭐ Easy</option>
                            <option value="Medium" className="text-yellow-600">⭐⭐ Medium</option>
                            <option value="High" className="text-red-600">⭐⭐⭐ Hard</option>
                        </select>
                    </div>
                    
                    <div>
                        <button 
                            type="submit" 
                            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Creating..." : "🚀 Launch Quest"}
                        </button>
                    </div>
                </div>
                
                {duration && (
                    <div className="mt-4 text-center">
                        <div className="inline-block bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-300 rounded-lg px-4 py-2 text-sm font-semibold text-yellow-800">
                            Reward Preview: {getXPPreview()} XP + {getGemPreview()}💎
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default CreateTaskInline;