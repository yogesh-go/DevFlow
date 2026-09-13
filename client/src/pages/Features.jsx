import { Link } from "react-router-dom";
import {
  Code2,
  Repeat,
  FileText,
  BarChart3,
  Sparkles,
  Trophy,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import Button from "../components/ui/Button";

function Features() {
  const features = [
    {
      icon: Code2,
      title: "DSA Problem Notebook",
      description:
        "Track solved problems across LeetCode, Codeforces, and CodeChef. Catalog topics, time spent, complexity notes, and external problem links with editorial clarity.",
    },
    {
      icon: Repeat,
      title: "Spaced Repetition Engine",
      description:
        "Automatically schedules Day 1, 3, 7, 15, and 30 intervals upon solving a problem. Ensures algorithmic patterns transition into permanent procedural memory.",
    },
    {
      icon: FileText,
      title: "Notion-Style Technical Notes",
      description:
        "A distraction-free markdown knowledge base for algorithmic cheatsheets, system design summaries, and interview takeaways with problem associations.",
    },
    {
      icon: BarChart3,
      title: "GitHub-Style Activity Heatmap",
      description:
        "Quiet, honest database analytics visualizing daily consistency, solve velocity, difficulty ratios, and topic coverage without chartjunk.",
    },
    {
      icon: Sparkles,
      title: "AI Algorithmic Studio",
      description:
        "Evaluate time/space complexity, find subtle edge-case bugs, generate structured solution notes, and analyze resume ATS keywords for SDE positions.",
    },
    {
      icon: Trophy,
      title: "Contest Calendar",
      description:
        "Live upcoming contest schedules across LeetCode, Codeforces, and CodeChef so you can plan weekly competitive programming sessions.",
    },
  ];

  return (
    <div className="bg-[#F7F6F2] px-6 py-16 md:py-24">
      <div className="mx-auto max-w-5xl space-y-16">
        {/* Header */}
        <div className="max-w-2xl space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#657858]">
            Platform Capabilities
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#18181B] leading-tight">
            Designed for engineers who take preparation seriously.
          </h1>
          <p className="text-sm sm:text-base text-[#575653] leading-relaxed">
            Every feature in DevFlow exists to eliminate cognitive overhead and reinforce active algorithmic recall before high-stakes technical interviews.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="rounded-xl border border-[#E6E3DB] bg-white p-6 space-y-3 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-[#D5D1C6] transition-colors"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#EEF2EB] text-[#657858] border border-[#C6D2BF]">
                  <Icon className="h-4 w-4" />
                </div>
                <h2 className="text-base font-bold text-[#18181B] tracking-tight">
                  {feature.title}
                </h2>
                <p className="text-xs text-[#575653] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Banner */}
        <div className="rounded-xl border border-[#E6E3DB] bg-[#FAF9F5] p-8 text-center space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold text-[#18181B] tracking-tight">
            Experience the difference of a focused workspace.
          </h3>
          <p className="text-xs sm:text-sm text-[#575653] max-w-md mx-auto">
            Free forever for individual developers. No setup friction.
          </p>
          <div className="pt-1">
            <Link to="/signup">
              <Button variant="primary" size="md">
                <span>Start Your Workspace</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Features;