import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, Job } from '../../lib/supabase';
import { MapPin, Briefcase, DollarSign, Heart } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const JobListing: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const { user } = useAuth();

  useEffect(() => {
    fetchJobs();
    if (user) {
      fetchSavedJobs();
    }
  }, [user]);

  const fetchJobs = async () => {
    try {
      let query = supabase
        .from('jobs')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }

      if (selectedType) {
        query = query.eq('job_type', selectedType);
      }

      const { data, error } = await query;
      if (error) throw error;
      setJobs(data || []);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedJobs = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('saved_jobs')
      .select('job_id')
      .eq('user_id', user.id);

    setSavedJobs(new Set(data?.map((j) => j.job_id) || []));
  };

  const toggleSaveJob = async (jobId: string) => {
    if (!user) return;

    const isSaved = savedJobs.has(jobId);

    try {
      if (isSaved) {
        await supabase.from('saved_jobs').delete().match({ user_id: user.id, job_id: jobId });
        setSavedJobs((prev) => {
          const next = new Set(prev);
          next.delete(jobId);
          return next;
        });
      } else {
        await supabase
          .from('saved_jobs')
          .insert([{ user_id: user.id, job_id: jobId }]);
        setSavedJobs((prev) => new Set(prev).add(jobId));
      }
    } catch (error) {
      console.error('Error toggling saved job:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(fetchJobs, 300);
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Not specified';
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `From $${min.toLocaleString()}`;
    return `Up to $${max?.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Find Your Next Opportunity</h1>

          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search jobs..."
                className="px-4 py-2 rounded-lg text-gray-900 focus:outline-none"
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 rounded-lg text-gray-900 focus:outline-none"
              >
                <option value="">All Categories</option>
                <option value="technology">Technology</option>
                <option value="marketing">Marketing</option>
                <option value="sales">Sales</option>
                <option value="finance">Finance</option>
                <option value="design">Design</option>
              </select>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 rounded-lg text-gray-900 focus:outline-none"
              >
                <option value="">All Types</option>
                <option value="full_time">Full Time</option>
                <option value="part_time">Part Time</option>
                <option value="contract">Contract</option>
              </select>
              <button
                type="submit"
                className="bg-white text-indigo-600 font-semibold px-6 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No jobs found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Link to={`/jobs/${job.id}`} className="text-xl font-bold text-indigo-600 hover:text-indigo-700">
                      {job.title}
                    </Link>
                    <p className="text-gray-600 text-sm mt-1">{job.category}</p>
                  </div>
                  {user && (
                    <button
                      onClick={() => toggleSaveJob(job.id)}
                      className="focus:outline-none transition"
                    >
                      <Heart
                        className={`w-6 h-6 ${
                          savedJobs.has(job.id)
                            ? 'fill-red-500 text-red-500'
                            : 'text-gray-400 hover:text-red-500'
                        }`}
                      />
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    {job.job_type.replace('_', ' ')}
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    {formatSalary(job.salary_min, job.salary_max)}
                  </div>
                </div>

                <p className="text-gray-700 line-clamp-2 mb-4">{job.description}</p>

                <Link
                  to={`/jobs/${job.id}`}
                  className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded-lg transition"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
