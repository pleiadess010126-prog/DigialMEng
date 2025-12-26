'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Sparkles, Shield, Zap, ArrowRight, BarChart3, Layers, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onboardingData = localStorage.getItem('onboardingData');
    if (onboardingData) {
      router.push('/dashboard');
    }
  }, [router]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background gradient-mesh">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-bold">DigitalMEng</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/dashboard')} className="btn-ghost btn-md">
              View Demo
            </button>
            <button onClick={() => router.push('/onboarding')} className="btn-primary btn-md">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4" />
          AI-Powered Marketing Automation
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-fade-in-up">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-[gradient-shift_3s_ease_infinite]">
            Autonomous Organic
          </span>
          <br />
          Marketing Engine
        </h1>

        <p className="text-xl text-muted-foreground mb-4 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          Scale authority and traffic with{' '}
          <span className="text-secondary font-semibold">zero risk</span> of
          traffic cliffs or manual penalties
        </p>

        <p className="text-muted-foreground mb-12 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          Deploy a fully autonomous marketing system powered by Amazon Bedrock,
          advanced SEO strategies, and multi-channel content distribution
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <button
            onClick={() => router.push('/onboarding')}
            className="btn-primary btn-lg group"
          >
            Start Your Campaign
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="btn-secondary btn-lg"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            View Live Demo
          </button>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="card p-6 text-left group hover:shadow-elevated transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <div className="p-3 rounded-xl bg-primary/10 text-primary w-fit mb-4 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">AI Supervisor Agent</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Bedrock-powered orchestration that plans 90-day roadmaps and
              delegates to specialized worker agents automatically
            </p>
          </div>

          <div className="card p-6 text-left group hover:shadow-elevated transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
            <div className="p-3 rounded-xl bg-success/10 text-success w-fit mb-4 group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Risk-Free Growth</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Automated monitoring of indexation rates, bounce rates, and traffic
              patterns to prevent SpamBrain triggers
            </p>
          </div>

          <div className="card p-6 text-left group hover:shadow-elevated transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
            <div className="p-3 rounded-xl bg-secondary/10 text-secondary w-fit mb-4 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Multi-Channel</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Atomize content across WordPress, YouTube Shorts, Instagram Reels,
              and Facebook Stories automatically
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-24 pt-12 border-t border-border">
          <div className="text-center animate-fade-in-up" style={{ animationDelay: '700ms' }}>
            <p className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              90+
            </p>
            <p className="text-sm text-muted-foreground">Day Automation</p>
          </div>
          <div className="text-center animate-fade-in-up" style={{ animationDelay: '800ms' }}>
            <p className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              4+
            </p>
            <p className="text-sm text-muted-foreground">AI Agents</p>
          </div>
          <div className="text-center animate-fade-in-up" style={{ animationDelay: '900ms' }}>
            <p className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Zero
            </p>
            <p className="text-sm text-muted-foreground">Manual Work</p>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-24 pt-12 border-t border-border">
          <p className="text-sm text-muted-foreground mb-6">Powered by</p>
          <div className="flex flex-wrap justify-center items-center gap-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span className="font-semibold">Amazon Bedrock</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span className="font-semibold">AWS Lambda</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span className="font-semibold">Next.js</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="font-semibold">OpenSearch</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
