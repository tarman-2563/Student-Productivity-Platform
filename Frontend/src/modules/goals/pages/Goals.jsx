import { useState } from 'react';
import GoalCard from '../components/GoalCard';
import CreateGoalForm from '../components/CreateGoalForm';
import GoalStats from '../components/GoalStats';
import GoalDetailModal from '../components/GoalDetailModal';
import ProgressLogForm from '../components/ProgressLogForm';
import useGoals from '../hooks/useGoals';
import { createGoal, updateGoal, addProgressLog, deleteGoal } from '../services/goals.api';

const Goals = () => {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [selectedGoalId, setSelectedGoalId] = useState(null);
    const [progressLogGoal, setProgressLogGoal] = useState(null);
    const { goals, loading, error, refetch } = useGoals();

    const handleCreateGoal = async (goalData) => {
        try {
            await createGoal(goalData);
            refetch();
            setShowCreateForm(false);
        } catch (err) {
            console.error('Failed to create goal:', err);
        }
    };

    const handleUpdateGoal = async (goalId, updates) => {
        try {
            await updateGoal(goalId, updates);
            refetch();
        } catch (err) {
            console.error('Failed to update goal:', err);
        }
    };

    const handleDeleteGoal = async (goalId) => {
        try {
            await deleteGoal(goalId);
            refetch();
        } catch (err) {
            console.error('Failed to delete goal:', err);
            alert('Failed to delete goal. Please try again.');
        }
    };

    const handleViewDetails = (goalId) => {
        setSelectedGoalId(goalId);
    };

    const handleLogProgress = (goal) => {
        setProgressLogGoal(goal);
    };

    const handleProgressLogSubmit = async (progressData) => {
        try {
            await addProgressLog(progressLogGoal._id, progressData);
            refetch();
            setProgressLogGoal(null);
        } catch (err) {
            console.error('Failed to add progress log:', err);
            alert('Failed to log progress. Please try again.');
        }
    };

    const activeGoals = goals.filter(goal => goal.status !== 'completed');
    const completedGoals = goals.filter(goal => goal.status === 'completed');

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Goals</h1>
                    <p className="text-gray-600 mt-1">Track your long-term study objectives</p>
                </div>
                <button
                    onClick={() => setShowCreateForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <span className="text-lg">+</span>
                    New Goal
                </button>
            </div>

            <GoalStats />

            {showCreateForm && (
                <CreateGoalForm
                    onSubmit={handleCreateGoal}
                    onCancel={() => setShowCreateForm(false)}
                />
            )}

            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Loading goals...</span>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <p className="text-red-600">Failed to load goals. Please try again.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {activeGoals.length > 0 && (
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Goals</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {activeGoals.map(goal => (
                                    <GoalCard
                                        key={goal._id}
                                        goal={goal}
                                        onUpdate={handleUpdateGoal}
                                        onDelete={handleDeleteGoal}
                                        onViewDetails={handleViewDetails}
                                        onLogProgress={handleLogProgress}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {completedGoals.length > 0 && (
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Completed Goals</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {completedGoals.map(goal => (
                                    <GoalCard
                                        key={goal._id}
                                        goal={goal}
                                        onUpdate={handleUpdateGoal}
                                        onDelete={handleDeleteGoal}
                                        onViewDetails={handleViewDetails}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {goals.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">🎯</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No goals yet</h3>
                            <p className="text-gray-600 mb-6">Set your first study goal to get started</p>
                            <button
                                onClick={() => setShowCreateForm(true)}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Create Your First Goal
                            </button>
                        </div>
                    )}
                </div>
            )}

            {selectedGoalId && (
                <GoalDetailModal
                    goalId={selectedGoalId}
                    onClose={() => setSelectedGoalId(null)}
                    onUpdate={handleUpdateGoal}
                    onDelete={handleDeleteGoal}
                />
            )}

            {progressLogGoal && (
                <ProgressLogForm
                    goal={progressLogGoal}
                    onSubmit={handleProgressLogSubmit}
                    onCancel={() => setProgressLogGoal(null)}
                />
            )}
        </div>
    );
};

export default Goals;