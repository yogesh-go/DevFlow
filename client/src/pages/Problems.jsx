import { useState, useEffect, useCallback } from "react";
import { Plus, Code2, AlertCircle, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import ProblemFilters from "../components/problems/ProblemFilters";
import ProblemItem from "../components/problems/ProblemItem";
import ProblemModal from "../components/problems/ProblemModal";
import Pagination from "../components/tasks/Pagination";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
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
      toast.success("Problem logged & spaced repetition scheduled!");
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E6E3DB] pb-5">
        <div className="space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#657858]">
            DSA Knowledge Base
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#18181B]">
            Problems
          </h1>
          <p className="text-xs sm:text-sm text-[#575653]">
            Track what you've solved, what needs revision, and where you're improving.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            setEditingProblem(null);
            setIsModalOpen(true);
          }}
          className="shadow-xs self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add Problem</span>
        </Button>
      </div>

      {/* Filter Toolbar */}
      <ProblemFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Error Alert */}
      {error && (
        <div className="flex items-center justify-between rounded-lg border border-[#E8BFBF] bg-[#FBF0F0] p-3 text-xs text-[#933D3D]">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p>{error}</p>
          </div>
          <button
            onClick={fetchProblems}
            className="inline-flex items-center gap-1 font-semibold hover:underline"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Problems Content */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <LoadingSpinner message="Fetching problems from database..." />
        </div>
      ) : problems.length === 0 ? (
        <EmptyState
          icon={Code2}
          title="No problems found"
          description={
            filters.search || filters.difficulty !== "all" || filters.topic !== "all"
              ? "Try adjusting your search criteria or resetting filters."
              : "Get started by logging your first DSA problem to begin tracking progress and spaced repetition."
          }
          actionLabel="+ Add First Problem"
          onAction={() => {
            setEditingProblem(null);
            setIsModalOpen(true);
          }}
        />
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1 text-xs text-[#8E8B82] font-medium">
            <span>
              Showing {problems.length} of {pagination.totalProblems} problems
            </span>
            <span>
              Page {pagination.page} of {pagination.totalPages}
            </span>
          </div>

          <div className="space-y-2.5">
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

      {/* Problem Modal */}
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
