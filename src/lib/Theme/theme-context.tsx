'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
    isDark: boolean;
    toggleTheme: () => void;
    theme: {
        bg: {
            primary: string;
            secondary: string;
            tertiary: string;
            hover: string;
            active: string;
        };
        text: {
            primary: string;
            secondary: string;
            tertiary: string;
            inverse: string;
        };
        border: {
            primary: string;
            secondary: string;
            focus: string;
        };
        accent: {
            primary: string;
            secondary: string;
            hover: string;
        };
        hover: string;
    };
}

const lightTheme = {
    bg: {
        primary: 'bg-white',
        secondary: 'bg-gray-50',
        tertiary: 'bg-gray-100',
        hover: 'hover:bg-gray-100',
        active: 'bg-gray-200'
    },
    text: {
        primary: 'text-gray-900',
        secondary: 'text-gray-600',
        tertiary: 'text-gray-400',
        inverse: 'text-white'
    },
    border: {
        primary: 'border-gray-200',
        secondary: 'border-gray-300',
        focus: 'border-black'
    },
    accent: {
        primary: 'bg-black',
        secondary: 'bg-gray-800',
        hover: 'hover:bg-gray-800'
    },
    hover: 'hover:bg-gray-100'
};

const darkTheme = {
    bg: {
        primary: 'bg-black',
        secondary: 'bg-gray-900',
        tertiary: 'bg-gray-800',
        hover: 'hover:bg-gray-800',
        active: 'bg-gray-700'
    },
    text: {
        primary: 'text-white',
        secondary: 'text-gray-300',
        tertiary: 'text-gray-500',
        inverse: 'text-black'
    },
    border: {
        primary: 'border-gray-800',
        secondary: 'border-gray-700',
        focus: 'border-white'
    },
    accent: {
        primary: 'bg-white',
        secondary: 'bg-gray-200',
        hover: 'hover:bg-gray-300'
    },
    hover: 'hover:bg-gray-800'
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [isDark, setIsDark] = useState(true); // Default to dark mode

    useEffect(() => {
        // Load theme preference from localStorage
        const saved = localStorage.getItem('theme');
        if (saved) {
            setIsDark(saved === 'dark');
        } else {
            // Default to system preference
            setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    };

    const theme = isDark ? darkTheme : lightTheme;

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme, theme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
} 