function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="w-8 h-8 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin" />

      <p className="text-slate-400">
        {message}
      </p>
    </div>
  );
}

export default LoadingSpinner;