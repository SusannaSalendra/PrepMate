import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  BookOpen,
  X,
  AlertCircle,
  Sparkles,
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-6 border-b border-[#20B2AA]/15">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#20B2AA]/10 border border-[#20B2AA]/20 text-[#3FD1C7] text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curriculum Management</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#F9FBFB] tracking-tight flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-[#20B2AA]" />
            <span>Admin Questions Manager</span>
          </h1>
          <p className="text-sm text-[#8EA3A0] mt-1">
            Create, update, and manage the technical interview problem database.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#20B2AA] hover:bg-[#3FD1C7] text-[#0D1614] text-xs font-bold shadow-lg shadow-[#20B2AA]/20 transition-all self-start sm:self-auto hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Question</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-card rounded-2xl p-4 border border-[#20B2AA]/15 mb-6 flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8EA3A0]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search questions by title, company, or category..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#10201D] border border-[#20B2AA]/20 text-[#F1F3F2] placeholder-[#8EA3A0]/60 text-xs focus:outline-none focus:border-[#20B2AA] focus:ring-1 focus:ring-[#20B2AA] transition-all"
          />
        </div>
        <span className="text-xs text-[#8EA3A0] hidden sm:inline">
          Total: <strong className="text-[#3FD1C7]">{filteredQuestions.length}</strong> questions
        </span>
      </div>

      {/* Table */}
      {loading ? (
        <Loader text="Loading questions database..." />
      ) : (
        <div className="glass-card rounded-3xl border border-[#20B2AA]/15 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#F1F3F2]">
              <thead className="bg-[#10201D] text-[#8EA3A0] uppercase tracking-wider text-[10px] border-b border-[#20B2AA]/15">
                <tr>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Difficulty</th>
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#20B2AA]/10">
                {filteredQuestions.map((q) => (
                  <tr key={q._id} className="hover:bg-[#162B27]/40 transition-colors">
                    <td className="px-6 py-4 font-semibold text-[#F9FBFB] max-w-sm truncate">
                      {q.title}
                    </td>
                    <td className="px-6 py-4 text-[#8EA3A0]">
                      {q.category?.name || 'Uncategorized'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.5 rounded-full font-semibold text-[10px] bg-[#20B2AA]/15 text-[#3FD1C7] border border-[#20B2AA]/25">
                        {q.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#8EA3A0]">{q.company || '—'}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(q)}
                          className="p-1.5 rounded-lg bg-[#10201D] hover:bg-[#162B27] text-[#3FD1C7] border border-[#20B2AA]/20 transition-colors"
                          title="Edit Question"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(q._id, q.title)}
                          className="p-1.5 rounded-lg bg-[#10201D] hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D1614]/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl bg-[#10201D] border border-[#20B2AA]/25 p-6 sm:p-8 shadow-2xl my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-[#20B2AA]/15 mb-6">
              <h3 className="text-xl font-display font-bold text-[#F9FBFB]">
                {editingQuestion ? 'Edit Question' : 'Create New Question'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-xl text-[#8EA3A0] hover:text-[#F9FBFB] hover:bg-[#162B27]"
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
                <label className="block text-xs font-semibold text-[#8EA3A0] mb-1">
                  Question Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Implement an LRU Cache"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1614] border border-[#20B2AA]/20 text-[#F1F3F2] text-xs focus:outline-none focus:border-[#20B2AA]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#8EA3A0] mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0D1614] border border-[#20B2AA]/20 text-[#F1F3F2] text-xs focus:outline-none focus:border-[#20B2AA]"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id} className="bg-[#0D1614]">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#8EA3A0] mb-1">
                    Difficulty *
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0D1614] border border-[#20B2AA]/20 text-[#F1F3F2] text-xs focus:outline-none focus:border-[#20B2AA]"
                  >
                    <option value="Easy" className="bg-[#0D1614]">Easy</option>
                    <option value="Medium" className="bg-[#0D1614]">Medium</option>
                    <option value="Hard" className="bg-[#0D1614]">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#8EA3A0] mb-1">
                    Company Tag
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Google, Meta"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0D1614] border border-[#20B2AA]/20 text-[#F1F3F2] text-xs focus:outline-none focus:border-[#20B2AA]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8EA3A0] mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="Array, Two Pointers, Dynamic Programming"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1614] border border-[#20B2AA]/20 text-[#F1F3F2] text-xs focus:outline-none focus:border-[#20B2AA]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8EA3A0] mb-1">
                  Description / Answer Solution (supports Markdown) *
                </label>
                <textarea
                  rows={8}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="### Problem&#10;...&#10;### Optimal Approach&#10;..."
                  required
                  className="w-full p-3.5 rounded-xl bg-[#0D1614] border border-[#20B2AA]/20 text-[#F1F3F2] text-xs font-mono focus:outline-none focus:border-[#20B2AA]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#20B2AA]/15">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#162B27] text-[#8EA3A0] text-xs font-semibold hover:text-[#F9FBFB]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-5 py-2 rounded-xl bg-[#20B2AA] hover:bg-[#3FD1C7] text-[#0D1614] text-xs font-bold shadow-lg shadow-[#20B2AA]/20 transition-all hover:-translate-y-0.5"
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
