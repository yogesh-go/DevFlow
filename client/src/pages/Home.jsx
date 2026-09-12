import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-950 text-white flex items-center">
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="max-w-3xl">

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            AI-Powered Developer Workspace
          </div>

          <h1 className="text-5xl font-extrabold leading-tight sm:text-6xl tracking-tight">
            Build.
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500"> Track.</span>
            <br />
            Accelerate.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            DevFlow brings your DSA problem tracking, spaced repetition revision,
            technical notes, and AI-assisted code optimization into a unified,
            interview-ready developer workspace.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/signup"
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-all shadow-lg shadow-blue-600/25 hover:bg-blue-500 hover:shadow-blue-500/35"
            >
              Get Started Free
            </Link>

            <Link
              to="/features"
              className="rounded-lg border border-slate-700 px-6 py-3 font-medium text-slate-200 transition-colors hover:bg-slate-800 hover:text-white"
            >
              Explore Features
            </Link>
          </div>

        </div>
      </section>
    </main>
  );
}

export default Home;