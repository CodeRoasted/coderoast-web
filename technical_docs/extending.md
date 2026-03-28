# Extending the Website

## Adding a New App Card

1. **Add translations** in `src/i18n/translations.ts` under both `en.portfolio` and `fr.portfolio`:

```ts
myApp: {
  name: 'MyApp',
  description: 'What it does, in plain language.',
  status: 'Active',   // 'Active' | 'In Development' | 'Coming Soon'
},
```

2. **Add the card entry** in `src/components/Portfolio.tsx`:

```tsx
import { Terminal } from 'lucide-react'   // pick any lucide icon

const apps = [
  // ... existing entries
  {
    ...t.portfolio.myApp,
    icon: <Terminal className="w-6 h-6" />,
    gradient: 'from-sky-500 to-blue-600',   // any Tailwind gradient
  },
]
```

That's it — `AppCard` renders status badge, animations, and hover effects automatically.

## Adding a New Page

1. Create `src/pages/MyPage.tsx`:

```tsx
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function MyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* content */}
      </main>
      <Footer />
    </>
  )
}
```

2. Add a lazy route in `src/App.tsx`:

```tsx
const MyPage = lazy(() => import('@/pages/MyPage'))
// inside <Routes>:
<Route path="/my-page" element={<MyPage />} />
```

3. Add a nav link in `src/components/Navbar.tsx` and translation keys for the label.

## Adding a Nav Link

In `src/components/Navbar.tsx`, add to the `navLinks` array:

```ts
{ key: 'myPage' as const, href: '/my-page' }
```

Then add `myPage: 'My Page'` (and its French equivalent) under `nav` in both locales in `translations.ts`.

## Inserting a Dynamic Demo

`AppCard.tsx` contains a clearly marked comment where an interactive demo widget can be mounted:

```tsx
{/* TODO: Insert dynamic demo component here for live in-browser testing */}
```

Drop a sandboxed `<iframe>` or a React component there. The card layout will accommodate it.

## Inserting a Payment Integration

`Licensing.tsx` contains a comment per plan card:

```tsx
{/* TODO: Insert pricing and payment integration here */}
```

Replace the placeholder `<div>` with a Stripe, Paddle, or Lemon Squeezy component.
