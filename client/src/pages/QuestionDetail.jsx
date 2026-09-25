import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Bookmark,
  Building2,
  Tag,
  Share2,
  Check,
  Sparkles,
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
    return <Loader fullScreen text="Loading question specifications..." />;
  }

  if (error || !question) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-display font-bold text-white mb-2">Question Not Found</h2>
        <p className="text-xs text-charcoal-400 mb-6">{error || 'The requested problem does not exist.'}</p>
        <Link
          to="/questions"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#20B2AA] text-[#0D1614] text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Question Bank</span>
        </Link>
      </div>
    );
  }

  const difficultyStyles = {
    Easy: 'bg-[#20B2AA]/10 text-[#3FD1C7] border-[#20B2AA]/25',
    Medium: 'bg-[#20B2AA]/20 text-[#20B2AA] border-[#20B2AA]/35',
    Hard: 'bg-[#0E6E68]/40 text-white border-[#20B2AA]/50 font-semibold',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-charcoal-400 hover:text-[#3FD1C7] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      {/* Main Content Card */}
      <article className="glass-card rounded-2xl p-6 sm:p-10 border border-[#20B2AA]/15 shadow-2xl relative">
        {/* Meta badges & Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#20B2AA]/15 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-3 py-0.5 rounded-full text-xs font-medium border ${
                difficultyStyles[question.difficulty] || difficultyStyles.Medium
              }`}
            >
              {question.difficulty}
            </span>

            {question.category && (
              <span className="px-3 py-0.5 rounded-full text-xs font-medium bg-charcoal-850 text-charcoal-200 border border-[#20B2AA]/15">
                {question.category.name}
              </span>
            )}

            {question.company && (
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-medium bg-[#20B2AA]/10 text-[#3FD1C7] border border-[#20B2AA]/20">
                <Building2 className="w-3.5 h-3.5 text-[#20B2AA]" />
                {question.company}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              title="Share Link"
              className="p-2 rounded-xl bg-charcoal-850 hover:bg-charcoal-800 text-charcoal-200 border border-[#20B2AA]/15 text-xs font-medium flex items-center gap-1.5 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#3FD1C7]" /> : <Share2 className="w-3.5 h-3.5 text-[#20B2AA]" />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>

            {isAuthenticated && (
              <button
                onClick={handleToggleBookmark}
                title={question.isBookmarked ? 'Remove Bookmark' : 'Save Question'}
                className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all ${
                  question.isBookmarked
                    ? 'bg-[#20B2AA]/20 text-[#3FD1C7] border-[#20B2AA]/40 hover:bg-[#20B2AA]/30'
                    : 'bg-charcoal-850 text-charcoal-200 border-[#20B2AA]/15 hover:text-white hover:bg-charcoal-800'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${question.isBookmarked ? 'fill-[#20B2AA] text-[#20B2AA]' : 'text-[#20B2AA]'}`} />
                <span>{question.isBookmarked ? 'Saved' : 'Bookmark'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-display font-medium text-white tracking-tight leading-snug mb-4">
          {question.title}
        </h1>

        {/* Tags */}
        {question.tags && question.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {question.tags.map((t, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-charcoal-850 border border-[#20B2AA]/15 text-charcoal-200"
              >
                <Tag className="w-3 h-3 text-[#20B2AA]" />
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Solution & Explanation Content */}
        <div className="p-6 sm:p-8 rounded-2xl bg-charcoal-900 border border-[#20B2AA]/20">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#3FD1C7] mb-4 flex items-center gap-2 font-mono">
            <Sparkles className="w-4 h-4 text-[#20B2AA]" />
            <span>Technical Solution & Architectural Notes</span>
          </h2>

          <div
            className="prose-custom text-charcoal-100 text-xs sm:text-sm leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: question.description
                .replace(/### (.*)/g, '<h3 class="text-sm font-display font-semibold text-[#3FD1C7] mt-5 mb-2">$1</h3>')
                .replace(/`([^`]+)`/g, '<code class="bg-charcoal-850 border border-[#20B2AA]/20 px-1.5 py-0.5 rounded text-[#3FD1C7] text-xs font-mono">$1</code>')
                .replace(/\n\n/g, '<br/><br/>'),
            }}
          />
        </div>
      </article>
    </div>
  );
};

export default QuestionDetail;
