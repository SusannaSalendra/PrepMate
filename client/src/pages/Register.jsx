import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BrainCircuit, Lock, Mail, User, Shield, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all required fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setError('');
    setSubmitting(true);

    const result = await register(name, email, password, role);
    setSubmitting(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0E6E68] to-[#20B2AA] flex items-center justify-center shadow-lg shadow-[#20B2AA]/20 group-hover:scale-105 transition-transform">
              <BrainCircuit className="w-6 h-6 text-[#0D1614]" />
            </div>
          </Link>
          <h1 className="text-3xl font-display font-bold text-[#F9FBFB] tracking-tight">
            Create Your Account
          </h1>
          <p className="text-sm text-[#8EA3A0] mt-2">
            Join PrepMate and start preparing for technical interviews today.
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

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-[#8EA3A0] mb-1.5 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8EA3A0]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#10201D] border border-[#20B2AA]/20 text-[#F1F3F2] placeholder-[#8EA3A0]/60 text-sm focus:outline-none focus:border-[#20B2AA] focus:ring-1 focus:ring-[#20B2AA] transition-all"
                />
              </div>
            </div>

            {/* Email Address */}
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

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-[#8EA3A0] mb-1.5 uppercase tracking-wider">
                Password (min. 6 characters)
              </label>
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

            {/* Role Selection */}
            <div>
              <label className="block text-xs font-semibold text-[#8EA3A0] mb-1.5 uppercase tracking-wider">
                Account Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('user')}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    role === 'user'
                      ? 'bg-[#20B2AA]/20 border-[#20B2AA] text-[#3FD1C7]'
                      : 'bg-[#10201D] border-[#20B2AA]/15 text-[#8EA3A0] hover:text-[#F1F3F2]'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Candidate (User)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    role === 'admin'
                      ? 'bg-[#20B2AA]/20 border-[#20B2AA] text-[#3FD1C7]'
                      : 'bg-[#10201D] border-[#20B2AA]/15 text-[#8EA3A0] hover:text-[#F1F3F2]'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin / Recruiter</span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#20B2AA] hover:bg-[#3FD1C7] text-[#0D1614] font-bold text-sm shadow-lg shadow-[#20B2AA]/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-6 hover:-translate-y-0.5"
            >
              {submitting ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer link */}
        <p className="text-center text-xs text-[#8EA3A0] mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[#3FD1C7] hover:text-[#F9FBFB] transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
