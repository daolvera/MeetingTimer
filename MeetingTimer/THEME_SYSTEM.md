# Theme System Documentation

## Overview

The MeetingHelper application includes a comprehensive theming system that supports light, dark, and automatic (system preference) themes with persistent user preferences.

## Features

### Theme Options
- **Light Theme**: Clean, bright interface optimized for daylight viewing
- **Dark Theme**: Dark interface optimized for low-light environments
- **Auto Theme**: Automatically follows system preference (`prefers-color-scheme`)

### User Interface
- **Theme Toggle Button**: Located in the navigation bar (top-right)
- **Three-State Cycle**: Light → Dark → Auto → Light (repeats)
- **Visual Indicators**: 
  - ☀️ Sun icon for light theme
  - 🌙 Moon icon for dark theme  
  - ⚪ Half-circle icon for auto theme
- **Tooltips**: Descriptive tooltips show current state and next action

### Accessibility
- **WCAG 2.1 AA Compliance**: All color combinations meet contrast requirements
- **High Contrast Support**: Enhanced contrast for users with `prefers-contrast: high`
- **Reduced Motion**: Respects `prefers-reduced-motion: reduce` setting
- **Screen Reader Support**: Full ARIA labels and descriptions
- **Keyboard Navigation**: Theme toggle is keyboard accessible

## Implementation Details

### Core Components

#### ThemeService (`src/app/core/_services/theme.service.ts`)
- Manages theme state using RxJS BehaviorSubject
- Handles localStorage persistence
- Detects and responds to system theme changes
- Applies themes via CSS classes and Bootstrap data attributes

#### ThemeToggleComponent (`src/app/core/components/theme-toggle/`)
- Standalone Angular component for theme switching
- Animated icons with hover effects
- Accessible button implementation
- Responsive design

### CSS Architecture

#### Custom Properties
The system uses CSS custom properties for consistent theming:

```scss
:root {
  // Light theme variables
  --theme-bg-primary: #ffffff;
  --theme-text-primary: #212529;
  --theme-warning-bg: #fff3cd;
  --theme-danger-bg: #f8d7da;
  // ... more variables
}

.theme-dark {
  // Dark theme overrides
  --theme-bg-primary: #212529;
  --theme-text-primary: #ffffff;
  --theme-warning-bg: #664d03;
  --theme-danger-bg: #842029;
  // ... more overrides
}
```

#### Bootstrap Integration
- Uses `data-bs-theme` attribute for Bootstrap component compatibility
- Maintains Bootstrap's semantic color system
- Overrides with theme-specific variables where needed

### Timer-Specific Features

#### Alert Colors
Timer warnings and alerts are theme-aware:
- **Warning alerts**: Yellow/amber in light theme, darker amber in dark theme
- **Danger alerts**: Red in light theme, darker red in dark theme
- **Success alerts**: Green in light theme, darker green in dark theme

## Usage

### For Developers

#### Adding New Components
When creating new components, use theme variables:

```scss
.my-component {
  background-color: var(--theme-bg-secondary);
  color: var(--theme-text-primary);
  border-color: var(--theme-border-color);
}
```

#### Accessing Theme Service
```typescript
import { ThemeService, Theme } from './core/_services/theme.service';

export class MyComponent {
  private themeService = inject(ThemeService);
  
  // Get current theme
  currentTheme = this.themeService.currentTheme;
  
  // Listen to theme changes
  theme$ = this.themeService.currentTheme$;
  
  // Set specific theme
  setTheme(theme: Theme) {
    this.themeService.setTheme(theme);
  }
}
```

#### Theme-Specific Styling
Use CSS context selectors for theme-specific styles:

```scss
:host-context(.theme-light) .my-element {
  // Light theme styles
}

:host-context(.theme-dark) .my-element {
  // Dark theme styles
}
```

### For Users

#### How to Change Themes
1. Look for the circular theme toggle button in the top-right of the navigation
2. Click to cycle through: Auto → Light → Dark → Auto
3. Your preference is automatically saved and will persist across sessions

#### Theme Behavior
- **Auto Mode**: Follows your system/browser theme preference
- **Manual Modes**: Overrides system preference until changed
- **Persistence**: Theme choice is remembered between visits

## Browser Support

### Required Features
- CSS Custom Properties (supported in all modern browsers)
- `prefers-color-scheme` media query (for auto theme)
- localStorage (for persistence)

### Fallbacks
- Graceful degradation to light theme if features unavailable
- Manual theme switching still works without system preference detection

## Future Enhancements

### Planned Features
- **Custom Brand Colors**: Support for organization-specific color schemes
- **Theme Preview**: Settings page with theme previews
- **Additional Variants**: High contrast themes, accessibility-focused variants
- **Animation Controls**: User preference for reduced motion

### Extension Points
The system is designed for easy extension:

```typescript
// Add new theme variants
export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  AUTO = 'auto',
  HIGH_CONTRAST = 'high-contrast', // Future
  CUSTOM = 'custom' // Future
}
```

## Troubleshooting

### Common Issues

#### Theme not persisting
- Check browser localStorage support
- Verify no browser extensions blocking localStorage

#### Colors not updating
- Ensure CSS custom properties are supported
- Check for conflicting CSS rules with higher specificity

#### System theme not detected
- Verify browser supports `prefers-color-scheme`
- Check system theme settings are configured

### Debug Information
The theme service logs theme changes in development mode. Check browser console for debugging information.