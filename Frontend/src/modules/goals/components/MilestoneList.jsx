import { useState } from 'react';

const MilestoneList = ({ milestones, onToggle, onUpdate }) => {
  const [newMilestone, setNewMilestone] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleToggleMilestone = (index) => {
    const milestone = milestones[index];
    if (onToggle && milestone._id) {
      onToggle(milestone._id, !milestone.completed);
    } else {
      const updatedMilestones = milestones.map((milestone, i) =>
        i === index ? { ...milestone, completed: !milestone.completed } : milestone
      );
      onUpdate(updatedMilestones);
    }
  };

  const handleAddMilestone = () => {
    if (newMilestone.trim()) {
      const updatedMilestones = [
        ...milestones,
        { title: newMilestone.trim(), completed: false }
      ];
      onUpdate(updatedMilestones);
      setNewMilestone('');
      setShowAddForm(false);
    }
  };

  const handleDeleteMilestone = (index) => {
    const updatedMilestones = milestones.filter((_, i) => i !== index);
    onUpdate(updatedMilestones);
  };

  return (
    <div className="space-y-2">
      {milestones.map((milestone, index) => (
        <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
          <input
            type="checkbox"
            checked={milestone.completed}
            onChange={() => handleToggleMilestone(index)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <span className={`flex-1 text-sm ${
            milestone.completed ? 'line-through text-gray-500' : 'text-gray-700'
          }`}>
            {milestone.title}
          </span>
          <button
            onClick={() => handleDeleteMilestone(index)}
            className="text-red-400 hover:text-red-600 text-sm"
          >
            ×
          </button>
        </div>
      ))}
      
      {showAddForm ? (
        <div className="flex gap-2 p-2 bg-blue-50 rounded">
          <input
            type="text"
            value={newMilestone}
            onChange={(e) => setNewMilestone(e.target.value)}
            placeholder="New milestone..."
            className="flex-1 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <button
            onClick={handleAddMilestone}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            Add
          </button>
          <button
            onClick={() => setShowAddForm(false)}
            className="px-2 py-1 text-gray-500 text-sm hover:text-gray-700"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full p-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded border-2 border-dashed border-blue-200"
        >
          + Add milestone
        </button>
      )}
    </div>
  );
};

export default MilestoneList;