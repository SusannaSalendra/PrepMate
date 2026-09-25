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
  Pause,
  CheckCircle2,
  Lightbulb,
  Award,
  ChevronRight,
  TrendingUp,
  HelpCircle,
  Send,
  User,
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
  const [activeTab, setActiveTab] = useState('interview');

  // Personas with monochromatic sea-green styling
  const personas = [
    {
      id: 'alex',
      name: 'Alex Rivera',
      role: 'Principal Systems Architect',
      company: 'Ex-Google & Meta',
      specialty: 'Algorithms, Data Structures & Distributed Systems',
      gradient: 'from-[#20B2AA] to-[#0E6E68]',
      tagColor: 'bg-[#20B2AA]/15 text-[#3FD1C7] border-[#20B2AA]/30',
    },
    {
      id: 'sophia',
      name: 'Sophia Chen',
      role: 'Staff Frontend Architect',
      company: 'Ex-Airbnb & Vercel',
      specialty: 'React, Performance, Web APIs & System Architecture',
      gradient: 'from-[#3FD1C7] to-[#17847E]',
      tagColor: 'bg-[#20B2AA]/15 text-[#3FD1C7] border-[#20B2AA]/30',
    },
    {
      id: 'marcus',
      name: 'Marcus Vance',
      role: 'Director of Engineering',
      company: 'Ex-Stripe',
      specialty: 'Behavioral Leadership, STAR Method & Reliability',
      gradient: 'from-[#17847E] to-[#0F4A46]',
      tagColor: 'bg-[#20B2AA]/15 text-[#3FD1C7] border-[#20B2AA]/30',
    },
    {
      id: 'elena',
      name: 'Elena Rostova',
      role: 'Senior Full-Stack Mentor',
      company: 'Tech Career Coach',
      specialty: 'Clear Code Design, Mock Prep & Confidence Building',
      gradient: 'from-[#20B2AA] to-[#072B28]',
      tagColor: 'bg-[#20B2AA]/15 text-[#3FD1C7] border-[#20B2AA]/30',
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
      text: `Hello! I'm ${personas[0].name}. Welcome to your AI Mentor Virtual Interview studio. Speak with your microphone or type questions. Ask me about system design trade-offs, algorithm optimizations, or practice your behavioral STAR responses!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const recognizerRef = useRef(null);
  const chatBottomRef = useRef(null);

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
      onError: () => {
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
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#20B2AA]/15">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#20B2AA]/10 border border-[#20B2AA]/30 text-[#3FD1C7] text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#20B2AA]" />
            <span>Real-time Voice AI Mentor & Virtual Interviewer</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-medium text-white tracking-tight">
            AI Virtual Interview & Mentor Studio
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-400 mt-1">
            Practice real-time interactive technical interviews with voice synthesis, instant Big-O scoring, and personalized mentorship.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-charcoal-850 border border-[#20B2AA]/15 shadow-inner">
          <button
            onClick={() => {
              stopSpeaking();
              setActiveTab('interview');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'interview'
                ? 'bg-[#20B2AA] text-[#0D1614] shadow-md shadow-[#20B2AA]/20'
                : 'text-charcoal-400 hover:text-white'
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
                ? 'bg-[#20B2AA] text-[#0D1614] shadow-md shadow-[#20B2AA]/20'
                : 'text-charcoal-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>AI Mentor Voice Chat</span>
          </button>
        </div>
      </div>

      {/* Persona Selection Bar */}
      <div className="mb-8">
        <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-400 mb-3 font-mono">
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
                    ? 'bg-charcoal-850 border-[#20B2AA] ring-1 ring-[#20B2AA]/40 shadow-xl shadow-[#20B2AA]/10'
                    : 'bg-charcoal-900 border-[#20B2AA]/15 hover:bg-charcoal-850 hover:border-[#20B2AA]/30'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${persona.gradient} flex items-center justify-center text-[#0D1614] font-bold text-sm shadow`}
                  >
                    {persona.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold font-display text-white leading-tight">
                      {persona.name}
                    </h4>
                    <p className="text-[10px] text-[#3FD1C7] font-medium">
                      {persona.company}
                    </p>
                  </div>
                </div>
                <p className="text-[11px] text-charcoal-400 line-clamp-2 mt-1">
                  {persona.specialty}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Global Voice Controls Bar */}
      <div className="p-3.5 rounded-2xl glass-panel border border-[#20B2AA]/15 mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-3 h-3 rounded-full ${
              isAiSpeaking
                ? 'bg-[#3FD1C7] animate-ping'
                : isListening
                ? 'bg-[#20B2AA] animate-pulse'
                : 'bg-charcoal-600'
            }`}
          />
          <span className="text-xs font-semibold text-charcoal-200 font-mono">
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
                ? 'bg-[#20B2AA]/15 text-[#3FD1C7] border-[#20B2AA]/30'
                : 'bg-charcoal-850 text-charcoal-400 border-charcoal-700'
            }`}
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4 text-[#20B2AA]" /> : <VolumeX className="w-4 h-4 text-charcoal-400" />}
            <span>Voice Audio: {voiceEnabled ? 'ON' : 'MUTED'}</span>
          </button>

          {/* Speech Rate Control */}
          <div className="flex items-center gap-1 text-xs text-charcoal-400">
            <span>Speed:</span>
            {[0.9, 1.0, 1.2].map((rate) => (
              <button
                key={rate}
                onClick={() => setSpeechRate(rate)}
                className={`px-2 py-1 rounded-lg font-mono text-[11px] font-semibold transition-all ${
                  speechRate === rate
                    ? 'bg-[#20B2AA] text-[#0D1614]'
                    : 'bg-charcoal-850 text-charcoal-400 hover:text-white'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TAB 1: VIRTUAL INTERVIEW SIMULATOR */}
      {activeTab === 'interview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Virtual Interview Stage (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Question Stage Card */}
            <div className="glass-card rounded-2xl p-6 sm:p-8 border border-[#20B2AA]/15 shadow-2xl relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-0.5 rounded-xl text-xs font-bold bg-[#20B2AA]/15 text-[#3FD1C7] border border-[#20B2AA]/30">
                    Question {currentQIndex + 1} of {interviewQuestions.length || 1}
                  </span>
                  {currentQuestion?.difficulty && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-charcoal-850 text-charcoal-200 border border-[#20B2AA]/15">
                      {currentQuestion.difficulty}
                    </span>
                  )}
                  {currentQuestion?.company && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#20B2AA]/10 text-[#3FD1C7] border border-[#20B2AA]/20">
                      {currentQuestion.company}
                    </span>
                  )}
                </div>

                <button
                  onClick={handleReadCurrentQuestion}
                  disabled={!voiceEnabled}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-charcoal-850 hover:bg-charcoal-800 border border-[#20B2AA]/20 text-xs font-semibold text-[#3FD1C7] transition-all disabled:opacity-50"
                  title="Ask AI Interviewer to read question aloud"
                >
                  <Volume2 className="w-4 h-4 text-[#20B2AA]" />
                  <span>Read Aloud</span>
                </button>
              </div>

              {/* Question Title */}
              <h2 className="text-xl sm:text-2xl font-display font-medium text-white tracking-tight leading-snug mb-4">
                {currentQuestion?.title || 'Loading next interview problem...'}
              </h2>

              {/* AI Avatar Speaking Wave Visualizer */}
              {isAiSpeaking && (
                <div className="mb-6 p-4 rounded-2xl bg-[#081A18] border border-[#20B2AA]/30 flex items-center gap-4 animate-in fade-in">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#20B2AA] to-[#0E6E68] flex items-center justify-center text-[#0D1614] font-bold shrink-0 shadow-lg shadow-[#20B2AA]/20 animate-pulse">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div className="flex-grow">
                    <p className="text-xs font-bold text-[#3FD1C7] mb-1">
                      {selectedPersona.name} is speaking...
                    </p>
                    {/* Animated Audio Wave Bars in Sea Green */}
                    <div className="flex items-center gap-1.5 h-6">
                      {[18, 28, 14, 32, 22, 36, 16, 30, 24, 18, 32, 20].map((h, i) => (
                        <div
                          key={i}
                          className="w-1 rounded-full bg-gradient-to-t from-[#20B2AA] to-[#3FD1C7] animate-pulse"
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
                    className="p-2 rounded-xl bg-charcoal-850 hover:bg-charcoal-800 text-charcoal-200 text-xs font-semibold"
                  >
                    <Pause className="w-4 h-4 text-[#20B2AA]" />
                  </button>
                </div>
              )}

              {/* Candidate Voice / Text Area */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-charcoal-200 flex items-center gap-2 font-mono">
                    <span>Your Spoken Answer / Explanation:</span>
                    {isListening && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#20B2AA]/20 text-[#3FD1C7] border border-[#20B2AA]/30 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#20B2AA]" />
                        RECORDING
                      </span>
                    )}
                  </label>
                  <span className="text-xs text-charcoal-400 font-mono">
                    {candidateText.split(/\s+/).filter(Boolean).length} words
                  </span>
                </div>

                <div className="relative">
                  <textarea
                    rows={8}
                    value={candidateText + (interimText ? ` ${interimText}...` : '')}
                    onChange={(e) => setCandidateText(e.target.value)}
                    placeholder="Click the microphone below to speak your technical answer, algorithm complexity, and architecture details, or type here directly..."
                    className={`w-full p-4 rounded-2xl bg-charcoal-900 border text-white placeholder-charcoal-400 text-xs sm:text-sm font-sans focus:outline-none transition-all resize-y ${
                      isListening
                        ? 'border-[#20B2AA] ring-2 ring-[#20B2AA]/30 bg-[#081A18]'
                        : 'border-[#20B2AA]/20 focus:border-[#20B2AA] focus:ring-1 focus:ring-[#20B2AA]'
                    }`}
                  />
                </div>

                {/* Candidate Microphone Interactive Control Deck */}
                <div className="p-4 rounded-2xl bg-charcoal-850 border border-[#20B2AA]/15 flex flex-wrap items-center justify-between gap-4 shadow-inner">
                  {/* Big Voice Button */}
                  <button
                    type="button"
                    onClick={handleToggleMic}
                    className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-xs shadow-lg transition-all active:scale-95 ${
                      isListening
                        ? 'bg-[#0E6E68] text-white border border-[#20B2AA] animate-pulse shadow-[#20B2AA]/20'
                        : 'bg-gradient-to-r from-[#20B2AA] to-[#3FD1C7] text-[#0D1614] shadow-[#20B2AA]/20 hover:scale-[1.02]'
                    }`}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="w-4 h-4" />
                        <span>Stop Recording</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4" />
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
                      className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#20B2AA]/10 hover:bg-[#20B2AA]/20 text-[#3FD1C7] border border-[#20B2AA]/30 text-xs font-semibold transition-all disabled:opacity-50"
                      title="Request a progressive hint from the AI mentor"
                    >
                      <Lightbulb className="w-4 h-4 text-[#20B2AA]" />
                      <span>{loadingHint ? 'Thinking...' : `Hint (Lvl ${hintLevel})`}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCandidateText('')}
                      disabled={!candidateText}
                      className="px-3 py-2.5 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-charcoal-400 hover:text-white text-xs font-semibold disabled:opacity-40"
                    >
                      Clear
                    </button>

                    <button
                      type="button"
                      onClick={handleSubmitEvaluation}
                      disabled={isEvaluating || !candidateText.trim()}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#20B2AA] hover:bg-[#3FD1C7] text-[#0D1614] text-xs font-bold shadow-md shadow-[#20B2AA]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isEvaluating ? 'Evaluating...' : 'Submit & Evaluate'}</span>
                    </button>
                  </div>
                </div>

                {/* Hint Display */}
                {hintText && (
                  <div className="p-4 rounded-2xl bg-[#081A18] border border-[#20B2AA]/30 text-charcoal-100 text-xs leading-relaxed animate-in fade-in flex items-start gap-3">
                    <Lightbulb className="w-4 h-4 text-[#20B2AA] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-[#3FD1C7] mb-0.5 font-display">Mentor Hint:</p>
                      <p>{hintText}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* AI Real-time Evaluation Report */}
            {evaluationResult && (
              <div className="glass-card rounded-2xl p-6 sm:p-8 border border-[#20B2AA]/30 bg-charcoal-850 shadow-2xl animate-in zoom-in-95 duration-300 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#20B2AA]/15">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#20B2AA]/15 text-[#3FD1C7] border border-[#20B2AA]/30 text-xs font-bold mb-2">
                      <Award className="w-3.5 h-3.5 text-[#20B2AA]" />
                      <span>AI Mentor Virtual Interview Evaluation</span>
                    </div>
                    <h3 className="text-xl font-display font-medium text-white">
                      Performance Breakdown
                    </h3>
                  </div>

                  {/* Score Meter */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xs text-charcoal-400 font-medium">Confidence & Depth</p>
                      <p className="text-xs text-[#3FD1C7] font-bold">
                        Clarity: {evaluationResult.clarityRating}
                      </p>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#20B2AA] to-[#0E6E68] flex flex-col items-center justify-center text-[#0D1614] shadow-lg shadow-[#20B2AA]/20">
                      <span className="text-lg font-bold font-display">{evaluationResult.score}</span>
                      <span className="text-[8px] uppercase tracking-wider font-semibold">Score</span>
                    </div>
                  </div>
                </div>

                {/* Spoken Feedback Quote */}
                {evaluationResult.spokenMentorFeedback && (
                  <div className="p-4 rounded-2xl bg-charcoal-900 border border-[#20B2AA]/20 flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-xl bg-[#20B2AA] flex items-center justify-center text-[#0D1614] font-bold shrink-0 shadow">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-[#3FD1C7]">
                          {selectedPersona.name}'s Verbal Feedback:
                        </span>
                        <button
                          onClick={() => handleSpeakAi(evaluationResult.spokenMentorFeedback)}
                          className="text-[11px] text-[#20B2AA] hover:text-[#3FD1C7] font-semibold flex items-center gap-1"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Replay</span>
                        </button>
                      </div>
                      <p className="text-xs text-charcoal-200 leading-relaxed italic">
                        "{evaluationResult.spokenMentorFeedback}"
                      </p>
                    </div>
                  </div>
                )}

                {/* Keywords Covered */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-400 mb-2.5 font-mono">
                    Core Technical Keywords Identified:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {evaluationResult.keyConceptsCovered?.map((kw, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-xl text-xs font-medium bg-[#20B2AA]/15 text-[#3FD1C7] border border-[#20B2AA]/30"
                      >
                        ✓ #{kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Strengths & Improvements Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-charcoal-900 border border-[#20B2AA]/15">
                    <h5 className="text-xs font-bold text-[#3FD1C7] uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono">
                      <CheckCircle2 className="w-4 h-4 text-[#20B2AA]" />
                      <span>Key Strengths</span>
                    </h5>
                    <ul className="space-y-1.5 text-xs text-charcoal-200">
                      {evaluationResult.strengths?.map((str, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-[#20B2AA] mt-0.5">•</span>
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-charcoal-900 border border-[#20B2AA]/15">
                    <h5 className="text-xs font-bold text-charcoal-200 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono">
                      <TrendingUp className="w-4 h-4 text-[#20B2AA]" />
                      <span>Growth Areas</span>
                    </h5>
                    <ul className="space-y-1.5 text-xs text-charcoal-300">
                      {evaluationResult.areasForImprovement?.map((imp, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-[#20B2AA] mt-0.5">•</span>
                          <span>{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Follow-up Question Prompter */}
                {evaluationResult.followUpQuestion && (
                  <div className="p-4 rounded-2xl bg-[#081A18] border border-[#20B2AA]/25">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-[#3FD1C7] uppercase tracking-wider flex items-center gap-1.5 font-mono">
                        <HelpCircle className="w-4 h-4 text-[#20B2AA]" />
                        <span>Follow-Up Interview Question:</span>
                      </span>
                      <button
                        onClick={() => handleSpeakAi(evaluationResult.followUpQuestion)}
                        className="text-[11px] text-[#20B2AA] hover:text-[#3FD1C7] font-semibold flex items-center gap-1"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Listen</span>
                      </button>
                    </div>
                    <p className="text-xs text-charcoal-100 font-medium">
                      {evaluationResult.followUpQuestion}
                    </p>
                  </div>
                )}

                {/* Next Question CTA */}
                <div className="pt-4 border-t border-[#20B2AA]/15 flex items-center justify-end">
                  <button
                    onClick={handleNextQuestion}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#20B2AA] to-[#3FD1C7] hover:from-[#3FD1C7] hover:to-[#20B2AA] text-[#0D1614] font-bold text-xs shadow-lg shadow-[#20B2AA]/20 active:scale-95 transition-all"
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

          {/* Right Column: Roadmap (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* AI Interviewer Profile Card */}
            <div className="glass-card rounded-2xl p-6 border border-[#20B2AA]/15 text-center relative overflow-hidden">
              <div
                className={`w-16 h-16 rounded-2xl mx-auto mb-3 bg-gradient-to-tr ${selectedPersona.gradient} flex items-center justify-center text-[#0D1614] text-xl font-bold shadow-lg shadow-[#20B2AA]/20`}
              >
                {selectedPersona.name.charAt(0)}
              </div>
              <h3 className="text-base font-display font-medium text-white">
                {selectedPersona.name}
              </h3>
              <p className="text-xs text-[#3FD1C7] font-semibold mb-1">
                {selectedPersona.role}
              </p>
              <p className="text-[11px] text-charcoal-400 mb-4">{selectedPersona.company}</p>

              <div className="p-3 rounded-xl bg-charcoal-900 border border-[#20B2AA]/15 text-left text-xs text-charcoal-300 leading-relaxed">
                <span className="font-bold text-white block mb-1 font-display">Interviewing Focus:</span>
                {selectedPersona.specialty}
              </div>
            </div>

            {/* Session Roadmap */}
            <div className="glass-card rounded-2xl p-6 border border-[#20B2AA]/15 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-400 font-mono">
                  Session Questions
                </h4>
                <span className="text-xs font-semibold text-[#3FD1C7] font-mono">
                  {completedEvaluations.length} / {interviewQuestions.length} Done
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
                      className={`w-full p-2.5 rounded-xl border text-left text-xs flex items-center justify-between gap-2 transition-all ${
                        isCurrent
                          ? 'bg-[#20B2AA]/20 border-[#20B2AA] text-white font-bold ring-1 ring-[#20B2AA]/40'
                          : evalItem
                          ? 'bg-[#081A18] border-[#20B2AA]/30 text-[#3FD1C7]'
                          : 'bg-charcoal-850 border-[#20B2AA]/10 text-charcoal-400 hover:text-white hover:bg-charcoal-800'
                      }`}
                    >
                      <span className="truncate">
                        {idx + 1}. {q.title}
                      </span>
                      {evalItem && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#20B2AA]/20 text-[#3FD1C7] shrink-0 font-mono">
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
                  className="w-full py-2.5 rounded-xl bg-charcoal-850 hover:bg-charcoal-800 text-charcoal-100 text-xs font-bold border border-[#20B2AA]/20 transition-all mt-2"
                >
                  View Full Scorecard
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FREE-FORM AI MENTOR CHAT */}
      {activeTab === 'chat' && (
        <div className="max-w-4xl mx-auto">
          <div className="glass-card rounded-2xl border border-[#20B2AA]/15 shadow-2xl flex flex-col h-[650px] overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 sm:p-5 border-b border-[#20B2AA]/15 bg-charcoal-900 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${selectedPersona.gradient} flex items-center justify-center text-[#0D1614] font-bold shadow`}
                >
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-display text-white leading-tight">
                    {selectedPersona.name}
                  </h3>
                  <p className="text-[11px] text-[#3FD1C7] font-medium font-mono">
                    {selectedPersona.role} • Voice Mentor
                  </p>
                </div>
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
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                        isUser
                          ? 'bg-[#20B2AA] text-[#0D1614]'
                          : `bg-gradient-to-tr ${selectedPersona.gradient} text-[#0D1614]`
                      }`}
                    >
                      {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>

                    <div
                      className={`max-w-[80%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? 'bg-[#20B2AA] text-[#0D1614] font-medium rounded-tr-none shadow-md'
                          : 'bg-charcoal-850 border border-[#20B2AA]/20 text-charcoal-100 rounded-tl-none shadow-md'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <div className="flex items-center justify-between gap-4 mt-2 pt-2 border-t border-black/10 text-[10px] opacity-70">
                        <span className="font-mono">{msg.timestamp}</span>
                        {!isUser && (
                          <button
                            onClick={() => handleSpeakAi(msg.text)}
                            className="hover:opacity-100 flex items-center gap-1 font-semibold text-[#3FD1C7]"
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
                    className={`w-7 h-7 rounded-xl bg-gradient-to-tr ${selectedPersona.gradient} flex items-center justify-center text-[#0D1614] text-xs font-bold`}
                  >
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="p-3.5 rounded-2xl bg-charcoal-850 border border-[#20B2AA]/15 text-charcoal-300 text-xs flex items-center gap-2 font-mono">
                    <span className="w-2 h-2 rounded-full bg-[#20B2AA] animate-ping" />
                    <span>{selectedPersona.name} is formulating advice...</span>
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Quick Suggestion Chips */}
            <div className="px-4 py-2 bg-charcoal-900 border-t border-[#20B2AA]/15 flex items-center gap-2 overflow-x-auto text-[11px]">
              <span className="text-charcoal-400 font-semibold shrink-0 font-mono">Prompts:</span>
              {[
                'Explain LRU Cache design with Hash Map & Doubly Linked List',
                'How do I answer "Tell me about yourself" using STAR?',
                'What are the key trade-offs between SQL and NoSQL?',
                'Quiz me on React Fiber and Concurrent Mode',
              ].map((promptText, i) => (
                <button
                  key={i}
                  onClick={() => setChatInput(promptText)}
                  className="px-3 py-1 rounded-xl bg-charcoal-850 hover:bg-charcoal-800 border border-[#20B2AA]/15 text-charcoal-300 whitespace-nowrap hover:text-white transition-all"
                >
                  {promptText}
                </button>
              ))}
            </div>

            {/* Chat Input Bar */}
            <form
              onSubmit={handleSendChatMessage}
              className="p-4 bg-charcoal-900 border-t border-[#20B2AA]/15 flex items-center gap-3"
            >
              <button
                type="button"
                onClick={handleToggleMic}
                className={`p-3 rounded-xl transition-all ${
                  isListening
                    ? 'bg-[#0E6E68] text-white animate-pulse'
                    : 'bg-charcoal-850 text-charcoal-300 hover:text-white border border-[#20B2AA]/20'
                }`}
                title="Speak message with microphone"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-[#20B2AA]" />}
              </button>

              <input
                type="text"
                value={chatInput + (interimText ? ` ${interimText}` : '')}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask your AI mentor anything or speak with your mic..."
                className="flex-grow py-2.5 px-4 rounded-xl bg-charcoal-850 border border-[#20B2AA]/20 text-white placeholder-charcoal-400 text-xs sm:text-sm focus:outline-none focus:border-[#20B2AA]"
              />

              <button
                type="submit"
                disabled={!chatInput.trim() || chatLoading}
                className="p-2.5 rounded-xl bg-[#20B2AA] hover:bg-[#3FD1C7] text-[#0D1614] disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#20B2AA]/20 transition-all active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SESSION SUMMARY REPORT MODAL */}
      {showSummaryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-[#20B2AA]/30 max-w-2xl w-full bg-[#0D1614] max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="text-center pb-6 border-b border-[#20B2AA]/15">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#20B2AA] to-[#0E6E68] flex items-center justify-center text-[#0D1614] mx-auto mb-3 shadow-lg shadow-[#20B2AA]/20">
                <Award className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-display font-medium text-white">
                Virtual Interview Performance Report
              </h2>
              <p className="text-xs text-charcoal-400 mt-1">
                Conducted by AI Interviewer {selectedPersona.name}
              </p>
            </div>

            {/* Scorecard Gauge */}
            <div className="my-6 p-6 rounded-2xl bg-charcoal-850 border border-[#20B2AA]/20 flex items-center justify-around text-center">
              <div>
                <p className="text-3xl font-display font-bold text-[#20B2AA]">
                  {calculateAverageScore()}%
                </p>
                <p className="text-xs font-semibold text-charcoal-400 mt-0.5">
                  Overall Interview Score
                </p>
              </div>
              <div className="h-10 w-px bg-[#20B2AA]/15" />
              <div>
                <p className="text-3xl font-display font-bold text-[#3FD1C7]">
                  {completedEvaluations.length}
                </p>
                <p className="text-xs font-semibold text-charcoal-400 mt-0.5">
                  Questions Evaluated
                </p>
              </div>
            </div>

            {/* Question Breakdown List */}
            <div className="space-y-3 mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-400 font-mono">
                Detailed Question Scores:
              </h4>
              {completedEvaluations.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-charcoal-850 border border-[#20B2AA]/15 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-white font-display">{item.questionTitle}</p>
                    <p className="text-[11px] text-charcoal-400">
                      Clarity Rating: <span className="text-[#3FD1C7]">{item.clarity}</span>
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-xl text-xs font-bold bg-[#20B2AA]/20 text-[#3FD1C7] border border-[#20B2AA]/30 font-mono">
                    {item.score}%
                  </span>
                </div>
              ))}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#20B2AA]/15">
              <button
                onClick={() => setShowSummaryModal(false)}
                className="px-5 py-2.5 rounded-xl bg-charcoal-850 hover:bg-charcoal-800 text-charcoal-200 text-xs font-bold border border-[#20B2AA]/15"
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
                className="px-5 py-2.5 rounded-xl bg-[#20B2AA] hover:bg-[#3FD1C7] text-[#0D1614] text-xs font-bold shadow-md shadow-[#20B2AA]/25"
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
