import { useState, useEffect, useCallback } from "react";
import { Plus, Code2, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import ProblemFilters from "../components/problems/ProblemFilters";
import ProblemItem from "../components/problems/ProblemItem";
import ProblemModal from "../components/problems/ProblemModal";
import Pagination from "../components/tasks/Pagination";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import {
  getProblems,
  createProblem,
  updateProblem,
  deleteProblem,
} from "../services/problemService";

function Problems() {
  const [problems, setProblems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalProblems: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
    topic: "all",
    difficulty: "all",
    platform: "all",
    status: "all",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState(null);

  const fetchProblems = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getProblems(filters);
      setProblems(response.problems || []);
      setPagination(response.pagination || { page: 1, totalPages: 1, totalProblems: 0 });
    } catch (err) {
      setError(err.message || "Failed to load problems");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  // Listen for top navbar "+ Add Problem" action
  useEffect(() => {
    const handleOpenModal = () => {
      setEditingProblem(null);
      setIsModalOpen(true);
    };

    window.addEventListener("devflow:open-problem-modal", handleOpenModal);
    return () => {
      window.removeEventListener("devflow:open-problem-modal", handleOpenModal);
    };
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters({ ...newFilters, page: 1 });
  };

  const handleResetFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      search: "",
      topic: "all",
      difficulty: "all",
      platform: "all",
      status: "all",
    });
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleCreateOrUpdate = async (formData) => {
    if (editingProblem) {
      const res = await updateProblem(editingProblem._id, formData);
      toast.success("Problem updated successfully!");
      setProblems((prev) =>
        prev.map((p) => (p._id === editingProblem._id ? res.problem : p))
      );
    } else {
      const res = await createProblem(formData);
      toast.success("Problem created and spaced repetition scheduled!");
      setFilters((prev) => ({ ...prev, page: 1 }));
      fetchProblems();
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await updateProblem(id, { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
      setProblems((prev) =>
        prev.map((p) => (p._id === id ? res.problem : p))
      );
    } catch (err) {
      toast.error(err.message || "Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this problem?")) return;

    try {
      await deleteProblem(id);
      toast.success("Problem deleted");
      fetchProblems();
    } catch (err) {
      toast.error(err.message || "Failed to delete problem");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            DSA Problem Tracker
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Log, categorize, and master your data structures and algorithms preparation.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingProblem(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-500 transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add Problem</span>
        </button>
      </div>

      {/* Filter Bar */}
      <ProblemFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Error Alert */}
      {error && (
        <div className="flex items-center justify-between rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p>{error}</p>
          </div>
          <button
            onClick={fetchProblems}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 px-3 py-1 text-xs font-semibold hover:bg-red-500/20 text-red-300"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Problem List Content */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <LoadingSpinner message="Fetching problems from database..." />
        </div>
      ) : problems.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20">
            <Code2 className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-white">
            No problems found
          </h3>
          <p className="mt-1 text-sm text-slate-400 max-w-sm mx-auto">
            {filters.search || filters.difficulty !== "all" || filters.topic !== "all"
              ? "Try adjusting your search filters to find matching problems."
              : "Get started by logging your first DSA problem to begin tracking progress and spaced repetition."}
          </p>
          <button
            type="button"
            onClick={() => {
              setEditingProblem(null);
              setIsModalOpen(true);
            }}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500"
          >
            <Plus className="h-4 w-4" />
            <span>Add First Problem</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1 text-xs text-slate-400 font-medium">
            <span>Showing {problems.length} of {pagination.totalProblems} problems</span>
            <span>Page {pagination.page} of {pagination.totalPages}</span>
          </div>

          <div className="space-y-3">
            {problems.map((problem) => (
              <ProblemItem
                key={problem._id}
                problem={problem}
                onUpdateStatus={handleUpdateStatus}
                onEdit={(prob) => {
                  setEditingProblem(prob);
                  setIsModalOpen(true);
                }}
                onDelete={handleDelete}
              />
            ))}
          </div>

          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Modal */}
      <ProblemModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProblem(null);
        }}
        onSubmit={handleCreateOrUpdate}
        initialData={editingProblem}
      />
    </div>
  );
}

export default Problems;
