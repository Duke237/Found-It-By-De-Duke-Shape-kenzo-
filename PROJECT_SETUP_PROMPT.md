# Full Project Setup Prompt - Lost & Found Application

This is a comprehensive prompt to recreate the complete Next.js 16 Lost & Found application we built together.

## Project Overview

Create a **Lost & Found web application** using:
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4
- **Package Manager**: Bun
- **Database**: Drizzle ORM with SQLite (for local dev)

## Core Features Implemented

### 1. Landing Page Sections
- **Hero Section**: Search toggle, floating item cards, call-to-action buttons
- **Stats Section**: 4 key metrics (items found, happy users, matches, cities)
- **Features Section**: 6 platform features with icons
- **How It Works Section**: 4-step process
- **Recent Items Section**: Filterable item cards by category and status
- **Testimonials Section**: 6 success stories with trust indicators
- **CTA Section**: Call-to-action for getting started

### 2. Authentication System
- **Login Page**: Split-screen auth card with form validation
- **Signup Page**: Same layout as login
- **Protected Routes**: Middleware that redirects unauthenticated users to login
- **Session Management**: Demo cookie-based session (no real auth)
- **API Routes**:
  - `/api/auth/login` - POST
  - `/api/auth/signup` - POST
  - `/api/auth/me` - GET
  - `/api/auth/logout` - POST

### 3. Dashboard Pages (Protected - require login)
- **Dashboard Overview**: Welcome message with user stats
- **Report Lost Item**: Full form with item name, description, category (8 categories), location, date/time, image upload, contact number
- **Report Found Item**: Same structure as lost item
- **AI Assistant**: Chat interface (only responds to lost/found related queries)
- **Notifications**: System alerts (match found, submission status, updates)
- **Settings**: Profile picture upload, username, email, password change, language preference

### 4. Admin Dashboard
- **Admin Dashboard**: Overview with stats
- **Lost Reports**: List of all lost item reports
- **Found Reports**: List of all found item reports
- **Matches**: AI-powered matching interface
- **Users**: User management
- **Analytics**: Statistics and charts
- **Notifications**: Admin notification management
- **Settings**: Admin settings

### 5. Public Pages
- **Browse Page** (protected): Search and filter lost/found items
- **Report Page** (protected): Quick access to report forms

## Key Technical Implementations

### 1. Logo Component
- Image-only logo using `/images/logo (2).png`
- Three sizes: sm (40px), md (48px), lg (56px)
- Used in Navbar, Footer, Sidebar, AdminSidebar

### 2. Icons System
- **Bootstrap Icons** - installed via npm
- Custom `BootstrapIcon` component with inline SVGs for performance
- Used throughout: landing page, dashboard, admin, auth pages

### 3. UI Components
- **Button**: 4 variants (primary, secondary, outline, ghost)
- **Badge**: 5 color variants (blue, green, red, yellow, gray)
- **Logo**: Image-only with responsive sizing

### 4. Navigation
- **Desktop Navbar**: Sticky with mobile menu
- **Desktop Sidebar**: Dashboard navigation
- **Mobile Bottom Nav**: 5 tabs (Home, Search, Analytics, Notifications, Profile)
- **Admin Sidebar**: Admin navigation
- **Admin Bottom Nav**: Mobile admin navigation

### 5. Color System
- Primary: Blue (`blue-600`)
- Background: White/Black
- Text: Dark gray/black
- Accent colors for badges and buttons

### 6. Database
- **Drizzle ORM** with SQLite
- Schema includes: users, items, matches, notifications
- Lazy initialization to prevent build-time DB connection errors

### 7. Error Handling
- Suspense boundaries for login/signup pages (required for useSearchParams)
- Error boundaries where needed

### 8. Next.js Configuration
- Turbopack enabled (`turbopack: {}`)
- Webpack configuration for dev builds
- Image optimization with remote patterns

## File Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with Inter font
│   ├── page.tsx                # Home page
│   ├── globals.css             # Global styles + animations
│   ├── (auth)/                 # Auth routes group
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (protected)/            # Protected routes group
│   │   ├── dashboard/         # User dashboard
│   │   ├── browse/page.tsx
│   │   └── report/page.tsx
│   ├── (admin)/               # Admin routes group
│   │   └── admin/
│   │       ├── page.tsx
│   │       ├── analytics/
│   │       ├── found-reports/
│   │       ├── lost-reports/
│   │       ├── matches/
│   │       ├── notifications/
│   │       ├── settings/
│   │       └── users/
│   └── api/                   # API routes
│       ├── auth/
│       ├── items/
│       ├── notifications/
│       └── socketio/
├── components/
│   ├── admin/
│   │   ├── AdminBottomNav.tsx
│   │   └── AdminSidebar.tsx
│   ├── auth/
│   │   ├── AuthCard.tsx
│   │   ├── AuthField.tsx
│   │   ├── AuthProvider.tsx
│   │   ├── PasswordField.tsx
│   │   └── useAuth.ts
│   ├── dashboard/
│   │   ├── BottomNav.tsx
│   │   └── Sidebar.tsx
│   ├── layout/
│   │   ├── Footer.tsx
│   │   └── Navbar.tsx
│   ├── notifications/
│   │   └── NotificationBadge.tsx
│   ├── sections/
│   │   ├── CTA.tsx
│   │   ├── Features.tsx
│   │   ├── Hero.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── RecentItems.tsx
│   │   ├── Stats.tsx
│   │   └── Testimonials.tsx
│   └── ui/
│       ├── Badge.tsx
│       ├── BootstrapIcon.tsx
│       ├── Button.tsx
│       └── Logo.tsx
├── db/
│   ├── index.ts
│   ├── migrate.ts
│   ├── schema.ts
│   └── migrations/
└── lib/
    ├── auth/
    ├── jobs/
    ├── matching/
    ├── notifications/
    └── websocket/
```

## Important Notes

1. **Run Commands**:
   - `bun install` - Install dependencies
   - `bun run dev` - Start dev server (NOT `bun dev`)
   - `bun build` - Production build
   - `bun lint` - ESLint
   - `bun typecheck` - TypeScript

2. **Logo Image**:
   - Place at `public/images/logo (2).png`
   - Use only the image, no text

3. **Bootstrap Icons**:
   - Install: `bun add bootstrap-icons`
   - Create reusable component with inline SVGs

4. **Database Setup**:
   - Use lazy initialization to prevent build-time errors
   - Add Suspense boundaries to auth pages

5. **Middleware**:
   - Protect dashboard, report, browse routes
   - Redirect unauthenticated users to login with ?next= parameter

## CSS Animations Used

- Float animation for floating cards
- Fade-in for sections
- Ping-slow for notification badges

This prompt contains everything needed to recreate the complete Lost & Found application.
