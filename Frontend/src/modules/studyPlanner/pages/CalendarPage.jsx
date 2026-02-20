import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, List, Plus } from 'lucide-react';
import CalendarView from '../components/CalendarView';
import StudyTaskCard from '../components/StudyTaskCard';
import CreateTaskInline from '../components/CreateTaskInline';
import axios from '../../../api/axios';

const CalendarPage = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState(null);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'

  useEffect(() => {
    fetchMonthTasks();
  }, [selectedDate]);

  const fetchMonthTasks = async () => {
    try {
      setLoading(true);
      const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
      const endOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
      
      // Fetch tasks for the entire month
      const promises = [];
      for (let d = new Date(startOfMonth); d <= endOfMonth; d.setDate(d.getDate() + 1)) {
        const dateStr = new Date(d).toISOString().split('T')[0];
        promises.push(axios.get(`/study-tasks?date=${dateStr}`));
      }

      const responses = await Promise.allSettled(promises);
      const allTasks = [];
      
      responses.forEach(response => {
        if (response.status === 'fulfilled') {
          const data = response.value.data;
          const tasksArray = Array.isArray(data) ? data : data.tasks || [];
          allTasks.push(...tasksArray);
        }
      });

      setTasks(allTasks);
    } catch (error) {
      console.error('Error fetching month tasks:', error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setShowCreateTask(false);
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const handleTaskCreated = () => {
    setShowCreateTask(false);
    fetchMonthTasks();
  };

  const handleTaskUpdated = () => {
    fetchMonthTasks();
    setSelectedTask(null);
  };

  const handleTaskDeleted = () => {
    fetchMonthTasks();
    setSelectedTask(null);
  };

  const getSelectedDateTasks = () => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    return tasks.filter(task => {
      const taskDate = new Date(task.scheduledFor).toISOString().split('T')[0];
      return taskDate === dateStr;
    });
  };

  const selectedDateTasks = getSelectedDateTasks();

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'Completed').length;
    const pending = total - completed;
    const totalMinutes = tasks.reduce((sum, t) => sum + (t.duration || 0), 0);
    
    return { total, completed, pending, totalMinutes };
  };

  const stats = getTaskStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-soft p-4">
            <div className="text-sm text-gray-600 mb-1">Total Tasks</div>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-white rounded-lg shadow-soft p-4">
            <div className="text-sm text-gray-600 mb-1">Completed</div>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </div>
          <div className="bg-white rounded-lg shadow-soft p-4">
            <div className="text-sm text-gray-600 mb-1">Pending</div>
            <div className="text-2xl font-bold text-blue-600">{stats.pending}</div>
          </div>
          <div className="bg-white rounded-lg shadow-soft p-4">
            <div className="text-sm text-gray-600 mb-1">Total Time</div>
            <div className="text-2xl font-bold text-purple-600">
              {Math.floor(stats.totalMinutes / 60)}h {stats.totalMinutes % 60}m
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar View */}
          <div className="lg:col-span-2">
            <CalendarView
              tasks={tasks}
              onDateSelect={handleDateSelect}
              onTaskClick={handleTaskClick}
            />
          </div>

          {/* Selected Date Tasks */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'short',
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </h3>
                <p className="text-sm text-gray-500">
                  {selectedDateTasks.length} task{selectedDateTasks.length !== 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={() => setShowCreateTask(!showCreateTask)}
                className="btn btn-sm btn-primary"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {showCreateTask && (
              <div className="mb-4">
                <CreateTaskInline
                  initialDate={selectedDate}
                  onTaskCreated={handleTaskCreated}
                  onCancel={() => setShowCreateTask(false)}
                />
              </div>
            )}

            <div className="space-y-3 max-h-[600px] overflow-y-auto scrollbar-thin">
              {selectedDateTasks.length > 0 ? (
                selectedDateTasks.map((task) => (
                  <StudyTaskCard
                    key={task._id}
                    task={task}
                    onUpdate={handleTaskUpdated}
                    onDelete={handleTaskDeleted}
                    onClick={() => handleTaskClick(task)}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="text-4xl mb-3 opacity-50">📅</div>
                  <p className="text-gray-500 text-sm mb-3">No tasks for this day</p>
                  <button
                    onClick={() => setShowCreateTask(true)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline"
                  >
                    Create your first task
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Task Detail Modal */}
        {selectedTask && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedTask(null)}
          >
            <div 
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {selectedTask.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(selectedTask.scheduledFor).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">📚 Subject:</span>
                  <span className="font-medium">{selectedTask.subject}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">⏱️ Duration:</span>
                  <span className="font-medium">{selectedTask.duration} minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">🎯 Priority:</span>
                  <span className={`px-2 py-1 rounded text-sm font-medium ${
                    selectedTask.priority === 'High' ? 'bg-red-100 text-red-700' :
                    selectedTask.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {selectedTask.priority}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">📊 Status:</span>
                  <span className={`px-2 py-1 rounded text-sm font-medium ${
                    selectedTask.status === 'Completed' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {selectedTask.status}
                  </span>
                </div>
                {selectedTask.completedAt && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">✅ Completed:</span>
                    <span className="font-medium">
                      {new Date(selectedTask.completedAt).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-6 flex gap-2">
                <button
                  onClick={() => setSelectedTask(null)}
                  className="btn btn-secondary flex-1"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarPage;
