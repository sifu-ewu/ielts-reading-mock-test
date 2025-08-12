import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export type Theme = 'light' | 'dark';

export const useTheme = () => {
  const { user, updatePreferences } = useAuth();
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // Initialize theme from user preferences or system preference
    const initializeTheme = () => {
      if (user?.preferences.darkMode) {
        setTheme('dark');
      } else if (!user && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
      } else {
        setTheme('light');
      }
    };

    initializeTheme();
  }, [user]);

  useEffect(() => {
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    // Save preference if user is logged in
    if (user) {
      await updatePreferences({ darkMode: newTheme === 'dark' });
    }
  };

  return { theme, toggleTheme };
};