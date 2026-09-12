import { useState, useEffect, useCallback } from "react";
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
} from "lucide-react";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import Button from "../components/ui/Button";
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
      setNotes(res.notes || []);
      if (res.notes?.length > 0 && !activeNote) {
        setActiveNote(res.notes[0]);
      }
    } catch (err) {
      toast.error(err.message || "Failed to load notes");
    } finally {
      setLoading(false);
    }
  }, [search, selectedTag, activeNote]);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Technical Notes & Cheatsheets
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Capture algorithms, patterns, interview takeaways, and system design concepts.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-500 transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>New Note</span>
        </button>
      </div>

      {/* Search & Tag Filter Strip */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes by title or content keywords..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {allTags.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedTag("")}
              className={`rounded-lg px-2.5 py-1.5 font-medium transition-colors shrink-0 ${
                !selectedTag
                  ? "bg-blue-600 text-white"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              All Tags
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag === selectedTag ? "" : tag)}
                className={`rounded-lg px-2.5 py-1.5 font-medium transition-colors shrink-0 ${
                  selectedTag === tag
                    ? "bg-blue-600 text-white"
                    : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
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
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center">
          <FileText className="mx-auto h-8 w-8 text-slate-400" />
          <h3 className="mt-4 text-base font-semibold text-white">No notes yet</h3>
          <p className="mt-1 text-sm text-slate-400 max-w-sm mx-auto">
            Organize complex problem-solving patterns, code templates, or interview prep summaries.
          </p>
          <button
            onClick={handleOpenCreateModal}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500"
          >
            <Plus className="h-4 w-4" />
            <span>Create First Note</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Note Selection List (Left Column) */}
          <div className="space-y-2.5 max-h-[75vh] overflow-y-auto pr-1">
            {notes.map((note) => {
              const isSelected = activeNote?._id === note._id;
              const dateStr = new Date(note.updatedAt || note.createdAt).toLocaleDateString();

              return (
                <div
                  key={note._id}
                  onClick={() => setActiveNote(note)}
                  className={`cursor-pointer rounded-xl border p-4 transition-all ${
                    isSelected
                      ? "border-blue-500/50 bg-blue-600/10 shadow-md shadow-blue-950/20"
                      : "border-slate-800 bg-slate-900/80 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-semibold text-white truncate">
                      {note.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {dateStr}
                    </span>
                  </div>

                  {note.content && (
                    <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                      {note.content}
                    </p>
                  )}

                  {note.tags?.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1">
                      {note.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-medium text-slate-400"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Active Note Preview / Viewer (Right 2 Columns) */}
          <div className="lg:col-span-2">
            {activeNote ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 min-h-[500px]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {activeNote.title}
                    </h2>
                    {activeNote.problem && (
                      <div className="mt-1 flex items-center gap-2 text-xs text-blue-400">
                        <span>Linked Problem:</span>
                        <span className="font-semibold">{activeNote.problem.title}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(activeNote)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteNote(activeNote._id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/30 px-3 py-1.5 text-xs font-medium text-rose-400 hover:bg-rose-500/10"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>

                {activeNote.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {activeNote.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-md bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-400 border border-blue-500/20"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}

                <div className="prose prose-invert max-w-none text-sm leading-relaxed text-slate-200 font-mono whitespace-pre-wrap bg-slate-950 p-5 rounded-xl border border-slate-800">
                  {activeNote.content || "No content in this note yet. Click Edit to add details."}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center text-slate-400 text-sm">
                Select a note from the list to view its contents.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create / Edit Note Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">
                {formData.id ? "Edit Note" : "Create Technical Note"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitNote} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Note Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Monotonic Stack Pattern & Templates"
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Tags (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="dsa, stack, interview, leetcode"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Associate with Problem (Optional)
                  </label>
                  <select
                    value={formData.problem}
                    onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-200 focus:border-blue-500 focus:outline-none"
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
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Content (Markdown & Code)
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsPreviewMode(!isPreviewMode)}
                    className="text-xs text-blue-400 hover:underline inline-flex items-center gap-1"
                  >
                    {isPreviewMode ? <Code className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    <span>{isPreviewMode ? "Editor Mode" : "Preview Mode"}</span>
                  </button>
                </div>

                {isPreviewMode ? (
                  <div className="w-full min-h-[200px] rounded-lg border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-200 whitespace-pre-wrap">
                    {formData.content || "Empty content preview."}
                  </div>
                ) : (
                  <textarea
                    rows={8}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Write detailed notes, code examples, or explanations..."
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 font-mono text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                  />
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <Button type="submit" loading={formLoading} size="sm">
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
