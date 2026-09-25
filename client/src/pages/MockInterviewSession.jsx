import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Clock,
  CheckCircle,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  Star,
  AlertTriangle,
  Building2,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Bot,
  Lightbulb,
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

          if (sess.isCompleted) {
            navigate(`/sessions/${sess._id}`, { replace: true });
            return;
          }

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
        <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-display font-bold text-white mb-2">Session Error</h2>
        <p className="text-xs text-charcoal-400 mb-6">{error || 'Session could not be loaded.'}</p>
        <button
          onClick={() => navigate('/mock-interview')}
          className="px-4 py-2 rounded-xl bg-[#20B2AA] text-[#0D1614] text-xs font-bold"
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
      <div className="glass-panel rounded-2xl p-4 border border-[#20B2AA]/15 flex flex-wrap items-center justify-between gap-4 mb-6 sticky top-20 z-30 shadow-2xl">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-xl text-xs font-bold bg-[#20B2AA]/15 text-[#3FD1C7] border border-[#20B2AA]/30">
            {session.category?.name || 'Mock Interview'}
          </span>
          <span className="text-xs text-charcoal-400 font-mono">
            Question <span className="text-white font-bold">{currentIndex + 1}</span> of{' '}
            <span className="text-white font-bold">{totalQuestions}</span>
          </span>
        </div>

        {/* Live Timer */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-charcoal-850 border border-[#20B2AA]/20 text-[#3FD1C7] font-mono text-sm font-bold shadow-inner">
          <Clock className="w-4 h-4 text-[#20B2AA] animate-pulse" />
          <span>{formatTimer(elapsedSeconds)}</span>
        </div>

        {/* Complete Button */}
        <button
          onClick={handleCompleteSession}
          disabled={finishing}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#20B2AA] hover:bg-[#3FD1C7] text-[#0D1614] text-xs font-bold shadow-md shadow-[#20B2AA]/20 transition-all active:scale-[0.98]"
        >
          <CheckCircle className="w-4 h-4" />
          <span>{finishing ? 'Finalizing...' : 'Submit Session'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Main Question & Workspace */}
        <div className="lg:col-span-8 space-y-6">
          {/* Question Card */}
          <div className="glass-card rounded-2xl p-6 sm:p-8 border border-[#20B2AA]/15 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-charcoal-850 text-charcoal-200 border border-[#20B2AA]/15">
                  {questionDetails.difficulty}
                </span>
                {questionDetails.company && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#20B2AA]/10 text-[#3FD1C7] border border-[#20B2AA]/20">
                    <Building2 className="w-3 h-3 text-[#20B2AA]" />
                    {questionDetails.company}
                  </span>
                )}
              </div>

              {/* Voice Read Aloud Button */}
              <button
                type="button"
                onClick={handleSpeakQuestion}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-semibold transition-all ${
                  isSpeaking
                    ? 'bg-[#20B2AA]/20 text-[#3FD1C7] border-[#20B2AA]/40 animate-pulse'
                    : 'bg-charcoal-850 hover:bg-charcoal-800 text-charcoal-200 border-[#20B2AA]/15'
                }`}
              >
                {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-[#20B2AA]" /> : <Volume2 className="w-3.5 h-3.5 text-[#20B2AA]" />}
                <span>{isSpeaking ? 'Stop Audio' : 'Listen Question'}</span>
              </button>
            </div>

            <h2 className="text-xl sm:text-2xl font-display font-medium text-white tracking-tight leading-snug mb-6">
              {questionDetails.title}
            </h2>

            {/* Answer Textarea with Voice Dictation Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-300 font-mono">
                  Your Answer / Technical Approach
                </label>

                {/* Voice Dictation Button */}
                <button
                  type="button"
                  onClick={handleToggleVoiceDictation}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
                    isListening
                      ? 'bg-[#0E6E68] text-white border-[#20B2AA] animate-pulse'
                      : 'bg-[#20B2AA]/15 text-[#3FD1C7] hover:bg-[#20B2AA]/25 border-[#20B2AA]/30'
                  }`}
                >
                  {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-[#20B2AA]" />}
                  <span>{isListening ? 'Stop Mic' : 'Voice Dictate'}</span>
                </button>
              </div>

              <div className="relative">
                <textarea
                  rows={9}
                  value={answerText + (interimVoiceText ? ` ${interimVoiceText}...` : '')}
                  onChange={(e) => setAnswerText(e.target.value)}
                  placeholder="Type your explanation, key algorithms, time/space complexity, or click Voice Dictate to speak..."
                  className={`w-full p-4 rounded-2xl bg-charcoal-900 border text-white placeholder-charcoal-400 text-xs sm:text-sm font-sans focus:outline-none transition-all resize-y ${
                    isListening
                      ? 'border-[#20B2AA] ring-2 ring-[#20B2AA]/30 bg-[#081A18]'
                      : 'border-[#20B2AA]/20 focus:border-[#20B2AA] focus:ring-1 focus:ring-[#20B2AA]'
                  }`}
                />
              </div>
            </div>

            {/* AI Assistant Quick Actions Bar */}
            <div className="mt-4 p-3 rounded-2xl bg-charcoal-850 border border-[#20B2AA]/15 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAiMentorCheck}
                  disabled={aiMentorEvaluating || !answerText.trim()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#20B2AA] hover:bg-[#3FD1C7] text-[#0D1614] text-xs font-bold shadow-md shadow-[#20B2AA]/20 disabled:opacity-50 transition-all"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>{aiMentorEvaluating ? 'Evaluating...' : 'AI Mentor Check'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleRequestHint}
                  disabled={loadingHint}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#20B2AA]/10 hover:bg-[#20B2AA]/20 text-[#3FD1C7] border border-[#20B2AA]/30 text-xs font-semibold disabled:opacity-50 transition-all"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-[#20B2AA]" />
                  <span>{loadingHint ? 'Loading Hint...' : 'Ask for Hint'}</span>
                </button>
              </div>

              <span className="text-[11px] text-charcoal-400 font-mono">
                {answerText.split(/\s+/).filter(Boolean).length} words
              </span>
            </div>

            {/* Self-Confidence Slider */}
            <div className="mt-6 pt-6 border-t border-[#20B2AA]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-charcoal-300 block font-mono">
                  Self-Rated Confidence
                </label>
                <p className="text-xs text-charcoal-400">
                  How confident are you with this technical answer?
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
                        ? 'bg-[#20B2AA]/20 text-[#3FD1C7] border border-[#20B2AA]/40'
                        : 'bg-charcoal-850 border border-[#20B2AA]/15 text-charcoal-400 hover:text-white'
                    }`}
                  >
                    <Star
                      className={`w-4 h-4 ${
                        confidenceRating >= star ? 'fill-[#20B2AA] text-[#20B2AA]' : ''
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Nav Actions */}
            <div className="mt-8 pt-6 border-t border-[#20B2AA]/15 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentIndex === 0 || saving}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-charcoal-850 hover:bg-charcoal-800 text-charcoal-200 text-xs font-semibold border border-[#20B2AA]/15 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSkip}
                  disabled={saving}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-charcoal-850 hover:bg-charcoal-800 text-charcoal-400 hover:text-white text-xs font-semibold border border-[#20B2AA]/15 transition-all"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                  <span>Skip</span>
                </button>

                {currentIndex < totalQuestions - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={saving}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#20B2AA] hover:bg-[#3FD1C7] text-[#0D1614] text-xs font-bold shadow-md shadow-[#20B2AA]/20 transition-all"
                  >
                    <span>{saving ? 'Saving...' : 'Next Question'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleCompleteSession}
                    disabled={finishing}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#20B2AA] hover:bg-[#3FD1C7] text-[#0D1614] text-xs font-bold shadow-md shadow-[#20B2AA]/20 transition-all"
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
          <div className="glass-card rounded-2xl p-6 border border-[#20B2AA]/15">
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-300 mb-4 font-mono">
              Session Progress
            </h3>

            <div className="grid grid-cols-5 gap-2.5 mb-6">
              {session.questions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const isAnswered = q.status === 'Answered';
                const isSkipped = q.status === 'Skipped';

                let bgClass = 'bg-charcoal-850 border-[#20B2AA]/15 text-charcoal-400';
                if (isCurrent) {
                  bgClass = 'bg-[#20B2AA] text-[#0D1614] border-[#3FD1C7] shadow-md shadow-[#20B2AA]/25 font-bold';
                } else if (isAnswered) {
                  bgClass = 'bg-[#20B2AA]/20 text-[#3FD1C7] border-[#20B2AA]/40 font-semibold';
                } else if (isSkipped) {
                  bgClass = 'bg-charcoal-800 text-charcoal-400 border-charcoal-700';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => switchQuestion(idx)}
                    className={`h-10 rounded-xl border flex items-center justify-center text-xs font-mono transition-all hover:scale-105 ${bgClass}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="space-y-2 text-xs text-charcoal-400 border-t border-[#20B2AA]/15 pt-4 font-mono">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-[#20B2AA]" />
                <span>Current Question</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-[#20B2AA]/25 border border-[#20B2AA]/50" />
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-charcoal-800 border border-charcoal-700" />
                <span>Skipped</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Mentor Quick Modal */}
      {showAiMentorDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
          <div className="glass-card rounded-2xl p-6 sm:p-8 border border-[#20B2AA]/30 max-w-xl w-full bg-[#0D1614] shadow-2xl relative space-y-5">
            <button
              onClick={() => setShowAiMentorDrawer(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-charcoal-850 hover:bg-charcoal-800 text-charcoal-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#20B2AA] to-[#0E6E68] flex items-center justify-center text-[#0D1614] font-bold shadow-md shadow-[#20B2AA]/20">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-display font-medium text-white">
                  AI Mentor Quick Assessment
                </h3>
                <p className="text-xs text-[#3FD1C7]">
                  Instant guidance for {questionDetails.title}
                </p>
              </div>
            </div>

            {/* Hint Section */}
            {hintText && (
              <div className="p-4 rounded-2xl bg-[#081A18] border border-[#20B2AA]/30 text-charcoal-100 text-xs leading-relaxed flex items-start gap-3">
                <Lightbulb className="w-4 h-4 text-[#20B2AA] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#3FD1C7] mb-0.5 font-display">Progressive Hint:</p>
                  <p>{hintText}</p>
                </div>
              </div>
            )}

            {/* Evaluation Breakdown */}
            {aiEvaluation && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-charcoal-850 border border-[#20B2AA]/20 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-charcoal-400">Answer Depth Score</p>
                    <p className="text-xs text-[#3FD1C7] font-bold">
                      Clarity: {aiEvaluation.clarityRating}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-xl text-base font-bold font-display bg-[#20B2AA]/20 text-[#3FD1C7] border border-[#20B2AA]/30">
                    {aiEvaluation.score}%
                  </span>
                </div>

                {aiEvaluation.spokenMentorFeedback && (
                  <p className="text-xs text-charcoal-200 leading-relaxed italic bg-charcoal-900 p-3 rounded-xl border border-[#20B2AA]/15">
                    "{aiEvaluation.spokenMentorFeedback}"
                  </p>
                )}
              </div>
            )}

            <div className="pt-3 border-t border-[#20B2AA]/15 flex justify-end">
              <button
                onClick={() => setShowAiMentorDrawer(false)}
                className="px-4 py-2 rounded-xl bg-[#20B2AA] hover:bg-[#3FD1C7] text-[#0D1614] text-xs font-bold"
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
