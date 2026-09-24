import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, Clock, Award, Layers, Sparkles, AlertCircle } from 'lucide-react';
import api from '../api/axios';
import { Loader } from '../components/Loader';

export const MockInterviewSetup = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Any');
  const [questionCount, setQuestionCount] = useState(5);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data?.success && res.data.data.length > 0) {
          setCategories(res.data.data);
          setSelectedCategory(res.data.data[0]._id);
        }
      } catch (err) {
        setError('Failed to fetch interview categories.');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleStartSession = async (e) => {
    e.preventDefault();
    if (!selectedCategory) {
      setError('Please select an interview category');
      return;
    }

    setError('');
    setStarting(true);

    try {
      const res = await api.post('/mock-sessions/start', {
        category: selectedCategory,
        difficulty: selectedDifficulty,
        count: questionCount,
      });

      if (res.data?.success && res.data.data?._id) {
        navigate(`/mock-interview/${res.data.data._id}`);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.customMessage ||
          'Failed to initialize mock interview session'
      );
    } finally {
      setStarting(false);
    }
  };

  if (loading) {
    return <Loader fullScreen text="Preparing mock interview suite..." />;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-4 shadow-lg shadow-emerald-500/10">
          <PlayCircle className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Mock Interview Setup
        </h1>
        <p className="text-sm text-slate-400 max-w-md mx-auto mt-2">
          Configure your simulation settings. You will be served randomized questions to answer within a live timed environment.
        </p>
      </div>

      {/* Setup Form Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl relative">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-xs animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleStartSession} className="space-y-8">
          {/* Category Choice */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
              1. Choose Topic Category
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  type="button"
                  onClick={() => setSelectedCategory(cat._id)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    selectedCategory === cat._id
                      ? 'bg-indigo-600/20 border-indigo-500 ring-1 ring-indigo-500/40 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <p className="text-sm font-bold text-white mb-1">{cat.name}</p>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {cat.description || 'Comprehensive questions in this domain'}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Tier */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
              2. Difficulty Level
            </label>
            <div className="grid grid-cols-4 gap-2.5">
              {['Any', 'Easy', 'Medium', 'Hard'].map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`py-3 rounded-xl border text-xs font-bold transition-all ${
                    selectedDifficulty === diff
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 border-indigo-500'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Question Count */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
              3. Questions Per Session
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[3, 5, 10].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setQuestionCount(count)}
                  className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all ${
                    questionCount === count
                      ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500 ring-1 ring-indigo-500/30'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {count} Questions
                </button>
              ))}
            </div>
          </div>

          {/* Launch CTA */}
          <div className="pt-4 border-t border-slate-800">
            <button
              type="submit"
              disabled={starting || !selectedCategory}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {starting ? (
                <span>Generating Session...</span>
              ) : (
                <>
                  <PlayCircle className="w-5 h-5" />
                  <span>Begin Mock Interview</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MockInterviewSetup;
