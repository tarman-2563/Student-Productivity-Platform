import { useState, useEffect } from 'react';
import { getGoals } from '../services/goals.api';

const useGoals = () => {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchGoals = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getGoals();
            setGoals(data.goals || []);
        } catch (err) {
            console.error('Error fetching goals:', err);
            setError(err.message);
            setGoals([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, []);

    const refetch = () => {
        fetchGoals();
    };

    return { goals, loading, error, refetch };
};

export default useGoals;