import { formatDistanceToNow } from 'date-fns';

const ProgressLogList = ({ progressLogs }) => {
    if (!progressLogs || progressLogs.length === 0) {
        return (
            <div className="text-center py-8">
                <div className="text-gray-400 text-4xl mb-3">📝</div>
                <p className="text-gray-600">No progress logs yet</p>
                <p className="text-sm text-gray-500 mt-1">Start logging your progress to track your journey!</p>
            </div>
        );
    }

    const getMoodEmoji = (mood) => {
        const moods = {
            frustrated: '😤',
            neutral: '😐',
            satisfied: '😊',
            excited: '🎉'
        };
        return moods[mood] || '😐';
    };

    const getMoodColor = (mood) => {
        const colors = {
            frustrated: 'text-red-600 bg-red-50',
            neutral: 'text-gray-600 bg-gray-50',
            satisfied: 'text-green-600 bg-green-50',
            excited: 'text-yellow-600 bg-yellow-50'
        };
        return colors[mood] || colors.neutral;
    };

    const getProgressChangeColor = (before, after) => {
        if (after > before) return 'text-green-600';
        if (after < before) return 'text-red-600';
        return 'text-gray-600';
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress History</h3>
            
            <div className="space-y-3">
                {progressLogs.map((log, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getMoodColor(log.mood)}`}>
                                    <span className="text-sm">{getMoodEmoji(log.mood)}</span>
                                </div>
                                <div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm font-medium text-gray-900">
                                            Progress Update
                                        </span>
                                        <span className={`text-sm font-medium ${getProgressChangeColor(log.progressBefore, log.progressAfter)}`}>
                                            {log.progressBefore}% → {log.progressAfter}%
                                            {log.progressAfter !== log.progressBefore && (
                                                <span className="ml-1">
                                                    ({log.progressAfter > log.progressBefore ? '+' : ''}{log.progressAfter - log.progressBefore}%)
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {formatDistanceToNow(new Date(log.date), { addSuffix: true })}
                                        {log.timeSpent && (
                                            <span className="ml-2">• {log.timeSpent} minutes</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="ml-11">
                            <p className="text-gray-700 text-sm leading-relaxed">
                                {log.description}
                            </p>
                            
                            {/* Progress Bar */}
                            <div className="mt-3">
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                    <span>Progress</span>
                                    <span>{log.progressAfter}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${log.progressAfter}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProgressLogList;