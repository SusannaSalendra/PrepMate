import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({ pagination, onPageChange }) => {
  const { page, totalPages, total, limit } = pagination;

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#20B2AA]/15">
      <p className="text-xs text-charcoal-400">
        Showing <span className="font-semibold text-white">{(page - 1) * limit + 1}</span> to{' '}
        <span className="font-semibold text-white">{Math.min(page * limit, total)}</span> of{' '}
        <span className="font-semibold text-white">{total}</span> questions
      </p>

      <div className="flex items-center gap-1.5">
        {/* Previous */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="p-2 rounded-xl bg-charcoal-850 border border-[#20B2AA]/15 text-charcoal-400 hover:text-white hover:bg-charcoal-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Buttons */}
        {getPageNumbers().map((num) => (
          <button
            key={num}
            onClick={() => onPageChange(num)}
            className={`w-9 h-9 rounded-xl text-xs font-semibold transition-all ${
              page === num
                ? 'bg-[#20B2AA] text-[#0D1614] shadow-md shadow-[#20B2AA]/20 font-bold'
                : 'bg-charcoal-850 border border-[#20B2AA]/15 text-charcoal-400 hover:text-white hover:bg-charcoal-800'
            }`}
          >
            {num}
          </button>
        ))}

        {/* Next */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="p-2 rounded-xl bg-charcoal-850 border border-[#20B2AA]/15 text-charcoal-400 hover:text-white hover:bg-charcoal-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
