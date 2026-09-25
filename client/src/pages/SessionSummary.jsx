import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Award,
  Clock,
  CheckCircle,
  Star,
  PlayCircle,
  History,
  ChevronDown,
  ChevronUp,
  BookOpen,
} from 'lucide-react';
import api from '../api/axios';
import { Loader } from '../components/Loader';

export const SessionSummary = () => {
  const { sessionId } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/mock-sessions/${sessionId}`);
        if (res.data?.success) {
          setSession(res.data.data);
        }
      } catch (err) {
        setError('Failed to load session results.');
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [sessionId]);

  if (loading) {
    return <Loader fullScreen text="Compiling your interview score..." />;
  }

  if (error || !session) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-display font-bold text-white mb-2">Session Not Found</h2>
        <p className="text-xs text-charcoal-400 mb-6">{error}</p>
        <Link
          to="/mock-interview"
          className="px-4 py-2 rounded-xl bg-[#20B2AA] text-[#0D1614] text-xs font-bold"
        >
          Start New Session
        </Link>
      </div>
    );
  }

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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Celebration Header */}
      <div className="text-center mb-10">
        <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-[#20B2AA] to-[#0E6E68] text-[#0D1614] mb-4 shadow-xl shadow-[#20B2AA]/20">
          <Award className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-medium text-white tracking-tight">
          Mock Interview Completed!
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-400 mt-2">
          Great job practicing. Review your answers and compare them against verified solutions below.
        </p>
      </div>

      {/* Stats Scorecard Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <div className="glass-card rounded-2xl p-5 border border-[#20B2AA]/15 text-center">
          <p className="text-xs text-charcoal-400 mb-1 font-mono">Domain</p>
          <p className="text-sm font-bold font-display text-[#3FD1C7] truncate">
            {session.category?.name || 'General'}
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-[#20B2AA]/15 text-center">
          <p className="text-xs text-charcoal-400 mb-1 font-mono">Attempted</p>
          <p className="text-2xl font-display font-bold text-[#20B2AA]">
            {answeredQuestions.length}
            <span className="text-xs text-charcoal-400 font-normal"> / {totalQuestions}</span>
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-[#20B2AA]/15 text-center">
          <p className="text-xs text-charcoal-400 mb-1 font-mono">Avg Confidence</p>
          <p className="text-2xl font-display font-bold text-[#3FD1C7]">
            {avgConfidence}
            <span className="text-xs text-charcoal-400 font-normal"> / 5</span>
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-[#20B2AA]/15 text-center">
          <p className="text-xs text-charcoal-400 mb-1 font-mono">Time Elapsed</p>
          <p className="text-2xl font-display font-bold text-[#20B2AA]">
            {formatDuration(session.timeTakenSeconds || 0)}
          </p>
        </div>
      </div>

      {/* Action CTA Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-charcoal-850 border border-[#20B2AA]/15 mb-10">
        <span className="text-xs text-charcoal-200 font-medium">
          Ready for another round? Choose a new domain or review past progress.
        </span>
        <div className="flex items-center gap-2.5">
          <Link
            to="/sessions"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-charcoal-200 text-xs font-semibold border border-[#20B2AA]/15 transition-all"
          >
            <History className="w-3.5 h-3.5 text-[#20B2AA]" />
            <span>Session History</span>
          </Link>
          <Link
            to="/mock-interview"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#20B2AA] hover:bg-[#3FD1C7] text-[#0D1614] text-xs font-bold shadow-md shadow-[#20B2AA]/20 transition-all"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span>New Session</span>
          </Link>
        </div>
      </div>

      {/* Questions & Solutions Detailed Breakdown */}
      <div className="space-y-6">
        <h2 className="text-xl font-display font-medium text-white tracking-tight flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#20B2AA]" />
          <span>Detailed Question Review</span>
        </h2>

        {session.questions.map((item, idx) => {
          const isExpanded = expandedIndex === idx;
          const q = item.question;

          return (
            <div
              key={idx}
              className="glass-card rounded-2xl p-6 border border-[#20B2AA]/15 shadow-xl transition-all"
            >
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-charcoal-800 text-white text-xs font-bold flex items-center justify-center font-mono">
                    {idx + 1}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-charcoal-850 text-charcoal-300">
                    {q.difficulty}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                      item.status === 'Answered'
                        ? 'bg-[#20B2AA]/15 text-[#3FD1C7] border border-[#20B2AA]/30'
                        : 'bg-charcoal-800 text-charcoal-400'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                {item.status === 'Answered' && (
                  <div className="flex items-center gap-1 text-xs text-[#20B2AA] font-semibold">
                    <Star className="w-3.5 h-3.5 fill-[#20B2AA]" />
                    <span>Confidence: {item.confidenceRating || 3} / 5</span>
                  </div>
                )}
              </div>

              {/* Title */}
              <h3 className="text-base font-display font-medium text-white mb-4">{q.title}</h3>

              {/* User's Submitted Answer */}
              <div className="p-4 rounded-xl bg-charcoal-900 border border-[#20B2AA]/15 mb-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 mb-1.5 font-mono">
                  Your Answer:
                </p>
                <p className="text-xs text-charcoal-100 whitespace-pre-wrap leading-relaxed">
                  {item.answerText ? item.answerText : <span className="text-charcoal-400 italic">No answer written (Skipped)</span>}
                </p>
              </div>

              {/* Expandable Model Solution */}
              <div>
                <button
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#20B2AA] hover:text-[#3FD1C7] transition-colors"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="w-3.5 h-3.5" />
                      <span>Hide Solution & Explanation</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3.5 h-3.5" />
                      <span>View Model Solution & Explanation</span>
                    </>
                  )}
                </button>

                {isExpanded && (
                  <div className="mt-4 p-5 rounded-2xl bg-[#081A18] border border-[#20B2AA]/25 text-charcoal-100 text-xs prose-custom animate-in fade-in duration-200">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: q.description
                          .replace(/### (.*)/g, '<h3 class="text-xs font-display font-semibold text-[#3FD1C7] mt-3 mb-1">$1</h3>')
                          .replace(/`([^`]+)`/g, '<code class="bg-charcoal-850 border border-[#20B2AA]/20 px-1 py-0.5 rounded text-[#3FD1C7] text-[11px] font-mono">$1</code>')
                          .replace(/\n\n/g, '<br/><br/>'),
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SessionSummary;
