'use client';

import { OnboardingData } from '@/types';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Sparkles, CheckCircle2, Shield } from 'lucide-react';

interface OnboardingFormProps {
    onComplete: (data: OnboardingData) => void;
}

export default function OnboardingForm({ onComplete }: OnboardingFormProps) {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<Partial<OnboardingData>>({
        socialMedia: {},
        credentials: {},
    });

    const updateField = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const updateSocialMedia = (platform: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            socialMedia: { ...prev.socialMedia, [platform]: value },
        }));
    };

    const handleSubmit = () => {
        onComplete(formData as OnboardingData);
        router.push('/dashboard');
    };

    const totalSteps = 4;
    const progress = (step / totalSteps) * 100;

    return (
        <div className="min-h-screen bg-background gradient-mesh flex items-center justify-center p-6">
            <div className="w-full max-w-3xl">
                {/* Progress */}
                <div className="mb-8 animate-fade-in">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium">Step {step} of {totalSteps}</span>
                        <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
                    </div>
                    <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Form Card */}
                <div className="card p-8 animate-fade-in-up">
                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2.5 rounded-lg bg-primary/10">
                                    <Sparkles className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">Welcome to DigitalMEng</h2>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Let's configure your autonomous marketing engine
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Website URL <span className="text-destructive">*</span>
                                </label>
                                <input
                                    type="url"
                                    className="input"
                                    placeholder="https://yourwebsite.com"
                                    value={formData.websiteUrl || ''}
                                    onChange={(e) => updateField('websiteUrl', e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Brand Name <span className="text-destructive">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="Your Brand"
                                        value={formData.brandName || ''}
                                        onChange={(e) => updateField('brandName', e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Industry <span className="text-destructive">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="e.g., SaaS, E-commerce"
                                        value={formData.industry || ''}
                                        onChange={(e) => updateField('industry', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Target Audience
                                </label>
                                <textarea
                                    className="textarea"
                                    rows={3}
                                    placeholder="Describe your ideal customer..."
                                    value={formData.targetAudience || ''}
                                    onChange={(e) => updateField('targetAudience', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Unique Value Proposition
                                </label>
                                <textarea
                                    className="textarea"
                                    rows={3}
                                    placeholder="What makes your brand unique?"
                                    value={formData.uniqueValueProposition || ''}
                                    onChange={(e) => updateField('uniqueValueProposition', e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold mb-1">Social Media Accounts</h2>
                                <p className="text-sm text-muted-foreground">
                                    Connect your social channels (all optional)
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        YouTube Channel
                                    </label>
                                    <input
                                        type="url"
                                        className="input"
                                        placeholder="https://youtube.com/@channel"
                                        value={formData.socialMedia?.youtube || ''}
                                        onChange={(e) => updateSocialMedia('youtube', e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Instagram Handle
                                    </label>
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="@yourbrand"
                                        value={formData.socialMedia?.instagram || ''}
                                        onChange={(e) => updateSocialMedia('instagram', e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Facebook Page
                                    </label>
                                    <input
                                        type="url"
                                        className="input"
                                        placeholder="https://facebook.com/page"
                                        value={formData.socialMedia?.facebook || ''}
                                        onChange={(e) => updateSocialMedia('facebook', e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Twitter/X Handle
                                    </label>
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="@yourbrand"
                                        value={formData.socialMedia?.twitter || ''}
                                        onChange={(e) => updateSocialMedia('twitter', e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        LinkedIn Company
                                    </label>
                                    <input
                                        type="url"
                                        className="input"
                                        placeholder="https://linkedin.com/company"
                                        value={formData.socialMedia?.linkedin || ''}
                                        onChange={(e) => updateSocialMedia('linkedin', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold mb-1">API Credentials</h2>
                                <p className="text-sm text-muted-foreground">
                                    Securely connect your platforms (all optional for demo)
                                </p>
                            </div>

                            <div className="card p-5 bg-muted/30 border-muted space-y-4">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-primary" />
                                    WordPress Integration
                                </h3>
                                <div className="space-y-3">
                                    <input type="url" className="input" placeholder="WordPress Site URL" />
                                    <div className="grid grid-cols-2 gap-3">
                                        <input type="text" className="input" placeholder="Username" />
                                        <input type="password" className="input" placeholder="App Password" />
                                    </div>
                                </div>
                            </div>

                            <div className="card p-5 bg-muted/30 border-muted space-y-4">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-primary" />
                                    Meta (Facebook/Instagram)
                                </h3>
                                <div className="space-y-3">
                                    <input type="text" className="input" placeholder="App ID" />
                                    <input type="password" className="input" placeholder="App Secret" />
                                    <input type="password" className="input" placeholder="Access Token" />
                                </div>
                            </div>

                            <div className="card p-5 bg-muted/30 border-muted space-y-4">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-primary" />
                                    YouTube Data API
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <input type="password" className="input" placeholder="API Key" />
                                    <input type="text" className="input" placeholder="Channel ID" />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-6">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold mb-1">Review & Launch</h2>
                                <p className="text-sm text-muted-foreground">
                                    Confirm your settings before activation
                                </p>
                            </div>

                            <div className="card p-5 bg-muted/30 border-muted space-y-3">
                                <div>
                                    <p className="text-xs text-muted-foreground">Website</p>
                                    <p className="font-medium">{formData.websiteUrl || 'Not provided'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Brand</p>
                                    <p className="font-medium">{formData.brandName || 'Not provided'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Industry</p>
                                    <p className="font-medium">{formData.industry || 'Not provided'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Connected Platforms</p>
                                    <div className="flex flex-wrap gap-2 mt-1.5">
                                        {Object.entries(formData.socialMedia || {}).filter(([, v]) => v).map(([key]) => (
                                            <span key={key} className="badge badge-secondary capitalize">
                                                {key}
                                            </span>
                                        ))}
                                        {Object.values(formData.socialMedia || {}).filter(Boolean).length === 0 && (
                                            <span className="text-sm text-muted-foreground">None configured</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="card p-5 bg-primary/5 border-primary/20">
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="font-semibold mb-1">AI Disclosure</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            All content will include: "Generated with AI assistance and reviewed by
                                            human editors for E-E-A-T compliance."
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="card p-5 bg-success/5 border-success/20">
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="font-semibold mb-1">Gradual Velocity Enabled</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Month 1: 10 items • Month 2: 20 items • Month 3: 40 items
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Mimics natural growth to prevent spam detection
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8 pt-6 border-t border-border">
                        {step > 1 ? (
                            <button onClick={() => setStep(step - 1)} className="btn-ghost btn-md">
                                <ChevronLeft className="w-4 h-4 mr-2" />
                                Back
                            </button>
                        ) : (
                            <div />
                        )}

                        {step < 4 ? (
                            <button onClick={() => setStep(step + 1)} className="btn-primary btn-md ml-auto">
                                Continue
                                <ChevronRight className="w-4 h-4 ml-2" />
                            </button>
                        ) : (
                            <button onClick={handleSubmit} className="btn-primary btn-md ml-auto">
                                <Sparkles className="w-4 h-4 mr-2" />
                                Launch Engine
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
