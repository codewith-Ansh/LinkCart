const THEME_KEY = 'theme';

const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
};

export const initializeTheme = () => {
    const storedTheme = localStorage.getItem(THEME_KEY);
    const nextTheme =
        storedTheme === 'light' || storedTheme === 'dark'
            ? storedTheme
            : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    applyTheme(nextTheme);
    return nextTheme;
};

export const saveTheme = (theme) => {
    localStorage.setItem(THEME_KEY, theme);
    applyTheme(theme);
};
