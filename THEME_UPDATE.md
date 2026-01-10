# Theme Update Documentation

## Overview
This document describes the comprehensive theme update that transitions the Sifthr application to a clean white and near-black color scheme with support for both light and dark modes.

## Changes Made

### 1. Global Styles (`src/app/globals.css`)

#### Color Variables
The CSS has been updated with new color variables that automatically switch based on the theme mode:

**Light Mode (Default):**
- Background: `#ffffff` (pure white)
- Text: `#1a1a1a` (near-black)
- Navbar: Semi-transparent white with blur effect
- Cards: White with subtle gray borders
- Borders: Light gray (`#e5e5e5`)

**Dark Mode:**
- Background: `#1a1a1a` (near-black)
- Text: `#ffffff` (white)
- Navbar: Semi-transparent dark with blur effect
- Cards: Dark gray with subtle borders
- Borders: Medium gray (`#404040`)

#### Key CSS Variables

```css
/* Light Mode */
--bg: #ffffff;
--text: #1a1a1a;
--text-secondary: #666666;
--nav-bg: rgba(255, 255, 255, 0.8);
--nav-text: #1a1a1a;
--card-bg: #ffffff;
--border-color: #e5e5e5;

/* Dark Mode */
--bg: #1a1a1a;
--text: #ffffff;
--text-secondary: #a0a0a0;
--nav-bg: rgba(26, 26, 26, 0.8);
--nav-text: #ffffff;
--card-bg: #2a2a2a;
--border-color: #404040;
```

**Accent Colors (Same for both modes):**
- Lime: `rgb(200, 229, 36)`
- Blue: `rgb(131, 165, 240)`
- Purple: `rgb(153, 85, 235)`
- Yellow: `rgb(237, 183, 77)`
- Red: `rgb(235, 102, 102)`
- Green: `rgb(111, 177, 138)`

### 2. Navbar Component (`src/app/components/Navbar.tsx`)

#### Changes:
- Updated dropdown menu to use CSS variables instead of Tailwind dark mode classes
- Replaced hardcoded colors with `var(--card-bg)`, `var(--text)`, etc.
- Added inline hover effects using CSS variables
- Improved accessibility with proper color transitions
- Added ThemeToggle component integration

#### Dropdown Menu Styling:
```tsx
style={{
  backgroundColor: "var(--card-bg)",
  border: "1px solid var(--border-color)",
  color: "var(--text)"
}}
```

### 3. ThemeToggle Component (NEW)

Created a reusable theme toggle button component:

**Location:** `src/app/components/ThemeToggle/`

**Files:**
- `ThemeToggle.tsx` - Main component
- `ThemeToggle.module.css` - Styles
- `index.tsx` - Export

**Features:**
- Moon icon (🌙) for light mode → switches to dark
- Sun icon (☀️) for dark mode → switches to light
- Optional label display
- Smooth animations and hover effects
- Accessible with proper ARIA labels

**Usage:**
```tsx
import ThemeToggle from "@/app/components/ThemeToggle";

// Simple usage
<ThemeToggle />

// With label
<ThemeToggle showLabel={true} />

// With custom className
<ThemeToggle className="my-custom-class" />
```

### 4. Navbar Styling

#### Updated Styles:
- Clean border-bottom using CSS variables
- Backdrop blur effect with semi-transparent background
- Smooth color transitions on theme change (0.3s ease)
- Improved link hover effects with purple accent
- Brand icon maintains lime/purple color scheme

#### Navigation Links:
```css
.nav-link {
  color: var(--nav-text);
  font-weight: 500;
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: var(--purple);
}
```

### 5. Footer Component

The footer now uses CSS variables for automatic theme switching:
- Background: `var(--card-bg)`
- Text: `var(--text)`
- Border: `var(--border-color)`
- Smooth transitions on theme change

## Theme Context

The theme system uses React Context (`src/app/context/ThemeContext.tsx`):

**API:**
- `theme`: Current theme ("light" | "dark")
- `toggleTheme()`: Toggle between light and dark
- `setTheme(theme)`: Set specific theme

**Usage:**
```tsx
import { useTheme } from "@/app/context/ThemeContext";

function MyComponent() {
  const { theme, toggleTheme, setTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      Current theme: {theme}
    </button>
  );
}
```

## Settings Page

The settings page (`src/app/(logged-in)/settings/page.tsx`) provides UI for theme selection:
- Light Mode button with sun icon (☀️)
- Dark Mode button with moon icon (🌙)
- Visual indication of active theme
- Automatic persistence to localStorage

## Benefits

1. **Consistency**: All components use the same CSS variables
2. **Maintainability**: Change colors in one place (globals.css)
3. **Accessibility**: High contrast ratios in both modes
4. **Performance**: CSS variables are native and fast
5. **User Experience**: Smooth transitions and modern design
6. **Flexibility**: Easy to add new themes or adjust colors

## Testing

To test the theme system:

1. **Manual Testing:**
   - Click the theme toggle button in the navbar
   - Visit the Settings page and toggle themes
   - Verify all components update correctly
   - Check that preference persists on page reload

2. **Visual Testing:**
   - Navbar should have proper contrast
   - Dropdown menus should be readable
   - Cards should maintain proper shadows/borders
   - Text should be legible in both modes

3. **Browser Testing:**
   - Test in Chrome, Firefox, Safari
   - Verify backdrop-filter blur works
   - Check for any CSS variable fallback issues

## Future Enhancements

Possible improvements:
1. Add system preference detection (prefers-color-scheme)
2. Add auto-switch based on time of day
3. Create additional theme variants (high contrast, etc.)
4. Add theme transition animations
5. Implement theme preview in settings

## Migration Notes

**For Developers:**
- Always use CSS variables for colors: `var(--text)`, `var(--bg)`, etc.
- Avoid hardcoded colors or Tailwind dark mode utilities
- New components should follow the established pattern
- Test components in both light and dark modes

**Breaking Changes:**
- None - existing components continue to work
- Old dark mode classes removed where present
- All color references now use CSS variables

## Resources

- CSS Variables: https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties
- Color Contrast: https://webaim.org/resources/contrastchecker/
- Backdrop Filter: https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter

---

**Last Updated:** January 2025
**Version:** 2.0
**Status:** ✅ Complete