import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Card } from '../ui/Card';
import { getServerMetrics } from '../../services/hubbardApiService';
import type { ServerMetrics } from '../../types';

interface ChartData extends ServerMetrics {
    time: string;
}

export const PerformanceView: React.FC = () => {
    const [data, setData] = useState<ChartData[]>([]);

    useEffect(() => {
        const interval = setInterval(async () => {
            const metrics = await getServerMetrics();
            const now = new Date();
            const newEntry = {
                ...metrics,
                time: `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`,
            };
            setData(prev => [...prev.slice(-20), newEntry]);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <Card title="Real-time Performance Metrics">
            <div className="h-80 w-full">
                <ResponsiveContainer>
                    <AreaChart
                        data={data}
                        margin={{
                            top: 5, right: 30, left: 0, bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                        <XAxis dataKey="time" stroke="#A0AEC0" />
                        <YAxis yAxisId="left" unit="%" stroke="#A0AEC0" />
                        <YAxis yAxisId="right" orientation="right" unit="ms" stroke="#A0AEC0" />
                        <Tooltip contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }} />
                        <Legend />
                        <Area yAxisId="left" type="monotone" dataKey="cpuUsage" name="CPU Usage" stroke="#4299E1" fill="#4299E1" fillOpacity={0.3} />
                        <Area yAxisId="right" type="monotone" dataKey="latency" name="Latency (ms)" stroke="#48BB78" fill="#48BB78" fillOpacity={0.3} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};
