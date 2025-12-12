# Prompt Manager Backend

Production-ready REST API for the Custom Prompt Manager + AI Workflow Tool.

## Features

- 🔐 JWT Authentication with refresh tokens
- 📝 Prompt management with version control
- 📁 Collections for organizing prompts
- 🔄 Multi-step workflows
- 👥 Workspace collaboration
- 🔗 Public/private sharing
- 🤖 AI-powered optimization (OpenAI)
- ⚡ Rate limiting & validation
- 📊 Comprehensive logging

## Tech Stack

- Node.js + Express
- MongoDB with Mongoose
- JWT authentication
- OpenAI API integration
- Winston logging
- Joi validation

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update environment variables in `.env`:
- Set your MongoDB connection string
- Add JWT secrets
- Add OpenAI API key (optional)

4. Start development server:
```bash
npm run dev
```

5. For production:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Prompts
- `GET /api/prompts` - Get all prompts
- `POST /api/prompts` - Create prompt
- `GET /api/prompts/:id` - Get prompt
- `PUT /api/prompts/:id` - Update prompt
- `DELETE /api/prompts/:id` - Delete prompt
- `POST /api/prompts/:id/clone` - Clone prompt
- `POST /api/prompts/:id/favorite` - Toggle favorite
- `GET /api/prompts/:id/versions` - Get versions
- `POST /api/prompts/:id/rollback/:versionId` - Rollback

### Collections
- `GET /api/collections` - Get all collections
- `POST /api/collections` - Create collection
- `POST /api/collections/:id/prompts` - Add prompt

### Workflows
- `GET /api/workflows` - Get all workflows
- `POST /api/workflows` - Create workflow
- `POST /api/workflows/:id/execute` - Execute workflow
- `PATCH /api/workflows/:id/reorder` - Reorder steps

### Workspaces
- `GET /api/workspaces` - Get all workspaces
- `POST /api/workspaces` - Create workspace
- `POST /api/workspaces/:id/members` - Invite member

### Share
- `POST /api/share` - Create share link
- `GET /api/share/:token` - Get shared resource
- `POST /api/share/:token/import` - Import resource

### AI
- `POST /api/ai/optimize` - Optimize prompt
- `POST /api/ai/variations` - Generate variations
- `POST /api/ai/summarize` - Summarize prompt
- `POST /api/ai/expand` - Expand prompt

## Project Structure

```
src/
├── config/          # Database & configuration
├── controllers/     # Route handlers
├── middleware/      # Auth, validation, errors
├── models/          # MongoDB schemas
├── routes/          # API routes
├── utils/           # Helpers & logger
├── app.js           # Express app
└── server.js        # Server entry point
```

## License

MIT
