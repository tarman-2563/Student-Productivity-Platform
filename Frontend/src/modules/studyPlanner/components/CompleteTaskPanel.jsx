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
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6 animate-slideDown">
            <div className="text-center mb-6">
                <h4 className="text-xl font-bold text-blue-600 mb-2">🎉 Quest Complete!</h4>
                <p className="text-gray-600">How did your study session go?</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 items-end">
                <div className="text-center p-4 bg-blue-100 rounded-lg">
                    <span className="block text-sm text-gray-600 mb-1">Planned:</span>
                    <span className="text-2xl font-bold text-blue-600">{task.duration} min</span>
                </div>
                <div className="text-center">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Actual time spent:
                    </label>
                    <div className="flex items-center justify-center space-x-2">
                        <input 
                            type="number" 
                            className="w-20 px-3 py-2 border border-gray-300 rounded-md text-center font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={actualDuration}
                            min={1}
                            onChange={(e) => setActualDuration(Number(e.target.value))}
                        />
                        <span className="text-sm text-gray-500 font-medium">min</span>
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <h5 className="text-base font-semibold text-yellow-800 mb-3 text-center">🏆 Rewards Preview:</h5>
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm text-yellow-800">
                        <span>Base XP:</span>
                        <span className="font-semibold">+{getXPReward()} XP</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-yellow-800">
                        <span>Gems:</span>
                        <span className="font-semibold">+{getGemReward()} 💎</span>
                    </div>
                    {timingBonus.bonus > 0 && (
                        <div className="flex justify-between items-center text-sm bg-white bg-opacity-50 px-3 py-2 rounded font-semibold text-yellow-900">
                            <span>{timingBonus.label}</span>
                            <span>+{timingBonus.bonus} XP</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button 
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center space-x-2"
                    onClick={() => onConfirm(actualDuration)}
                >
                    <span>🎊</span>
                    <span>Claim Rewards</span>
                </button>
                <button 
                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
                    onClick={onCancel}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default CompleteTaskPanel;