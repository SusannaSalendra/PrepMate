import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  BrainCircuit,
  MessageSquare,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Lightbulb,
  Award,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  Settings,
  Send,
  User,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import api from '../api/axios';
import {
  speakText,
  stopSpeaking,
  createSpeechRecognizer,
  isSpeechRecognitionSupported,
  isSpeechSynthesisSupported,
  playSoundEffect,
} from '../utils/speechUtils';

export const AiMentor = () => {
  // Mode selection: 'interview' (Virtual Interview Simulator) | 'chat' (AI Mentor Voice Q&A)
  const [activeTab, setActiveTab] = useState('interview');

  // Personas
  const personas = [
    {
      id: 'alex',
      name: 'Alex Rivera',
      role: 'Principal Systems Architect',
      company: 'Ex-Google & Meta',
      specialty: 'Algorithms, Data Structures & Distributed Systems',
      gradient: 'from-indigo-600 to-cyan-500',
      tagColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      avatarBg: 'bg-indigo-600',
    },
    {
      id: 'sophia',
      name: 'Sophia Chen',
      role: 'Staff Frontend Architect',
      company: 'Ex-Airbnb & Vercel',
      specialty: 'React, Performance, Web APIs & System Architecture',
      gradient: 'from-pink-600 to-purple-600',
      tagColor: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
      avatarBg: 'bg-pink-600',
    },
    {
      id: 'marcus',
      name: 'Marcus Vance',
      role: 'Director of Engineering',
      company: 'Ex-Stripe',
      specialty: 'Behavioral Leadership, STAR Method & Large Scale Systems',
      gradient: 'from-amber-500 to-orange-600',
      tagColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      avatarBg: 'bg-amber-600',
    },
    {
      id: 'elena',
      name: 'Elena Rostova',
      role: 'Senior Full-Stack Mentor',
      company: 'Tech Career Coach',
      specialty: 'Clear Code Design, Mock Prep & Confidence Building',
      gradient: 'from-emerald-500 to-teal-600',
      tagColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      avatarBg: 'bg-emerald-600',
    },
  ];

  const [selectedPersona, setSelectedPersona] = useState(personas[0]);

  // Questions for Virtual Interview
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [loadingQuestions, setLoadingQuestions] = useState(true);

  // Audio / Speech States
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [sttSupported, setSttSupported] = useState(true);
  const [ttsSupported, setTtsSupported] = useState(true);

  // Candidate Response State
  const [candidateText, setCandidateText] = useState('');
  const [interimText, setInterimText] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [hintText, setHintText] = useState('');
  const [loadingHint, setLoadingHint] = useState(false);
  const [hintLevel, setHintLevel] = useState(1);

  // Session Progress Tracking
  const [completedEvaluations, setCompletedEvaluations] = useState([]);
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  // Free-form Chat Tab State
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'mentor',
      text: `Hello! I'm ${personas[0].name}. Welcome to your AI Mentor Virtual Interview studio. You can speak to me with your microphone or type your questions. Ask me about system design trade-offs, algorithm optimizations, or practice your behavioral STAR responses!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const recognizerRef = useRef(null);
  const chatBottomRef = useRef(null);

  // Check Web Speech API capabilities on mount
  useEffect(() => {
    setSttSupported(isSpeechRecognitionSupported());
    setTtsSupported(isSpeechSynthesisSupported());
  }, []);

  // Fetch curated questions from backend
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoadingQuestions(true);
      try {
        const res = await api.get('/questions?limit=15');
        if (res.data?.success && res.data.data.length > 0) {
          setInterviewQuestions(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load interview questions', err);
      } finally {
        setLoadingQuestions(false);
      }
    };
    fetchQuestions();
  }, []);

  // Initialize Speech Recognizer
  useEffect(() => {
    if (!isSpeechRecognitionSupported()) return;

    recognizerRef.current = createSpeechRecognizer({
      onStart: () => {
        setIsListening(true);
        playSoundEffect('start');
      },
      onResult: (finalTranscript, interim) => {
        setCandidateText((prev) => {
          const combined = (prev ? prev.trim() + ' ' : '') + finalTranscript.trim();
          return combined;
        });
        setInterimText(interim);
      },
      onInterim: (interim) => {
        setInterimText(interim);
      },
      onEnd: () => {
        setIsListening(false);
        setInterimText('');
      },
      onError: (err) => {
        setIsListening(false);
        setInterimText('');
      },
    });

    return () => {
      if (recognizerRef.current) {
        recognizerRef.current.abort();
      }
      stopSpeaking();
    };
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    if (activeTab === 'chat' && chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, activeTab]);

  const currentQuestion = interviewQuestions[currentQIndex] || null;

  // Speak text with AI Interviewer voice
  const handleSpeakAi = (textToSpeak) => {
    if (!voiceEnabled || !textToSpeak) return;

    stopSpeaking();
    setIsAiSpeaking(true);

    speakText(textToSpeak, {
      rate: speechRate,
      onStart: () => setIsAiSpeaking(true),
      onEnd: () => setIsAiSpeaking(false),
      onError: () => setIsAiSpeaking(false),
    });
  };

  // Trigger speech when question changes or user requests
  const handleReadCurrentQuestion = () => {
    if (!currentQuestion) return;
    const prompt = `Here is your interview question: ${currentQuestion.title}. Please explain your technical approach, time and space complexity, and any trade-offs.`;
    handleSpeakAi(prompt);
  };

  // Toggle Voice Recognition (Mic)
  const handleToggleMic = () => {
    if (isAiSpeaking) {
      stopSpeaking();
      setIsAiSpeaking(false);
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

  // Request Hint from AI Mentor
  const handleGetHint = async () => {
    if (!currentQuestion) return;
    setLoadingHint(true);
    try {
      const res = await api.post('/ai-mentor/hint', {
        questionTitle: currentQuestion.title,
        categoryName: currentQuestion.category?.name || 'General',
        hintLevel,
      });

      if (res.data?.success) {
        const hint = res.data.data.hint;
        setHintText(hint);
        setHintLevel((prev) => (prev >= 3 ? 1 : prev + 1));
        if (voiceEnabled) {
          handleSpeakAi(hint);
        }
      }
    } catch (err) {
      console.error('Failed to get hint', err);
    } finally {
      setLoadingHint(false);
    }
  };

  // Submit Answer to AI Mentor for Real-Time Evaluation
  const handleSubmitEvaluation = async () => {
    if (!candidateText.trim() || !currentQuestion) return;

    if (isListening && recognizerRef.current) {
      recognizerRef.current.stop();
      setIsListening(false);
    }

    setIsEvaluating(true);
    try {
      const res = await api.post('/ai-mentor/evaluate', {
        questionTitle: currentQuestion.title,
        questionDescription: currentQuestion.description,
        candidateAnswer: candidateText,
        categoryName: currentQuestion.category?.name || 'Technical',
        difficulty: currentQuestion.difficulty || 'Medium',
        persona: selectedPersona.id,
      });

      if (res.data?.success) {
        const result = res.data.data;
        setEvaluationResult(result);
        playSoundEffect('success');

        // Track in session
        setCompletedEvaluations((prev) => [
          ...prev.filter((item) => item.questionId !== currentQuestion._id),
          {
            questionId: currentQuestion._id,
            questionTitle: currentQuestion.title,
            score: result.score,
            clarity: result.clarityRating,
            strengths: result.strengths,
            improvements: result.areasForImprovement,
            candidateAnswer: candidateText,
          },
        ]);

        if (voiceEnabled && result.spokenMentorFeedback) {
          handleSpeakAi(result.spokenMentorFeedback);
        }
      }
    } catch (err) {
      console.error('Evaluation error', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Switch to next question
  const handleNextQuestion = () => {
    stopSpeaking();
    setIsAiSpeaking(false);
    if (isListening && recognizerRef.current) {
      recognizerRef.current.stop();
      setIsListening(false);
    }

    if (currentQIndex < interviewQuestions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
      setCandidateText('');
      setInterimText('');
      setEvaluationResult(null);
      setHintText('');
      setHintLevel(1);
    } else {
      setShowSummaryModal(true);
    }
  };

  // Send message in Free-form AI Mentor Chat
  const handleSendChatMessage = async (e) => {
    e?.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMsg = {
      sender: 'user',
      text: chatInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setChatLoading(true);

    try {
      const res = await api.post('/ai-mentor/chat', {
        message: userMsg.text,
        persona: selectedPersona.id,
        contextQuestion: currentQuestion,
      });

      if (res.data?.success) {
        const replyText = res.data.data.reply;
        const mentorMsg = {
          sender: 'mentor',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setChatMessages((prev) => [...prev, mentorMsg]);

        if (voiceEnabled) {
          handleSpeakAi(replyText);
        }
      }
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'mentor',
          text: 'I encountered an issue analyzing that prompt. Please try asking again!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const calculateAverageScore = () => {
    if (completedEvaluations.length === 0) return 0;
    const total = completedEvaluations.reduce((sum, item) => sum + item.score, 0);
    return Math.round(total / completedEvaluations.length);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner & Mode Toggle */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Real-time Voice AI Mentor & Virtual Interviewer</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI Virtual Interview & Mentor Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Practice real-time interactive technical interviews with voice synthesis, instant AI scoring, and personalized mentorship.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-inner">
          <button
            onClick={() => {
              stopSpeaking();
              setActiveTab('interview');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'interview'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BrainCircuit className="w-4 h-4" />
            <span>Virtual Interview Simulator</span>
          </button>

          <button
            onClick={() => {
              stopSpeaking();
              setActiveTab('chat');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'chat'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>AI Mentor Voice Chat</span>
          </button>
        </div>
      </div>

      {/* Persona Selection Bar */}
      <div className="mb-8">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Select Your AI Interviewer Persona:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {personas.map((persona) => {
            const isSelected = selectedPersona.id === persona.id;
            return (
              <button
                key={persona.id}
                type="button"
                onClick={() => {
                  stopSpeaking();
                  setSelectedPersona(persona);
                }}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
                  isSelected
                    ? 'bg-slate-900/90 border-indigo-500 ring-2 ring-indigo-500/40 shadow-xl shadow-indigo-500/10'
                    : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-indigo-500/20 to-transparent pointer-events-none" />
                )}
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${persona.gradient} flex items-center justify-center text-white font-bold text-sm shadow-md`}
                  >
                    {persona.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white leading-tight">
                      {persona.name}
                    </h4>
                    <p className="text-[11px] text-indigo-400 font-medium">
                      {persona.company}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                  {persona.specialty}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Global Voice Controls Bar */}
      <div className="p-3.5 rounded-2xl glass-panel border border-slate-800 mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-3 h-3 rounded-full ${
              isAiSpeaking
                ? 'bg-emerald-400 animate-ping'
                : isListening
                ? 'bg-rose-400 animate-pulse'
                : 'bg-slate-500'
            }`}
          />
          <span className="text-xs font-semibold text-slate-300">
            Status:{' '}
            <span className="text-white font-bold">
              {isAiSpeaking
                ? `Speaking (${selectedPersona.name})`
                : isListening
                ? 'Listening to Candidate...'
                : 'Ready for Interview'}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Voice Toggle */}
          <button
            onClick={() => {
              if (voiceEnabled) stopSpeaking();
              setVoiceEnabled(!voiceEnabled);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              voiceEnabled
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4 text-indigo-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            <span>Voice Audio: {voiceEnabled ? 'ON' : 'MUTED'}</span>
          </button>

          {/* Speech Rate Control */}
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <span>Speed:</span>
            {[0.9, 1.0, 1.2].map((rate) => (
              <button
                key={rate}
                onClick={() => setSpeechRate(rate)}
                className={`px-2 py-1 rounded-lg font-mono text-[11px] font-semibold transition-all ${
                  speechRate === rate
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: VIRTUAL INTERVIEW SIMULATOR */}
      {/* ========================================================================= */}
      {activeTab === 'interview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Virtual Interview Stage (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Question Stage Card */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
              {/* Question Header & Action */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Question {currentQIndex + 1} of {interviewQuestions.length || 1}
                  </span>
                  {currentQuestion?.difficulty && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                      {currentQuestion.difficulty}
                    </span>
                  )}
                  {currentQuestion?.company && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      {currentQuestion.company}
                    </span>
                  )}
                </div>

                <button
                  onClick={handleReadCurrentQuestion}
                  disabled={!voiceEnabled}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-cyan-300 transition-all active:scale-95 disabled:opacity-50"
                  title="Ask AI Interviewer to read question aloud"
                >
                  <Volume2 className="w-4 h-4 text-cyan-400" />
                  <span>Read Aloud</span>
                </button>
              </div>

              {/* Question Title */}
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug mb-4">
                {currentQuestion?.title || 'Loading next interview problem...'}
              </h2>

              {/* AI Avatar Speaking Wave Visualizer */}
              {isAiSpeaking && (
                <div className="mb-6 p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center gap-4 animate-in fade-in">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shrink-0 shadow-lg shadow-indigo-500/30 animate-pulse">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div className="flex-grow">
                    <p className="text-xs font-bold text-indigo-300 mb-1">
                      {selectedPersona.name} is speaking...
                    </p>
                    {/* Animated Audio Wave Bars */}
                    <div className="flex items-center gap-1.5 h-6">
                      {[18, 28, 14, 32, 22, 36, 16, 30, 24, 18, 32, 20].map((h, i) => (
                        <div
                          key={i}
                          className="w-1 rounded-full bg-gradient-to-t from-indigo-500 to-cyan-400 animate-pulse"
                          style={{
                            height: `${h}px`,
                            animationDelay: `${i * 80}ms`,
                            animationDuration: '600ms',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={stopSpeaking}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                  >
                    <Pause className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Candidate Voice / Text Area */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <span>Your Spoken Answer / Explanation:</span>
                    {isListening && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                        LIVE MIC RECORDING
                      </span>
                    )}
                  </label>
                  <span className="text-xs text-slate-500">
                    {candidateText.split(/\s+/).filter(Boolean).length} words spoken
                  </span>
                </div>

                <div className="relative">
                  <textarea
                    rows={8}
                    value={candidateText + (interimText ? ` ${interimText}...` : '')}
                    onChange={(e) => setCandidateText(e.target.value)}
                    placeholder="Click the microphone below to speak your technical answer, algorithm complexity, and architecture details, or type here directly..."
                    className={`w-full p-4 rounded-2xl bg-slate-950/80 border text-white placeholder-slate-600 text-sm font-sans focus:outline-none transition-all resize-y ${
                      isListening
                        ? 'border-rose-500 ring-2 ring-rose-500/30 bg-rose-950/10'
                        : 'border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                    }`}
                  />
                </div>

                {/* Candidate Microphone Interactive Control Deck */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-inner">
                  {/* Big Voice Button */}
                  <button
                    type="button"
                    onClick={handleToggleMic}
                    className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl font-extrabold text-sm shadow-xl transition-all active:scale-95 ${
                      isListening
                        ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-rose-600/30 animate-pulse'
                        : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-indigo-600/30 hover:scale-[1.02]'
                    }`}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="w-5 h-5 animate-bounce" />
                        <span>Stop Speaking</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-5 h-5 text-emerald-300" />
                        <span>Speak Your Answer</span>
                      </>
                    )}
                  </button>

                  {/* Actions & Hint Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleGetHint}
                      disabled={loadingHint}
                      className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all disabled:opacity-50"
                      title="Request a progressive hint from the AI mentor"
                    >
                      <Lightbulb className="w-4 h-4 text-amber-400" />
                      <span>{loadingHint ? 'Thinking...' : `Get Hint (Lvl ${hintLevel})`}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCandidateText('')}
                      disabled={!candidateText}
                      className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-semibold disabled:opacity-40"
                    >
                      Clear
                    </button>

                    <button
                      type="button"
                      onClick={handleSubmitEvaluation}
                      disabled={isEvaluating || !candidateText.trim()}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-lg shadow-emerald-600/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isEvaluating ? 'Evaluating with AI...' : 'Submit & Evaluate'}</span>
                    </button>
                  </div>
                </div>

                {/* Hint Display */}
                {hintText && (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs leading-relaxed animate-in fade-in flex items-start gap-3">
                    <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-amber-300 mb-0.5">Mentor Hint:</p>
                      <p>{hintText}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* AI Real-time Evaluation Report */}
            {evaluationResult && (
              <div className="glass-card rounded-3xl p-6 sm:p-8 border border-emerald-500/30 bg-slate-900/80 shadow-2xl animate-in zoom-in-95 duration-300 space-y-6">
                {/* Score Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold mb-2">
                      <Award className="w-3.5 h-3.5 text-emerald-400" />
                      <span>AI Mentor Virtual Interview Evaluation</span>
                    </div>
                    <h3 className="text-xl font-extrabold text-white">
                      Performance Breakdown
                    </h3>
                  </div>

                  {/* Score Meter */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xs text-slate-400 font-medium">Confidence & Depth</p>
                      <p className="text-xs text-emerald-400 font-bold">
                        Clarity: {evaluationResult.clarityRating}
                      </p>
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex flex-col items-center justify-center text-white shadow-lg shadow-emerald-500/25">
                      <span className="text-xl font-extrabold">{evaluationResult.score}</span>
                      <span className="text-[9px] uppercase tracking-wider font-semibold">Score</span>
                    </div>
                  </div>
                </div>

                {/* Spoken Feedback Quote */}
                {evaluationResult.spokenMentorFeedback && (
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shrink-0 shadow">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-indigo-300">
                          {selectedPersona.name}'s Verbal Feedback:
                        </span>
                        <button
                          onClick={() => handleSpeakAi(evaluationResult.spokenMentorFeedback)}
                          className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Replay</span>
                        </button>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                        "{evaluationResult.spokenMentorFeedback}"
                      </p>
                    </div>
                  </div>
                )}

                {/* Keywords Covered */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                    Core Technical Keywords Identified:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {evaluationResult.keyConceptsCovered?.map((kw, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                      >
                        ✓ #{kw}
                      </span>
                    ))}
                    {evaluationResult.keyConceptsCovered?.length === 0 && (
                      <span className="text-xs text-slate-500 italic">
                        No specific algorithmic keywords detected.
                      </span>
                    )}
                  </div>
                </div>

                {/* Strengths & Improvements Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                    <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Key Strengths</span>
                    </h5>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {evaluationResult.strengths?.map((str, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-emerald-400 mt-0.5">•</span>
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                    <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4" />
                      <span>Growth Areas & Suggestions</span>
                    </h5>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {evaluationResult.areasForImprovement?.map((imp, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-amber-400 mt-0.5">•</span>
                          <span>{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Follow-up Question Prompter */}
                {evaluationResult.followUpQuestion && (
                  <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                        <HelpCircle className="w-4 h-4 text-indigo-400" />
                        <span>Live Follow-Up Interview Question:</span>
                      </span>
                      <button
                        onClick={() => handleSpeakAi(evaluationResult.followUpQuestion)}
                        className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Listen</span>
                      </button>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 font-medium">
                      {evaluationResult.followUpQuestion}
                    </p>
                  </div>
                )}

                {/* Next Question CTA */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-end">
                  <button
                    onClick={handleNextQuestion}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs shadow-xl shadow-indigo-600/30 active:scale-95 transition-all"
                  >
                    <span>
                      {currentQIndex < interviewQuestions.length - 1
                        ? 'Next Virtual Interview Question'
                        : 'Complete Session & View Report'}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Interview Progression & Session Summary (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* AI Interviewer Profile Card */}
            <div className="glass-card rounded-3xl p-6 border border-slate-800 text-center relative overflow-hidden">
              <div
                className={`w-20 h-20 rounded-3xl mx-auto mb-4 bg-gradient-to-tr ${selectedPersona.gradient} flex items-center justify-center text-white text-2xl font-extrabold shadow-2xl shadow-indigo-500/20`}
              >
                {selectedPersona.name.charAt(0)}
              </div>
              <h3 className="text-lg font-extrabold text-white">
                {selectedPersona.name}
              </h3>
              <p className="text-xs text-indigo-400 font-semibold mb-1">
                {selectedPersona.role}
              </p>
              <p className="text-[11px] text-slate-400 mb-4">{selectedPersona.company}</p>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-left text-xs text-slate-300 leading-relaxed">
                <span className="font-bold text-slate-200 block mb-1">Interviewing Style:</span>
                {selectedPersona.specialty}
              </div>
            </div>

            {/* Session Roadmap */}
            <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Virtual Session Questions
                </h4>
                <span className="text-xs font-semibold text-indigo-400">
                  {completedEvaluations.length} / {interviewQuestions.length} Evaluated
                </span>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {interviewQuestions.map((q, idx) => {
                  const isCurrent = idx === currentQIndex;
                  const evalItem = completedEvaluations.find(
                    (e) => e.questionId === q._id
                  );

                  return (
                    <button
                      key={q._id || idx}
                      onClick={() => {
                        stopSpeaking();
                        setCurrentQIndex(idx);
                        setCandidateText('');
                        setInterimText('');
                        setEvaluationResult(null);
                        setHintText('');
                      }}
                      className={`w-full p-3 rounded-xl border text-left text-xs flex items-center justify-between gap-2 transition-all ${
                        isCurrent
                          ? 'bg-indigo-600/20 border-indigo-500 text-white font-bold ring-1 ring-indigo-500/40'
                          : evalItem
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <span className="truncate">
                        {idx + 1}. {q.title}
                      </span>
                      {evalItem && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-400 shrink-0">
                          {evalItem.score}%
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {completedEvaluations.length > 0 && (
                <button
                  onClick={() => setShowSummaryModal(true)}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all mt-2"
                >
                  View Full Session Scorecard
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: FREE-FORM AI MENTOR VOICE CHAT */}
      {/* ========================================================================= */}
      {activeTab === 'chat' && (
        <div className="max-w-4xl mx-auto">
          <div className="glass-card rounded-3xl border border-slate-800 shadow-2xl flex flex-col h-[650px] overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${selectedPersona.gradient} flex items-center justify-center text-white font-bold shadow`}
                >
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white leading-tight">
                    {selectedPersona.name}
                  </h3>
                  <p className="text-[11px] text-indigo-400 font-medium">
                    {selectedPersona.role} • Voice Mentor
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">
                  Voice feedback is {voiceEnabled ? 'Active' : 'Muted'}
                </span>
              </div>
            </div>

            {/* Chat Message Stream */}
            <div className="flex-grow p-4 sm:p-6 overflow-y-auto space-y-4">
              {chatMessages.map((msg, idx) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 ${
                      isUser ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0 ${
                        isUser
                          ? 'bg-indigo-600'
                          : `bg-gradient-to-tr ${selectedPersona.gradient}`
                      }`}
                    >
                      {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>

                    <div
                      className={`max-w-[80%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? 'bg-indigo-600 text-white rounded-tr-none shadow-md'
                          : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-md'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <div className="flex items-center justify-between gap-4 mt-2 pt-2 border-t border-white/10 text-[10px] opacity-70">
                        <span>{msg.timestamp}</span>
                        {!isUser && (
                          <button
                            onClick={() => handleSpeakAi(msg.text)}
                            className="hover:opacity-100 flex items-center gap-1 font-semibold text-cyan-400"
                          >
                            <Volume2 className="w-3 h-3" />
                            <span>Listen</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {chatLoading && (
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${selectedPersona.gradient} flex items-center justify-center text-white text-xs font-bold`}
                  >
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-xs flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                    <span>{selectedPersona.name} is composing advice...</span>
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Quick Suggestion Chips */}
            <div className="px-4 py-2 bg-slate-950/40 border-t border-slate-800 flex items-center gap-2 overflow-x-auto text-[11px] text-slate-300">
              <span className="text-slate-500 font-semibold shrink-0">Prompts:</span>
              {[
                'Explain LRU Cache design with Hash Map & Doubly Linked List',
                'How do I answer "Tell me about yourself" using STAR?',
                'What are the key trade-offs between SQL and NoSQL?',
                'Quiz me on React Fiber and Concurrent Mode',
              ].map((promptText, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setChatInput(promptText);
                  }}
                  className="px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 whitespace-nowrap hover:text-white transition-all"
                >
                  {promptText}
                </button>
              ))}
            </div>

            {/* Chat Input Bar */}
            <form
              onSubmit={handleSendChatMessage}
              className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center gap-3"
            >
              <button
                type="button"
                onClick={handleToggleMic}
                className={`p-3 rounded-2xl transition-all ${
                  isListening
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
                title="Speak message with microphone"
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <input
                type="text"
                value={chatInput + (interimText ? ` ${interimText}` : '')}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask your AI mentor anything or speak with your mic..."
                className="flex-grow py-3 px-4 rounded-2xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />

              <button
                type="submit"
                disabled={!chatInput.trim() || chatLoading}
                className="p-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SESSION SUMMARY REPORT MODAL */}
      {/* ========================================================================= */}
      {showSummaryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-700 max-w-2xl w-full bg-slate-950 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="text-center pb-6 border-b border-slate-800">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-emerald-500/25">
                <Award className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-extrabold text-white">
                Virtual Interview Performance Report
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Conducted by AI Interviewer {selectedPersona.name}
              </p>
            </div>

            {/* Scorecard Gauge */}
            <div className="my-6 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-around text-center">
              <div>
                <p className="text-3xl font-extrabold text-emerald-400">
                  {calculateAverageScore()}%
                </p>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">
                  Overall Interview Score
                </p>
              </div>
              <div className="h-10 w-px bg-slate-800" />
              <div>
                <p className="text-3xl font-extrabold text-indigo-400">
                  {completedEvaluations.length}
                </p>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">
                  Questions Evaluated
                </p>
              </div>
            </div>

            {/* Question Breakdown List */}
            <div className="space-y-3 mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Detailed Question Scores:
              </h4>
              {completedEvaluations.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-slate-200">{item.questionTitle}</p>
                    <p className="text-[11px] text-slate-400">
                      Clarity Rating: <span className="text-indigo-400">{item.clarity}</span>
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {item.score}%
                  </span>
                </div>
              ))}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setShowSummaryModal(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
              >
                Close Report
              </button>
              <button
                onClick={() => {
                  setShowSummaryModal(false);
                  setCurrentQIndex(0);
                  setCompletedEvaluations([]);
                  setCandidateText('');
                  setEvaluationResult(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30"
              >
                Start New Simulation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiMentor;
