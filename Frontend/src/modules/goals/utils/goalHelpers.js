export const calculateGoalProgress = (milestones) => {
    if (!milestones || milestones.length === 0) return 0;
    const completedCount = milestones.filter(m => m.completed).length;
    return Math.round((completedCount / milestones.length) * 100);
};

export const isGoalOverdue = (targetDate, status) => {
    if (status === 'completed') return false;
    return new Date(targetDate) < new Date();
};

export const getDaysUntilTarget = (targetDate) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

export const getGoalStatusColor = (goal) => {
    if (goal.status === 'completed') return 'green';
    if (isGoalOverdue(goal.targetDate, goal.status)) return 'red';
    if (goal.progress >= 75) return 'blue';
    if (goal.progress >= 50) return 'yellow';
    return 'gray';
};

export const formatTargetDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = getDaysUntilTarget(dateString);
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    if (diffDays <= 7) return `In ${diffDays} days`;
    
    return date.toLocaleDateString();
};