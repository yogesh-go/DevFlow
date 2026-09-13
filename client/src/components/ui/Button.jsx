import clsx from "clsx";
import { Loader2 } from "lucide-react";

const variants = {
  primary:
    "bg-[#18181B] text-white hover:bg-[#27272A] active:bg-[#09090B] border border-transparent shadow-[0_1px_2px_rgba(0,0,0,0.08)]",
  accent:
    "bg-[#657858] text-white hover:bg-[#4E5D44] active:bg-[#3D4935] border border-transparent shadow-[0_1px_2px_rgba(101,120,88,0.2)]",
  secondary:
    "bg-white text-[#18181B] border border-[#E6E3DB] hover:bg-[#FAF9F5] hover:border-[#D5D1C6] active:bg-[#F2F0E8] shadow-[0_1px_2px_rgba(0,0,0,0.03)]",
  outline:
    "bg-transparent text-[#575653] border border-[#E6E3DB] hover:bg-white hover:text-[#18181B] hover:border-[#D5D1C6] active:bg-[#FAF9F5]",
  ghost:
    "bg-transparent text-[#575653] hover:bg-[#F2F0E8] hover:text-[#18181B] active:bg-[#EAE7DC] border border-transparent",
  danger:
    "bg-[#FBF0F0] text-[#933D3D] border border-[#E8BFBF] hover:bg-[#F5E1E1] active:bg-[#EDCDCD]",
};

const sizes = {
  xs: "px-2.5 py-1 text-xs font-medium rounded-md gap-1.5",
  sm: "px-3 py-1.5 text-xs font-medium rounded-md gap-1.5",
  md: "px-4 py-2 text-sm font-medium rounded-lg gap-2",
  lg: "px-5 py-2.5 text-base font-medium rounded-lg gap-2.5",
};

function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  disabled = false,
  loading = false,
  ...props
}) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center transition-all duration-150 cursor-pointer select-none",
        "focus:outline-none focus:ring-2 focus:ring-[#657858]/30 focus:ring-offset-1 focus:ring-offset-[#F7F6F2]",
        "active:scale-[0.98]",
        disabled && "opacity-50 cursor-not-allowed active:scale-100 pointer-events-none",
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" />}
      {children}
    </button>
  );
}

export default Button;