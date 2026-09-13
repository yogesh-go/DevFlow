import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Tag,
  Edit3,
  Trash2,
  FileText,
  ExternalLink,
  Eye,
  Code,
  X,
  Copy,
  Check,
  Calendar,
} from "lucide-react";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../services/noteService";
import { getProblems } from "../services/problemService";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  const [activeNote, setActiveNote] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [copied, setCopied] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: "",
    problem: "",
  });
  const [formLoading, setFormLoading] = useState(false);

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getNotes({ search, tag: selectedTag });
      const fetchedNotes = res.notes || [];
      setNotes(fetchedNotes);
      if (fetchedNotes.length > 0 && !activeNote) {
        setActiveNote(fetchedNotes[0]);
      } else if (activeNote) {
        const stillExists = fetchedNotes.find((n) => n._id === activeNote._id);
        setActiveNote(stillExists || (fetchedNotes.length > 0 ? fetchedNotes[0] : null));
      }
    } catch (err) {
      toast.error(err.message || "Failed to load notes");
    } finally {
      setLoading(false);
    }
  }, [search, selectedTag]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Load user problems for problem association dropdown
  useEffect(() => {
    const fetchUserProblems = async () => {
      try {
        const res = await getProblems({ limit: 100 });
        setProblems(res.problems || []);
      } catch (err) {
        console.warn("Could not load problems for notes:", err.message);
      }
    };
    fetchUserProblems();
  }, []);

  // Compute all unique tags
  const allTags = Array.from(
    new Set(notes.flatMap((n) => n.tags || []).filter(Boolean))
  );

  const handleOpenCreateModal = () => {
    setFormData({
      title: "",
      content: "",
      tags: "",
      problem: "",
    });
    setIsPreviewMode(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (note) => {
    setFormData({
      id: note._id,
      title: note.title,
      content: note.content || "",
      tags: Array.isArray(note.tags) ? note.tags.join(", ") : "",
      problem: note.problem?._id || note.problem || "",
    });
    setIsPreviewMode(false);
    setIsModalOpen(true);
  };

  const handleSubmitNote = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Note title is required");
      return;
    }

    try {
      setFormLoading(true);
      const payload = {
        title: formData.title,
        content: formData.content,
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        problem: formData.problem || null,
      };

      if (formData.id) {
        const updated = await updateNote(formData.id, payload);
        toast.success("Note updated!");
        setNotes((prev) =>
          prev.map((n) => (n._id === formData.id ? updated.note : n))
        );
        setActiveNote(updated.note);
      } else {
        const created = await createNote(payload);
        toast.success("Note created!");
        setNotes((prev) => [created.note, ...prev]);
        setActiveNote(created.note);
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.message || "Failed to save note");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteNote = async (id) => {
    if (!window.confirm("Delete this technical note?")) return;
    try {
      await deleteNote(id);
      toast.success("Note deleted");
      const remaining = notes.filter((n) => n._id !== id);
      setNotes(remaining);
      setActiveNote(remaining.length > 0 ? remaining[0] : null);
    } catch (err) {
      toast.error(err.message || "Failed to delete note");
    }
  };

  const handleCopyContent = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E6E3DB] pb-5">
        <div className="space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#657858]">
            Knowledge Base
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#18181B]">
            Technical Notes
          </h1>
          <p className="text-xs sm:text-sm text-[#575653]">
            Document algorithmic templates, interview patterns, and problem takeaways.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleOpenCreateModal}
          className="shadow-xs self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>New Note</span>
        </Button>
      </div>

      {/* Search & Tag Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-[#8E8B82]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes by title or keywords..."
            className="w-full rounded-lg border border-[#E6E3DB] bg-white py-2 pl-10 pr-4 text-xs text-[#18181B] placeholder-[#8E8B82] outline-none transition-all focus:border-[#657858] focus:ring-2 focus:ring-[#657858]/15"
          />
        </div>

        {allTags.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedTag("")}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors shrink-0 ${
                !selectedTag
                  ? "bg-[#18181B] text-white"
                  : "bg-white text-[#575653] hover:text-[#18181B] border border-[#E6E3DB]"
              }`}
            >
              All Tags
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag === selectedTag ? "" : tag)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors shrink-0 ${
                  selectedTag === tag
                    ? "bg-[#18181B] text-white"
                    : "bg-white text-[#575653] hover:text-[#18181B] border border-[#E6E3DB]"
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Two-Pane View */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <LoadingSpinner message="Loading notes..." />
        </div>
      ) : notes.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No notes created yet"
          description="Capture your first algorithmic template, cheatsheet, or interview pattern."
          actionLabel="+ Create First Note"
          onAction={handleOpenCreateModal}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Note Selection List (Left Column: 5 Cols) */}
          <div className="lg:col-span-5 space-y-2.5 max-h-[75vh] overflow-y-auto pr-1">
            {notes.map((note) => {
              const isSelected = activeNote?._id === note._id;
              const dateStr = new Date(note.updatedAt || note.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });

              return (
                <div
                  key={note._id}
                  onClick={() => setActiveNote(note)}
                  className={`cursor-pointer rounded-xl border p-4 transition-all ${
                    isSelected
                      ? "border-[#657858] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] ring-1 ring-[#657858]/20"
                      : "border-[#E6E3DB] bg-white hover:border-[#D5D1C6] hover:bg-[#FAF9F5]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-bold text-[#18181B] truncate">
                      {note.title}
                    </h4>
                    <span className="text-[10px] text-[#8E8B82] shrink-0 font-medium">
                      {dateStr}
                    </span>
                  </div>

                  {note.content && (
                    <p className="mt-1 text-xs text-[#575653] line-clamp-2 leading-relaxed">
                      {note.content}
                    </p>
                  )}

                  <div className="mt-2 flex items-center justify-between gap-2 flex-wrap pt-1 border-t border-[#F2F0E8]">
                    {note.problem ? (
                      <span className="text-[10px] text-[#657858] font-medium truncate">
                        Linked: {note.problem.title}
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#8E8B82]">Standalone</span>
                    )}

                    {note.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {note.tags.map((t) => (
                          <span
                            key={t}
                            className="rounded bg-[#F2F0E8] px-1.5 py-0.5 text-[9px] font-medium text-[#575653] border border-[#E6E3DB]"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Note Preview / Viewer (Right Column: 7 Cols) */}
          <div className="lg:col-span-7">
            {activeNote ? (
              <div className="rounded-xl border border-[#E6E3DB] bg-white p-6 space-y-4 min-h-[500px] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                {/* Note Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-[#E6E3DB] pb-4">
                  <div className="space-y-1">
                    <h2 className="text-xl sm:text-2xl font-bold text-[#18181B] tracking-tight">
                      {activeNote.title}
                    </h2>

                    {activeNote.problem && (
                      <div className="flex items-center gap-1.5 text-xs text-[#657858]">
                        <span>Linked Problem:</span>
                        <Link
                          to={`/problems/${activeNote.problem._id || activeNote.problem}`}
                          className="font-semibold underline hover:text-[#4E5D44]"
                        >
                          {activeNote.problem.title || "View problem"}
                        </Link>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => handleCopyContent(activeNote.content || "")}
                    >
                      {copied ? <Check className="h-3 w-3 text-[#426447]" /> : <Copy className="h-3 w-3" />}
                      <span>{copied ? "Copied" : "Copy"}</span>
                    </Button>

                    <Button
                      variant="secondary"
                      size="xs"
                      onClick={() => handleOpenEditModal(activeNote)}
                    >
                      <Edit3 className="h-3 w-3" />
                      <span>Edit</span>
                    </Button>

                    <button
                      type="button"
                      onClick={() => handleDeleteNote(activeNote._id)}
                      className="rounded-md border border-[#E8BFBF] bg-[#FBF0F0] p-1.5 text-[#933D3D] hover:bg-[#F5E1E1] transition-colors"
                      title="Delete Note"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Tags Strip */}
                {activeNote.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {activeNote.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-md bg-[#EEF2EB] px-2 py-0.5 text-xs font-medium text-[#4E5D44] border border-[#C6D2BF]"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Technical Documentation Content View */}
                <div className="rounded-lg border border-[#E6E3DB] bg-[#FAF9F5] p-5 font-mono text-xs text-[#18181B] leading-relaxed whitespace-pre-wrap">
                  {activeNote.content || "Empty content in this note. Click Edit to add details."}
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-[#E6E3DB] bg-white p-12 text-center text-xs text-[#8E8B82]">
                Select a note from the left pane to view its documentation.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create / Edit Note Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-xl border border-[#E6E3DB] bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E6E3DB] pb-3">
              <h3 className="text-base font-bold text-[#18181B]">
                {formData.id ? "Edit Note" : "Create Technical Note"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-md p-1.5 text-[#8E8B82] hover:bg-[#F2F0E8] hover:text-[#18181B]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitNote} className="mt-4 space-y-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#575653] mb-1.5">
                  Note Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Monotonic Stack Pattern & Templates"
                  required
                  className="w-full rounded-lg border border-[#E6E3DB] bg-[#FAF9F5] px-3.5 py-2 text-xs text-[#18181B] placeholder-[#8E8B82] focus:border-[#657858] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#657858]/15"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#575653] mb-1.5">
                    Tags (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="dsa, stack, interview, leetcode"
                    className="w-full rounded-lg border border-[#E6E3DB] bg-[#FAF9F5] px-3.5 py-2 text-xs text-[#18181B] placeholder-[#8E8B82] focus:border-[#657858] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#657858]/15"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#575653] mb-1.5">
                    Associate with Problem (Optional)
                  </label>
                  <select
                    value={formData.problem}
                    onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                    className="w-full rounded-lg border border-[#E6E3DB] bg-white px-3.5 py-2 text-xs text-[#18181B] focus:border-[#657858] focus:outline-none"
                  >
                    <option value="">None (Independent Note)</option>
                    {problems.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.title} ({p.topic})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-[#575653]">
                    Content (Markdown & Code)
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsPreviewMode(!isPreviewMode)}
                    className="text-xs text-[#657858] hover:underline inline-flex items-center gap-1 font-medium"
                  >
                    {isPreviewMode ? <Code className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    <span>{isPreviewMode ? "Editor Mode" : "Preview Mode"}</span>
                  </button>
                </div>

                {isPreviewMode ? (
                  <div className="w-full min-h-[220px] rounded-lg border border-[#E6E3DB] bg-[#FAF9F5] p-4 font-mono text-xs text-[#18181B] whitespace-pre-wrap leading-relaxed">
                    {formData.content || "Empty content preview."}
                  </div>
                ) : (
                  <textarea
                    rows={10}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Write detailed notes, code examples, algorithmic steps, or intuition..."
                    className="w-full rounded-lg border border-[#E6E3DB] bg-[#FAF9F5] p-3 font-mono text-xs text-[#18181B] placeholder-[#8E8B82] focus:border-[#657858] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#657858]/15 leading-relaxed"
                  />
                )}
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E6E3DB]">
                <Button type="button" variant="secondary" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" loading={formLoading}>
                  {formData.id ? "Save Note" : "Create Note"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Notes;
