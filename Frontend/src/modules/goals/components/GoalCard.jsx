import { useState } from 'react';
import ProgressBar from './ProgressBar';
import MilestoneList from './MilestoneList';
import { updateMilestone } from '../services/goals.api';

const GoalCard = ({ goal, onUpdate, onDelete, onViewDetails, onLogProgress }) => {
  const [showMilestones, setShowMilestones] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProgress, setEditedProgress] = useState(goal.progress);

  const handleProgressUpdate = () => {
    onUpdate(goal._id, { progress: editedProgress });
    setIsEditing(false);
  };

  const handleStatusChange = (newStatus) => {
    onUpdate(goal._id, { status: newStatus });
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this goal? This action cannot be undone.')) {
      if (onDelete) onDelete(goal._id);
    }
  };

  const handleMilestoneToggle = async (milestoneId, completed) => {
    try {
      await updateMilestone(goal._id, milestoneId, completed);
      if (onUpdate) {
        const updatedMilestones = goal.milestones.map(m => 
          m._id === milestoneId ? { ...m, completed, completedAt: completed ? new Date() : null } : m
        );
        const completedCount = updatedMilestones.filter(m => m.completed).length;
        const newProgress = Math.round((completedCount / updatedMilestones.length) * 100);
        onUpdate(goal._id, { milestones: updatedMilestones, progress: newProgress });
      }
    } catch (error) {
      alert('Failed to update milestone. Please try again.');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'academic': return 'bg-blue-100 text-blue-800';
      case 'personal': return 'bg-purple-100 text-purple-800';
      case 'career': return 'bg-green-100 text-green-800';
      case 'health': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isCompleted = goal.status === 'completed';
  const isOverdue = new Date(goal.targetDate) < new Date() && !isCompleted;

  return (
    <div className={`bg-white rounded-lg border-2 p-6 transition-all hover:shadow-lg ${
      isCompleted ? 'border-green-200 bg-green-50' : 
      isOverdue ? 'border-red-200 bg-red-50' : 
      'border-gray-200 hover:border-blue-300'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{goal.title}</h3>
          <p className="text-gray-600 text-sm mb-3">{goal.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(goal.priority)}`}>
              {goal.priority}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(goal.category)}`}>
              {goal.category}
            </span>
          </div>
        </div>
        
        {!isCompleted && (
          <div className="flex gap-1">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
              title="Edit progress"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => handleStatusChange('completed')}
              className="p-1.5 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors"
              title="Mark as completed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
              title="Delete goal"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="100"
                value={editedProgress}
                onChange={(e) => setEditedProgress(Number(e.target.value))}
                className="w-16 px-2 py-1 text-sm border rounded"
              />
              <span className="text-sm text-gray-500">%</span>
              <button
                onClick={handleProgressUpdate}
                className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          ) : (
            <span className="text-sm font-semibold text-gray-900">{goal.progress}%</span>
          )}
        </div>
        <ProgressBar progress={goal.progress} />
      </div>

      <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
        <span>Target: {new Date(goal.targetDate).toLocaleDateString()}</span>
        <div className="flex items-center space-x-2">
          {!isCompleted && onLogProgress && (
            <button
              onClick={() => onLogProgress(goal)}
              className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 font-medium text-xs transition-colors"
            >
              Log Progress
            </button>
          )}
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(goal._id)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View Details
            </button>
          )}
          {isOverdue && <span className="text-red-600 font-medium">Overdue</span>}
          {isCompleted && <span className="text-green-600 font-medium">Completed</span>}
        </div>
      </div>

      {goal.milestones && goal.milestones.length > 0 && (
        <div>
          <button
            onClick={() => setShowMilestones(!showMilestones)}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 mb-2"
          >
            <span>{showMilestones ? '▼' : '▶'}</span>
            {goal.milestones.length} milestone{goal.milestones.length !== 1 ? 's' : ''}
          </button>
          
          {showMilestones && (
            <MilestoneList
              milestones={goal.milestones}
              onToggle={handleMilestoneToggle}
              onUpdate={(milestones) => onUpdate(goal._id, { milestones })}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default GoalCard;