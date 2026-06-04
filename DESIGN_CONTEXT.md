# HOLY SPIRIT CHAPEL ESUT AGBANI — DESIGN.md + CONTEXT.md
> Combined Design System, Architecture & Feature Specification
> Stack locked: Next.js 16.2.7 · Firebase JS SDK 12.14.0 · Cloudinary SDK 2.x · Nodemailer 8.0.10 · Tailwind v4 · Framer Motion v12 · TypeScript 5.x · Vercel
> Authored by: Joshuazaza · Date: June 4, 2026

---

## TABLE OF CONTENTS
1. [Identity & Brand Analysis](#1-identity--brand-analysis)
2. [Color System](#2-color-system)
3. [Typography System](#3-typography-system)
4. [Animation & Motion System](#4-animation--motion-system)
5. [Component Library](#5-component-library)
6. [Page-by-Page Design Spec](#6-page-by-page-design-spec)
7. [Admin Dashboard Spec](#7-admin-dashboard-spec)
8. [Tech Stack & Dependencies](#8-tech-stack--dependencies)
9. [Project Structure](#9-project-structure)
10. [Firestore Schema](#10-firestore-schema)
11. [API Routes](#11-api-routes)
12. [Email System (Nodemailer + Gmail SMTP)](#12-email-system)
13. [Payment System (Paystack + Bank Transfer)](#13-payment-system)
14. [Live Activity System](#14-live-activity-system)
15. [Subscriber System](#15-subscriber-system)
16. [2FA Admin Security](#16-2fa-admin-security)
17. [Logo & Asset Handling](#17-logo--asset-handling)
18. [Build Prompts (Antigravity IDE)](#18-build-prompts)
19. [Skills to Install](#19-skills-to-install)
20. [Version 2 Backlog](#20-version-2-backlog)

---

## 1. IDENTITY & BRAND ANALYSIS

### Dual-Entity Structure
```
HOLY SPIRIT CHAPEL ESUT AGBANI        ← Parent (Chapel)
        └── ANGLICAN STUDENTS'        ← Child (Fellowship)
            FELLOWSHIP ESUT AGBANI
```
The Chapel is the institutional authority. The Fellowship is the student arm operating under it. The website serves both — the Chapel brand dominates, the Fellowship is prominently featured as a sub-identity (especially on About Us and Departments).

### Chapel Logo Analysis (clogo.png)
- Style: Heraldic crest / coat of arms
- Dominant color: Sky Blue / Cyan
- Accents: Magenta (side pillars), Gold/Yellow (crown)
- Imagery: Chapel building silhouette (top), Crown (authority of Christ), Cross (salvation), Radiating light/flames (Holy Spirit)
- Latin motto: **"DOMINUS REGNANT"** — *The Lord Reigns*
- Background: Transparent (dark areas are transparent, not solid black)
- Usage: Works on both light and dark backgrounds

### Fellowship Logo Analysis (flogo.png = Image 4 selected)
- Style: Circular institutional seal
- Color: Deep Crimson / Maroon monochrome
- Imagery: Graduation cap (students), Cross (faith), Open Bible (scripture), Scroll/diploma (knowledge)
- Motto: **"ARISE, SHINE"** (Isaiah 60:1)
- Parent body: The Church of Nigeria (Anglican Communion)
- Usage: Always on white/light backgrounds for seal readability

### Aesthetic Direction: "SACRED MOMENTUM"
> The design language bridges Nigerian Anglican tradition with contemporary campus energy. Majestic but approachable. Reverent but alive. The chapel crest's radiating light motif is the visual signature carried through the entire site as a recurring decorative element.

---

## 2. COLOR SYSTEM

### Primary Palette (from logos, harmonized)

```css
:root {
  /* === CHAPEL BLUE (Primary) === */
  --color-chapel-50:   #EBF6FD;
  --color-chapel-100:  #C8E8F8;
  --color-chapel-200:  #8ED0F1;
  --color-chapel-300:  #4DB5E8;
  --color-chapel-400:  #1E9FD8;   /* ← Direct from chapel logo */
  --color-chapel-500:  #1480B0;
  --color-chapel-600:  #0E6188;
  --color-chapel-700:  #094662;
  --color-chapel-800:  #062E41;
  --color-chapel-900:  #031820;

  /* === DEEP NAVY (Secondary) === */
  --color-navy-500:    #0A2D52;   /* Primary dark backgrounds */
  --color-navy-600:    #071F3A;
  --color-navy-700:    #040F1E;

  /* === CROWN GOLD (Accent Primary) === */
  --color-gold-400:    #FFD23F;
  --color-gold-500:    #F0B429;   /* ← From crown in chapel logo */
  --color-gold-600:    #C8941A;
  --color-gold-700:    #9A6F0C;

  /* === ASF CRIMSON (Accent Secondary) === */
  --color-crimson-500: #8B1A1A;   /* ← From fellowship seal */
  --color-crimson-600: #6B1111;
  --color-crimson-700: #4E0A0A;

  /* === MAGENTA (Accent Tertiary — use sparingly) === */
  --color-magenta-500: #C8005A;   /* ← From chapel logo magenta pillars */
  --color-magenta-400: #E8006A;

  /* === NEUTRAL / SURFACE === */
  --color-ivory:       #F8F7F3;   /* Main background */
  --color-ivory-dark:  #F0EEE8;   /* Card/section bg */
  --color-white:       #FFFFFF;
  --color-text:        #1A1A2E;   /* Primary text */
  --color-text-muted:  #64748B;   /* Secondary text */
  --color-text-light:  #94A3B8;   /* Placeholder / disabled */
  --color-border:      #E4E1D6;   /* Borders */
  --color-border-dark: #C8C4B4;

  /* === SEMANTIC === */
  --color-success:     #16A34A;
  --color-warning:     #D97706;
  --color-error:       #DC2626;
  --color-live:        #EF4444;   /* Live badge red */
  --color-live-glow:   rgba(239,68,68,0.3);
}
```

### Tailwind v4 Config Extension (tailwind.config.ts)
```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        chapel: {
          DEFAULT: '#1E9FD8',
          50: '#EBF6FD', 100: '#C8E8F8', 200: '#8ED0F1',
          300: '#4DB5E8', 400: '#1E9FD8', 500: '#1480B0',
          600: '#0E6188', 700: '#094662', 800: '#062E41', 900: '#031820',
        },
        navy: { 500: '#0A2D52', 600: '#071F3A', 700: '#040F1E' },
        gold:  { 400: '#FFD23F', 500: '#F0B429', 600: '#C8941A', 700: '#9A6F0C' },
        crimson: { 500: '#8B1A1A', 600: '#6B1111' },
        magenta: { 400: '#E8006A', 500: '#C8005A' },
        ivory:   { DEFAULT: '#F8F7F3', dark: '#F0EEE8' },
      },
      fontFamily: {
        display: ['Cinzel', 'serif'],          // Page titles, chapel name
        heading: ['Libre Baskerville', 'serif'], // Section headings
        body:    ['Nunito', 'sans-serif'],      // All body text
        quote:   ['Cormorant Garamond', 'serif'], // Scripture quotes
      },
      boxShadow: {
        'chapel': '0 4px 24px rgba(14,97,136,0.15)',
        'chapel-lg': '0 8px 48px rgba(14,97,136,0.25)',
        'gold': '0 4px 24px rgba(240,180,41,0.30)',
        'live': '0 0 20px rgba(239,68,68,0.50)',
      },
      backgroundImage: {
        'radial-light': 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(30,159,216,0.12) 0%, transparent 70%)',
        'chapel-gradient': 'linear-gradient(135deg, #0A2D52 0%, #1E9FD8 100%)',
        'gold-gradient': 'linear-gradient(135deg, #F0B429 0%, #FFD23F 100%)',
        'hero-overlay': 'linear-gradient(to bottom, rgba(10,45,82,0.7) 0%, rgba(10,45,82,0.4) 50%, rgba(10,45,82,0.8) 100%)',
      },
      animation: {
        'live-pulse': 'livePulse 2s cubic-bezier(0.4,0,0.6,1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'radiate': 'radiate 3s ease-out infinite',
      },
      keyframes: {
        livePulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(239,68,68,0.4)' },
          '50%': { boxShadow: '0 0 0 12px rgba(239,68,68,0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        radiate: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        },
      },
    },
  },
}
export default config
```

---

## 3. TYPOGRAPHY SYSTEM

### Google Fonts Import (layout.tsx)
```ts
import { Cinzel, Cinzel_Decorative, Libre_Baskerville, Nunito, Cormorant_Garamond } from 'next/font/google'

export const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '600', '700', '900'],
  variable: '--font-display',
})
export const libreB = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-heading',
})
export const nunito = Nunito({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-body',
})
export const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-quote',
})
```

### Type Scale
| Token | Font | Size | Weight | Use |
|---|---|---|---|---|
| `text-chapel-name` | Cinzel | 2.5rem–5rem | 700 | "Holy Spirit Chapel" in hero |
| `text-display` | Cinzel | 2rem–3.5rem | 600 | Page hero titles |
| `text-section` | Libre Baskerville | 1.5rem–2.25rem | 700 | Section headings |
| `text-card-title` | Libre Baskerville | 1.125rem–1.375rem | 700 | Card headings |
| `text-body-lg` | Nunito | 1.125rem | 500 | Lead paragraphs |
| `text-body` | Nunito | 1rem | 400 | General body |
| `text-label` | Nunito | 0.75rem–0.875rem | 700 | Labels, badges, nav |
| `text-scripture` | Cormorant Garamond | 1.25rem–1.75rem | 400 italic | Scripture quotes |
| `text-motto` | Cinzel | 0.875rem | 600 | "DOMINUS REGNANT", "ARISE, SHINE" |

---

## 4. ANIMATION & MOTION SYSTEM

### Philosophy
- **Entrance-first**: Hero animations run once on load, not on repeat.
- **Scroll reveals**: Every section fades/slides in on scroll using `useInView`.
- **Sacred, not flashy**: Animations feel dignified. No bouncing or cartoony easing.
- **Performance**: Use `will-change: transform` only on active elements. GPU-only properties (transform, opacity).

### Framer Motion Variants (src/lib/motion.ts)
```ts
import { Variants } from 'framer-motion'

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: 'easeOut' } }
}

export const stagger = (delay = 0.1): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: delay } }
})

export const slideLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
}

export const slideRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: {
    opacity: 1, scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
}

export const cardHover = {
  rest: { scale: 1, y: 0, boxShadow: '0 2px 8px rgba(14,97,136,0.08)' },
  hover: {
    scale: 1.02, y: -4,
    boxShadow: '0 16px 48px rgba(14,97,136,0.20)',
    transition: { duration: 0.3, ease: 'easeOut' }
  }
}

// Hero text reveal — staggered letter/word animation
export const heroReveal: Variants = {
  hidden: { opacity: 0, y: 60, skewY: 2 },
  visible: {
    opacity: 1, y: 0, skewY: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] }
  }
}

// Page transition wrapper
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.25, ease: 'easeIn' } }
}
```

### Scroll-Triggered Section Wrapper
```tsx
// src/components/ui/RevealSection.tsx
'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { fadeUp, stagger } from '@/lib/motion'

export function RevealSection({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      variants={stagger(0.12)}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  )
}
```

### Special Animations
- **Hero particles**: 12–20 small glowing orbs floating up (CSS keyframes, no JS needed)
- **Live badge**: Red pulsing ring + dot (CSS `animation: livePulse`)
- **Department card flip**: 3D Y-axis rotate on hover to show brief description
- **Gallery image**: Scale + desaturate-to-color on hover
- **Announcement ticker**: Infinite horizontal scroll (pure CSS)
- **Counter stats**: Count-up numbers using `useMotionValue` + `useSpring`
- **Cross light rays**: SVG radiating lines on hero section bg (CSS animation)

---

## 5. COMPONENT LIBRARY

### Global Components (src/components/)

#### `<NavBar />`
```
Desktop: Logo left | Links center | "Give" CTA button right
Mobile: Logo left | Hamburger right → Full-screen menu overlay
- Logo: clogo.png (40px height, auto width)
- Active link: Gold underline + chapel-400 color
- Sticky on scroll with blur backdrop: `backdrop-blur-md bg-white/80 border-b border-border`
- CTA Button: "Give" — gold gradient, navy text
- On mobile overlay: Links stacked center with stagger animation
```

#### `<LiveBadge />`
```
Shown ONLY when admin has toggled a service as live.
- Red pulsing dot + "LIVE" text
- Shows activity name: "LIVE · Sunday Service"
- Positioned: nav right side (replaces or sits beside Give button)
- On click: scrolls to or shows a modal with service details
```

#### `<AnnouncementBanner />`
```
If any active announcements exist in Firestore:
- Thin strip below navbar (not dismissable per-session)
- Background: chapel-navy gradient
- Text: white, Nunito 500
- Ticker scroll animation if >2 announcements
```

#### `<SectionHeader />`
```tsx
// Props: title, subtitle, align, badge
// badge = small pill above title e.g. "OUR COMMUNITY"
<div className="text-center space-y-3">
  {badge && <span className="font-label text-chapel-400 tracking-widest uppercase text-xs">{badge}</span>}
  <h2 className="font-heading text-3xl md:text-4xl text-navy-500">{title}</h2>
  {subtitle && <p className="font-body text-text-muted max-w-2xl mx-auto">{subtitle}</p>}
  <div className="w-16 h-1 bg-gold-500 mx-auto rounded-full" /> {/* Decorative divider */}
</div>
```

#### `<DepartmentCard />`
```
Front face: Department image + icon + name
Back face (hover flip): Short description + "View Details →"
Click: Opens DepartmentModal (not navigate)
Design: White card, chapel-blue icon, thin gold top border on hover
```

#### `<EventCard />`
```
Two variants:
1. FEATURED: Large card with bg image, date badge, title, CTA
2. STANDARD: Date badge (month/day in navy box) + category chip + title + time + location
```

#### `<GalleryGrid />`
```
Masonry layout (CSS columns: 2 on mobile, 3 on tablet, 4 on desktop)
Filter tabs: All | Worship | Community | Youth | Architecture (pulled from Firestore tags)
Each image: Cloudinary optimized, hover = scale(1.05) + overlay with category tag
Click: Lightbox modal with prev/next navigation
```

#### `<GiveCard />`
```
Admin-created payment option
Layout: Cover image (Cloudinary) | Title | Description | "Give Now →" button
Hover: Subtle lift + gold border glow
```

#### `<ScriptureQuote />`
```
Full-width section break between page sections
Background: Light ivory with subtle cross watermark (SVG, opacity 0.04)
Quote: Cormorant Garamond italic, large (2rem+)
Reference: Cinzel, small, gold color
```

#### `<FooterSubscribe />`
```
Used in Footer AND Contact page
Input: "Your name" + "Your email" + Subscribe button
On subscribe: Firestore write to `subscribers` collection
Success: Animated checkmark + "You're in! God bless you." message
```

#### `<MapEmbed />`
```
ESUT Agbani, Enugu State — Google Maps iframe embed
Coordinates: approx 6.2833° N, 7.5167° E (ESUT main campus)
Fallback: OpenStreetMap iframe (no API key needed)
"Get Directions" button: href="https://maps.google.com/?q=ESUT+Agbani+Enugu"
Height: 300px mobile, 400px desktop
Border: rounded-xl, chapel shadow
```

---

## 6. PAGE-BY-PAGE DESIGN SPEC

---

### 6.1 HOME PAGE (`/`)

#### Section 1: HERO
```
Type: Full viewport height (100vh)
Background: Dark overlay (hero-overlay gradient) over chapel photo (Cloudinary, admin-uploadable) or fallback gradient (chapel-navy to chapel-blue)
Floating decoration: 
  - SVG cross outline (opacity 0.06) centered behind text
  - 12 animated floating particles (CSS, gold/white dots, slow float upward)
  - Radial light glow at top center (CSS)

Content layout (centered):
  - Small badge: "DOMINUS REGNANT · ARISE, SHINE" [Cinzel, gold, letter-spacing]
  - Chapel name: "HOLY SPIRIT CHAPEL" [Cinzel, 56px desktop / 36px mobile, white, uppercase]
  - Sub-name: "ESUT Agbani" [Cinzel, 20px, chapel-300]
  - Divider: thin gold horizontal line (w-24)
  - Tagline: Short welcome sentence [Libre Baskerville italic, white/80, 18px]
  - CTAs: ["Join Us This Sunday" (primary, gold bg)] + ["Our Departments" (outline, white)]
  - Live badge: Appears above chapel name ONLY when admin toggles a service as live

Animation sequence (Framer Motion, staggered):
  1. Badge fades in (delay: 0s)
  2. Chapel name heroReveal (delay: 0.2s)
  3. Sub-name fadeUp (delay: 0.4s)
  4. Divider width expands (delay: 0.5s)
  5. Tagline fadeUp (delay: 0.6s)
  6. CTAs fadeUp (delay: 0.8s)

Scroll indicator: Animated chevron at bottom center
```

#### Section 2: LIVE ACTIVITY STRIP
```
Shown ONLY when something is live (conditional render based on Firestore `live_status` doc)
Full-width strip: Red background, pulsing dot, activity name + "happening now"
Dismiss: Not dismissable (stays until admin turns off)
```

#### Section 3: ANNOUNCEMENTS
```
Section badge: "LATEST UPDATES"
Title: "What's Happening"

If announcements exist:
  - Featured announcement: Large card (60% width on desktop)
    - Category badge (Schedule / Notice / Youth / Outreach etc.)
    - "Updated Today" chip if createdAt = today
    - Title + description
    - Date
  - Side announcements: 2 smaller cards (stacked, 40% width)

If >3 total announcements: "View All Updates →" link to /announcements (or Firestore-loaded list)
Background: ivory-dark, subtle dot-grid pattern CSS
```

#### Section 4: UPCOMING EVENTS
```
Section header: "Upcoming Events" with badge "CALENDAR"
Layout: Horizontal scroll on mobile, 3-column grid on desktop
Each event card:
  - Square thumbnail image (Cloudinary)
  - Date badge (overlaid, navy bg): "OCT 15" format
  - Category chip: Worship / Community / Youth / Outreach
  - Title, time, location
  - "Details →" link

Featured event (first in list): Full-width card with bg image, all details prominent
"View All Events →" link to /events
```

#### Section 5: DEPARTMENTS QUICK LINKS
```
Section header: "Find Your Place" with badge "DEPARTMENTS"
Subtitle: "Every gift finds its home at Holy Spirit Chapel"
Layout: Horizontal scroll row of department icon cards (mobile) / 4-col grid (desktop)
Each mini-card:
  - Circular icon with chapel-blue bg
  - Department name (short)
  - On click: navigates to /departments
8 departments shown, "View All →" at end
Background: Chapel-navy gradient (dark section for contrast variety)
Text: White
```

#### Section 6: SCRIPTURE / MISSION QUOTE
```
Full-width scripture section
Background: ivory with cross watermark SVG
Quote: "To know Christ and to make Him known" or chapel's actual mission quote
Reference: [Chapel leadership provided]
Side decorations: thin gold lines
```

#### Section 7: FELLOWSHIP CALLOUT
```
Two-column layout:
Left: Text about Anglican Students' Fellowship
  - flogo.png displayed (circular, 96px)
  - Fellowship name
  - "Arise, Shine" motto
  - Brief description about the student fellowship
  - "Join the Fellowship →" button (crimson-colored)
Right: Image (fellowship members / chapel interior)
```

#### Section 8: GALLERY TEASER
```
6-image mosaic grid (Cloudinary photos)
"Our Community in Focus" header
"View Full Gallery →" CTA
```

#### FOOTER
```
4-column layout (stacks on mobile):
Col 1: Logo + chapel name + motto + social icons
Col 2: Quick Links (Home, About, Departments, Events, Gallery, Contact, Give)
Col 3: Service Times (Sunday 9AM/11AM, Midweek, Bible Study — admin-editable)
Col 4: SUBSCRIBE FORM (name + email + Subscribe button)

Bottom bar: Copyright + Privacy + Terms

Background: Navy-700 (#040F1E)
Text: White/70
Gold accent on logo text
```

---

### 6.2 ABOUT US (`/about`)

#### Hero Section
```
Background: Blurred chapel interior photo + navy overlay
Title: "Our Story" [Cinzel]
Subtitle badge: "Holy Spirit Chapel · ESUT Agbani"
```

#### Section: Foundation of Faith
```
Two columns:
Left (60%):
  "A Foundation of Faith" [Libre Baskerville]
  History paragraphs — admin-editable content from Firestore
Right (40%):
  Blockquote card with chapel motto
  "DOMINUS REGNANT" in Cinzel gold
  Vision statement [Cormorant Garamond italic]
```

#### Section: Core Beliefs / Values
```
3-column icon cards:
1. "Faith in Christ" — icon + description
2. "Biblical Foundation" — icon + description
3. "Community Service" — icon + description
4. "Worship" — icon + description
5. "Prayer" — icon + description
6. "Outreach" — icon + description
Background: ivory-dark
```

#### Section: Mission & Vision
```
Full-width dark section (navy)
Side by side: Mission (left) | Vision (right)
Gold divider line between
Text: White, Cormorant Garamond for the actual statements
```

#### Section: FELLOWSHIP IDENTITY
```
Dedicated section for Anglican Students' Fellowship
flogo.png (large, 120px) centered
"Anglican Students' Fellowship" title
"ARISE, SHINE · The Church of Nigeria (Anglican Communion)"
Description about the fellowship's role and how it relates to the chapel
Crimson accent color throughout this section
```

#### Section: Meet Leadership
```
Grid of leader cards (admin-managed via Firestore)
Each card:
  - Cloudinary photo (aspect-square, rounded-full)
  - Role badge (Lead Chaplain / Fellowship President / etc.)
  - Name [Libre Baskerville]
  - Short bio
Background: White
```

---

### 6.3 DEPARTMENTS (`/departments`)

#### Hero
```
Title: "Our Departments" [Cinzel]
Subtitle: "Discover where you belong"
Background: Light with chapel blue geometric pattern (CSS)
```

#### Search + Filter
```
Search input: "Search departments..." — filters cards live (client-side)
Filter chips: All | Ministry | Technical | Administrative
```

#### Department Grid
```
3-column grid (2 on tablet, 1 on mobile)
Each DepartmentCard:
  - Department cover image (Cloudinary, admin-uploaded)
  - Icon (Lucide icon, admin-selected from preset list)
  - Department name [Libre Baskerville]
  - 1-line description
  - Head of department name
  - "Learn More →" ghost button
  - On hover: scale up + gold border
  - On click: Opens DepartmentModal (no page navigation)
```

#### DepartmentModal (Framer Motion, AnimatePresence)
```
Slide-in from right (desktop) / slide-up from bottom (mobile)
Modal content:
  - Cover image (full width within modal)
  - Department name + icon
  - Description (full)
  - Head of Department (name + optional photo)
  - Activities list (bullet points)
  - Meeting times (schedule format)
  - Member count (if admin provided)
  - "Contact Department" button (mailto or WhatsApp)
Close: X button + click-outside backdrop

8 Default Departments (seeded):
  1. Choir Department
  2. Band Department
  3. Ushering Department
  4. Sanctuary Decoration Department
  5. Prayer Department
  6. Evangelism Department
  7. Welfare Department
  8. Technical Department
```

---

### 6.4 EVENTS (`/events`)

#### Hero Strip
```
Title: "Life at the Chapel"
Background: chapel photo with overlay
Category filter tabs below: All Events | Worship | Community | Youth | Outreach
Search: right side
```

#### Featured Event
```
Large hero card (admin-marked as featured):
- Full-width, tall card with bg image
- "FEATURED EVENT" badge (gold)
- Title, date/time, location
- "Register Now" primary button + "Add to Calendar" secondary
- Right panel: event description + share buttons
```

#### Events Grid
```
Below featured:
Toggle between: Grid view | List view (saved to localStorage)

Grid: 3-column cards with date badge, image, category, title, time, location
List: Compact rows with date column, details, action

Pagination: "Load More Events" button (Firestore pagination)
```

#### Newsletter Strip (bottom of events page)
```
"Stay in the Loop" section
Email subscribe form (also saves to `subscribers` collection with source tag "events_page")
```

---

### 6.5 GALLERY (`/gallery`)

#### Hero
```
Title: "Our Community in Focus"
Subtitle: "Glimpses of worship, fellowship, and the grace of God"
```

#### Filter Tabs
```
All | Worship | Community | Youth | Architecture | Events
Animated indicator sliding under active tab
```

#### Masonry Grid
```
CSS columns (not JS masonry):
  Mobile: 2 columns
  Tablet: 3 columns
  Desktop: 4 columns

Each image:
  - Cloudinary optimized (f_auto, q_auto, w_600)
  - Rounded corners
  - On hover: brightness increase + overlay with category tag
  - Stagger entrance animation (each image delays by 50ms)

On click: Full-screen lightbox
  - Image fills screen
  - Caption below (admin-entered)
  - Left/right navigation arrows
  - Close button
  - Share button
  - Image counter "3 / 24"
```

#### Scripture Quote (bottom)
```
"A place of worship, a space for community, a home for all who seek."
```

---

### 6.6 GIVE (`/give`)

#### Hero
```
Title: "Support Our Mission"
Subtitle: "Every gift makes a difference in our community"
Background: Warm gradient with subtle cross motif
```

#### Give Options Grid
```
Admin creates these via dashboard.
Each GiveCard:
  - Cover image (Cloudinary)
  - Category icon
  - Title (e.g., "Tithes & Offering", "Building Fund", etc.)
  - Description
  - "Give Now →" CTA (gold button)
  - On click: navigate to /give/[slug]
```

### 6.6.1 Individual Give Page (`/give/[slug]`)
```
Layout: Two-column (desktop) / stacked (mobile)
Left (60%):
  - Cover image
  - Title + description (full)
  - Amount suggestions: 4 quick-select pills (₦1000, ₦2000, ₦5000, ₦10000) + custom input
  - Payment form:
    - Name (required)
    - Phone number (required)
    - Email (required, for receipt)
    - Amount (required)

  - Payment method section (shows what admin has enabled):
    OPTION A — Paystack:
      Blue "Pay Securely with Paystack" button
      Paystack logo + "Powered by Paystack" text below
      On success → auto-verified → receipt email sent
    
    OPTION B — Bank Transfer:
      "Transfer to Account" tab
      Shows admin-configured bank accounts for this give:
        Bank Name | Account Number | Account Name
        [Copy] button for account number
      "Upload Payment Proof" section:
        Dropzone (Cloudinary upload)
        "Submit for Verification" button
        Status: pending → admin verifies → verified
      Receipt email sent on verification

Right (40%):
  - Give summary card
  - Any existing progress bar if admin set a goal amount
  - Recent givers (optional: "John O. gave recently")
  - Scripture verse about giving
```

---

### 6.7 CONTACT (`/contact`)

#### Layout: Split (Two column desktop, stacked mobile)

#### Left Column: Contact & Forms
```
Tabs: "Send a Message" | "Prayer Request" | "Subscribe"

TAB 1: Send a Message
  Form fields: Name, Email, Subject (dropdown), Message
  Submit → saves to Firestore `contact_messages`
         → sends notification email to admin-configured address(es)
         → sends auto-reply email to user

TAB 2: Prayer Request
  Form fields: Name, Email, Prayer Topic, Prayer Request (textarea)
  Option: "Keep this private" checkbox
  Submit → saves to Firestore `prayer_requests`
         → sends to admin-configured prayer email address
         → sends gentle confirmation email to user

TAB 3: Subscribe
  Same FooterSubscribe component
  Name + Email + Subscribe button
```

#### Right Column: Info + Map
```
Contact Details card:
  - Address: Holy Spirit Chapel, ESUT Agbani, Enugu State
  - Phone: [admin-provided]
  - Email: [admin-provided]
  - Social media icons (Facebook, Instagram, Twitter/X, WhatsApp)

Service Times card:
  - Admin-editable list of service times

Map Section:
  - Google Maps embed (ESUT Agbani coordinates)
  - "Get Directions" button → opens Google Maps
```

---

## 7. ADMIN DASHBOARD SPEC

### Access: `/admin/*` — Firebase Auth protected middleware

### 7.1 Login Page (`/admin/login`)
```
Centered card on dark chapel bg
Logo + "Chapel Admin" title
Email + Password fields
"Sign In" button
If 2FA enabled:
  After password verified → redirect to /admin/verify-2fa
  Show: 6-digit code input
  Code was sent to admin email via Gmail SMTP
  Code also stored in Firestore (hashed, 10min TTL)
  Match code → complete login → set session
```

### 7.2 Dashboard Home (`/admin`)
```
Stat cards row:
  - Total Subscribers
  - Pending Payment Verifications
  - This Month's Events
  - New Contact Messages
  - Total Gallery Photos
  - Total Departments

Quick Actions:
  - "Toggle Live" button (prominent, red/green state)
  - "Add Event" shortcut
  - "Add Announcement" shortcut
  - "View Pending Payments" shortcut

Recent activity feed:
  - Last 10 contact submissions
  - Last 10 payment submissions
```

### 7.3 Live Manager (`/admin/live`)
```
Current live status: large toggle (ON/OFF)
When toggling ON:
  - Select Activity from list (or create new)
    Activities: Sunday Service | Midweek Service | Night Vigil | Conference | Youth Meeting | Special Program | Custom...
  - Add optional note/description
  - "Go Live" button
When live:
  - Shows which activity, time it went live
  - "End Live" button
Admin can Create/Edit/Delete the activity presets
Firestore: updates `live_status` doc → website reads in real-time (onSnapshot)
```

### 7.4 Announcements (`/admin/announcements`)
```
List of all announcements (table)
Create/Edit form:
  - Title, Content, Category badge, Start date, End date (optional)
  - "Active" toggle
  - Priority (Featured / Normal)
```

### 7.5 Events Manager (`/admin/events`)
```
Events list (table with filters)
Create/Edit Event form:
  - Title, Description, Category
  - Date + Time (start/end)
  - Location
  - Cover image (Cloudinary upload)
  - "Featured" toggle (appears as featured event on homepage/events page)
  - "Registration required" toggle
  - External registration link (if any)
```

### 7.6 Departments Manager (`/admin/departments`)
```
List of departments (draggable for ordering)
Create/Edit Department form:
  - Name, Description, Icon (select from Lucide icon list)
  - Head of Department name
  - Activities list (add/remove items)
  - Meeting days and times
  - Cover image (Cloudinary upload)
  - Active toggle
```

### 7.7 Gallery Manager (`/admin/gallery`)
```
Grid of all gallery photos
Upload: Cloudinary upload widget (multi-file)
Each photo:
  - Category tag (editable)
  - Caption (editable)
  - Delete button
Bulk actions: Select + delete multiple
```

### 7.8 Give Manager (`/admin/give`)
```
List of all give options (cards)
Create/Edit Give form:
  - Title, Slug (auto-generated), Description
  - Cover image (Cloudinary)
  - Goal amount (optional)
  - Payment Methods:
    PAYSTACK: toggle on/off (single Paystack key for all gives)
    BANK TRANSFER: toggle on/off per give
      If enabled: Add bank accounts
        - Bank Name, Account Number, Account Name
        - [+ Add Another Account] (can have multiple)
  - Active toggle
  - Sort order
```

### 7.9 Payments (`/admin/payments`)
```
Tabs: All | Pending | Verified | Paystack

Table columns: Donor Name | Email | Phone | Amount | Give Type | Method | Status | Date | Actions

Pending bank transfer row:
  - Shows uploaded screenshot (click to view full)
  - "Verify" button → sets status to verified → sends receipt email to donor
  - "Reject" button → sends rejection email
  - All payment receipts emailed with nice Nodemailer template

Paystack payments: Automatically marked verified via webhook
```

### 7.10 Subscribers (`/admin/subscribers`)
```
Table: Name | Email | Subscribed Date | Source

SEND MESSAGE button:
  Opens composer:
  - Subject
  - Message body (rich textarea)
  - Recipients: All Subscribers | Select specific subscribers (checkbox list)
  - Preview email button
  - Send → Nodemailer bulk send (BCC or individual sends)

Unsubscribe: Each subscriber has unsubscribe link in emails
```

### 7.11 Contact Messages (`/admin/contact-messages`)
```
Table of all contact form submissions
Click to view full message
Mark as read/unread
Delete
```

### 7.12 Prayer Requests (`/admin/prayer-requests`)
```
Table: Name | Topic | Date | Private?
Click to view full request
Delete (sensitive data)
```

### 7.13 Settings (`/admin/settings`)
```
Sections:

1. CHAPEL INFORMATION
   - Chapel name, tagline, address, phone, email
   - Social media links
   - Service times (add/edit/delete)
   - Hero image upload
   - About page content (rich text)

2. EMAIL CONFIGURATION
   - Contact form notification email(s) (multiple comma-separated)
   - Prayer request email
   - Payment notification email
   - Test email button ("Send test email")

3. TWO-FACTOR AUTHENTICATION
   - Toggle 2FA on/off
   - "When enabled, a 6-digit code will be sent to your admin email each login"
   - Admin email for 2FA codes (auto-filled from auth)

4. PAYSTACK CONFIGURATION
   - Public key input (masked)
   - Secret key input (masked, used server-side only)
   - Test/Live mode toggle

5. ADMIN USERS
   - List of admin accounts (email + role)
   - Invite new admin (sends invite email)
   - Remove admin
```

---

## 8. TECH STACK & DEPENDENCIES

### package.json (key dependencies)
```json
{
  "dependencies": {
    "next": "16.2.7",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "typescript": "^5.8.0",
    "tailwindcss": "^4.1.0",
    "@tailwindcss/postcss": "^4.1.0",
    "framer-motion": "^12.0.0",
    "firebase": "^12.14.0",
    "cloudinary": "^2.5.0",
    "next-cloudinary": "^6.0.0",
    "nodemailer": "^8.0.10",
    "@types/nodemailer": "^6.4.17",
    "react-hook-form": "^7.54.0",
    "zod": "^3.24.0",
    "@hookform/resolvers": "^3.10.0",
    "lucide-react": "latest",
    "sonner": "^1.7.0",
    "date-fns": "^4.1.0",
    "react-intersection-observer": "^9.14.0",
    "paystack": "^2.0.2",
    "sharp": "^0.33.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "eslint": "^9.0.0",
    "eslint-config-next": "16.2.7"
  }
}
```

### Environment Variables (.env.local)
```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=hsc_uploads
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Gmail SMTP (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-chapel-gmail@gmail.com
SMTP_PASS=xxxx-xxxx-xxxx-xxxx   # 16-digit Google App Password

# Paystack
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_xxxxxxxx
PAYSTACK_SECRET_KEY=sk_live_xxxxxxxx

# Admin
ADMIN_SECRET=a-long-random-string-for-middleware
```

---

## 9. PROJECT STRUCTURE

```
holy-spirit-chapel/
├── public/
│   ├── clogo.png              ← Chapel crest logo
│   ├── flogo.png              ← ASF fellowship seal (Image 4)
│   ├── favicon.ico            ← Generated from clogo.png
│   └── og-image.jpg           ← Social share image
│
├── src/
│   ├── app/
│   │   ├── layout.tsx         ← Root layout, fonts, providers
│   │   ├── page.tsx           ← Home /
│   │   ├── about/page.tsx
│   │   ├── departments/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── events/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── gallery/page.tsx
│   │   ├── give/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── admin/
│   │   │   ├── layout.tsx     ← Admin layout + auth guard
│   │   │   ├── page.tsx       ← Dashboard home
│   │   │   ├── login/page.tsx
│   │   │   ├── verify-2fa/page.tsx
│   │   │   ├── live/page.tsx
│   │   │   ├── announcements/page.tsx
│   │   │   ├── events/page.tsx
│   │   │   ├── departments/page.tsx
│   │   │   ├── gallery/page.tsx
│   │   │   ├── give/page.tsx
│   │   │   ├── payments/page.tsx
│   │   │   ├── subscribers/page.tsx
│   │   │   ├── contact-messages/page.tsx
│   │   │   ├── prayer-requests/page.tsx
│   │   │   └── settings/page.tsx
│   │   └── api/
│   │       ├── contact/route.ts
│   │       ├── prayer/route.ts
│   │       ├── subscribe/route.ts
│   │       ├── give/
│   │       │   ├── initiate/route.ts
│   │       │   └── verify/route.ts
│   │       ├── paystack/webhook/route.ts
│   │       ├── admin/
│   │       │   ├── send-2fa/route.ts
│   │       │   ├── verify-2fa/route.ts
│   │       │   ├── payments/verify/route.ts
│   │       │   └── subscribers/send/route.ts
│   │       └── upload/route.ts
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── NavBar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── AnnouncementBanner.tsx
│   │   │   └── LiveBadge.tsx
│   │   ├── home/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── AnnouncementsSection.tsx
│   │   │   ├── EventsSection.tsx
│   │   │   ├── DepartmentsSection.tsx
│   │   │   ├── ScriptureSection.tsx
│   │   │   ├── FellowshipSection.tsx
│   │   │   └── GalleryTeaser.tsx
│   │   ├── departments/
│   │   │   ├── DepartmentCard.tsx
│   │   │   └── DepartmentModal.tsx
│   │   ├── events/
│   │   │   ├── EventCard.tsx
│   │   │   └── FeaturedEvent.tsx
│   │   ├── gallery/
│   │   │   ├── GalleryGrid.tsx
│   │   │   └── LightboxModal.tsx
│   │   ├── give/
│   │   │   ├── GiveCard.tsx
│   │   │   ├── GiveForm.tsx
│   │   │   └── BankTransferUpload.tsx
│   │   ├── contact/
│   │   │   ├── ContactForm.tsx
│   │   │   ├── PrayerForm.tsx
│   │   │   └── MapEmbed.tsx
│   │   ├── admin/
│   │   │   ├── AdminSidebar.tsx
│   │   │   ├── AdminTopBar.tsx
│   │   │   ├── StatCard.tsx
│   │   │   └── ... (per-page admin components)
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Badge.tsx
│   │       ├── Modal.tsx
│   │       ├── RevealSection.tsx
│   │       ├── SectionHeader.tsx
│   │       ├── ScriptureQuote.tsx
│   │       ├── FooterSubscribe.tsx
│   │       └── LoadingSpinner.tsx
│   │
│   ├── lib/
│   │   ├── firebase.ts        ← Firebase init (client)
│   │   ├── firebase-admin.ts  ← Firebase Admin SDK (server)
│   │   ├── cloudinary.ts      ← Cloudinary config
│   │   ├── nodemailer.ts      ← Mailer transporter
│   │   ├── paystack.ts        ← Paystack helper
│   │   ├── motion.ts          ← Framer variants (as defined above)
│   │   └── utils.ts           ← cn(), slugify(), formatDate(), etc.
│   │
│   ├── hooks/
│   │   ├── useFirestore.ts    ← Generic Firestore hooks
│   │   ├── useLiveStatus.ts   ← onSnapshot for live_status
│   │   ├── useAdmin.ts        ← Admin auth state
│   │   └── usePaystack.ts     ← Paystack inline hook
│   │
│   └── types/
│       ├── chapel.types.ts    ← All TypeScript interfaces
│       └── admin.types.ts
```

---

## 10. FIRESTORE SCHEMA

### Collection: `chapel_info` (single doc: `main`)
```ts
{
  chapelName: "Holy Spirit Chapel ESUT Agbani",
  fellowshipName: "Anglican Students' Fellowship ESUT Agbani",
  tagline: string,
  address: string,
  phone: string[],
  email: string,
  socials: { facebook?: string, instagram?: string, twitter?: string, whatsapp?: string },
  serviceTimes: Array<{ label: string, day: string, time: string }>,
  heroImageUrl: string,       // Cloudinary URL
  aboutContent: string,       // Rich text / HTML
  missionStatement: string,
  visionStatement: string,
  scriptureVerse: string,
  scriptureReference: string,
  updatedAt: Timestamp,
}
```

### Collection: `departments`
```ts
{
  id: string,                 // auto
  name: string,
  slug: string,
  description: string,
  icon: string,               // Lucide icon name
  headName: string,
  headPhotoUrl?: string,      // Cloudinary
  coverImageUrl: string,      // Cloudinary
  activities: string[],
  meetingSchedule: string,
  contactWhatsApp?: string,
  memberCount?: number,
  order: number,              // for drag-sort
  isActive: boolean,
  createdAt: Timestamp,
  updatedAt: Timestamp,
}
```

### Collection: `events`
```ts
{
  id: string,
  title: string,
  slug: string,
  description: string,
  category: 'worship' | 'community' | 'youth' | 'outreach' | 'conference' | 'vigil' | 'other',
  startDate: Timestamp,
  endDate: Timestamp,
  location: string,
  coverImageUrl: string,
  isFeatured: boolean,
  requiresRegistration: boolean,
  registrationUrl?: string,
  isActive: boolean,
  createdAt: Timestamp,
}
```

### Collection: `announcements`
```ts
{
  id: string,
  title: string,
  content: string,
  category: 'schedule' | 'notice' | 'youth' | 'outreach' | 'general',
  isPriority: boolean,        // shows in hero banner
  startDate: Timestamp,
  endDate?: Timestamp,
  isActive: boolean,
  createdAt: Timestamp,
}
```

### Collection: `gallery`
```ts
{
  id: string,
  imageUrl: string,           // Cloudinary URL
  publicId: string,           // Cloudinary public_id (for delete)
  caption?: string,
  category: 'worship' | 'community' | 'youth' | 'architecture' | 'events',
  order: number,
  isActive: boolean,
  uploadedAt: Timestamp,
}
```

### Collection: `give_options`
```ts
{
  id: string,
  title: string,
  slug: string,
  description: string,
  coverImageUrl: string,      // Cloudinary
  goalAmount?: number,
  totalReceived: number,      // auto-updated
  paystackEnabled: boolean,
  bankTransferEnabled: boolean,
  bankAccounts: Array<{
    bankName: string,
    accountNumber: string,
    accountName: string,
  }>,
  sortOrder: number,
  isActive: boolean,
  createdAt: Timestamp,
}
```

### Collection: `transactions`
```ts
{
  id: string,
  giveOptionId: string,
  giveOptionTitle: string,
  donorName: string,
  donorEmail: string,
  donorPhone: string,
  amount: number,             // in kobo for paystack, naira raw for bank
  method: 'paystack' | 'bank_transfer',
  status: 'pending' | 'verified' | 'rejected' | 'failed',
  paystackReference?: string,
  screenshotUrl?: string,     // Cloudinary URL (for bank transfer)
  screenshotPublicId?: string,
  receiptEmailSent: boolean,
  adminVerifiedBy?: string,   // admin email
  adminVerifiedAt?: Timestamp,
  rejectionReason?: string,
  createdAt: Timestamp,
  updatedAt: Timestamp,
}
```

### Collection: `subscribers`
```ts
{
  id: string,
  name: string,
  email: string,
  source: 'footer' | 'contact_page' | 'events_page',
  isActive: boolean,
  unsubscribeToken: string,   // UUID, used in unsubscribe links
  subscribedAt: Timestamp,
}
```

### Collection: `contact_messages`
```ts
{
  id: string,
  name: string,
  email: string,
  subject: string,
  message: string,
  isRead: boolean,
  createdAt: Timestamp,
}
```

### Collection: `prayer_requests`
```ts
{
  id: string,
  name: string,
  email: string,
  topic: string,
  request: string,
  isPrivate: boolean,
  createdAt: Timestamp,
}
```

### Collection: `live_status` (single doc: `current`)
```ts
{
  isLive: boolean,
  activityName: string,       // "Sunday Service", "Night Vigil", etc.
  activityDescription?: string,
  startedAt: Timestamp | null,
  startedBy: string,          // admin email
}
```

### Collection: `live_activities` (admin-managed presets)
```ts
{
  id: string,
  name: string,               // "Sunday Service", "Midweek Bible Study", etc.
  description?: string,
  order: number,
  isActive: boolean,
}
```

### Collection: `admin_settings` (single doc: `config`)
```ts
{
  contactEmails: string[],
  prayerEmail: string,
  paymentEmail: string,
  twoFAEnabled: boolean,
  paystackPublicKey: string,  // NOTE: store secret key in env only, never Firestore
  paystackMode: 'test' | 'live',
}
```

### Collection: `admin_2fa` (temporary, auto-cleaned)
```ts
{
  // Document ID = admin UID
  code: string,               // 6-digit code (store as plain or hashed)
  expiresAt: Timestamp,       // 10 minutes from creation
  used: boolean,
}
```

---

## 11. API ROUTES

| Method | Route | Description |
|---|---|---|
| POST | `/api/contact` | Save contact form + send notification emails |
| POST | `/api/prayer` | Save prayer request + send to prayer email |
| POST | `/api/subscribe` | Add subscriber to Firestore |
| POST | `/api/give/initiate` | Initialize Paystack transaction |
| POST | `/api/give/verify` | Verify Paystack payment reference |
| POST | `/api/paystack/webhook` | Paystack webhook (auto-verify on payment) |
| POST | `/api/upload` | Handle Cloudinary upload (screenshots for bank transfer) |
| POST | `/api/admin/send-2fa` | Generate + email 6-digit 2FA code |
| POST | `/api/admin/verify-2fa` | Verify code against Firestore |
| POST | `/api/admin/payments/verify` | Admin verifies bank transfer + sends receipt |
| POST | `/api/admin/payments/reject` | Admin rejects payment + sends email |
| POST | `/api/admin/subscribers/send` | Send bulk email to subscribers |
| DELETE | `/api/unsubscribe/[token]` | Unsubscribe user by token |

---

## 12. EMAIL SYSTEM

### Gmail SMTP Setup (Nodemailer 8.x)
```ts
// src/lib/nodemailer.ts
import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,   // 16-digit Google App Password
  },
})
```

### Email Templates (HTML, inline styles for compatibility)

**Template 1: Payment Receipt (Paystack — auto-verified)**
```
Subject: "Payment Receipt — [Give Type] | Holy Spirit Chapel"
From: "Holy Spirit Chapel <chapel-email>"
Content:
  - Chapel logo at top
  - "Thank you, [Name]! Your offering has been received."
  - Amount: ₦[amount]
  - Give type: [title]
  - Transaction reference: [ref]
  - Date + Time
  - "To God be the glory." scripture verse
  - Chapel contact info at bottom
```

**Template 2: Bank Transfer Submitted (pending)**
```
Subject: "Offering Submission Received — [Give Type]"
Content:
  - "We received your payment submission."
  - "Your offering is being reviewed and will be verified shortly."
  - Amount: ₦[amount] | Method: Bank Transfer
  - Tracking ID: [transaction ID]
  - "You'll receive a confirmation email once verified."
```

**Template 3: Bank Transfer Verified**
```
Subject: "Offering Verified ✓ — Holy Spirit Chapel"
Content:
  Same as receipt but with "VERIFIED" badge
  "God bless your giving heart."
```

**Template 4: Contact Form Auto-Reply**
```
Subject: "We received your message | Holy Spirit Chapel"
Content:
  "Thank you, [Name]. Your message has been received."
  "We'll get back to you within 24-48 hours."
  Chapel contact info
```

**Template 5: Prayer Request Confirmation**
```
Subject: "Your prayer request has been received"
Content:
  "We have received your prayer request."
  "Our prayer team will cover your request in prayer."
  "Be encouraged — the Lord hears."
  Scripture verse
```

**Template 6: 2FA Code Email**
```
Subject: "Your Admin Login Code — Holy Spirit Chapel"
Content:
  "Your verification code is: [CODE]"
  "This code expires in 10 minutes."
  "If you did not request this, please contact support immediately."
```

**Template 7: Subscriber Message (bulk)**
```
Subject: [Admin-entered subject]
Content:
  Chapel header
  [Admin-entered message body]
  Unsubscribe link at bottom: /api/unsubscribe/[token]
```

**Template 8: New Contact Message (admin notification)**
```
Subject: "New Contact Message from [Name] | Chapel Admin"
Content: Full message details, quick reply button
```

---

## 13. PAYMENT SYSTEM

### Paystack Integration (Client side)
```tsx
// Use @paystack/inline-js (CDN in layout or npm install)
// src/hooks/usePaystack.ts

const initPaystack = (config: {
  email: string,
  amount: number,         // in kobo (multiply naira × 100)
  name: string,
  phone: string,
  metadata: { giveOptionId: string, giveTitle: string },
  onSuccess: (ref: string) => void,
  onClose: () => void,
}) => { ... }
```

### Payment Flow
```
1. User fills give form → clicks "Pay with Paystack"
2. Frontend: POST /api/give/initiate → creates pending transaction in Firestore
3. Frontend: Opens Paystack popup with reference
4. Paystack: User pays → Paystack calls our webhook
5. Webhook /api/paystack/webhook: verifies event, marks transaction verified
6. Email: Receipt sent to donor automatically
--- OR ---
1. User selects "Bank Transfer" tab
2. Sees bank account details (copy button)
3. Transfers money on their banking app
4. Uploads screenshot → Cloudinary → POST creates pending transaction
5. Admin gets email notification: "New pending payment from [Name]"
6. Admin opens /admin/payments → views screenshot → clicks "Verify"
7. POST /api/admin/payments/verify → marks verified → sends receipt email
```

---

## 14. LIVE ACTIVITY SYSTEM

### How It Works
```
1. Admin goes to /admin/live
2. Selects an activity from preset list (or types custom)
3. Clicks "Go Live"
4. Firestore: updates live_status/current doc { isLive: true, activityName: "Sunday Service", ... }
5. Website: All connected clients listening via onSnapshot() see update INSTANTLY
6. LiveBadge appears in navbar + hero strip
7. Optionally: Push notification to all subscribers (via /api/admin/subscribers/send)
8. When service ends: Admin clicks "End Live"
9. Firestore: { isLive: false } → badge disappears everywhere instantly
```

### Live Status Hook
```ts
// src/hooks/useLiveStatus.ts
import { onSnapshot, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useEffect, useState } from 'react'

export function useLiveStatus() {
  const [liveStatus, setLiveStatus] = useState<LiveStatus | null>(null)

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'live_status', 'current'), (snap) => {
      if (snap.exists()) setLiveStatus(snap.data() as LiveStatus)
    })
    return () => unsub()
  }, [])

  return liveStatus
}
```

---

## 15. SUBSCRIBER SYSTEM

### Subscribe Flow
```
1. User enters name + email in footer or contact page
2. POST /api/subscribe:
   - Check duplicate email
   - Generate unsubscribeToken (UUID)
   - Save to Firestore `subscribers`
   - Send welcome email: "Welcome to the Holy Spirit Chapel family!"
3. Admin sees subscriber in /admin/subscribers
```

### Broadcast Flow
```
1. Admin clicks "Send Message" in /admin/subscribers
2. Composes subject + message
3. Selects recipients: All or specific
4. POST /api/admin/subscribers/send:
   - Fetches selected subscriber emails
   - Sends via Nodemailer (loop with rate limiting or BCC)
   - Each email has personalized greeting + unsubscribe link
```

---

## 16. 2FA ADMIN SECURITY

### Flow
```
1. Admin logs in with email + password (Firebase Auth)
2. If 2FA enabled in admin_settings:
   a. After successful Firebase auth, DO NOT give dashboard access yet
   b. POST /api/admin/send-2fa:
      - Generate random 6-digit code
      - Store in Firestore admin_2fa/[uid]: { code, expiresAt: now+10min, used: false }
      - Send code via Nodemailer to admin email
   c. Redirect to /admin/verify-2fa
   d. Admin enters code
   e. POST /api/admin/verify-2fa:
      - Fetch Firestore admin_2fa/[uid]
      - Check: code matches AND not expired AND not used
      - If valid: mark used: true, set session cookie/token → redirect to dashboard
      - If invalid: return error (max 3 attempts then logout)
3. If 2FA disabled: after Firebase auth → directly to dashboard
```

### Security Notes
- 2FA code: Do NOT hardcode. Generated fresh each login.
- Store in Firestore NOT Firebase RTDB (server rules can lock it to that UID only).
- Never log codes.
- Middleware (`middleware.ts`) protects all `/admin/*` routes except `/admin/login` and `/admin/verify-2fa`.

---

## 17. LOGO & ASSET HANDLING

### File Setup
```
public/
  clogo.png   ← Chapel crest (transparent bg)
  flogo.png   ← ASF fellowship seal (white bg — Image 4 chosen)
  favicon.ico ← Generated from clogo.png (use sharp or online converter)
  og-image.jpg ← 1200×630 social share preview
```

### Logo Usage Rules
```
clogo.png:
  ✓ NavBar (38-40px height, white/light and dark bg — transparent bg handles both)
  ✓ Footer (56px height on dark navy bg)
  ✓ Admin login page (80px, centered)
  ✓ Email templates (48px)
  ✗ Never on yellow/gold bg (poor contrast)

flogo.png:
  ✓ About Us fellowship section (120px circular display)
  ✓ Footer bottom (small, 32px, beside chapel logo or below it)
  ✓ Fellowship callout card on homepage
  ✗ Never on dark bg (it's a white-background seal)

Using in Next.js:
  import Image from 'next/image'
  <Image src="/clogo.png" alt="Holy Spirit Chapel" width={160} height={80} />
  // Use next/image for automatic optimization
```

### Favicon Generation (one-time setup)
```bash
# Using sharp in a script:
npx @realfavicongenerator/rfg-api  # or
# Manually: upload clogo.png to realfavicongenerator.net
# Download favicon package → place in /public
```

---

## 18. BUILD PROMPTS

### PROMPT 1 — Project Scaffold
```
Create a new Next.js 16.2.7 app with TypeScript, Tailwind v4, and App Router.
Project name: holy-spirit-chapel
Install: framer-motion, firebase, next-cloudinary, nodemailer, react-hook-form, zod, @hookform/resolvers, lucide-react, sonner, date-fns

Set up:
1. tailwind.config.ts with the full custom theme (colors: chapel, navy, gold, crimson, magenta, ivory; fonts: Cinzel, Libre Baskerville, Nunito, Cormorant Garamond; custom shadows, keyframes, animations as defined in DESIGN.md)
2. Google Fonts in layout.tsx (Cinzel 400/600/700/900, Libre_Baskerville 400/700, Nunito 300/400/500/600/700/800, Cormorant_Garamond 400/500/600 with italic)
3. CSS variables in globals.css for all color tokens
4. Firebase init file at src/lib/firebase.ts (client-side config from env vars)
5. .env.local template with all required variables
6. src/lib/motion.ts with all Framer Motion variants (fadeUp, fadeIn, stagger, slideLeft, slideRight, scaleIn, cardHover, heroReveal, pageTransition)
7. src/types/chapel.types.ts with all TypeScript interfaces for all Firestore collections
8. src/lib/utils.ts with cn(), slugify(), formatDate(), formatNaira(), generateToken()

Use the font-display, font-heading, font-body, font-quote CSS variables throughout.
```

### PROMPT 2 — NavBar + Footer + LiveBadge
```
Build the NavBar component (src/components/layout/NavBar.tsx):
- Desktop: clogo.png logo (40px height, next/image) | Nav links centered | "Give" button right
- Nav links: Home, About Us, Departments, Events, Gallery, Contact
- "Give" button: gold gradient bg, navy text, rounded-full, hover lift
- LiveBadge: shown conditionally using useLiveStatus() hook (reads Firestore live_status/current via onSnapshot)
  LiveBadge: red pulsing dot + "LIVE · [activityName]" text, animate-live-pulse Tailwind animation
- Mobile: logo + hamburger → full-screen overlay, links stacked center, Framer Motion AnimatePresence
- Sticky + blur backdrop on scroll: backdrop-blur-md bg-white/85 border-b border-border/50
- Active route: gold underline (usePathname comparison)

Build Footer (src/components/layout/Footer.tsx):
- Dark bg: navy-700 (#040F1E)
- 4-column grid (stacks on mobile)
- Col 1: clogo.png (56px) + chapel name (Cinzel) + motto + social icons (Facebook, Instagram, Twitter, WhatsApp as Lucide icons or SVG)
- Col 2: Quick Links
- Col 3: Service Times (pulled from Firestore chapel_info/main)
- Col 4: FooterSubscribe component (name + email + subscribe button)
- Bottom bar: copyright + Privacy + Terms
```

### PROMPT 3 — Home Hero Section
```
Build HeroSection (src/components/home/HeroSection.tsx):
- Full viewport height (min-h-screen)
- Background: admin-uploaded hero image from Firestore chapel_info OR fallback CSS gradient (chapel-gradient)
- Overlay: hero-overlay gradient (from DESIGN.md backgroundImage tokens)
- Floating particles: 16 small div elements (4-8px), absolute positioned, CSS animation float with varying delays and positions
- SVG cross: large, centered, opacity-[0.04], behind all content
- Radial glow: top-center, chapel blue, CSS
- Content (centered, z-10):
  - Motto badge: "DOMINUS REGNANT · ARISE, SHINE" [Cinzel, letter-spacing-widest, gold text, small]
  - "HOLY SPIRIT CHAPEL" [Cinzel, 64px desktop/40px mobile, white, uppercase, heroReveal animation]
  - "ESUT AGBANI" [Cinzel, 22px, chapel-300, fadeUp delay 0.4s]
  - Gold divider line (w-24, h-px, animate width expand delay 0.5s)
  - Tagline [Libre Baskerville italic, 18px, white/75, fadeUp delay 0.6s]
  - Two CTA buttons (fadeUp delay 0.8s):
    Primary: "Join Us This Sunday" — gold bg, navy text
    Secondary: "Our Departments" — white border, white text, hover bg-white/10
- LiveBadge conditionally above chapel name when admin is live (useLiveStatus hook)
- Scroll chevron at bottom center: animated bounce
All text animations use Framer Motion staggered entrance (variants from motion.ts)
```

### PROMPT 4 — Departments Page + Modal
```
Build departments page + components:

src/app/departments/page.tsx:
- Fetch all active departments from Firestore (getDocs with where isActive == true, orderBy order)
- Hero strip: "Our Departments" title + subtitle, chapel blue geometric pattern bg
- Search input: filters department cards client-side on name
- Filter chips: All | Ministry | Technical | Administrative
- 3-column grid (2 tablet, 1 mobile) of DepartmentCard components
- AnimatePresence for filtered results

src/components/departments/DepartmentCard.tsx:
- Framer Motion card with cardHover variant
- Department cover image (Cloudinary, aspect-video, rounded-t-xl)
- Body: icon (Lucide) + name + 2-line description + head name
- Gold top border on hover (transition)
- "Learn More →" ghost button
- onClick: opens DepartmentModal (passed via prop/context)

src/components/departments/DepartmentModal.tsx:
- Framer Motion AnimatePresence
- Desktop: slide from right (x: '100%' → x: 0)
- Mobile: slide from bottom (y: '100%' → y: 0)
- Backdrop: blur + dark overlay
- Content: full cover image, dept name, description, head of dept section, activities list (bullet), meeting times, contact button (WhatsApp link if phone provided)
- Close: X button + click backdrop

Seed 8 departments in Firestore with placeholder data:
Choir, Band, Ushering, Sanctuary Decoration, Prayer, Evangelism, Welfare, Technical
```

### PROMPT 5 — Give System (Full)
```
Build the complete Give system:

src/app/give/page.tsx:
- "Support Our Mission" hero
- Grid of GiveCard components (from Firestore give_options)
- Each card: Cloudinary cover image + title + description + "Give Now →"

src/app/give/[slug]/page.tsx:
- Fetch give option by slug
- Two-column layout (desktop) / stacked (mobile)
- Quick amount pills: ₦1000, ₦2000, ₦5000, ₦10000 + custom input
- Payment form: Name, Phone, Email, Amount
- Payment method tabs (shows only enabled methods from give option):
  PAYSTACK tab: "Pay with Paystack" button using @paystack/inline-js
    On success: POST /api/give/verify with reference → show success state → receipt email
  BANK TRANSFER tab:
    Shows bank accounts from give option (with copy-to-clipboard for account number)
    Cloudinary upload dropzone for screenshot
    Submit → POST creates pending transaction in Firestore → shows tracking info

src/app/api/give/initiate/route.ts: creates Firestore transaction record with status 'pending'
src/app/api/give/verify/route.ts: calls Paystack verify API → updates Firestore → sends receipt email
src/app/api/paystack/webhook/route.ts: verifies Paystack signature → auto-marks verified

Email: use nodemailer template for receipt (chapel-themed HTML, inline styles)
```

### PROMPT 6 — Admin Dashboard Core
```
Build admin layout + dashboard home + live manager:

src/app/admin/layout.tsx:
- Firebase Auth check (useAuthState or server session)
- If not authenticated: redirect to /admin/login
- If authenticated + 2FA pending: redirect to /admin/verify-2fa
- Layout: AdminSidebar (desktop) + AdminTopBar + {children}

AdminSidebar: Nav links for all admin sections, clogo.png top, active state highlight

src/app/admin/page.tsx (dashboard home):
- 6 StatCards: Subscribers, Pending Payments, This Month Events, New Messages, Gallery Photos, Departments
- Quick Actions: big "TOGGLE LIVE" button (green when off, red pulsing when live)
- Recent Activity feed

src/app/admin/live/page.tsx:
- Large ON/OFF toggle (visual, animated)
- Activity selector: list of live_activities docs + "Custom..." option
- "Go Live" / "End Live" button
- Real-time status display (reads live_status/current via onSnapshot)
- CRUD for activity presets (add, edit, delete)

All admin forms use react-hook-form + zod validation
All admin writes are to Firestore via Firebase client SDK
```

### PROMPT 7 — Settings + 2FA + Email Config
```
Build /admin/settings page with these sections:

1. CHAPEL INFO form: chapelName, tagline, address, phone[], email, socials, serviceTimes (add/remove rows), heroImage (Cloudinary upload via next-cloudinary CldUploadWidget), missionStatement, visionStatement, scriptureVerse
- Save: updates Firestore chapel_info/main doc
- React Hook Form + Zod

2. EMAIL CONFIG: contactEmails (comma-separated), prayerEmail, paymentEmail
- "Test Email" button: POST /api/admin/test-email (sends test message to entered address)

3. TWO-FACTOR AUTH:
- Toggle switch
- Description: "Require 6-digit code sent to your email on every login"
- When toggling on: saves to admin_settings/config { twoFAEnabled: true }

4. PAYSTACK CONFIG:
- Public key (env override note), mode toggle test/live
- Save to admin_settings/config (public key only — secret key stays in env)

5. ADMIN USERS:
- List admins from Firebase Auth custom claims or Firestore admin_users collection
- "Invite Admin" sends email with magic link via Firebase Auth sendSignInLinkToEmail

2FA routes:
src/app/api/admin/send-2fa/route.ts:
  - Generate 6-digit code
  - Store { code, expiresAt: now+10min, used: false } in Firestore admin_2fa/[uid]
  - Send via Nodemailer: Subject "Your Login Code — Holy Spirit Chapel"

src/app/api/admin/verify-2fa/route.ts:
  - Fetch Firestore admin_2fa/[uid]
  - Validate: code matches, not expired, not used
  - Mark used: true
  - Return success/failure
```

PROMPT 8 — Complete Home Page (Remaining Sections)
Complete the home page by building all remaining sections after HeroSection.
Update src/app/page.tsx to import and render all sections in order.

BUILD these components:

src/components/home/AnnouncementsSection.tsx:
- Fetch active announcements from Firestore (where isActive==true, orderBy createdAt desc, limit 3)
- Section header: badge "LATEST UPDATES", title "What's Happening"
- Layout: featured announcement (large card, 60% width desktop) + 2 side cards (stacked, 40%)
- Featured card: category badge + "Updated Today" chip if today + title + content + date
- Side cards: smaller, same structure
- Background: ivory-dark with subtle CSS dot-grid pattern
- "View All →" link if more than 3 exist
- If no announcements: show placeholder "No announcements at this time"
- Framer Motion stagger entrance on scroll (useInView, once: true)

src/components/home/EventsSection.tsx:
- Fetch upcoming events from Firestore (where startDate >= now, orderBy startDate, limit 4)
- Section header: badge "CALENDAR", title "Upcoming Events"
- First event: FeaturedEvent card (full width, bg image, date, title, location, "Details →")
- Remaining 3: EventCard grid (3 cols desktop, 1 mobile)
- EventCard: square Cloudinary image + date badge (navy box "OCT 15") + category chip + title + time + location + "Details →"
- "View All Events →" link to /events
- Horizontal scroll on mobile for the 3 cards
- Stagger animation on scroll

src/components/home/DepartmentsStrip.tsx:
- Dark section: bg-navy-500
- Section header: badge "DEPARTMENTS", title "Find Your Place", subtitle text, all white
- Horizontal scroll row (mobile) / 4-col grid (desktop) of mini department icon cards
- Each mini-card: circular chapel-blue icon bg + Lucide icon + department name (white)
- Fetch from Firestore departments collection (limit 8)
- "View All Departments →" white ghost button at end

src/components/home/ScriptureSection.tsx:
- Full-width ivory section
- Large SVG cross watermark centered (opacity-[0.04], chapel blue)
- Scripture quote from Firestore chapel_info/main.scriptureVerse [Cormorant Garamond italic, 2rem+]
- Reference below [Cinzel, small, gold]
- Thin gold horizontal lines left and right of quote (decorative)

src/components/home/FellowshipSection.tsx:
- Two-column: text left (60%), image right (40%)
- Left: flogo.png (96px, next/image) + "Anglican Students' Fellowship" [Cinzel] + "ARISE, SHINE" [Cinzel small, crimson-500] + description paragraph + "Join the Fellowship →" button (crimson bg)
- Right: placeholder image (chapel photo or Cloudinary) with rounded-2xl
- Background: white
- Mobile: stacked (image on top)

src/components/home/GalleryTeaser.tsx:
- Fetch 6 latest active gallery items from Firestore
- Section header: "Our Community in Focus"
- 6-image CSS grid (2 cols mobile, 3 cols desktop) — images vary in aspect ratio for mosaic feel
- Each image: Cloudinary optimized, rounded-xl, hover scale(1.04) + brightness increase
- "View Full Gallery →" CTA button below grid

Final src/app/page.tsx:
Import and render in this exact order:
1. <HeroSection />
2. <AnnouncementsSection />
3. <EventsSection />
4. <DepartmentsStrip />
5. <ScriptureSection />
6. <FellowshipSection />
7. <GalleryTeaser />
All wrapped in <main>

PROMPT 9 — About Us + Events Pages
BUILD these complete pages:

src/app/about/page.tsx + components:
- Fetch chapel_info/main from Firestore (server component)
- SECTION 1: Hero — full bleed image (chapel_info.heroImageUrl or gradient), navy overlay, "Our Story" [Cinzel], subtitle badge "Holy Spirit Chapel · ESUT Agbani", fadeIn animation
- SECTION 2: Foundation of Faith — two columns: left (history text from chapel_info.aboutContent), right (blockquote card with chapelMotto "DOMINUS REGNANT" in gold Cinzel + visionStatement in Cormorant italic)
- SECTION 3: Core Beliefs — 6 icon cards (ivory-dark bg): Faith in Christ, Biblical Foundation, Community Service, Worship, Prayer, Outreach — each with Lucide icon + title + short description, stagger animation
- SECTION 4: Mission & Vision — full-width navy bg, side by side: Mission (left) | Vision (right), gold divider line, content from chapel_info.missionStatement and visionStatement, white text, Cormorant Garamond for the statements
- SECTION 5: Fellowship Identity — dedicated section for ASF, flogo.png (120px, light bg), fellowship name [Cinzel], "ARISE, SHINE" motto [crimson], description paragraph, crimson accent throughout
- SECTION 6: Meet Leadership — fetch from Firestore leadership collection (or hardcode 3 placeholder leaders), 3-col grid cards: Cloudinary photo (aspect-square, rounded-full 80px) + role badge + name [Libre Baskerville] + bio. If no leadership data: hide section gracefully.

src/app/events/page.tsx + components:
- Hero strip: "Life at the Chapel" title, chapel photo bg + overlay, category filter tabs below: All Events | Worship | Community | Youth | Outreach
- Fetch all active events from Firestore ordered by startDate asc
- Featured event (isFeatured==true): FeaturedEvent component — large card full width, bg image, "FEATURED EVENT" gold badge, title, date/time, location, description, "Register Now" primary button + "Add to Calendar" secondary
- Below featured: toggle between Grid/List view (useState, icon buttons)
  Grid: 3-col EventCard grid with date badge, image, category, title, time, location, "Details →"
  List: compact rows same data
- Filter tabs update displayed events (client-side filter on category)
- "Load More" button (show 6 initially, load 6 more on click)
- Newsletter strip at bottom: "Stay in the Loop" + FooterSubscribe component (source tag: 'events_page')
- Empty state: "No upcoming events. Check back soon." with chapel icon

PROMPT 10 — Gallery + Contact Pages + Core API Routes
BUILD gallery page, contact page, and 4 API routes:

src/app/gallery/page.tsx:
- Fetch all active gallery items from Firestore (getDocs, orderBy uploadedAt desc)
- Hero: "Our Community in Focus", subtitle
- Filter tabs: All | Worship | Community | Youth | Architecture | Events
  Active tab: sliding indicator (Framer Motion layoutId)
  Client-side filter — no re-fetch
- Masonry grid using CSS columns:
  mobile: columns-2, tablet: columns-3, desktop: columns-4
  gap-3, each image: break-inside-avoid mb-3 rounded-xl overflow-hidden
- Each image: next/image (Cloudinary URL, fill=false, width/height from aspect), hover: brightness(1.1) + scale(1.03) transition-all
- On click: open LightboxModal
- LightboxModal (AnimatePresence):
  Fixed fullscreen dark overlay
  Image centered, max-h-[85vh], object-contain
  Caption below (white text)
  Left/right arrow navigation (keyboard + click)
  Counter "3 / 24" top right
  Close X button top left
  Share button (Web Share API)
- Stagger entrance: each image delays 40ms × index, useInView
- Scripture quote section at bottom

src/app/contact/page.tsx:
- Page title: "We'd Love to Hear From You"
- Two-column layout (desktop), stacked (mobile)
- LEFT: Tabs component — "Send a Message" | "Prayer Request" | "Subscribe"
  TAB 1 — ContactForm:
    Fields: Name, Email, Subject (select: General / Prayer / Partnership / Other), Message (textarea)
    Submit: POST /api/contact
    Success: animated checkmark + "Message sent! We'll respond within 24 hours."
    Error: toast error
  TAB 2 — PrayerForm:
    Fields: Name, Email, Prayer Topic, Request (textarea), "Keep this private" checkbox
    Submit: POST /api/prayer
    Success: "Your prayer request has been received. Our prayer team will intercede for you."
  TAB 3 — Subscribe:
    FooterSubscribe component (source: 'contact_page')
- RIGHT:
  Contact details card: address (ESUT Agbani, Enugu State), phone, email, social icons
  Service times card: list from Firestore chapel_info/main.serviceTimes
  MapEmbed: Google Maps iframe for ESUT Agbani (use this src: "https://maps.google.com/maps?q=ESUT+Agbani+Enugu&output=embed"), height 300px, rounded-xl, border border-border
  "Get Directions" button: opens https://maps.google.com/?q=ESUT+Agbani+Enugu in new tab, chapel-blue bg

BUILD these API routes:

src/app/api/contact/route.ts (POST):
- Validate body with contactFormSchema (zod)
- Save to Firestore contact_messages collection with isRead: false
- Read contactEmails from Firestore admin_settings/config
- Send admin notification email via sendEmail() — subject "New Message from [name]", HTML shows full message
- Send auto-reply to user — subject "We received your message | Holy Spirit Chapel", friendly HTML template with chapel styling
- Return { success: true }

src/app/api/prayer/route.ts (POST):
- Validate with prayerFormSchema
- Save to Firestore prayer_requests
- Read prayerEmail from Firestore admin_settings/config
- Send to prayer email: full request details (mark as PRIVATE if isPrivate)
- Send confirmation to user: gentle HTML email "Your prayer has been received..."
- Return { success: true }

src/app/api/subscribe/route.ts (POST):
- Validate: name (min 2), email (valid)
- Check Firestore subscribers: if email exists and isActive: return "Already subscribed"
- If exists but isActive false: reactivate
- If new: add doc with generateToken() as unsubscribeToken, source from body
- Send welcome email: "Welcome to the Holy Spirit Chapel family!"
- Return { success: true, message: "Subscribed!" }

src/app/api/unsubscribe/[token]/route.ts (GET):
- Find subscriber by unsubscribeToken field
- Set isActive: false
- Return HTML response: simple styled page "You have been unsubscribed. God bless you."

PROMPT 11 — Remaining Admin Pages (Content Management)
BUILD these admin pages (all protected by admin layout auth guard):

src/app/admin/login/page.tsx:
- Centered card, dark navy bg (full screen)
- clogo.png (80px) centered at top
- "Chapel Admin" title [Cinzel, white]
- Email + Password inputs (styled per ui-skills)
- "Sign In" button — gold gradient
- Firebase Auth signInWithEmailAndPassword on submit
- On success: check admin_settings/config.twoFAEnabled
  If true: POST /api/admin/send-2fa → redirect to /admin/verify-2fa
  If false: redirect to /admin
- Error: toast.error("Invalid credentials")
- Loading state on button

src/app/admin/verify-2fa/page.tsx:
- Same dark bg as login
- "Check your email" icon (Mail, Lucide, large)
- Subtitle: "Enter the 6-digit code sent to your admin email"
- 6 individual digit inputs (auto-focus next on input, backspace goes back)
- OR single 6-digit input field
- Submit: POST /api/admin/verify-2fa with { uid, code }
- On success: set cookie 'admin_verified=true' (httpOnly via route) → redirect /admin
- Resend code button (60s cooldown timer)
- "Back to login" link

middleware.ts (root level):
- Protect all /admin/* routes except /admin/login and /admin/verify-2fa
- Check for 'admin_token' cookie (set on successful auth)
- If missing: redirect to /admin/login
- Also protect /api/admin/* routes

src/app/admin/announcements/page.tsx:
- Table of all announcements (title, category, active, startDate, actions)
- "New Announcement" button → inline form or modal
- Form fields: title, content (textarea), category (select), isPriority (toggle), startDate, endDate (optional), isActive (toggle)
- Save: addDoc or updateDoc to Firestore announcements
- Delete: with confirm dialog
- Edit: prefill form with existing data
- react-hook-form + zod

src/app/admin/events/page.tsx:
- Table of all events with filters (upcoming / past / all)
- "New Event" button → modal form
- Form: title, description, category, startDate (datetime-local), endDate, location, coverImage (CldUploadWidget), isFeatured toggle, requiresRegistration toggle, registrationUrl (conditional)
- Save/Edit/Delete with Firestore

src/app/admin/departments/page.tsx:
- Grid of department cards (reorder by drag — use simple up/down buttons if drag-drop is complex)
- "Add Department" button → modal form
- Form: name, description, icon (select from 20 preset Lucide icon names), headName, activities (dynamic add/remove text inputs), meetingSchedule, contactWhatsApp, coverImage (CldUploadWidget), isActive toggle
- Save/Edit/Delete with Firestore
- Auto-generate slug from name using slugify()

src/app/admin/gallery/page.tsx:
- Grid of all gallery images (4 cols, thumbnail size)
- Multi-upload via CldUploadWidget (multiple: true)
- On upload success: save each to Firestore gallery collection with category 'community' default
- Each image: category dropdown (editable inline), caption input, delete button
- Bulk select: checkboxes + "Delete selected" button
- Confirmation modal before delete (also deletes from Cloudinary via /api/upload DELETE)

PROMPT 12 — Payments + Subscribers + Final Admin Pages
BUILD remaining admin pages and complete the admin system:

src/app/admin/payments/page.tsx:
- Tab bar: All | Pending | Verified | Rejected
- Table: Donor Name | Email | Phone | Amount (₦) | Give Type | Method | Status badge | Date | Actions
- Status badges: pending=amber, verified=green, rejected=red
- For bank_transfer rows with status pending:
  "View Proof" button → opens modal with full screenshot image
  "Verify" button → POST /api/admin/payments/verify → updates Firestore status to 'verified' → sends receipt email → refreshes list
  "Reject" button → prompt for reason → POST /api/admin/payments/reject → sends rejection email
- Paystack rows: show reference number, status auto-set by webhook
- Pagination: 20 per page

src/app/api/admin/payments/verify/route.ts (POST):
- Auth check (admin only)
- Body: { transactionId }
- Update Firestore transaction: status='verified', adminVerifiedBy, adminVerifiedAt
- Fetch transaction details
- Send receipt email to donor (full chapel-styled HTML receipt with amount, give type, date, transaction ID)
- Update give_option totalReceived field (increment by amount)
- Return { success: true }

src/app/api/admin/payments/reject/route.ts (POST):
- Body: { transactionId, reason }
- Update status to 'rejected', save rejectionReason
- Send rejection email to donor: apologetic tone, reason, "Contact us if you believe this is an error"
- Return { success: true }

src/app/admin/subscribers/page.tsx:
- Stats: Total subscribers, Active, This month
- Table: Name | Email | Source | Date | Active toggle | Delete
- "Send Message" button → opens full-width composer panel:
  Subject input
  Message textarea (rich enough for simple formatting)
  Recipients toggle: "All Subscribers" | "Select Specific"
  If select specific: scrollable checklist of subscribers
  Preview button: shows rendered email preview
  Send button → POST /api/admin/subscribers/send → Nodemailer loop
  Show progress: "Sending... X of Y"

src/app/api/admin/subscribers/send/route.ts (POST):
- Auth check
- Body: { subject, message, recipientIds (array or 'all') }
- Fetch relevant subscribers from Firestore (isActive == true)
- Loop send via sendEmail() with personalized greeting + unsubscribe link
- Each email: "Dear [name]," + message + "\n\n---\nUnsubscribe: [appUrl]/api/unsubscribe/[token]"
- Return { success: true, sent: count }

src/app/admin/contact-messages/page.tsx:
- Table: Name | Email | Subject | Date | Read status
- Click row: expand to show full message inline OR side panel
- Mark as read on open (updateDoc isRead: true)
- Delete button with confirm
- Unread count badge on admin sidebar nav item

src/app/admin/prayer-requests/page.tsx:
- Table: Name | Topic | Private? | Date
- Click to view full request in modal
- Private requests: show lock icon, content blurred until "View" clicked
- Delete with confirm (sensitive data)
- Note at top: "Handle with care and confidentiality"

FINAL CHECKS:
1. Ensure middleware.ts is protecting all /admin/* routes
2. Ensure all Firestore writes have proper error handling with try/catch
3. Ensure all email sends have try/catch (email failure should not break form submission)
4. Add loading states to ALL async operations (buttons show spinner while submitting)
5. Add empty states to ALL tables and grids (when no data exists)
6. Run npx tsc --noEmit and fix all TypeScript errors
7. Test the full user journey: subscribe → give (Paystack) → give (bank transfer) → contact form → prayer request
8. Confirm all 7 email templates send correctly via the test email button in Settings

---

## 19. SKILLS TO INSTALL IN ANTIGRAVITY IDE

### Recommended (Install All Before Starting)
```
✅ nextjs-app-router-patterns   — Critical for Next.js 16 App Router patterns, server actions, route handlers
✅ tailwind-design-system       — Tailwind v4 config, design tokens, custom themes
✅ typescript-pro               — Strict TypeScript, generic types, Zod integration
✅ frontend-developer           — Component architecture, React 19 patterns
✅ ui-skills                    — Accessible UI components, form patterns
```

### Skip
```
❌ developing-genkit-js         — Not needed for this project (AI features are v2)
```

### Also Install If Available
```
✅ firebase-firestore            — If available, Firestore security rules + queries
✅ nodemailer-email              — If available, email templates
✅ paystack-integration          — If available, Nigerian payment stack
```

---

## 20. VERSION 2 BACKLOG

These features were scoped out of v1. Suggest to client after v1 launch:

| Feature | Priority | Notes |
|---|---|---|
| Sermon Archive | High | Audio/video upload, series organization, search |
| YouTube/Livestream Integration | Medium | If chapel starts streaming |
| Mobile App (React Native) | High | Push notifications for live, events |
| Members Portal | High | Registration, attendance, giving history |
| WhatsApp Bot Integration | Medium | Auto-reply for prayer requests |
| Online Bible Study | Medium | Embedded YouVersion or custom |
| Donation Goal Thermometer | Low | Visual progress bars on give page |
| Event RSVP System | Medium | Attendance tracking |
| Devotional/Daily Message | Medium | Admin posts daily scripture + thought |
| Multi-Language | Low | English + Igbo |

---

## NOTES & HARD RULES

1. **Never use `@/components/ui/` shadcn imports** — build all UI with plain HTML + Tailwind classes
2. **Cloudinary uploads**: Use `next-cloudinary` CldUploadWidget for admin, direct fetch() for server-side
3. **Firebase Firestore rules**: Must be manually published in Firebase Console — the IDE agent cannot do this. Always remind when rules need changing.
4. **Paystack secret key**: NEVER in Firestore or client code. Server-side API routes only via `process.env.PAYSTACK_SECRET_KEY`
5. **Gmail App Password**: The 16-digit password goes in SMTP_PASS env var. Never commit .env.local.
6. **2FA codes**: Never log to console in production. Store in Firestore, not hardcoded.
7. **Image transparency**: clogo.png has transparent background (dark areas are transparent). Use on both light and dark backgrounds freely. flogo.png has white background — use on light surfaces only.
8. **Framer Motion**: Always use `'use client'` directive in animated components.
9. **Firestore real-time**: Use `onSnapshot` ONLY for live_status. All other data use `getDocs` / `getDoc` (SSR-friendly).
10. **All monetary amounts**: Store and process in kobo for Paystack (naira × 100). Display as naira (divide ÷ 100, format with ₦).
```


IamHSCAdmin(2026)