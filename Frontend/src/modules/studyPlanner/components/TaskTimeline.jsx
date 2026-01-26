import StudyTaskCard from './StudyTaskCard';

const TaskTimeline = ({ selectedDate, tasks, loading, onTaskUpdated }) => {
    if (loading) {
        return (
            <div className="flex justify-center items-center py-16">
                <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (tasks.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="text-6xl mb-4 opacity-50">🎯</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No quests planned for today!</h3>
                <p className="text-gray-600">
                    Ready to start your study adventure? Create your first quest below!
                </p>
            </div>
        );
    }

    return (
        <div className="mt-8">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-blue-600 mb-2">⚔️ Active Quests</h2>
                <p className="text-gray-600">Complete your study missions to earn XP and gems!</p>
            </div>
            
            <div className="space-y-4">
                {tasks.map((task) => (
                    <StudyTaskCard 
                        key={task._id} 
                        task={task} 
                        onTaskUpdated={onTaskUpdated}
                    />
                ))}
            </div>
        </div>
    );
};

export default TaskTimeline;