# Fullstack Project

Full-stack application với React frontend, Flutter mobile app, và Python/Node.js backend.

## Stack

- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **Mobile:** Flutter + BLoC + Clean Architecture
- **Backend:**
  - Python: FastAPI + SQLAlchemy + Pydantic
  - Node.js: Express + Mongoose/Sequelize
- **Database:** PostgreSQL + MongoDB
- **Infrastructure:** Supabase (Auth, Storage, Realtime)
- **DevOps:** Docker Compose

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- Docker & Docker Compose
- Flutter SDK (for mobile)

### Setup
1. Copy `.env.example` to `.env` and fill in values
2. Install dependencies:
   ```bash
   # Backend Python
   cd backend/python-api
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt

   # Backend Node
   cd backend/node-api
   npm install

   # Frontend
   cd frontend
   npm install

   # Mobile
   cd mobile
   flutter pub get
   ```

3. Start services:
   ```bash
   docker-compose up -d
   ```

## Project Structure

See `CLAUDE.md` for detailed architecture and development guidelines.

## Development Workflow

1. **Database Design** → ERD + Migrations
2. **Backend** → API endpoints + Business logic
3. **Frontend** → React components + API integration
4. **Mobile** → Flutter screens + State management
5. **Testing** → Unit + Integration + E2E
6. **Deploy** → Docker + CI/CD

## Documentation

- [CLAUDE.md](./CLAUDE.md) - Development guidelines for Claude Code
- [API Documentation](./backend/README.md) - API endpoints
- [Frontend Guide](./frontend/README.md) - React patterns
- [Mobile Guide](./mobile/README.md) - Flutter architecture
