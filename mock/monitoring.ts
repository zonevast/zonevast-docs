export interface SystemLog {
    id: string;
    level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
    time: string;
    message: string;
}

export interface ServiceStatus {
    name: string;
    status: 'healthy' | 'degraded' | 'down';
}

export const INITIAL_LOGS: SystemLog[] = [
    { id: 'l1', level: 'INFO', time: '10:42:01', message: "Service 'Auth' health check passed" },
    { id: 'l2', level: 'DEBUG', time: '10:42:05', message: "Processing request ID #8x92a" },
    { id: 'l3', level: 'WARN', time: '10:42:12', message: "High latency detected on db-shard-02 (205ms)" },
    { id: 'l4', level: 'INFO', time: '10:42:15', message: "Deployment triggered by user_82x" },
    { id: 'l5', level: 'DEBUG', time: '10:42:18', message: "Cache invalidated for key: /api/products" }
];

export const INITIAL_SERVICES: ServiceStatus[] = [
    { name: 'Auth Service', status: 'healthy' },
    { name: 'Database', status: 'healthy' },
    { name: 'Cache Layer', status: 'healthy' },
    { name: 'CDN', status: 'healthy' }
];