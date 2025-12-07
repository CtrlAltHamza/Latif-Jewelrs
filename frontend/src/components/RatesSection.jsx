export default function RatesSection({ rates }) {
  if (!rates) return <p className="text-center py-8 text-gray-500">Loading rates...</p>;

  return (
    <section className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          Current Gold & Silver Rates
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gold Card */}
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6 border-l-4 border-yellow-500">
            <h3 className="text-2xl font-bold text-yellow-600 mb-4">Gold Rates</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="text-gray-600 dark:text-gray-300">Per Tola:</span>
                <span className="text-xl font-semibold text-gray-800 dark:text-white">
                  ₨ {rates.gold_per_tola?.toLocaleString() || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Per Gram:</span>
                <span className="text-xl font-semibold text-gray-800 dark:text-white">
                  ₨ {rates.gold_per_gram?.toLocaleString() || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Silver Card */}
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6 border-l-4 border-gray-400">
            <h3 className="text-2xl font-bold text-gray-500 mb-4">Silver Rates</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="text-gray-600 dark:text-gray-300">Per Tola:</span>
                <span className="text-xl font-semibold text-gray-800 dark:text-white">
                  ₨ {rates.silver_per_tola?.toLocaleString() || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Per Gram:</span>
                <span className="text-xl font-semibold text-gray-800 dark:text-white">
                  ₨ {rates.silver_per_gram?.toLocaleString() || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Last updated today
        </p>
      </div>
    </section>
  );
}
