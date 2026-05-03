# Haw Chat

A monorepo containing a **Next.js 16 AI agent chat interface** frontend and **Python AI agent** backend.

## Project Structure

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

## Getting Started

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the portfolio.

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python main.py
```

## Features

### Frontend
- **Glassmorphism UI** - Premium glass-like aesthetic with backdrop blur
- **i18n Support** - English and Chinese language toggle
- **Dark/Light Mode** - Theme persistence with toggle
- **Framer Motion** - Smooth animations and parallax effects
- **Custom Cursor** - Spring physics-based cursor follower
- **Responsive Design** - Mobile-first approach

### Backend
- Python AI agent framework (in development)

## Tech Stack

### Frontend
- Next.js 16 with App Router
- React 19
- Tailwind CSS 4
- TypeScript 5
- Framer Motion
- Lucide React icons

### Backend
- Python 3.10+
- FastAPI (planned)
- Anthropic Claude API (planned)

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com/)

## License

MIT