import { useState } from "react";
import {
  Sparkles,
  Code2,
  Zap,
  FileText,
  FileCheck2,
  HelpCircle,
  Copy,
  Check,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import {
  explainCode,
  optimizeCode,
  generateNotes,
  analyzeResume,
  generateInterviewQuestions,
} from "../services/aiService";

function AITools() {
  const [activeTab, setActiveTab] = useState("explain"); // 'explain' | 'optimize' | 'notes' | 'resume' | 'interview'
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  // Form states
  const [explainForm, setExplainForm] = useState({
    language: "javascript",
    code: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
  });

  const [optimizeForm, setOptimizeForm] = useState({
    language: "javascript",
    code: `function containsDuplicate(nums) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] === nums[j]) return true;
    }
  }
  return false;
}`,
  });

  const [notesForm, setNotesForm] = useState({
    title: "Trapping Rain Water",
    topic: "Two Pointers",
    difficulty: "Hard",
    code: `// Two pointers approach maintaining leftMax and rightMax`,
  });

  const [resumeText, setResumeText] = useState(
    `Software Engineer with 2+ years experience building web applications using React, JavaScript, Node.js, Express, and MongoDB. Built high-throughput REST APIs and implemented JWT authentication and Redis caching. Strong knowledge of Data Structures, Algorithms, and System Design.`
  );

  const [interviewForm, setInterviewForm] = useState({
    topic: "DSA",
    level: "Intermediate",
  });

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunExplain = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setResult(null);
      const res = await explainCode(explainForm.language, explainForm.code);
      setResult(res.data);
    } catch (err) {
      toast.error(err.message || "Failed to analyze code");
    } finally {
      setLoading(false);
    }
  };

  const handleRunOptimize = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setResult(null);
      const res = await optimizeCode(optimizeForm.language, optimizeForm.code);
      setResult(res.data);
    } catch (err) {
      toast.error(err.message || "Failed to optimize code");
    } finally {
      setLoading(false);
    }
  };

  const handleRunNotes = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setResult(null);
      const res = await generateNotes(notesForm);
      setResult(res.data);
    } catch (err) {
      toast.error(err.message || "Failed to generate notes");
    } finally {
      setLoading(false);
    }
  };

  const handleRunResume = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setResult(null);
      const res = await analyzeResume(resumeText);
      setResult(res.data);
    } catch (err) {
      toast.error(err.message || "Failed to analyze resume");
    } finally {
      setLoading(false);
    }
  };

  const handleRunInterview = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setResult(null);
      const res = await generateInterviewQuestions(interviewForm.topic, interviewForm.level);
      setResult(res.data);
    } catch (err) {
      toast.error(err.message || "Failed to generate questions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="h-3.5 w-3.5" />
          <span>AI Developer Suite</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          AI Developer Tools
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Accelerate your SDE preparation with algorithmic code analysis, complexity evaluation, note generation, and ATS resume review.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3 text-xs sm:text-sm font-medium">
        <button
          onClick={() => {
            setActiveTab("explain");
            setResult(null);
          }}
          className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 transition-all ${
            activeTab === "explain"
              ? "bg-blue-600 text-white"
              : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
          }`}
        >
          <Code2 className="h-4 w-4" />
          <span>Explain Code</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("optimize");
            setResult(null);
          }}
          className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 transition-all ${
            activeTab === "optimize"
              ? "bg-blue-600 text-white"
              : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
          }`}
        >
          <Zap className="h-4 w-4" />
          <span>Optimize Code</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("notes");
            setResult(null);
          }}
          className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 transition-all ${
            activeTab === "notes"
              ? "bg-blue-600 text-white"
              : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Generate Notes</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("resume");
            setResult(null);
          }}
          className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 transition-all ${
            activeTab === "resume"
              ? "bg-blue-600 text-white"
              : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
          }`}
        >
          <FileCheck2 className="h-4 w-4" />
          <span>Resume ATS Analyzer</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("interview");
            setResult(null);
          }}
          className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 transition-all ${
            activeTab === "interview"
              ? "bg-blue-600 text-white"
              : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
          }`}
        >
          <HelpCircle className="h-4 w-4" />
          <span>Interview Prep</span>
        </button>
      </div>

      {/* Main Two-Pane View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Form Pane */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
          {/* 1. Explain Code Form */}
          {activeTab === "explain" && (
            <form onSubmit={handleRunExplain} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-white">Explain Code & Complexity</h3>
                <select
                  value={explainForm.language}
                  onChange={(e) => setExplainForm({ ...explainForm, language: e.target.value })}
                  className="rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs text-white"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">
                  Paste your implementation or function:
                </label>
                <textarea
                  rows={10}
                  value={explainForm.code}
                  onChange={(e) => setExplainForm({ ...explainForm, code: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3.5 font-mono text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <Button type="submit" loading={loading} className="w-full">
                Analyze Code with AI
              </Button>
            </form>
          )}

          {/* 2. Optimize Code Form */}
          {activeTab === "optimize" && (
            <form onSubmit={handleRunOptimize} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-white">Optimize Code Complexity</h3>
                <select
                  value={optimizeForm.language}
                  onChange={(e) => setOptimizeForm({ ...optimizeForm, language: e.target.value })}
                  className="rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs text-white"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">
                  Code snippet to optimize:
                </label>
                <textarea
                  rows={10}
                  value={optimizeForm.code}
                  onChange={(e) => setOptimizeForm({ ...optimizeForm, code: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3.5 font-mono text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <Button type="submit" loading={loading} className="w-full">
                Find Optimizations
              </Button>
            </form>
          )}

          {/* 3. Generate Notes Form */}
          {activeTab === "notes" && (
            <form onSubmit={handleRunNotes} className="space-y-4">
              <h3 className="text-base font-semibold text-white">Generate Structured Notes</h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-medium">Problem Title</label>
                  <input
                    type="text"
                    value={notesForm.title}
                    onChange={(e) => setNotesForm({ ...notesForm, title: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-medium">Topic</label>
                  <input
                    type="text"
                    value={notesForm.topic}
                    onChange={(e) => setNotesForm({ ...notesForm, topic: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">
                  Your Solution or Approach:
                </label>
                <textarea
                  rows={8}
                  value={notesForm.code}
                  onChange={(e) => setNotesForm({ ...notesForm, code: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3.5 font-mono text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <Button type="submit" loading={loading} className="w-full">
                Generate Structured Notes
              </Button>
            </form>
          )}

          {/* 4. Resume Analyzer Form */}
          {activeTab === "resume" && (
            <form onSubmit={handleRunResume} className="space-y-4">
              <h3 className="text-base font-semibold text-white">ATS Resume Reviewer</h3>
              <p className="text-xs text-slate-400">
                Paste your resume text or experience bullet points to evaluate ATS keywords and SDE profile strength.
              </p>

              <div>
                <textarea
                  rows={10}
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste resume text..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3.5 font-sans text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <Button type="submit" loading={loading} className="w-full">
                Run ATS Resume Analysis
              </Button>
            </form>
          )}

          {/* 5. Interview Prep Form */}
          {activeTab === "interview" && (
            <form onSubmit={handleRunInterview} className="space-y-4">
              <h3 className="text-base font-semibold text-white">Interview Questions Generator</h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-medium">Domain</label>
                  <select
                    value={interviewForm.topic}
                    onChange={(e) => setInterviewForm({ ...interviewForm, topic: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
                  >
                    <option value="DSA">Data Structures & Algorithms</option>
                    <option value="Backend">Backend & APIs (Node/Express)</option>
                    <option value="SystemDesign">System Design</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-medium">Difficulty Level</label>
                  <select
                    value={interviewForm.level}
                    onChange={(e) => setInterviewForm({ ...interviewForm, level: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
                  >
                    <option value="Junior">Junior SDE</option>
                    <option value="Intermediate">Intermediate SDE (1-3 yrs)</option>
                    <option value="Senior">Senior SDE</option>
                  </select>
                </div>
              </div>

              <Button type="submit" loading={loading} className="w-full">
                Generate Questions
              </Button>
            </form>
          )}
        </div>

        {/* Right Output Pane */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 min-h-[400px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-400" />
              <span>AI Output & Insights</span>
            </h3>

            {result && (
              <button
                type="button"
                onClick={() => handleCopy(JSON.stringify(result, null, 2))}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            )}
          </div>

          {loading ? (
            <div className="py-20 flex justify-center">
              <LoadingSpinner message="DevFlow AI is analyzing your input..." />
            </div>
          ) : !result ? (
            <div className="py-20 text-center text-xs text-slate-500">
              Select a tool on the left and submit your input to receive structured AI feedback.
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              {/* If string response from external LLM */}
              {result.explanation && typeof result.explanation === "string" ? (
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {result.explanation}
                </div>
              ) : null}

              {/* Heuristic Explain Output */}
              {result.timeComplexity && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                      <span className="text-slate-400 block">Time Complexity</span>
                      <span className="text-sm font-bold text-amber-400 mt-1 block">
                        {result.timeComplexity}
                      </span>
                    </div>
                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                      <span className="text-slate-400 block">Space Complexity</span>
                      <span className="text-sm font-bold text-blue-400 mt-1 block">
                        {result.spaceComplexity}
                      </span>
                    </div>
                  </div>

                  {result.potentialBugs?.length > 0 && (
                    <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3.5 space-y-1.5 text-rose-300">
                      <span className="font-semibold block">Potential Boundary Bugs:</span>
                      <ul className="list-disc list-inside space-y-1">
                        {result.potentialBugs.map((bug, i) => (
                          <li key={i}>{bug}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.suggestions?.length > 0 && (
                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-1.5 text-slate-300">
                      <span className="font-semibold text-white block">Interview Tips:</span>
                      <ul className="list-disc list-inside space-y-1">
                        {result.suggestions.map((sug, i) => (
                          <li key={i}>{sug}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Heuristic Optimize Output */}
              {result.optimizedComplexity && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                      <span className="text-slate-400 block">Original Complexity</span>
                      <span className="text-xs font-semibold text-rose-400 mt-1 block">
                        {result.originalComplexity}
                      </span>
                    </div>
                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                      <span className="text-slate-400 block">Target Complexity</span>
                      <span className="text-xs font-semibold text-emerald-400 mt-1 block">
                        {result.optimizedComplexity}
                      </span>
                    </div>
                  </div>

                  {result.improvements && (
                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-1 text-slate-300">
                      <span className="font-semibold text-white block">Algorithmic Improvements:</span>
                      <ul className="list-disc list-inside space-y-1">
                        {result.improvements.map((imp, i) => (
                          <li key={i}>{imp}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Heuristic Notes Output */}
              {result.keyIdea && (
                <div className="space-y-3">
                  <div className="rounded-xl border border-blue-500/20 bg-blue-950/20 p-3 text-blue-300">
                    <span className="font-semibold block">Key Intuition:</span>
                    <p className="mt-1">{result.keyIdea}</p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-1 text-slate-300">
                    <span className="font-semibold text-white block">Algorithmic Steps:</span>
                    <ol className="list-decimal list-inside space-y-1">
                      {result.algorithmSteps.map((st, i) => (
                        <li key={i}>{st}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}

              {/* Resume Analysis Output */}
              {result.atsScore !== undefined && (
                <div className="space-y-3">
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 block">ATS Match Score</span>
                      <span className="text-2xl font-bold text-emerald-400 mt-1 block">
                        {result.atsScore}/100
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400">Target: 80+ for SDE</span>
                    </div>
                  </div>

                  {result.missingKeywords?.length > 0 && (
                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-amber-300 space-y-1">
                      <span className="font-semibold block">Suggested Missing Keywords:</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {result.missingKeywords.map((kw, i) => (
                          <span key={i} className="rounded bg-amber-500/20 px-2 py-0.5 text-[11px] font-semibold">
                            +{kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.improvements?.length > 0 && (
                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-1 text-slate-300">
                      <span className="font-semibold text-white block">Recommendations:</span>
                      <ul className="list-disc list-inside space-y-1">
                        {result.improvements.map((imp, i) => (
                          <li key={i}>{imp}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Interview Questions Output */}
              {result.questions && Array.isArray(result.questions) && (
                <div className="space-y-3">
                  {result.questions.map((q, idx) => (
                    <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold uppercase text-blue-400">
                          {q.category} • {q.difficulty}
                        </span>
                        <span className="text-slate-500">#{idx + 1}</span>
                      </div>
                      <p className="font-semibold text-white text-xs">{q.question}</p>
                      <p className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-1.5">
                        <span className="text-emerald-400 font-medium">Evaluation Focus: </span>
                        {q.keyPoints}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AITools;
