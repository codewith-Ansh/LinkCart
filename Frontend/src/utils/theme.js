// Simple theme utility for student-friendly implementation
export const initializeTheme = () => {
    // Get saved theme from localStorage or default to 'light'
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Apply theme to body
    document.body.className = savedTheme;
    
    return savedTheme;
};

export const saveTheme = (theme) => {
    // Save theme to localStorage
    localStorage.setItem('theme', theme);
    
    // Apply theme to body
    document.body.className = theme;
};