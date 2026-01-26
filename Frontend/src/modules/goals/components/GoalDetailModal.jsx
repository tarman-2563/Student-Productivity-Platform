import { useState, useEffect } from 'react';
import { getGoalById } from '../services/goals.api';
import ProgressBar from './ProgressBar';
import MilestoneList from './MilestoneList';
import ProgressLogList from './ProgressLogList';

const GoalDetailModal = ({ goalId, onClose, onUpdate, onDelete }) => {
    const [goal, setGoal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGoal = async () => {
            try {
                setLoading(true);
                const data = await getGoalById(goalId);
                setGoal(data.goal);
            } catch (err) {
                console.error('Failed to fetch goal:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (goalId) {
            fetchGoal();
        }
    }, [goalId]);

    const handleUpdate = (updates) => {
        setGoal(prev => ({ ...prev, ...updates }));
        if (onUpdate) onUpdate(goalId, updates);
    };

    const handleDelete = () => {
        if (onDelete) onDelete(goalId);
        onClose();
    };

    if (!goalId) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Goal Details</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl"
                    >
                        ×
                    </button>
                </div>

                <div className="p-6">
                    {loading ? (
                        <div className="animate-pulse space-y-4">
                            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                            <div className="h-32 bg-gray-200 rounded"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8">
                            <div className="text-red-500 text-4xl mb-4">⚠️</div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Goal</h3>
                            <p className="text-gray-600 mb-4">{error}</p>
                            <button
                                onClick={onClose}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            >
                                Close
                            </button>
                        </div>
                    ) : goal ? (
                        <div className="space-y-6">
                            {/* Goal Header */}
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{goal.title}</h3>
                                {goal.description && (
                                    <p className="text-gray-600 leading-relaxed">{goal.description}</p>
                                )}
                            </div>

                            {/* Goal Meta */}
                            <div className="flex flex-wrap gap-4 text-sm">
                                <div className="flex items-center space-x-2">
                                    <span className="text-gray-500">Category:</span>
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                                        {goal.category}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-gray-500">Priority:</span>
                                    <span className={`px-2 py-1 rounded-full font-medium ${
                                        goal.priority === 'High' ? 'bg-red-100 text-red-800' :
                                        goal.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-green-100 text-green-800'
                                    }`}>
                                        {goal.priority}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-gray-500">Target Date:</span>
                                    <span className="font-medium text-gray-900">
                                        {new Date(goal.targetDate).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-gray-500">Status:</span>
                                    <span className={`px-2 py-1 rounded-full font-medium ${
                                        goal.status === 'completed' ? 'bg-green-100 text-green-800' :
                                        'bg-blue-100 text-blue-800'
                                    }`}>
                                        {goal.status}
                                    </span>
                                </div>
                            </div>

                            {/* Progress */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium text-gray-900">Progress</span>
                                    <span className="text-lg font-bold text-blue-600">{goal.progress}%</span>
                                </div>
                                <ProgressBar progress={goal.progress} />
                            </div>

                            {/* Milestones */}
                            {goal.milestones && goal.milestones.length > 0 && (
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-3">
                                        Milestones ({goal.milestones.filter(m => m.completed).length}/{goal.milestones.length})
                                    </h4>
                                    <MilestoneList
                                        milestones={goal.milestones}
                                        onUpdate={(milestones) => handleUpdate({ milestones })}
                                    />
                                </div>
                            )}

                            {/* Progress Logs */}
                            {goal.progressLogs && goal.progressLogs.length > 0 && (
                                <div>
                                    <ProgressLogList progressLogs={goal.progressLogs} />
                                </div>
                            )}

                            {/* Tags */}
                            {goal.tags && goal.tags.length > 0 && (
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-2">Tags</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {goal.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex justify-between pt-4 border-t border-gray-200">
                                <div className="flex space-x-3">
                                    {goal.status !== 'completed' && (
                                        <button
                                            onClick={() => handleUpdate({ status: 'completed' })}
                                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                        >
                                            Mark as Completed
                                        </button>
                                    )}
                                </div>
                                <button
                                    onClick={handleDelete}
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Delete Goal
                                </button>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default GoalDetailModal;