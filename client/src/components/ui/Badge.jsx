import clsx from "clsx";

export function Badge({
  children,
  variant = "neutral",
  size = "md",
  className = "",
}) {
  const variants = {
    neutral: "bg-[#F2F0E8] text-[#575653] border-[#E6E3DB]",
    accent: "bg-[#EEF2EB] text-[#4E5D44] border-[#C6D2BF]",
    easy: "bg-[#EDF4EE] text-[#426447] border-[#BCD4C2]",
    medium: "bg-[#FAF4E8] text-[#865B20] border-[#EAD5AC]",
    hard: "bg-[#FBF0F0] text-[#933D3D] border-[#E8BFBF]",
    info: "bg-[#F0F2F5] text-[#4A5568] border-[#D1D8E0]",
    dark: "bg-[#18181B] text-[#FFFFFF] border-[#18181B]",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-0.5 text-xs",
    lg: "px-3 py-1 text-xs",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center font-medium rounded-md border tracking-tight transition-colors",
        variants[variant] || variants.neutral,
        sizes[size] || sizes.md,
        className
      )}
    >
      {children}
    </span>
  );
}

export default Badge;
