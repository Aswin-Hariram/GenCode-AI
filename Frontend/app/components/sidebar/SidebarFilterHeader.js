import { FiSearch } from 'react-icons/fi';

const SidebarFilterHeader = ({
  view,
  setView,
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  difficultyFilter,
  setDifficultyFilter,
  availableCategories,
  availableDifficulties,
  currentTheme
}) => (
  <>
    <div className="flex gap-2 mb-4">
      <button
        onClick={() => setView('recent')}
        className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
          view === 'recent'
            ? currentTheme === 'dark'
              ? 'bg-gray-700 shadow text-blue-400 shadow-md shadow-blue-500/10'
              : 'bg-white shadow text-blue-600 shadow-md shadow-blue-500/20'
            : currentTheme === 'dark'
              ? 'text-gray-300 hover:bg-gray-700/60 hover:text-white'
              : 'text-gray-600 hover:bg-white/80 hover:text-gray-900'
        }`}
      >
        Recent
      </button>
      <button
        onClick={() => setView('all')}
        className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
          view === 'all'
            ? currentTheme === 'dark'
              ? 'bg-gray-700 shadow text-blue-400 shadow-md shadow-blue-500/10'
              : 'bg-white shadow text-blue-600 shadow-md shadow-blue-500/20'
            : currentTheme === 'dark'
              ? 'text-gray-300 hover:bg-gray-700/60 hover:text-white'
              : 'text-gray-600 hover:bg-white/80 hover:text-gray-900'
        }`}
      >
        All Topics
      </button>
    </div>
    {/* Search Bar */}
    <div className="relative mb-4">
      <span className="absolute left-3 top-2 text-gray-400">
        <FiSearch className="w-5 h-5" />
      </span>
      <input
        type="text"
        className={`w-full pl-10 pr-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
          currentTheme === 'dark'
            ? 'bg-gray-800 border-gray-700 text-blue-100 placeholder-gray-400'
            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
        }`}
        placeholder="Search topics..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        aria-label="Search topics"
      />
    </div>
    <div className="flex gap-2 mb-4">
      <select
        className={`flex-1 py-2 px-3 rounded-lg border text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 ${
          currentTheme === 'dark'
            ? 'bg-gray-800 border-gray-700 text-blue-100' : 'bg-white border-gray-300 text-gray-900'
        }`}
        value={categoryFilter}
        onChange={e => setCategoryFilter(e.target.value)}
        aria-label="Filter by category"
      >
        <option value="all">All Categories</option>
        {[...availableCategories].map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      <select
        className={`flex-1 py-2 px-3 rounded-lg border text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 ${
          currentTheme === 'dark'
            ? 'bg-gray-800 border-gray-700 text-blue-100' : 'bg-white border-gray-300 text-gray-900'
        }`}
        value={difficultyFilter}
        onChange={e => setDifficultyFilter(e.target.value)}
        aria-label="Filter by difficulty"
      >
        <option value="all">All Difficulties</option>
        {[...availableDifficulties].map(diff => (
          <option key={diff} value={diff}>{diff}</option>
        ))}
      </select>
    </div>
  </>
);

export default SidebarFilterHeader;
