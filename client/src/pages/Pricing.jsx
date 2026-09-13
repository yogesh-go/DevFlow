import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Button from "../components/ui/Button";

function Pricing() {
  const plans = [
    {
      name: "Community",
      price: "₹0",
      cadence: "free forever",
      description: "Everything individual engineers need to track and revise DSA problems.",
      features: [
        "Unlimited DSA problem tracking",
        "Automated 5-stage spaced repetition",
        "Technical notes & cheatsheets",
        "Activity contribution heatmap",
        "Live contest calendar",
        "AI code explanation suite",
      ],
      buttonText: "Start Free",
      buttonVariant: "secondary",
      popular: false,
    },
    {
      name: "Pro Engineer",
      price: "₹199",
      cadence: "per month",
      description: "For engineers preparing intensively for upcoming FAANG / tier-1 interviews.",
      features: [
        "Everything in Community",
        "Unlimited AI code optimizations",
        "Deep ATS resume keyword analysis",
        "Custom interview question generator",
        "Advanced retention metrics & export",
        "Priority feature updates",
      ],
      buttonText: "Join Pro",
      buttonVariant: "primary",
      popular: true,
    },
    {
      name: "Study Cohort",
      price: "₹499",
      cadence: "per team / month",
      description: "For small peer study groups, bootcamps, and competitive programming circles.",
      features: [
        "Everything in Pro",
        "Shared cohort problem lists",
        "Peer consistency leaderboard",
        "Shared technical documentation",
        "Team mock interview bank",
        "Admin workspace controls",
      ],
      buttonText: "Start Cohort",
      buttonVariant: "secondary",
      popular: false,
    },
  ];

  return (
    <div className="bg-[#F7F6F2] px-6 py-16 md:py-24">
      <div className="mx-auto max-w-5xl space-y-16">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#657858]">
            Simple & Transparent
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#18181B] leading-tight">
            Fair pricing for every developer.
          </h1>
          <p className="text-sm sm:text-base text-[#575653]">
            Start free with full tracking and spaced repetition. Upgrade only when you want accelerated AI preparation tools.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-xl border p-6 flex flex-col justify-between transition-all ${
                plan.popular
                  ? "border-[#657858] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] ring-1 ring-[#657858]/30"
                  : "border-[#E6E3DB] bg-[#FAF9F5]"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-2.5 right-6 rounded-full bg-[#657858] px-2.5 py-0.5 text-[10px] font-semibold text-white uppercase tracking-wider">
                  Recommended
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h2 className="text-base font-bold text-[#18181B] tracking-tight">
                    {plan.name}
                  </h2>
                  <p className="mt-1 text-xs text-[#575653] min-h-[32px]">
                    {plan.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#E6E3DB]">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-[#18181B]">
                      {plan.price}
                    </span>
                    <span className="text-xs text-[#8E8B82]">/ {plan.cadence}</span>
                  </div>
                </div>

                <ul className="space-y-2 pt-2 text-xs text-[#575653]">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#657858] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6">
                <Link to="/signup" className="block w-full">
                  <Button
                    variant={plan.buttonVariant}
                    size="md"
                    className="w-full shadow-xs"
                  >
                    <span>{plan.buttonText}</span>
                    <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Pricing;