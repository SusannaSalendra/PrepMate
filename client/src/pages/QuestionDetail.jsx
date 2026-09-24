import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Bookmark,
  Building2,
  Tag,
  Share2,
  Check,
  Calendar,
  User,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import api from '../api/axios';
import { Loader } from '../components/Loader';
import { useAuth } from '../context/AuthContext';

export const QuestionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchQuestion = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/questions/${id}`);
        if (res.data?.success) {
          setQuestion(res.data.data);
        }
      } catch (err) {
        setError('Failed to load question details.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuestion();
  }, [id]);

  const handleToggleBookmark = async () => {
    if (!isAuthenticated || !question) return;

    try {
      const res = await api.post(`/bookmarks/${question._id}`);
      if (res.data?.success) {
        setQuestion((prev) => ({
          ...prev,
          isBookmarked: res.data.isBookmarked,
        }));
      }
    } catch (err) {
      console.error('Failed to toggle bookmark', err);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return <Loader fullScreen text="Loading question..." />;
  }

  if (error || !question) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Question Not Found</h2>
        <p className="text-sm text-slate-400 mb-6">{error || 'The requested question does not exist.'}</p>
        <Link
          to="/questions"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Question Bank</span>
        </Link>
      </div>
    );
  }

  const difficultyColors = {
    Easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    Hard: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      {/* Main Content Card */}
      <article className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl relative">
        {/* Meta badges & Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800/80 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                difficultyColors[question.difficulty] || difficultyColors.Medium
              }`}
            >
              {question.difficulty}
            </span>

            {question.category && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                {question.category.name}
              </span>
            )}

            {question.company && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                {question.company}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              title="Share Link"
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>

            {isAuthenticated && (
              <button
                onClick={handleToggleBookmark}
                title={question.isBookmarked ? 'Remove Bookmark' : 'Save Question'}
                className={`p-2.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all ${
                  question.isBookmarked
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 hover:bg-amber-500/30'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-700'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${question.isBookmarked ? 'fill-amber-400' : ''}`} />
                <span>{question.isBookmarked ? 'Saved' : 'Bookmark'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug mb-4">
          {question.title}
        </h1>

        {/* Tags */}
        {question.tags && question.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {question.tags.map((t, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-900 border border-slate-800 text-slate-300"
              >
                <Tag className="w-3 h-3 text-indigo-400" />
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Solution & Explanation Content */}
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-950/70 border border-slate-800/80">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>Comprehensive Solution & Notes</span>
          </h2>

          <div
            className="prose-custom text-slate-300 text-sm leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: question.description
                .replace(/### (.*)/g, '<h3 class="text-base font-bold text-indigo-300 mt-5 mb-2">$1</h3>')
                .replace(/`([^`]+)`/g, '<code class="bg-slate-800 px-1.5 py-0.5 rounded text-sky-300 text-xs font-mono">$1</code>')
                .replace(/\n\n/g, '<br/><br/>'),
            }}
          />
        </div>
      </article>
    </div>
  );
};

export default QuestionDetail;
