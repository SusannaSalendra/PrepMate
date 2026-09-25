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
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Bot,
  Lightbulb,
  Award,
  TrendingUp,
  X,
} from 'lucide-react';
import api from '../api/axios';
import { Loader } from '../components/Loader';
import {
  speakText,
  stopSpeaking,
  createSpeechRecognizer,
  isSpeechRecognitionSupported,
  isSpeechSynthesisSupported,
  playSoundEffect,
} from '../utils/speechUtils';

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

  // Voice Assistant States
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [interimVoiceText, setInterimVoiceText] = useState('');
  const [showAiMentorDrawer, setShowAiMentorDrawer] = useState(false);
  const [aiMentorEvaluating, setAiMentorEvaluating] = useState(false);
  const [aiEvaluation, setAiEvaluation] = useState(null);
  const [hintText, setHintText] = useState('');
  const [loadingHint, setLoadingHint] = useState(false);

  const recognizerRef = useRef(null);

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
      stopSpeaking();
    };
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    if (!isSpeechRecognitionSupported()) return;

    recognizerRef.current = createSpeechRecognizer({
      onStart: () => {
        setIsListening(true);
        playSoundEffect('start');
      },
      onResult: (finalTranscript, interim) => {
        setAnswerText((prev) => {
          const combined = (prev ? prev.trim() + ' ' : '') + finalTranscript.trim();
          return combined;
        });
        setInterimVoiceText(interim);
      },
      onInterim: (interim) => {
        setInterimVoiceText(interim);
      },
      onEnd: () => {
        setIsListening(false);
        setInterimVoiceText('');
      },
      onError: () => {
        setIsListening(false);
        setInterimVoiceText('');
      },
    });

    return () => {
      if (recognizerRef.current) {
        recognizerRef.current.abort();
      }
    };
  }, []);

  // Sync state when currentIndex changes
  const switchQuestion = (targetIndex) => {
    if (!session || targetIndex < 0 || targetIndex >= session.questions.length) return;
    stopSpeaking();
    setIsSpeaking(false);
    if (isListening && recognizerRef.current) {
      recognizerRef.current.stop();
      setIsListening(false);
    }

    setCurrentIndex(targetIndex);
    const targetQ = session.questions[targetIndex];
    setAnswerText(targetQ.answerText || '');
    setConfidenceRating(targetQ.confidenceRating || 3);
    setAiEvaluation(null);
    setHintText('');
  };

  // Toggle Voice Dictation for Answer Textarea
  const handleToggleVoiceDictation = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    }

    if (isListening) {
      if (recognizerRef.current) {
        recognizerRef.current.stop();
      }
      setIsListening(false);
      playSoundEffect('stop');
    } else {
      if (recognizerRef.current) {
        recognizerRef.current.start();
      }
    }
  };

  // Speak Current Question
  const handleSpeakQuestion = () => {
    if (!currentItem?.question) return;

    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    speakText(
      `Question ${currentIndex + 1}: ${currentItem.question.title}. Please outline your solution and time complexity.`,
      {
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      }
    );
  };

  // Request Instant AI Mentor Feedback on Current Answer
  const handleAiMentorCheck = async () => {
    if (!answerText.trim() || !currentItem?.question) return;

    setShowAiMentorDrawer(true);
    setAiMentorEvaluating(true);
    try {
      const res = await api.post('/ai-mentor/evaluate', {
        questionTitle: currentItem.question.title,
        questionDescription: currentItem.question.description,
        candidateAnswer: answerText,
        categoryName: session.category?.name || 'General',
        difficulty: currentItem.question.difficulty || 'Medium',
      });

      if (res.data?.success) {
        setAiEvaluation(res.data.data);
        playSoundEffect('success');
      }
    } catch (err) {
      console.error('AI check error', err);
    } finally {
      setAiMentorEvaluating(false);
    }
  };

  // Request Hint from AI Mentor
  const handleRequestHint = async () => {
    if (!currentItem?.question) return;
    setLoadingHint(true);
    try {
      const res = await api.post('/ai-mentor/hint', {
        questionTitle: currentItem.question.title,
        categoryName: session.category?.name || 'Technical',
        hintLevel: 1,
      });

      if (res.data?.success) {
        setHintText(res.data.data.hint);
        setShowAiMentorDrawer(true);
      }
    } catch (err) {
      console.error('Hint error', err);
    } finally {
      setLoadingHint(false);
    }
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
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
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

              {/* Voice Read Aloud Button */}
              <button
                type="button"
                onClick={handleSpeakQuestion}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                  isSpeaking
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 animate-pulse'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-cyan-400" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
                <span>{isSpeaking ? 'Stop Audio' : 'Listen Question'}</span>
              </button>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug mb-6">
              {questionDetails.title}
            </h2>

            {/* Answer Textarea with Voice Dictation Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Your Answer / Technical Approach
                </label>

                {/* Voice Dictation Button */}
                <button
                  type="button"
                  onClick={handleToggleVoiceDictation}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border transition-all ${
                    isListening
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                      : 'bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border-indigo-500/30'
                  }`}
                >
                  {isListening ? <MicOff className="w-3.5 h-3.5 text-rose-400" /> : <Mic className="w-3.5 h-3.5 text-indigo-400" />}
                  <span>{isListening ? 'Stop Mic Recording' : 'Voice Dictate Answer'}</span>
                </button>
              </div>

              <div className="relative">
                <textarea
                  rows={9}
                  value={answerText + (interimVoiceText ? ` ${interimVoiceText}...` : '')}
                  onChange={(e) => setAnswerText(e.target.value)}
                  placeholder="Type your explanation, key algorithms, time/space complexity, or click Voice Dictate to speak..."
                  className={`w-full p-4 rounded-2xl bg-slate-950/80 border text-white placeholder-slate-600 text-sm font-sans focus:outline-none transition-all resize-y ${
                    isListening
                      ? 'border-rose-500 ring-2 ring-rose-500/30 bg-rose-950/10'
                      : 'border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                  }`}
                />
              </div>
            </div>

            {/* AI Assistant Quick Actions Bar */}
            <div className="mt-4 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAiMentorCheck}
                  disabled={aiMentorEvaluating || !answerText.trim()}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 disabled:opacity-50 transition-all"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>{aiMentorEvaluating ? 'Evaluating...' : 'AI Mentor Review'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleRequestHint}
                  disabled={loadingHint}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold disabled:opacity-50 transition-all"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <span>{loadingHint ? 'Loading Hint...' : 'Ask for Hint'}</span>
                </button>
              </div>

              <span className="text-[11px] text-slate-500 font-medium">
                {answerText.split(/\s+/).filter(Boolean).length} words
              </span>
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

      {/* AI Mentor Feedback Modal / Slide Drawer */}
      {showAiMentorDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-indigo-500/30 max-w-xl w-full bg-slate-950 shadow-2xl relative space-y-5">
            <button
              onClick={() => setShowAiMentorDrawer(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-600/30">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white">
                  AI Mentor Quick Assessment
                </h3>
                <p className="text-xs text-indigo-300">
                  Instant guidance for {questionDetails.title}
                </p>
              </div>
            </div>

            {/* Hint Section */}
            {hintText && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs leading-relaxed flex items-start gap-3">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-300 mb-0.5">Progressive Hint:</p>
                  <p>{hintText}</p>
                </div>
              </div>
            )}

            {/* Evaluation Breakdown */}
            {aiEvaluation && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-400">Answer Depth Score</p>
                    <p className="text-xs text-emerald-400 font-bold">
                      Clarity: {aiEvaluation.clarityRating}
                    </p>
                  </div>
                  <span className="px-3 py-1.5 rounded-xl text-lg font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {aiEvaluation.score}%
                  </span>
                </div>

                {aiEvaluation.spokenMentorFeedback && (
                  <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    "{aiEvaluation.spokenMentorFeedback}"
                  </p>
                )}

                {/* Strengths */}
                {aiEvaluation.strengths?.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
                      Strengths:
                    </p>
                    <ul className="text-xs text-slate-300 space-y-1">
                      {aiEvaluation.strengths.map((s, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-400">•</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Improvements */}
                {aiEvaluation.areasForImprovement?.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                      Suggestions to Improve:
                    </p>
                    <ul className="text-xs text-slate-300 space-y-1">
                      {aiEvaluation.areasForImprovement.map((imp, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-amber-400">•</span>
                          <span>{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowAiMentorDrawer(false)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
              >
                Continue Answering
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MockInterviewSession;
