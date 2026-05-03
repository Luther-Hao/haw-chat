<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:project-agent-rules -->
# Project-Specific Agent Rules

## 1. Monorepo Structure

This is a **monorepo** with frontend/ and backend/ directories:

```
haw-chat/
├── frontend/          # Next.js 16 application
│   ├── src/          # Source code
│   ├── public/       # Static assets
│   ├── node_modules/ # Dependencies
│   ├── package.json
│   └── ...
├── backend/          # Python backend
│   ├── main.py
│   └── requirements.txt
├── .claude/          # Claude Code config (root level)
├── .git/             # Git repo (root level)
├── AGENTS.md         # This file (root level)
├── CLAUDE.md         # Project documentation (root level)
└── README.md         # (root level)
```

**CRITICAL**: Always work from the correct directory:
- Frontend dev: `cd frontend && npm run dev`
- Backend dev: `cd backend && python main.py`

## 2. Update Documentation After Changes
Whenever significant changes are made to the codebase, you MUST update the following files:
- `CLAUDE.md` - Document new patterns, components, and architecture
- `AGENTS.md` - Add relevant agent rules for future sessions
- `README.md` - Update setup instructions if needed

## 3. Commit & Push Workflow
After completing any meaningful coding task:
1. Review changes with `git status`
2. Commit with descriptive message including "Co-authored-by" if applicable
3. Push to remote with `git push origin master`
4. If push fails due to remote changes, use `git pull --rebase` first

## 4. i18n Requirements
All user-facing text MUST have translations in both languages:
- English (en) - default
- Simplified Chinese (zh)

Define translations in a `translations` object at the top of components:
```tsx
const translations = {
  en: { /* English text */ },
  zh: { /* Chinese text */ }
};
```

## 5. Lucide Icons
This project uses `lucide-react`. Note:
- Use `Terminal` icon instead of `Github` (not available in this version)
- Always check exports exist before importing

## 6. Design System
This project uses a **Refined Glassmorphism** aesthetic:
- Semi-transparent containers with `backdrop-filter: blur(20px)`
- Key CSS classes: `.glass-card`, `.glass-inner`, `.glass-input`, `.capsule-nav`
- Accent colors: Orange (#f97316), Lime green (#39FF14)
- Serif font (Playfair Display) for headings, Sans-serif (Inter) for body

## 7. Testing Checklist
Before marking a feature complete, verify:
- [ ] Language toggle works (EN/ZH switching)
- [ ] Dark mode toggle works
- [ ] Animations are smooth (60fps)
- [ ] Form inputs are functional
- [ ] Responsive design works on mobile
- [ ] No console errors

## 8. Backend Development
When working on the backend:
- Use Python 3.10+ with virtual environment
- Install dependencies: `pip install -r requirements.txt`
- Run with: `python main.py`
- Keep sensitive data in `.env` (not committed)
<!-- END:project-agent-rules -->

# currentDate
Today is 2026/05/03.