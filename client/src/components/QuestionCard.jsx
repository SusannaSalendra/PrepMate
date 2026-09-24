import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Building2, Tag, ChevronDown, ChevronUp, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const QuestionCard = ({
  question,
  onToggleBookmark,
  showAnswerToggle = true,
  isBookmarked = false,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const { isAuthenticated } = useAuth();

  const difficultyColors = {
    Easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    Hard: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  };

  const difficultyDot = {
    Easy: 'bg-emerald-400',
    Medium: 'bg-amber-400',
    Hard: 'bg-rose-400',
  };

  const handleBookmarkClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleBookmark) {
      onToggleBookmark(question._id);
    }
  };

  const handleCopy = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/questions/${question._id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card glass-card-hover rounded-2xl p-6 transition-all border border-slate-800 relative group">
      {/* Header Info */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Difficulty Badge */}
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
              difficultyColors[question.difficulty] || difficultyColors.Medium
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                difficultyDot[question.difficulty] || difficultyDot.Medium
              }`}
            />
            {question.difficulty}
          </span>

          {/* Category Badge */}
          {question.category && (
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
              {question.category.name || question.category}
            </span>
          )}

          {/* Company Badge */}
          {question.company && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              <Building2 className="w-3 h-3 text-indigo-400" />
              {question.company}
            </span>
          )}
        </div>

        {/* Bookmark Button */}
        {isAuthenticated && (
          <button
            onClick={handleBookmarkClick}
            title={isBookmarked ? 'Remove Bookmark' : 'Save Question'}
            className={`p-2 rounded-xl border transition-all ${
              isBookmarked
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
          </button>
        )}
      </div>

      {/* Question Title */}
      <Link
        to={`/questions/${question._id}`}
        className="block group-hover:text-indigo-300 text-lg font-bold text-white transition-colors leading-snug mb-3"
      >
        {question.title}
      </Link>

      {/* Tags */}
      {question.tags && question.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {question.tags.map((tag, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-800/80 text-slate-400 hover:text-slate-200"
            >
              <Tag className="w-2.5 h-2.5" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Expandable Explanation / Answer Snippet */}
      {showAnswerToggle && (
        <div className="border-t border-slate-800/80 pt-4 mt-2">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              {expanded ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5" />
                  <span>Hide Solution & Explanation</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5" />
                  <span>View Solution & Explanation</span>
                </>
              )}
            </button>

            <Link
              to={`/questions/${question._id}`}
              className="flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              <span>Full Details</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {expanded && (
            <div className="mt-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 text-sm prose-custom animate-in fade-in duration-200">
              <div
                dangerouslySetInnerHTML={{
                  __html: question.description
                    .replace(/### (.*)/g, '<h3 class="text-sm font-bold text-indigo-400 mt-2 mb-1">$1</h3>')
                    .replace(/`([^`]+)`/g, '<code class="bg-slate-800 px-1 py-0.5 rounded text-sky-300 text-xs font-mono">$1</code>')
                    .replace(/\n\n/g, '<br/><br/>'),
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
