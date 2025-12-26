'use client';

import DashboardHeader from '@/components/DashboardHeader';
import DashboardStats from '@/components/DashboardStats';
import ContentQueue from '@/components/ContentQueue';
import RiskMonitor from '@/components/RiskMonitor';
import AIAgentStatus from '@/components/AIAgentStatus';
import ContentPreviewModal from '@/components/ContentPreviewModal';
import BatchGenerateModal from '@/components/BatchGenerateModal';
import CampaignSettingsModal from '@/components/CampaignSettingsModal';
import PublishingScheduler from '@/components/PublishingScheduler';
import GenerateContentButton from '@/components/GenerateContentButton';
import PlatformConnectionStatus from '@/components/PlatformConnectionStatus';
import PublishingCalendar from '@/components/PublishingCalendar';
import CrossPlatformAnalytics from '@/components/CrossPlatformAnalytics';
import ActivityFeed from '@/components/ActivityFeed';
import {
    mockCampaign,
    mockContentItems,
    mockRiskAlerts,
    mockAIAgents,
    mockTopicPillars,
    mockRoadmap,
} from '@/lib/mockData';
import { useState } from 'react';
import { Folder, TrendingUp, Calendar, Activity, Sparkles, Zap } from 'lucide-react';
import type { ContentItem, Campaign } from '@/types';

export default function DashboardPage() {
    const [campaign, setCampaign] = useState(mockCampaign);
    const [contentItems, setContentItems] = useState(mockContentItems);
    const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [showBatchGenerate, setShowBatchGenerate] = useState(false);
    const [showCampaignSettings, setShowCampaignSettings] = useState(false);

    const handleApprove = (id: string) => {
        setContentItems((items) =>
            items.map((item) =>
                item.id === id ? { ...item, status: 'approved' as const } : item
            )
        );
    };

    const handleReject = (id: string) => {
        setContentItems((items) =>
            items.map((item) =>
                item.id === id ? { ...item, status: 'rejected' as const } : item
            )
        );
    };

    const handleContentGenerated = (content: any) => {
        // Add generated content to queue
        const newItem: ContentItem = {
            id: `gen-${Date.now()}`,
            ...content,
            status: 'pending' as const,
            createdAt: new Date().toISOString(),
        };
        setContentItems(prev => [newItem, ...prev]);
    };

    const handleBatchGenerate = (results: any[]) => {
        const newItems = results.map((content, idx) => ({
            id: `batch-${Date.now()}-${idx}`,
            ...content,
            status: 'pending' as const,
            createdAt: new Date().toISOString(),
        }));
        setContentItems(prev => [...newItems, ...prev]);
    };

    const handleCampaignSettingsSave = (updates: Partial<Campaign>) => {
        setCampaign(prev => ({
            ...prev,
            ...updates,
        }));
    };

    return (
        <div className="min-h-screen bg-background gradient-mesh">
            {/* Header */}
            <DashboardHeader
                campaignName={campaign.name}
                campaignStatus={campaign.status}
                onCampaignSettings={() => setShowCampaignSettings(true)}
            />

            {/* Main Content */}
            <div className="px-8 py-6 space-y-6">
                {/* Stats Overview */}
                <DashboardStats campaign={campaign} />

                {/* Platform Status & Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <PlatformConnectionStatus />
                    <CrossPlatformAnalytics />
                </div>

                {/* Calendar & Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <PublishingCalendar />
                    </div>
                    <ActivityFeed />
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content Area - 2 columns */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Content Queue */}
                        <ContentQueue
                            items={contentItems}
                            onApprove={handleApprove}
                            onReject={handleReject}
                        />

                        {/* Topic Pillars */}
                        <div className="card">
                            <div className="card-header flex flex-row items-center justify-between pb-2">
                                <div>
                                    <h2 className="card-title flex items-center gap-2">
                                        <Folder className="w-5 h-5" />
                                        Topic Pillars
                                    </h2>
                                    <p className="card-description mt-1">Core content themes and keyword clusters</p>
                                </div>
                                <span className="badge-default">{mockTopicPillars.length} pillars</span>
                            </div>

                            <div className="card-content">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {mockTopicPillars.map((pillar, index) => (
                                        <div
                                            key={pillar.id}
                                            className="card p-4 hover:shadow-elevated transition-all duration-200 group animate-fade-in-up"
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                                                        <TrendingUp className="w-4 h-4" />
                                                    </div>
                                                    <h3 className="font-semibold text-sm">{pillar.name}</h3>
                                                </div>
                                                <span className="badge badge-secondary text-xs">{pillar.contentCount}</span>
                                            </div>

                                            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                                                {pillar.description}
                                            </p>

                                            <div className="flex flex-wrap gap-1.5">
                                                {pillar.keywords.slice(0, 3).map((keyword, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-2 py-0.5 bg-muted/50 rounded text-[10px] text-muted-foreground font-medium"
                                                    >
                                                        {keyword}
                                                    </span>
                                                ))}
                                                {pillar.keywords.length > 3 && (
                                                    <span className="px-2 py-0.5 bg-muted/50 rounded text-[10px] text-muted-foreground font-medium">
                                                        +{pillar.keywords.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 90-Day Roadmap */}
                        <div className="card">
                            <div className="card-header flex flex-row items-center justify-between pb-2">
                                <div>
                                    <h2 className="card-title flex items-center gap-2">
                                        <Calendar className="w-5 h-5" />
                                        90-Day Content Roadmap
                                    </h2>
                                    <p className="card-description mt-1">Automated planning with gradual velocity</p>
                                </div>
                            </div>

                            <div className="card-content">
                                <div className="space-y-2.5">
                                    {mockRoadmap.map((item, index) => {
                                        const statusColor =
                                            item.status === 'completed'
                                                ? 'bg-success'
                                                : item.status === 'in-progress'
                                                    ? 'bg-warning'
                                                    : 'bg-muted-foreground/30';

                                        const statusLabel =
                                            item.status === 'completed'
                                                ? 'badge-success'
                                                : item.status === 'in-progress'
                                                    ? 'badge-warning'
                                                    : 'badge';

                                        return (
                                            <div
                                                key={index}
                                                className="card p-4 flex items-center gap-4 animate-fade-in-up"
                                                style={{ animationDelay: `${index * 50}ms` }}
                                            >
                                                <div className={`w-2 h-2 rounded-full ${statusColor} flex-shrink-0`} />

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-3 mb-1.5">
                                                        <span className="text-sm font-semibold">
                                                            Week {item.week}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            Month {item.month}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            • Target: {item.contentTarget} items
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {item.topics.map((topic, topicIdx) => (
                                                            <span
                                                                key={topicIdx}
                                                                className="text-[10px] px-2 py-0.5 bg-primary/10 border border-primary/20 rounded text-primary font-medium"
                                                            >
                                                                {topic}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                <span className={`badge ${statusLabel} text-xs capitalize flex-shrink-0`}>
                                                    {item.status.replace('-', ' ')}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - 1 column */}
                    <div className="space-y-6">
                        {/* Risk Monitor */}
                        <RiskMonitor alerts={mockRiskAlerts} />

                        {/* AI Agent Status */}
                        <AIAgentStatus agents={mockAIAgents} />

                        {/* System Health */}
                        <div className="card">
                            <div className="card-header pb-2">
                                <h3 className="card-title flex items-center gap-2">
                                    <Activity className="w-5 h-5" />
                                    System Health
                                </h3>
                                <p className="card-description mt-1">Performance metrics</p>
                            </div>

                            <div className="card-content">
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-muted-foreground">Indexation Rate</span>
                                            <span className="font-semibold">
                                                {campaign.stats.indexationRate}%
                                            </span>
                                        </div>
                                        <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-500 ${campaign.stats.indexationRate >= 80
                                                    ? 'bg-success'
                                                    : campaign.stats.indexationRate >= 60
                                                        ? 'bg-warning'
                                                        : 'bg-destructive'
                                                    }`}
                                                style={{ width: `${campaign.stats.indexationRate}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-muted-foreground">Risk Score</span>
                                            <span className="font-semibold">
                                                {campaign.stats.riskScore}/100
                                            </span>
                                        </div>
                                        <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-500 ${campaign.stats.riskScore <= 20
                                                    ? 'bg-success'
                                                    : campaign.stats.riskScore <= 50
                                                        ? 'bg-warning'
                                                        : 'bg-destructive'
                                                    }`}
                                                style={{ width: `${campaign.stats.riskScore}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-border space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">
                                                Auto-Publish
                                            </span>
                                            <button
                                                className={`relative w-11 h-6 rounded-full transition-colors ${campaign.settings.autoPublish
                                                    ? 'bg-success'
                                                    : 'bg-muted'
                                                    }`}
                                            >
                                                <div
                                                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${campaign.settings.autoPublish
                                                        ? 'translate-x-5'
                                                        : 'translate-x-0'
                                                        }`}
                                                />
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">
                                                Require Approval
                                            </span>
                                            <button
                                                className={`relative w-11 h-6 rounded-full transition-colors ${campaign.settings.requireApproval
                                                    ? 'bg-success'
                                                    : 'bg-muted'
                                                    }`}
                                            >
                                                <div
                                                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${campaign.settings.requireApproval
                                                        ? 'translate-x-5'
                                                        : 'translate-x-0'
                                                        }`}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Phase 3: AI Content Generation Section */}
                <div className="card p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                                <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                                AI Content Generation
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Generate high-quality content automatically with AI
                            </p>
                        </div>
                        <button
                            onClick={() => setShowBatchGenerate(true)}
                            className="btn-primary btn-lg"
                        >
                            <Zap className="w-5 h-5 mr-2" />
                            Batch Generate
                        </button>
                    </div>
                </div>

                {/* Publishing Scheduler */}
                <PublishingScheduler />
            </div>

            {/* Modals */}
            <ContentPreviewModal
                isOpen={showPreview}
                onClose={() => setShowPreview(false)}
                content={selectedContent}
                onSave={(updated) => {
                    setContentItems(prev =>
                        prev.map(item => item.id === updated.id ? updated : item)
                    );
                    setShowPreview(false);
                }}
                onApprove={(content) => {
                    setContentItems(prev =>
                        prev.map(item => item.id === content.id ? { ...content, status: 'approved' } : item)
                    );
                }}
            />

            <BatchGenerateModal
                isOpen={showBatchGenerate}
                onClose={() => setShowBatchGenerate(false)}
                topicPillars={mockTopicPillars}
                onGenerate={handleBatchGenerate}
            />

            <CampaignSettingsModal
                campaign={campaign}
                isOpen={showCampaignSettings}
                onClose={() => setShowCampaignSettings(false)}
                onSave={handleCampaignSettingsSave}
            />
        </div>
    );
}
