import { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
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
  Copy,
  Check,
  Calendar,
  ArrowLeft,
  Save,
  Clock,
  Bold,
  Italic,
  List,
  Quote,
  Heading2,
  CheckCircle2,
  AlertCircle,
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
  const [searchParams] = useSearchParams();
  const [notes, setNotes] = useState([]);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  const [activeNote, setActiveNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [saveStatus, setSaveStatus] = useState("saved"); // 'saved' | 'unsaved' | 'saving'
  const [mobilePane, setMobilePane] = useState("list"); // 'list' | 'workspace'
  const [copied, setCopied] = useState(false);

  // Active note draft state
  const [draftTitle, setDraftTitle] = useState("");
  const [draftContent, setDraftContent] = useState("");
  const [draftTags, setDraftTags] = useState([]);
  const [draftProblem, setDraftProblem] = useState("");
  const [tagInput, setTagInput] = useState("");

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getNotes({ search, tag: selectedTag });
      const fetched = res.notes || [];
      setNotes(fetched);

      if (fetched.length > 0 && !activeNote && !isCreatingNew) {
        selectNote(fetched[0]);
      } else if (activeNote) {
        const current = fetched.find((n) => n._id === activeNote._id);
        if (current) {
          setActiveNote(current);
        }
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
  const fetchUserProblems = useCallback(async () => {
    try {
      const res = await getProblems({ limit: 100 });
      setProblems(res.problems || []);
    } catch (err) {
      console.warn("Could not load problems for notes dropdown:", err.message);
    }
  }, []);

  useEffect(() => {
    fetchUserProblems();
  }, [fetchUserProblems]);

  useEffect(() => {
    const handleProblemCreated = () => {
      fetchUserProblems();
    };

    window.addEventListener("devflow:problem-created", handleProblemCreated);
    return () => {
      window.removeEventListener("devflow:problem-created", handleProblemCreated);
    };
  }, [fetchUserProblems]);

  // Check query params for problemId linking
  useEffect(() => {
    const problemId = searchParams.get("problemId");
    if (problemId && notes.length > 0) {
      const match = notes.find((n) => n.problem?._id === problemId || n.problem === problemId);
      if (match) {
        selectNote(match);
        setMobilePane("workspace");
      }
    }
  }, [searchParams, notes]);

  const selectNote = (note) => {
    setActiveNote(note);
    setIsCreatingNew(false);
    setIsEditing(false);
    setDraftTitle(note.title || "");
    setDraftContent(note.content || "");
    setDraftTags(note.tags || []);
    setDraftProblem(note.problem?._id || note.problem || "");
    setSaveStatus("saved");
    setMobilePane("workspace");
  };

  const handleStartNewNote = () => {
    setActiveNote(null);
    setIsCreatingNew(true);
    setIsEditing(true);
    setDraftTitle("");
    setDraftContent("");
    setDraftTags([]);
    setDraftProblem("");
    setSaveStatus("unsaved");
    setMobilePane("workspace");
  };

  const handleTitleChange = (val) => {
    setDraftTitle(val);
    setSaveStatus("unsaved");
  };

  const handleContentChange = (val) => {
    setDraftContent(val);
    setSaveStatus("unsaved");
  };

  const handleAddTag = (e) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      const clean = tagInput.replace(",", "").trim().toLowerCase();
      if (clean && !draftTags.includes(clean)) {
        setDraftTags([...draftTags, clean]);
        setSaveStatus("unsaved");
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setDraftTags(draftTags.filter((t) => t !== tagToRemove));
    setSaveStatus("unsaved");
  };

  const handleSave = async () => {
    if (!draftTitle.trim()) {
      toast.error("Please provide a note title before saving.");
      return;
    }

    try {
      setSaveStatus("saving");

      if (isCreatingNew) {
        const res = await createNote({
          title: draftTitle.trim(),
          content: draftContent,
          tags: draftTags,
          problem: draftProblem || null,
        });

        toast.success("Note created in workspace!");
        setIsCreatingNew(false);
        setIsEditing(false);
        setSaveStatus("saved");
        await fetchNotes();
        if (res?.note) {
          selectNote(res.note);
        }
      } else if (activeNote) {
        const res = await updateNote(activeNote._id, {
          title: draftTitle.trim(),
          content: draftContent,
          tags: draftTags,
          problem: draftProblem || null,
        });

        toast.success("Note changes saved!");
        setIsEditing(false);
        setSaveStatus("saved");
        await fetchNotes();
        if (res?.note) {
          setActiveNote(res.note);
        }
      }
    } catch (err) {
      toast.error(err.message || "Failed to save note");
      setSaveStatus("unsaved");
    }
  };

  const handleDelete = async () => {
    if (!activeNote) return;
    if (!window.confirm(`Permanently delete "${activeNote.title}"?`)) return;

    try {
      await deleteNote(activeNote._id);
      toast.success("Note deleted");
      setActiveNote(null);
      setIsEditing(false);
      setIsCreatingNew(false);
      setMobilePane("list");
      await fetchNotes();
    } catch (err) {
      toast.error(err.message || "Failed to delete note");
    }
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(draftContent);
    setCopied(true);
    toast.success("Note content copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  // Keyboard shortcut Ctrl+S or Cmd+S to save note
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (isEditing || isCreatingNew) {
          handleSave();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isEditing, isCreatingNew, draftTitle, draftContent, draftTags, draftProblem]);

  // Insert markdown snippet at cursor in textarea
  const insertMarkdown = (prefix, suffix = "") => {
    const textarea = document.getElementById("note-content-editor");
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const current = draftContent;
    const selected = current.substring(start, end);

    const replacement = `${prefix}${selected || "text"}${suffix}`;
    const updated = current.substring(0, start) + replacement + current.substring(end);

    setDraftContent(updated);
    setSaveStatus("unsaved");

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + (selected ? selected.length : 4)
      );
    }, 0);
  };

  // All available tags for filter strip
  const allTags = useMemo(() => {
    return Array.from(
      new Set(notes.flatMap((n) => n.tags || []).filter(Boolean))
    );
  }, [notes]);

  // Render formatted markdown content
  const renderMarkdownPreview = (text) => {
    if (!text || !text.trim()) {
      return (
        <div className="py-12 text-center text-xs text-[#8E8B82] italic">
          This note has no written content yet. Click "Edit Note" to begin writing.
        </div>
      );
    }

    const lines = text.split("\n");
    const elements = [];
    let inCodeBlock = false;
    let codeLanguage = "";
    let codeBuffer = [];

    lines.forEach((line, idx) => {
      if (line.trim().startsWith("```")) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeLanguage = line.trim().replace("```", "").trim();
          codeBuffer = [];
        } else {
          inCodeBlock = false;
          const codeString = codeBuffer.join("\n");
          elements.push(
            <div key={`code-${idx}`} className="my-3 rounded-lg border border-[#E6E3DB] bg-[#18181B] text-[#F7F6F2] overflow-hidden text-xs">
              <div className="flex items-center justify-between border-b border-[#2E2E32] bg-[#222225] px-3.5 py-1.5 text-[10px] font-mono text-[#A1A1AA]">
                <span>{codeLanguage || "code"}</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(codeString);
                    toast.success("Code block copied!");
                  }}
                  className="hover:text-white transition-colors"
                >
                  Copy
                </button>
              </div>
              <pre className="p-4 font-mono overflow-x-auto leading-relaxed whitespace-pre">
                <code>{codeString}</code>
              </pre>
            </div>
          );
        }
        return;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        return;
      }

      if (line.startsWith("### ")) {
        elements.push(
          <h3 key={idx} className="text-base font-bold text-[#18181B] mt-4 mb-2">
            {line.replace("### ", "")}
          </h3>
        );
      } else if (line.startsWith("## ")) {
        elements.push(
          <h2 key={idx} className="text-lg font-bold text-[#18181B] mt-5 mb-2 pb-1 border-b border-[#E6E3DB]">
            {line.replace("## ", "")}
          </h2>
        );
      } else if (line.startsWith("# ")) {
        elements.push(
          <h1 key={idx} className="text-xl font-extrabold text-[#18181B] mt-6 mb-3 pb-1 border-b border-[#E6E3DB]">
            {line.replace("# ", "")}
          </h1>
        );
      } else if (line.startsWith("- ") || line.startsWith("* ")) {
        elements.push(
          <li key={idx} className="ml-4 list-disc text-xs text-[#3F3E3A] leading-relaxed">
            {line.replace(/^[-*]\s+/, "")}
          </li>
        );
      } else if (line.startsWith("> ")) {
        elements.push(
          <blockquote key={idx} className="my-2 border-l-2 border-[#657858] bg-[#EEF2EB]/50 pl-3 py-1.5 text-xs italic text-[#575653]">
            {line.replace(/^>\s+/, "")}
          </blockquote>
        );
      } else if (line.trim() === "") {
        elements.push(<div key={idx} className="h-2" />);
      } else {
        elements.push(
          <p key={idx} className="text-xs text-[#3F3E3A] leading-relaxed">
            {line}
          </p>
        );
      }
    });

    return <div className="space-y-1">{elements}</div>;
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6E3DB] pb-5">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#657858]">
            Knowledge Base & Recall
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#18181B]">
            Technical Notes
          </h1>
          <p className="text-xs sm:text-sm text-[#575653] mt-0.5">
            Dedicated workspace for algorithmic approaches, time/space trade-offs, and interview notes.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleStartNewNote}
          className="self-start sm:self-auto shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>New Note</span>
        </Button>
      </div>

      {/* Main Two-Pane Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANE: Notes Directory (Hidden on mobile if workspace is active) */}
        <div
          className={`lg:col-span-4 space-y-4 ${
            mobilePane === "workspace" ? "hidden lg:block" : "block"
          }`}
        >
          {/* Search and Tag Filter Bar */}
          <div className="rounded-xl border border-[#E6E3DB] bg-white p-3.5 space-y-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#8E8B82]" />
              <input
                type="text"
                placeholder="Search notes or keywords..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-[#E6E3DB] bg-[#FAF9F5] py-2 pl-9 pr-3 text-xs text-[#18181B] focus:border-[#657858] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#657858]/15"
              />
            </div>

            {/* Tags Pills Strip */}
            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedTag("")}
                  className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                    selectedTag === ""
                      ? "bg-[#18181B] text-white"
                      : "bg-[#F2F0E8] text-[#575653] hover:bg-[#E6E3DB]"
                  }`}
                >
                  All ({notes.length})
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSelectedTag(selectedTag === tag ? "" : tag)}
                    className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                      selectedTag === tag
                        ? "bg-[#657858] text-white"
                        : "bg-[#F2F0E8] text-[#575653] hover:bg-[#E6E3DB]"
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notes List Cards */}
          <div className="space-y-2.5 max-h-[calc(100vh-18rem)] overflow-y-auto pr-1">
            {loading ? (
              <div className="py-12 flex justify-center">
                <LoadingSpinner message="Loading notes..." />
              </div>
            ) : notes.length === 0 ? (
              <div className="rounded-xl border border-[#E6E3DB] bg-white p-8 text-center">
                <FileText className="h-8 w-8 text-[#8E8B82] mx-auto mb-2 opacity-50" />
                <p className="text-xs font-bold text-[#18181B]">No notes found</p>
                <p className="text-[11px] text-[#575653] mt-1">
                  {search || selectedTag
                    ? "Try clearing your filters"
                    : "Create your first technical revision note"}
                </p>
              </div>
            ) : (
              notes.map((note) => {
                const isSelected = activeNote?._id === note._id && !isCreatingNew;
                return (
                  <div
                    key={note._id}
                    onClick={() => selectNote(note)}
                    className={`cursor-pointer rounded-xl border p-4 transition-all ${
                      isSelected
                        ? "border-[#657858] bg-white shadow-xs ring-1 ring-[#657858]"
                        : "border-[#E6E3DB] bg-white hover:border-[#D5D1C6] hover:bg-[#FAF9F5]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-xs font-bold text-[#18181B] line-clamp-1">
                        {note.title}
                      </h3>
                      <span className="text-[10px] text-[#8E8B82] shrink-0">
                        {new Date(note.updatedAt || note.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#575653] line-clamp-2 mt-1.5 leading-relaxed">
                      {note.content || "Empty note content..."}
                    </p>

                    <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-[#E6E3DB]/70 text-[10px]">
                      {note.problem?.title ? (
                        <span className="text-[#657858] font-semibold truncate max-w-[150px]">
                          P: {note.problem.title}
                        </span>
                      ) : (
                        <span className="text-[#8E8B82]">Standalone note</span>
                      )}

                      {note.tags?.length > 0 && (
                        <span className="rounded bg-[#F2F0E8] px-1.5 py-0.5 text-[9px] font-medium text-[#575653]">
                          #{note.tags[0]}
                          {note.tags.length > 1 ? ` +${note.tags.length - 1}` : ""}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT PANE: Dedicated Note Workspace (Shown on mobile when note is selected) */}
        <div
          className={`lg:col-span-8 ${
            mobilePane === "list" ? "hidden lg:block" : "block"
          }`}
        >
          {activeNote || isCreatingNew ? (
            <div className="rounded-xl border border-[#E6E3DB] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden min-h-[680px]">
              {/* Workspace Top Toolbar */}
              <div className="flex items-center justify-between border-b border-[#E6E3DB] bg-[#FAF9F5] px-4 py-2.5">
                <div className="flex items-center gap-2">
                  {/* Mobile Back Button */}
                  <button
                    type="button"
                    onClick={() => setMobilePane("list")}
                    className="inline-flex items-center gap-1 text-xs text-[#575653] hover:text-[#18181B] lg:hidden pr-2 border-r border-[#E6E3DB]"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Notes</span>
                  </button>

                  {/* Save Status Badge */}
                  <div className="flex items-center gap-1.5 text-xs">
                    {saveStatus === "saving" ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-[#865B20] font-medium">
                        <Clock className="h-3 w-3 animate-spin" />
                        <span>Saving...</span>
                      </span>
                    ) : saveStatus === "unsaved" ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-[#865B20] font-medium">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#865B20]" />
                        <span>Unsaved edits</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-[#4E5D44] font-medium">
                        <CheckCircle2 className="h-3 w-3 text-[#657858]" />
                        <span>Saved</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Workspace Actions */}
                <div className="flex items-center gap-2">
                  {/* Edit / Preview Toggle */}
                  <div className="inline-flex rounded-md border border-[#E6E3DB] bg-white p-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className={`inline-flex items-center gap-1 rounded px-2.5 py-1 text-xs font-semibold transition-colors ${
                        isEditing
                          ? "bg-[#18181B] text-white"
                          : "text-[#575653] hover:text-[#18181B]"
                      }`}
                    >
                      <Edit3 className="h-3 w-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className={`inline-flex items-center gap-1 rounded px-2.5 py-1 text-xs font-semibold transition-colors ${
                        !isEditing
                          ? "bg-[#18181B] text-white"
                          : "text-[#575653] hover:text-[#18181B]"
                      }`}
                    >
                      <Eye className="h-3 w-3" />
                      <span>Preview</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyContent}
                    title="Copy Markdown"
                    className="rounded-md border border-[#E6E3DB] bg-white p-1.5 text-[#575653] hover:text-[#18181B] hover:border-[#D5D1C6] transition-colors"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-[#657858]" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>

                  {!isCreatingNew && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      title="Delete Note"
                      className="rounded-md border border-[#E6E3DB] bg-white p-1.5 text-[#8E8B82] hover:border-[#E8BFBF] hover:bg-[#FBF0F0] hover:text-[#933D3D] transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}

                  <Button
                    variant="primary"
                    size="xs"
                    onClick={handleSave}
                    disabled={saveStatus === "saving"}
                    className="shadow-xs"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>Save (Ctrl+S)</span>
                  </Button>
                </div>
              </div>

              {/* Workspace Body */}
              <div className="flex-1 p-6 space-y-5 overflow-y-auto">
                {/* Note Title Input / Display */}
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      value={draftTitle}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="Note Title (e.g. Invariant Pointers for Two-Sum)..."
                      className="w-full text-2xl sm:text-3xl font-extrabold tracking-tight text-[#18181B] border-b border-[#E6E3DB] pb-2 focus:border-[#657858] focus:outline-none placeholder:text-[#8E8B82]/50 placeholder:font-normal"
                    />
                  </div>
                ) : (
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#18181B] pb-2 border-b border-[#E6E3DB]">
                      {draftTitle || "Untitled Note"}
                    </h1>
                  </div>
                )}

                {/* Metadata Strip: Problem Association & Tags */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                  {/* Problem Selector */}
                  <div className="rounded-lg border border-[#E6E3DB] bg-[#FAF9F5] p-2.5 space-y-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8E8B82] block">
                      Associated DSA Problem
                    </span>
                    {isEditing ? (
                      <select
                        value={draftProblem}
                        onChange={(e) => {
                          setDraftProblem(e.target.value);
                          setSaveStatus("unsaved");
                        }}
                        className="w-full rounded border border-[#E6E3DB] bg-white py-1 px-2 text-xs text-[#18181B] focus:border-[#657858] focus:outline-none"
                      >
                        <option value="">No problem linked (General note)</option>
                        {problems.map((p) => (
                          <option key={p._id} value={p._id}>
                            {p.title} ({p.difficulty} · {p.topic})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="flex items-center gap-1.5 pt-0.5">
                        {activeNote?.problem?.title ? (
                          <Link
                            to={`/problems/${activeNote.problem._id || activeNote.problem}`}
                            className="inline-flex items-center gap-1 font-semibold text-[#657858] hover:underline"
                          >
                            <span>{activeNote.problem.title}</span>
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        ) : (
                          <span className="text-[#8E8B82] italic">None linked</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Tags Manager */}
                  <div className="rounded-lg border border-[#E6E3DB] bg-[#FAF9F5] p-2.5 space-y-1.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8E8B82] block">
                      Tags
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {draftTags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 rounded bg-[#EEF2EB] px-2 py-0.5 text-[10px] font-semibold text-[#4E5D44] border border-[#C6D2BF]"
                        >
                          #{tag}
                          {isEditing && (
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="text-[#4E5D44] hover:text-[#933D3D]"
                            >
                              ×
                            </button>
                          )}
                        </span>
                      ))}
                      {isEditing && (
                        <input
                          type="text"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={handleAddTag}
                          placeholder="+ Tag (press Enter)"
                          className="w-28 rounded border border-[#E6E3DB] bg-white px-2 py-0.5 text-[10px] text-[#18181B] focus:border-[#657858] focus:outline-none"
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Markdown Formatting Toolbar (Visible in Edit Mode) */}
                {isEditing && (
                  <div className="flex items-center gap-1 border-y border-[#E6E3DB] bg-[#FAF9F5] py-1.5 px-2 text-xs">
                    <button
                      type="button"
                      onClick={() => insertMarkdown("## ")}
                      title="Heading"
                      className="rounded p-1 text-[#575653] hover:bg-[#E6E3DB] hover:text-[#18181B]"
                    >
                      <Heading2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown("**", "**")}
                      title="Bold"
                      className="rounded p-1 text-[#575653] hover:bg-[#E6E3DB] hover:text-[#18181B]"
                    >
                      <Bold className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown("*", "*")}
                      title="Italic"
                      className="rounded p-1 text-[#575653] hover:bg-[#E6E3DB] hover:text-[#18181B]"
                    >
                      <Italic className="h-3.5 w-3.5" />
                    </button>
                    <div className="h-4 w-px bg-[#E6E3DB] mx-1" />
                    <button
                      type="button"
                      onClick={() => insertMarkdown("`", "`")}
                      title="Inline Code"
                      className="rounded p-1 text-[#575653] hover:bg-[#E6E3DB] hover:text-[#18181B]"
                    >
                      <Code className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown("```javascript\n", "\n```")}
                      title="Code Block"
                      className="rounded px-1.5 py-0.5 text-[11px] font-mono text-[#575653] hover:bg-[#E6E3DB] hover:text-[#18181B]"
                    >
                      &lt;/&gt;
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown("- ")}
                      title="Bullet List"
                      className="rounded p-1 text-[#575653] hover:bg-[#E6E3DB] hover:text-[#18181B]"
                    >
                      <List className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown("> ")}
                      title="Quote"
                      className="rounded p-1 text-[#575653] hover:bg-[#E6E3DB] hover:text-[#18181B]"
                    >
                      <Quote className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}

                {/* Content Workspace Area */}
                {isEditing ? (
                  <div className="flex-1">
                    <textarea
                      id="note-content-editor"
                      value={draftContent}
                      onChange={(e) => handleContentChange(e.target.value)}
                      placeholder="Write your detailed revision notes here in Markdown... Code blocks, approaches, time complexity invariants..."
                      className="w-full min-h-[420px] rounded-lg border border-[#E6E3DB] bg-[#FAF9F5] p-4 font-mono text-xs text-[#18181B] leading-relaxed focus:border-[#657858] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#657858]/15"
                    />
                  </div>
                ) : (
                  <div className="min-h-[420px] pt-2">
                    {renderMarkdownPreview(draftContent)}
                  </div>
                )}

                {/* Footer Metadata */}
                {!isCreatingNew && activeNote && (
                  <div className="pt-4 border-t border-[#E6E3DB] text-[10px] text-[#8E8B82] flex items-center justify-between">
                    <span>
                      Created: {new Date(activeNote.createdAt).toLocaleDateString()}
                    </span>
                    <span>
                      Last modified: {new Date(activeNote.updatedAt || activeNote.createdAt).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[#D5D1C6] bg-white p-12 text-center min-h-[400px] flex flex-col items-center justify-center space-y-3">
              <FileText className="h-10 w-10 text-[#8E8B82] opacity-40" />
              <h3 className="text-base font-bold text-[#18181B]">
                Select a note from the left or create a new one
              </h3>
              <p className="text-xs text-[#575653] max-w-sm">
                DevFlow notes provide a dedicated, distraction-free markdown and code workspace for recording problem intuitions and spaced repetition recall.
              </p>
              <Button variant="primary" size="sm" onClick={handleStartNewNote}>
                <Plus className="h-4 w-4" />
                <span>Create New Note</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notes;
