import { useState } from "react";

const CompleteTaskPanel = ({ task, onConfirm, onCancel }) => {
    const [actualDuration, setActualDuration] = useState(task.duration);

    const getXPReward = () => {
        const baseXP = Math.floor(task.duration / 10) * 10;
        const priorityMultiplier = task.priority === "High" ? 1.5 : task.priority === "Medium" ? 1.2 : 1;
        return Math.floor(baseXP * priorityMultiplier);
    };

    const getGemReward = () => {
        return Math.floor(getXPReward() / 4);
    };

    const getTimingBonus = () => {
        const difference = Math.abs(actualDuration - task.duration);
        const accuracy = 1 - (difference / task.duration);
        
        if (accuracy >= 0.9) return { bonus: 10, label: "Perfect Timing! 🎯" };
        if (accuracy >= 0.8) return { bonus: 5, label: "Great Timing! ⏰" };
        if (accuracy >= 0.7) return { bonus: 2, label: "Good Timing! 👍" };
        return { bonus: 0, label: "" };
    };

    const timingBonus = getTimingBonus();

    return (
        <div className="complete-panel animate-slideIn">
            <div className="panel-header">
                <h4>🎉 Quest Complete!</h4>
                <p>How did your study session go?</p>
            </div>
            
            <div className="time-comparison">
                <div className="time-stat">
                    <span className="label">Planned:</span>
                    <span className="value">{task.duration} min</span>
                </div>
                <div className="time-input">
                    <label className="form-label">
                        Actual time spent:
                        <div className="input-group">
                            <input 
                                type="number" 
                                className="form-input"
                                value={actualDuration}
                                min={1}
                                onChange={(e) => setActualDuration(Number(e.target.value))}
                            />
                            <span className="input-suffix">min</span>
                        </div>
                    </label>
                </div>
            </div>

            <div className="rewards-preview">
                <h5>🏆 Rewards Preview:</h5>
                <div className="reward-list">
                    <div className="reward-item">
                        <span>Base XP:</span>
                        <span>+{getXPReward()} XP</span>
                    </div>
                    <div className="reward-item">
                        <span>Gems:</span>
                        <span>+{getGemReward()} 💎</span>
                    </div>
                    {timingBonus.bonus > 0 && (
                        <div className="reward-item bonus">
                            <span>{timingBonus.label}</span>
                            <span>+{timingBonus.bonus} XP</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="panel-actions">
                <button 
                    className="btn btn-success"
                    onClick={() => onConfirm(actualDuration)}
                >
                    🎊 Claim Rewards
                </button>
                <button 
                    className="btn btn-secondary"
                    onClick={onCancel}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default CompleteTaskPanel;