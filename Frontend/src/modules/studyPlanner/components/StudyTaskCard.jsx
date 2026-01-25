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
            <div className={`quest-card victory-card animate-fadeIn`}>
                <div className="quest-header">
                    <h4 className="quest-title">✅ VICTORY! {task.title}</h4>
                </div>
                <div className="task-subject">📖 {task.subject}</div>
                <div className="victory-rewards">
                    🏆 +{getXPReward()} XP • +{getGemReward()}💎 • Perfect timing!
                </div>
            </div>
        );
    }

    return (
        <div className={`quest-card ${getQuestType()} animate-fadeIn`}>
            <div className="quest-header">
                <h4 className="quest-title">
                    {getQuestType() === "boss-battle" ? "🔴 BOSS BATTLE: " : "⚔️ QUEST: "}
                    {task.title}
                </h4>
                <div className="quest-difficulty">
                    {getDifficultyStars()}
                </div>
            </div>
            
            <div className="task-subject">📖 {task.subject}</div>
            
            <div className="quest-rewards">
                <span>💪 {task.duration} min</span>
                <span>Reward: {getXPReward()} XP + {getGemReward()}💎</span>
            </div>

            {!showComplete && (
                <div className="quest-actions">
                    <button 
                        className={`btn-quest ${getQuestType() === "boss-battle" ? "btn-boss" : ""}`}
                        onClick={() => setShowComplete(true)}
                    >
                        {getQuestType() === "boss-battle" ? "⚔️ START BATTLE" : "🚀 START QUEST"}
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