import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemeType = 'light' | 'blue' | 'green' | 'purple';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  getThemeColors: () => {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    bg: string;
    card: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themeColors = {
  light: {
    primary: 'bg-blue-600 hover:bg-blue-700',
    secondary: 'bg-gray-100',
    accent: 'text-blue-600',
    text: 'text-gray-900',
    bg: 'bg-gray-50',
    card: 'bg-white',
  },
  blue: {
    primary: 'bg-blue-600 hover:bg-blue-700',
    secondary: 'bg-blue-100',
    accent: 'text-blue-600',
    text: 'text-blue-900',
    bg: 'bg-blue-50',
    card: 'bg-blue-50 border border-blue-200',
  },
  green: {
    primary: 'bg-green-600 hover:bg-green-700',
    secondary: 'bg-green-100',
    accent: 'text-green-600',
    text: 'text-green-900',
    bg: 'bg-green-50',
    card: 'bg-green-50 border border-green-200',
  },
  purple: {
    primary: 'bg-purple-600 hover:bg-purple-700',
    secondary: 'bg-purple-100',
    accent: 'text-purple-600',
    text: 'text-purple-900',
    bg: 'bg-purple-50',
    card: 'bg-purple-50 border border-purple-200',
  },
};

const applyThemeToDOM = (newTheme: ThemeType) => {
  // Remove all theme classes
  document.documentElement.classList.remove('theme-light', 'theme-blue', 'theme-green', 'theme-purple');
  document.body.classList.remove('theme-light', 'theme-blue', 'theme-green', 'theme-purple');
  
  // Add new theme class
  document.documentElement.classList.add(`theme-${newTheme}`);
  document.body.classList.add(`theme-${newTheme}`);
  
  // Also set data attribute for CSS
  document.documentElement.setAttribute('data-theme', newTheme);
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeType>('light');
  const [isReady, setIsReady] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('crmTheme') as ThemeType | null;
    if (savedTheme && Object.keys(themeColors).includes(savedTheme)) {
      setThemeState(savedTheme);
      applyThemeToDOM(savedTheme);
    } else {
      applyThemeToDOM('light');
    }
    setIsReady(true);
  }, []);

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    localStorage.setItem('crmTheme', newTheme);
    applyThemeToDOM(newTheme);
    console.log('Thème changé en:', newTheme);
  };

  const getThemeColors = () => themeColors[theme];

  // Always provide the context, even if not ready yet
  return (
    <ThemeContext.Provider value={{ theme, setTheme, getThemeColors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
