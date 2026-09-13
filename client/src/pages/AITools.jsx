import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Sparkles,
  FileCheck2,
  HelpCircle,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Save,
  RotateCw,
  ExternalLink,
  AlertTriangle,
  XCircle,
  Trash2,
  Lightbulb,
} from "lucide-react";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import {
  analyzeResume,
  generateInterviewQuestions,
  getProfileAIContext,
} from "../services/aiService";
import { createNote } from "../services/noteService";

const TOOLS = [
  {
    id: "resume",
    title: "Resume Analyzer",
    tagline: "Get structured feedback on your resume.",
    description: "Rigorous ATS keyword analysis, technical depth suggestions, quantifiable metrics audit, and prioritized action items for SWE roles.",
    icon: FileCheck2,
    badge: "Career Intelligence",
  },
  {
    id: "interview",
    title: "Interview Prep",
    tagline: "Generate interview questions based on your skills.",
    description: "Realistic technical coding and systems questions tailored to your target engineering role, difficulty level, and core technologies.",
    icon: HelpCircle,
    badge: "SDE Rounds",
  },
];

function AITools() {
  const [activeTool, setActiveTool] = useState(null); // null = directory view
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [savingToNotes, setSavingToNotes] = useState(false);
  const [savedNoteSuccess, setSavedNoteSuccess] = useState(null);

  const SAMPLE_RESUME = `Software Engineer with 2+ years experience building web applications using React, TypeScript, Node.js, Express, and MongoDB. Designed REST APIs handling 5,000 requests/sec and implemented JWT authentication and Redis caching. Strong knowledge of Data Structures, Algorithms, System Design, and Docker.`;

  const SAMPLE_JD = `We are seeking a Full Stack Software Engineer to build scalable web platforms and distributed APIs.

Requirements:
- 2+ years experience with React, TypeScript, and Node.js.
- Strong knowledge of RESTful API design, PostgreSQL or MongoDB, and Redis caching.
- Experience with CI/CD pipelines, cloud deployment, and Docker containerization.
- Solid foundation in Data Structures, Algorithms, and System Design.`;

  const [resumeText, setResumeText] = useState(SAMPLE_RESUME);
  const [jobDescription, setJobDescription] = useState(SAMPLE_JD);

  // Dynamic Interview Prep state
  const [interviewMode, setInterviewMode] = useState("Mixed");
  const [interviewDifficulty, setInterviewDifficulty] = useState("Mixed");
  const [previousQuestionsHistory, setPreviousQuestionsHistory] = useState([]);
  const [revealedHints, setRevealedHints] = useState({}); // { [idx]: boolean }
  const [interviewLoading, setInterviewLoading] = useState(false);
  const [copiedQuestionIdx, setCopiedQuestionIdx] = useState(null);

  const INTERVIEW_MODES = [
    { value: "Mixed", label: "Mixed (Comprehensive)" },
    { value: "Technical", label: "Technical Fundamentals" },
    { value: "Resume Based", label: "Resume Specific" },
    { value: "Project Based", label: "Project Architecture" },
    { value: "Behavioral", label: "Behavioral & Leadership" },
    { value: "System Design", label: "System Design" },
    { value: "Rapid Fire", label: "Rapid Fire Screening" },
  ];

  const INTERVIEW_DIFFICULTIES = [
    { value: "Mixed", label: "Mixed Difficulty" },
    { value: "Easy", label: "Easy" },
    { value: "Medium", label: "Medium" },
    { value: "Hard", label: "Hard" },
  ];

  const [interviewForm, setInterviewForm] = useState({
    inputMode: "resume_jd", // "resume_jd" or "role_skills"
    role: "Software Development Engineer",
    topic: "Full Stack & System Architecture",
    level: "Intermediate",
    skills: "React, Node.js, Distributed Systems, SQL",
    context: "",
    mode: "Mixed",
    difficulty: "Mixed",
    resumeText: SAMPLE_RESUME,
    jobDescription: SAMPLE_JD,
  });

  const handleToggleHint = (idx) => {
    setRevealedHints((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleCopyQuestion = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedQuestionIdx(idx);
    toast.success("Question copied to clipboard!");
    setTimeout(() => setCopiedQuestionIdx(null), 2000);
  };

  const getCategoryBadgeStyle = (category = "") => {
    const cat = (category || "").toLowerCase();
    if (cat.includes("technical") || cat.includes("fundamental")) {
      return "bg-[#FAF4E8] text-[#865B20] border-[#EADBBD]";
    }
    if (cat.includes("resume")) {
      return "bg-[#EEF2EB] text-[#4E5D44] border-[#C6D2BF]";
    }
    if (cat.includes("project")) {
      return "bg-[#EBF3FB] text-[#2C5282] border-[#BEE3F8]";
    }
    if (cat.includes("job") || cat.includes("description")) {
      return "bg-[#F3E8FF] text-[#6B21A8] border-[#DDD6FE]";
    }
    if (cat.includes("system") || cat.includes("design") || cat.includes("architecture")) {
      return "bg-[#FDF2F8] text-[#9D174D] border-[#FBCFE8]";
    }
    if (cat.includes("behavioral") || cat.includes("leadership")) {
      return "bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]";
    }
    if (cat.includes("rapid") || cat.includes("fire")) {
      return "bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]";
    }
    return "bg-[#FAF9F5] text-[#575653] border-[#E6E3DB]";
  };

  const getDifficultyBadgeStyle = (difficulty = "") => {
    const diff = (difficulty || "medium").toLowerCase();
    if (diff === "easy") {
      return "bg-[#EDF4EE] text-[#426447] border-[#C6D2BF]";
    }
    if (diff === "hard") {
      return "bg-[#FBF0F0] text-[#933D3D] border-[#E8BFBF]";
    }
    return "bg-[#FAF4E8] text-[#865B20] border-[#EADBBD]";
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(typeof text === "string" ? text : JSON.stringify(text, null, 2));
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const [searchParams] = useSearchParams();
  const [syncingProfile, setSyncingProfile] = useState(false);

  // Handle URL tool selection
  useEffect(() => {
    const toolParam = searchParams.get("tool");
    if (toolParam && ["resume", "interview"].includes(toolParam)) {
      setActiveTool(toolParam);
      setResult(null);
      setError("");
    }
  }, [searchParams]);

  const handleSyncProfileContext = async () => {
    try {
      setSyncingProfile(true);
      const res = await getProfileAIContext();
      const ctx = res.data;
      if (ctx) {
        setInterviewForm((prev) => ({
          ...prev,
          inputMode: "role_skills",
          role: ctx.user.targetRole || prev.role,
          skills: ctx.suggestedTopics.join(", "),
          topic: ctx.solvedStats.topics.length > 0 ? ctx.solvedStats.topics.slice(0, 4).join(", ") : prev.topic,
          context: ctx.interviewPromptContext || prev.context,
          level: ctx.user.experienceLevel || prev.level,
        }));
        toast.success("Synced skills, solved problems & projects from your DevFlow Profile!");
      }
    } catch (err) {
      toast.error(err.message || "Failed to sync profile context");
    } finally {
      setSyncingProfile(false);
    }
  };

  const handleTransitionToInterviewFromResume = (missingSkills = []) => {
    setActiveTool("interview");
    const gapsList = Array.isArray(missingSkills) ? missingSkills : [];
    setInterviewForm((prev) => ({
      ...prev,
      inputMode: "resume_jd",
      resumeText: resumeText,
      jobDescription: jobDescription,
      skills: gapsList.join(", "),
      topic: gapsList.length > 0 ? `Skill Gaps: ${gapsList.slice(0, 4).join(", ")}` : "Technical Fundamentals",
      mode: "Technical",
      difficulty: "Mixed",
    }));
    setInterviewMode("Technical");
    toast.success("Transferred resume and skill gaps to Interview Prep! Click 'Generate Questions' to begin.");
  };



  const handleOpenTool = (toolId) => {
    setActiveTool(toolId);
    setResult(null);
    setError("");
  };

  const formatResumeToMarkdown = (data) => {
    if (!data) return "";
    return `# Resume Alignment & ATS Analysis Report
**Overall Alignment Score**: ${data.overallScore || 0} / 100
**Job Match Score**: ${data.jobMatch?.score || 0} / 100
**ATS Compatibility**: ${data.atsCompatibility?.score || 0} / 100

## Executive Summary
${data.summary || "No summary available."}

## Job Match Analysis
${data.jobMatch?.explanation || ""}

## ATS Compatibility Audit
**Score**: ${data.atsCompatibility?.score || 0}/100
### Detected Formatting & Keyword Issues:
${(data.atsCompatibility?.issues || []).map((i) => `- ${i}`).join("\n") || "- None detected"}

### ATS Recommendations:
${(data.atsCompatibility?.recommendations || []).map((r) => `- ${r}`).join("\n") || "- None"}

## Skills Alignment Matrix
- **Matched Skills**: ${(data.skillsAnalysis?.matched || []).join(", ") || "None"}
- **Partially Matched Skills**: ${(data.skillsAnalysis?.partiallyMatched || []).join(", ") || "None"}
- **Missing Skills**: ${(data.skillsAnalysis?.missing || []).join(", ") || "None"}

## Technical Keywords Analysis
- **Core Role Keywords**: ${(data.keywordAnalysis?.importantKeywords || []).join(", ") || "None"}
- **Missing Keywords**: ${(data.keywordAnalysis?.missingKeywords || []).join(", ") || "None"}
- **Generic / Overused Keywords**: ${(data.keywordAnalysis?.overusedKeywords || []).join(", ") || "None"}

## Experience & Scope Evaluation
### Strengths:
${(data.experienceAnalysis?.strengths || data.resumeStrengths || []).map((s) => `- ${s}`).join("\n")}

### Gaps / Areas to Strengthen:
${(data.experienceAnalysis?.gaps || data.resumeWeaknesses || []).map((g) => `- ${g}`).join("\n")}

## Recommended Bullet Point Improvements
${(data.improvements || [])
  .map(
    (imp, idx) => `### ${idx + 1}. [${imp.priority?.toUpperCase() || "MEDIUM"}] ${imp.section || "Section"}
- **Problem**: ${imp.problem}
- **Recommendation**: ${imp.recommendation}
- **Example Revision**:
> ${imp.example}
`
  )
  .join("\n")}

## Recommended Portfolio Projects
${(data.projectRecommendations || []).map((p) => `- ${p}`).join("\n")}

## Strategic Action Plan
${(data.actionPlan || []).map((step, idx) => `${idx + 1}. ${step}`).join("\n")}

## Technical Interview Preparation
### Likely Technical Topics:
${(data.interviewPreparation?.likelyTopics || []).map((t) => `- ${t}`).join("\n")}

### Tailored SDE Interview Questions:
${(data.interviewPreparation?.questions && data.interviewPreparation.questions.length > 0)
  ? data.interviewPreparation.questions.map((q, idx) => {
      const text = typeof q === "string" ? q : q.question;
      const cat = q.category ? ` [${q.category}]` : "";
      const diff = q.difficulty ? ` (${q.difficulty})` : "";
      const reason = q.reason ? `\n   - **Why they're asking:** ${q.reason}` : "";
      const hint = q.hint ? `\n   - **Clue / Invariants:** ${q.hint}` : "";
      return `${idx + 1}. **${text}**${cat}${diff}${reason}${hint}`;
    }).join("\n\n")
  : (data.interviewPreparation?.likelyQuestions || []).map((q, idx) => `${idx + 1}. ${q}`).join("\n")}
`;
  };

  const formatInterviewToMarkdown = (data) => {
    if (!data) return "";
    const questions = data.questions || [];
    return `# Technical Interview Preparation (${interviewMode} · ${interviewDifficulty})

## Focus Areas & Core Concepts
${(data.likelyTopics || []).map((t) => `- ${t}`).join("\n")}

## Interview Questions (${questions.length} Questions)
${questions.map((q, idx) => {
  const text = typeof q === "string" ? q : q.question;
  const cat = q.category ? ` [${q.category}]` : "";
  const diff = q.difficulty ? ` (${q.difficulty})` : "";
  const reason = q.reason ? `\n   - **Why they're asking:** ${q.reason}` : "";
  const hint = q.hint ? `\n   - **Clue / Invariants:** ${q.hint}` : "";
  return `### Q${idx + 1}. ${text}${cat}${diff}${reason}${hint}`;
}).join("\n\n")}
`;
  };

  const handleRunResume = async (e) => {
    if (e) e.preventDefault();
    if (loading) return; // Prevent duplicate submissions
    if (!resumeText.trim() || resumeText.trim().length < 50) {
      toast.error("Resume content must be at least 50 characters.");
      return;
    }
    if (!jobDescription.trim() || jobDescription.trim().length < 30) {
      toast.error("Job description must be at least 30 characters.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      setResult(null);
      setSavedNoteSuccess(null);
      setLoadingStage("Evaluating resume alignment against target job requirements...");
      const res = await analyzeResume({
        resumeText: resumeText.trim(),
        jobDescription: jobDescription.trim(),
      });
      setResult(res.data);
    } catch (err) {
      setError(err.message || "Failed to analyze resume");
    } finally {
      setLoading(false);
      setLoadingStage("");
    }
  };

  const handleClearResume = () => {
    setResumeText("");
    setJobDescription("");
    setResult(null);
    setError("");
    setSavedNoteSuccess(null);
    toast.success("Inputs cleared");
  };

  const handleLoadSampleResume = () => {
    setResumeText(SAMPLE_RESUME);
    setJobDescription(SAMPLE_JD);
    toast.success("Loaded sample resume and job description");
  };

  const handleGenerateFreshQuestions = async (targetMode = interviewMode, targetDiff = interviewDifficulty) => {
    if (interviewLoading) return;
    try {
      setInterviewLoading(true);
      // Anti-duplication: gather all previously generated questions
      const currentQuestions = (result?.interviewPreparation?.questions || []).map((q) =>
        typeof q === "string" ? q : q.question
      );
      const combinedHistory = Array.from(new Set([...previousQuestionsHistory, ...currentQuestions]));
      setPreviousQuestionsHistory(combinedHistory);

      const res = await generateInterviewQuestions({
        resumeText: resumeText.trim(),
        jobDescription: jobDescription.trim(),
        mode: targetMode,
        difficulty: targetDiff,
        previousQuestions: combinedHistory,
      });

      if (res?.data) {
        const newQuestions = res.data.questions || [];
        setResult((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            interviewPreparation: {
              ...prev.interviewPreparation,
              questions: newQuestions,
              likelyQuestions: res.data.likelyQuestions || newQuestions.map((q) => q.question),
              likelyTopics: res.data.likelyTopics || prev.interviewPreparation?.likelyTopics || [],
            },
          };
        });
        setRevealedHints({});
        toast.success(`Generated ${newQuestions.length} fresh interview questions!`);
      }
    } catch (err) {
      toast.error(err.message || "Failed to generate fresh interview questions");
    } finally {
      setInterviewLoading(false);
    }
  };

  const handleRunInterview = async (e) => {
    if (e) e.preventDefault();
    if (loading) return;
    try {
      setLoading(true);
      setError("");
      setResult(null);
      setSavedNoteSuccess(null);
      setRevealedHints({});
      setLoadingStage("Generating fresh tailored technical interview questions...");

      const isResumeMode = interviewForm.inputMode === "resume_jd";
      const payload = {
        mode: interviewForm.mode,
        difficulty: interviewForm.difficulty,
        previousQuestions: previousQuestionsHistory,
        ...(isResumeMode
          ? {
              resumeText: (interviewForm.resumeText || "").trim(),
              jobDescription: (interviewForm.jobDescription || "").trim(),
            }
          : {
              role: interviewForm.role,
              skills: interviewForm.skills,
              topic: interviewForm.topic,
              level: interviewForm.level,
              context: interviewForm.context,
            }),
      };

      const res = await generateInterviewQuestions(payload);
      if (res?.data) {
        setResult(res.data);
        const newQTexts = (res.data.questions || []).map((q) => (typeof q === "string" ? q : q.question));
        setPreviousQuestionsHistory((prev) => Array.from(new Set([...prev, ...newQTexts])));
      }
    } catch (err) {
      setError(err.message || "Failed to generate interview questions");
    } finally {
      setLoading(false);
      setLoadingStage("");
    }
  };

  const handleSaveToNotes = async (title, content, tags = []) => {
    try {
      setSavingToNotes(true);
      const created = await createNote({
        title,
        content,
        tags: [...tags, "ai-generated"],
      });
      setSavedNoteSuccess(created.note);

      toast.success(
        (t) => (
          <span className="flex items-center gap-2">
            <span>Saved to DevFlow Technical Notes!</span>
            <Link
              to="/notes"
              className="font-bold underline text-[#4E5D44] hover:text-[#18181B]"
              onClick={() => toast.dismiss(t.id)}
            >
              Open Notes →
            </Link>
          </span>
        ),
        { duration: 4000 }
      );
    } catch (err) {
      toast.error(err.message || "Failed to save to Notes");
    } finally {
      setSavingToNotes(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* DIRECTORY VIEW: When no tool is opened */}
      {!activeTool ? (
        <div className="space-y-8">
          {/* Header */}
          <div className="border-b border-[#E6E3DB] pb-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#657858] tracking-wider uppercase mb-1">
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI-powered career and interview preparation</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#18181B]">
              AI Tools
            </h1>
            <p className="text-sm text-[#575653] mt-1 max-w-2xl">
              Elevate your engineering career with rigorous ATS resume auditing and realistic dynamic interview simulations tailored to your target roles.
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl gap-6">
            {TOOLS.map((tool) => {
              const Icon = tool.icon;
              return (
                <div
                  key={tool.id}
                  className="rounded-xl border border-[#E6E3DB] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-[#D5D1C6] hover:shadow-xs transition-all group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EEF2EB] text-[#4E5D44] border border-[#C6D2BF] group-hover:scale-105 transition-transform">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="rounded bg-[#FAF9F5] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#8E8B82] border border-[#E6E3DB]">
                        {tool.badge}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h2 className="text-base font-bold text-[#18181B]">
                        {tool.title}
                      </h2>
                      <p className="text-xs font-medium text-[#657858]">
                        {tool.tagline}
                      </p>
                    </div>

                    <p className="text-xs text-[#575653] leading-relaxed">
                      {tool.description}
                    </p>
                  </div>

                  <div className="pt-6">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleOpenTool(tool.id)}
                      className="w-full justify-center group-hover:border-[#657858] group-hover:text-[#18181B]"
                    >
                      <span>Open Tool</span>
                      <ArrowRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* DEDICATED TOOL WORKSPACE VIEW */
        <div className="space-y-6">
          {/* Breadcrumb & Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E6E3DB] pb-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTool(null)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#575653] hover:text-[#18181B] transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>All AI Tools</span>
              </button>
              <span className="text-xs text-[#8E8B82]">/</span>
              <h1 className="text-sm font-bold text-[#18181B] tracking-tight">
                {TOOLS.find((t) => t.id === activeTool)?.title}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setResult(null);
                  setError("");
                }}
                className="inline-flex items-center gap-1 text-xs text-[#8E8B82] hover:text-[#18181B] transition-colors"
              >
                <RotateCw className="h-3 w-3" />
                <span>Reset Form</span>
              </button>
            </div>
          </div>

          {/* Main Workspace */}
          {activeTool === "resume" ? (
            <div className="space-y-6">
              {/* Saved Note Success Alert */}
              {savedNoteSuccess && (
                <div className="rounded-xl border border-[#C6D2BF] bg-[#F2F5F0] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#4E5D44] shrink-0" />
                    <div>
                      <span className="font-semibold text-[#18181B]">
                        Resume Analysis report saved successfully!
                      </span>
                      <p className="text-[#575653] text-[11px]">
                        Saved to your DevFlow technical notebook as "{savedNoteSuccess.title}".
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      to="/notes"
                      className="inline-flex items-center gap-1 font-semibold text-[#4E5D44] hover:text-[#2C3527] underline"
                    >
                      <span>Open in Notes</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Dual Large Inputs: Resume (Left) and Job Description (Right) */}
              <div className="rounded-xl border border-[#E6E3DB] bg-white p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E6E3DB] pb-3">
                  <div>
                    <h2 className="text-base font-bold text-[#18181B] flex items-center gap-2">
                      <FileCheck2 className="h-4 w-4 text-[#4E5D44]" />
                      <span>Resume & Target Role Alignment</span>
                    </h2>
                    <p className="text-xs text-[#575653]">
                      Compare your resume specifically against the target role requirements to measure fit, detect missing keywords, and resolve qualification gaps.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleLoadSampleResume}
                      disabled={loading}
                      className="text-xs text-[#657858] hover:text-[#4E5D44] hover:underline font-medium disabled:opacity-50"
                    >
                      Load Sample SDE Role
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Left: Resume Text */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[#18181B] flex items-center gap-1.5">
                        <span>Resume Text</span>
                        <span className="text-[10px] font-normal text-[#8E8B82]">(plain text)</span>
                      </label>
                      <span className={`text-[10px] font-mono ${resumeText.length > 20000 ? "text-[#933D3D] font-bold" : resumeText.length < 50 ? "text-[#8E8B82]" : "text-[#4E5D44]"}`}>
                        {resumeText.length} / 20,000 chars {resumeText.length < 50 && "(min 50)"}
                      </span>
                    </div>
                    <textarea
                      rows={14}
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      disabled={loading}
                      placeholder="Paste your plain text resume here (summary, skills, work experience, projects, education)..."
                      className="w-full rounded-lg border border-[#E6E3DB] bg-[#FAF9F5] p-3.5 font-mono text-xs text-[#18181B] leading-relaxed focus:border-[#657858] focus:bg-white focus:outline-none resize-y disabled:opacity-60"
                      required
                    />
                  </div>

                  {/* Right: Job Description Text */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[#18181B] flex items-center gap-1.5">
                        <span>Job Description Text</span>
                        <span className="text-[10px] font-normal text-[#8E8B82]">(target role)</span>
                      </label>
                      <span className={`text-[10px] font-mono ${jobDescription.length > 20000 ? "text-[#933D3D] font-bold" : jobDescription.length < 30 ? "text-[#8E8B82]" : "text-[#4E5D44]"}`}>
                        {jobDescription.length} / 20,000 chars {jobDescription.length < 30 && "(min 30)"}
                      </span>
                    </div>
                    <textarea
                      rows={14}
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      disabled={loading}
                      placeholder="Paste the target job description here (role overview, required qualifications, nice-to-haves, tech stack)..."
                      className="w-full rounded-lg border border-[#E6E3DB] bg-[#FAF9F5] p-3.5 font-mono text-xs text-[#18181B] leading-relaxed focus:border-[#657858] focus:bg-white focus:outline-none resize-y disabled:opacity-60"
                      required
                    />
                  </div>
                </div>

                {/* Controls Bar Below Textareas */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#E6E3DB]/80">
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={handleRunResume}
                      disabled={loading || !resumeText.trim() || !jobDescription.trim()}
                      className="shadow-xs px-5"
                    >
                      <FileCheck2 className="h-4 w-4 mr-1.5" />
                      <span>{loading ? "Analyzing Alignment..." : "Analyze Resume"}</span>
                    </Button>

                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={handleClearResume}
                      disabled={loading || (!resumeText && !jobDescription)}
                      className="text-[#575653] hover:text-[#933D3D] hover:border-[#E8BFBF]"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                      <span>Clear Inputs</span>
                    </Button>
                  </div>

                  <span className="text-[11px] text-[#8E8B82] flex items-center gap-1.5">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#657858]" />
                    Evaluates resume strictly against the target JD • Zero fabricated experience
                  </span>
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="rounded-xl border border-[#E6E3DB] bg-white p-12 text-center space-y-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                  <LoadingSpinner message={loadingStage || "Evaluating resume against job description..."} />
                  <p className="text-[11px] text-[#8E8B82]">
                    Cross-referencing candidate qualifications against job requirements, assessing ATS readability, and deriving interview topics...
                  </p>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="rounded-xl border border-[#E8BFBF] bg-[#FBF0F0] p-4 text-xs text-[#933D3D] space-y-3">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-bold">Analysis Failed</p>
                      <p>{error}</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-[#E8BFBF]/60 flex items-center justify-between">
                    <span className="text-[11px] text-[#933D3D]/80">
                      Ensure both resume and job description have valid text content and retry.
                    </span>
                    <Button
                      type="button"
                      variant="secondary"
                      size="xs"
                      onClick={handleRunResume}
                      className="border-[#E8BFBF] bg-white text-[#933D3D] hover:bg-[#FBF0F0]"
                    >
                      <RotateCw className="h-3 w-3 mr-1" />
                      <span>Retry Analysis</span>
                    </Button>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!loading && !result && !error && (
                <div className="rounded-xl border border-dashed border-[#D5D1C6] bg-white p-12 text-center space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                  <div className="h-12 w-12 rounded-full bg-[#EEF2EB] text-[#4E5D44] mx-auto flex items-center justify-center">
                    <FileCheck2 className="h-6 w-6" />
                  </div>
                  <div className="space-y-1.5 max-w-md mx-auto">
                    <h3 className="text-base font-bold text-[#18181B]">
                      Resume & Job Description Analysis
                    </h3>
                    <p className="text-xs text-[#575653] leading-relaxed">
                      Paste your resume and the job description to see how well your experience matches this role.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto pt-3 text-left">
                    <div className="rounded-lg border border-[#E6E3DB] bg-[#FAF9F5] p-3.5 text-xs space-y-1">
                      <p className="font-bold text-[#18181B]">Objective Fit</p>
                      <p className="text-[11px] text-[#575653]">Strict grounded comparison against explicit requirements without invented skills.</p>
                    </div>
                    <div className="rounded-lg border border-[#E6E3DB] bg-[#FAF9F5] p-3.5 text-xs space-y-1">
                      <p className="font-bold text-[#18181B]">ATS Readability</p>
                      <p className="text-[11px] text-[#575653]">Audits keyword density, unquantified claims, and layout parsing issues.</p>
                    </div>
                    <div className="rounded-lg border border-[#E6E3DB] bg-[#FAF9F5] p-3.5 text-xs space-y-1">
                      <p className="font-bold text-[#18181B]">Concrete Examples</p>
                      <p className="text-[11px] text-[#575653]">Includes actionable before-and-after bullet rewrites with metrics.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Results Dashboard */}
              {!loading && result && (
                <div className="space-y-6">
                  {/* Results Header Action Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-xl border border-[#E6E3DB] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="inline-block h-2 w-2 rounded-full bg-[#4E5D44]" />
                      <span className="font-bold text-[#18181B]">Resume Analysis Dashboard</span>
                      <span className="text-[#8E8B82]">·</span>
                      <span className="text-[10px] text-[#8E8B82] font-mono">
                        {result._meta?.provider === "heuristic"
                          ? "Heuristic Fallback Engine"
                          : `${result._meta?.provider || "AI"} (${result._meta?.model || "v1"})`}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleRunResume}
                        disabled={loading}
                        title="Re-run analysis"
                        className="inline-flex items-center gap-1 rounded-md border border-[#E6E3DB] bg-white px-2.5 py-1.5 text-xs text-[#575653] hover:text-[#18181B] transition-colors disabled:opacity-50"
                      >
                        <RotateCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
                        <span>Analyze Again</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopy(formatResumeToMarkdown(result))}
                        className="inline-flex items-center gap-1.5 rounded-md border border-[#E6E3DB] bg-white px-2.5 py-1.5 text-xs text-[#575653] hover:text-[#18181B] transition-colors"
                      >
                        {copied ? <Check className="h-3.5 w-3.5 text-[#657858]" /> : <Copy className="h-3.5 w-3.5" />}
                        <span>{copied ? "Copied" : "Copy Report"}</span>
                      </button>

                      <Button
                        variant="secondary"
                        size="xs"
                        loading={savingToNotes}
                        onClick={() => {
                          const title = `Resume Analysis — ${result.jobMatch?.score || result.overallScore}% Match`;
                          const content = formatResumeToMarkdown(result);
                          handleSaveToNotes(title, content, ["resume-analysis", "career-prep"]);
                        }}
                      >
                        <Save className="h-3 w-3 text-[#657858] mr-1" />
                        <span>Save to Notes</span>
                      </Button>
                    </div>
                  </div>

                  {/* 1. KEY SCORES & OVERVIEW */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Card 1: Overall Match Score */}
                    <div className="rounded-xl border border-[#E6E3DB] bg-white p-5 space-y-3 flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8B82]">
                            Overall Match Score
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            result.overallScore >= 75 ? "bg-[#EDF4EE] text-[#426447]" : result.overallScore >= 50 ? "bg-[#FAF4E8] text-[#865B20]" : "bg-[#FBF0F0] text-[#933D3D]"
                          }`}>
                            {result.overallScore >= 75 ? "Strong Match" : result.overallScore >= 50 ? "Moderate Match" : "Significant Gaps"}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className={`text-4xl font-black ${
                            result.overallScore >= 75 ? "text-[#426447]" : result.overallScore >= 50 ? "text-[#865B20]" : "text-[#933D3D]"
                          }`}>
                            {result.overallScore}
                          </span>
                          <span className="text-xs text-[#8E8B82] font-semibold">/ 100</span>
                        </div>
                      </div>
                      <div className="space-y-2 pt-2 border-t border-[#E6E3DB]/70">
                        <div className="h-1.5 w-full bg-[#E6E3DB] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              result.overallScore >= 75 ? "bg-[#426447]" : result.overallScore >= 50 ? "bg-[#865B20]" : "bg-[#933D3D]"
                            }`}
                            style={{ width: `${Math.min(100, Math.max(0, result.overallScore))}%` }}
                          />
                        </div>
                        <p className="text-[11px] text-[#575653] leading-relaxed">
                          {result.summary}
                        </p>
                      </div>
                    </div>

                    {/* Card 2: Job Match Score */}
                    <div className="rounded-xl border border-[#E6E3DB] bg-white p-5 space-y-3 flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#4E5D44]">
                            Job Match Score
                          </span>
                          <span className="text-xs font-mono font-bold text-[#4E5D44]">
                            {result.jobMatch?.score || 0}%
                          </span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-black text-[#4E5D44]">
                            {result.jobMatch?.score || 0}
                          </span>
                          <span className="text-xs text-[#8E8B82] font-semibold">/ 100</span>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-[#E6E3DB]/70">
                        <p className="text-[11px] text-[#575653] leading-relaxed">
                          {result.jobMatch?.explanation || "Strict evaluation against stated job responsibilities."}
                        </p>
                      </div>
                    </div>

                    {/* Card 3: ATS Compatibility */}
                    <div className="rounded-xl border border-[#E6E3DB] bg-white p-5 space-y-3 flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#575653]">
                            ATS Compatibility
                          </span>
                          <span className="text-xs font-mono font-bold text-[#575653]">
                            {result.atsCompatibility?.score || 0}%
                          </span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-black text-[#18181B]">
                            {result.atsCompatibility?.score || 0}
                          </span>
                          <span className="text-xs text-[#8E8B82] font-semibold">/ 100</span>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-[#E6E3DB]/70 space-y-1.5">
                        {result.atsCompatibility?.issues?.length > 0 ? (
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#933D3D]">
                              {result.atsCompatibility.issues.length} ATS Flags:
                            </span>
                            <ul className="list-disc ml-3.5 space-y-0.5 text-[11px] text-[#933D3D]">
                              {result.atsCompatibility.issues.slice(0, 2).map((issue, idx) => (
                                <li key={idx}>{issue}</li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <p className="text-[11px] text-[#426447]">
                            ✓ Clean layout, parseable structure, and strong standard headings.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 2. SKILLS ALIGNMENT MATRIX */}
                  <div className="rounded-xl border border-[#E6E3DB] bg-white p-5 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                    <div className="flex items-center justify-between border-b border-[#E6E3DB] pb-3">
                      <div>
                        <h3 className="text-sm font-bold text-[#18181B]">
                          Skills Alignment Matrix
                        </h3>
                        <p className="text-[11px] text-[#575653]">
                          Categorized breakdown comparing technical competencies in the resume against role requirements.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Matched Skills */}
                      <div className="rounded-lg border border-[#C6D2BF] bg-[#EDF4EE]/40 p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#426447] flex items-center gap-1.5">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Matched Skills ({result.skillsAnalysis?.matched?.length || 0})</span>
                          </span>
                        </div>
                        <p className="text-[10px] text-[#575653]">Demonstrated in resume & required by JD:</p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {(result.skillsAnalysis?.matched || []).length > 0 ? (
                            result.skillsAnalysis.matched.map((skill, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 rounded bg-white px-2 py-0.5 text-[10px] font-semibold text-[#426447] border border-[#C6D2BF]"
                              >
                                <Check className="h-2.5 w-2.5" />
                                <span>{skill}</span>
                              </span>
                            ))
                          ) : (
                            <span className="text-[11px] text-[#8E8B82] italic">No direct keyword matches detected.</span>
                          )}
                        </div>
                      </div>

                      {/* Partially Matched Skills */}
                      <div className="rounded-lg border border-[#EAD5AC] bg-[#FAF4E8]/40 p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#865B20] flex items-center gap-1.5">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            <span>Partially Matched ({result.skillsAnalysis?.partiallyMatched?.length || 0})</span>
                          </span>
                        </div>
                        <p className="text-[10px] text-[#575653]">Adjacent experience or limited depth:</p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {(result.skillsAnalysis?.partiallyMatched || []).length > 0 ? (
                            result.skillsAnalysis.partiallyMatched.map((skill, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 rounded bg-white px-2 py-0.5 text-[10px] font-semibold text-[#865B20] border border-[#EAD5AC]"
                              >
                                <span>~ {skill}</span>
                              </span>
                            ))
                          ) : (
                            <span className="text-[11px] text-[#8E8B82] italic">No partially matched skills.</span>
                          )}
                        </div>
                      </div>

                      {/* Missing Skills */}
                      <div className="rounded-lg border border-[#E8BFBF] bg-[#FBF0F0]/40 p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#933D3D] flex items-center gap-1.5">
                            <XCircle className="h-3.5 w-3.5" />
                            <span>Missing Skills ({result.skillsAnalysis?.missing?.length || 0})</span>
                          </span>
                        </div>
                        <p className="text-[10px] text-[#575653]">Required by JD, absent from resume:</p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {(result.skillsAnalysis?.missing || []).length > 0 ? (
                            result.skillsAnalysis.missing.map((skill, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 rounded bg-white px-2 py-0.5 text-[10px] font-semibold text-[#933D3D] border border-[#E8BFBF]"
                              >
                                <span>✕ {skill}</span>
                              </span>
                            ))
                          ) : (
                            <span className="text-[11px] text-[#426447]">✓ All requested skills accounted for!</span>
                          )}
                        </div>

                        {(result.skillsAnalysis?.missing || []).length > 0 && (
                          <div className="pt-2 border-t border-[#E8BFBF]/50 flex items-center justify-between">
                            <span className="text-[10px] text-[#933D3D]">Want to prepare for these gap topics?</span>
                            <button
                              type="button"
                              onClick={() => handleTransitionToInterviewFromResume(result.skillsAnalysis.missing)}
                              className="inline-flex items-center gap-1 rounded bg-white px-2 py-1 text-[11px] font-bold text-[#933D3D] border border-[#E8BFBF] hover:bg-[#FBF0F0] transition-colors"
                            >
                              <HelpCircle className="h-3 w-3" />
                              <span>Practice Interview Questions on Gaps →</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 3. TECHNICAL KEYWORDS ANALYSIS */}
                  {result.keywordAnalysis && (
                    <div className="rounded-xl border border-[#E6E3DB] bg-white p-5 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                      <h3 className="text-sm font-bold text-[#18181B]">
                        Technical Keyword Coverage
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#575653]">
                            Required Role Keywords
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {(result.keywordAnalysis.importantKeywords || []).map((kw, i) => (
                              <span key={i} className="rounded bg-[#FAF9F5] px-2 py-0.5 text-[10px] text-[#18181B] border border-[#E6E3DB]">
                                {kw}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#865B20]">
                            Missing Keywords
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {(result.keywordAnalysis.missingKeywords || []).length > 0 ? (
                              result.keywordAnalysis.missingKeywords.map((kw, i) => (
                                <span key={i} className="rounded bg-[#FAF4E8] px-2 py-0.5 text-[10px] font-medium text-[#865B20] border border-[#EAD5AC]">
                                  + {kw}
                                </span>
                              ))
                            ) : (
                              <span className="text-[11px] text-[#426447]">No missing keywords detected.</span>
                            )}
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8B82]">
                            Generic / Low-Impact Terms
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {(result.keywordAnalysis.overusedKeywords || []).length > 0 ? (
                              result.keywordAnalysis.overusedKeywords.map((kw, i) => (
                                <span key={i} className="rounded bg-[#FAF9F5] px-2 py-0.5 text-[10px] text-[#8E8B82] border border-[#E6E3DB] line-through">
                                  {kw}
                                </span>
                              ))
                            ) : (
                              <span className="text-[11px] text-[#575653]">No generic buzzwords flagged.</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 4. EXPERIENCE STRENGTHS & WEAKNESSES */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Strengths */}
                    <div className="rounded-xl border border-[#C6D2BF] bg-[#EDF4EE]/30 p-5 space-y-2 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#426447] flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Verified Strengths & Alignment</span>
                      </span>
                      <ul className="list-disc ml-4 space-y-1.5 text-xs text-[#18181B]">
                        {(result.experienceAnalysis?.strengths || result.resumeStrengths || []).map((s, idx) => (
                          <li key={idx} className="leading-relaxed">{s}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Gaps / Weaknesses */}
                    <div className="rounded-xl border border-[#E8BFBF] bg-[#FBF0F0]/30 p-5 space-y-2 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#933D3D] flex items-center gap-1.5">
                        <AlertCircle className="h-3.5 w-3.5" />
                        <span>Experience Gaps & Areas to Strengthen</span>
                      </span>
                      <ul className="list-disc ml-4 space-y-1.5 text-xs text-[#18181B]">
                        {(result.experienceAnalysis?.gaps || result.resumeWeaknesses || []).map((g, idx) => (
                          <li key={idx} className="leading-relaxed">{g}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* 5. PRIORITIZED IMPROVEMENTS WITH BEFORE/AFTER EXAMPLES */}
                  {Array.isArray(result.improvements) && result.improvements.length > 0 && (
                    <div className="rounded-xl border border-[#E6E3DB] bg-white p-5 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                      <div className="border-b border-[#E6E3DB] pb-3">
                        <h3 className="text-sm font-bold text-[#18181B]">
                          Recommended Section Improvements
                        </h3>
                        <p className="text-[11px] text-[#575653]">
                          Prioritized recommendations with concrete rewritten examples to maximize impact and match criteria.
                        </p>
                      </div>

                      <div className="space-y-4">
                        {result.improvements.map((imp, idx) => (
                          <div
                            key={idx}
                            className="rounded-lg border border-[#E6E3DB] bg-[#FAF9F5]/60 p-4 space-y-3"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                                    imp.priority?.toLowerCase() === "high"
                                      ? "bg-[#FBF0F0] text-[#933D3D]"
                                      : imp.priority?.toLowerCase() === "medium"
                                      ? "bg-[#FAF4E8] text-[#865B20]"
                                      : "bg-[#EEF2EB] text-[#4E5D44]"
                                  }`}
                                >
                                  {imp.priority} Priority
                                </span>
                                <span className="text-xs font-bold text-[#18181B]">
                                  {imp.section}
                                </span>
                              </div>
                            </div>

                            <div className="text-xs space-y-1">
                              <p className="text-[#933D3D] font-medium">
                                <span className="font-bold">Problem:</span> {imp.problem}
                              </p>
                              <p className="text-[#18181B] leading-relaxed">
                                <span className="font-bold text-[#4E5D44]">Recommendation:</span> {imp.recommendation}
                              </p>
                            </div>

                            {imp.example && (
                              <div className="rounded-md border border-[#C6D2BF] bg-[#EDF4EE]/50 p-2.5 text-xs">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#426447] block mb-1">
                                  Example Revision / Rewritten Bullet:
                                </span>
                                <p className="font-mono text-[11px] text-[#18181B] leading-relaxed">
                                  {imp.example}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 6. RECOMMENDED PROJECTS & ACTION PLAN */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Project Recommendations */}
                    <div className="rounded-xl border border-[#E6E3DB] bg-white p-5 space-y-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#657858]">
                        Portfolio Projects to Bridge Gaps
                      </span>
                      <ul className="list-disc ml-4 space-y-2 text-xs text-[#18181B]">
                        {(result.projectRecommendations || []).map((proj, idx) => (
                          <li key={idx} className="leading-relaxed">{proj}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Plan */}
                    <div className="rounded-xl border border-[#E6E3DB] bg-white p-5 space-y-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#18181B]">
                          Step-by-Step Action Plan
                        </span>
                      </div>
                      <div className="space-y-2 text-xs text-[#18181B]">
                        {(result.actionPlan || []).map((step, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="font-bold text-[#657858] shrink-0">{idx + 1}.</span>
                            <span className="leading-relaxed">{step}</span>
                          </div>
                        ))}
                      </div>
                      <div className="pt-2.5 border-t border-[#E6E3DB] flex justify-end">
                        <button
                          type="button"
                          onClick={() =>
                            handleTransitionToInterviewFromResume(
                              result.skillsAnalysis?.missing || result.keywordAnalysis?.missingKeywords || []
                            )
                          }
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[#4E5D44] bg-[#EEF2EB] px-3 py-1.5 text-xs font-semibold text-[#4E5D44] hover:bg-[#E3EBE0] transition-colors cursor-pointer"
                        >
                          <HelpCircle className="h-3.5 w-3.5" />
                          <span>Launch Targeted Interview Prep →</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 7. DYNAMIC TECHNICAL INTERVIEW PREPARATION */}
                  {result.interviewPreparation && (
                    <div className="rounded-xl border border-[#E6E3DB] bg-white p-5 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                      <div className="border-b border-[#E6E3DB] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-[#18181B]">
                              Technical Interview Preparation
                            </h3>
                            <span className="rounded bg-[#EEF2EB] px-2 py-0.5 text-[10px] font-semibold text-[#4E5D44] border border-[#C6D2BF]">
                              Dynamic Simulation
                            </span>
                          </div>
                          <p className="text-[11px] text-[#575653] mt-0.5">
                            Tailored, non-cached questions generated strictly from your resume & target JD requirements.
                          </p>
                        </div>

                        {/* Interactive Mode, Difficulty & Fresh Generation Controls */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <select
                            value={interviewMode}
                            onChange={(e) => {
                              const newMode = e.target.value;
                              setInterviewMode(newMode);
                              handleGenerateFreshQuestions(newMode, interviewDifficulty);
                            }}
                            disabled={interviewLoading}
                            className="rounded-md border border-[#E6E3DB] bg-[#FAF9F5] py-1 px-2 text-xs font-medium text-[#18181B] focus:border-[#657858] focus:outline-none disabled:opacity-60"
                          >
                            {INTERVIEW_MODES.map((m) => (
                              <option key={m.value} value={m.value}>
                                {m.label}
                              </option>
                            ))}
                          </select>

                          <select
                            value={interviewDifficulty}
                            onChange={(e) => {
                              const newDiff = e.target.value;
                              setInterviewDifficulty(newDiff);
                              handleGenerateFreshQuestions(interviewMode, newDiff);
                            }}
                            disabled={interviewLoading}
                            className="rounded-md border border-[#E6E3DB] bg-[#FAF9F5] py-1 px-2 text-xs font-medium text-[#18181B] focus:border-[#657858] focus:outline-none disabled:opacity-60"
                          >
                            {INTERVIEW_DIFFICULTIES.map((d) => (
                              <option key={d.value} value={d.value}>
                                {d.label}
                              </option>
                            ))}
                          </select>

                          <Button
                            type="button"
                            variant="primary"
                            size="xs"
                            disabled={interviewLoading}
                            onClick={() => handleGenerateFreshQuestions()}
                            className="shadow-xs"
                          >
                            <RotateCw className={`h-3 w-3 mr-1 ${interviewLoading ? "animate-spin" : ""}`} />
                            <span>{interviewLoading ? "Generating..." : "Generate New Questions"}</span>
                          </Button>
                        </div>
                      </div>

                      {/* Likely Topics */}
                      {Array.isArray(result.interviewPreparation.likelyTopics) &&
                        result.interviewPreparation.likelyTopics.length > 0 && (
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8B82] block">
                              Focus Concepts & Core Architectures:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {result.interviewPreparation.likelyTopics.map((topic, idx) => (
                                <span
                                  key={idx}
                                  className="rounded bg-[#FAF9F5] px-2.5 py-1 text-xs font-semibold text-[#18181B] border border-[#E6E3DB]"
                                >
                                  {topic}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                      {/* Loading State Banner */}
                      {interviewLoading && (
                        <div className="rounded-xl border border-[#C6D2BF] bg-[#FAF9F5] p-8 text-center space-y-2">
                          <LoadingSpinner message="Generating a fresh interview set..." />
                          <p className="text-xs text-[#575653]">
                            Synthesizing fresh technical, architectural, and behavioral questions without repetitions...
                          </p>
                        </div>
                      )}

                      {/* Question Cards */}
                      {!interviewLoading && (
                        <div className="space-y-3">
                          {(() => {
                            const rawQuestions = Array.isArray(result.interviewPreparation.questions) &&
                              result.interviewPreparation.questions.length > 0
                                ? result.interviewPreparation.questions
                                : (result.interviewPreparation.likelyQuestions || []).map((q) => ({
                                    question: q,
                                    category: "Technical",
                                    difficulty: "Medium",
                                    reason: "Evaluates core technical proficiency for this engineering role.",
                                    hint: "Articulate core principles, discuss runtime trade-offs, and consider edge cases.",
                                  }));

                            return rawQuestions.map((q, idx) => {
                              const qText = typeof q === "string" ? q : q.question;
                              const qCat = q.category || "Technical";
                              const qDiff = q.difficulty || "Medium";
                              const qReason = q.reason || "Evaluates candidate technical depth and problem-solving ability.";
                              const qHint = q.hint || "Focus on edge cases, system bottlenecks, and clear trade-offs.";
                              const isHintOpen = Boolean(revealedHints[`res-q-${idx}`]);

                              return (
                                <div
                                  key={idx}
                                  className="rounded-xl border border-[#E6E3DB] bg-[#FAF9F5]/40 hover:bg-white p-4 space-y-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-colors"
                                >
                                  {/* Card Header */}
                                  <div className="flex items-center justify-between gap-2 flex-wrap">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="rounded bg-white px-2 py-0.5 text-[11px] font-mono font-bold text-[#18181B] border border-[#E6E3DB]">
                                        Q{idx + 1}
                                      </span>
                                      <span
                                        className={`rounded px-2 py-0.5 text-[10px] font-semibold border ${getCategoryBadgeStyle(
                                          qCat
                                        )}`}
                                      >
                                        {qCat}
                                      </span>
                                      <span
                                        className={`rounded px-1.5 py-0.5 text-[10px] font-semibold border ${getDifficultyBadgeStyle(
                                          qDiff
                                        )}`}
                                      >
                                        {qDiff}
                                      </span>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() => handleCopyQuestion(qText, `res-q-${idx}`)}
                                      className="inline-flex items-center gap-1 rounded bg-white px-2 py-1 text-[11px] font-medium text-[#575653] hover:text-[#18181B] border border-[#E6E3DB] transition-colors"
                                    >
                                      {copiedQuestionIdx === `res-q-${idx}` ? (
                                        <>
                                          <Check className="h-3 w-3 text-[#4E5D44]" />
                                          <span className="text-[#4E5D44] font-semibold">Copied!</span>
                                        </>
                                      ) : (
                                        <>
                                          <Copy className="h-3 w-3" />
                                          <span>Copy</span>
                                        </>
                                      )}
                                    </button>
                                  </div>

                                  {/* Question Text */}
                                  <h4 className="text-xs sm:text-sm font-semibold text-[#18181B] leading-relaxed">
                                    {qText}
                                  </h4>

                                  {/* Why they're asking (Interviewer rationale) */}
                                  {qReason && (
                                    <div className="rounded-lg bg-white p-2.5 border border-[#E6E3DB] text-xs text-[#575653] leading-relaxed">
                                      <span className="font-semibold text-[#18181B]">Why they're asking:</span>{" "}
                                      {qReason}
                                    </div>
                                  )}

                                  {/* Reveal Hint Toggle & Box */}
                                  {qHint && (
                                    <div className="pt-0.5">
                                      <button
                                        type="button"
                                        onClick={() => handleToggleHint(`res-q-${idx}`)}
                                        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#4E5D44] hover:text-[#2C3527] transition-colors"
                                      >
                                        <Lightbulb className="h-3.5 w-3.5 text-[#657858]" />
                                        <span>{isHintOpen ? "Hide Preparation Hint" : "Reveal Hint"}</span>
                                      </button>

                                      {isHintOpen && (
                                        <div className="mt-2 rounded-lg bg-[#EEF2EB]/70 border border-[#C6D2BF] p-3 text-xs text-[#2C3527] leading-relaxed">
                                          <span className="font-semibold text-[#4E5D44] block mb-1">
                                            💡 Preparation Clue & Core Trade-offs:
                                          </span>
                                          <p>{qHint}</p>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            });
                          })()}
                        </div>
                      )}

                      {/* Bottom Quick-Action Bar */}
                      {!interviewLoading && (
                        <div className="pt-2 border-t border-[#E6E3DB] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#8E8B82]">
                          <span>
                            Click "Generate New Questions" at any time to receive a fresh, non-cached question set with anti-duplication tracking.
                          </span>
                          <Button
                            type="button"
                            variant="secondary"
                            size="xs"
                            disabled={interviewLoading}
                            onClick={() => handleGenerateFreshQuestions()}
                            className="shrink-0"
                          >
                            <RotateCw className="h-3 w-3 mr-1" />
                            <span>Generate Fresh Set</span>
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Bottom Action Bar */}
                  <div className="rounded-xl border border-[#E6E3DB] bg-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                    <button
                      type="button"
                      onClick={() => handleCopy(formatResumeToMarkdown(result))}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-[#575653] hover:text-[#18181B]"
                    >
                      {copied ? <Check className="h-3.5 w-3.5 text-[#657858]" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copied ? "Copied Report to Clipboard" : "Copy Markdown Report"}</span>
                    </button>

                    <Button
                      type="button"
                      variant="primary"
                      size="xs"
                      loading={savingToNotes}
                      onClick={() => {
                        const title = `Resume Analysis — ${result.jobMatch?.score || result.overallScore}% Match`;
                        const content = formatResumeToMarkdown(result);
                        handleSaveToNotes(title, content, ["resume-analysis", "career-prep"]);
                      }}
                    >
                      <Save className="h-3.5 w-3.5 mr-1.5" />
                      <span>Save Analysis to DevFlow Notes</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* 2-Column Workspace for Interview Prep */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Input Column */}
              <div className="lg:col-span-5 space-y-4">
                <div className="rounded-xl border border-[#E6E3DB] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
                  <div className="space-y-1">
                    <h2 className="text-sm font-bold text-[#18181B]">
                      Interview Prep Inputs
                    </h2>
                    <p className="text-[11px] text-[#575653]">
                      Generate interview questions based on your skills and target role.
                    </p>
                  </div>

                {/* 5. Interview Questions Form */}
                {activeTool === "interview" && (
                  <form onSubmit={handleRunInterview} className="space-y-3.5">
                    {/* Profile Sync Banner */}
                    <div className="rounded-lg border border-[#C6D2BF] bg-[#EEF2EB] p-2.5 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs">
                        <Sparkles className="h-3.5 w-3.5 text-[#657858] shrink-0" />
                        <div>
                          <span className="font-bold text-[#18181B] block text-[11px]">Sync from DevFlow Profile</span>
                          <span className="text-[10px] text-[#575653]">Auto-fill role, solved topics, and active project tasks.</span>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="primary"
                        size="xs"
                        loading={syncingProfile}
                        onClick={handleSyncProfileContext}
                        className="shrink-0 text-[10px] py-1"
                      >
                        <span>Sync Profile</span>
                      </Button>
                    </div>

                    {/* Input Mode Selector */}
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#575653] mb-1.5">
                        Simulation Basis
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setInterviewForm({ ...interviewForm, inputMode: "resume_jd" })}
                          className={`rounded-md py-1.5 px-2.5 text-xs font-semibold border text-center transition-colors ${
                            interviewForm.inputMode === "resume_jd"
                              ? "border-[#4E5D44] bg-[#EEF2EB] text-[#4E5D44]"
                              : "border-[#E6E3DB] bg-[#FAF9F5] text-[#575653] hover:text-[#18181B]"
                          }`}
                        >
                          Resume & Job Spec
                        </button>
                        <button
                          type="button"
                          onClick={() => setInterviewForm({ ...interviewForm, inputMode: "role_skills" })}
                          className={`rounded-md py-1.5 px-2.5 text-xs font-semibold border text-center transition-colors ${
                            interviewForm.inputMode === "role_skills"
                              ? "border-[#4E5D44] bg-[#EEF2EB] text-[#4E5D44]"
                              : "border-[#E6E3DB] bg-[#FAF9F5] text-[#575653] hover:text-[#18181B]"
                          }`}
                        >
                          Role & Skills Spec
                        </button>
                      </div>
                    </div>

                    {/* Interview Mode & Difficulty */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#575653] mb-1">
                          Interview Mode
                        </label>
                        <select
                          value={interviewForm.mode}
                          onChange={(e) => setInterviewForm({ ...interviewForm, mode: e.target.value })}
                          className="w-full rounded-md border border-[#E6E3DB] bg-[#FAF9F5] py-1.5 px-2.5 text-xs text-[#18181B] focus:border-[#657858] focus:outline-none"
                        >
                          {INTERVIEW_MODES.map((m) => (
                            <option key={m.value} value={m.value}>
                              {m.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#575653] mb-1">
                          Difficulty Level
                        </label>
                        <select
                          value={interviewForm.difficulty}
                          onChange={(e) => setInterviewForm({ ...interviewForm, difficulty: e.target.value })}
                          className="w-full rounded-md border border-[#E6E3DB] bg-[#FAF9F5] py-1.5 px-2.5 text-xs text-[#18181B] focus:border-[#657858] focus:outline-none"
                        >
                          {INTERVIEW_DIFFICULTIES.map((d) => (
                            <option key={d.value} value={d.value}>
                              {d.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {interviewForm.inputMode === "resume_jd" ? (
                      <>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#575653]">
                              Resume Content
                            </label>
                            <button
                              type="button"
                              onClick={() => setInterviewForm({ ...interviewForm, resumeText: SAMPLE_RESUME })}
                              className="text-[10px] text-[#4E5D44] hover:underline"
                            >
                              Load Sample
                            </button>
                          </div>
                          <textarea
                            rows={4}
                            value={interviewForm.resumeText}
                            onChange={(e) => setInterviewForm({ ...interviewForm, resumeText: e.target.value })}
                            placeholder="Paste candidate resume content..."
                            className="w-full rounded-md border border-[#E6E3DB] bg-[#FAF9F5] p-2.5 text-xs text-[#18181B] leading-relaxed focus:border-[#657858] focus:bg-white focus:outline-none"
                            required
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#575653]">
                              Target Job Description
                            </label>
                            <button
                              type="button"
                              onClick={() => setInterviewForm({ ...interviewForm, jobDescription: SAMPLE_JD })}
                              className="text-[10px] text-[#4E5D44] hover:underline"
                            >
                              Load Sample
                            </button>
                          </div>
                          <textarea
                            rows={4}
                            value={interviewForm.jobDescription}
                            onChange={(e) => setInterviewForm({ ...interviewForm, jobDescription: e.target.value })}
                            placeholder="Paste job description requirements..."
                            className="w-full rounded-md border border-[#E6E3DB] bg-[#FAF9F5] p-2.5 text-xs text-[#18181B] leading-relaxed focus:border-[#657858] focus:bg-white focus:outline-none"
                            required
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#575653] mb-1">
                              Target Role
                            </label>
                            <input
                              type="text"
                              value={interviewForm.role}
                              onChange={(e) => setInterviewForm({ ...interviewForm, role: e.target.value })}
                              placeholder="e.g. SDE II, Backend Engineer"
                              className="w-full rounded-md border border-[#E6E3DB] bg-[#FAF9F5] py-1.5 px-2.5 text-xs text-[#18181B] focus:border-[#657858] focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#575653] mb-1">
                              Seniority
                            </label>
                            <select
                              value={interviewForm.level}
                              onChange={(e) => setInterviewForm({ ...interviewForm, level: e.target.value })}
                              className="w-full rounded-md border border-[#E6E3DB] bg-[#FAF9F5] py-1.5 px-2.5 text-xs text-[#18181B] focus:border-[#657858] focus:outline-none"
                            >
                              <option value="Junior">Junior SDE</option>
                              <option value="Intermediate">Mid-Level SDE</option>
                              <option value="Senior">Senior / Staff SDE</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#575653] mb-1">
                            Topic Focus
                          </label>
                          <select
                            value={interviewForm.topic}
                            onChange={(e) => setInterviewForm({ ...interviewForm, topic: e.target.value })}
                            className="w-full rounded-md border border-[#E6E3DB] bg-[#FAF9F5] py-1.5 px-2.5 text-xs text-[#18181B] focus:border-[#657858] focus:outline-none"
                          >
                            <option value="Full Stack & System Architecture">Full Stack & System Architecture</option>
                            <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
                            <option value="Backend Architecture & Security">Backend Architecture & Security</option>
                            <option value="Distributed Systems & System Design">System Design & Distributed Systems</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#575653] mb-1">
                            Candidate Skills / Tech Stack
                          </label>
                          <input
                            type="text"
                            value={interviewForm.skills}
                            onChange={(e) => setInterviewForm({ ...interviewForm, skills: e.target.value })}
                            placeholder="e.g. Node, React, Redis, MongoDB, Python"
                            className="w-full rounded-md border border-[#E6E3DB] bg-[#FAF9F5] py-1.5 px-2.5 text-xs text-[#18181B] focus:border-[#657858] focus:outline-none"
                          />
                        </div>
                      </>
                    )}

                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      className="w-full shadow-xs"
                      disabled={loading}
                    >
                      <HelpCircle className="h-3.5 w-3.5" />
                      <span>{loading ? "Generating Fresh Set..." : "Generate Interview Set"}</span>
                    </Button>
                  </form>
                )}
                </div>
              </div>

              {/* Structured Output Column */}
              <div className="lg:col-span-7 space-y-4">
                {loading && (
                  <div className="rounded-xl border border-[#E6E3DB] bg-white p-12 text-center space-y-3">
                    <LoadingSpinner message={loadingStage || "Processing request..."} />
                    <p className="text-[11px] text-[#8E8B82]">
                      Deriving structured SDE interview insights...
                    </p>
                  </div>
                )}

                {error && (
                  <div className="rounded-xl border border-[#E8BFBF] bg-[#FBF0F0] p-4 text-xs text-[#933D3D] space-y-3">
                    <div className="flex items-start gap-2.5">
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="font-bold">Execution Error</p>
                        <p>{error}</p>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-[#E8BFBF]/60 flex items-center justify-between">
                      <span className="text-[11px] text-[#933D3D]/80">
                        Check inputs or retry with deterministic fallback resilience.
                      </span>
                      <Button
                        type="button"
                        variant="secondary"
                        size="xs"
                        onClick={handleRunInterview}
                        className="border-[#E8BFBF] bg-white text-[#933D3D] hover:bg-[#FBF0F0]"
                      >
                        <RotateCw className="h-3 w-3" />
                        <span>Retry Analysis</span>
                      </Button>
                    </div>
                  </div>
                )}

                {!loading && !result && !error && (
                  <div className="rounded-xl border border-dashed border-[#D5D1C6] bg-white p-12 text-center space-y-2">
                    <Sparkles className="h-8 w-8 text-[#8E8B82] mx-auto opacity-40" />
                    <h3 className="text-sm font-bold text-[#18181B]">
                      Awaiting Input Execution
                    </h3>
                    <p className="text-xs text-[#575653] max-w-sm mx-auto">
                      Fill out the parameters on the left and click "Generate Interview Set" to generate realistic, non-cached technical interview questions.
                    </p>
                  </div>
                )}

                {!loading && result && (
                  <div className="space-y-4">
                    {/* Saved Note Success Alert */}
                    {savedNoteSuccess && (
                      <div className="rounded-xl border border-[#C6D2BF] bg-[#F2F5F0] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-[#4E5D44] shrink-0" />
                          <div>
                            <span className="font-semibold text-[#18181B]">
                              Interview Preparation Set saved successfully!
                            </span>
                            <p className="text-[#575653] text-[11px]">
                              Saved to your DevFlow technical notebook as "{savedNoteSuccess.title}".
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Link
                            to="/notes"
                            className="inline-flex items-center gap-1 font-semibold text-[#4E5D44] hover:text-[#2C3527] underline"
                          >
                            <span>Open in Notes</span>
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    )}

                  {/* 5. INTERVIEW QUESTIONS RESULT */}
                  {activeTool === "interview" && (
                    <div className="space-y-4">
                      {/* Interview Header & Actions */}
                      <div className="rounded-xl border border-[#E6E3DB] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-[#18181B]">
                              Technical Interview Simulation
                            </h3>
                            <span className="rounded bg-[#EEF2EB] px-2 py-0.5 text-[10px] font-semibold text-[#4E5D44] border border-[#C6D2BF]">
                              {(result.questions || []).length} Questions
                            </span>
                          </div>
                          <p className="text-xs text-[#575653]">
                            Mode: <span className="font-semibold text-[#18181B]">{interviewForm.mode}</span> · Difficulty: <span className="font-semibold text-[#18181B]">{interviewForm.difficulty}</span>
                          </p>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <Button
                            type="button"
                            variant="secondary"
                            size="xs"
                            disabled={loading}
                            onClick={handleRunInterview}
                          >
                            <RotateCw className={`h-3 w-3 mr-1 ${loading ? "animate-spin" : ""}`} />
                            <span>Generate New Set</span>
                          </Button>

                          <Button
                            type="button"
                            variant="primary"
                            size="xs"
                            loading={savingToNotes}
                            onClick={() => {
                              const title = `Interview Simulation: ${interviewForm.role || "SDE"} (${interviewForm.mode} · ${interviewForm.difficulty})`;
                              handleSaveToNotes(title, formatInterviewToMarkdown(result), ["interview-prep", interviewForm.mode.toLowerCase()]);
                            }}
                          >
                            <Save className="h-3 w-3 mr-1" />
                            <span>Save to Notes</span>
                          </Button>
                        </div>
                      </div>

                      {/* Likely Topics */}
                      {Array.isArray(result.likelyTopics) && result.likelyTopics.length > 0 && (
                        <div className="rounded-xl border border-[#E6E3DB] bg-white p-4 space-y-1.5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8B82] block">
                            Key Architectural & Conceptual Areas:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {result.likelyTopics.map((topic, idx) => (
                              <span
                                key={idx}
                                className="rounded bg-[#FAF9F5] px-2.5 py-1 text-xs font-semibold text-[#18181B] border border-[#E6E3DB]"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Question Cards */}
                      <div className="space-y-3">
                        {(result.questions || []).map((q, idx) => {
                          const qText = typeof q === "string" ? q : q.question;
                          const qCat = q.category || "Technical";
                          const qDiff = q.difficulty || "Medium";
                          const qReason = q.reason || "Evaluates candidate technical depth and problem-solving ability.";
                          const qHint = q.hint || "Focus on edge cases, system bottlenecks, and clear trade-offs.";
                          const isHintOpen = Boolean(revealedHints[`int-q-${idx}`]);

                          return (
                            <div
                              key={idx}
                              className="rounded-xl border border-[#E6E3DB] bg-white p-5 space-y-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-[#D5D1C6] transition-colors"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="space-y-1.5 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="rounded bg-[#FAF9F5] px-2 py-0.5 text-[11px] font-mono font-bold text-[#18181B] border border-[#E6E3DB]">
                                      Q{idx + 1}
                                    </span>
                                    <span
                                      className={`rounded px-2 py-0.5 text-[10px] font-semibold border ${getCategoryBadgeStyle(
                                        qCat
                                      )}`}
                                    >
                                      {qCat}
                                    </span>
                                    <span
                                      className={`rounded px-1.5 py-0.5 text-[10px] font-semibold border ${getDifficultyBadgeStyle(
                                        qDiff
                                      )}`}
                                    >
                                      {qDiff}
                                    </span>
                                  </div>

                                  <h3 className="text-sm font-semibold text-[#18181B] leading-relaxed">
                                    {qText}
                                  </h3>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleCopyQuestion(qText, `int-q-${idx}`)}
                                  className="shrink-0 inline-flex items-center gap-1 rounded bg-[#FAF9F5] px-2 py-1 text-[11px] font-medium text-[#575653] hover:text-[#18181B] border border-[#E6E3DB] transition-colors"
                                >
                                  {copiedQuestionIdx === `int-q-${idx}` ? (
                                    <>
                                      <Check className="h-3 w-3 text-[#4E5D44]" />
                                      <span className="text-[#4E5D44] font-semibold">Copied!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="h-3 w-3" />
                                      <span>Copy</span>
                                    </>
                                  )}
                                </button>
                              </div>

                              {/* Why they're asking */}
                              {qReason && (
                                <div className="rounded-lg bg-[#FAF9F5] p-2.5 border border-[#E6E3DB] text-xs text-[#575653] leading-relaxed">
                                  <span className="font-semibold text-[#18181B]">Why they're asking:</span>{" "}
                                  {qReason}
                                </div>
                              )}

                              {/* Hint Toggle & Box */}
                              {qHint && (
                                <div className="pt-0.5">
                                  <button
                                    type="button"
                                    onClick={() => handleToggleHint(`int-q-${idx}`)}
                                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#4E5D44] hover:text-[#2C3527] transition-colors"
                                  >
                                    <Lightbulb className="h-3.5 w-3.5 text-[#657858]" />
                                    <span>{isHintOpen ? "Hide Preparation Hint" : "Reveal Hint"}</span>
                                  </button>

                                  {isHintOpen && (
                                    <div className="mt-2 rounded-lg bg-[#EEF2EB]/70 border border-[#C6D2BF] p-3 text-xs text-[#2C3527] leading-relaxed">
                                      <span className="font-semibold text-[#4E5D44] block mb-1">
                                        💡 Preparation Clue & Target Invariants:
                                      </span>
                                      <p>{qHint}</p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Footer Actions */}
                      <div className="rounded-xl border border-[#E6E3DB] bg-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                        <button
                          type="button"
                          onClick={() => handleCopy(formatInterviewToMarkdown(result))}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#575653] hover:text-[#18181B]"
                        >
                          {copied ? <Check className="h-3.5 w-3.5 text-[#657858]" /> : <Copy className="h-3.5 w-3.5" />}
                          <span>{copied ? "Copied Markdown to Clipboard" : "Copy Markdown Set"}</span>
                        </button>

                        <Button
                          type="button"
                          variant="secondary"
                          size="xs"
                          disabled={loading}
                          onClick={handleRunInterview}
                        >
                          <RotateCw className="h-3 w-3 mr-1" />
                          <span>Generate Another Fresh Set</span>
                        </Button>
                      </div>
                    </div>
                  )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AITools;
