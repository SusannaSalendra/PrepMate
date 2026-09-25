import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BrainCircuit, Lock, Mail, ArrowRight, AlertCircle, Sparkles, UserCheck } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setError('');
    setSubmitting(true);

    const result = await login(email, password);
    setSubmitting(false);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
  };

  const handleDemoFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0E6E68] to-[#20B2AA] flex items-center justify-center shadow-lg shadow-[#20B2AA]/20 group-hover:scale-105 transition-transform">
              <BrainCircuit className="w-6 h-6 text-[#0D1614]" />
            </div>
          </Link>
          <h1 className="text-3xl font-display font-bold text-[#F9FBFB] tracking-tight">
            Welcome Back to PrepMate
          </h1>
          <p className="text-sm text-[#8EA3A0] mt-2">
            Sign in to access your saved questions, mock sessions, and dashboard.
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-card rounded-3xl p-8 border border-[#20B2AA]/20 shadow-2xl relative">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-xs animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-[#8EA3A0] mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8EA3A0]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#10201D] border border-[#20B2AA]/20 text-[#F1F3F2] placeholder-[#8EA3A0]/60 text-sm focus:outline-none focus:border-[#20B2AA] focus:ring-1 focus:ring-[#20B2AA] transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#8EA3A0] uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8EA3A0]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#10201D] border border-[#20B2AA]/20 text-[#F1F3F2] placeholder-[#8EA3A0]/60 text-sm focus:outline-none focus:border-[#20B2AA] focus:ring-1 focus:ring-[#20B2AA] transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#20B2AA] hover:bg-[#3FD1C7] text-[#0D1614] font-bold text-sm shadow-lg shadow-[#20B2AA]/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5"
            >
              {submitting ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-[#20B2AA]/15">
            <p className="text-xs font-semibold text-[#8EA3A0] text-center mb-3">
              Quick Demo Accounts:
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleDemoFill('alex@example.com', 'user123')}
                className="p-2.5 rounded-xl bg-[#10201D] hover:bg-[#162B27] border border-[#20B2AA]/20 text-[#F1F3F2] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5 text-[#20B2AA]" />
                <span>Demo User</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('admin@prepmate.com', 'admin123')}
                className="p-2.5 rounded-xl bg-[#10201D] hover:bg-[#162B27] border border-[#20B2AA]/20 text-[#3FD1C7] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#20B2AA]" />
                <span>Demo Admin</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer link */}
        <p className="text-center text-xs text-[#8EA3A0] mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-[#3FD1C7] hover:text-[#F9FBFB] transition-colors">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
