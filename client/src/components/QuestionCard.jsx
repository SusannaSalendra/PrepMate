import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Building2, Tag, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const QuestionCard = ({
  question,
  onToggleBookmark,
  showAnswerToggle = true,
  isBookmarked = false,
}) => {
  const [expanded, setExpanded] = useState(false);
  const { isAuthenticated } = useAuth();

  const difficultyStyles = {
    Easy: 'bg-[#20B2AA]/10 text-[#3FD1C7] border-[#20B2AA]/25',
    Medium: 'bg-[#20B2AA]/20 text-[#20B2AA] border-[#20B2AA]/35',
    Hard: 'bg-[#0E6E68]/40 text-charcoal-50 border-[#20B2AA]/50 font-semibold',
  };

  const handleBookmarkClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleBookmark) {
      onToggleBookmark(question._id);
    }
  };

  return (
    <div className="glass-card glass-card-hover rounded-2xl p-6 transition-all border border-[#20B2AA]/15 relative group">
      {/* Header Info */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Difficulty Badge */}
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
              difficultyStyles[question.difficulty] || difficultyStyles.Medium
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#20B2AA]" />
            {question.difficulty}
          </span>

          {/* Category Badge */}
          {question.category && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-charcoal-850 text-charcoal-200 border border-[#20B2AA]/15">
              {question.category.name || question.category}
            </span>
          )}

          {/* Company Badge */}
          {question.company && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#20B2AA]/10 text-[#3FD1C7] border border-[#20B2AA]/20">
              <Building2 className="w-3 h-3 text-[#20B2AA]" />
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
                ? 'bg-[#20B2AA]/20 text-[#3FD1C7] border-[#20B2AA]/40 hover:bg-[#20B2AA]/30'
                : 'bg-charcoal-850 text-charcoal-400 border-[#20B2AA]/15 hover:text-white hover:bg-charcoal-800'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-[#20B2AA]' : ''}`} />
          </button>
        )}
      </div>

      {/* Question Title */}
      <Link
        to={`/questions/${question._id}`}
        className="block group-hover:text-[#3FD1C7] text-base font-display font-medium text-white transition-colors leading-snug mb-3"
      >
        {question.title}
      </Link>

      {/* Tags */}
      {question.tags && question.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {question.tags.map((tag, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-charcoal-850 text-charcoal-400 border border-[#20B2AA]/10"
            >
              <Tag className="w-2.5 h-2.5 text-[#20B2AA]" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Expandable Explanation / Answer Snippet */}
      {showAnswerToggle && (
        <div className="border-t border-[#20B2AA]/15 pt-4 mt-2">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#20B2AA] hover:text-[#3FD1C7] transition-colors"
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
              className="flex items-center gap-1 text-xs font-medium text-charcoal-400 hover:text-[#3FD1C7] transition-colors"
            >
              <span>Full Details</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {expanded && (
            <div className="mt-4 p-4 rounded-xl bg-charcoal-900 border border-[#20B2AA]/20 text-charcoal-100 text-xs prose-custom animate-in fade-in duration-200">
              <div
                dangerouslySetInnerHTML={{
                  __html: question.description
                    .replace(/### (.*)/g, '<h3 class="text-xs font-bold text-[#3FD1C7] mt-2 mb-1">$1</h3>')
                    .replace(/`([^`]+)`/g, '<code class="bg-charcoal-850 border border-[#20B2AA]/20 px-1 py-0.5 rounded text-[#3FD1C7] text-xs font-mono">$1</code>')
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
