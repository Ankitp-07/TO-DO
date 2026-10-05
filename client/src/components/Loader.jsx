/**
 * Loader — full-page or inline spinner
 */
export default function Loader({ fullPage = false }) {
  if (fullPage) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-200 dark:border-indigo-900 animate-spin border-t-indigo-600 dark:border-t-indigo-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-6">
      <div className="w-7 h-7 rounded-full border-3 border-indigo-200 dark:border-indigo-900 animate-spin border-t-indigo-600 dark:border-t-indigo-400" />
    </div>
  );
}
