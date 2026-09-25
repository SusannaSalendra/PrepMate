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
  Bot,
  Mic,
} from 'lucide-react';
import api from '../api/axios';

export const Home = () => {
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({
    totalQuestions: 30,
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
    <div className="relative overflow-hidden bg-[#0D1614]">
      {/* Subtle Sea-Green Ambient Lighting */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[650px] h-[380px] bg-gradient-to-tr from-[#20B2AA]/18 via-[#0E6E68]/12 to-transparent blur-[140px] rounded-full pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 text-center">
        {/* Release / Feature Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#20B2AA]/10 border border-[#20B2AA]/30 text-[#3FD1C7] text-xs font-semibold mb-8 animate-in fade-in slide-in-from-top-4 duration-500 shadow-sm">
          <Bot className="w-3.5 h-3.5 text-[#20B2AA]" />
          <span>Intelligent AI Voice Mentor & Virtual Interviewer</span>
        </div>

        {/* Main Editorial Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-medium tracking-tight text-charcoal-50 max-w-4xl mx-auto leading-[1.12] mb-6">
          Master Your Next Tech Interview with{' '}
          <span className="bg-gradient-to-r from-[#20B2AA] via-[#3FD1C7] to-[#17847E] bg-clip-text text-transparent italic font-normal">
            PrepMate
          </span>
        </h1>

        <p className="text-base sm:text-lg text-charcoal-200 max-w-2xl mx-auto mb-12 leading-relaxed font-sans">
          Build authentic confidence through interactive voice simulations, curated questions from leading tech giants, progressive AI hints, and personalized skill analytics.
        </p>

        {/* CTA Button Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto mb-20">
          <Link
            to="/ai-mentor"
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#20B2AA] to-[#3FD1C7] hover:from-[#3FD1C7] hover:to-[#20B2AA] text-[#0D1614] font-bold text-xs sm:text-sm shadow-xl shadow-[#20B2AA]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Mic className="w-4 h-4 text-[#0D1614]" />
            <span>Launch AI Voice Mentor</span>
          </Link>

          <Link
            to="/mock-interview"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-charcoal-850 hover:bg-charcoal-800 text-charcoal-50 border border-[#20B2AA]/30 font-semibold text-xs sm:text-sm shadow-md transition-all hover:border-[#20B2AA]/50"
          >
            <PlayCircle className="w-4 h-4 text-[#20B2AA]" />
            <span>Mock Interview</span>
          </Link>

          <Link
            to="/questions"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-charcoal-900/80 hover:bg-charcoal-850 text-charcoal-400 hover:text-white border border-[#20B2AA]/15 font-medium text-xs sm:text-sm transition-all"
          >
            <BookOpen className="w-4 h-4 text-[#20B2AA]" />
            <span>Question Bank</span>
          </Link>
        </div>

        {/* Monochromatic Sea-Green Stat Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto p-6 rounded-2xl glass-panel border border-[#20B2AA]/20 shadow-2xl">
          <div className="p-2 text-center">
            <p className="text-2xl sm:text-3xl font-display font-bold text-[#20B2AA]">500+</p>
            <p className="text-xs font-medium text-charcoal-400 mt-1">Curated Questions</p>
          </div>
          <div className="p-2 text-center border-l border-[#20B2AA]/15">
            <p className="text-2xl sm:text-3xl font-display font-bold text-[#3FD1C7]">5+</p>
            <p className="text-xs font-medium text-charcoal-400 mt-1">Core Tech Domains</p>
          </div>
          <div className="p-2 text-center border-l border-[#20B2AA]/15">
            <p className="text-2xl sm:text-3xl font-display font-bold text-[#20B2AA]">100%</p>
            <p className="text-xs font-medium text-charcoal-400 mt-1">Interactive Simulations</p>
          </div>
          <div className="p-2 text-center border-l border-[#20B2AA]/15">
            <p className="text-2xl sm:text-3xl font-display font-bold text-[#3FD1C7]">Instant</p>
            <p className="text-xs font-medium text-charcoal-400 mt-1">Voice Feedback</p>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-[#20B2AA]/15">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold tracking-widest text-[#20B2AA] uppercase mb-2 font-mono">
            Platform Capabilities
          </h2>
          <p className="text-3xl font-display font-medium text-charcoal-50">
            A comprehensive suite designed for top-tier interview readiness
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 0 - AI Voice Mentor */}
          <div className="glass-card rounded-2xl p-7 border border-[#20B2AA]/25 glass-card-hover space-y-4 relative overflow-hidden">
            <div className="w-11 h-11 rounded-xl bg-[#20B2AA]/15 border border-[#20B2AA]/30 flex items-center justify-center text-[#20B2AA]">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-display font-semibold text-white flex items-center gap-2">
              <span>AI Voice Mentor</span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#20B2AA]/20 text-[#3FD1C7] border border-[#20B2AA]/30 font-sans">
                VOICE
              </span>
            </h3>
            <p className="text-xs text-charcoal-400 leading-relaxed font-sans">
              Engage in two-way spoken dialogues with AI interviewer personas. Practice verbalizing algorithmic complexity and receiving instant voice feedback.
            </p>
          </div>

          {/* Feature 1 */}
          <div className="glass-card rounded-2xl p-7 border border-[#20B2AA]/15 glass-card-hover space-y-4">
            <div className="w-11 h-11 rounded-xl bg-[#20B2AA]/10 border border-[#20B2AA]/20 flex items-center justify-center text-[#20B2AA]">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-display font-semibold text-white">Realistic Simulations</h3>
            <p className="text-xs text-charcoal-400 leading-relaxed font-sans">
              Timed mock interview workflows simulating real pressure. Choose domain topics, difficulty levels, and practice voice dictation.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glass-card rounded-2xl p-7 border border-[#20B2AA]/15 glass-card-hover space-y-4">
            <div className="w-11 h-11 rounded-xl bg-[#20B2AA]/10 border border-[#20B2AA]/20 flex items-center justify-center text-[#20B2AA]">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-display font-semibold text-white">Confidence Analytics</h3>
            <p className="text-xs text-charcoal-400 leading-relaxed font-sans">
              Rate your confidence on every question. Generate interactive visual charts to track your mastery across distributed systems and algorithms.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass-card rounded-2xl p-7 border border-[#20B2AA]/15 glass-card-hover space-y-4">
            <div className="w-11 h-11 rounded-xl bg-[#20B2AA]/10 border border-[#20B2AA]/20 flex items-center justify-center text-[#20B2AA]">
              <Bookmark className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-display font-semibold text-white">Curated Notebook</h3>
            <p className="text-xs text-charcoal-400 leading-relaxed font-sans">
              Bookmark critical problems, study full-text solution breakdowns, and review historical transcript notes prior to on-site rounds.
            </p>
          </div>
        </div>
      </section>

      {/* Category Showcase Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-[#20B2AA]/15">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <h2 className="text-xs font-bold tracking-widest text-[#20B2AA] uppercase mb-2 font-mono">
              Curated Curriculum
            </h2>
            <p className="text-3xl font-display font-medium text-charcoal-50">
              Explore Interview Domains
            </p>
          </div>
          <Link
            to="/questions"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#20B2AA] hover:text-[#3FD1C7] transition-colors"
          >
            <span>View all questions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/questions?category=${encodeURIComponent(cat.name)}`}
                className="glass-card rounded-2xl p-6 border border-[#20B2AA]/15 glass-card-hover group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-display font-semibold text-white group-hover:text-[#3FD1C7] transition-colors">
                      {cat.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#20B2AA]/15 text-[#3FD1C7] border border-[#20B2AA]/30">
                      {cat.questionCount || 0} questions
                    </span>
                  </div>
                  <p className="text-xs text-charcoal-400 line-clamp-2 leading-relaxed mb-4 font-sans">
                    {cat.description || 'Comprehensive questions covering practical scenarios, principles, and edge cases.'}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#20B2AA] group-hover:translate-x-1 transition-transform">
                  <span>Explore domain</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-3 text-center p-12 glass-card rounded-2xl border border-[#20B2AA]/15">
              <BookOpen className="w-10 h-10 text-[#20B2AA] mx-auto mb-3" />
              <p className="text-charcoal-100 font-semibold text-sm">Explore our curated question bank</p>
              <p className="text-xs text-charcoal-400 mt-1">Hundreds of curated technical problems ready to practice.</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-14 bg-gradient-to-br from-charcoal-850 via-charcoal-900 to-[#081A18] border border-[#20B2AA]/25 text-center shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-display font-medium text-white tracking-tight">
              Ready to accelerate your technical interview readiness?
            </h2>
            <p className="text-charcoal-200 text-xs sm:text-sm leading-relaxed">
              Start practicing with our interactive mock interview sessions and AI voice mentor today. Join engineers preparing for top tech roles.
            </p>
            <div className="pt-2">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#20B2AA] to-[#3FD1C7] text-[#0D1614] font-bold text-xs sm:text-sm shadow-xl shadow-[#20B2AA]/25 transition-all hover:scale-105"
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
