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
      <div className="border-b border-[#E6E3DB] pb-5">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EEF2EB] border border-[#C6D2BF] text-[#4E5D44] text-[11px] font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="h-3 w-3 text-[#657858]" />
          <span>Developer Studio</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#18181B]">
          AI Tools
        </h1>
        <p className="text-xs sm:text-sm text-[#575653] mt-1">
          Accelerate your algorithmic mastery with automated code explanation, complexity optimization, note generation, and ATS resume evaluation.
        </p>
      </div>

      {/* Mode Selection Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#E6E3DB] pb-3 text-xs font-semibold">
        <button
          onClick={() => {
            setActiveTab("explain");
            setResult(null);
          }}
          className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-colors cursor-pointer ${
            activeTab === "explain"
              ? "bg-[#18181B] text-white"
              : "bg-white text-[#575653] hover:text-[#18181B] border border-[#E6E3DB]"
          }`}
        >
          <Code2 className="h-3.5 w-3.5" />
          <span>Explain Code</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("optimize");
            setResult(null);
          }}
          className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-colors cursor-pointer ${
            activeTab === "optimize"
              ? "bg-[#18181B] text-white"
              : "bg-white text-[#575653] hover:text-[#18181B] border border-[#E6E3DB]"
          }`}
        >
          <Zap className="h-3.5 w-3.5" />
          <span>Optimize Code</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("notes");
            setResult(null);
          }}
          className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-colors cursor-pointer ${
            activeTab === "notes"
              ? "bg-[#18181B] text-white"
              : "bg-white text-[#575653] hover:text-[#18181B] border border-[#E6E3DB]"
          }`}
        >
          <FileText className="h-3.5 w-3.5" />
          <span>Generate Notes</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("resume");
            setResult(null);
          }}
          className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-colors cursor-pointer ${
            activeTab === "resume"
              ? "bg-[#18181B] text-white"
              : "bg-white text-[#575653] hover:text-[#18181B] border border-[#E6E3DB]"
          }`}
        >
          <FileCheck2 className="h-3.5 w-3.5" />
          <span>Resume ATS Analyzer</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("interview");
            setResult(null);
          }}
          className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-colors cursor-pointer ${
            activeTab === "interview"
              ? "bg-[#18181B] text-white"
              : "bg-white text-[#575653] hover:text-[#18181B] border border-[#E6E3DB]"
          }`}
        >
          <HelpCircle className="h-3.5 w-3.5" />
          <span>Interview Questions</span>
        </button>
      </div>

      {/* Main Two-Pane View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Input Pane */}
        <div className="rounded-xl border border-[#E6E3DB] bg-white p-5 sm:p-6 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          {/* 1. Explain Code Form */}
          {activeTab === "explain" && (
            <form onSubmit={handleRunExplain} className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#E6E3DB] pb-3">
                <h3 className="text-sm font-bold text-[#18181B]">
                  Explain Code & Complexity
                </h3>
                <select
                  value={explainForm.language}
                  onChange={(e) => setExplainForm({ ...explainForm, language: e.target.value })}
                  className="rounded-md border border-[#E6E3DB] bg-[#FAF9F5] px-2.5 py-1 text-xs text-[#18181B]"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-[#575653] mb-1 font-medium">
                  Function or implementation snippet:
                </label>
                <textarea
                  rows={10}
                  value={explainForm.code}
                  onChange={(e) => setExplainForm({ ...explainForm, code: e.target.value })}
                  className="w-full rounded-lg border border-[#E6E3DB] bg-[#FAF9F5] p-3 font-mono text-xs text-[#18181B] focus:border-[#657858] focus:bg-white focus:outline-none leading-relaxed"
                />
              </div>

              <Button type="submit" variant="primary" loading={loading} className="w-full">
                Analyze Code with AI
              </Button>
            </form>
          )}

          {/* 2. Optimize Code Form */}
          {activeTab === "optimize" && (
            <form onSubmit={handleRunOptimize} className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#E6E3DB] pb-3">
                <h3 className="text-sm font-bold text-[#18181B]">
                  Optimize Algorithmic Complexity
                </h3>
                <select
                  value={optimizeForm.language}
                  onChange={(e) => setOptimizeForm({ ...optimizeForm, language: e.target.value })}
                  className="rounded-md border border-[#E6E3DB] bg-[#FAF9F5] px-2.5 py-1 text-xs text-[#18181B]"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-[#575653] mb-1 font-medium">
                  Code snippet to evaluate for optimizations:
                </label>
                <textarea
                  rows={10}
                  value={optimizeForm.code}
                  onChange={(e) => setOptimizeForm({ ...optimizeForm, code: e.target.value })}
                  className="w-full rounded-lg border border-[#E6E3DB] bg-[#FAF9F5] p-3 font-mono text-xs text-[#18181B] focus:border-[#657858] focus:bg-white focus:outline-none leading-relaxed"
                />
              </div>

              <Button type="submit" variant="primary" loading={loading} className="w-full">
                Find Optimizations
              </Button>
            </form>
          )}

          {/* 3. Generate Notes Form */}
          {activeTab === "notes" && (
            <form onSubmit={handleRunNotes} className="space-y-4">
              <div className="border-b border-[#E6E3DB] pb-3">
                <h3 className="text-sm font-bold text-[#18181B]">
                  Generate Structured Notes
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#575653] mb-1 font-medium">Problem Title</label>
                  <input
                    type="text"
                    value={notesForm.title}
                    onChange={(e) => setNotesForm({ ...notesForm, title: e.target.value })}
                    className="w-full rounded-md border border-[#E6E3DB] bg-[#FAF9F5] px-3 py-1.5 text-xs text-[#18181B]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#575653] mb-1 font-medium">Topic</label>
                  <input
                    type="text"
                    value={notesForm.topic}
                    onChange={(e) => setNotesForm({ ...notesForm, topic: e.target.value })}
                    className="w-full rounded-md border border-[#E6E3DB] bg-[#FAF9F5] px-3 py-1.5 text-xs text-[#18181B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#575653] mb-1 font-medium">
                  Your Solution or Approach:
                </label>
                <textarea
                  rows={8}
                  value={notesForm.code}
                  onChange={(e) => setNotesForm({ ...notesForm, code: e.target.value })}
                  className="w-full rounded-lg border border-[#E6E3DB] bg-[#FAF9F5] p-3 font-mono text-xs text-[#18181B] focus:border-[#657858] focus:bg-white focus:outline-none"
                />
              </div>

              <Button type="submit" variant="primary" loading={loading} className="w-full">
                Generate Structured Notes
              </Button>
            </form>
          )}

          {/* 4. Resume Analyzer Form */}
          {activeTab === "resume" && (
            <form onSubmit={handleRunResume} className="space-y-4">
              <div className="border-b border-[#E6E3DB] pb-3">
                <h3 className="text-sm font-bold text-[#18181B]">
                  ATS Resume Reviewer
                </h3>
                <p className="text-xs text-[#575653] mt-0.5">
                  Paste your resume text to evaluate ATS keywords and technical profile strength.
                </p>
              </div>

              <div>
                <textarea
                  rows={10}
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste resume text..."
                  className="w-full rounded-lg border border-[#E6E3DB] bg-[#FAF9F5] p-3 font-sans text-xs text-[#18181B] focus:border-[#657858] focus:bg-white focus:outline-none leading-relaxed"
                />
              </div>

              <Button type="submit" variant="primary" loading={loading} className="w-full">
                Run ATS Resume Analysis
              </Button>
            </form>
          )}

          {/* 5. Interview Prep Form */}
          {activeTab === "interview" && (
            <form onSubmit={handleRunInterview} className="space-y-4">
              <div className="border-b border-[#E6E3DB] pb-3">
                <h3 className="text-sm font-bold text-[#18181B]">
                  Interview Questions Generator
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#575653] mb-1 font-medium">Domain</label>
                  <select
                    value={interviewForm.topic}
                    onChange={(e) => setInterviewForm({ ...interviewForm, topic: e.target.value })}
                    className="w-full rounded-md border border-[#E6E3DB] bg-white px-3 py-1.5 text-xs text-[#18181B]"
                  >
                    <option value="DSA">Data Structures & Algorithms</option>
                    <option value="Backend">Backend & APIs (Node/Express)</option>
                    <option value="SystemDesign">System Design</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-[#575653] mb-1 font-medium">Seniority Level</label>
                  <select
                    value={interviewForm.level}
                    onChange={(e) => setInterviewForm({ ...interviewForm, level: e.target.value })}
                    className="w-full rounded-md border border-[#E6E3DB] bg-white px-3 py-1.5 text-xs text-[#18181B]"
                  >
                    <option value="Junior">Junior SDE</option>
                    <option value="Intermediate">Intermediate SDE (1-3 yrs)</option>
                    <option value="Senior">Senior SDE</option>
                  </select>
                </div>
              </div>

              <Button type="submit" variant="primary" loading={loading} className="w-full">
                Generate Questions
              </Button>
            </form>
          )}
        </div>

        {/* Right Output Pane */}
        <div className="rounded-xl border border-[#E6E3DB] bg-white p-5 sm:p-6 space-y-4 min-h-[400px] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between border-b border-[#E6E3DB] pb-3">
            <h3 className="text-sm font-bold text-[#18181B] flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-[#657858]" />
              <span>Studio Output</span>
            </h3>

            {result && (
              <Button
                variant="outline"
                size="xs"
                onClick={() => handleCopy(JSON.stringify(result, null, 2))}
              >
                {copied ? <Check className="h-3 w-3 text-[#426447]" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? "Copied" : "Copy Output"}</span>
              </Button>
            )}
          </div>

          {loading ? (
            <div className="py-20 flex justify-center">
              <LoadingSpinner message="DevFlow AI is analyzing your input..." />
            </div>
          ) : !result ? (
            <div className="py-24 text-center text-xs text-[#8E8B82]">
              Select a tool on the left and submit code or text to receive structured feedback.
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              {/* String Response */}
              {result.explanation && typeof result.explanation === "string" && (
                <div className="rounded-lg border border-[#E6E3DB] bg-[#FAF9F5] p-4 font-mono text-[#18181B] whitespace-pre-wrap leading-relaxed">
                  {result.explanation}
                </div>
              )}

              {/* Explain Output */}
              {result.timeComplexity && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-[#E6E3DB] bg-[#FAF9F5] p-3">
                      <span className="text-[10px] text-[#8E8B82] uppercase font-semibold block">Time Complexity</span>
                      <span className="text-xs font-bold text-[#865B20] mt-0.5 block font-mono">
                        {result.timeComplexity}
                      </span>
                    </div>
                    <div className="rounded-lg border border-[#E6E3DB] bg-[#FAF9F5] p-3">
                      <span className="text-[10px] text-[#8E8B82] uppercase font-semibold block">Space Complexity</span>
                      <span className="text-xs font-bold text-[#657858] mt-0.5 block font-mono">
                        {result.spaceComplexity}
                      </span>
                    </div>
                  </div>

                  {result.potentialBugs?.length > 0 && (
                    <div className="rounded-lg border border-[#E8BFBF] bg-[#FBF0F0] p-3.5 space-y-1.5 text-[#933D3D]">
                      <span className="font-semibold block">Potential Boundary Bugs:</span>
                      <ul className="list-disc list-inside space-y-1 text-[11px]">
                        {result.potentialBugs.map((bug, i) => (
                          <li key={i}>{bug}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.suggestions?.length > 0 && (
                    <div className="rounded-lg border border-[#E6E3DB] bg-[#FAF9F5] p-3.5 space-y-1 text-[#575653]">
                      <span className="font-semibold text-[#18181B] block">Interview Tips:</span>
                      <ul className="list-disc list-inside space-y-1 text-[11px]">
                        {result.suggestions.map((sug, i) => (
                          <li key={i}>{sug}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Optimize Output */}
              {result.optimizedComplexity && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-[#E6E3DB] bg-[#FAF9F5] p-3">
                      <span className="text-[10px] text-[#8E8B82] uppercase font-semibold block">Original Complexity</span>
                      <span className="text-xs font-bold text-[#933D3D] mt-0.5 block font-mono">
                        {result.originalComplexity}
                      </span>
                    </div>
                    <div className="rounded-lg border border-[#E6E3DB] bg-[#FAF9F5] p-3">
                      <span className="text-[10px] text-[#8E8B82] uppercase font-semibold block">Target Complexity</span>
                      <span className="text-xs font-bold text-[#426447] mt-0.5 block font-mono">
                        {result.optimizedComplexity}
                      </span>
                    </div>
                  </div>

                  {result.improvements && (
                    <div className="rounded-lg border border-[#E6E3DB] bg-[#FAF9F5] p-3.5 space-y-1 text-[#575653]">
                      <span className="font-semibold text-[#18181B] block">Improvements:</span>
                      <ul className="list-disc list-inside space-y-1 text-[11px]">
                        {result.improvements.map((imp, i) => (
                          <li key={i}>{imp}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Notes Output */}
              {result.keyIdea && (
                <div className="space-y-3">
                  <div className="rounded-lg border border-[#C6D2BF] bg-[#EEF2EB] p-3 text-[#4E5D44]">
                    <span className="font-semibold block">Key Intuition:</span>
                    <p className="mt-1 text-xs leading-relaxed">{result.keyIdea}</p>
                  </div>

                  <div className="rounded-lg border border-[#E6E3DB] bg-[#FAF9F5] p-3.5 space-y-1 text-[#575653]">
                    <span className="font-semibold text-[#18181B] block">Algorithmic Steps:</span>
                    <ol className="list-decimal list-inside space-y-1 text-[11px]">
                      {result.algorithmSteps.map((st, i) => (
                        <li key={i}>{st}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}

              {/* ATS Resume Score */}
              {result.atsScore !== undefined && (
                <div className="space-y-3">
                  <div className="rounded-lg border border-[#E6E3DB] bg-[#FAF9F5] p-4 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[#8E8B82] block">ATS Match Score</span>
                      <span className="text-2xl font-extrabold text-[#426447] mt-0.5 block">
                        {result.atsScore}/100
                      </span>
                    </div>
                    <span className="text-xs text-[#8E8B82]">Target: 80+ for Tier-1 SDE</span>
                  </div>

                  {result.missingKeywords?.length > 0 && (
                    <div className="rounded-lg border border-[#EAD5AC] bg-[#FAF4E8] p-3 text-[#865B20] space-y-1">
                      <span className="font-semibold block">Suggested Missing Keywords:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {result.missingKeywords.map((kw, i) => (
                          <span key={i} className="rounded bg-white px-2 py-0.5 text-[10px] font-semibold border border-[#EAD5AC]">
                            +{kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.improvements?.length > 0 && (
                    <div className="rounded-lg border border-[#E6E3DB] bg-[#FAF9F5] p-3.5 space-y-1 text-[#575653]">
                      <span className="font-semibold text-[#18181B] block">Recommendations:</span>
                      <ul className="list-disc list-inside space-y-1 text-[11px]">
                        {result.improvements.map((imp, i) => (
                          <li key={i}>{imp}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Interview Questions */}
              {result.questions && Array.isArray(result.questions) && (
                <div className="space-y-2.5">
                  {result.questions.map((q, idx) => (
                    <div key={idx} className="rounded-lg border border-[#E6E3DB] bg-[#FAF9F5] p-3 space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-semibold uppercase text-[#657858]">
                        <span>{q.category} · {q.difficulty}</span>
                        <span className="text-[#8E8B82]">#{idx + 1}</span>
                      </div>
                      <p className="font-bold text-[#18181B] text-xs">{q.question}</p>
                      <p className="text-[11px] text-[#575653] pt-1 border-t border-[#E6E3DB]">
                        <span className="font-semibold text-[#18181B]">Evaluation Focus: </span>
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
