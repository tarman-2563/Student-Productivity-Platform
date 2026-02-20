const ResourceStats = ({ stats }) => {
    if (!stats) return null;

    const formatSize = (bytes) => {
        if (!bytes) return '0 MB';
        const mb = bytes / 1024 / 1024;
        return mb.toFixed(2) + ' MB';
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">Total Resources</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalResources || 0}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                        📚
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">Storage Used</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{formatSize(stats.totalSize)}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-2xl">
                        💾
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">Total Views</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalViews || 0}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl">
                        👁️
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">Favorites</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stats.favoriteCount || 0}</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center text-2xl">
                        ⭐
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResourceStats;
