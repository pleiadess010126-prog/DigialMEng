'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    email: string;
    name: string;
}

interface AuthTokens {
    accessToken: string;
    idToken: string;
    refreshToken: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
    signOut: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Load user from localStorage on mount
    useEffect(() => {
        const loadUser = () => {
            try {
                const storedUser = localStorage.getItem('user');
                const storedTokens = localStorage.getItem('tokens');

                if (storedUser && storedTokens) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error('Failed to load user:', error);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const signIn = async (email: string, password: string) => {
        try {
            const response = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.success) {
                // Store user and tokens
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('tokens', JSON.stringify(data.tokens));
                setUser(data.user);

                return { success: true };
            }

            return { success: false, error: data.error || 'Sign in failed' };
        } catch (error: any) {
            console.error('Sign in error:', error);
            return { success: false, error: error.message || 'Sign in failed' };
        }
    };

    const signUp = async (email: string, password: string, name: string) => {
        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, name }),
            });

            const data = await response.json();

            if (data.success) {
                return { success: true };
            }

            return { success: false, error: data.error || 'Sign up failed' };
        } catch (error: any) {
            console.error('Sign up error:', error);
            return { success: false, error: error.message || 'Sign up failed' };
        }
    };

    const signOut = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('tokens');
        setUser(null);
        router.push('/auth/signin');
    };

    const value = {
        user,
        loading,
        signIn,
        signUp,
        signOut,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
