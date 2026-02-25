import { useState } from "react";
import useDailyTasks from "../hooks/useDailyTasks";
import { createStudyTask, completeStudyTask, updateStudyTask, deleteStudyTask } from "../services/studyTask.api";
import { formatDate } from "../utils/dateHelpers";
import CalendarView from "../components/CalendarView";
import TaskDetailModal from "../components/TaskDetailModal";

const DailyPlanner = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [viewMode, setViewMode] = useState('list'); 
    const [selectedTask, setSelectedTask] = useState(null);
    const { tasks, stats, loading, error, refetch } = useDailyTasks(selectedDate);

    const handleDateChange = (e) => {
        setSelectedDate(new Date(e.target.value));
    };

    const goToPreviousDay = () => {
        const previousDay = new Date(selectedDate);
        previousDay.setDate(previousDay.getDate() - 1);
        setSelectedDate(previousDay);
    };

    const goToNextDay = () => {
        const nextDay = new Date(selectedDate);
        nextDay.setDate(nextDay.getDate() + 1);
        setSelectedDate(nextDay);
    };

    const goToToday = () => {
        setSelectedDate(new Date());
    };

    const handleCreateTask = async (taskData) => {
        try {
            await createStudyTask({
                ...taskData,
                scheduledFor: selectedDate
            });
            refetch();
        } catch (err) {
            console.error('Failed to create task:', err);
            alert('Failed to create task. Please try again.');
        }
    };

    const handleCompleteTask = async (taskId, actualDuration) => {
        try {
            await completeStudyTask(taskId, actualDuration);
            refetch();
        } catch (err) {
            console.error('Failed to complete task:', err);
            alert('Failed to complete task. Please try again.');
        }
    };

    const handleUpdateTask = async (taskId, taskData) => {
        try {
            await updateStudyTask(taskId, taskData);
            refetch();
        } catch (err) {
            console.error('Failed to update task:', err);
            alert('Failed to update task. Please try again.');
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await deleteStudyTask(taskId);
                refetch();
            } catch (err) {
                console.error('Failed to delete task:', err);
                alert('Failed to delete task. Please try again.');
            }
        }
    };

    const completedCount = tasks.filter(t => t.status === "Completed").length;
    const isToday = selectedDate.toDateString() === new Date().toDateString();

    const handleCalendarDateSelect = (date) => {
        setSelectedDate(date);
        setViewMode('list'); 
    };

    const handleTaskClick = (task) => {
        setSelectedTask(task);
    };

    const handleCloseTaskModal = () => {
        setSelectedTask(null);
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Study Planner</h1>
                    <p className="text-gray-600 text-sm mt-1">Plan and track your study schedule</p>
                </div>
                <div className="flex bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            viewMode === 'list'
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        <span>List View</span>
                    </button>
                    <button
                        onClick={() => setViewMode('calendar')}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            viewMode === 'calendar'
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Calendar View</span>
                    </button>
                </div>
            </div>

            {viewMode === 'calendar' ? (
                <CalendarView 
                    onDateSelect={handleCalendarDateSelect}
                    onTaskClick={handleTaskClick}
                />
            ) : (
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center space-x-3 mb-4 sm:mb-0">
                    <button 
                        className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-md transition-colors"
                        onClick={goToPreviousDay}
                    >
                        ←
                    </button>
                    <input 
                        type="date" 
                        className="px-3 py-2 border border-gray-300 rounded-md text-center font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={formatDate(selectedDate)}
                        onChange={handleDateChange}
                    />
                    <button 
                        className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-md transition-colors"
                        onClick={goToNextDay}
                    >
                        →
                    </button>
                    {!isToday && (
                        <button 
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
                            onClick={goToToday}
                        >
                            Today
                        </button>
                    )}
                </div>
                
                <div className="flex space-x-8">
                    <div className="text-center">
                        <div className="text-xl font-bold text-blue-600">{stats.totalMinutes}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">min planned</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xl font-bold text-blue-600">{completedCount}/{tasks.length}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">completed</div>
                    </div>
                    {tasks.length > 0 && (
                        <div className="text-center">
                            <div className="text-xl font-bold text-blue-600">{stats.completionRate}%</div>
                            <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">success rate</div>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="flex flex-col justify-between items-start p-6 border-b border-gray-100 bg-gray-50">
                    <div className="flex justify-between items-center w-full mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Tasks for {selectedDate.toLocaleDateString()}
                        </h3>
                    </div>
                    <CreateTaskForm onCreateTask={handleCreateTask} />
                </div>
                
                <div className="p-6">
                    {loading ? (
                        <div className="text-center py-16 text-gray-500">
                            <div className="inline-block w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mr-3"></div>
                            Loading tasks...
                        </div>
                    ) : error ? (
                        <div className="text-center py-16">
                            <div className="text-red-500 text-4xl mb-4">⚠️</div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Failed to load tasks</h4>
                            <p className="text-gray-600 mb-6">Please try again.</p>
                            <button 
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
                                onClick={refetch}
                            >
                                Retry
                            </button>
                        </div>
                    ) : tasks.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="text-6xl mb-4 opacity-50">📚</div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No tasks planned</h3>
                            <p className="text-gray-600">Add your first task to get started</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {tasks.map((task) => (
                                <TaskCard 
                                    key={task._id} 
                                    task={task} 
                                    onComplete={handleCompleteTask}
                                    onUpdate={handleUpdateTask}
                                    onDelete={handleDeleteTask}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
            )}

            {selectedTask && (
                <TaskDetailModal
                    task={selectedTask}
                    onClose={handleCloseTaskModal}
                    onComplete={handleCompleteTask}
                    onDelete={handleDeleteTask}
                />
            )}
        </div>
    );
};

const CreateTaskForm = ({ onCreateTask }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        subject: '',
        duration: '',
        priority: 'Medium'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.subject.trim() || !formData.duration) {
            alert('Please fill in all fields');
            return;
        }
        
        setIsSubmitting(true);
        try {
            await onCreateTask({
                ...formData,
                title: formData.title.trim(),
                subject: formData.subject.trim(),
                duration: Number(formData.duration)
            });
            
            setFormData({ title: '', subject: '', duration: '', priority: 'Medium' });
            setIsOpen(false);
        } catch (err) {
            console.error('Error creating task:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) {
        return (
            <button 
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center space-x-2 shadow-sm"
                onClick={() => setIsOpen(true)}
            >
                <span className="text-lg">+</span>
                <span>Add New Task</span>
            </button>
        );
    }

    return (
        <div className="w-full max-w-2xl">
            <form className="bg-white border border-gray-200 rounded-lg shadow-sm p-6" onSubmit={handleSubmit}>
                <div className="flex items-center justify-between mb-6">
                    <h4 className="text-lg font-semibold text-gray-900">Create New Study Task</h4>
                    <button 
                        type="button" 
                        className="text-gray-400 hover:text-gray-600 text-xl"
                        onClick={() => setIsOpen(false)}
                    >
                        ×
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            What will you study? *
                        </label>
                        <input
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                            placeholder="e.g., Review calculus chapter 5, Practice Spanish vocabulary..."
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Subject *
                            </label>
                            <input
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                                placeholder="e.g., Mathematics, History, Programming..."
                                value={formData.subject}
                                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Duration (minutes) *
                            </label>
                            <input
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                                type="number"
                                placeholder="30"
                                min="10"
                                max="480"
                                value={formData.duration}
                                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Priority Level
                        </label>
                        <div className="flex space-x-3">
                            {['Low', 'Medium', 'High'].map((priority) => (
                                <label key={priority} className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="priority"
                                        value={priority}
                                        checked={formData.priority === priority}
                                        onChange={(e) => setFormData({...formData, priority: e.target.value})}
                                        className="sr-only"
                                    />
                                    <div className={`px-4 py-2 rounded-lg border-2 transition-all ${
                                        formData.priority === priority
                                            ? priority === 'High' 
                                                ? 'border-red-500 bg-red-50 text-red-700'
                                                : priority === 'Medium'
                                                ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                                                : 'border-green-500 bg-green-50 text-green-700'
                                            : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                                    }`}>
                                        <div className="flex items-center space-x-2">
                                            <div className={`w-2 h-2 rounded-full ${
                                                priority === 'High' ? 'bg-red-500' :
                                                priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                                            }`}></div>
                                            <span className="text-sm font-medium">{priority}</span>
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100">
                    <button 
                        type="button" 
                        className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center space-x-2">
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                <span>Creating...</span>
                            </span>
                        ) : (
                            'Create Task'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

const TaskCard = ({ task, onComplete, onUpdate, onDelete }) => {
    const [showComplete, setShowComplete] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [actualDuration, setActualDuration] = useState(task.duration);
    const [isCompleting, setIsCompleting] = useState(false);
    const [editData, setEditData] = useState({
        title: task.title,
        subject: task.subject,
        duration: task.duration,
        priority: task.priority
    });

    const handleComplete = async () => {
        setIsCompleting(true);
        try {
            await onComplete(task._id, actualDuration);
            setShowComplete(false);
        } catch (err) {
            console.error('Error completing task:', err);
        } finally {
            setIsCompleting(false);
        }
    };

    const handleUpdate = async () => {
        try {
            await onUpdate(task._id, editData);
            setShowEdit(false);
        } catch (err) {
            console.error('Error updating task:', err);
        }
    };

    const handleDelete = () => {
        onDelete(task._id);
    };

    const isCompleted = task.status === "Completed";

    const getPriorityColor = () => {
        switch (task.priority) {
            case 'High': return 'border-l-red-500';
            case 'Medium': return 'border-l-yellow-500';
            case 'Low': return 'border-l-green-500';
            default: return 'border-l-gray-300';
        }
    };

    const getPriorityBadgeColor = () => {
        switch (task.priority) {
            case 'High': return 'bg-red-100 text-red-800';
            case 'Medium': return 'bg-yellow-100 text-yellow-800';
            case 'Low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className={`border border-gray-200 rounded-lg transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 border-l-4 ${getPriorityColor()} ${
            isCompleted ? 'bg-gradient-to-r from-green-50 to-green-25 border-green-200' : 'bg-white'
        }`}>
            <div className="flex justify-between items-start p-4">
                <div className="flex-1 min-w-0">
                    <h4 className={`text-base font-semibold mb-1 ${
                        isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'
                    }`}>
                        {task.title}
                    </h4>
                    <p className="text-sm text-gray-600 font-medium">{task.subject}</p>
                </div>
                <div className="flex items-center space-x-3 ml-4">
                    <div className="text-sm font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded-full min-w-12 text-center">
                        {task.duration}min
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityBadgeColor()}`}>
                        {task.priority}
                    </span>
                    {!isCompleted && (
                        <div className="flex space-x-1">
                            <button
                                onClick={() => setShowEdit(true)}
                                className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                                title="Edit task"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                            <button
                                onClick={handleDelete}
                                className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                title="Delete task"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>
            
            {showEdit && !isCompleted && (
                <div className="px-4 pb-4 border-t border-gray-100 bg-blue-50">
                    <div className="mt-3 space-y-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Task Title</label>
                            <input
                                type="text"
                                value={editData.title}
                                onChange={(e) => setEditData({...editData, title: e.target.value})}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Subject</label>
                                <input
                                    type="text"
                                    value={editData.subject}
                                    onChange={(e) => setEditData({...editData, subject: e.target.value})}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Duration (min)</label>
                                <input
                                    type="number"
                                    value={editData.duration}
                                    onChange={(e) => setEditData({...editData, duration: Number(e.target.value)})}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    min="10"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Priority</label>
                                <select
                                    value={editData.priority}
                                    onChange={(e) => setEditData({...editData, priority: e.target.value})}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex space-x-2 pt-2">
                            <button
                                onClick={handleUpdate}
                                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => setShowEdit(false)}
                                className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {!isCompleted && !showComplete && !showEdit && (
                <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50">
                    <button 
                        className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
                        onClick={() => setShowComplete(true)}
                    >
                        Complete
                    </button>
                </div>
            )}
            
            {showComplete && (
                <div className="px-4 pb-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
                    <div className="mt-3">
                        <div className="mb-3">
                            <h5 className="text-sm font-semibold text-gray-900 mb-1">How long did it actually take?</h5>
                            <p className="text-xs text-gray-600">Enter the actual time spent studying</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <label className="flex items-center space-x-2 text-sm text-gray-600 font-medium">
                                <span>Actual time:</span>
                                <input
                                    type="number"
                                    className="w-16 px-2 py-1 border border-gray-300 rounded text-center font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    min="1"
                                    value={actualDuration}
                                    onChange={(e) => setActualDuration(Number(e.target.value))}
                                />
                                <span>min</span>
                            </label>
                            <button 
                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleComplete}
                                disabled={isCompleting}
                            >
                                {isCompleting ? 'Completing...' : 'Done'}
                            </button>
                            <button 
                                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded transition-colors"
                                onClick={() => setShowComplete(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {isCompleted && (
                <div className="px-4 pb-4 border-t border-green-200 bg-gradient-to-r from-green-50 to-green-25">
                    <div className="mt-3 flex items-center space-x-2 text-green-700 text-sm font-semibold">
                        <div className="w-4 h-4 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">
                            ✓
                        </div>
                        <span>Completed in {task.actualDuration || task.duration} minutes</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DailyPlanner;