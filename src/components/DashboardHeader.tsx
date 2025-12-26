'use client';

import { Settings, Bell, Search } from 'lucide-react';

interface DashboardHeaderProps {
    campaignName: string;
    campaignStatus: 'active' | 'paused' | 'completed';
    onCampaignSettings?: () => void;
}

export default function DashboardHeader({ campaignName, campaignStatus, onCampaignSettings }: DashboardHeaderProps) {
    const statusBadge = {
        active: 'badge-success',
        paused: 'badge-warning',
        completed: 'badge-secondary',
    };

    return (
        <div className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
            <div className="flex items-center justify-between px-8 py-4">
                {/* Left Section */}
                <div className="flex items-center gap-6">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Digital Marketing Engine
                        </h1>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            Autonomous Organic Growth Platform
                        </p>
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="input pl-9 w-64 h-9 text-sm"
                        />
                    </div>

                    {/* Notifications */}
                    <button className="btn-ghost btn-sm relative">
                        <Bell className="w-4 h-4" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
                    </button>

                    {/* Status */}
                    <span className={`badge ${statusBadge[campaignStatus]} capitalize`}>
                        {campaignStatus}
                    </span>

                    {/* Settings */}
                    <button className="btn-ghost btn-md">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                    </button>

                    {/* Campaign Settings */}
                    <button onClick={onCampaignSettings} className="btn-primary btn-md">
                        <Settings className="w-4 h-4 mr-2" />
                        Campaign Settings
                    </button>
                </div>
            </div>
        </div>
    );
}
