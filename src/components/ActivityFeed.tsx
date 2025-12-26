'use client';

import { Activity, CheckCircle2, Clock, AlertCircle, XCircle } from 'lucide-react';

interface ActivityItem {
    id: string;
    type: 'success' | 'pending' | 'warning' | 'error';
    action: string;
    details: string;
    platform?: string;
    timestamp: Date;
}

export default function ActivityFeed() {
    const activities: ActivityItem[] = [
        {
            id: '1',
            type: 'success',
            action: 'Content Published',
            details: 'Published "Digital Marketing Guide" to WordPress',
            platform: 'wordpress',
            timestamp: new Date(Date.now() - 1000 * 60 * 15),
        },
        {
            id: '2',
            type: 'success',
            action: 'Content Generated',
            details: 'AI generated 3 blog posts and 2 Instagram reels',
            timestamp: new Date(Date.now() - 1000 * 60 * 45),
        },
        {
            id: '3',
            type: 'pending',
            action: 'Scheduled for Publishing',
            details: 'YouTube Short scheduled for tomorrow at 2:00 PM',
            platform: 'youtube',
            timestamp: new Date(Date.now() - 1000 * 60 * 120),
        },
        {
            id: '4',
            type: 'success',
            action: 'Content Approved',
            details: 'Approved "SEO Best Practices" for publishing',
            timestamp: new Date(Date.now() - 1000 * 60 * 180),
        },
        {
            id: '5',
            type: 'warning',
            action: 'Risk Alert',
            details: 'Publishing velocity above recommended threshold',
            timestamp: new Date(Date.now() - 1000 * 60 * 240),
        },
        {
            id: '6',
            type: 'success',
            action: 'Instagram Reel Posted',
            details: 'Posted "Marketing Hacks" to Instagram',
            platform: 'instagram',
            timestamp: new Date(Date.now() - 1000 * 60 * 360),
        },
        {
            id: '7',
            type: 'error',
            action: 'Publishing Failed',
            details: 'Failed to publish to Facebook: Invalid token',
            platform: 'facebook',
            timestamp: new Date(Date.now() - 1000 * 60 * 480),
        },
    ];

    const getIcon = (type: ActivityItem['type']) => {
        switch (type) {
            case 'success':
                return <CheckCircle2 className="w-4 h-4 text-success" />;
            case 'pending':
                return <Clock className="w-4 h-4 text-warning" />;
            case 'warning':
                return <AlertCircle className="w-4 h-4 text-warning" />;
            case 'error':
                return <XCircle className="w-4 h-4 text-destructive" />;
        }
    };

    const getTimeAgo = (date: Date) => {
        const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

        if (seconds < 60) return `${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    const platformEmojis = {
        wordpress: '📝',
        youtube: '▶️',
        instagram: '📷',
        facebook: '👍',
    };

    return (
        <div className="card">
            <div className="card-header flex-row items-center justify-between pb-4">
                <div>
                    <h3 className="card-title flex items-center gap-2">
                        <Activity className="w-5 h-5" />
                        Recent Activity
                    </h3>
                    <p className="card-description mt-1">
                        Latest system actions and events
                    </p>
                </div>
                <button className="btn-ghost btn-sm">
                    View All
                </button>
            </div>

            <div className="card-content">
                <div className="space-y-2">
                    {activities.map((activity, index) => (
                        <div
                            key={activity.id}
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors animate-fade-in-up"
                            style={{ animationDelay: `${index * 30}ms` }}
                        >
                            <div className="mt-0.5">
                                {getIcon(activity.type)}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h4 className="text-sm font-semibold">{activity.action}</h4>
                                    {activity.platform && (
                                        <span className="text-xs">
                                            {platformEmojis[activity.platform as keyof typeof platformEmojis]}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {activity.details}
                                </p>
                            </div>

                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {getTimeAgo(activity.timestamp)}
                            </span>
                        </div>
                    ))}
                </div>

                {/* View More */}
                <div className="mt-4 pt-4 border-t border-border text-center">
                    <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                        Load More Activity
                    </button>
                </div>
            </div>
        </div>
    );
}
