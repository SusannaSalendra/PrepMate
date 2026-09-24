import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Search, BookOpen, Trash2, ArrowRight } from 'lucide-react';
import api from '../api/axios';
import QuestionCard from '../components/QuestionCard';
import { CardSkeleton } from '../components/Loader';

export const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bookmarks');
      if (res.data?.success) {
        setBookmarks(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load bookmarks', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleToggleBookmark = async (questionId) => {
    try {
      const res = await api.post(`/bookmarks/${questionId}`);
      if (res.data?.success) {
        // Remove from list if unbookmarked
        setBookmarks((prev) => prev.filter((b) => b.question._id !== questionId));
      }
    } catch (err) {
      console.error('Failed to remove bookmark', err);
    }
  };

  const filteredBookmarks = bookmarks.filter((b) => {
    if (!searchFilter.trim()) return true;
    const query = searchFilter.toLowerCase();
    const title = b.question?.title?.toLowerCase() || '';
    const company = b.question?.company?.toLowerCase() || '';
    const catName = b.question?.category?.name?.toLowerCase() || '';
    return title.includes(query) || company.includes(query) || catName.includes(query);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Bookmark className="w-7 h-7 text-amber-400 fill-amber-400" />
            <span>My Saved Bookmarks</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Review and practice the questions you've saved for later study
          </p>
        </div>

        {bookmarks.length > 0 && (
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter saved questions..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
        )}
      </div>

      {/* Bookmarks List */}
      {loading ? (
        <CardSkeleton count={3} />
      ) : filteredBookmarks.length > 0 ? (
        <div className="space-y-4">
          {filteredBookmarks.map((b) => (
            <QuestionCard
              key={b._id}
              question={b.question}
              isBookmarked={true}
              onToggleBookmark={handleToggleBookmark}
            />
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-3xl p-12 text-center border border-slate-800">
          <Bookmark className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">
            {searchFilter ? 'No matching saved questions' : 'No bookmarks saved yet'}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
            {searchFilter
              ? 'Try adjusting your search keyword.'
              : 'Save interesting or difficult interview problems while browsing the question bank to review them here anytime.'}
          </p>
          <Link
            to="/questions"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-500/25 transition-all"
          >
            <BookOpen className="w-4 h-4" />
            <span>Browse Question Bank</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
