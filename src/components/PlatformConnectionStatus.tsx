'use client';

import { useState } from 'react';
import { CheckCircle2, XCircle, Settings, RefreshCw, Link as LinkIcon } from 'lucide-react';

interface Platform {
    id: string;
    name: string;
    type: 'wordpress' | 'youtube' | 'instagram' | 'facebook';
    connected: boolean;
    lastSync?: Date;
    status: 'active' | 'error' | 'disconnected';
    stats?: {
        postsPublished?: number;
        lastPost?: Date;
    };
}

export default function PlatformConnectionStatus() {
    const [platforms] = useState<Platform[]>([
        {
            id: 'wp-1',
            name: 'Main WordPress',
            type: 'wordpress',
            connected: false,
            status: 'disconnected',
        },
        {
            id: 'yt-1',
            name: 'YouTube Channel',
            type: 'youtube',
            connected: false,
            status: 'disconnected',
        },
        {
            id: 'ig-1',
            name: 'Instagram Business',
            type: 'instagram',
            connected: false,
            status: 'disconnected',
        },
        {
            id: 'fb-1',
            name: 'Facebook Page',
            type: 'facebook',
            connected: false,
            status: 'disconnected',
        },
    ]);

    const handleConnect = (platformId: string) => {
        // TODO: Open connection modal/settings
        console.log(`Connect platform: ${platformId}`);
    };

    const handleTest = (platformId: string) => {
        // TODO: Test platform connection
        console.log(`Test platform: ${platformId}`);
    };

    return (
        <div className="card">
            <div className="card-header flex-row items-center justify-between pb-4">
                <div>
                    <h3 className="card-title flex items-center gap-2">
                        <LinkIcon className="w-5 h-5" />
                        Platform Connections
                    </h3>
                    <p className="card-description mt-1">
                        Manage publishing destinations
                    </p>
                </div>
                <button className="btn-ghost btn-sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Configure
                </button>
            </div>

            <div className="card-content space-y-3">
                {platforms.map((platform, index) => (
                    <div
                        key={platform.id}
                        className="card p-4 flex items-center justify-between animate-fade-in-up"
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${platform.connected
                                    ? 'bg-success/10 text-success'
                                    : 'bg-muted/30 text-muted-foreground'
                                }`}>
                                {platform.type === 'wordpress' && '📝'}
                                {platform.type === 'youtube' && '▶️'}
                                {platform.type === 'instagram' && '📷'}
                                {platform.type === 'facebook' && '👍'}
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h4 className="font-semibold text-sm">{platform.name}</h4>
                                    {platform.connected ? (
                                        <CheckCircle2 className="w-4 h-4 text-success" />
                                    ) : (
                                        <XCircle className="w-4 h-4 text-muted-foreground" />
                                    )}
                                </div>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className={`text-xs ${platform.status === 'active' ? 'text-success' :
                                            platform.status === 'error' ? 'text-destructive' :
                                                'text-muted-foreground'
                                        }`}>
                                        {platform.status === 'active' && '● Active'}
                                        {platform.status === 'error' && '● Error'}
                                        {platform.status === 'disconnected' && '○ Not Connected'}
                                    </span>
                                    {platform.stats?.postsPublished && (
                                        <span className="text-xs text-muted-foreground">
                                            {platform.stats.postsPublished} posts published
                                        </span>
                                    )}
                                    {platform.lastSync && (
                                        <span className="text-xs text-muted-foreground">
                                            Last sync: {platform.lastSync.toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {platform.connected ? (
                                <button
                                    onClick={() => handleTest(platform.id)}
                                    className="btn-ghost btn-sm"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleConnect(platform.id)}
                                    className="btn-secondary btn-sm"
                                >
                                    Connect
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                <div className="card p-4 bg-muted/30 border-dashed">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                +
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm">Add Platform</h4>
                                <p className="text-xs text-muted-foreground">Connect more publishing destinations</p>
                            </div>
                        </div>
                        <button className="btn-ghost btn-sm">
                            Add New
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
