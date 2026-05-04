# Haw Chat

A monorepo containing a **Next.js 16 AI agent chat interface** frontend and **Python AI agent** backend.

## Project Structure

```
haw-chat/
├── frontend/          # Next.js 16 application
│   ├── src/          # Source code (app, components, styles)
│   ├── public/       # Static assets
│   ├── node_modules/ # Dependencies
│   ├── .env.local    # Frontend environment variables
│   └── package.json
├── backend/          # Python AI agent backend
│   ├── main.py       # FastAPI server with streaming support
│   ├── requirements.txt
│   └── .env          # Backend environment variables
└── [root-level config files]
```

## Quick Start

### Running Frontend and Backend Together

**Option 1: Two Terminals (Recommended for development)**

Terminal 1 - Start Backend:
```bash
cd backend
pip install -r requirements.txt
python main.py
```
Backend runs at: http://localhost:8000

Terminal 2 - Start Frontend:
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at: http://localhost:3000

**Option 2: Concurrently (Run both in one terminal)**

```bash
# Install concurrently globally
npm install -g concurrently

# Run both frontend and backend
concurrently "cd frontend && npm run dev" "cd backend && python main.py"
```

### Environment Configuration

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Backend** (`backend/.env`):
```env
PORT=8000
HOST=0.0.0.0
```

## Features

### Frontend
- **Glassmorphism UI** - Premium glass-like aesthetic with backdrop blur
- **i18n Support** - English and Chinese language toggle
- **Dark/Light Mode** - Theme persistence with toggle
- **Framer Motion** - Smooth animations and parallax effects
- **Custom Cursor** - Spring physics-based cursor follower
- **Responsive Design** - Mobile-first approach
- **Streaming Chat** - Real-time AI responses via Server-Sent Events

### Backend
- **FastAPI Server** - High-performance Python web framework
- **Streaming Responses** - Server-Sent Events (SSE) for real-time chat
- **CORS Enabled** - Ready for frontend integration
- **Mock AI Responses** - Demo mode (replace with real AI in production)

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/health` | Detailed health status |
| POST | `/chat` | Non-streaming chat (request/response) |
| POST | `/chat/stream` | Streaming chat via SSE |
| GET | `/history` | Chat history (placeholder) |

### Request Example

```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"content": "Hello!", "chat_history": []}'
```

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
- FastAPI
- Uvicorn (ASGI server)
- Pydantic (data validation)

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com/)

## License

MIT