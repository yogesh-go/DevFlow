import clsx from "clsx";

function Card({
  children,
  className = "",
  hover = false,
  surface = "white", // 'white' | 'elevated' | 'subtle'
  ...props
}) {
  const surfaces = {
    white: "bg-white",
    elevated: "bg-[#FAF9F5]",
    subtle: "bg-[#F2F0E8]",
  };

  return (
    <div
      className={clsx(
        "rounded-xl border border-[#E6E3DB] p-5 transition-all duration-200",
        surfaces[surface] || surfaces.white,
        "shadow-[0_1px_3px_rgba(0,0,0,0.03)]",
        hover && "hover:border-[#D5D1C6] hover:shadow-[0_2px_8px_rgba(0,0,0,0.05)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;