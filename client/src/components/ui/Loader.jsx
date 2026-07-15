function Loader({ size = "md", text = "" }) {
  const sizes = {
    sm: "h-5 w-5 border-2",
    md: "h-8 w-8 border-[3px]",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizes[size]} animate-spin rounded-full border-blue-600 border-t-transparent`}
      ></div>

      {text && (
        <p className="text-sm text-slate-400">
          {text}
        </p>
      )}
    </div>
  );
}

export default Loader;