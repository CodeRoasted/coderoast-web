# Theming

## System

Dark/light mode is controlled via the `'class'` strategy in Tailwind (`darkMode: 'class'` in `tailwind.config.ts`).  
When `theme === 'dark'`, Zustand's `toggleTheme` adds the `dark` class to `<html>`. Tailwind then applies all `dark:` variants.

Initial theme is detected from `window.matchMedia('(prefers-color-scheme: dark)')` on first load.

## Brand Palette

Defined in `tailwind.config.ts` as a custom `brand` color scale:

| Token | Hex | Usage |
|---|---|---|
| `brand-400` | `#fab63c` | Hover accents, dark mode highlights |
| `brand-500` | `#f9a825` | Primary brand color, buttons, gradients |
| `brand-600` | `#f57f17` | Text links, active states |
| `brand-700` | `#ef6c00` | Logo gradient end, dark shadows |

Use these via Tailwind classes: `bg-brand-500`, `text-brand-600`, `border-brand-400`, etc.

## Adding a New Color

```ts
// tailwind.config.ts → theme.extend.colors
myColor: {
  500: '#your-hex',
  ...
}
```

## Dark Mode in Components

Always pair light and dark variants:

```tsx
// Good
className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white"

// Bad — light mode only
className="bg-white text-gray-900"
```

The `transition-colors duration-300` class on the root `<div>` in `App.tsx` smooths all theme switches without needing per-component transitions.

## Custom Animations

Three custom keyframe animations are registered in `tailwind.config.ts`:

| Class | Effect |
|---|---|
| `animate-float` | Gentle vertical bob (6 s loop) |
| `animate-glow` | Pulsing box-shadow in brand color |
| `animate-slide-up` | One-shot slide-up entrance |

Framer Motion is preferred for complex/scroll-triggered animations; Tailwind animations for simple, always-on effects.
