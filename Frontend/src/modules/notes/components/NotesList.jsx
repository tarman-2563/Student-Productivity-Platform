import NoteCard from './NoteCard';

const NotesList = ({ notes, onEditNote, onDeleteNote, onPinNote, onArchiveNote }) => {
  if (notes.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-8xl mb-6 opacity-30">📝</div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-3">No notes found</h3>
        <p className="text-gray-600 text-lg mb-6">Create your first note to get started organizing your thoughts</p>
        <div className="text-sm text-gray-500">
          <p>🏷️ Use tags and categories to organize your notes</p>
          <p>📌 Pin important notes to keep them at the top</p>
        </div>
      </div>
    );
  }

  const pinnedNotes = notes.filter(note => note.isPinned && !note.isArchived);
  const regularNotes = notes.filter(note => !note.isPinned && !note.isArchived);
  const archivedNotes = notes.filter(note => note.isArchived);

  return (
    <div className="space-y-8">
      {pinnedNotes.length > 0 && (
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-lg font-semibold text-gray-900">📌 Pinned Notes</span>
            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
              {pinnedNotes.length}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pinnedNotes.map((note) => (
              <NoteCard
                key={note.id || note._id}
                note={note}
                onEdit={onEditNote}
                onDelete={onDeleteNote}
                onPin={onPinNote}
                onArchive={onArchiveNote}
              />
            ))}
          </div>
        </div>
      )}

      {regularNotes.length > 0 && (
        <div>
          {pinnedNotes.length > 0 && (
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-lg font-semibold text-gray-900">📄 All Notes</span>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                {regularNotes.length}
              </span>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularNotes.map((note) => (
              <NoteCard
                key={note.id || note._id}
                note={note}
                onEdit={onEditNote}
                onDelete={onDeleteNote}
                onPin={onPinNote}
                onArchive={onArchiveNote}
              />
            ))}
          </div>
        </div>
      )}

      {archivedNotes.length > 0 && (
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-lg font-semibold text-gray-900">📥 Archived Notes</span>
            <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded-full">
              {archivedNotes.length}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {archivedNotes.map((note) => (
              <NoteCard
                key={note.id || note._id}
                note={note}
                onEdit={onEditNote}
                onDelete={onDeleteNote}
                onPin={onPinNote}
                onArchive={onArchiveNote}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesList;