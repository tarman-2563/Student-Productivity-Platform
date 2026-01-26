import { formatDate } from "../utils/dateHelpers";

const PlannerHeader = ({ selectedDate, onDateChange, tasks, stats }) => {
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
        <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl mb-6 shadow-lg">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex-1 mb-4 md:mb-0">
                        <h1 className="text-2xl font-bold mb-2">🎮 StudyMaster</h1>
                        <div className="space-y-2">
                            <span className="block text-sm opacity-90">Level 12 Scholar 📚</span>
                            <div className="flex items-center space-x-3">
                                <div className="w-48 bg-white bg-opacity-20 rounded-full h-2">
                                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full" style={{width: '75%'}}></div>
                                </div>
                                <span className="text-xs opacity-80">XP: 2,847/3,000</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col space-y-2 text-right">
                        <span className="text-sm font-semibold px-3 py-1 bg-white bg-opacity-20 rounded-full">
                            {getStreakEmoji()} 21-day streak
                        </span>
                        <span className="text-sm font-semibold px-3 py-1 bg-white bg-opacity-20 rounded-full">
                            💎 1,250 gems
                        </span>
                    </div>
                </div>
            </div>

            <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-blue-600 mb-4">{getMotivationalMessage()}</h2>
                <div className="flex flex-wrap justify-center items-center gap-3 mb-4">
                    <button 
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                        onClick={goToPreviousDay}
                    >
                        ← Previous
                    </button>
                    <input 
                        type="date" 
                        className="px-3 py-2 border border-gray-300 rounded-md max-w-36 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={formatDate(selectedDate)}
                        onChange={handleDateChange}
                    />
                    <button 
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                        onClick={goToNextDay}
                    >
                        Next →
                    </button>
                    <button 
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                        onClick={goToToday}
                    >
                        Today
                    </button>
                </div>
                <h3 className="text-lg text-gray-600">{selectedDate.toDateString()}</h3>
            </div>

            <div className="mb-8">
                <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-300 rounded-lg p-6 text-center">
                    <h3 className="text-lg font-bold text-yellow-800 mb-2">🎯 Today's Mission</h3>
                    <p className="text-yellow-700 font-medium mb-4">Complete 4 study sessions</p>
                    <div className="mb-4">
                        <div className="w-full bg-white bg-opacity-50 rounded-full h-3 mb-2">
                            <div 
                                className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-300" 
                                style={{width: `${(completedCount / Math.max(tasks.length, 1)) * 100}%`}}
                            ></div>
                        </div>
                        <span className="text-sm font-semibold text-yellow-800">{completedCount}/{tasks.length} completed</span>
                    </div>
                    <div className="inline-block bg-white bg-opacity-50 px-3 py-1 rounded-full text-sm font-semibold text-yellow-800">
                        Reward: 50💎 + Bonus XP
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center shadow-sm">
                    <div className="text-2xl font-bold text-blue-600">{stats.totalMinutes}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">⏱️ Minutes Planned</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center shadow-sm">
                    <div className="text-2xl font-bold text-blue-600">{stats.cognitiveLoad}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">🧠 Cognitive Load</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center shadow-sm">
                    <div className="text-2xl font-bold text-blue-600">{completedCount}/{tasks.length}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">✅ Completed</div>
                </div>
                {stats.completionRate > 0 && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4 text-center shadow-sm">
                        <div className="text-2xl font-bold text-blue-600">{stats.completionRate}%</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">🎯 Success Rate</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlannerHeader;