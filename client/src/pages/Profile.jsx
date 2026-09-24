import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Calendar, Lock, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import api from '../api/axios';

export const Profile = () => {
  const { user, updateUserData } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (newPassword && newPassword !== confirmPassword) {
      setErrorMsg('New password and confirmation do not match');
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters');
      return;
    }

    setSaving(true);
    try {
      const payload = { name, email };
      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const res = await api.put('/users/profile', payload);
      if (res.data?.success) {
        setSuccessMsg('Profile updated successfully!');
        updateUserData(res.data.data);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || err.customMessage || 'Failed to update profile'
      );
    } finally {
      setSaving(false);
    }
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recently';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <User className="w-7 h-7 text-indigo-400" />
          <span>My Profile & Settings</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your personal account settings and security credentials
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* User Card Sidebar */}
        <div className="md:col-span-4 space-y-6">
          <div className="glass-card rounded-3xl p-6 border border-slate-800 text-center">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 shadow-xl shadow-indigo-500/20">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <h2 className="text-lg font-bold text-white">{user?.name}</h2>
            <p className="text-xs text-slate-400 mb-4">{user?.email}</p>

            <div className="pt-4 border-t border-slate-800/80 space-y-2 text-left text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-indigo-400" />
                  Account Role
                </span>
                <span className="capitalize font-bold text-white px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                  {user?.role}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  Member Since
                </span>
                <span className="font-medium text-slate-300">{memberSince}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="md:col-span-8">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800">
            {successMsg && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-300 text-xs animate-in fade-in">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-rose-300 text-xs animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-white mb-4">Personal Details</h3>
                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Password Section */}
              <div className="pt-6 border-t border-slate-800">
                <h3 className="text-sm font-bold text-white mb-1">Change Password</h3>
                <p className="text-xs text-slate-400 mb-4">
                  Leave blank if you do not want to update your current password.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
                >
                  {saving ? 'Saving changes...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
