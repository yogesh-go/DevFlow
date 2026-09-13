import { Link } from "react-router-dom";
import {
  Code2,
  Repeat,
  FileText,
  BarChart3,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  Flame,
  ShieldCheck,
} from "lucide-react";
import Button from "../components/ui/Button";

function Home() {
  return (
    <div className="bg-[#F7F6F2] text-[#18181B]">
      {/* 1. HERO SECTION */}
      <section className="relative px-6 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="mx-auto max-w-5xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C6D2BF] bg-[#EEF2EB] px-3.5 py-1 text-xs font-semibold text-[#4E5D44] tracking-tight">
            <span className="h-1.5 w-1.5 rounded-full bg-[#657858] animate-pulse" />
            <span>DevFlow 2.0 — The Editorial Workspace for Engineers</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#18181B] leading-[1.08]">
            Your personal <br className="hidden sm:inline" />
            developer workspace.
          </h1>

          <p className="text-lg sm:text-xl text-[#575653] max-w-2xl mx-auto font-normal leading-relaxed">
            Track problems. Remember what you learned. <br />
            Improve consistently without burnout.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link to="/signup">
              <Button variant="primary" size="lg" className="shadow-sm">
                <span>Start Free Workspace</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            <Link to="/login">
              <Button variant="secondary" size="lg">
                <span>Sign In to Dashboard</span>
              </Button>
            </Link>
          </div>

          <div className="pt-4 flex items-center justify-center gap-6 text-xs text-[#8E8B82]">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#657858]" /> No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#657858]" /> Real-time spaced repetition
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#657858]" /> Built for SDE interviews
            </span>
          </div>
        </div>

        {/* 2. PRODUCT SHOWCASE VISUALIZATION */}
        <div className="mx-auto mt-14 max-w-5xl rounded-xl border border-[#E6E3DB] bg-white p-2 sm:p-4 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
          {/* Simulated Browser Bar */}
          <div className="flex items-center justify-between border-b border-[#E6E3DB] pb-3 px-2">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#E5E2DB]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#E5E2DB]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#E5E2DB]" />
            </div>
            <div className="rounded-md border border-[#E6E3DB] bg-[#FAF9F5] px-4 py-0.5 text-[11px] font-mono text-[#8E8B82]">
              devflow.workspace/dashboard
            </div>
            <div className="text-[11px] text-[#657858] font-medium">Synced</div>
          </div>

          {/* Simulated Workspace Preview */}
          <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Metric Preview 1 */}
            <div className="rounded-lg border border-[#E6E3DB] bg-[#FAF9F5] p-4">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8E8B82]">
                Problems Solved
              </span>
              <p className="text-3xl font-extrabold text-[#18181B] mt-1">127</p>
              <p className="text-[11px] text-[#657858] mt-0.5">Top 12% consistency</p>
            </div>

            {/* Metric Preview 2 */}
            <div className="rounded-lg border border-[#E6E3DB] bg-[#FAF9F5] p-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8E8B82]">
                  Daily Streak
                </span>
                <Flame className="h-4 w-4 text-[#865B20] fill-[#865B20]" />
              </div>
              <p className="text-3xl font-extrabold text-[#865B20] mt-1">18 days</p>
              <p className="text-[11px] text-[#8E8B82] mt-0.5">Active habit retained</p>
            </div>

            {/* Metric Preview 3 */}
            <div className="rounded-lg border border-[#E6E3DB] bg-[#FAF9F5] p-4">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8E8B82]">
                Scheduled Revisions
              </span>
              <p className="text-3xl font-extrabold text-[#18181B] mt-1">4 due</p>
              <p className="text-[11px] text-[#575653] mt-0.5">Interval algorithm active</p>
            </div>

            {/* Simulated Problem Table Row */}
            <div className="md:col-span-3 rounded-lg border border-[#E6E3DB] bg-white p-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-[#8E8B82] border-b border-[#E6E3DB] pb-2 font-medium">
                <span>REVISION QUEUE — TODAY</span>
                <span className="text-[#657858]">Day 1, 3, 7, 15, 30 protocol</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs py-1.5 border-b border-[#F2F0E8]">
                <div className="flex items-center gap-3">
                  <span className="rounded bg-[#EDF4EE] text-[#426447] px-2 py-0.5 text-[10px] font-medium border border-[#BCD4C2]">
                    Medium
                  </span>
                  <span className="font-semibold text-[#18181B]">
                    LRU Cache Implementation
                  </span>
                  <span className="text-[#8E8B82] text-[11px]">Hash Table · Doubly Linked List</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#575653]">Revision #3 (Day +7)</span>
                  <span className="rounded bg-[#EEF2EB] text-[#4E5D44] px-2 py-0.5 text-[10px] font-medium border border-[#C6D2BF]">
                    Ready to revise
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs py-1.5">
                <div className="flex items-center gap-3">
                  <span className="rounded bg-[#FBF0F0] text-[#933D3D] px-2 py-0.5 text-[10px] font-medium border border-[#E8BFBF]">
                    Hard
                  </span>
                  <span className="font-semibold text-[#18181B]">
                    Trapping Rain Water
                  </span>
                  <span className="text-[#8E8B82] text-[11px]">Two Pointers · Dynamic Programming</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#575653]">Revision #2 (Day +3)</span>
                  <span className="rounded bg-[#EEF2EB] text-[#4E5D44] px-2 py-0.5 text-[10px] font-medium border border-[#C6D2BF]">
                    Ready to revise
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PROBLEM & SOLUTION SECTION */}
      <section className="border-t border-[#E6E3DB] bg-[#FAF9F5] px-6 py-20">
        <div className="mx-auto max-w-5xl space-y-12">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#657858]">
              The Core Problem
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#18181B] mt-2">
              You solve 200 DSA problems. <br />
              A month later, you can barely recall 30.
            </h2>
            <p className="mt-4 text-sm text-[#575653] leading-relaxed">
              Standard study methods fail because human memory operates on the Ebbinghaus forgetting curve.
              Spreadsheets lack reminders. Generic todo apps do not understand algorithms.
              DevFlow turns solving problems into an active, compound knowledge base.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-[#E6E3DB] bg-white p-6 space-y-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#FBF0F0] text-[#933D3D] border border-[#E8BFBF]">
                ✕
              </div>
              <h3 className="text-base font-bold text-[#18181B]">Messy Spreadsheets</h3>
              <p className="text-xs text-[#575653] leading-relaxed">
                Manually copying links into Google Sheets with zero automated scheduling, no code formatting, and no retention insights.
              </p>
            </div>

            <div className="rounded-xl border border-[#E6E3DB] bg-white p-6 space-y-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#FAF4E8] text-[#865B20] border border-[#EAD5AC]">
                ⚠
              </div>
              <h3 className="text-base font-bold text-[#18181B]">Disjointed Notes</h3>
              <p className="text-xs text-[#575653] leading-relaxed">
                Scattered notes in random Markdown files or chat apps that disconnect code snippets from actual algorithmic problems.
              </p>
            </div>

            <div className="rounded-xl border border-[#C6D2BF] bg-[#EEF2EB] p-6 space-y-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#657858] text-white">
                ✓
              </div>
              <h3 className="text-base font-bold text-[#18181B]">The DevFlow Protocol</h3>
              <p className="text-xs text-[#4E5D44] leading-relaxed">
                Log a solved problem once. DevFlow automatically computes your 5-stage spaced repetition intervals, tracks patterns, and surfaces due reviews daily.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS / RETENTION CURVE */}
      <section className="border-t border-[#E6E3DB] px-6 py-20 bg-white">
        <div className="mx-auto max-w-5xl space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#657858]">
              The Retention Protocol
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#18181B]">
              Scientifically engineered intervals for long-term recall.
            </h2>
            <p className="text-sm text-[#575653]">
              Every time you solve a problem, DevFlow automatically anchors it to a 5-step interval cadence.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { stage: "Stage 1", day: "Day +1", label: "Initial Anchor", desc: "First review to cement pattern intuition." },
              { stage: "Stage 2", day: "Day +3", label: "Pattern Reinforcement", desc: "Solidify core invariants and edge cases." },
              { stage: "Stage 3", day: "Day +7", label: "One-Week Recall", desc: "Test active code reconstruction from scratch." },
              { stage: "Stage 4", day: "Day +15", label: "Mid-Term Mastery", desc: "Validate speed and complexity guarantees." },
              { stage: "Stage 5", day: "Day +30", label: "Permanent Retention", desc: "Permanent interview-ready instinct." },
            ].map((s, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-[#E6E3DB] bg-[#FAF9F5] p-4 text-center space-y-2 hover:border-[#D5D1C6] transition-colors"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#657858]">
                  {s.stage}
                </span>
                <p className="text-xl font-bold text-[#18181B]">{s.day}</p>
                <p className="text-xs font-semibold text-[#18181B]">{s.label}</p>
                <p className="text-[11px] text-[#575653] leading-tight">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WORKSPACE FEATURES */}
      <section className="border-t border-[#E6E3DB] bg-[#FAF9F5] px-6 py-20">
        <div className="mx-auto max-w-5xl space-y-12">
          <div className="max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#657858]">
              Product Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#18181B] mt-2">
              Everything an engineer needs to prepare for top-tier roles.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-[#E6E3DB] bg-white p-6 space-y-3">
              <Code2 className="h-6 w-6 text-[#657858]" />
              <h3 className="text-base font-bold text-[#18181B]">DSA Problem Tracker</h3>
              <p className="text-xs text-[#575653] leading-relaxed">
                Log problems across LeetCode, Codeforces, and CodeChef. Filter by topics, difficulty, and status with notebook clarity.
              </p>
            </div>

            <div className="rounded-xl border border-[#E6E3DB] bg-white p-6 space-y-3">
              <Repeat className="h-6 w-6 text-[#657858]" />
              <h3 className="text-base font-bold text-[#18181B]">Spaced Repetition Queue</h3>
              <p className="text-xs text-[#575653] leading-relaxed">
                Daily revision queue categorized into Today, Overdue, Upcoming, and Completed with single-click progress updates.
              </p>
            </div>

            <div className="rounded-xl border border-[#E6E3DB] bg-white p-6 space-y-3">
              <FileText className="h-6 w-6 text-[#657858]" />
              <h3 className="text-base font-bold text-[#18181B]">Technical Notes & Docs</h3>
              <p className="text-xs text-[#575653] leading-relaxed">
                Notion-style documentation for algorithmic templates, code cheatsheets, and interview problem associations.
              </p>
            </div>

            <div className="rounded-xl border border-[#E6E3DB] bg-white p-6 space-y-3">
              <BarChart3 className="h-6 w-6 text-[#657858]" />
              <h3 className="text-base font-bold text-[#18181B]">Real-Time Analytics</h3>
              <p className="text-xs text-[#575653] leading-relaxed">
                True database metrics including GitHub-style activity heatmaps, difficulty ratios, 7-day velocity, and topic mastery.
              </p>
            </div>

            <div className="rounded-xl border border-[#E6E3DB] bg-white p-6 space-y-3">
              <Sparkles className="h-6 w-6 text-[#657858]" />
              <h3 className="text-base font-bold text-[#18181B]">AI Developer Assistant</h3>
              <p className="text-xs text-[#575653] leading-relaxed">
                Algorithmic explanation, code optimization suggestions, structured note generation, and ATS resume keyword analysis.
              </p>
            </div>

            <div className="rounded-xl border border-[#E6E3DB] bg-white p-6 space-y-3">
              <ShieldCheck className="h-6 w-6 text-[#657858]" />
              <h3 className="text-base font-bold text-[#18181B]">Competitive Contests</h3>
              <p className="text-xs text-[#575653] leading-relaxed">
                Live upcoming contest schedule across major competitive programming platforms so you never miss an active round.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION */}
      <section className="border-t border-[#E6E3DB] bg-white px-6 py-20 text-center">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#18181B] text-white font-mono font-bold text-sm mx-auto shadow-sm">
            &lt;/&gt;
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#18181B]">
            Ready to upgrade your developer preparation?
          </h2>

          <p className="text-sm sm:text-base text-[#575653] max-w-xl mx-auto leading-relaxed">
            Join engineers using DevFlow to build authentic consistency, retain algorithmic patterns, and ace technical interviews.
          </p>

          <div className="pt-2 flex justify-center gap-3">
            <Link to="/signup">
              <Button variant="primary" size="lg">
                <span>Create Your Workspace Free</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E6E3DB] bg-[#FAF9F5] px-6 py-10 text-xs text-[#8E8B82]">
        <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#18181B]">DevFlow</span>
            <span>— The Editorial Developer Workspace</span>
          </div>
          <div className="flex items-center gap-4 text-[#575653]">
            <Link to="/features" className="hover:text-[#18181B]">Features</Link>
            <Link to="/pricing" className="hover:text-[#18181B]">Pricing</Link>
            <Link to="/login" className="hover:text-[#18181B]">Login</Link>
            <Link to="/signup" className="hover:text-[#18181B]">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;