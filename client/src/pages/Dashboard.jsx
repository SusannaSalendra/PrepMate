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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#10201D] via-[#162B27] to-[#0D1614] border border-[#20B2AA]/25 mb-10 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#20B2AA]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#20B2AA]/10 border border-[#20B2AA]/20 text-[#3FD1C7] text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personal Performance Hub</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-display font-bold text-[#F9FBFB] tracking-tight">
              Welcome back, {user?.name || 'Candidate'}!
            </h1>
            <p className="text-sm text-[#8EA3A0] mt-1 max-w-xl">
              Track your preparation momentum, identify domain focus areas, and master technical interviews step-by-step.
            </p>
          </div>

          <Link
            to="/mock-interview"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#20B2AA] hover:bg-[#3FD1C7] text-[#0D1614] text-xs font-bold shadow-xl shadow-[#20B2AA]/25 hover:-translate-y-0.5 active:scale-95 transition-all self-start sm:self-center shrink-0"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Launch Mock Simulation</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
        {/* Stat 1 */}
        <div className="glass-card rounded-3xl p-6 border border-[#20B2AA]/15 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8EA3A0]">
              Questions Solved
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#20B2AA]/10 border border-[#20B2AA]/20 flex items-center justify-center text-[#3FD1C7]">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-display font-bold text-[#F9FBFB]">
            {stats.totalQuestionsAttempted}
          </p>
          <p className="text-xs text-[#3FD1C7] mt-1 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3 h-3" />
            <span>Across all sessions</span>
          </p>
        </div>

        {/* Stat 2 */}
        <div className="glass-card rounded-3xl p-6 border border-[#20B2AA]/15 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8EA3A0]">
              Mock Sessions
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#20B2AA]/10 border border-[#20B2AA]/20 flex items-center justify-center text-[#3FD1C7]">
              <PlayCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-display font-bold text-[#3FD1C7]">
            {stats.completedSessionsCount}
          </p>
          <p className="text-xs text-[#8EA3A0] mt-1">Completed simulations</p>
        </div>

        {/* Stat 3 */}
        <div className="glass-card rounded-3xl p-6 border border-[#20B2AA]/15 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8EA3A0]">
              Avg Confidence
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#20B2AA]/10 border border-[#20B2AA]/20 flex items-center justify-center text-[#3FD1C7]">
              <Star className="w-4 h-4 fill-[#20B2AA]" />
            </div>
          </div>
          <p className="text-3xl font-display font-bold text-[#3FD1C7]">
            {stats.averageConfidence} <span className="text-sm font-normal text-[#8EA3A0]">/ 5</span>
          </p>
          <p className="text-xs text-[#8EA3A0] mt-1">Self-rated readiness</p>
        </div>

        {/* Stat 4 */}
        <div className="glass-card rounded-3xl p-6 border border-[#20B2AA]/15 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8EA3A0]">
              Saved Problems
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#20B2AA]/10 border border-[#20B2AA]/20 flex items-center justify-center text-[#3FD1C7]">
              <Bookmark className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-display font-display font-bold text-[#F9FBFB]">
            {stats.bookmarksCount}
          </p>
          <Link
            to="/bookmarks"
            className="text-xs text-[#3FD1C7] hover:text-[#F9FBFB] mt-1 flex items-center gap-1 font-medium transition-colors"
          >
            <span>View bookmarks</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Analytics Chart & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
        {/* Left Chart */}
        <div className="lg:col-span-8 glass-card rounded-3xl p-6 sm:p-8 border border-[#20B2AA]/15">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-display font-bold text-[#F9FBFB] tracking-tight flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#20B2AA]" />
                <span>Category Progress Breakdown</span>
              </h2>
              <p className="text-xs text-[#8EA3A0] mt-0.5">
                Questions attempted by interview domain
              </p>
            </div>
          </div>

          <ProgressChart categoryData={stats.categoryProgress} />
        </div>

        {/* Right Categories List */}
        <div className="lg:col-span-4 glass-card rounded-3xl p-6 border border-[#20B2AA]/15 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-display font-bold text-[#F9FBFB] mb-4">Domain Readiness</h3>
            <div className="space-y-3">
              {stats.categoryProgress && stats.categoryProgress.length > 0 ? (
                stats.categoryProgress.map((cat, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-[#0D1614] border border-[#20B2AA]/15 space-y-1.5 hover:border-[#20B2AA]/30 transition-all"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#F1F3F2] truncate pr-2">
                        {cat.name}
                      </span>
                      <span className="font-bold text-[#3FD1C7] shrink-0">
                        {cat.attempted} answered
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#8EA3A0]">
                      <span>Avg Confidence:</span>
                      <span className="text-[#3FD1C7] font-semibold">{cat.avgConfidence} / 5</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-xs text-[#8EA3A0]">
                  <p>No category activity recorded yet.</p>
                  <p className="text-[#8EA3A0]/70 mt-1">Start a mock interview to populate your readiness chart.</p>
                </div>
              )}
            </div>
          </div>

          <Link
            to="/questions"
            className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#10201D] hover:bg-[#162B27] border border-[#20B2AA]/20 text-[#F1F3F2] text-xs font-semibold transition-all hover:border-[#20B2AA]/40"
          >
            <span>Explore All Questions</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#20B2AA]" />
          </Link>
        </div>
      </div>

      {/* Recent Sessions */}
      {recentSessions.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-display font-bold text-[#F9FBFB]">Recent Mock Interviews</h2>
            <Link
              to="/sessions"
              className="text-xs font-semibold text-[#3FD1C7] hover:text-[#F9FBFB] flex items-center gap-1 transition-colors"
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
                  className="glass-card rounded-2xl p-5 border border-[#20B2AA]/15 glass-card-hover block"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#3FD1C7] truncate">
                      {session.category?.name || 'General Domain'}
                    </span>
                    <span className="text-[11px] text-[#8EA3A0]">
                      {new Date(session.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm font-display font-bold text-[#F9FBFB] mb-2">
                    {answered} / {session.questions.length} Questions Answered
                  </p>
                  <div className="flex items-center gap-3 text-xs text-[#8EA3A0]">
                    <span className="flex items-center gap-1 text-[#3FD1C7]">
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
