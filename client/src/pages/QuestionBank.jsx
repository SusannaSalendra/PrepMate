import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, BookOpen, Layers, X, Sparkles, Building2 } from 'lucide-react';
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
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <BookOpen className="w-7 h-7 text-indigo-400" />
              <span>Question Bank</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Explore comprehensive interview questions curated across top engineering categories
            </p>
          </div>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold self-start sm:self-center transition-all"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-800 mb-8 space-y-4">
        {/* Search Inputs */}
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Keyword Search */}
          <div className="md:col-span-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by keyword, concept, or tag..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Company Search */}
          <div className="md:col-span-3 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Building2 className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={companyInput}
              onChange={(e) => setCompanyInput(e.target.value)}
              placeholder="Company (e.g. Google, Meta)"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Difficulty Dropdown */}
          <div className="md:col-span-2">
            <select
              value={selectedDifficulty}
              onChange={(e) => updateParams({ difficulty: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs font-medium focus:outline-none focus:border-indigo-500"
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
              className="w-full h-full min-h-[38px] flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/20"
            >
              Search
            </button>
          </div>
        </form>

        {/* Category Pills */}
        {!categoriesLoading && (
          <div className="pt-3 border-t border-slate-800/80">
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
        <div className="glass-card rounded-2xl p-12 text-center border border-slate-800">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No questions found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            Try adjusting your search keywords, difficulty filter, or category selection.
          </p>
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionBank;
