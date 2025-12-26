'use client';

import { useState } from 'react';
import { X, Settings, Plus, Trash2 } from 'lucide-react';
import type { Campaign } from '@/types';

interface CampaignSettingsModalProps {
    campaign: Campaign;
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedCampaign: Partial<Campaign>) => void;
}

export default function CampaignSettingsModal({
    campaign,
    isOpen,
    onClose,
    onSave,
}: CampaignSettingsModalProps) {
    const [formData, setFormData] = useState({
        name: campaign.name,
        goal: 'brand_awareness' as 'lead_generation' | 'brand_awareness' | 'product_launch' | 'sales',
        velocity: campaign.settings.velocity,
        autoPublish: campaign.settings.autoPublish,
        requireApproval: campaign.settings.requireApproval,
        contentTypes: campaign.settings.contentTypes,
        topicPillars: [
            'Digital Marketing Automation',
            'SEO Strategies',
            'Social Media Marketing',
            'Content Strategy',
        ],
    });

    const [newPillar, setNewPillar] = useState('');

    if (!isOpen) return null;

    const handleSave = () => {
        onSave({
            name: formData.name,
            settings: {
                velocity: formData.velocity,
                autoPublish: formData.autoPublish,
                requireApproval: formData.requireApproval,
                contentTypes: formData.contentTypes,
            },
        });
        onClose();
    };

    const addPillar = () => {
        if (newPillar.trim()) {
            setFormData({
                ...formData,
                topicPillars: [...formData.topicPillars, newPillar.trim()],
            });
            setNewPillar('');
        }
    };

    const removePillar = (index: number) => {
        setFormData({
            ...formData,
            topicPillars: formData.topicPillars.filter((_, i) => i !== index),
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-content max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="modal-header">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Settings className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="modal-title">Campaign Settings</h2>
                            <p className="modal-description">Configure your marketing campaign</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="modal-close">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="modal-body space-y-6">
                    {/* Campaign Name */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">Campaign Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="input w-full"
                            placeholder="e.g., Q1 2025 Growth Campaign"
                        />
                    </div>

                    {/* Campaign Goal */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">Campaign Goal</label>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { value: 'lead_generation', label: 'Lead Generation', emoji: '🎯' },
                                { value: 'brand_awareness', label: 'Brand Awareness', emoji: '📢' },
                                { value: 'product_launch', label: 'Product Launch', emoji: '🚀' },
                                { value: 'sales', label: 'Sales', emoji: '💰' },
                            ].map((goal) => (
                                <button
                                    key={goal.value}
                                    onClick={() => setFormData({ ...formData, goal: goal.value as any })}
                                    className={`p-4 rounded-lg border-2 text-left transition-all ${formData.goal === goal.value
                                            ? 'border-primary bg-primary/10'
                                            : 'border-border hover:border-primary/50'
                                        }`}
                                >
                                    <div className="text-2xl mb-2">{goal.emoji}</div>
                                    <div className="text-sm font-semibold">{goal.label}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Publishing Velocity */}
                    <div>
                        <label className="block text-sm font-semibold mb-4">Publishing Velocity</label>
                        <div className="space-y-4">
                            {[1, 2, 3].map((month) => (
                                <div key={month}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-muted-foreground">Month {month}</span>
                                        <span className="text-sm font-semibold">
                                            {formData.velocity[`month${month}` as keyof typeof formData.velocity]} posts/week
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="50"
                                        step="5"
                                        value={formData.velocity[`month${month}` as keyof typeof formData.velocity]}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                velocity: {
                                                    ...formData.velocity,
                                                    [`month${month}`]: parseInt(e.target.value),
                                                },
                                            })
                                        }
                                        className="velocity-slider w-full"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Topic Pillars */}
                    <div>
                        <label className="block text-sm font-semibold mb-3">Topic Pillars</label>
                        <div className="space-y-2 mb-3">
                            {formData.topicPillars.map((pillar, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                                >
                                    <span className="text-sm">{pillar}</span>
                                    <button
                                        onClick={() => removePillar(index)}
                                        className="text-destructive hover:text-destructive/80 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newPillar}
                                onChange={(e) => setNewPillar(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addPillar()}
                                placeholder="Add new topic pillar..."
                                className="input flex-1"
                            />
                            <button onClick={addPillar} className="btn-secondary">
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Content Types */}
                    <div>
                        <label className="block text-sm font-semibold mb-3">Content Types</label>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { key: 'blog', label: 'Blog Posts', emoji: '📝' },
                                { key: 'youtube', label: 'YouTube', emoji: '▶️' },
                                { key: 'instagram', label: 'Instagram', emoji: '📷' },
                                { key: 'facebook', label: 'Facebook', emoji: '👍' },
                            ].map((type) => (
                                <label
                                    key={type.key}
                                    className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/30 cursor-pointer transition-colors"
                                >
                                    <input
                                        type="checkbox"
                                        checked={formData.contentTypes[type.key as keyof typeof formData.contentTypes]}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                contentTypes: {
                                                    ...formData.contentTypes,
                                                    [type.key]: e.target.checked,
                                                },
                                            })
                                        }
                                        className="checkbox"
                                    />
                                    <span className="text-xl">{type.emoji}</span>
                                    <span className="text-sm font-medium">{type.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Automation Settings */}
                    <div>
                        <label className="block text-sm font-semibold mb-3">Automation</label>
                        <div className="space-y-3">
                            <label className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/30 cursor-pointer transition-colors">
                                <div>
                                    <div className="font-medium text-sm">Auto-Publish Content</div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                        Automatically publish approved content
                                    </div>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={formData.autoPublish}
                                    onChange={(e) =>
                                        setFormData({ ...formData, autoPublish: e.target.checked })
                                    }
                                    className="toggle"
                                />
                            </label>

                            <label className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/30 cursor-pointer transition-colors">
                                <div>
                                    <div className="font-medium text-sm">Require Approval</div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                        Review content before publishing
                                    </div>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={formData.requireApproval}
                                    onChange={(e) =>
                                        setFormData({ ...formData, requireApproval: e.target.checked })
                                    }
                                    className="toggle"
                                />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="modal-footer">
                    <button onClick={onClose} className="btn-ghost">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="btn-primary">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
