import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, AlertCircle } from 'lucide-react';
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
        <div className="inline-flex p-3 rounded-2xl bg-[#20B2AA]/10 border border-[#20B2AA]/30 text-[#20B2AA] mb-4 shadow-lg shadow-[#20B2AA]/10">
          <PlayCircle className="w-7 h-7" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-medium text-white tracking-tight">
          Mock Interview Setup
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-400 max-w-md mx-auto mt-2">
          Configure your simulation settings. You will be served randomized questions to answer within a live timed environment.
        </p>
      </div>

      {/* Setup Form Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-[#20B2AA]/15 shadow-2xl relative">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-charcoal-850 border border-red-500/30 flex items-start gap-3 text-red-300 text-xs animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleStartSession} className="space-y-8">
          {/* Category Choice */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-300 mb-3 font-mono">
              1. Choose Topic Domain
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  type="button"
                  onClick={() => setSelectedCategory(cat._id)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    selectedCategory === cat._id
                      ? 'bg-charcoal-850 border-[#20B2AA] ring-1 ring-[#20B2AA]/40 text-white'
                      : 'bg-charcoal-900 border-[#20B2AA]/15 text-charcoal-400 hover:text-white hover:border-[#20B2AA]/30'
                  }`}
                >
                  <p className="text-sm font-display font-semibold text-white mb-1">{cat.name}</p>
                  <p className="text-xs text-charcoal-400 line-clamp-2">
                    {cat.description || 'Comprehensive questions in this domain'}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Tier */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-300 mb-3 font-mono">
              2. Difficulty Level
            </label>
            <div className="grid grid-cols-4 gap-2.5">
              {['Any', 'Easy', 'Medium', 'Hard'].map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    selectedDifficulty === diff
                      ? 'bg-[#20B2AA] text-[#0D1614] font-bold shadow-md shadow-[#20B2AA]/20 border-[#20B2AA]'
                      : 'bg-charcoal-900 border-[#20B2AA]/15 text-charcoal-400 hover:text-white hover:border-[#20B2AA]/30'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Question Count */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-300 mb-3 font-mono">
              3. Questions Per Session
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[3, 5, 10].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setQuestionCount(count)}
                  className={`py-2.5 px-4 rounded-xl border text-xs font-semibold transition-all ${
                    questionCount === count
                      ? 'bg-[#20B2AA]/20 text-[#3FD1C7] border-[#20B2AA] font-bold'
                      : 'bg-charcoal-900 border-[#20B2AA]/15 text-charcoal-400 hover:text-white'
                  }`}
                >
                  {count} Questions
                </button>
              ))}
            </div>
          </div>

          {/* Launch CTA */}
          <div className="pt-4 border-t border-[#20B2AA]/15">
            <button
              type="submit"
              disabled={starting || !selectedCategory}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#20B2AA] to-[#3FD1C7] text-[#0D1614] font-bold text-xs sm:text-sm shadow-xl shadow-[#20B2AA]/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.01]"
            >
              {starting ? (
                <span>Generating Session...</span>
              ) : (
                <>
                  <PlayCircle className="w-4 h-4" />
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
