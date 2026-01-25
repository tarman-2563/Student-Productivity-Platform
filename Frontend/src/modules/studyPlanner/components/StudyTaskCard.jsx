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

    return (
        <div className={`task-card ${isCompleted ? 'completed' : ''}`}>
            <div>
                <h4>{task.title}</h4>
                <span>{task.subject}</span>
            </div>
            <div>
                <span>{task.duration} min</span>
                <span>{task.priority}</span>
            </div>
            {!isCompleted && !showComplete && (
                <button onClick={() => setShowComplete(true)}>Complete</button>
            )}
            {!isCompleted && showComplete && (
                <CompleteTaskPanel 
                    task={task}
                    onConfirm={handleComplete}
                    onCancel={() => setShowComplete(false)}
                />
            )}
            {isCompleted && <span>✓ Completed</span>}
        </div>
    );
};

export default StudyTaskCard;