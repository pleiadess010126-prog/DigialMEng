'use client';

import { AIAgent } from '@/types';
import { Target, TrendingUp, Share2, Shield, Activity, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

const agentTypeConfig = {
    supervisor: {
        icon: Target,
        name: 'Supervisor',
        color: 'text-primary',
        bgColor: 'bg-primary/10',
    },
    'seo-worker': {
        icon: TrendingUp,
        name: 'SEO Worker',
        color: 'text-success',
        bgColor: 'bg-success/10',
    },
    'social-worker': {
        icon: Share2,
        name: 'Social Worker',
        color: 'text-secondary',
        bgColor: 'bg-secondary/10',
    },
    'risk-worker': {
        icon: Shield,
        name: 'Risk Worker',
        color: 'text-warning',
        bgColor: 'bg-warning/10',
    },
};

const statusConfig = {
    working: {
        icon: Activity,
        color: 'text-success',
        label: 'Working',
    },
    idle: {
        icon: CheckCircle2,
        color: 'text-muted-foreground',
        label: 'Idle',
    },
    error: {
        icon: XCircle,
        color: 'text-destructive',
        label: 'Error',
    },
};

export default function AIAgentStatus({ agents }: { agents: AIAgent[] }) {
    return (
        <div className="card">
            <div className="card-header pb-2">
                <h2 className="card-title">AI Agent Status</h2>
                <p className="card-description mt-1">Real-time automation workforce</p>
            </div>

            <div className="card-content">
                <div className="grid grid-cols-1 gap-3">
                    {agents.map((agent, index) => {
                        const config = agentTypeConfig[agent.type];
                        const status = statusConfig[agent.status];
                        const Icon = config.icon;
                        const StatusIcon = status.icon;
                        const isActive = agent.status === 'working';
                        const timeSinceActive = Date.now() - new Date(agent.lastActive).getTime();
                        const minutesAgo = Math.floor(timeSinceActive / 1000 / 60);

                        return (
                            <div
                                key={agent.id}
                                className="card p-4 hover:shadow-elevated transition-all duration-200 group animate-fade-in-up"
                                style={{ animationDelay: `${index * 75}ms` }}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${config.bgColor} ${config.color} group-hover:scale-110 transition-transform`}>
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold">{agent.name}</h3>
                                            <p className="text-xs text-muted-foreground capitalize">
                                                {agent.type.replace('-', ' ')}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="status-dot status-dot-pulse">
                                            <span className={`status-dot-inner ${isActive ? 'bg-success' : agent.status === 'error' ? 'bg-destructive' : 'bg-muted-foreground'
                                                }`}></span>
                                            <span className={`status-dot-outer ${isActive ? 'bg-success' : agent.status === 'error' ? 'bg-destructive' : 'bg-muted-foreground'
                                                }`}></span>
                                        </div>
                                        <StatusIcon className={`w-3 h-3 ${status.color}`} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-muted-foreground">Tasks Completed</span>
                                        <span className="font-semibold badge badge-default">
                                            {agent.tasksCompleted}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-muted-foreground">Last Active</span>
                                        <span className="font-medium">
                                            {minutesAgo === 0 ? 'Just now' : minutesAgo < 60 ? `${minutesAgo}m` : `${Math.floor(minutesAgo / 60)}h`}
                                        </span>
                                    </div>
                                </div>

                                {isActive && (
                                    <div className="mt-3 pt-3 border-t border-border">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Activity className="w-3 h-3 text-success animate-pulse" />
                                            <span className="text-xs font-medium text-success">Processing...</span>
                                        </div>
                                        <div className="h-1 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-primary to-secondary animate-pulse"
                                                style={{ width: '65%' }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
