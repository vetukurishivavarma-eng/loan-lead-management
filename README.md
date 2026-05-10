# Loan Lead Management System
A full-stack loan lead management application.

## Tech Stack
- **Frontend**: Angular 17+ (standalone components, Angular Material)
- **Backend**: Node.js + Express + TypeScript
- **Database**: Supabase (PostgreSQL)
- **Auth**: JWT (hardcoded admin credentials)

## Admin Credentials
- Username: `admin`
- Password: `Admin@123`

## Project Structure
```
loan-lead-management/
├── frontend/          # Angular SPA
├── backend/           # Express API
├── render.yaml        # Render deployment config
└── README.md
```

## Getting Started

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Configure your Supabase credentials in .env
npm run dev
```

### Frontend
```bash
cd frontend
npm install
ng serve
```

## API Endpoints

### Auth
- `POST /api/auth/login` - Admin login

### Leads (all protected by JWT)
- `GET /api/leads/running` - Get all running loans
- `GET /api/leads/completed` - Get all completed loans
- `POST /api/leads/running` - Add running loan
- `POST /api/leads/completed` - Add completed loan
- `POST /api/leads/upload` - Upload Excel file
- `DELETE /api/leads/running/:id` - Delete running loan
- `DELETE /api/leads/completed/:id` - Delete completed loan
