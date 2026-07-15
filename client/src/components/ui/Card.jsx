import clsx from "clsx";

function Card({
  children,
  className = "",
  hover = false,
  ...props
}) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg transition-all duration-300",
        hover && "hover:-translate-y-1 hover:border-blue-600 hover:shadow-blue-500/10",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;