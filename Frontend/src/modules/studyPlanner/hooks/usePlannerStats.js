import { useMemo } from "react";

const usePlannerStats = (tasks) => {
    const stats = useMemo(() => {
        if (!tasks || tasks.length === 0) {
            return {
                totalMinutes: 0,
                completedMinutes: 0,
                completionRate: 0,
                subjectDistribution: {},
                priorityDistribution: { Low: 0, Medium: 0, High: 0 }
            };
        }

        const totalMinutes = tasks.reduce((sum, task) => sum + task.duration, 0);
        const completedTasks = tasks.filter(task => task.status === "Completed");
        const completedMinutes = completedTasks.reduce((sum, task) => sum + (task.actualDuration || task.duration), 0);
        
        const completionRate = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;

        const subjectDistribution = tasks.reduce((acc, task) => {
            acc[task.subject] = (acc[task.subject] || 0) + task.duration;
            return acc;
        }, {});

        const priorityDistribution = tasks.reduce((acc, task) => {
            acc[task.priority] = (acc[task.priority] || 0) + 1;
            return acc;
        }, { Low: 0, Medium: 0, High: 0 });

        return {
            totalMinutes,
            completedMinutes,
            completionRate: Math.round(completionRate),
            subjectDistribution,
            priorityDistribution
        };
    }, [tasks]);

    return stats;
};

export default usePlannerStats;