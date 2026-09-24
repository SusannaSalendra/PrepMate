import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BrainCircuit,
  Sparkles,
  ArrowRight,
  PlayCircle,
  BookOpen,
  Bookmark,
  BarChart3,
  CheckCircle2,
  Building2,
  Terminal,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import api from '../api/axios';

export const Home = () => {
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({
    totalQuestions: 15,
    categoriesCount: 5,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data?.success) {
          setCategories(res.data.data.slice(0, 6));
          setStats((prev) => ({
            ...prev,
            categoriesCount: res.data.data.length,
          }));
        }
      } catch (err) {
        // Fallback gracefully
      }
    };
    fetchData();
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-pink-600/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 text-center">
        {/* Release / Feature Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>The Next-Generation Tech Interview Simulator</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1] mb-6">
          Master Your Next Tech Interview with{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            PrepMate
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          Level up your confidence with curated questions from top tech companies, timed mock interview sessions, self-evaluation scoring, and personalized skill analytics.
        </p>

        {/* CTA Button Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16">
          <Link
            to="/mock-interview"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white font-bold text-sm shadow-xl shadow-indigo-500/30 hover:scale-[1.02] hover:shadow-indigo-500/40 active:scale-[0.98] transition-all"
          >
            <PlayCircle className="w-5 h-5 text-emerald-300" />
            <span>Start Mock Interview</span>
          </Link>

          <Link
            to="/questions"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition-all"
          >
            <BookOpen className="w-4 h-4 text-slate-400" />
            <span>Browse Question Bank</span>
          </Link>
        </div>

        {/* Stat Highlights Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto p-6 rounded-3xl glass-panel border border-slate-800">
          <div className="p-2 text-center">
            <p className="text-2xl sm:text-3xl font-extrabold text-white">500+</p>
            <p className="text-xs font-medium text-slate-400 mt-1">Curated Questions</p>
          </div>
          <div className="p-2 text-center border-l border-slate-800">
            <p className="text-2xl sm:text-3xl font-extrabold text-indigo-400">5+</p>
            <p className="text-xs font-medium text-slate-400 mt-1">Core Domains</p>
          </div>
          <div className="p-2 text-center border-l border-slate-800">
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">100%</p>
            <p className="text-xs font-medium text-slate-400 mt-1">Interactive Simulations</p>
          </div>
          <div className="p-2 text-center border-l border-slate-800">
            <p className="text-2xl sm:text-3xl font-extrabold text-purple-400">Instant</p>
            <p className="text-xs font-medium text-slate-400 mt-1">Progress Tracking</p>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold tracking-widest text-indigo-400 uppercase mb-2">
            Why PrepMate?
          </h2>
          <p className="text-3xl font-extrabold text-white">
            Everything you need to crack FAANG & startup interviews
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="glass-card rounded-3xl p-8 border border-slate-800 glass-card-hover space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Dynamic Mock Interviews</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Experience authentic interview pressure. Customize your session by choosing specific categories, difficulty tiers, and timed challenges.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glass-card rounded-3xl p-8 border border-slate-800 glass-card-hover space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Smart Confidence Scoring</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Rate your confidence on every answer. Generate visual analytics to pinpoint your strengths and identify high-priority study areas.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass-card rounded-3xl p-8 border border-slate-800 glass-card-hover space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Bookmark className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Personal Bookmarks & History</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Save challenging problems to your personal notebook. Review previous session transcripts and re-attempt tricky questions anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Category Showcase Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <h2 className="text-xs font-bold tracking-widest text-indigo-400 uppercase mb-2">
              Curated Syllabus
            </h2>
            <p className="text-3xl font-extrabold text-white">
              Explore Top Categories
            </p>
          </div>
          <Link
            to="/questions"
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <span>View all questions</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/questions?category=${encodeURIComponent(cat.name)}`}
                className="glass-card rounded-2xl p-6 border border-slate-800 glass-card-hover group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {cat.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {cat.questionCount || 0} questions
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {cat.description || 'Comprehensive questions covering practical scenarios, principles, and edge cases.'}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 group-hover:translate-x-1 transition-transform">
                  <span>Practice category</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-3 text-center p-12 glass-card rounded-2xl border border-slate-800">
              <BookOpen className="w-10 h-10 text-indigo-400 mx-auto mb-3" />
              <p className="text-slate-300 font-semibold">Explore our question bank</p>
              <p className="text-xs text-slate-500 mt-1">Hundreds of curated problems waiting for you.</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-14 bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-900 border border-indigo-500/30 text-center shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to land your dream offer?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Start practicing with our interactive mock interview sessions today. Join engineers preparing for top tech roles.
            </p>
            <div className="pt-2">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/40 transition-all hover:scale-105"
              >
                <span>Create Free Account</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
