import { useState } from 'react';
import { formatDistanceToNow } from '../utils/noteHelpers';

const NoteCard = ({ note, onEdit, onDelete, onPin, onArchive }) => {
  const [showFullContent, setShowFullContent] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const getCategoryColor = (category) => {
    const colors = {
      'personal': 'bg-blue-100 text-blue-800 border-blue-200',
      'work': 'bg-green-100 text-green-800 border-green-200',
      'study': 'bg-purple-100 text-purple-800 border-purple-200',
      'ideas': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'todo': 'bg-red-100 text-red-800 border-red-200',
      'default': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[category?.toLowerCase()] || colors.default;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'personal': '👤',
      'work': '💼',
      'study': '📚',
      'ideas': '💡',
      'todo': '✅',
      'default': '📝'
    };
    return icons[category?.toLowerCase()] || icons.default;
  };

  const truncateContent = (content, maxLength = 200) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-400';
    }
  };

  const renderMarkdownPreview = (content) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded text-sm">$1</code>')
      .replace(/^# (.*$)/gm, '<h3 class="font-bold text-lg">$1</h3>')
      .replace(/^## (.*$)/gm, '<h4 class="font-bold text-base">$1</h4>')
      .replace(/^### (.*$)/gm, '<h5 class="font-bold text-sm">$1</h5>')
      .replace(/\n/g, '<br>');
  };

  const wordCount = note.content.trim().split(/\s+/).filter(word => word.length > 0).length;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <div className={`bg-white rounded-xl shadow-sm border transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${
      note.isPinned ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200'
    } ${note.isArchived ? 'opacity-60' : ''}`}>
      
      {/* Pinned Indicator */}
      {note.isPinned && (
        <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 rounded-full p-1 shadow-sm">
          <span className="text-xs">📌</span>
        </div>
      )}

      {/* Header */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-lg leading-tight mb-2 truncate">
              {note.title}
            </h3>
            <div className="flex items-center space-x-3">
              {note.category && (
                <div className={`flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(note.category)}`}>
                  <span>{getCategoryIcon(note.category)}</span>
                  <span>{note.category}</span>
                </div>
              )}
              {note.priority && (
                <div className={`flex items-center space-x-1 text-xs font-medium ${getPriorityColor(note.priority)}`}>
                  <span className="w-2 h-2 rounded-full bg-current"></span>
                  <span className="capitalize">{note.priority}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="relative ml-2">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
            
            {showMenu && (
              <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-20 min-w-32">
                <button
                  onClick={() => {
                    onEdit(note);
                    setShowMenu(false);
                  }}
                  className="flex items-center space-x-2 w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <span>✏️</span>
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => {
                    onPin && onPin(note.id);
                    setShowMenu(false);
                  }}
                  className="flex items-center space-x-2 w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <span>{note.isPinned ? '📌' : '📍'}</span>
                  <span>{note.isPinned ? 'Unpin' : 'Pin'}</span>
                </button>
                <button
                  onClick={() => {
                    onArchive && onArchive(note.id);
                    setShowMenu(false);
                  }}
                  className="flex items-center space-x-2 w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <span>{note.isArchived ? '📤' : '📥'}</span>
                  <span>{note.isArchived ? 'Unarchive' : 'Archive'}</span>
                </button>
                <hr className="my-1" />
                <button
                  onClick={() => {
                    onDelete(note.id);
                    setShowMenu(false);
                  }}
                  className="flex items-center space-x-2 w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <span>🗑️</span>
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pb-4">
        <div className="text-gray-700 text-sm leading-relaxed">
          {showFullContent ? (
            <div>
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: renderMarkdownPreview(note.content) 
                }}
              />
              {note.content.length > 200 && (
                <button
                  onClick={() => setShowFullContent(false)}
                  className="text-blue-600 hover:text-blue-800 text-xs mt-3 font-medium"
                >
                  Show less
                </button>
              )}
            </div>
          ) : (
            <div>
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: renderMarkdownPreview(truncateContent(note.content)) 
                }}
              />
              {note.content.length > 200 && (
                <button
                  onClick={() => setShowFullContent(true)}
                  className="text-blue-600 hover:text-blue-800 text-xs mt-3 font-medium"
                >
                  Read more
                </button>
              )}
            </div>
          )}
        </div>

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {note.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full border border-blue-200"
              >
                #{tag}
              </span>
            ))}
            {note.tags.length > 3 && (
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                +{note.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-gray-50 rounded-b-xl border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1">
              <span>📅</span>
              <span>{formatDistanceToNow(note.updatedAt)}</span>
            </span>
            {wordCount > 0 && (
              <span className="flex items-center space-x-1">
                <span>📊</span>
                <span>{wordCount} words</span>
              </span>
            )}
            {readingTime > 0 && (
              <span className="flex items-center space-x-1">
                <span>⏱️</span>
                <span>{readingTime} min read</span>
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit(note)}
              className="text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors"
            >
              Edit
            </button>
          </div>
        </div>
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
};

export default NoteCard;