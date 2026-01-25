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

    const getStreakEmoji = () => {
        return "🔥";
    };

    const getMotivationalMessage = () => {
        const messages = [
            "Ready to conquer today? 🚀",
            "Let's make today legendary! ⭐",
            "Your study adventure awaits! 🎯",
            "Time to level up your knowledge! 📚",
            "Today's quest board is ready! ⚔️"
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    };

    return (
        <div className="planner-header">
            <div className="player-profile">
                <div className="profile-info">
                    <h1 className="player-name">🎮 StudyMaster</h1>
                    <div className="player-stats">
                        <span className="level">Level 12 Scholar 📚</span>
                        <div className="xp-bar">
                            <div className="progress-bar">
                                <div className="progress-fill progress-xp" style={{width: '75%'}}></div>
                            </div>
                            <span className="xp-text">XP: 2,847/3,000</span>
                        </div>
                    </div>
                </div>
                <div className="player-currency">
                    <span className="streak">{getStreakEmoji()} 21-day streak</span>
                    <span className="gems">💎 1,250 gems</span>
                </div>
            </div>

            <div className="quest-board-header">
                <h2 className="motivational-message">{getMotivationalMessage()}</h2>
                <div className="date-navigation">
                    <button className="btn btn-secondary" onClick={goToPreviousDay}>
                        ← Previous
                    </button>
                    <input 
                        type="date" 
                        className="form-input date-picker"
                        value={formatDate(selectedDate)}
                        onChange={handleDateChange}
                    />
                    <button className="btn btn-secondary" onClick={goToNextDay}>
                        Next →
                    </button>
                    <button className="btn btn-primary" onClick={goToToday}>
                        Today
                    </button>
                </div>
                <h3 className="selected-date">{selectedDate.toDateString()}</h3>
            </div>

            <div className="daily-challenge">
                <div className="challenge-card">
                    <h3 className="challenge-title">🎯 Today's Mission</h3>
                    <p className="challenge-description">Complete 4 study sessions</p>
                    <div className="challenge-progress">
                        <div className="progress-bar">
                            <div 
                                className="progress-fill progress-streak" 
                                style={{width: `${(completedCount / Math.max(tasks.length, 1)) * 100}%`}}
                            ></div>
                        </div>
                        <span className="progress-text">{completedCount}/{tasks.length} completed</span>
                    </div>
                    <div className="challenge-reward">Reward: 50💎 + Bonus XP</div>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-value">{stats.totalMinutes}</div>
                    <div className="stat-label">⏱️ Minutes Planned</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{stats.cognitiveLoad}</div>
                    <div className="stat-label">🧠 Cognitive Load</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{completedCount}/{tasks.length}</div>
                    <div className="stat-label">✅ Completed</div>
                </div>
                {stats.completionRate > 0 && (
                    <div className="stat-card">
                        <div className="stat-value">{stats.completionRate}%</div>
                        <div className="stat-label">🎯 Success Rate</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlannerHeader;