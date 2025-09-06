
import { useState, useEffect, useCallback } from 'react';
import * as api from '../services/hubbardApiService';
import type { HubbardSession, ScheduledJob, LogEntry } from '../types';

export const useHubbardSessions = () => {
    const [sessions, setSessions] = useState<HubbardSession[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchSessions = useCallback(async () => {
        try {
            setLoading(true);
            const data = await api.getSessions();
            setSessions(data);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSessions();
    }, [fetchSessions]);

    return { sessions, loading, error, setSessions, refresh: fetchSessions };
};


export const useScheduledJobs = () => {
    const [jobs, setJobs] = useState<ScheduledJob[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await api.getScheduledJobs();
                setJobs(data);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    
    return { jobs, loading, error };
}


export const useLogs = () => {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await api.getLogs();
                setLogs(data);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    
    return { logs, loading, error };
}
