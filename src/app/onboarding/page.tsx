'use client';

import OnboardingForm from '@/components/OnboardingForm';
import { OnboardingData } from '@/types';

export default function OnboardingPage() {
    const handleComplete = (data: OnboardingData) => {
        console.log('Onboarding completed:', data);
        // In production, this would save to backend/database
        localStorage.setItem('onboardingData', JSON.stringify(data));
    };

    return <OnboardingForm onComplete={handleComplete} />;
}
