'use client';

import { useState } from 'react';
import { Calendar, Clock, Settings, Save } from 'lucide-react';

interface PublishingSchedulerProps {
    onScheduleSave?: (settings: ScheduleSettings) => void;
}

export interface ScheduleSettings {
    enabled: boolean;
    mode: 'immediate' | 'best-time' | 'custom';
    customTimes?: {
        dayOfWeek: number;
        hour: number;
        minute: number;
    }[];
    velocity: {
        month1: number;
        month2: number;
        month3: number;
    };
    platforms: {
        wordpress: boolean;
        youtube: boolean;
        instagram: boolean;
        facebook: boolean;
    };
}

export default function PublishingScheduler({ onScheduleSave }: PublishingSchedulerProps) {
    const [settings, setSettings] = useState<ScheduleSettings>({
        enabled: true,
        mode: 'best-time',
        velocity: {
            month1: 10,
            month2: 20,
            month3: 40,
        },
        platforms: {
            wordpress: true,
            youtube: true,
            instagram: true,
            facebook: false,
        },
    });

    const [showAdvanced, setShowAdvanced] = useState(false);

    const handleSave = () => {
        onScheduleSave?.(settings);
    };

    return (
        <div className="card">
            <div className="card-header flex-row items-center justify-between pb-4">
                <div>
                    <h3 className="card-title flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Publishing Schedule
                    </h3>
                    <p className="card-description mt-1">
                        Automate content publishing across platforms
                    </p>
                </div>
                <button
                    onClick={() => setSettings({ ...settings, enabled: !settings.enabled })}
                    className={`relative w-11 h-6 rounded-full transition-colors ${settings.enabled ? 'bg-success' : 'bg-muted'
                        }`}
                >
                    <div
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${settings.enabled ? 'translate-x-5' : 'translate-x-0'
                            }`}
                    />
                </button>
            </div>

            <div className="card-content space-y-6">
                {/* Publishing Mode */}
                <div>
                    <label className="block text-sm font-medium mb-3">Publishing Mode</label>
                    <div className="space-y-2">
                        {[
                            { value: 'immediate', label: 'Immediate', desc: 'Publish right after approval' },
                            { value: 'best-time', label: 'Best Time (AI)', desc: 'AI determines optimal posting time' },
                            { value: 'custom', label: 'Custom Schedule', desc: 'Set specific days and times' },
                        ].map((mode) => (
                            <label
                                key={mode.value}
                                className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
                            >
                                <input
                                    type="radio"
                                    name="mode"
                                    value={mode.value}
                                    checked={settings.mode === mode.value}
                                    onChange={(e) => setSettings({ ...settings, mode: e.target.value as any })}
                                    className="mt-0.5"
                                    disabled={!settings.enabled}
                                />
                                <div className="flex-1">
                                    <div className="text-sm font-medium">{mode.label}</div>
                                    <div className="text-xs text-muted-foreground">{mode.desc}</div>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Gradual Velocity */}
                <div>
                    <label className="block text-sm font-medium mb-3">Gradual Velocity (Safety)</label>
                    <div className="space-y-3">
                        {[
                            { key: 'month1' as const, label: 'Month 1', color: 'bg-warning' },
                            { key: 'month2' as const, label: 'Month 2', color: 'bg-secondary' },
                            { key: 'month3' as const, label: 'Month 3+', color: 'bg-success' },
                        ].map((month) => (
                            <div key={month.key}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-muted-foreground">{month.label}</span>
                                    <span className="text-sm font-semibold">
                                        {settings.velocity[month.key]} posts/month
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="5"
                                    max="100"
                                    step="5"
                                    value={settings.velocity[month.key]}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            velocity: { ...settings.velocity, [month.key]: parseInt(e.target.value) },
                                        })
                                    }
                                    disabled={!settings.enabled}
                                    className="w-full h-2 rounded-full appearance-none bg-muted"
                                    style={{
                                        background: `linear-gradient(to right, hsl(var(--${month.color === 'bg-warning' ? 'warning' : month.color === 'bg-secondary' ? 'secondary' : 'success'})) 0%, hsl(var(--${month.color === 'bg-warning' ? 'warning' : month.color === 'bg-secondary' ? 'secondary' : 'success'})) ${settings.velocity[month.key]}%, hsl(var(--muted)) ${settings.velocity[month.key]}%, hsl(var(--muted)) 100%)`,
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        ⚠️ Gradual velocity mimics natural growth and prevents spam detection
                    </p>
                </div>

                {/* Target Platforms */}
                <div>
                    <label className="block text-sm font-medium mb-3">Target Platforms</label>
                    <div className="grid grid-cols-2 gap-2">
                        {Object.entries(settings.platforms).map(([platform, enabled]) => (
                            <label
                                key={platform}
                                className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
                            >
                                <input
                                    type="checkbox"
                                    checked={enabled}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            platforms: { ...settings.platforms, [platform]: e.target.checked },
                                        })
                                    }
                                    disabled={!settings.enabled}
                                    className="w-4 h-4 rounded border-border"
                                />
                                <span className="text-sm capitalize">{platform}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Advanced Settings */}
                {showAdvanced && settings.mode === 'custom' && (
                    <div className="card p-4 bg-muted/30 border-muted">
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Custom Time Slots
                        </h4>
                        <div className="space-y-2">
                            <button className="btn-secondary btn-sm w-full">
                                + Add Time Slot
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="card-header border-t border-border pt-4 flex-row items-center justify-between">
                <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="btn-ghost btn-sm"
                    disabled={!settings.enabled}
                >
                    <Settings className="w-4 h-4 mr-2" />
                    {showAdvanced ? 'Hide' : 'Show'} Advanced
                </button>
                <button onClick={handleSave} className="btn-primary btn-md" disabled={!settings.enabled}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Schedule
                </button>
            </div>
        </div>
    );
}
