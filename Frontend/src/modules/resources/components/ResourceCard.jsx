import { toggleFavorite } from '../services/resource.api';

const ResourceCard = ({ resource, onClick, onUpdate }) => {
    const getTypeIcon = (type) => {
        const icons = {
            pdf: '📄',
            image: '🖼️',
            link: '🔗',
            document: '📝',
            video: '🎥',
            other: '📎'
        };
        return icons[type] || '📎';
    };

    const handleFavoriteClick = async (e) => {
        e.stopPropagation();
        try {
            await toggleFavorite(resource._id);
            onUpdate();
        } catch (err) {
            console.error('Failed to toggle favorite:', err);
        }
    };

    return (
        <div
            onClick={onClick}
            className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all cursor-pointer group"
        >
            <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                    <div className="text-4xl">{getTypeIcon(resource.type)}</div>
                    <button
                        onClick={handleFavoriteClick}
                        className="text-2xl hover:scale-110 transition-transform"
                    >
                        {resource.isFavorite ? '⭐' : '☆'}
                    </button>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {resource.title}
                </h3>
                
                {resource.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {resource.description}
                    </p>
                )}
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                        {resource.subject}
                    </span>
                    {resource.fileSize && (
                        <span>{(resource.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                    )}
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                    <span className="text-gray-600">{resource.category}</span>
                    <span>{new Date(resource.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    );
};

export default ResourceCard;
