import useDailyTasks from "../hooks/useDailyTasks";
import { formatDate } from "../utils/dateHelpers";

const PlannerHeader = ({ selectedDate, onDateChange }) => {
    const { tasks, stats } = useDailyTasks(selectedDate);
    
    const completedCount = tasks.filter(
        (t) => t.status === "Completed"
    ).length;

    const handleDateChange = (e) => {
        onDateChange(new Date(e.target.value));
    };

    const goToPreviousDay = () => {
        const previousDay = new Date(selectedDate);
        previousDay.setDate(previousDay.getDate() - 1);
        onDateChange(previousDay);
    };

    const goToNextDay = () => {
        const nextDay = new Date(selectedDate);
        nextDay.setDate(nextDay.getDate() + 1);
        onDateChange(nextDay);
    };

    const goToToday = () => {
        onDateChange(new Date());
    };

    return (
        <div>
            <div>
                <h2>Study Planner</h2>
                <div>
                    <button onClick={goToPreviousDay}>← Previous</button>
                    <input 
                        type="date" 
                        value={formatDate(selectedDate)}
                        onChange={handleDateChange}
                    />
                    <button onClick={goToNextDay}>Next →</button>
                    <button onClick={goToToday}>Today</button>
                </div>
                <h3>{selectedDate.toDateString()}</h3>
            </div>
            <div>
                <div>
                    <span>{stats.totalMinutes} min planned</span>
                    <span>Load: {stats.cognitiveLoad}</span>
                    <span>{completedCount}/{tasks.length} completed</span>
                    {stats.completionRate > 0 && (
                        <span>{stats.completionRate}% complete</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlannerHeader;