function Features() {
  const features = [
    {
      title: "DSA Tracker",
      description:
        "Track solved problems, topics, difficulty levels, and your overall DSA progress.",
    },
    {
      title: "Learning Dashboard",
      description:
        "Monitor your learning progress and keep important development goals in one place.",
    },
    {
      title: "Technical Notes",
      description:
        "Organize programming concepts, interview notes, and personal technical documentation.",
    },
    {
      title: "Progress Analytics",
      description:
        "Understand your consistency and progress through useful statistics and visual insights.",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-20 text-white">
      <section className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-500">
            Features
          </p>

          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
            Everything you need to
            <span className="text-blue-500"> grow as a developer.</span>
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-400">
            DevFlow brings your learning, problem solving, notes, and progress
            tracking into one focused developer workspace.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-xl border border-slate-800 bg-slate-900 p-6 transition-colors hover:border-blue-500/50"
            >
              <h2 className="text-xl font-semibold">
                {feature.title}
              </h2>

              <p className="mt-3 leading-7 text-slate-400">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Features;