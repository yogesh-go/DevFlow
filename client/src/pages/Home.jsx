function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-[calc(100vh-64px)] max-w-7xl items-center px-6 py-20">
        <div className="max-w-3xl">

          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-500">
            Developer Productivity Platform
          </p>

          <h1 className="text-5xl font-bold leading-tight sm:text-6xl">
            Build.
            <span className="text-blue-500"> Track.</span>
            <br />
            Improve.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            DevFlow helps developers manage their learning, track DSA progress,
            organize technical notes, and monitor their development journey
            from one place.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700">
              Get Started
            </button>

            <button className="rounded-lg border border-slate-700 px-6 py-3 font-medium text-slate-200 transition-colors hover:bg-slate-800">
              Explore Features
            </button>
          </div>

        </div>
      </section>
    </main>
  );
}

export default Home;