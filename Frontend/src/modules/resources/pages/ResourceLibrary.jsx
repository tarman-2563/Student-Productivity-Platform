import { useState } from 'react';
import useResources from '../hooks/useResources';
import ResourceGrid from '../components/ResourceGrid';
import ResourceFilters from '../components/ResourceFilters';
import UploadResourceModal from '../components/UploadResourceModal';
import ResourceDetailModal from '../components/ResourceDetailModal';
import ResourceStats from '../components/ResourceStats';

const ResourceLibrary = () => {
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedResource, setSelectedResource] = useState(null);
    const [filters, setFilters] = useState({
        type: 'all',
        category: 'all',
        subject: 'all',
        search: '',
        sortBy: 'createdAt',
        sortOrder: 'desc',
        favorites: false
    });

    const { resources, loading, error, refetch, stats } = useResources(filters);

    const handleUploadSuccess = () => {
        setShowUploadModal(false);
        refetch();
    };

    const handleResourceClick = (resource) => {
        setSelectedResource(resource);
    };

    const handleFilterChange = (newFilters) => {
        setFilters({ ...filters, ...newFilters });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Resource Library</h1>
                        <p className="text-gray-600">Organize and access your study materials</p>
                    </div>
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="mt-4 lg:mt-0 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow-sm"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Add Resource</span>
                    </button>
                </div>

                {/* Stats */}
                <ResourceStats stats={stats} />

                {/* Filters */}
                <ResourceFilters 
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    resources={resources}
                />

                {/* Resource Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-3 text-gray-600">Loading resources...</span>
                    </div>
                ) : error ? (
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                        <div className="text-red-500 text-6xl mb-4">📁</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to Load Resources</h2>
                        <p className="text-gray-600 mb-6">We couldn't load your resources. Please try again.</p>
                        <button 
                            onClick={refetch}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                ) : resources.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <div className="text-gray-400 text-8xl mb-6">📚</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">No Resources Yet</h2>
                        <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                            Start building your resource library by uploading study materials, PDFs, images, or adding useful links.
                        </p>
                        <button
                            onClick={() => setShowUploadModal(true)}
                            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Add Your First Resource</span>
                        </button>
                    </div>
                ) : (
                    <ResourceGrid 
                        resources={resources}
                        onResourceClick={handleResourceClick}
                        onRefetch={refetch}
                    />
                )}

                {/* Upload Modal */}
                {showUploadModal && (
                    <UploadResourceModal
                        onClose={() => setShowUploadModal(false)}
                        onSuccess={handleUploadSuccess}
                    />
                )}

                {/* Detail Modal */}
                {selectedResource && (
                    <ResourceDetailModal
                        resource={selectedResource}
                        onClose={() => setSelectedResource(null)}
                        onUpdate={refetch}
                    />
                )}
            </div>
        </div>
    );
};

export default ResourceLibrary;
