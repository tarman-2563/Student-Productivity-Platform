import StudyTaskCard from './StudyTaskCard';
import useDailyTasks from '../hooks/useDailyTasks';

const TaskTimeline = ({ selectedDate }) => {
    const { tasks, loading, refetch } = useDailyTasks(selectedDate);

    if (loading) {
        return <p>Loading your study plan...</p>;
    }

    if (tasks.length === 0) {
        return <p>No tasks planned for this day. Add your first task below!</p>;
    }

    return (
        <div>
            {tasks.map((task) => (
                <StudyTaskCard 
                    key={task._id} 
                    task={task} 
                    onTaskUpdated={refetch}
                />
            ))}
        </div>
    );
};

export default TaskTimeline;