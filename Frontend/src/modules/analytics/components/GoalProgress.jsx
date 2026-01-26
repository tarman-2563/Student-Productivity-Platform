import { CheckCircle, Circle, Clock, Target } from '../utils/iconComponents.jsx';
import { formatPercentage } from '../utils/analyticsHelpers';

const GoalProgress = ({ goals }) => {
  if (!goals || goals.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <Target className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>No goals to track</p>
          <p className="text-sm mt-1">Create your first goal to see progress here</p>
        </div>
      </div>
    );
  }

  const completedGoals = goals.filter(goal => goal.status === 'completed').length;
  const overallProgress = goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length;

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-900 mb-1">
          {completedGoals}/{goals.length}
        </div>
        <div className="text-sm text-gray-600 mb-3">Goals Completed</div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {formatPercentage(overallProgress)} overall progress
        </div>
      </div>

      {/* Individual Goals */}
      <div className="space-y-3 max-h-48 overflow-y-auto">
        {goals.map((goal, index) => (
          <GoalProgressItem key={goal.id || index} goal={goal} />
        ))}
      </div>
    </div>
  );
};

const GoalProgressItem = ({ goal }) => {
  const isCompleted = goal.status === 'completed';
  const isOverdue = goal.isOverdue && !isCompleted;
  
  const getStatusColor = () => {
    if (isCompleted) return 'text-green-600';
    if (isOverdue) return 'text-red-600';
    if (goal.progress >= 75) return 'text-blue-600';
    if (goal.progress >= 50) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getProgressBarColor = () => {
    if (isCompleted) return 'bg-green-500';
    if (isOverdue) return 'bg-red-500';
    if (goal.progress >= 75) return 'bg-blue-500';
    if (goal.progress >= 50) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      {/* Status Icon */}
      <div className={getStatusColor()}>
        {isCompleted ? (
          <CheckCircle className="w-5 h-5" />
        ) : (
          <Circle className="w-5 h-5" />
        )}
      </div>

      {/* Goal Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className={`text-sm font-medium truncate ${
            isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'
          }`}>
            {goal.title}
          </h4>
          <div className="flex items-center space-x-2 ml-2">
            {goal.priority && (
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(goal.priority)}`}>
                {goal.priority}
              </span>
            )}
            {isOverdue && (
              <div className="flex items-center text-red-600">
                <Clock className="w-3 h-3 mr-1" />
                <span className="text-xs">Overdue</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-gray-200 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full transition-all duration-500 ${getProgressBarColor()}`}
              style={{ width: `${goal.progress}%` }}
            ></div>
          </div>
          <span className={`text-xs font-medium ${getStatusColor()}`}>
            {formatPercentage(goal.progress)}
          </span>
        </div>

        {/* Goal Details */}
        <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
          <span>{goal.category}</span>
          {goal.targetDate && (
            <span>Due: {new Date(goal.targetDate).toLocaleDateString()}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalProgress;