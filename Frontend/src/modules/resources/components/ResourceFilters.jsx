const ResourceFilters = ({ filters, onFilterChange, resources }) => {
    const types = ['all', 'pdf', 'image', 'link', 'document', 'video', 'other'];
    const subjects = ['all', ...new Set(resources.map(r => r.subject).filter(Boolean))];
    const categories = ['all', 'Study Material', 'Lecture Notes', 'Practice Problems', 'Reference', 'Assignment', 'Project', 'Other'];

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search */}
                <div className="lg:col-span-2">
                    <input
                        type="text"
                        placeholder="Search resources..."
                        value={filters.search}
                        onChange={(e) => onFilterChange({ search: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Type Filter */}
                <select
                    value={filters.type}
                    onChange={(e) => onFilterChange({ type: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {types.map(type => (
                        <option key={type} value={type}>
                            {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                    ))}
                </select>

                {/* Subject Filter */}
                <select
                    value={filters.subject}
                    onChange={(e) => onFilterChange({ subject: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {subjects.map(subject => (
                        <option key={subject} value={subject}>
                            {subject === 'all' ? 'All Subjects' : subject}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <button
                    onClick={() => onFilterChange({ favorites: !filters.favorites })}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        filters.favorites
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    ⭐ {filters.favorites ? 'Showing Favorites' : 'Show Favorites'}
                </button>

                <select
                    value={filters.sortBy}
                    onChange={(e) => onFilterChange({ sortBy: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="createdAt">Newest First</option>
                    <option value="title">Title A-Z</option>
                    <option value="viewCount">Most Viewed</option>
                    <option value="downloadCount">Most Downloaded</option>
                </select>
            </div>
        </div>
    );
};

export default ResourceFilters;
