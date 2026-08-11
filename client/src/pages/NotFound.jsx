import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <section className="text-center">

        <p className="text-7xl font-bold text-blue-500">
          404
        </p>

        <h1 className="mt-6 text-3xl font-bold">
          Page not found
        </h1>

        <p className="mt-3 max-w-md text-slate-400">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        <Link to="/" className="mt-8 inline-block">
          <Button>
            Back to Home
          </Button>
        </Link>

      </section>
    </main>
  );
}

export default NotFound;