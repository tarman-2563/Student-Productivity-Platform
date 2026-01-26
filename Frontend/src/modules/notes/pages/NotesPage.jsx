import { useState } from 'react';
import useNotes from '../hooks/useNotes';
import NotesList from '../components/NotesList';
import CreateNoteForm from '../components/CreateNoteForm';
import EditNoteModal from '../components/EditNoteModal';
import NotesSearch from '../components/NotesSearch';
import NotesFilters from '../components/NotesFilters';

const NotesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('updated');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [viewMode, setViewMode] = useState('all'); // all, active, archived

  const { notes, loading, error, createNote, updateNote, deleteNote, pinNote, archiveNote, refetch } = useNotes();

  const handleCreateNote = async (noteData) => {
    try {
      await createNote(noteData);
      setShowCreateForm(false);
    } catch (err) {
      console.error('Failed to create note:', err);
    }
  };

  const handleUpdateNote = async (noteId, noteData) => {
    try {
      await updateNote(noteId, noteData);
      setEditingNote(null);
    } catch (err) {
      console.error('Failed to update note:', err);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      try {
        await deleteNote(noteId);
      } catch (err) {
        console.error('Failed to delete note:', err);
      }
    }
  };

  const handlePinNote = async (noteId) => {
    try {
      await pinNote(noteId);
    } catch (err) {
      console.error('Failed to pin/unpin note:', err);
    }
  };

  const handleArchiveNote = async (noteId) => {
    try {
      await archiveNote(noteId);
    } catch (err) {
      console.error('Failed to archive/unarchive note:', err);
    }
  };

  const filteredNotes = (Array.isArray(notes) ? notes : [])
    .filter(note => {
      const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (note.tags && note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
      const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;
      const matchesView = viewMode === 'all' || 
                         (viewMode === 'active' && !note.isArchived) ||
                         (viewMode === 'archived' && note.isArchived);
      return matchesSearch && matchesCategory && matchesView;
    })
    .sort((a, b) => {
      if (viewMode !== 'archived') {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
      }
      
      switch (sortBy) {
        case 'created':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'updated':
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'category':
          return (a.category || '').localeCompare(b.category || '');
        default:
          return new Date(b.updatedAt) - new Date(a.updatedAt);
      }
    });

  const categories = ['all', ...new Set((Array.isArray(notes) ? notes : []).map(note => note.category).filter(Boolean))];

  const stats = {
    total: notes.length,
    active: notes.filter(note => !note.isArchived).length,
    archived: notes.filter(note => note.isArchived).length,
    pinned: notes.filter(note => note.isPinned).length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="text-red-500 text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to Load Notes</h2>
            <p className="text-gray-600 mb-6">We couldn't load your notes. Please try again.</p>
            <button 
              onClick={refetch}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Notes</h1>
            <p className="text-gray-600">Organize your thoughts and ideas</p>
            
            <div className="flex items-center space-x-6 mt-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                <span>{stats.active} Active</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                <span>{stats.pinned} Pinned</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span className="w-3 h-3 bg-gray-500 rounded-full"></span>
                <span>{stats.archived} Archived</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow-sm"
            >
              <span>+</span>
              <span>New Note</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <NotesSearch 
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('all')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    viewMode === 'all' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  All ({stats.total})
                </button>
                <button
                  onClick={() => setViewMode('active')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    viewMode === 'active' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Active ({stats.active})
                </button>
                <button
                  onClick={() => setViewMode('archived')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    viewMode === 'archived' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Archived ({stats.archived})
                </button>
              </div>
              
              <NotesFilters
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
            </div>
          </div>
        </div>

        <NotesList
          notes={filteredNotes}
          onEditNote={setEditingNote}
          onDeleteNote={handleDeleteNote}
          onPinNote={handlePinNote}
          onArchiveNote={handleArchiveNote}
        />

        {showCreateForm && (
          <CreateNoteForm
            onSubmit={handleCreateNote}
            onCancel={() => setShowCreateForm(false)}
          />
        )}

        {editingNote && (
          <EditNoteModal
            note={editingNote}
            onSubmit={(noteData) => handleUpdateNote(editingNote.id || editingNote._id, noteData)}
            onCancel={() => setEditingNote(null)}
          />
        )}
      </div>
    </div>
  );
};

export default NotesPage;