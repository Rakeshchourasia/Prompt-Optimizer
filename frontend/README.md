# Prompt Manager - Frontend

Premium AI Prompt Management System with beautiful glassmorphism UI.

## Features

✨ **Beautiful UI**
- Glassmorphism design
- Dark theme with gradient colors
- Smooth animations with Framer Motion
- Responsive & mobile-friendly

🔐 **Authentication**
- JWT-based auth with auto-refresh
- Secure token management

📝 **Prompt Management**
- Create, edit, delete prompts
- Search & filtering
- Favorites & tags
- Version history
- One-click copy

📁 **Collections**
- Organize prompts
- Custom icons & colors

🔄 **Workflows**
- Multi-step automation
- Drag-and-drop builder
- Execute workflows

## Tech Stack

- React 18
- Vite
- Zustand (state management)
- React Query (data fetching)
- Framer Motion (animations)
- React Router v6
- Axios
- React Hot Toast

## Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your API URL:
```
VITE_API_URL=http://localhost:5000/api
```

4. Start development server:
```bash
npm run dev
```

5. Open http://localhost:5173

## Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

## Design System

The app uses a premium design system with:
- **Glassmorphism** effects for cards
- **Gradient colors** (purple, cyan, pink)
- **Dark theme** with rich backgrounds
- **Smooth animations** for all interactions
- **Responsive** design for all screen sizes

## Project Structure

```
src/
├── components/       # Reusable components
│   └── layout/      # Layout components
├── pages/           # Page components
├── services/        # API services
├── store/           # Zustand stores
├── styles/          # CSS files
├── App.jsx          # Main app
└── main.jsx         # Entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## License

MIT
