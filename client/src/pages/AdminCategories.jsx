import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Layers, X, AlertCircle, Sparkles } from 'lucide-react';
import api from '../api/axios';
import { Loader } from '../components/Loader';

export const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/categories');
      if (res.data?.success) {
        setCategories(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load categories', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setError('');
    setModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Category name is required');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory._id}`, { name, description });
      } else {
        await api.post('/categories', { name, description });
      }

      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      setError(
        err.response?.data?.message || err.customMessage || 'Failed to save category'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, catName) => {
    const confirm = window.confirm(
      `Are you sure you want to delete category "${catName}"?`
    );
    if (!confirm) return;

    try {
      const res = await api.delete(`/categories/${id}`);
      if (res.data?.success) {
        setCategories((prev) => prev.filter((c) => c._id !== id));
      }
    } catch (err) {
      alert(
        err.response?.data?.message ||
          err.customMessage ||
          'Cannot delete category with active questions.'
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-6 border-b border-[#20B2AA]/15">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#20B2AA]/10 border border-[#20B2AA]/20 text-[#3FD1C7] text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Category Taxonomy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#F9FBFB] tracking-tight flex items-center gap-3">
            <Layers className="w-8 h-8 text-[#20B2AA]" />
            <span>Admin Categories Manager</span>
          </h1>
          <p className="text-sm text-[#8EA3A0] mt-1">
            Define and organize interview problem categories and syllabus structure.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#20B2AA] hover:bg-[#3FD1C7] text-[#0D1614] text-xs font-bold shadow-lg shadow-[#20B2AA]/20 transition-all self-start sm:self-auto hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <Loader text="Loading categories..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="glass-card rounded-3xl p-6 border border-[#20B2AA]/15 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="text-lg font-display font-bold text-[#F9FBFB]">{cat.name}</h3>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#20B2AA]/15 text-[#3FD1C7] border border-[#20B2AA]/25">
                    {cat.questionCount || 0} questions
                  </span>
                </div>
                <p className="text-xs text-[#8EA3A0] leading-relaxed mb-6">
                  {cat.description || 'No description provided.'}
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#20B2AA]/15">
                <button
                  onClick={() => openEditModal(cat)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#10201D] hover:bg-[#162B27] text-[#3FD1C7] border border-[#20B2AA]/20 text-xs font-semibold transition-all"
                >
                  <Edit className="w-3.5 h-3.5 text-[#20B2AA]" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(cat._id, cat.name)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#10201D] hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D1614]/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl bg-[#10201D] border border-[#20B2AA]/25 p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-[#20B2AA]/15 mb-6">
              <h3 className="text-xl font-display font-bold text-[#F9FBFB]">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-xl text-[#8EA3A0] hover:text-[#F9FBFB] hover:bg-[#162B27]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#8EA3A0] mb-1.5">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Distributed Systems"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1614] border border-[#20B2AA]/20 text-[#F1F3F2] text-xs focus:outline-none focus:border-[#20B2AA]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8EA3A0] mb-1.5">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Overview of questions in this category..."
                  className="w-full p-3.5 rounded-xl bg-[#0D1614] border border-[#20B2AA]/20 text-[#F1F3F2] text-xs focus:outline-none focus:border-[#20B2AA]"
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
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-[#20B2AA] hover:bg-[#3FD1C7] text-[#0D1614] text-xs font-bold shadow-lg shadow-[#20B2AA]/20 transition-all hover:-translate-y-0.5"
                >
                  {submitting ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
