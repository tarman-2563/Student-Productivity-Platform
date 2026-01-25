import StudyTaskCard from './StudyTaskCard';
import useDailyTasks from '../hooks/useDailyTasks';

const TaskTimeline = ({ selectedDate }) => {
    const { tasks, loading, refetch } = useDailyTasks(selectedDate);

    if (loading) {
        return (
            <div className="loading-spinner">
                <div className="spinner"></div>
            </div>
        );
    }

    if (tasks.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-state-icon">🎯</div>
                <h3 className="empty-state-title">No quests planned for today!</h3>
                <p className="empty-state-description">
                    Ready to start your study adventure? Create your first quest below!
                </p>
            </div>
        );
    }

    return (
        <div className="task-timeline">
            <div className="timeline-header">
                <h2 className="timeline-title">⚔️ Active Quests</h2>
                <p className="timeline-subtitle">Complete your study missions to earn XP and gems!</p>
            </div>
            
            <div className="quest-list">
                {tasks.map((task) => (
                    <StudyTaskCard 
                        key={task._id} 
                        task={task} 
                        onTaskUpdated={refetch}
                    />
                ))}
            </div>
        </div>
    );
};

export default TaskTimeline;