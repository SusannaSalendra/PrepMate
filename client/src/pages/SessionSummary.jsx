import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Award,
  Clock,
  CheckCircle,
  SkipForward,
  Star,
  PlayCircle,
  History,
  ChevronDown,
  ChevronUp,
  Sparkles,
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
        <h2 className="text-xl font-bold text-white mb-2">Session Not Found</h2>
        <p className="text-sm text-slate-400 mb-6">{error}</p>
        <Link
          to="/mock-interview"
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
        >
          Start New Session
        </Link>
      </div>
    );
  }

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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Celebration Header */}
      <div className="text-center mb-10">
        <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white mb-4 shadow-xl shadow-indigo-500/25">
          <Award className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Mock Interview Completed!
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          Great job practicing. Review your answers and compare them against verified solutions below.
        </p>
      </div>

      {/* Stats Scorecard Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <div className="glass-card rounded-2xl p-5 border border-slate-800 text-center">
          <p className="text-xs text-slate-400 mb-1">Category</p>
          <p className="text-sm font-bold text-indigo-400 truncate">
            {session.category?.name || 'General'}
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800 text-center">
          <p className="text-xs text-slate-400 mb-1">Attempted</p>
          <p className="text-2xl font-extrabold text-emerald-400">
            {answeredQuestions.length}
            <span className="text-xs text-slate-500 font-normal"> / {totalQuestions}</span>
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800 text-center">
          <p className="text-xs text-slate-400 mb-1">Avg Confidence</p>
          <p className="text-2xl font-extrabold text-amber-300">
            {avgConfidence}
            <span className="text-xs text-slate-500 font-normal"> / 5</span>
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800 text-center">
          <p className="text-xs text-slate-400 mb-1">Time Elapsed</p>
          <p className="text-2xl font-extrabold text-cyan-300">
            {formatDuration(session.timeTakenSeconds || 0)}
          </p>
        </div>
      </div>

      {/* Action CTA Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 mb-10">
        <span className="text-xs text-slate-300 font-medium">
          Ready for another round? Choose a new category or review past progress.
        </span>
        <div className="flex items-center gap-2.5">
          <Link
            to="/sessions"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
          >
            <History className="w-3.5 h-3.5" />
            <span>Session History</span>
          </Link>
          <Link
            to="/mock-interview"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span>New Session</span>
          </Link>
        </div>
      </div>

      {/* Questions & Solutions Detailed Breakdown */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          <span>Detailed Question Review</span>
        </h2>

        {session.questions.map((item, idx) => {
          const isExpanded = expandedIndex === idx;
          const q = item.question;

          return (
            <div
              key={idx}
              className="glass-card rounded-3xl p-6 border border-slate-800 shadow-xl transition-all"
            >
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-white text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300">
                    {q.difficulty}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                      item.status === 'Answered'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                {item.status === 'Answered' && (
                  <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>Confidence: {item.confidenceRating || 3} / 5</span>
                  </div>
                )}
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-white mb-4">{q.title}</h3>

              {/* User's Submitted Answer */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 mb-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Your Answer:
                </p>
                <p className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {item.answerText ? item.answerText : <span className="text-slate-500 italic">No answer written (Skipped)</span>}
                </p>
              </div>

              {/* Expandable Model Solution */}
              <div>
                <button
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
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
                  <div className="mt-4 p-5 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 text-slate-300 text-xs prose-custom animate-in fade-in duration-200">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: q.description
                          .replace(/### (.*)/g, '<h3 class="text-xs font-bold text-indigo-300 mt-3 mb-1">$1</h3>')
                          .replace(/`([^`]+)`/g, '<code class="bg-slate-800 px-1 py-0.5 rounded text-sky-300 text-[11px] font-mono">$1</code>')
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
