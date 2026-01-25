import { useEffect, useState } from "react";
import { getDailyTasks } from "../services/studyTask.api";
import usePlannerStats from "./usePlannerStats";

const useDailyTasks = (date) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const stats = usePlannerStats(tasks);

    useEffect(() => {
        const fetchTasks = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getDailyTasks(date);
                setTasks(data.tasks || []);
            } catch (err) {
                console.error("Failed to fetch daily tasks", err);
                setError(err.message);
                setTasks([]);
            } finally {
                setLoading(false);
            }
        };
        
        fetchTasks();
    }, [date]);

    const refetch = () => {
        const fetchTasks = async () => {
            setLoading(true);
            try {
                const data = await getDailyTasks(date);
                setTasks(data.tasks || []);
            } catch (err) {
                console.error("Failed to fetch daily tasks", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    };

    return { tasks, stats, loading, error, refetch };
};

export default useDailyTasks;