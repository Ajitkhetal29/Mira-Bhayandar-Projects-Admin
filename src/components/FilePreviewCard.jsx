/**
 * Thumbnail / chip with overlay remove (matches gallery UX).
 */
export default function FilePreviewCard({
  onRemove,
  ariaLabel = "Remove file",
  className = "",
  children,
}) {
  return (
    <div
      className={`relative border border-gray-700 rounded-xl overflow-hidden bg-gray-800/70 ${className}`}
    >
      {children}
      <button
        type="button"
        className="absolute top-1 right-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 p-0 text-sm leading-none text-red-400 hover:text-red-300"
        onClick={onRemove}
        aria-label={ariaLabel}
      >
        ×
      </button>
    </div>
  );
}
