'use client';

import { TrendingUp, Eye, Heart, MessageCircle, Share2 } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface PlatformAnalytics {
    platform: 'wordpress' | 'youtube' | 'instagram' | 'facebook';
    metrics: {
        views: number;
        engagement: number;
        likes: number;
        comments: number;
        shares: number;
    };
    trend: number[];
    growth: number;
}

export default function CrossPlatformAnalytics() {
    const analytics: PlatformAnalytics[] = [
        {
            platform: 'wordpress',
            metrics: {
                views: 12450,
                engagement: 785,
                likes: 342,
                comments: 128,
                shares: 56,
            },
            trend: [4200, 5100, 4800, 6200, 7100, 8300, 9500, 11200, 10800, 11900, 12100, 12450],
            growth: 23.5,
        },
        {
            platform: 'youtube',
            metrics: {
                views: 8920,
                engagement: 1250,
                likes: 856,
                comments: 234,
                shares: 160,
            },
            trend: [2100, 3200, 4100, 5300, 6200, 6800, 7200, 7800, 8100, 8400, 8700, 8920],
            growth: 18.2,
        },
        {
            platform: 'instagram',
            metrics: {
                views: 15680,
                engagement: 2340,
                likes: 1890,
                comments: 345,
                shares: 105,
            },
            trend: [8200, 9100, 9800, 10500, 11200, 12100, 12800, 13500, 14200, 14800, 15200, 15680],
            growth: 31.7,
        },
        {
            platform: 'facebook',
            metrics: {
                views: 6540,
                engagement: 490,
                likes: 380,
                comments: 95,
                shares: 15,
            },
            trend: [2800, 3100, 3400, 3900, 4200, 4500, 4900, 5300, 5700, 6000, 6300, 6540],
            growth: 12.3,
        },
    ];

    const platformNames = {
        wordpress: { name: 'WordPress', color: '#2563eb', emoji: '📝' },
        youtube: { name: 'YouTube', color: '#ef4444', emoji: '▶️' },
        instagram: { name: 'Instagram', color: '#ec4899', emoji: '📷' },
        facebook: { name: 'Facebook', color: '#6366f1', emoji: '👍' },
    };

    const totalMetrics = analytics.reduce(
        (acc, platform) => ({
            views: acc.views + platform.metrics.views,
            engagement: acc.engagement + platform.metrics.engagement,
            likes: acc.likes + platform.metrics.likes,
            comments: acc.comments + platform.metrics.comments,
            shares: acc.shares + platform.metrics.shares,
        }),
        { views: 0, engagement: 0, likes: 0, comments: 0, shares: 0 }
    );

    return (
        <div className="card">
            <div className="card-header pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="card-title flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Cross-Platform Analytics
                        </h3>
                        <p className="card-description mt-1">
                            Performance across all channels
                        </p>
                    </div>
                    <button className="btn-ghost btn-sm">
                        View Details
                    </button>
                </div>
            </div>

            <div className="card-content space-y-6">
                {/* Total Metrics */}
                <div className="grid grid-cols-5 gap-3">
                    {[
                        { icon: Eye, label: 'Total Views', value: totalMetrics.views, color: 'text-primary' },
                        { icon: Heart, label: 'Total Likes', value: totalMetrics.likes, color: 'text-success' },
                        { icon: MessageCircle, label: 'Comments', value: totalMetrics.comments, color: 'text-secondary' },
                        { icon: Share2, label: 'Shares', value: totalMetrics.shares, color: 'text-warning' },
                        { icon: TrendingUp, label: 'Engagement', value: totalMetrics.engagement, color: 'text-accent' },
                    ].map((metric, index) => (
                        <div key={index} className="card p-3 bg-muted/30">
                            <metric.icon className={`w-4 h-4 ${metric.color} mb-2`} />
                            <div className="text-xs text-muted-foreground">{metric.label}</div>
                            <div className="text-lg font-bold mt-1">{metric.value.toLocaleString()}</div>
                        </div>
                    ))}
                </div>

                {/* Platform Breakdown */}
                <div className="space-y-3">
                    {analytics.map((platform, index) => (
                        <div
                            key={platform.platform}
                            className="card p-4 animate-fade-in-up"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="text-2xl">{platformNames[platform.platform].emoji}</div>
                                    <div>
                                        <h4 className="font-semibold text-sm">{platformNames[platform.platform].name}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-muted-foreground">
                                                {platform.metrics.views.toLocaleString()} views
                                            </span>
                                            <span className={`text-xs font-semibold ${platform.growth > 0 ? 'text-success' : 'text-destructive'
                                                }`}>
                                                {platform.growth > 0 ? '+' : ''}{platform.growth}%
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Mini Sparkline */}
                                <div className="w-24 h-12">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={platform.trend.map(value => ({ value }))}>
                                            <Line
                                                type="monotone"
                                                dataKey="value"
                                                stroke={platformNames[platform.platform].color}
                                                strokeWidth={2}
                                                dot={false}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Platform Metrics */}
                            <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-border">
                                <div>
                                    <div className="text-[10px] text-muted-foreground">Engagement</div>
                                    <div className="text-sm font-semibold">{platform.metrics.engagement}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-muted-foreground">Likes</div>
                                    <div className="text-sm font-semibold">{platform.metrics.likes}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-muted-foreground">Comments</div>
                                    <div className="text-sm font-semibold">{platform.metrics.comments}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-muted-foreground">Shares</div>
                                    <div className="text-sm font-semibold">{platform.metrics.shares}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
