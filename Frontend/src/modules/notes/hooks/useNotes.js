import { useState, useEffect } from 'react';
import { 
  getNotes, 
  createNote as createNoteAPI, 
  updateNote as updateNoteAPI, 
  deleteNote as deleteNoteAPI,
  togglePin as togglePinAPI,
  toggleArchive as toggleArchiveAPI
} from '../services/notes.api';

const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getNotes();
      const notesData = response.notes || response.data || response;
      setNotes(Array.isArray(notesData) ? notesData : []);
    } catch (err) {
      console.error('Failed to fetch notes:', err);
      setError(err.message || 'Failed to load notes');
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  const createNote = async (noteData) => {
    try {
      const response = await createNoteAPI(noteData);
      const newNote = response.note || response.data || response;
      setNotes(prevNotes => [newNote, ...prevNotes]);
      return newNote;
    } catch (err) {
      console.error('Failed to create note:', err);
      throw err;
    }
  };

  const updateNote = async (noteId, noteData) => {
    try {
      const response = await updateNoteAPI(noteId, noteData);
      const updatedNote = response.note || response.data || response;
      setNotes(prevNotes => 
        prevNotes.map(note => 
          (note.id === noteId || note._id === noteId) ? updatedNote : note
        )
      );
      return updatedNote;
    } catch (err) {
      console.error('Failed to update note:', err);
      throw err;
    }
  };

  const deleteNote = async (noteId) => {
    try {
      await deleteNoteAPI(noteId);
      setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId && note._id !== noteId));
    } catch (err) {
      console.error('Failed to delete note:', err);
      throw err;
    }
  };

  const pinNote = async (noteId) => {
    try {
      const response = await togglePinAPI(noteId);
      const updatedNote = response.note || response.data || response;
      setNotes(prevNotes => 
        prevNotes.map(note => 
          (note.id === noteId || note._id === noteId) ? updatedNote : note
        )
      );
      return updatedNote;
    } catch (err) {
      console.error('Failed to pin/unpin note:', err);
      throw err;
    }
  };

  const archiveNote = async (noteId) => {
    try {
      const response = await toggleArchiveAPI(noteId);
      const updatedNote = response.note || response.data || response;
      setNotes(prevNotes => 
        prevNotes.map(note => 
          (note.id === noteId || note._id === noteId) ? updatedNote : note
        )
      );
      return updatedNote;
    } catch (err) {
      console.error('Failed to archive/unarchive note:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const refetch = () => {
    fetchNotes();
  };

  return {
    notes,
    loading,
    error,
    createNote,
    updateNote,
    deleteNote,
    pinNote,
    archiveNote,
    refetch
  };
};

export default useNotes;