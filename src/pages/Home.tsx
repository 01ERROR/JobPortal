import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Briefcase, ArrowRight, Users, Building2, TrendingUp } from 'lucide-react';

export const Home: React.FC = () => {
  const { user, profile } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">JobPortal</span>
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link to="/jobs" className="text-gray-600 hover:text-gray-900 font-medium">
                  Browse Jobs
                </Link>
                <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 font-medium">
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium">
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded-lg transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <section className="bg-gradient-to-br from-indigo-600 to-blue-600 text-white py-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Find Your Dream Job Today
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Connect with top employers and discover opportunities that match your skills and aspirations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/jobs"
              className="bg-white text-indigo-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition inline-flex items-center justify-center gap-2"
            >
              Browse Jobs
              <ArrowRight className="w-5 h-5" />
            </Link>
            {!user && (
              <Link
                to="/signup"
                className="border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white hover:text-indigo-600 transition inline-flex items-center justify-center gap-2"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Create Account</h3>
              <p className="text-gray-600">
                Sign up as a job seeker or employer in minutes. Setup your profile and start your journey.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Browse & Apply</h3>
              <p className="text-gray-600">
                Explore thousands of job opportunities and apply to positions that match your skills.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Get Hired</h3>
              <p className="text-gray-600">
                Connect with employers, attend interviews, and land your next opportunity today.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">For Employers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Hire Top Talent</h3>
              <ul className="space-y-4">
                {[
                  'Post unlimited job listings',
                  'Access a pool of qualified candidates',
                  'Review applications and track candidates',
                  'Manage your hiring process efficiently',
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-gray-700">
                    <div className="bg-indigo-600 rounded-full w-2 h-2" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/signup"
                className="mt-8 inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-lg transition"
              >
                Start Hiring
              </Link>
            </div>
            <div className="bg-gradient-to-br from-indigo-100 to-blue-100 rounded-lg h-64 flex items-center justify-center">
              <Building2 className="w-24 h-24 text-indigo-400" />
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="mb-4">
            Built with React, Supabase, and modern web technologies
          </p>
          <p className="text-sm">
            © 2024 JobPortal. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
