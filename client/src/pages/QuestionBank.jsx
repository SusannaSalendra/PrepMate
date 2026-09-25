import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, BookOpen, X, Building2 } from 'lucide-react';
import api from '../api/axios';
import QuestionCard from '../components/QuestionCard';
import CategoryFilter from '../components/CategoryFilter';
import Pagination from '../components/Pagination';
import { CardSkeleton } from '../components/Loader';
import { useAuth } from '../context/AuthContext';

export const QuestionBank = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 8,
    total: 0,
    totalPages: 1,
  });

  const { isAuthenticated } = useAuth();

  // Filters from URL search params
  const searchQuery = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category') || 'all';
  const selectedDifficulty = searchParams.get('difficulty') || 'all';
  const selectedCompany = searchParams.get('company') || '';
  const currentPage = parseInt(searchParams.get('page'), 10) || 1;

  // Local state for search input
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [companyInput, setCompanyInput] = useState(selectedCompany);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data?.success) {
          setCategories(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load categories', err);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch questions when query parameters change
  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 8,
      };

      if (searchQuery) params.search = searchQuery;
      if (selectedCategory && selectedCategory !== 'all') params.category = selectedCategory;
      if (selectedDifficulty && selectedDifficulty !== 'all') params.difficulty = selectedDifficulty;
      if (selectedCompany) params.company = selectedCompany;

      const res = await api.get('/questions', { params });
      if (res.data?.success) {
        setQuestions(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error('Failed to load questions', err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, selectedDifficulty, selectedCompany, currentPage]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // Update query params helper
  const updateParams = (newParams) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value && value !== 'all') {
        next.set(key, value);
      } else {
        next.delete(key);
      }
    });
    // Reset page to 1 unless page param was specifically changed
    if (!newParams.page) {
      next.set('page', '1');
    }
    setSearchParams(next);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParams({ search: searchInput, company: companyInput });
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setCompanyInput('');
    setSearchParams({});
  };

  // Toggle bookmark handler
  const handleToggleBookmark = async (questionId) => {
    if (!isAuthenticated) return;

    try {
      const res = await api.post(`/bookmarks/${questionId}`);
      if (res.data?.success) {
        setQuestions((prev) =>
          prev.map((q) =>
            q._id === questionId ? { ...q, isBookmarked: res.data.isBookmarked } : q
          )
        );
      }
    } catch (err) {
      console.error('Bookmark toggle failed', err);
    }
  };

  const hasActiveFilters =
    searchQuery || (selectedCategory && selectedCategory !== 'all') || (selectedDifficulty && selectedDifficulty !== 'all') || selectedCompany;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-medium text-white tracking-tight flex items-center gap-2.5">
              <BookOpen className="w-7 h-7 text-[#20B2AA]" />
              <span>Question Bank</span>
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-400 mt-1">
              Explore comprehensive interview questions curated across top engineering domains
            </p>
          </div>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-charcoal-850 hover:bg-charcoal-800 text-charcoal-200 border border-[#20B2AA]/20 text-xs font-semibold self-start sm:self-center transition-all"
            >
              <X className="w-3.5 h-3.5 text-[#20B2AA]" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card rounded-2xl p-4 sm:p-5 border border-[#20B2AA]/15 mb-8 space-y-4">
        {/* Search Inputs */}
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Keyword Search */}
          <div className="md:col-span-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by keyword, concept, or tag..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-charcoal-900 border border-[#20B2AA]/20 text-white placeholder-charcoal-400 text-xs focus:outline-none focus:border-[#20B2AA] focus:ring-1 focus:ring-[#20B2AA]"
            />
          </div>

          {/* Company Search */}
          <div className="md:col-span-3 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-400">
              <Building2 className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={companyInput}
              onChange={(e) => setCompanyInput(e.target.value)}
              placeholder="Company (e.g. Google, Meta)"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-charcoal-900 border border-[#20B2AA]/20 text-white placeholder-charcoal-400 text-xs focus:outline-none focus:border-[#20B2AA] focus:ring-1 focus:ring-[#20B2AA]"
            />
          </div>

          {/* Difficulty Dropdown */}
          <div className="md:col-span-2">
            <select
              value={selectedDifficulty}
              onChange={(e) => updateParams({ difficulty: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl bg-charcoal-900 border border-[#20B2AA]/20 text-charcoal-200 text-xs font-medium focus:outline-none focus:border-[#20B2AA]"
            >
              <option value="all">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Search Button */}
          <div className="md:col-span-1">
            <button
              type="submit"
              className="w-full h-full min-h-[38px] flex items-center justify-center rounded-xl bg-gradient-to-r from-[#20B2AA] to-[#3FD1C7] text-[#0D1614] font-bold text-xs transition-all shadow-md shadow-[#20B2AA]/20 hover:scale-[1.02]"
            >
              Search
            </button>
          </div>
        </form>

        {/* Category Pills */}
        {!categoriesLoading && (
          <div className="pt-3 border-t border-[#20B2AA]/15">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={(catId) => updateParams({ category: catId })}
            />
          </div>
        )}
      </div>

      {/* Questions List */}
      {loading ? (
        <CardSkeleton count={4} />
      ) : questions.length > 0 ? (
        <div className="space-y-4">
          {questions.map((question) => (
            <QuestionCard
              key={question._id}
              question={question}
              isBookmarked={question.isBookmarked}
              onToggleBookmark={handleToggleBookmark}
            />
          ))}

          {/* Pagination */}
          <Pagination
            pagination={pagination}
            onPageChange={(page) => updateParams({ page })}
          />
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-12 text-center border border-[#20B2AA]/15">
          <BookOpen className="w-12 h-12 text-[#20B2AA]/40 mx-auto mb-3" />
          <h3 className="text-base font-display font-semibold text-white mb-1">No questions found</h3>
          <p className="text-xs text-charcoal-400 max-w-sm mx-auto mb-4">
            Try adjusting your search keywords, difficulty filter, or domain selection.
          </p>
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 rounded-xl bg-[#20B2AA]/15 hover:bg-[#20B2AA]/25 text-[#3FD1C7] border border-[#20B2AA]/30 text-xs font-semibold"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionBank;
