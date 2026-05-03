# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project Overview

**Haw Chat** is a monorepo containing a **Next.js 16 creative portfolio frontend** and a **Python AI agent backend**:

```
haw-chat/
├── frontend/          # Next.js 16 application
│   ├── src/          # Source code (app, components, styles)
│   ├── public/       # Static assets
│   ├── node_modules/ # Dependencies
│   └── package.json
├── backend/          # Python AI agent backend
│   ├── main.py
│   └── requirements.txt
└── [root-level config files]
```

## Development Commands

### Frontend (in `frontend/` directory)
```bash
cd frontend
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Backend (in `backend/` directory)
```bash
cd backend
pip install -r requirements.txt  # Install dependencies
python main.py                    # Run the backend
```

## Architecture

### Frontend Structure
```
frontend/src/app/
├── globals.css           # Global styles, CSS variables, glassmorphism classes
├── layout.tsx            # Root layout with fonts (Inter + Playfair Display)
├── page.tsx             # Landing page (/) - Main portfolio with all sections
└── workspace/
    ├── page.tsx          # Workspace page (/workspace) - AI chat interface
    └── components/
        ├── CustomCursor.tsx    # Custom cursor with spring physics
        ├── HeroSection.tsx    # Hero with animated typography
        ├── ScrollShowcase.tsx # Process/services section
        ├── MediaGrid.tsx      # Bento grid of projects
        └── Footer.tsx         # Footer with CTA, social links, marquee
```

### Backend Structure
```
backend/
├── main.py              # Entry point for AI agent
└── requirements.txt    # Python dependencies
```

**Path aliases**: `@/*` maps to `./frontend/src/*`

## Tech Stack

### Frontend
- **Next.js 16** with App Router - This version has breaking changes. Read `node_modules/next/dist/docs/` before writing code.
- **React 19**
- **Tailwind CSS 4** - Uses `@import "tailwindcss"` syntax, not v3 config
- **TypeScript 5**
- **Framer Motion** - For animations, parallax, scroll reveals
- **Lucide React** - For icons (Note: Use `Terminal` instead of `Github` for GitHub icon)

### Backend
- **Python 3.10+**
- **FastAPI** (planned) - Web framework
- **Anthropic Claude API** (planned) - AI agent capabilities

## Key Patterns

### Glassmorphism Components
- `.glass-card` - Main glassmorphic container with blur, border, shadow
- `.glass-inner` - Inner glass element with subtle blur
- `.glass-input` - Glassmorphic form inputs with focus states
- `.capsule-nav` - Capsule-shaped navigation bar

### CSS Variables (globals.css)
```css
/* Text Colors */
--notion-text, --notion-text-secondary
/* Glass Effects */
background: rgba(255, 255, 255, 0.7)
backdrop-filter: blur(20px)
border: 1px solid rgba(255, 255, 255, 0.3)
/* Accent Colors */
Orange: #f97316, Pink: #ec4899
Lime: #39FF14 (CSS variable --accent-green)
```

### Typography Classes
- `.font-serif` - Playfair Display for headings
- Serif font for "Welcome to LEO's Notes" and section titles
- Sans-serif (Inter) for body text

### Animation Patterns
- **Parallax**: Floating glass elements respond to scroll depth
- **Reveal**: Sections fade in with `whileInView` animations
- **Magnetic**: Profile card follows cursor with spring physics
- **Toggle Groups**: Language (EN/中) and dark mode switches

### i18n Implementation
All user-facing text is defined in a `translations` object with `en` and `zh` keys:
```tsx
const translations = {
  en: { welcome: "Welcome to LEO's Notes", ... },
  zh: { welcome: "欢迎来到 LEO's Notes", ... }
};
```

### Landing Page Sections
1. **Hero** - Welcome message with lime green underline
2. **Bio Card** - Profile with magnetic hover, social links
3. **About** - Mission + 3 focus areas (AI, Biology, Creative Coding)
4. **Services** - 4 cards (UI/UX, Branding, Digital Products, Creative Design)
5. **Projects** - 5 project cards with hover descriptions
6. **Process** - 4-step workflow with connector lines
7. **Contact** - Glassmorphic form
8. **Footer** - Logo + copyright

## Testing

When modifying interactive components:
1. Test language toggle - all text should switch EN/ZH
2. Test dark mode - theme should persist correctly
3. Test scroll behavior - parallax should be smooth
4. Test form validation - all inputs should work
5. Use browser DevTools to check for layout thrashing

## Important Notes

### Monorepo Structure
- Frontend code lives in `frontend/` directory
- Backend code lives in `backend/` directory
- Always `cd` to the appropriate directory before running commands
- Shared config files (`.gitignore`, `README.md`, `AGENTS.md`, `CLAUDE.md`) are at root level

### Git Workflow
- All significant changes should be committed and pushed to origin
- Update CLAUDE.md/AGENTS.md when making architectural changes
- Use descriptive commit messages

### Lucide Icons
Use `Terminal` icon instead of `Github` (not available in this version):
```tsx
import { Terminal } from "lucide-react"; // For GitHub icon
```