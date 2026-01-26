import { useState, useEffect } from 'react';
import { getGoalStats } from '../services/goals.api';

const GoalStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const data = await getGoalStats();
                setStats(data.stats);
            } catch (err) {
                console.error('Failed to fetch goal stats:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="text-center">
                                <div className="h-8 bg-gray-200 rounded w-12 mx-auto mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-16 mx-auto"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
                <div className="text-red-600 text-center">
                    <p className="font-medium">Failed to load statistics</p>
                    <p className="text-sm mt-1">{error}</p>
                </div>
            </div>
        );
    }

    if (!stats) return null;

    const completionRate = stats.totalGoals > 0 ? Math.round((stats.completedGoals / stats.totalGoals) * 100) : 0;

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Goal Statistics</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.totalGoals}</div>
                    <div className="text-sm text-gray-600">Total Goals</div>
                </div>
                
                <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.completedGoals}</div>
                    <div className="text-sm text-gray-600">Completed</div>
                </div>
                
                <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{stats.activeGoals}</div>
                    <div className="text-sm text-gray-600">Active</div>
                </div>
                
                <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{stats.overdueGoals}</div>
                    <div className="text-sm text-gray-600">Overdue</div>
                </div>
                
                <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{completionRate}%</div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                </div>
            </div>

            {stats.averageProgress > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Average Progress</span>
                        <span className="font-medium text-gray-900">{Math.round(stats.averageProgress)}%</span>
                    </div>
                    <div className="mt-2 bg-gray-200 rounded-full h-2">
                        <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.round(stats.averageProgress)}%` }}
                        ></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GoalStats;