import { ChevronLeft, ChevronRight } from "lucide-react";

function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between border-t border-[#E6E3DB] pt-4 mt-6 text-xs text-[#575653]">
      <div>
        Page <span className="font-semibold text-[#18181B]">{page}</span> of{" "}
        <span className="font-semibold text-[#18181B]">{totalPages}</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="inline-flex items-center gap-1 rounded-md border border-[#E6E3DB] bg-white px-3 py-1.5 text-xs font-medium text-[#575653] hover:bg-[#FAF9F5] hover:text-[#18181B] hover:border-[#D5D1C6] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span>Previous</span>
        </button>

        <button
          type="button"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="inline-flex items-center gap-1 rounded-md border border-[#E6E3DB] bg-white px-3 py-1.5 text-xs font-medium text-[#575653] hover:bg-[#FAF9F5] hover:text-[#18181B] hover:border-[#D5D1C6] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <span>Next</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export default Pagination;