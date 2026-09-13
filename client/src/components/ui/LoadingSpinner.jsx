import { Loader2 } from "lucide-react";

function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <Loader2 className="h-6 w-6 animate-spin text-[#657858]" />
      {message && (
        <p className="text-xs font-medium text-[#575653] tracking-tight">
          {message}
        </p>
      )}
    </div>
  );
}

export default LoadingSpinner;