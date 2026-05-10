# Loan Lead Management System

## Project Overview
Full-stack loan lead management application with Angular 17+ frontend, Express backend, and Supabase database.

## Tech Stack
- **Frontend**: Angular 17+ (standalone components, Angular Material)
- **Backend**: Node.js + Express + TypeScript
- **Database**: Supabase (PostgreSQL)
- **Auth**: JWT (hardcoded admin credentials)
- **Deployment**: Render (backend), Netlify/Render Static (frontend)

## Credentials
- **Admin Username**: `admin`
- **Admin Password**: `Admin@123`

## Getting Started

### Prerequisites
1. Supabase account with a new project
2. Node.js 20+
3. Angular CLI 17+

### Supabase Setup
1. Create a new Supabase project at https://app.supabase.com
2. Run `supabase-schema.sql` in the SQL Editor
3. Copy Project URL and anon/service keys

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your Supabase credentials and JWT secret
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
ng serve
```

## Project Structure
```
loan-lead-management/
├── frontend/          # Angular 17+ SPA
│   └── src/
│       └── app/
│           ├── core/             # Guards, interceptors, services
│           └── features/          # Login, Dashboard, AddLead, UploadLeads
├── backend/           # Express API
│   └── src/
│       ├── config/               # Supabase client
│       ├── controllers/          # Route handlers
│       ├── middleware/           # JWT auth
│       ├── routes/              # API routes
│       └── services/            # Business logic
├── render.yaml       # Render deployment config
├── supabase-schema.sql
└── README.md
```

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | Admin login |
| GET | /api/leads/running | Get all running loans |
| GET | /api/leads/completed | Get all completed loans |
| POST | /api/leads/running | Add running loan |
| POST | /api/leads/completed | Add completed loan |
| POST | /api/leads/upload | Upload Excel file |
| DELETE | /api/leads/running/:id | Delete running loan |
| DELETE | /api/leads/completed/:id | Delete completed loan |

## Excel Upload Format
- Sheet name: `RUNNING LOANS` or `COMPLETED LOANS`
- Columns match database fields exactly
- Header row must contain "SNO" in first column
