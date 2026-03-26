import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase, Job, Profile, Application } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { MapPin, Briefcase, DollarSign, ArrowLeft } from 'lucide-react';

export const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [employer, setEmployer] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  useEffect(() => {
    if (id) {
      fetchJob();
    }
  }, [id, user]);

  const fetchJob = async () => {
    try {
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (jobError) throw jobError;
      if (!jobData) {
        navigate('/jobs');
        return;
      }

      setJob(jobData);

      const { data: employerData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', jobData.employer_id)
        .maybeSingle();

      setEmployer(employerData);

      if (user) {
        const { data: applicationData } = await supabase
          .from('applications')
          .select('id')
          .eq('job_id', jobData.id)
          .eq('applicant_id', user.id)
          .maybeSingle();

        setHasApplied(!!applicationData);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Not specified';
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `From $${min.toLocaleString()}`;
    return `Up to $${max?.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Job not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/jobs')}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-6 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs
        </button>

        <div className="bg-white rounded-lg shadow p-8 mb-6">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{job.title}</h1>
            {employer && (
              <p className="text-gray-600">
                Posted by <span className="font-semibold">{employer.company_name || employer.full_name}</span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 pb-8 border-b">
            <div>
              <p className="text-gray-500 text-sm mb-1">Location</p>
              <div className="flex items-center gap-2 text-gray-900 font-semibold">
                <MapPin className="w-5 h-5 text-indigo-600" />
                {job.location}
              </div>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">Job Type</p>
              <div className="flex items-center gap-2 text-gray-900 font-semibold">
                <Briefcase className="w-5 h-5 text-indigo-600" />
                {job.job_type.replace('_', ' ')}
              </div>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">Salary</p>
              <div className="flex items-center gap-2 text-gray-900 font-semibold">
                <DollarSign className="w-5 h-5 text-indigo-600" />
                {formatSalary(job.salary_min, job.salary_max)}
              </div>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">Category</p>
              <p className="text-gray-900 font-semibold">{job.category}</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Description</h2>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">{job.description}</p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">{job.requirements}</p>
          </div>

          {employer && (
            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">About the Company</h3>
              <p className="text-gray-700 mb-2">{employer.company_name || employer.full_name}</p>
              {employer.company_website && (
                <a
                  href={employer.company_website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-700"
                >
                  Visit Website
                </a>
              )}
            </div>
          )}

          {user ? (
            <>
              {profile?.role === 'job_seeker' && !hasApplied && (
                <button
                  onClick={() => setShowApplicationForm(!showApplicationForm)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition"
                >
                  {showApplicationForm ? 'Cancel' : 'Apply Now'}
                </button>
              )}

              {hasApplied && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-3 rounded-lg">
                  You have already applied for this position.
                </div>
              )}

              {profile?.role === 'employer' && (
                <Link
                  to={`/applications/${job.id}`}
                  className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition"
                >
                  View Applications
                </Link>
              )}
            </>
          ) : (
            <div className="text-center">
              <p className="text-gray-600 mb-4">Sign in to apply for this job</p>
              <Link
                to="/login"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition inline-block"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>

        {showApplicationForm && profile?.role === 'job_seeker' && (
          <ApplicationForm jobId={job.id} onSuccess={() => setHasApplied(true)} />
        )}
      </div>
    </div>
  );
};

interface ApplicationFormProps {
  jobId: string;
  onSuccess: () => void;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({ jobId, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    coverLetter: '',
    resumeUrl: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      const { error: submitError } = await supabase.from('applications').insert([
        {
          job_id: jobId,
          applicant_id: user.id,
          cover_letter: formData.coverLetter,
          resume_url: formData.resumeUrl,
        },
      ]);

      if (submitError) throw submitError;
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Apply for This Position</h3>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-2">
            Cover Letter
          </label>
          <textarea
            id="coverLetter"
            name="coverLetter"
            value={formData.coverLetter}
            onChange={handleChange}
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            placeholder="Tell us why you're interested in this position..."
            required
          />
        </div>

        <div>
          <label htmlFor="resumeUrl" className="block text-sm font-medium text-gray-700 mb-2">
            Resume URL
          </label>
          <input
            id="resumeUrl"
            type="url"
            name="resumeUrl"
            value={formData.resumeUrl}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            placeholder="https://example.com/resume.pdf"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
};
