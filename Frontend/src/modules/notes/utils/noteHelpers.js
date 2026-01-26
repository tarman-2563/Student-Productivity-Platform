export const formatDistanceToNow = (date) => {
  const now = new Date();
  const noteDate = new Date(date);
  const diffInSeconds = Math.floor((now - noteDate) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getPreviewText = (content, maxLength = 150) => {
  if (!content) return '';
  
  const plainText = content
    .replace(/#{1,6}\s+/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/`(.*?)`/g, '$1') // Remove inline code
    .replace(/>\s+/g, '') // Remove quotes
    .replace(/[-*+]\s+/g, '') // Remove list markers
    .trim();

  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, maxLength) + '...';
};

export const countWords = (content) => {
  if (!content) return 0;
  return content.trim().split(/\s+/).filter(word => word.length > 0).length;
};

export const countCharacters = (content) => {
  return content ? content.length : 0;
};

export const estimateReadingTime = (content) => {
  const wordCount = countWords(content);
  const minutes = Math.ceil(wordCount / 200);
  return minutes === 1 ? '1 min read' : `${minutes} min read`;
};

export const highlightSearchTerm = (text, searchTerm) => {
  if (!searchTerm) return text;
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
};

export const validateNote = (noteData) => {
  const errors = {};

  if (!noteData.title || noteData.title.trim().length === 0) {
    errors.title = 'Title is required';
  } else if (noteData.title.trim().length > 200) {
    errors.title = 'Title must be less than 200 characters';
  }

  if (!noteData.content || noteData.content.trim().length === 0) {
    errors.content = 'Content is required';
  } else if (noteData.content.trim().length > 50000) {
    errors.content = 'Content must be less than 50,000 characters';
  }

  if (noteData.tags && noteData.tags.length > 10) {
    errors.tags = 'Maximum 10 tags allowed';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

export const parseTags = (tagString) => {
  if (!tagString) return [];
  
  return tagString
    .split(/[,\s]+/) // Split by comma or space
    .map(tag => tag.trim().toLowerCase())
    .filter(tag => tag.length > 0 && tag.length <= 20) // Filter valid tags
    .slice(0, 10); // Limit to 10 tags
};

export const groupNotesByDate = (notes) => {
  const groups = {};
  
  notes.forEach(note => {
    const date = new Date(note.updatedAt).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(note);
  });
  
  return groups;
};

export const sortNotes = (notes, sortBy) => {
  const sortedNotes = [...notes];
  
  switch (sortBy) {
    case 'title':
      return sortedNotes.sort((a, b) => a.title.localeCompare(b.title));
    case 'created':
      return sortedNotes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    case 'updated':
      return sortedNotes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    case 'priority':
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return sortedNotes.sort((a, b) => 
        (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0)
      );
    default:
      return sortedNotes;
  }
};

export const filterNotes = (notes, filters) => {
  return notes.filter(note => {
    if (filters.category && filters.category !== 'all' && note.category !== filters.category) {
      return false;
    }
    
    if (filters.priority && filters.priority !== 'all' && note.priority !== filters.priority) {
      return false;
    }
    
    if (filters.tag && (!note.tags || !note.tags.includes(filters.tag))) {
      return false;
    }
    
    if (filters.dateFrom || filters.dateTo) {
      const noteDate = new Date(note.updatedAt);
      if (filters.dateFrom && noteDate < new Date(filters.dateFrom)) {
        return false;
      }
      if (filters.dateTo && noteDate > new Date(filters.dateTo)) {
        return false;
      }
    }
    
    return true;
  });
};