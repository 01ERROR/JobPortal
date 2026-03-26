import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  role: 'job_seeker' | 'employer';
  company_name?: string;
  company_website?: string;
  bio?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
};

export type Job = {
  id: string;
  employer_id: string;
  title: string;
  description: string;
  requirements: string;
  salary_min?: number;
  salary_max?: number;
  location: string;
  job_type: 'full_time' | 'part_time' | 'contract';
  category: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Application = {
  id: string;
  job_id: string;
  applicant_id: string;
  cover_letter: string;
  resume_url: string;
  status: 'applied' | 'reviewed' | 'rejected' | 'interview' | 'accepted';
  created_at: string;
  updated_at: string;
};

export type SavedJob = {
  id: string;
  user_id: string;
  job_id: string;
  created_at: string;
};
