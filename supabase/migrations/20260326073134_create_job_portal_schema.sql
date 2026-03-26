/*
  # Job Portal Database Schema

  1. New Tables
    - `profiles` - User profiles with role information
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `full_name` (text)
      - `role` (text: 'job_seeker' or 'employer')
      - `company_name` (text, nullable)
      - `company_website` (text, nullable)
      - `bio` (text, nullable)
      - `avatar_url` (text, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `jobs` - Job postings
      - `id` (uuid, primary key)
      - `employer_id` (uuid, foreign key to profiles)
      - `title` (text)
      - `description` (text)
      - `requirements` (text)
      - `salary_min` (integer)
      - `salary_max` (integer)
      - `location` (text)
      - `job_type` (text: 'full_time', 'part_time', 'contract')
      - `category` (text)
      - `is_active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `applications` - Job applications
      - `id` (uuid, primary key)
      - `job_id` (uuid, foreign key to jobs)
      - `applicant_id` (uuid, foreign key to profiles)
      - `cover_letter` (text)
      - `resume_url` (text)
      - `status` (text: 'applied', 'reviewed', 'rejected', 'interview', 'accepted')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `saved_jobs` - Saved jobs for users
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `job_id` (uuid, foreign key to jobs)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Users can only view/modify their own data
    - Employers can view/edit only their own job postings
    - Job seekers can view all active jobs
    - Everyone can view employer profiles (for job context)
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  role text NOT NULL CHECK (role IN ('job_seeker', 'employer')),
  company_name text,
  company_website text,
  bio text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  requirements text NOT NULL,
  salary_min integer,
  salary_max integer,
  location text NOT NULL,
  job_type text NOT NULL CHECK (job_type IN ('full_time', 'part_time', 'contract')),
  category text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  applicant_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  cover_letter text NOT NULL,
  resume_url text NOT NULL,
  status text DEFAULT 'applied' CHECK (status IN ('applied', 'reviewed', 'rejected', 'interview', 'accepted')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(job_id, applicant_id)
);

CREATE TABLE IF NOT EXISTS saved_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  job_id uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, job_id)
);

CREATE INDEX IF NOT EXISTS idx_jobs_employer_id ON jobs(employer_id);
CREATE INDEX IF NOT EXISTS idx_jobs_is_active ON jobs(is_active);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_applicant_id ON applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_user_id ON saved_jobs(user_id);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Active jobs are viewable by everyone"
  ON jobs FOR SELECT
  USING (is_active = true);

CREATE POLICY "Employers can see all their jobs"
  ON jobs FOR SELECT
  TO authenticated
  USING (employer_id = auth.uid());

CREATE POLICY "Employers can insert jobs"
  ON jobs FOR INSERT
  TO authenticated
  WITH CHECK (employer_id = auth.uid());

CREATE POLICY "Employers can update their own jobs"
  ON jobs FOR UPDATE
  TO authenticated
  USING (employer_id = auth.uid())
  WITH CHECK (employer_id = auth.uid());

CREATE POLICY "Employers can delete their own jobs"
  ON jobs FOR DELETE
  TO authenticated
  USING (employer_id = auth.uid());

CREATE POLICY "Users can view their own applications"
  ON applications FOR SELECT
  TO authenticated
  USING (applicant_id = auth.uid() OR job_id IN (SELECT id FROM jobs WHERE employer_id = auth.uid()));

CREATE POLICY "Job seekers can apply for jobs"
  ON applications FOR INSERT
  TO authenticated
  WITH CHECK (applicant_id = auth.uid());

CREATE POLICY "Users can update their own applications"
  ON applications FOR UPDATE
  TO authenticated
  USING (applicant_id = auth.uid())
  WITH CHECK (applicant_id = auth.uid());

CREATE POLICY "Users can delete their own applications"
  ON applications FOR DELETE
  TO authenticated
  USING (applicant_id = auth.uid());

CREATE POLICY "Users can manage their saved jobs"
  ON saved_jobs FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
