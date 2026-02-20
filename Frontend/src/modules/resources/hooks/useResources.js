import { useState, useEffect } from 'react';
import { getResources, getResourceStats } from '../services/resource.api';

const useResources = (filters = {}) => {
    const [resources, setResources] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchResources = async () => {
        setLoading(true);
        setError(null);
        try {
            const [resourceData, statsData] = await Promise.all([
                getResources(filters),
                getResourceStats()
            ]);
            setResources(resourceData.resources || []);
            setStats(statsData.stats);
        } catch (err) {
            console.error('Error fetching resources:', err);
            setError(err.message);
            setResources([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, [JSON.stringify(filters)]);

    const refetch = () => {
        fetchResources();
    };

    return { resources, stats, loading, error, refetch };
};

export default useResources;
