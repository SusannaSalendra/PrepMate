import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle, ArrowRight, RotateCcw, Star } from 'lucide-react';

export const SessionSummaryCard = ({ session }) => {
  const answeredQuestions = session.questions.filter((q) => q.status === 'Answered');
  const totalQuestions = session.questions.length;

  const totalConfidence = answeredQuestions.reduce(
    (acc, curr) => acc + (curr.confidenceRating || 3),
    0
  );
  const avgConfidence =
    answeredQuestions.length > 0
      ? (totalConfidence / answeredQuestions.length).toFixed(1)
      : '0.0';

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-[#20B2AA]/15 hover:border-[#20B2AA]/35 transition-all">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-4 border-b border-[#20B2AA]/15">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#3FD1C7] font-mono">
            {session.category?.name || 'General Domain'}
          </span>
          <p className="text-[11px] text-charcoal-400 mt-0.5">{formatDate(session.createdAt)}</p>
        </div>

        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-charcoal-850 text-charcoal-200 border border-[#20B2AA]/15">
          Difficulty: {session.difficulty}
        </span>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="p-3 rounded-xl bg-charcoal-850/80 border border-[#20B2AA]/15 text-center">
          <p className="text-[11px] text-charcoal-400 flex items-center justify-center gap-1 mb-1">
            <CheckCircle className="w-3.5 h-3.5 text-[#20B2AA]" />
            Answered
          </p>
          <p className="text-base font-bold font-display text-white">
            {answeredQuestions.length} <span className="text-[11px] text-charcoal-400 font-normal">/ {totalQuestions}</span>
          </p>
        </div>

        <div className="p-3 rounded-xl bg-charcoal-850/80 border border-[#20B2AA]/15 text-center">
          <p className="text-[11px] text-charcoal-400 flex items-center justify-center gap-1 mb-1">
            <Star className="w-3.5 h-3.5 text-[#20B2AA] fill-[#20B2AA]" />
            Confidence
          </p>
          <p className="text-base font-bold font-display text-[#3FD1C7]">
            {avgConfidence} <span className="text-[11px] text-charcoal-400 font-normal">/ 5</span>
          </p>
        </div>

        <div className="p-3 rounded-xl bg-charcoal-850/80 border border-[#20B2AA]/15 text-center">
          <p className="text-[11px] text-charcoal-400 flex items-center justify-center gap-1 mb-1">
            <Clock className="w-3.5 h-3.5 text-[#20B2AA]" />
            Time Taken
          </p>
          <p className="text-base font-bold font-display text-[#20B2AA]">
            {formatDuration(session.timeTakenSeconds || 0)}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <Link
          to={`/sessions/${session._id}`}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-[#20B2AA]/15 hover:bg-[#20B2AA]/25 text-[#3FD1C7] border border-[#20B2AA]/30 text-xs font-semibold transition-all"
        >
          <span>Review Answers</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        <Link
          to="/mock-interview"
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-charcoal-850 hover:bg-charcoal-800 text-charcoal-400 hover:text-white border border-[#20B2AA]/15 text-xs font-semibold transition-all"
          title="Start a new session"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#20B2AA]" />
          <span>New Session</span>
        </Link>
      </div>
    </div>
  );
};

export default SessionSummaryCard;
