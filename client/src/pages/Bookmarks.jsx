import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Search, BookOpen, Sparkles } from 'lucide-react';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-6 border-b border-[#20B2AA]/15">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#20B2AA]/10 border border-[#20B2AA]/20 text-[#3FD1C7] text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Saved Problems</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#F9FBFB] tracking-tight flex items-center gap-3">
            <Bookmark className="w-8 h-8 text-[#20B2AA] fill-[#20B2AA]" />
            <span>My Bookmarks</span>
          </h1>
          <p className="text-sm text-[#8EA3A0] mt-1">
            Review and practice the technical questions you've saved for focused study.
          </p>
        </div>

        {bookmarks.length > 0 && (
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8EA3A0]">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter saved problems..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#10201D] border border-[#20B2AA]/20 text-[#F1F3F2] placeholder-[#8EA3A0]/60 text-xs focus:outline-none focus:border-[#20B2AA] focus:ring-1 focus:ring-[#20B2AA] transition-all"
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
        <div className="glass-card rounded-3xl p-12 text-center border border-[#20B2AA]/15 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-[#20B2AA]/10 border border-[#20B2AA]/20 flex items-center justify-center text-[#20B2AA] mx-auto mb-4">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-display font-bold text-[#F9FBFB] mb-2">
            {searchFilter ? 'No matching saved questions' : 'No bookmarks saved yet'}
          </h3>
          <p className="text-xs text-[#8EA3A0] max-w-sm mx-auto mb-6 leading-relaxed">
            {searchFilter
              ? 'Try adjusting your search keyword to find the saved problem.'
              : 'Save interesting or challenging interview problems while browsing the question bank to review them here anytime.'}
          </p>
          <Link
            to="/questions"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#20B2AA] hover:bg-[#3FD1C7] text-[#0D1614] text-xs font-bold shadow-lg shadow-[#20B2AA]/20 transition-all hover:-translate-y-0.5"
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
