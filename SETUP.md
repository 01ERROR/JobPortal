# JobPortal - Full Stack Job Portal Application

A modern, production-ready job portal built with React, Supabase, and Sentry.

## Features

### For Job Seekers
- Browse and search job listings
- Apply for jobs with cover letter and resume
- Save favorite jobs
- Track application status
- View application history

### For Employers
- Post unlimited job listings
- Review and manage applications
- Update application statuses
- Track hiring pipeline

### Core Features
- Secure authentication with Supabase
- Role-based access control (job seeker / employer)
- Real-time database with PostgreSQL
- Error tracking with Sentry
- Responsive design for mobile and desktop

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions)
- **Icons**: Lucide React
- **Error Tracking**: Sentry
- **Build Tool**: Vite

## Environment Setup

### Prerequisites
- Node.js 16+ installed
- Supabase account (free tier available at https://supabase.com)
- Sentry account (optional, for error tracking)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SENTRY_DSN=your_sentry_dsn (optional)
```

3. The database schema is already created in Supabase. All tables have RLS (Row Level Security) enabled.

## Database Schema

### Tables

1. **profiles** - User profiles and account information
   - Supports both job seekers and employers
   - Includes company information for employers

2. **jobs** - Job postings
   - Created by employers
   - Search and filtering support
   - Salary range information

3. **applications** - Job applications
   - Links job seekers to job postings
   - Tracks application status
   - Stores cover letter and resume URL

4. **saved_jobs** - Bookmarked jobs
   - Allows job seekers to save favorite jobs
   - Quick access from user dashboard

## User Roles

### Job Seeker
- Sign up with email and password
- Browse all active jobs
- Apply to jobs
- Save favorite jobs
- Track applications and their status

### Employer
- Sign up with company information
- Post job listings
- View applications for their jobs
- Update application statuses (applied, reviewed, interview, accepted, rejected)
- Manage job postings

## Running the Application

Development:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Type checking:
```bash
npm run typecheck
```

Linting:
```bash
npm run lint
```

## Authentication Flow

1. Users sign up with email/password
2. Profile is automatically created
3. Role selection determines available features
4. Auth state is persisted and synced across tabs
5. Protected routes redirect to login if not authenticated

## Error Tracking with Sentry

Sentry is configured to track errors and performance metrics. To use it:

1. Create a Sentry account at https://sentry.io
2. Create a new project for React
3. Add your Sentry DSN to `.env` as `VITE_SENTRY_DSN`
4. Errors will be automatically captured and reported

## Security Features

- Row Level Security (RLS) on all database tables
- Users can only access/modify their own data
- Email/password authentication with Supabase
- Secure password hashing
- SQL injection protection
- CORS configuration

## File Structure

```
src/
├── components/          # Reusable components
├── contexts/           # React contexts (Auth, etc)
├── lib/                # Utility functions and configurations
├── pages/              # Page components
│   ├── Auth/           # Login, Signup
│   ├── Jobs/           # Job listing and details
│   └── Dashboard/      # User dashboards
├── App.tsx             # Main app component with routing
└── main.tsx            # App entry point
```

## Key Pages

- `/` - Home page
- `/login` - Login page
- `/signup` - Sign up page
- `/jobs` - Job listing (browsable by all)
- `/jobs/:id` - Job details and application
- `/post-job` - Post a new job (employers only)
- `/dashboard` - User dashboard (protected)
- `/applications/:jobId` - Applications for a job (employers only)

## Deployment

The application can be deployed to any static hosting service (Vercel, Netlify, etc).

1. Build the project: `npm run build`
2. Deploy the `dist/` folder to your hosting service
3. Ensure environment variables are configured in your hosting service

## Support

For issues or questions, check:
- Supabase documentation: https://supabase.com/docs
- Sentry documentation: https://docs.sentry.io
- React Router documentation: https://reactrouter.com
- Tailwind CSS documentation: https://tailwindcss.com

## License

MIT
