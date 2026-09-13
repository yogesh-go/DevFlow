import Button from "./Button";

function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  actionButton,
  className = "",
}) {
  return (
    <div
      className={`rounded-xl border border-dashed border-[#D5D1C6] bg-white/60 p-10 text-center flex flex-col items-center justify-center ${className}`}
    >
      {Icon && (
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#EEF2EB] text-[#657858] mb-3.5 border border-[#C6D2BF]">
          <Icon className="h-5 w-5" />
        </div>
      )}
      <h3 className="text-sm font-semibold text-[#18181B] tracking-tight">
        {title}
      </h3>
      {description && (
        <p className="mt-1 text-xs text-[#575653] max-w-sm leading-relaxed">
          {description}
        </p>
      )}

      {actionLabel && onAction && (
        <div className="mt-4">
          <Button variant="secondary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}

      {actionButton && <div className="mt-4">{actionButton}</div>}
    </div>
  );
}

export default EmptyState;
