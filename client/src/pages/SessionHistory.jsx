import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { History, PlayCircle, Clock, Star, Award, CheckCircle } from 'lucide-react';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <History className="w-7 h-7 text-cyan-400" />
            <span>Mock Session History</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Review your past mock interviews, scores, and performance trends
          </p>
        </div>

        <Link
          to="/mock-interview"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 transition-all self-start sm:self-center"
        >
          <PlayCircle className="w-4 h-4 text-emerald-300" />
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
        <div className="glass-card rounded-3xl p-12 text-center border border-slate-800">
          <History className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No past sessions found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
            You haven't completed any mock interviews yet. Launch your first session to build confidence and generate analytics.
          </p>
          <Link
            to="/mock-interview"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/25 transition-all"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Start Your First Mock Interview</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default SessionHistory;
