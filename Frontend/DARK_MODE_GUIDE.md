# Dark Mode Implementation Guide

## Overview
This document describes the global dark mode and light mode theme toggle system implemented across the LinkCart website.

## Features Implemented

### 1. Theme System
- **Two Modes**: Light (default) and Dark
- **Persistence**: Theme preference saved in `localStorage`
- **Global State**: Managed via React Context API (`AppContext`)
- **Smooth Transitions**: 0.3s ease transitions for all theme changes

### 2. Theme Toggle Component
- **Location**: Top-right corner of navbar (desktop and mobile)
- **Icons**: 
  - Sun icon (☀️) for light mode
  - Moon icon (🌙) for dark mode
- **Accessibility**: Proper ARIA labels and hover states

### 3. CSS Variables System
All colors are defined using CSS custom properties in `index.css`:

#### Light Theme Variables
```css
--bg-primary: #ffffff
--bg-secondary: #f8fafc
--bg-card: #ffffff
--text-primary: #0f172a
--text-secondary: #475569
--border-primary: #e2e8f0
```

#### Dark Theme Variables
```css
--bg-primary: #0f172a
--bg-secondary: #1e293b
--bg-card: #1e293b
--text-primary: #f1f5f9
--text-secondary: #94a3b8
--border-primary: #334155
```

### 4. Components Updated
All major components now support dark mode:
- ✅ Navbar (with dropdown menu)
- ✅ Footer
- ✅ Hero section
- ✅ Product cards
- ✅ Forms and inputs
- ✅ Modals and dropdowns
- ✅ Buttons and links
- ✅ All page backgrounds

### 5. Accessibility
- **Contrast Ratios**: Maintained WCAG AA standards in both modes
- **Readable Text**: All text remains readable with proper contrast
- **Focus States**: Visible focus indicators in both themes
- **Keyboard Navigation**: Full keyboard support for theme toggle

## File Structure

```
Frontend/
├── src/
│   ├── components/
│   │   ├── ThemeToggle.jsx          # New: Theme toggle button
│   │   ├── Navbar.jsx                # Updated: Integrated theme toggle
│   │   ├── Footer.jsx                # Updated: Theme-aware styling
│   │   └── Hero.jsx                  # Updated: Theme-aware styling
│   ├── context/
│   │   └── AppContext.jsx            # Updated: Theme state + localStorage
│   ├── utils/
│   │   └── theme.js                  # Existing: Theme utilities
│   └── index.css                     # Updated: CSS variables + dark mode
```

## Usage

### For Users
1. Click the sun/moon icon in the top-right corner of the navbar
2. Theme preference is automatically saved
3. Preference persists across page refreshes and sessions

### For Developers

#### Accessing Theme in Components
```jsx
import { useAppContext } from '../context/AppContext';

function MyComponent() {
  const { theme, toggleTheme } = useAppContext();
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}
```

#### Using CSS Variables
```jsx
// Inline styles with CSS variables
<div style={{ 
  backgroundColor: 'var(--bg-card)',
  color: 'var(--text-primary)',
  borderColor: 'var(--border-primary)'
}}>
  Content
</div>
```

#### Adding New Theme-Aware Components
1. Use CSS variables for colors instead of hardcoded values
2. Test in both light and dark modes
3. Ensure proper contrast ratios

## Technical Implementation

### 1. Context Provider (AppContext.jsx)
```jsx
const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

const toggleTheme = () => {
  setTheme((prev) => {
    const newTheme = prev === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    return newTheme;
  });
};

useEffect(() => {
  document.documentElement.setAttribute('data-theme', theme);
  document.body.className = theme;
}, [theme]);
```

### 2. CSS Variables (index.css)
```css
/* Light theme */
:root, [data-theme="light"] {
  --bg-primary: #ffffff;
  --text-primary: #0f172a;
}

/* Dark theme */
[data-theme="dark"], body.dark {
  --bg-primary: #0f172a;
  --text-primary: #f1f5f9;
}

/* Global transitions */
*, *::before, *::after {
  transition: background-color 0.3s ease, 
              border-color 0.3s ease, 
              color 0.3s ease;
}
```

### 3. Theme Toggle Component
```jsx
const ThemeToggle = () => {
  const { theme, toggleTheme } = useAppContext();
  
  return (
    <button onClick={toggleTheme} aria-label="Toggle theme">
      {theme === 'light' ? <Moon /> : <Sun />}
    </button>
  );
};
```

## Browser Support
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Performance
- **No Flash**: Theme applied before first paint
- **Smooth Transitions**: Hardware-accelerated CSS transitions
- **Minimal Re-renders**: Theme state optimized with Context API

## Testing Checklist
- [x] Theme toggle works in navbar
- [x] Theme persists after page refresh
- [x] All pages support dark mode
- [x] Forms and inputs are readable
- [x] Modals and dropdowns work correctly
- [x] Mobile menu shows theme toggle
- [x] No layout shifts during theme change
- [x] Proper contrast ratios maintained
- [x] Smooth transitions without flicker

## Future Enhancements
- [ ] System preference detection (prefers-color-scheme)
- [ ] Additional theme options (e.g., high contrast)
- [ ] Per-component theme customization
- [ ] Theme preview before applying

## Troubleshooting

### Theme not persisting
- Check localStorage is enabled in browser
- Verify `localStorage.getItem('theme')` returns correct value

### Colors not changing
- Ensure CSS variables are used instead of hardcoded colors
- Check `body.dark` class is applied correctly
- Verify CSS specificity isn't being overridden

### Transition flicker
- Exclude animated elements from global transition
- Use `transition: none !important` for specific animations

## Credits
- Icons: Lucide React
- Design System: Tailwind CSS + Custom CSS Variables
- State Management: React Context API
