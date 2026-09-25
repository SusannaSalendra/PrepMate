import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { History, PlayCircle, Sparkles } from 'lucide-react';
import api from '../api/axios';
import SessionSummaryCard from '../components/SessionSummaryCard';
import { CardSkeleton } from '../components/Loader';

export const SessionHistory = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await api.get('/mock-sessions/history');
        if (res.data?.success) {
          setSessions(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load history', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-6 border-b border-[#20B2AA]/15">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#20B2AA]/10 border border-[#20B2AA]/20 text-[#3FD1C7] text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interview Archives</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#F9FBFB] tracking-tight flex items-center gap-3">
            <History className="w-8 h-8 text-[#20B2AA]" />
            <span>Mock Session History</span>
          </h1>
          <p className="text-sm text-[#8EA3A0] mt-1">
            Review your past mock interviews, scores, pacing metrics, and performance trends.
          </p>
        </div>

        <Link
          to="/mock-interview"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#20B2AA] hover:bg-[#3FD1C7] text-[#0D1614] text-xs font-bold shadow-lg shadow-[#20B2AA]/20 transition-all self-start sm:self-auto hover:-translate-y-0.5"
        >
          <PlayCircle className="w-4 h-4" />
          <span>Start New Session</span>
        </Link>
      </div>

      {/* Sessions Grid */}
      {loading ? (
        <CardSkeleton count={3} />
      ) : sessions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => (
            <SessionSummaryCard key={session._id} session={session} />
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-3xl p-12 text-center border border-[#20B2AA]/15 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-[#20B2AA]/10 border border-[#20B2AA]/20 flex items-center justify-center text-[#20B2AA] mx-auto mb-4">
            <History className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-display font-bold text-[#F9FBFB] mb-2">No past sessions found</h3>
          <p className="text-xs text-[#8EA3A0] max-w-sm mx-auto mb-6 leading-relaxed">
            You haven't completed any mock interviews yet. Launch your first session to build confidence and generate actionable analytics.
          </p>
          <Link
            to="/mock-interview"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#20B2AA] hover:bg-[#3FD1C7] text-[#0D1614] text-xs font-bold shadow-lg shadow-[#20B2AA]/20 transition-all hover:-translate-y-0.5"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Launch Your First Mock Interview</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default SessionHistory;
