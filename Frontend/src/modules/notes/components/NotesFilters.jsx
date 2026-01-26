const NotesFilters = ({ categories, selectedCategory, onCategoryChange, sortBy, onSortChange }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Category Filter */}
      <div className="min-w-40">
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Sort Filter */}
      <div className="min-w-40">
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="updated">Recently Updated</option>
          <option value="created">Recently Created</option>
          <option value="title">Title A-Z</option>
        </select>
      </div>
    </div>
  );
};

export default NotesFilters;