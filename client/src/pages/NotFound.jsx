import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F6F2] px-6 text-[#18181B]">
      <div className="text-center space-y-4 max-w-md">
        <p className="text-6xl font-bold font-mono tracking-tight text-[#8E8B82]">
          404
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#18181B]">
          Page not found
        </h1>
        <p className="text-xs sm:text-sm text-[#575653] leading-relaxed">
          The requested route does not exist in this workspace or may have been moved.
        </p>

        <div className="pt-2">
          <Link to="/">
            <Button variant="primary" size="md">
              Return to Workspace
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;