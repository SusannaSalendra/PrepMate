import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  Bookmark,
  PlayCircle,
  Award,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Star,
  CheckCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ProgressChart from '../components/ProgressChart';
import { Loader } from '../components/Loader';

export const Dashboard = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [recentSessions, setRecentSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const [profileRes, historyRes] = await Promise.all([
          api.get('/users/profile'),
          api.get('/mock-sessions/history'),
        ]);

        if (profileRes.data?.success) {
          setProfileData(profileRes.data.data);
        }
        if (historyRes.data?.success) {
          setRecentSessions(historyRes.data.data.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return <Loader fullScreen text="Loading progress dashboard..." />;
  }

  const stats = profileData?.stats || {
    bookmarksCount: 0,
    completedSessionsCount: 0,
    totalQuestionsAttempted: 0,
    averageConfidence: 0,
    categoryProgress: [],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 border border-indigo-500/20 mb-10 overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personal Interview Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.name || 'Developer'}! 👋
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Track your preparation momentum, review category strengths, and keep practicing until you nail the offer.
            </p>
          </div>

          <Link
            to="/mock-interview"
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold shadow-xl shadow-indigo-600/30 active:scale-95 transition-all self-start sm:self-center shrink-0"
          >
            <PlayCircle className="w-4 h-4 text-emerald-300" />
            <span>Start Practice Session</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
        {/* Stat 1 */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Questions Attempted
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white">
            {stats.totalQuestionsAttempted}
          </p>
          <p className="text-xs text-indigo-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Across all sessions</span>
          </p>
        </div>

        {/* Stat 2 */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Mock Sessions
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <PlayCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-emerald-400">
            {stats.completedSessionsCount}
          </p>
          <p className="text-xs text-slate-400 mt-1">Completed simulations</p>
        </div>

        {/* Stat 3 */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Avg Confidence
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-amber-300">
            {stats.averageConfidence} <span className="text-sm font-normal text-slate-500">/ 5</span>
          </p>
          <p className="text-xs text-slate-400 mt-1">Self-rated performance</p>
        </div>

        {/* Stat 4 */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Saved Bookmarks
            </span>
            <div className="w-8 h-8 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
              <Bookmark className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white">
            {stats.bookmarksCount}
          </p>
          <Link
            to="/bookmarks"
            className="text-xs text-indigo-400 hover:text-indigo-300 mt-1 flex items-center gap-1"
          >
            <span>View bookmarks</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Analytics Chart & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
        {/* Left Chart */}
        <div className="lg:col-span-8 glass-card rounded-3xl p-6 sm:p-8 border border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-400" />
                <span>Category Progress Breakdown</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Questions attempted by domain area
              </p>
            </div>
          </div>

          <ProgressChart categoryData={stats.categoryProgress} />
        </div>

        {/* Right Categories List */}
        <div className="lg:col-span-4 glass-card rounded-3xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-4">Domain Readiness</h3>
            <div className="space-y-3">
              {stats.categoryProgress && stats.categoryProgress.length > 0 ? (
                stats.categoryProgress.map((cat, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200 truncate pr-2">
                        {cat.name}
                      </span>
                      <span className="font-bold text-indigo-400 shrink-0">
                        {cat.attempted} answered
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Avg Confidence:</span>
                      <span className="text-amber-400 font-semibold">{cat.avgConfidence} / 5</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-xs text-slate-400">
                  <p>No category activity recorded yet.</p>
                  <p className="text-slate-500 mt-1">Start a mock interview to populate your readiness chart.</p>
                </div>
              )}
            </div>
          </div>

          <Link
            to="/questions"
            className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold transition-all"
          >
            <span>Explore All Questions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Recent Sessions */}
      {recentSessions.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Recent Mock Interviews</h2>
            <Link
              to="/sessions"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>View full history</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentSessions.map((session) => {
              const answered = session.questions.filter((q) => q.status === 'Answered').length;
              return (
                <Link
                  key={session._id}
                  to={`/sessions/${session._id}`}
                  className="glass-card rounded-2xl p-5 border border-slate-800 glass-card-hover block"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-indigo-400 truncate">
                      {session.category?.name || 'General Category'}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {new Date(session.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-white mb-2">
                    {answered} / {session.questions.length} Questions Answered
                  </p>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1 text-cyan-400">
                      <Clock className="w-3 h-3" />
                      {Math.floor((session.timeTakenSeconds || 0) / 60)}m {(session.timeTakenSeconds || 0) % 60}s
                    </span>
                    <span>Difficulty: {session.difficulty}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
