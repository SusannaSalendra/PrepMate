import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Award, CheckCircle, AlertCircle, ArrowRight, RotateCcw, Star } from 'lucide-react';

export const SessionSummaryCard = ({ session }) => {
  const answeredQuestions = session.questions.filter((q) => q.status === 'Answered');
  const skippedQuestions = session.questions.filter((q) => q.status === 'Skipped');
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
    <div className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition-all">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-4 border-b border-slate-800/80">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
            {session.category?.name || 'General Category'}
          </span>
          <p className="text-xs text-slate-400">{formatDate(session.createdAt)}</p>
        </div>

        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
          Difficulty: {session.difficulty}
        </span>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
          <p className="text-xs text-slate-400 flex items-center justify-center gap-1 mb-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            Answered
          </p>
          <p className="text-lg font-bold text-white">
            {answeredQuestions.length} <span className="text-xs text-slate-500 font-normal">/ {totalQuestions}</span>
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
          <p className="text-xs text-slate-400 flex items-center justify-center gap-1 mb-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            Avg Confidence
          </p>
          <p className="text-lg font-bold text-amber-300">
            {avgConfidence} <span className="text-xs text-slate-500 font-normal">/ 5</span>
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
          <p className="text-xs text-slate-400 flex items-center justify-center gap-1 mb-1">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            Time Taken
          </p>
          <p className="text-lg font-bold text-cyan-300">
            {formatDuration(session.timeTakenSeconds || 0)}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <Link
          to={`/sessions/${session._id}`}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-all"
        >
          <span>Review Answers</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        <Link
          to="/mock-interview"
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-xs font-semibold transition-all"
          title="Start a new session"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>New Session</span>
        </Link>
      </div>
    </div>
  );
};

export default SessionSummaryCard;
