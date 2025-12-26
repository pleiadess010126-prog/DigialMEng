'use client';

import { useState } from 'react';
import { Sparkles, Loader2, Plus, X } from 'lucide-react';
import type { TopicPillar } from '@/types';

interface BatchGenerateModalProps {
    isOpen: boolean;
    onClose: () => void;
    topicPillars: TopicPillar[];
    onGenerate?: (results: any[]) => void;
}

export default function BatchGenerateModal({
    isOpen,
    onClose,
    topicPillars,
    onGenerate,
}: BatchGenerateModalProps) {
    const [selectedPillars, setSelectedPillars] = useState<string[]>([]);
    const [contentTypes, setContentTypes] = useState({
        blog: true,
        'youtube-short': true,
        'instagram-reel': true,
        'facebook-story': false,
    });
    const [generating, setGenerating] = useState(false);
    const [progress, setProgress] = useState(0);

    if (!isOpen) return null;

    const togglePillar = (pillarId: string) => {
        setSelectedPillars(prev =>
            prev.includes(pillarId)
                ? prev.filter(id => id !== pillarId)
                : [...prev, pillarId]
        );
    };

    const getEstimatedCount = () => {
        const typesCount = Object.values(contentTypes).filter(Boolean).length;
        return selectedPillars.length * typesCount;
    };

    const handleGenerate = async () => {
        setGenerating(true);
        setProgress(0);

        const results: any[] = [];
        const selectedTypes = Object.entries(contentTypes)
            .filter(([, enabled]) => enabled)
            .map(([type]) => type);

        const totalTasks = selectedPillars.length * selectedTypes.length;
        let completed = 0;

        for (const pillarId of selectedPillars) {
            const pillar = topicPillars.find(p => p.id === pillarId);
            if (!pillar) continue;

            for (const contentType of selectedTypes) {
                try {
                    const response = await fetch('/api/generate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            topic: pillar.name,
                            keywords: pillar.keywords,
                            contentType,
                            targetAudience: 'digital marketers and content creators',
                            useSupervisor: true,
                        }),
                    });

                    const data = await response.json();
                    if (data.success) {
                        results.push(data.content);
                    }
                } catch (error) {
                    console.error('Batch generation error:', error);
                }

                completed++;
                setProgress(Math.round((completed / totalTasks) * 100));
            }
        }

        setGenerating(false);
        onGenerate?.(results);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="card w-full max-w-2xl animate-fade-in-up">
                {/* Header */}
                <div className="card-header flex-row items-center justify-between pb-4 border-b border-border">
                    <div>
                        <h2 className="card-title flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary" />
                            Batch Content Generation
                        </h2>
                        <p className="card-description mt-1">
                            Generate multiple pieces of content at once
                        </p>
                    </div>
                    <button onClick={onClose} disabled={generating} className="btn-ghost btn-sm">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="card-content space-y-6">
                    {/* Select Topic Pillars */}
                    <div>
                        <h3 className="text-sm font-semibold mb-3">Select Topic Pillars</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {topicPillars.slice(0, 6).map((pillar) => (
                                <button
                                    key={pillar.id}
                                    onClick={() => togglePillar(pillar.id)}
                                    disabled={generating}
                                    className={`p-3 rounded-lg border transition-all text-left ${selectedPillars.includes(pillar.id)
                                            ? 'bg-primary/10 border-primary/30 text-primary'
                                            : 'bg-muted/30 border-border hover:border-primary/20'
                                        }`}
                                >
                                    <div className="font-medium text-sm">{pillar.name}</div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                        {pillar.keywords.length} keywords
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Select Content Types */}
                    <div>
                        <h3 className="text-sm font-semibold mb-3">Content Types</h3>
                        <div className="space-y-2">
                            {Object.entries(contentTypes).map(([type, enabled]) => (
                                <label key={type} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={enabled}
                                        onChange={(e) => setContentTypes({ ...contentTypes, [type]: e.target.checked })}
                                        disabled={generating}
                                        className="w-4 h-4 rounded border-border"
                                    />
                                    <div className="flex-1">
                                        <div className="text-sm font-medium capitalize">
                                            {type.replace('-', ' ')}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {type === 'blog' && 'Full blog posts with SEO'}
                                            {type === 'youtube-short' && '60-second video scripts'}
                                            {type === 'instagram-reel' && 'Captions with hashtags'}
                                            {type === 'facebook-story' && 'Story text with prompts'}
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Estimation */}
                    <div className="card p-4 bg-primary/5 border-primary/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium">Estimated Content</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {selectedPillars.length} topics × {Object.values(contentTypes).filter(Boolean).length} types
                                </p>
                            </div>
                            <div className="text-3xl font-bold text-primary">
                                {getEstimatedCount()}
                            </div>
                        </div>
                    </div>

                    {/* Progress */}
                    {generating && (
                        <div>
                            <div className="flex items-center justify-between text-sm mb-2">
                                <span className="text-muted-foreground">Generating content...</span>
                                <span className="font-semibold">{progress}%</span>
                            </div>
                            <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="card-header border-t border-border pt-4 flex-row items-center justify-between">
                    <button onClick={onClose} disabled={generating} className="btn-ghost btn-md">
                        Cancel
                    </button>
                    <button
                        onClick={handleGenerate}
                        disabled={generating || selectedPillars.length === 0 || getEstimatedCount() === 0}
                        className="btn-primary btn-md"
                    >
                        {generating ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4 mr-2" />
                                Generate {getEstimatedCount()} Items
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
