function PageHeader({
  kicker,
  title,
  description,
  actions,
  className = "",
}) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-[#E6E3DB]/70 ${className}`}>
      <div className="space-y-1">
        {kicker && (
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#657858]">
            {kicker}
          </div>
        )}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#18181B]">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-[#575653] max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          {actions}
        </div>
      )}
    </div>
  );
}

export default PageHeader;
