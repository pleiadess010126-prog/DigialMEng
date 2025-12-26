'use client';

import { RiskAlert } from '@/types';
import { AlertTriangle, Info, AlertCircle, XCircle, CheckCircle2, Lightbulb } from 'lucide-react';

const severityConfig = {
    low: {
        icon: Info,
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/20',
        badge: 'badge-secondary',
    },
    medium: {
        icon: AlertCircle,
        color: 'text-warning',
        bgColor: 'bg-warning/10',
        borderColor: 'border-warning/20',
        badge: 'badge-warning',
    },
    high: {
        icon: AlertTriangle,
        color: 'text-destructive',
        bgColor: 'bg-destructive/10',
        borderColor: 'border-destructive/20',
        badge: 'badge-error',
    },
    critical: {
        icon: XCircle,
        color: 'text-destructive',
        bgColor: 'bg-destructive/20',
        borderColor: 'border-destructive/30',
        badge: 'badge-error animate-pulse',
    },
};

export default function RiskMonitor({ alerts }: { alerts: RiskAlert[] }) {
    const activeAlerts = alerts.filter((a) => !a.resolved);
    const criticalCount = activeAlerts.filter((a) => a.severity === 'critical').length;
    const highCount = activeAlerts.filter((a) => a.severity === 'high').length;

    return (
        <div className="card">
            <div className="card-header flex flex-row items-center justify-between pb-2">
                <div>
                    <h2 className="card-title flex items-center gap-2">
                        Risk Monitor
                        <div className="status-dot status-dot-pulse">
                            <span className={`status-dot-inner ${activeAlerts.length === 0 ? 'bg-success' : 'bg-warning'}`}></span>
                            <span className={`status-dot-outer ${activeAlerts.length === 0 ? 'bg-success' : 'bg-warning'}`}></span>
                        </div>
                    </h2>
                    <p className="card-description mt-1">
                        {activeAlerts.length === 0 ? 'All systems operational' : `${activeAlerts.length} active alert${activeAlerts.length > 1 ? 's' : ''}`}
                    </p>
                </div>

                <div className="flex gap-2">
                    {criticalCount > 0 && (
                        <span className="badge badge-error">
                            {criticalCount} Critical
                        </span>
                    )}
                    {highCount > 0 && (
                        <span className="badge badge-warning">
                            {highCount} High
                        </span>
                    )}
                    {activeAlerts.length === 0 && (
                        <span className="badge badge-success flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            All Clear
                        </span>
                    )}
                </div>
            </div>

            <div className="card-content">
                <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar pr-1">
                    {activeAlerts.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 mb-4">
                                <CheckCircle2 className="w-8 h-8 text-success" />
                            </div>
                            <p className="text-sm font-medium mb-1">No Active Risk Alerts</p>
                            <p className="text-xs text-muted-foreground">Your campaign is healthy and performing well</p>
                        </div>
                    ) : (
                        activeAlerts.map((alert, index) => {
                            const config = severityConfig[alert.severity];
                            const Icon = config.icon;

                            return (
                                <div
                                    key={alert.id}
                                    className={`card p-4 ${config.bgColor} border ${config.borderColor} animate-fade-in-up`}
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2 rounded-lg ${config.bgColor} ${config.color}`}>
                                            <Icon className="w-4 h-4" />
                                        </div>

                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className={`badge ${config.badge} uppercase text-[10px] font-bold`}>
                                                    {alert.severity}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {alert.type.split('-').join(' ')}
                                                </span>
                                            </div>

                                            <p className="text-sm font-medium">{alert.message}</p>

                                            <div className="card p-3 bg-muted/30 border-0">
                                                <div className="flex items-start gap-2">
                                                    <Lightbulb className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                                                    <div className="text-xs">
                                                        <p className="font-medium text-primary mb-1">Recommendation</p>
                                                        <p className="text-muted-foreground">{alert.recommendation}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="text-[10px] text-muted-foreground">
                                                Detected {new Date(alert.detectedAt).toLocaleString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
