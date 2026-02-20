import { deleteResource, downloadResource } from '../services/resource.api';

const ResourceDetailModal = ({ resource, onClose, onUpdate }) => {
    const handleDownload = async () => {
        try {
            const blob = await downloadResource(resource._id);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = resource.fileName || resource.title;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error('Download failed:', err);
            alert('Failed to download resource');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this resource?')) {
            try {
                await deleteResource(resource._id);
                onUpdate();
                onClose();
            } catch (err) {
                console.error('Delete failed:', err);
                alert('Failed to delete resource');
            }
        }
    };

    const handleOpenLink = () => {
        if (resource.externalUrl) {
            window.open(resource.externalUrl, '_blank');
        } else if (resource.fileUrl) {
            window.open(`http://localhost:5757${resource.fileUrl}`, '_blank');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-start justify-between">
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{resource.title}</h2>
                        <div className="flex items-center space-x-3">
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                {resource.subject}
                            </span>
                            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                                {resource.category}
                            </span>
                            {resource.isFavorite && <span className="text-xl">⭐</span>}
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {resource.description && (
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                            <p className="text-gray-700">{resource.description}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Type</h3>
                            <p className="text-gray-700 capitalize">{resource.type}</p>
                        </div>
                        {resource.fileSize && (
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">File Size</h3>
                                <p className="text-gray-700">{(resource.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                        )}
                    </div>

                    {resource.tags && resource.tags.length > 0 && (
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {resource.tags.map((tag, idx) => (
                                    <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-gray-900">{resource.viewCount || 0}</p>
                            <p className="text-sm text-gray-600">Views</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-gray-900">{resource.downloadCount || 0}</p>
                            <p className="text-sm text-gray-600">Downloads</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-medium text-gray-900">
                                {new Date(resource.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-600">Added</p>
                        </div>
                    </div>
                </div>

                <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex items-center justify-between">
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                    >
                        Delete
                    </button>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={handleOpenLink}
                            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition-colors font-medium"
                        >
                            Open
                        </button>
                        {resource.fileUrl && (
                            <button
                                onClick={handleDownload}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-sm"
                            >
                                Download
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResourceDetailModal;
