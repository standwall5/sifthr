# SafeImage Component - Quick Reference Guide

## Overview
The `SafeImage` component is a wrapper around the standard `<img>` element that provides automatic fallback to heroicons when images fail to load or are unavailable.

## Import

```tsx
import SafeImage from "@/app/components/SafeImage";
import { PhotoIcon } from "@heroicons/react/24/outline"; // or any other heroicon
```

## Basic Usage

### Simple Usage (Default Fallback)
```tsx
<SafeImage
  src="/path/to/image.jpg"
  alt="Description"
  style={{ width: "100%", height: "100%", objectFit: "cover" }}
/>
```
**Default fallback:** `PhotoIcon`

### Custom Fallback Icon
```tsx
<SafeImage
  src="/path/to/image.jpg"
  alt="Description"
  fallbackIcon={UserCircleIcon}
  style={{ width: "200px", height: "200px" }}
/>
```

### With Custom Fallback Styling
```tsx
<SafeImage
  src="/path/to/image.jpg"
  alt="Description"
  fallbackIcon={BookOpenIcon}
  fallbackClassName="custom-fallback-class"
  className="image-class"
  style={{ width: "100%", height: "auto" }}
/>
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `src` | `string` | No | - | Image source URL |
| `alt` | `string` | **Yes** | - | Alternative text for accessibility |
| `fallbackIcon` | `React.ComponentType<React.SVGProps<SVGSVGElement>>` | No | `PhotoIcon` | Heroicon to show when image fails |
| `fallbackClassName` | `string` | No | `""` | Additional class for fallback container |
| `className` | `string` | No | `""` | Class for the image element |
| `style` | `React.CSSProperties` | No | - | Inline styles for image/fallback |
| `...props` | `ImgHTMLAttributes` | No | - | Any other standard img attributes |

## Recommended Heroicons by Use Case

```tsx
// User Avatars
import { UserCircleIcon } from "@heroicons/react/24/outline";
<SafeImage src={avatarUrl} alt="User" fallbackIcon={UserCircleIcon} />

// Learning/Educational Content
import { BookOpenIcon } from "@heroicons/react/24/outline";
<SafeImage src={moduleImg} alt="Module" fallbackIcon={BookOpenIcon} />

// Quizzes/Tests
import { AcademicCapIcon } from "@heroicons/react/24/outline";
<SafeImage src={quizImg} alt="Quiz" fallbackIcon={AcademicCapIcon} />

// News/Articles
import { NewspaperIcon } from "@heroicons/react/24/outline";
<SafeImage src={newsImg} alt="News" fallbackIcon={NewspaperIcon} />

// Support/Help
import { LifebuoyIcon } from "@heroicons/react/24/outline";
<SafeImage src={supportImg} alt="Support" fallbackIcon={LifebuoyIcon} />

// Organizations/Companies
import { BuildingOfficeIcon } from "@heroicons/react/24/outline";
<SafeImage src={orgLogo} alt="Org" fallbackIcon={BuildingOfficeIcon} />

// Achievements/Badges
import { SparklesIcon } from "@heroicons/react/24/outline";
<SafeImage src={badgeIcon} alt="Badge" fallbackIcon={SparklesIcon} />

// Generic Images
import { PhotoIcon } from "@heroicons/react/24/outline";
<SafeImage src={genericImg} alt="Image" fallbackIcon={PhotoIcon} />
```

## States

### 1. Loading State
- Shows fallback icon with reduced opacity (0.3)
- Background: `var(--card-bg-highlight)`

### 2. Success State
- Shows the actual image
- Hides loading fallback

### 3. Error State
- Shows fallback icon with normal opacity (0.5)
- Background: `var(--card-bg-highlight)`
- Icon size: 40% of container

## Styling Tips

### Maintain Aspect Ratio
```tsx
<SafeImage
  src={url}
  alt="Content"
  style={{
    width: "100%",
    height: "200px",
    objectFit: "cover",
  }}
/>
```

### Circular Avatar
```tsx
<SafeImage
  src={avatarUrl}
  alt="User"
  fallbackIcon={UserCircleIcon}
  style={{
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    objectFit: "cover",
  }}
/>
```

### Responsive Image
```tsx
<SafeImage
  src={url}
  alt="Content"
  style={{
    width: "100%",
    height: "auto",
    maxWidth: "600px",
  }}
/>
```

## Common Patterns

### Card Image
```tsx
<div className="card-image-container">
  <SafeImage
    src={module.image_url}
    alt={module.title}
    fallbackIcon={BookOpenIcon}
    style={{
      width: "100%",
      height: "200px",
      objectFit: "cover",
    }}
  />
</div>
```

### Profile Picture
```tsx
<SafeImage
  src={user.profile_picture_url || "/assets/images/default-avatar.png"}
  alt={user.name}
  fallbackIcon={UserCircleIcon}
  className={styles.avatar}
/>
```

### Logo Display
```tsx
<SafeImage
  src={organization.logo_url}
  alt={organization.name}
  fallbackIcon={BuildingOfficeIcon}
  style={{
    width: "80px",
    height: "80px",
    objectFit: "contain",
  }}
/>
```

## When to Use

✅ **DO use SafeImage when:**
- Displaying user-uploaded images
- Loading external images (URLs)
- Images that might fail to load
- Dynamic image sources
- Avatar/profile pictures
- Badge/achievement icons
- Organization logos

❌ **DON'T use SafeImage when:**
- Static assets that are bundled (use Next.js Image)
- Images that require optimization features
- Background images (use CSS background with fallback)

## Troubleshooting

### Image not showing
```tsx
// Check if src is defined
<SafeImage
  src={imageUrl || undefined}  // Will show fallback if undefined
  alt="Image"
/>
```

### Fallback not centered
```tsx
// Ensure container has defined dimensions
<div style={{ width: "200px", height: "200px" }}>
  <SafeImage src={url} alt="Image" style={{ width: "100%", height: "100%" }} />
</div>
```

### Custom fallback styling not applied
```tsx
// Use both className and fallbackClassName
<SafeImage
  src={url}
  alt="Image"
  className="image-styles"          // Applied to <img>
  fallbackClassName="fallback-styles" // Applied to fallback container
/>
```

## Accessibility

The component automatically handles:
- Alt text for screen readers
- Title attribute for fallback container
- Semantic HTML structure

Always provide meaningful alt text:
```tsx
// ✅ Good
<SafeImage src={url} alt="User profile picture of John Doe" />

// ❌ Bad
<SafeImage src={url} alt="image" />
```

## Performance Notes

- Component uses React state for loading/error handling
- No external dependencies (except heroicons)
- Lightweight implementation
- Minimal re-renders
- CSS-based transitions

## Migration from Regular <img>

**Before:**
```tsx
<img src={url} alt="Description" className={styles.image} />
```

**After:**
```tsx
<SafeImage
  src={url}
  alt="Description"
  className={styles.image}
  fallbackIcon={PhotoIcon}
/>
```

## Example: Complete Implementation

```tsx
import SafeImage from "@/app/components/SafeImage";
import { BookOpenIcon } from "@heroicons/react/24/outline";

function ModuleCard({ module }) {
  return (
    <div className="module-card">
      <SafeImage
        src={module.image_url}
        alt={module.title}
        fallbackIcon={BookOpenIcon}
        className="module-image"
        style={{
          width: "100%",
          height: "200px",
          objectFit: "cover",
          borderRadius: "8px",
        }}
      />
      <h3>{module.title}</h3>
      <p>{module.description}</p>
    </div>
  );
}
```
