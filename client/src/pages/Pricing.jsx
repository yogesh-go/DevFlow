function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "₹0",
      description: "For developers starting their journey.",
      features: [
        "DSA progress tracking",
        "Basic learning dashboard",
        "Technical notes",
      ],
    },
    {
      name: "Pro",
      price: "₹199",
      description: "For developers serious about consistent growth.",
      features: [
        "Everything in Free",
        "Advanced analytics",
        "Unlimited notes",
        "Detailed progress insights",
      ],
      popular: true,
    },
    {
      name: "Team",
      price: "₹499",
      description: "For small teams learning and building together.",
      features: [
        "Everything in Pro",
        "Team workspace",
        "Shared progress",
        "Team analytics",
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-20 text-white">
      <section className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-500">
            Pricing
          </p>

          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
            Simple plans for
            <span className="text-blue-500"> every developer.</span>
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-400">
            Start free and upgrade when you need more powerful tools for
            tracking your development journey.
          </p>
        </div>

        {/* Plans */}
        <div className="mx-auto mt-12 grid max-w-6xl gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`relative rounded-xl border p-6 ${
                plan.popular
                  ? "border-blue-500 bg-slate-900"
                  : "border-slate-800 bg-slate-900/60"
              }`}
            >
              {plan.popular && (
                <span className="absolute right-5 top-5 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold">
                  Popular
                </span>
              )}

              <h2 className="text-2xl font-semibold">
                {plan.name}
              </h2>

              <p className="mt-3 text-sm text-slate-400">
                {plan.description}
              </p>

              <div className="mt-6">
                <span className="text-4xl font-bold">
                  {plan.price}
                </span>

                {plan.name !== "Free" && (
                  <span className="text-slate-500"> / month</span>
                )}
              </div>

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="text-sm text-slate-300"
                  >
                    ✓ {feature}
                  </li>
                ))}
              </ul>

              <button
                className={`mt-8 w-full rounded-lg px-5 py-3 font-medium transition-colors ${
                  plan.popular
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "border border-slate-700 text-white hover:bg-slate-800"
                }`}
              >
                Get Started
              </button>
            </article>
          ))}
        </div>

      </section>
    </main>
  );
}

export default Pricing;