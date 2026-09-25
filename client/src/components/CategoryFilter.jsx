import React from 'react';
import { Layers } from 'lucide-react';

export const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      <button
        onClick={() => onSelectCategory('all')}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
          selectedCategory === 'all' || !selectedCategory
            ? 'bg-[#20B2AA] text-[#0D1614] shadow-md shadow-[#20B2AA]/20'
            : 'bg-charcoal-850 border border-[#20B2AA]/15 text-charcoal-400 hover:text-white hover:border-[#20B2AA]/30'
        }`}
      >
        <Layers className="w-3.5 h-3.5" />
        <span>All Domains</span>
      </button>

      {categories.map((cat) => {
        const isSelected = selectedCategory === cat._id || selectedCategory === cat.name;
        return (
          <button
            key={cat._id}
            onClick={() => onSelectCategory(cat._id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              isSelected
                ? 'bg-[#20B2AA] text-[#0D1614] shadow-md shadow-[#20B2AA]/20'
                : 'bg-charcoal-850 border border-[#20B2AA]/15 text-charcoal-400 hover:text-white hover:border-[#20B2AA]/30'
            }`}
          >
            <span>{cat.name}</span>
            {cat.questionCount !== undefined && (
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isSelected
                    ? 'bg-[#0D1614]/25 text-[#0D1614]'
                    : 'bg-charcoal-800 text-charcoal-400 border border-[#20B2AA]/10'
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
