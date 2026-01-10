# Theme System Quick Reference

## 🎨 Color Variables

### Usage
Always use CSS variables for colors to ensure automatic theme switching:

```css
color: var(--text);
background-color: var(--bg);
border: 1px solid var(--border-color);
```

### Available Variables

#### Basic Colors
| Variable | Light Mode | Dark Mode | Usage |
|----------|------------|-----------|-------|
| `--bg` | `#ffffff` | `#1a1a1a` | Main background |
| `--text` | `#1a1a1a` | `#ffffff` | Primary text |
| `--text-secondary` | `#666666` | `#a0a0a0` | Secondary text |

#### Navigation
| Variable | Light Mode | Dark Mode | Usage |
|----------|------------|-----------|-------|
| `--nav-bg` | `rgba(255,255,255,0.8)` | `rgba(26,26,26,0.8)` | Navbar background |
| `--nav-text` | `#1a1a1a` | `#ffffff` | Navbar text |
| `--nav-border` | `rgba(0,0,0,0.1)` | `rgba(255,255,255,0.1)` | Navbar border |

#### Cards & UI Elements
| Variable | Light Mode | Dark Mode | Usage |
|----------|------------|-----------|-------|
| `--card-bg` | `#ffffff` | `#2a2a2a` | Card background |
| `--card-bg-highlight` | `#f5f5f5` | `#333333` | Hover/active state |
| `--border-color` | `#e5e5e5` | `#404040` | All borders |
| `--box-bg` | `#ffffff` | `#242424` | Box containers |

#### Accent Colors (Same in both modes)
| Variable | Color | Hex |
|----------|-------|-----|
| `--lime` | 🟢 | `rgb(200, 229, 36)` |
| `--purple` | 🟣 | `rgb(153, 85, 235)` |
| `--blue` | 🔵 | `rgb(131, 165, 240)` |
| `--yellow` | 🟡 | `rgb(237, 183, 77)` |
| `--red` | 🔴 | `rgb(235, 102, 102)` |
| `--green` | 🟢 | `rgb(111, 177, 138)` |

## 🔧 Using the Theme Context

### Import
```tsx
import { useTheme } from "@/app/context/ThemeContext";
```

### Basic Usage
```tsx
function MyComponent() {
  const { theme, toggleTheme, setTheme } = useTheme();
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <button onClick={() => setTheme("light")}>Light Mode</button>
      <button onClick={() => setTheme("dark")}>Dark Mode</button>
    </div>
  );
}
```

## 🎛️ Theme Toggle Component

### Import
```tsx
import ThemeToggle from "@/app/components/ThemeToggle";
```

### Usage Examples

#### Basic (icon only)
```tsx
<ThemeToggle />
```

#### With Label
```tsx
<ThemeToggle showLabel={true} />
```

#### With Custom Class
```tsx
<ThemeToggle className="my-custom-class" />
```

## 📝 Best Practices

### ✅ DO
```tsx
// Use CSS variables
<div style={{ backgroundColor: "var(--card-bg)" }}>Content</div>

// Use inline styles with variables
<p style={{ color: "var(--text)" }}>Text</p>

// Use in CSS modules
.myClass {
  background-color: var(--bg);
  color: var(--text);
  border: 1px solid var(--border-color);
}
```

### ❌ DON'T
```tsx
// Don't hardcode colors
<div style={{ backgroundColor: "#ffffff" }}>Content</div>

// Don't use Tailwind dark mode utilities
<div className="bg-white dark:bg-gray-800">Content</div>

// Don't assume a specific mode
<div style={{ color: "black" }}>Text</div>
```

## 🎯 Common Patterns

### Card with Theme Support
```tsx
<div style={{
  backgroundColor: "var(--card-bg)",
  border: "1px solid var(--border-color)",
  borderRadius: "0.5rem",
  padding: "1rem"
}}>
  <h3 style={{ color: "var(--text)" }}>Title</h3>
  <p style={{ color: "var(--text-secondary)" }}>Description</p>
</div>
```

### Button with Hover
```tsx
<button
  style={{
    backgroundColor: "var(--card-bg)",
    color: "var(--text)",
    border: "1px solid var(--border-color)"
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.backgroundColor = "var(--card-bg-highlight)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.backgroundColor = "var(--card-bg)";
  }}
>
  Click Me
</button>
```

### Link with Theme
```tsx
<a 
  href="#"
  style={{ color: "var(--purple)" }}
  className="hover:underline"
>
  Link Text
</a>
```

## 🔍 Testing Themes

### Manual Test Checklist
- [ ] Toggle theme from navbar
- [ ] Toggle theme from settings page
- [ ] Verify all text is readable
- [ ] Check all borders are visible
- [ ] Verify cards have proper contrast
- [ ] Test hover states
- [ ] Check persistence (reload page)
- [ ] Test in different browsers

### Visual Test
Navigate to `/theme-demo` to see all colors and components in action.

## 🐛 Troubleshooting

### Theme not changing?
1. Check if `ThemeProvider` wraps your app in `layout.tsx`
2. Verify CSS variables are defined in `globals.css`
3. Clear browser cache and localStorage
4. Check console for errors

### Colors not updating?
1. Make sure you're using `var(--variable-name)`
2. Check if component is inside `ThemeProvider`
3. Verify the CSS variable exists in both light and dark modes
4. Try hard refresh (Ctrl+Shift+R)

### Persistence not working?
1. Check localStorage is enabled
2. Verify key is `"sifthr-theme"`
3. Check browser privacy settings
4. Test in incognito mode

## 📚 Related Files

- `src/app/globals.css` - Color variable definitions
- `src/app/context/ThemeContext.tsx` - Theme state management
- `src/app/components/ThemeToggle/` - Theme toggle button
- `src/app/(logged-in)/settings/page.tsx` - Settings UI
- `src/app/(logged-in)/theme-demo/page.tsx` - Theme showcase

## 🚀 Quick Start for New Components

1. Import theme if needed:
   ```tsx
   import { useTheme } from "@/app/context/ThemeContext";
   ```

2. Use CSS variables for all colors:
   ```tsx
   <div style={{ color: "var(--text)" }}>Content</div>
   ```

3. Add transitions for smooth theme switching:
   ```css
   transition: background-color 0.3s ease, color 0.3s ease;
   ```

4. Test in both light and dark modes before committing!

---

**Quick Links:**
- [Full Documentation](./THEME_UPDATE.md)
- [Demo Page](/theme-demo)
- [Settings Page](/settings)