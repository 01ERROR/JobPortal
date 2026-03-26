import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, Job, Application } from '../../lib/supabase';
import { Briefcase, Plus, LogOut, FileText } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<{ jobs?: Job[]; applications?: Application[] }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadData();
  }, [user, profile]);

  const loadData = async () => {
    try {
      if (profile?.role === 'employer') {
        const { data: jobs } = await supabase
          .from('jobs')
          .select('*')
          .eq('employer_id', user!.id)
          .order('created_at', { ascending: false });
        setData({ jobs: jobs || [] });
      } else {
        const { data: applications } = await supabase
          .from('applications')
          .select('*')
          .eq('applicant_id', user!.id)
          .order('created_at', { ascending: false });
        setData({ applications: applications || [] });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">JobPortal</span>
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {profile?.full_name}</h1>
          <p className="text-gray-600">
            {profile?.role === 'employer' ? 'Manage your job postings' : 'Track your applications'}
          </p>
        </div>

        {profile?.role === 'employer' ? (
          <EmployerDashboard
            jobs={data.jobs || []}
            onJobsUpdate={loadData}
          />
        ) : (
          <JobSeekerDashboard applications={data.applications || []} />
        )}
      </div>
    </div>
  );
};

interface EmployerDashboardProps {
  jobs: Job[];
  onJobsUpdate: () => void;
}

const EmployerDashboard: React.FC<EmployerDashboardProps> = ({ jobs, onJobsUpdate }) => {
  return (
    <div className="space-y-8">
      <Link
        to="/post-job"
        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition"
      >
        <Plus className="w-5 h-5" />
        Post a New Job
      </Link>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Job Postings ({jobs.length})</h2>

        {jobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">You haven't posted any jobs yet</p>
            <Link
              to="/post-job"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Post your first job
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                    <p className="text-gray-600 text-sm">{job.location}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    job.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {job.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>
                <Link
                  to={`/applications/${job.id}`}
                  className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  <FileText className="w-4 h-4" />
                  View Applications
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface JobSeekerDashboardProps {
  applications: Application[];
}

const JobSeekerDashboard: React.FC<JobSeekerDashboardProps> = ({ applications }) => {
  const [jobs, setJobs] = useState<Map<string, Job>>(new Map());

  useEffect(() => {
    fetchJobs();
  }, [applications]);

  const fetchJobs = async () => {
    const jobMap = new Map<string, Job>();
    for (const app of applications) {
      if (!jobMap.has(app.job_id)) {
        const { data } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', app.job_id)
          .maybeSingle();
        if (data) {
          jobMap.set(app.job_id, data);
        }
      }
    }
    setJobs(jobMap);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      applied: 'bg-blue-100 text-blue-800',
      reviewed: 'bg-yellow-100 text-yellow-800',
      interview: 'bg-purple-100 text-purple-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return colors[status] || colors.applied;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Applications ({applications.length})</h2>

      {applications.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">You haven't applied to any jobs yet</p>
          <Link
            to="/jobs"
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Browse jobs
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const job = jobs.get(app.job_id);
            return (
              <div key={app.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{job?.title || 'Loading...'}</h3>
                    <p className="text-gray-600 text-sm">{job?.location || ''}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4">Applied on {new Date(app.created_at).toLocaleDateString()}</p>
                {job && (
                  <Link
                    to={`/jobs/${job.id}`}
                    className="text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    View Job Details
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
