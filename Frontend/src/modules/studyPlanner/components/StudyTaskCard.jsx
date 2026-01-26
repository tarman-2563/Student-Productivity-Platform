import { useState } from "react";
import CompleteTaskPanel from "./CompleteTaskPanel";
import { completeStudyTask } from "../services/studyTask.api";

const StudyTaskCard = ({ task, onTaskUpdated }) => {
    const [showComplete, setShowComplete] = useState(false);
    const [isCompleted, setIsCompleted] = useState(task.status === "Completed");

    const handleComplete = async (actualDuration) => {
        try {
            await completeStudyTask(task._id, actualDuration);
            setIsCompleted(true);
            setShowComplete(false);
            
            if (onTaskUpdated) {
                onTaskUpdated();
            }
        } catch (err) {
            alert("Failed to complete task");
        }
    };

    const getPriorityClass = () => {
        return `${task.priority.toLowerCase()}-priority`;
    };

    const getDifficultyStars = () => {
        const stars = task.priority === "High" ? 3 : task.priority === "Medium" ? 2 : 1;
        return "⭐".repeat(stars);
    };

    const getXPReward = () => {
        const baseXP = Math.floor(task.duration / 10) * 10;
        const priorityMultiplier = task.priority === "High" ? 1.5 : task.priority === "Medium" ? 1.2 : 1;
        return Math.floor(baseXP * priorityMultiplier);
    };

    const getGemReward = () => {
        return Math.floor(getXPReward() / 4);
    };

    const getQuestType = () => {
        if (task.priority === "High" && task.duration >= 90) {
            return "boss-battle";
        }
        return "regular-quest";
    };

    if (isCompleted) {
        return (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6 relative animate-pulse">
                <div className="absolute top-2 right-2 text-2xl">🎉</div>
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-bold text-green-800">✅ VICTORY! {task.title}</h4>
                </div>
                <div className="text-green-700 font-medium mb-4">📖 {task.subject}</div>
                <div className="bg-green-100 rounded-lg p-3 text-sm font-semibold text-green-800">
                    🏆 +{getXPReward()} XP • +{getGemReward()}💎 • Perfect timing!
                </div>
            </div>
        );
    }

    return (
        <div className={`border-2 rounded-lg p-6 transition-all duration-200 hover:shadow-md ${
            getQuestType() === "boss-battle" 
                ? "bg-gradient-to-r from-red-50 to-pink-50 border-red-200" 
                : "bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200"
        }`}>
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-bold text-gray-900">
                    {getQuestType() === "boss-battle" ? "🔴 BOSS BATTLE: " : "⚔️ QUEST: "}
                    {task.title}
                </h4>
                <div className="text-lg">
                    {getDifficultyStars()}
                </div>
            </div>
            
            <div className="text-gray-700 font-medium mb-4">📖 {task.subject}</div>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-6 text-sm text-gray-600">
                <span className="flex items-center space-x-1">
                    <span>💪</span>
                    <span>{task.duration} min</span>
                </span>
                <span>Reward: {getXPReward()} XP + {getGemReward()}💎</span>
            </div>

            {!showComplete && (
                <div className="flex gap-3">
                    <button 
                        className={`px-6 py-3 font-semibold rounded-lg transition-all duration-200 hover:shadow-md flex items-center space-x-2 ${
                            getQuestType() === "boss-battle" 
                                ? "bg-gradient-to-r from-red-600 to-pink-600 text-white hover:from-red-700 hover:to-pink-700" 
                                : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                        }`}
                        onClick={() => setShowComplete(true)}
                    >
                        <span>{getQuestType() === "boss-battle" ? "⚔️" : "🚀"}</span>
                        <span>{getQuestType() === "boss-battle" ? "START BATTLE" : "START QUEST"}</span>
                    </button>
                </div>
            )}

            {showComplete && (
                <CompleteTaskPanel 
                    task={task}
                    onConfirm={handleComplete}
                    onCancel={() => setShowComplete(false)}
                />
            )}
        </div>
    );
};

export default StudyTaskCard;