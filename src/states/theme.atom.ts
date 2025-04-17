import { atom, useAtom } from 'jotai';
import { ThemeMode } from '../types/theme.types';

// Create the theme atom
export const themeAtom = atom<ThemeMode>('light');

// Custom hook for theme management
export const useTheme = () => {
  const [theme, setTheme] = useAtom(themeAtom);

  const toggleTheme = () => {
    setTheme((prevTheme: string) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return { theme, setTheme, toggleTheme };
};
