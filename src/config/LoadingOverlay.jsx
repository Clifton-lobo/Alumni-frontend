const LoadingOverlay = ({ loading }) => {
  return (
    <div
      className={`
        absolute inset-0 z-10
        bg-white/60 backdrop-blur-sm
        flex items-center justify-center
        transition-all duration-300 ease-out
        ${
          loading
            ? "opacity-100 scale-100"
            : "opacity-0 scale-[0.98] pointer-events-none"
        }
      `}
      role="status"
      aria-live="polite"
      aria-label="Loading events"
    >
      <div className="flex flex-col items-center gap-2">
        <div className="h-8 w-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-gray-600">Updating events…</span>
      </div>
    </div>
  );
};

export default LoadingOverlay;
