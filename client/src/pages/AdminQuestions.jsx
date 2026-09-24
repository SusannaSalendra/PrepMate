import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  BookOpen,
  X,
  Check,
  AlertCircle,
  Building2,
  Tag,
} from 'lucide-react';
import api from '../api/axios';
import { Loader } from '../components/Loader';

export const AdminQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'Medium',
    company: '',
    tags: '',
  });
  const [formError, setFormError] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [qRes, catRes] = await Promise.all([
        api.get('/questions?limit=100'),
        api.get('/categories'),
      ]);

      if (qRes.data?.success) setQuestions(qRes.data.data);
      if (catRes.data?.success) setCategories(catRes.data.data);
    } catch (err) {
      console.error('Failed to load admin question data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setEditingQuestion(null);
    setFormData({
      title: '',
      description: '',
      category: categories[0]?._id || '',
      difficulty: 'Medium',
      company: '',
      tags: '',
    });
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (q) => {
    setEditingQuestion(q);
    setFormData({
      title: q.title,
      description: q.description,
      category: q.category?._id || q.category || '',
      difficulty: q.difficulty || 'Medium',
      company: q.company || '',
      tags: Array.isArray(q.tags) ? q.tags.join(', ') : '',
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.category) {
      setFormError('Please fill in title, description, and select a category');
      return;
    }

    setFormSubmitting(true);
    setFormError('');

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        difficulty: formData.difficulty,
        company: formData.company,
        tags: formData.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      };

      if (editingQuestion) {
        await api.put(`/questions/${editingQuestion._id}`, payload);
      } else {
        await api.post('/questions', payload);
      }

      setModalOpen(false);
      fetchData();
    } catch (err) {
      setFormError(
        err.response?.data?.message || err.customMessage || 'Failed to save question'
      );
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteQuestion = async (id, title) => {
    const confirm = window.confirm(`Are you sure you want to delete "${title}"?`);
    if (!confirm) return;

    try {
      await api.delete(`/questions/${id}`);
      setQuestions((prev) => prev.filter((q) => q._id !== id));
    } catch (err) {
      alert('Failed to delete question');
    }
  };

  const filteredQuestions = questions.filter((q) => {
    if (!searchFilter.trim()) return true;
    const s = searchFilter.toLowerCase();
    return (
      q.title.toLowerCase().includes(s) ||
      (q.company && q.company.toLowerCase().includes(s)) ||
      (q.category?.name && q.category.name.toLowerCase().includes(s))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-amber-400" />
            <span>Admin Questions Manager</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Create, update, and manage the technical interview problem database
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Question</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 mb-6 flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search questions by title, company, or category..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>
        <span className="text-xs text-slate-400 hidden sm:inline">
          Total: <strong className="text-white">{filteredQuestions.length}</strong> questions
        </span>
      </div>

      {/* Table */}
      {loading ? (
        <Loader text="Loading questions database..." />
      ) : (
        <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Difficulty</th>
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredQuestions.map((q) => (
                  <tr key={q._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-semibold text-white max-w-sm truncate">
                      {q.title}
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {q.category?.name || 'Uncategorized'}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                          q.difficulty === 'Easy'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : q.difficulty === 'Hard'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {q.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{q.company || '—'}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(q)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 transition-colors"
                          title="Edit Question"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(q._id, q.title)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-red-400 transition-colors"
                          title="Delete Question"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Question Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <h3 className="text-lg font-bold text-white">
                {editingQuestion ? 'Edit Question' : 'Create New Question'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Question Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Implement an LRU Cache"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Difficulty *
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Company Tag
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Google, Meta"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="Array, Two Pointers, Dynamic Programming"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Description / Answer Solution (supports Markdown) *
                </label>
                <textarea
                  rows={8}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="### Problem&#10;...&#10;### Optimal Approach&#10;..."
                  required
                  className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30"
                >
                  {formSubmitting ? 'Saving...' : editingQuestion ? 'Update Question' : 'Create Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQuestions;
