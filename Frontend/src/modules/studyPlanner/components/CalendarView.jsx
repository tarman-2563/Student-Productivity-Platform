import { useState, useEffect } from 'react';
import { getDailyTasks } from '../services/studyTask.api';

const CalendarView = ({ onDateSelect, onTaskClick }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState('month'); // 'month' or 'week'
    const [tasksMap, setTasksMap] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchMonthTasks();
    }, [currentDate, view]);

    const fetchMonthTasks = async () => {
        setLoading(true);
        try {
            const startDate = view === 'month' 
                ? new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
                : getWeekStart(currentDate);
            
            const endDate = view === 'month'
                ? new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
                : getWeekEnd(currentDate);

            const tasksData = {};
            const currentDateIter = new Date(startDate);

            while (currentDateIter <= endDate) {
                try {
                    const data = await getDailyTasks(new Date(currentDateIter));
                    const dateKey = currentDateIter.toISOString().split('T')[0];
                    tasksData[dateKey] = data.tasks || [];
                } catch (err) {
                    console.error('Error fetching tasks for date:', currentDateIter, err);
                }
                currentDateIter.setDate(currentDateIter.getDate() + 1);
            }

            setTasksMap(tasksData);
        } catch (err) {
            console.error('Error fetching month tasks:', err);
        } finally {
            setLoading(false);
        }
    };

    const getWeekStart = (date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day;
        return new Date(d.setDate(diff));
    };

    const getWeekEnd = (date) => {
        const start = getWeekStart(date);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        return end;
    };

    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const goToPreviousWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() - 7);
        setCurrentDate(newDate);
    };

    const goToNextWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + 7);
        setCurrentDate(newDate);
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const handleDateClick = (date) => {
        if (onDateSelect) {
            onDateSelect(date);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {currentDate.toLocaleDateString('en-US', { 
                                month: 'long', 
                                year: 'numeric' 
                            })}
                        </h2>
                        <button
                            onClick={goToToday}
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Today
                        </button>
                    </div>

                    <div className="flex items-center space-x-3">
                        {/* View Toggle */}
                        <div className="flex bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setView('month')}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                    view === 'month'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Month
                            </button>
                            <button
                                onClick={() => setView('week')}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                    view === 'week'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Week
                            </button>
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={view === 'month' ? goToPreviousMonth : goToPreviousWeek}
                                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                            >
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={view === 'month' ? goToNextMonth : goToNextWeek}
                                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                            >
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-600">Today</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-gray-600">Has Tasks</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                        <span className="text-gray-600">No Tasks</span>
                    </div>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="p-6">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-3 text-gray-600">Loading calendar...</span>
                    </div>
                ) : view === 'month' ? (
                    <MonthView 
                        currentDate={currentDate}
                        tasksMap={tasksMap}
                        onDateClick={handleDateClick}
                        onTaskClick={onTaskClick}
                    />
                ) : (
                    <WeekView 
                        currentDate={currentDate}
                        tasksMap={tasksMap}
                        onDateClick={handleDateClick}
                        onTaskClick={onTaskClick}
                    />
                )}
            </div>
        </div>
    );
};

// Month View Component
const MonthView = ({ currentDate, tasksMap, onDateClick, onTaskClick }) => {
    const getDaysInMonth = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];
        
        // Previous month days
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            days.push({
                date: new Date(year, month - 1, prevMonthLastDay - i),
                isCurrentMonth: false
            });
        }

        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                date: new Date(year, month, i),
                isCurrentMonth: true
            });
        }

        // Next month days
        const remainingDays = 42 - days.length; // 6 rows * 7 days
        for (let i = 1; i <= remainingDays; i++) {
            days.push({
                date: new Date(year, month + 1, i),
                isCurrentMonth: false
            });
        }

        return days;
    };

    const days = getDaysInMonth();
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();

    return (
        <div>
            {/* Week day headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
                {weekDays.map(day => (
                    <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-2">
                {days.map((day, index) => {
                    const dateKey = day.date.toISOString().split('T')[0];
                    const dayTasks = tasksMap[dateKey] || [];
                    const isToday = day.date.toDateString() === today.toDateString();
                    const completedTasks = dayTasks.filter(t => t.status === 'Completed').length;

                    return (
                        <CalendarDay
                            key={index}
                            day={day}
                            isToday={isToday}
                            tasks={dayTasks}
                            completedTasks={completedTasks}
                            onDateClick={onDateClick}
                            onTaskClick={onTaskClick}
                        />
                    );
                })}
            </div>
        </div>
    );
};

// Week View Component
const WeekView = ({ currentDate, tasksMap, onDateClick, onTaskClick }) => {
    const getWeekDays = () => {
        const startOfWeek = new Date(currentDate);
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day;
        startOfWeek.setDate(diff);

        const days = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            days.push(date);
        }
        return days;
    };

    const weekDays = getWeekDays();
    const today = new Date();

    return (
        <div className="grid grid-cols-7 gap-4">
            {weekDays.map((date, index) => {
                const dateKey = date.toISOString().split('T')[0];
                const dayTasks = tasksMap[dateKey] || [];
                const isToday = date.toDateString() === today.toDateString();
                const completedTasks = dayTasks.filter(t => t.status === 'Completed').length;

                return (
                    <div key={index} className="flex flex-col">
                        <div className={`text-center p-3 rounded-t-lg ${
                            isToday ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'
                        }`}>
                            <div className="text-xs font-medium">
                                {date.toLocaleDateString('en-US', { weekday: 'short' })}
                            </div>
                            <div className="text-2xl font-bold mt-1">
                                {date.getDate()}
                            </div>
                        </div>
                        <div 
                            className="flex-1 border border-t-0 border-gray-200 rounded-b-lg p-3 min-h-[300px] hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => onDateClick(date)}
                        >
                            <div className="space-y-2">
                                {dayTasks.length === 0 ? (
                                    <div className="text-center text-gray-400 text-sm py-8">
                                        No tasks
                                    </div>
                                ) : (
                                    <>
                                        {dayTasks.slice(0, 4).map((task, idx) => (
                                            <WeekTaskCard 
                                                key={task._id || idx} 
                                                task={task}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (onTaskClick) onTaskClick(task);
                                                }}
                                            />
                                        ))}
                                        {dayTasks.length > 4 && (
                                            <div className="text-xs text-gray-500 text-center py-1">
                                                +{dayTasks.length - 4} more
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                            {dayTasks.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-600 text-center">
                                    {completedTasks}/{dayTasks.length} completed
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// Calendar Day Component
const CalendarDay = ({ day, isToday, tasks, completedTasks, onDateClick, onTaskClick }) => {
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'bg-red-500';
            case 'Medium': return 'bg-yellow-500';
            case 'Low': return 'bg-green-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div
            onClick={() => onDateClick(day.date)}
            className={`min-h-[120px] p-2 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                !day.isCurrentMonth 
                    ? 'bg-gray-50 text-gray-400' 
                    : isToday 
                    ? 'bg-blue-50 border-blue-500 border-2' 
                    : tasks.length > 0
                    ? 'bg-white border-green-200 hover:border-green-400'
                    : 'bg-white border-gray-200 hover:border-gray-400'
            }`}
        >
            <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-semibold ${
                    isToday ? 'text-blue-600' : day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                }`}>
                    {day.date.getDate()}
                </span>
                {tasks.length > 0 && (
                    <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                        {tasks.length}
                    </span>
                )}
            </div>

            <div className="space-y-1">
                {tasks.slice(0, 3).map((task, idx) => (
                    <div
                        key={task._id || idx}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onTaskClick) onTaskClick(task);
                        }}
                        className={`text-xs p-1 rounded truncate hover:bg-gray-100 ${
                            task.status === 'Completed' ? 'line-through text-gray-500' : 'text-gray-700'
                        }`}
                        title={task.title}
                    >
                        <div className="flex items-center space-x-1">
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${getPriorityColor(task.priority)}`}></div>
                            <span className="truncate">{task.title}</span>
                        </div>
                    </div>
                ))}
                {tasks.length > 3 && (
                    <div className="text-xs text-gray-500 text-center">
                        +{tasks.length - 3} more
                    </div>
                )}
            </div>

            {tasks.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                    <div className="text-xs text-gray-600">
                        {completedTasks}/{tasks.length} done
                    </div>
                </div>
            )}
        </div>
    );
};

// Week Task Card Component
const WeekTaskCard = ({ task, onClick }) => {
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'border-red-500 bg-red-50';
            case 'Medium': return 'border-yellow-500 bg-yellow-50';
            case 'Low': return 'border-green-500 bg-green-50';
            default: return 'border-gray-300 bg-gray-50';
        }
    };

    return (
        <div
            onClick={onClick}
            className={`p-2 border-l-4 rounded text-xs hover:shadow-sm transition-all cursor-pointer ${
                getPriorityColor(task.priority)
            } ${task.status === 'Completed' ? 'opacity-60' : ''}`}
        >
            <div className={`font-medium truncate ${
                task.status === 'Completed' ? 'line-through text-gray-500' : 'text-gray-900'
            }`}>
                {task.title}
            </div>
            <div className="text-gray-600 mt-1 flex items-center justify-between">
                <span>{task.subject}</span>
                <span>{task.duration}m</span>
            </div>
        </div>
    );
};

export default CalendarView;
