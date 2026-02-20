const TaskDetailModal = ({ task, onClose, onComplete, onUpdate, onDelete }) => {
    if (!task) return null;

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'bg-red-100 text-red-800 border-red-200';
            case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Low': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-start justify-between">
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{task.title}</h2>
                        <div className="flex items-center space-x-3">
                            <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)}`}>
                                {task.priority} Priority
                            </span>
                            {task.status === 'Completed' && (
                                <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 border border-green-200">
                                    ✓ Completed
                                </span>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Task Details */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                            <div className="flex items-center space-x-2 text-gray-900">
                                <span className="text-lg">📚</span>
                                <span className="font-medium">{task.subject}</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Duration</label>
                            <div className="flex items-center space-x-2 text-gray-900">
                                <span className="text-lg">⏱️</span>
                                <span className="font-medium">{task.duration} minutes</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Scheduled For</label>
                        <div className="flex items-center space-x-2 text-gray-900">
                            <span className="text-lg">📅</span>
                            <span className="font-medium">{formatDate(task.scheduledFor)}</span>
                        </div>
                    </div>

                    {task.status === 'Completed' && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-2">
                                <span className="text-green-600 text-xl">✓</span>
                                <span className="font-semibold text-green-900">Task Completed</span>
                            </div>
                            <div className="space-y-1 text-sm text-green-800">
                                {task.completedAt && (
                                    <div>Completed on: {formatDate(task.completedAt)} at {formatTime(task.completedAt)}</div>
                                )}
                                {task.actualDuration && (
                                    <div>Actual time spent: {task.actualDuration} minutes</div>
                                )}
                                {task.actualDuration && task.duration && (
                                    <div>
                                        {task.actualDuration <= task.duration ? (
                                            <span className="text-green-700 font-medium">
                                                ✓ Completed {task.duration - task.actualDuration} minutes ahead of schedule
                                            </span>
                                        ) : (
                                            <span className="text-orange-700 font-medium">
                                                Took {task.actualDuration - task.duration} minutes longer than planned
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Metadata */}
                    <div className="border-t border-gray-200 pt-4">
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                                <span className="font-medium">Created:</span> {formatDate(task.createdAt)}
                            </div>
                            <div>
                                <span className="font-medium">Last Updated:</span> {formatDate(task.updatedAt)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                {task.status !== 'Completed' && (
                    <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex items-center justify-end space-x-3">
                        <button
                            onClick={() => {
                                if (onDelete) onDelete(task._id);
                                onClose();
                            }}
                            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                        >
                            Delete Task
                        </button>
                        <button
                            onClick={() => {
                                if (onUpdate) onUpdate(task._id);
                                onClose();
                            }}
                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition-colors font-medium"
                        >
                            Edit Task
                        </button>
                        <button
                            onClick={() => {
                                if (onComplete) onComplete(task._id, task.duration);
                                onClose();
                            }}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-sm"
                        >
                            Mark as Complete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskDetailModal;
