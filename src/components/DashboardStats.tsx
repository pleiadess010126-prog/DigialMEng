'use client';

import { TrendingUp, TrendingDown, BarChart3, Users, Clock, FileText } from 'lucide-react';
import { Campaign } from '@/types';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface StatsCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    change?: number;
    trend?: 'up' | 'down' | 'neutral';
    suffix?: string;
    sparklineData?: number[];
}

function StatsCard({ icon, label, value, change, trend, suffix, sparklineData }: StatsCardProps) {
    return (
        <div className="metric-card group">
            <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                    {icon}
                </div>
                {change !== undefined && (
                    <div className={`flex items-center gap-1 ${trend === 'up' ? 'text-success' : trend === 'down' ? 'text-destructive' : 'text-muted-foreground'
                        }`}>
                        {trend === 'up' ? (
                            <TrendingUp className="w-4 h-4" />
                        ) : trend === 'down' ? (
                            <TrendingDown className="w-4 h-4" />
                        ) : null}
                        <span className="text-sm font-semibold">
                            {change > 0 ? '+' : ''}{change}%
                        </span>
                    </div>
                )}
            </div>

            <div className="space-y-1">
                <p className="metric-label">{label}</p>
                <div className="flex items-baseline gap-1">
                    <p className="metric-value">
                        {typeof value === 'number' ? value.toLocaleString() : value}
                    </p>
                    {suffix && <span className="text-lg text-muted-foreground">{suffix}</span>}
                </div>
            </div>

            {sparklineData && sparklineData.length > 0 && (
                <div className="mt-4 h-12 -mb-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={sparklineData.map((value, index) => ({ value, index }))}>
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="hsl(var(--primary))"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}

export default function DashboardStats({ campaign }: { campaign: Campaign }) {
    const { stats } = campaign;

    // Mock sparkline data
    const trafficData = [8200, 8900, 9500, 10200, 10800, 11500, 12547];
    const contentData = [120, 125, 130, 135, 140, 142, 145];
    const dwellData = [105, 110, 115, 118, 122, 123, 125];
    const monthData = [15, 18, 21, 24, 26, 27, 28];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
            <StatsCard
                icon={<FileText className="w-5 h-5" />}
                label="Total Content"
                value={stats.totalContent}
                change={12}
                trend="up"
                sparklineData={contentData}
            />
            <StatsCard
                icon={<BarChart3 className="w-5 h-5" />}
                label="Published This Month"
                value={stats.publishedThisMonth}
                change={stats.trafficGrowth}
                trend="up"
                sparklineData={monthData}
            />
            <StatsCard
                icon={<Users className="w-5 h-5" />}
                label="Organic Traffic"
                value={stats.organicTraffic.toLocaleString()}
                change={stats.trafficGrowth}
                trend="up"
                sparklineData={trafficData}
            />
            <StatsCard
                icon={<Clock className="w-5 h-5" />}
                label="Avg. Dwell Time"
                value={stats.avgDwellTime}
                suffix="sec"
                change={8}
                trend="up"
                sparklineData={dwellData}
            />
        </div>
    );
}
