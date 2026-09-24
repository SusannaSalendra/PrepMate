import React from 'react';
import { Layers } from 'lucide-react';

export const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      <button
        onClick={() => onSelectCategory('all')}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
          selectedCategory === 'all' || !selectedCategory
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
            : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
        }`}
      >
        <Layers className="w-3.5 h-3.5" />
        <span>All Categories</span>
      </button>

      {categories.map((cat) => {
        const isSelected = selectedCategory === cat._id || selectedCategory === cat.name;
        return (
          <button
            key={cat._id}
            onClick={() => onSelectCategory(cat._id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              isSelected
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            <span>{cat.name}</span>
            {cat.questionCount !== undefined && (
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {cat.questionCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
