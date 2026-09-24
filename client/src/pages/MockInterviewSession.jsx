import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Clock,
  CheckCircle,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  Send,
  Star,
  AlertTriangle,
  Building2,
  Tag,
  Sparkles,
} from 'lucide-react';
import api from '../api/axios';
import { Loader } from '../components/Loader';

export const MockInterviewSession = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [error, setError] = useState('');

  // Current question response state
  const [answerText, setAnswerText] = useState('');
  const [confidenceRating, setConfidenceRating] = useState(3);

  // Timer state
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef(null);

  // Fetch session data
  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/mock-sessions/${sessionId}`);
        if (res.data?.success) {
          const sess = res.data.data;
          setSession(sess);

          // If session is already marked completed, redirect to summary
          if (sess.isCompleted) {
            navigate(`/sessions/${sess._id}`, { replace: true });
            return;
          }

          // Initialize first question fields
          if (sess.questions && sess.questions.length > 0) {
            setAnswerText(sess.questions[0].answerText || '');
            setConfidenceRating(sess.questions[0].confidenceRating || 3);
          }
        }
      } catch (err) {
        setError('Failed to load session details.');
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [sessionId, navigate]);

  // Start Elapsed Timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Sync state when currentIndex changes
  const switchQuestion = (targetIndex) => {
    if (!session || targetIndex < 0 || targetIndex >= session.questions.length) return;
    setCurrentIndex(targetIndex);
    const targetQ = session.questions[targetIndex];
    setAnswerText(targetQ.answerText || '');
    setConfidenceRating(targetQ.confidenceRating || 3);
  };

  // Save current question answer to backend
  const saveCurrentAnswer = async (status = 'Answered') => {
    if (!session || !session.questions[currentIndex]) return;
    const currentQ = session.questions[currentIndex];

    setSaving(true);
    try {
      const res = await api.put(`/mock-sessions/${sessionId}/answer`, {
        questionId: currentQ.question._id,
        answerText,
        confidenceRating,
        status,
      });

      if (res.data?.success) {
        setSession(res.data.data);
      }
    } catch (err) {
      console.error('Failed to sync answer', err);
    } finally {
      setSaving(false);
    }
  };

  const handleNext = async () => {
    await saveCurrentAnswer('Answered');
    if (currentIndex < session.questions.length - 1) {
      switchQuestion(currentIndex + 1);
    }
  };

  const handleSkip = async () => {
    await saveCurrentAnswer('Skipped');
    if (currentIndex < session.questions.length - 1) {
      switchQuestion(currentIndex + 1);
    }
  };

  const handlePrevious = async () => {
    await saveCurrentAnswer(answerText.trim() ? 'Answered' : 'Pending');
    if (currentIndex > 0) {
      switchQuestion(currentIndex - 1);
    }
  };

  const handleCompleteSession = async () => {
    const confirmed = window.confirm('Are you ready to submit and complete this mock interview session?');
    if (!confirmed) return;

    setFinishing(true);
    try {
      // Save current active question before completing
      await saveCurrentAnswer(answerText.trim() ? 'Answered' : 'Skipped');

      const res = await api.put(`/mock-sessions/${sessionId}/complete`, {
        timeTakenSeconds: elapsedSeconds,
      });

      if (res.data?.success) {
        navigate(`/sessions/${sessionId}`, { replace: true });
      }
    } catch (err) {
      setError('Failed to complete session.');
      setFinishing(false);
    }
  };

  const formatTimer = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (loading) {
    return <Loader fullScreen text="Loading mock interview workspace..." />;
  }

  if (error || !session) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Session Error</h2>
        <p className="text-sm text-slate-400 mb-6">{error || 'Session could not be loaded.'}</p>
        <button
          onClick={() => navigate('/mock-interview')}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
        >
          Return to Setup
        </button>
      </div>
    );
  }

  const currentItem = session.questions[currentIndex];
  const questionDetails = currentItem.question;
  const totalQuestions = session.questions.length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      {/* Top Session Status Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-wrap items-center justify-between gap-4 mb-6 sticky top-20 z-30 shadow-2xl">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-xl text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {session.category?.name || 'Mock Interview'}
          </span>
          <span className="text-xs text-slate-400">
            Question <span className="text-white font-bold">{currentIndex + 1}</span> of{' '}
            <span className="text-white font-bold">{totalQuestions}</span>
          </span>
        </div>

        {/* Live Timer */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-cyan-400 font-mono text-sm font-bold shadow-inner">
          <Clock className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>{formatTimer(elapsedSeconds)}</span>
        </div>

        {/* Complete Button */}
        <button
          onClick={handleCompleteSession}
          disabled={finishing}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all active:scale-[0.98]"
        >
          <CheckCircle className="w-4 h-4" />
          <span>{finishing ? 'Finalizing...' : 'Submit Session'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Main Question & Workspace */}
        <div className="lg:col-span-8 space-y-6">
          {/* Question Card */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                {questionDetails.difficulty}
              </span>
              {questionDetails.company && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  <Building2 className="w-3 h-3 text-indigo-400" />
                  {questionDetails.company}
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug mb-6">
              {questionDetails.title}
            </h2>

            {/* Answer Textarea */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Your Answer / Technical Approach
              </label>
              <textarea
                rows={9}
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder="Type your explanation, key algorithms, time/space complexity, or architectural breakdown here..."
                className="w-full p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-600 text-sm font-sans focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-y"
              />
            </div>

            {/* Self-Confidence Slider */}
            <div className="mt-6 pt-6 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                  Self-Rated Confidence
                </label>
                <p className="text-xs text-slate-500">
                  How confident are you with this answer?
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setConfidenceRating(star)}
                    className={`p-2 rounded-xl transition-all ${
                      confidenceRating >= star
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'bg-slate-900 border border-slate-800 text-slate-600 hover:text-slate-400'
                    }`}
                  >
                    <Star
                      className={`w-5 h-5 ${
                        confidenceRating >= star ? 'fill-amber-400' : ''
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Nav Actions */}
            <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentIndex === 0 || saving}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSkip}
                  disabled={saving}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold border border-slate-800 transition-all"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                  <span>Skip</span>
                </button>

                {currentIndex < totalQuestions - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={saving}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
                  >
                    <span>{saving ? 'Saving...' : 'Next Question'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleCompleteSession}
                    disabled={finishing}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Finish Session</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Session Navigator Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card rounded-3xl p-6 border border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Session Progress
            </h3>

            <div className="grid grid-cols-5 gap-2.5 mb-6">
              {session.questions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const isAnswered = q.status === 'Answered';
                const isSkipped = q.status === 'Skipped';

                let bgClass = 'bg-slate-900 border-slate-800 text-slate-400';
                if (isCurrent) {
                  bgClass = 'bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-600/30 font-bold';
                } else if (isAnswered) {
                  bgClass = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 font-semibold';
                } else if (isSkipped) {
                  bgClass = 'bg-amber-500/20 text-amber-400 border-amber-500/40';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => switchQuestion(idx)}
                    className={`h-11 rounded-xl border flex items-center justify-center text-xs transition-all hover:scale-105 ${bgClass}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="space-y-2 text-xs text-slate-400 border-t border-slate-800 pt-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-indigo-600" />
                <span>Current Question</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500/50" />
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-amber-500/30 border border-amber-500/50" />
                <span>Skipped</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockInterviewSession;
