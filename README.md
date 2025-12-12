# Custom Prompt Manager + AI Workflow Tool

A full-stack MERN application for managing AI prompts, organizing them into collections, and creating automated workflows. Built with a premium glassmorphism UI and production-ready backend.

![Tech Stack](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)

## Features

### 🔐 Authentication
- JWT authentication with refresh tokens
- Secure password hashing with bcrypt
- Auto-refresh on token expiration

### 📝 Prompt Management
- Create, edit, delete, and clone prompts
- Rich text/markdown support
- Tags and categories
- Favorite prompts
- Full-text search
- **Version Control** - track changes and rollback
- Usage analytics

### 📁 Collections
- Organize prompts into collections
- Custom icons and colors
- Public/private collections
- Share collections with team

### 🔄 Workflows
- Create multi-step workflows
- Drag-and-drop step reordering
- Execute workflows in sequence
- Save prompt snapshots
- Track execution history

### 👥 Workspaces
- Multi-workspace support
- Team collaboration
- Role-based access (Owner, Member, Viewer)
- Invite members via email

### 🔗 Sharing
- Public share links
- Password-protected links
- Expiring links
- Import shared resources
- View count tracking

### 🤖 AI Features (Optional)
- Optimize prompts with OpenAI
- Generate variations
- Summarize prompts
- Expand prompts

## Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- Joi validation
- Winston logging
- Rate limiting
- OpenAI API integration

### Frontend
- React 18 + Vite
- Zustand (state management)
- React Query (data fetching & caching)
- React Router v6
- Framer Motion (animations)
- Glassmorphism UI design
- Responsive design

## Quick Start

### Prerequisites
- Node.js 16+ and npm
- MongoDB (local or Atlas)
- OpenAI API key (optional, for AI features)

### 1. Clone & Install

```bash
# Clone repository
git clone <your-repo-url>
cd prompt

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Setup

**Backend** (`backend/.env`):
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/prompt-manager
JWT_SECRET=your-super-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
CORS_ORIGIN=http://localhost:5173
OPENAI_API_KEY=sk-your-key-here  # Optional
```

**Frontend** (`frontend/.env`):
```bash
cp frontend/.env.example frontend/.env
```

No changes needed if using defaults.

### 3. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Open http://localhost:5173

### 4. Create Account

1. Click "Sign up"
2. Enter your details
3. Start managing prompts!

## Project Structure

```
prompt/
├── backend/
│   ├── src/
│   │   ├── config/         # Database, Redis config
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Auth, validation, errors
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Logger, helpers
│   │   ├── app.js          # Express app
│   │   └── server.js       # Entry point
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── store/          # Zustand stores
│   │   ├── styles/         # CSS files
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── .env.example
│
└── README.md
```

## API Documentation

See [`backend/README.md`](./backend/README.md) for complete API documentation.

### Key Endpoints

- **Auth**: `/api/auth/*`
- **Prompts**: `/api/prompts/*`
- **Collections**: `/api/collections/*`
- **Workflows**: `/api/workflows/*`
**Workspaces**: `/api/workspaces/*`
- **Share**: `/api/share/*`
- **AI**: `/api/ai/*`

## Deployment

### Backend (Render)

1. Connect your GitHub repo
2. Create new Web Service
3. Set environment variables
4. Deploy

### Frontend (Vercel)

1. Import GitHub repo
2. Set framework to Vite
3. Add environment variable: `VITE_API_URL`
4. Deploy

### Database (MongoDB Atlas)

1. Create free cluster
2. Whitelist IP addresses
3. Get connection string
4. Update `MONGODB_URI` in backend

## Features Walkthrough

### Create a Prompt
1. Go to Prompts page
2. Click "New Prompt"
3. Add title, content, tags
4. Save

### Create a Collection
1. Go to Collections
2. Click "New Collection"
3. Choose icon & color
4. Add prompts

### Create a Workflow
1. Go to Workflows
2. Click "New Workflow"
3. Add steps with prompts
4. Reorder with drag-and-drop
5. Execute

### Share a Prompt
1. Open a prompt
2. Click Share
3. Choose public/private
4. Optionally add password
5. Copy link

## Development

### Backend Development
```bash
cd backend
npm run dev  # Nodemon with auto-reload
```

### Frontend Development
```bash
cd frontend
npm run dev  # Vite dev server with HMR
```

### Testing
```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## Security Best Practices

✅ JWT with refresh tokens
✅ Password hashing (bcrypt)
✅ Input validation (Joi)
✅ Rate limiting
✅ CORS protection
✅ Error handling
✅ Security headers

## Performance Optimizations

- MongoDB indexing
- React Query caching
- Optimistic updates
- Lazy loading
- Code splitting
- Image optimization

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

MIT License - see LICENSE file

## Support

For issues and questions, please open a GitHub issue.

---

Built with ❤️ using the MERN stack
# Prompt-Optimizer
