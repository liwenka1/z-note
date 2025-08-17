import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { Note, CreateNoteInput, UpdateNoteInput } from "@renderer/types";
import { createNoteData, updateNoteData, filterNotesByDeleted, sortNotes } from "@renderer/utils/data-utils";

// ==================== 笔记状态类型 ====================
interface NotesState {
  notes: Note[];
}

interface NotesActions {
  // ==================== 笔记操作 ====================
  createNote: (input: CreateNoteInput) => string;
  updateNote: (id: string, updates: UpdateNoteInput) => void;
  deleteNote: (id: string) => void;
  permanentDeleteNote: (id: string) => void;
  restoreNote: (id: string) => void;
  toggleNoteFavorite: (id: string) => void;
  moveNoteToFolder: (noteId: string, folderId?: string) => void;

  // ==================== 查询方法 ====================
  getNoteById: (id: string) => Note | undefined;
  getAllNotes: () => Note[];
  getDeletedNotes: () => Note[];
  getFavoriteNotes: () => Note[];
  getNotesByFolder: (folderId?: string) => Note[];
  searchNotes: (query: string, folderId?: string) => Note[];

  // ==================== 数据管理 ====================
  setNotes: (notes: Note[]) => void;
  clearNotes: () => void;
}

type NotesStore = NotesState & NotesActions;

// ==================== Store 实现 ====================
export const useNotesStore = create<NotesStore>()(
  immer((set, get) => ({
    // ==================== 初始状态 ====================
    notes: [],

    // ==================== 笔记操作 ====================
    createNote: (input: CreateNoteInput) => {
      const newNote = createNoteData(input);

      set((state) => {
        state.notes.push(newNote);
      });

      return newNote.id;
    },

    updateNote: (id: string, updates: UpdateNoteInput) => {
      set((state) => {
        const noteIndex = state.notes.findIndex((n) => n.id === id);
        if (noteIndex !== -1) {
          const currentNote = state.notes[noteIndex];
          state.notes[noteIndex] = updateNoteData(currentNote, updates);
        }
      });
    },

    deleteNote: (id: string) => {
      set((state) => {
        const noteIndex = state.notes.findIndex((n) => n.id === id);
        if (noteIndex !== -1) {
          state.notes[noteIndex].isDeleted = true;
          state.notes[noteIndex].updatedAt = new Date();
        }
      });
    },

    permanentDeleteNote: (id: string) => {
      set((state) => {
        state.notes = state.notes.filter((n) => n.id !== id);
      });
    },

    restoreNote: (id: string) => {
      set((state) => {
        const noteIndex = state.notes.findIndex((n) => n.id === id);
        if (noteIndex !== -1) {
          state.notes[noteIndex].isDeleted = false;
          state.notes[noteIndex].updatedAt = new Date();
        }
      });
    },

    toggleNoteFavorite: (id: string) => {
      set((state) => {
        const noteIndex = state.notes.findIndex((n) => n.id === id);
        if (noteIndex !== -1) {
          state.notes[noteIndex].isFavorite = !state.notes[noteIndex].isFavorite;
          state.notes[noteIndex].updatedAt = new Date();
        }
      });
    },

    moveNoteToFolder: (noteId: string, folderId?: string) => {
      set((state) => {
        const noteIndex = state.notes.findIndex((n) => n.id === noteId);
        if (noteIndex !== -1) {
          state.notes[noteIndex].folderId = folderId;
          state.notes[noteIndex].updatedAt = new Date();
        }
      });
    },

    // ==================== 查询方法 ====================
    getNoteById: (id: string) => {
      return get().notes.find((note) => note.id === id);
    },

    getAllNotes: () => {
      return filterNotesByDeleted(get().notes, false);
    },

    getDeletedNotes: () => {
      return filterNotesByDeleted(get().notes, true);
    },

    getFavoriteNotes: () => {
      return get()
        .getAllNotes()
        .filter((note) => note.isFavorite);
    },

    getNotesByFolder: (folderId?: string) => {
      const allNotes = get().getAllNotes();
      const folderNotes = folderId
        ? allNotes.filter((note) => note.folderId === folderId)
        : allNotes.filter((note) => !note.folderId);

      return sortNotes(folderNotes, "updatedAt", "desc");
    },

    searchNotes: (query: string, folderId?: string) => {
      const notes = get().getNotesByFolder(folderId);
      if (!query.trim()) return notes;

      const searchQuery = query.toLowerCase();
      return notes.filter(
        (note) =>
          note.title.toLowerCase().includes(searchQuery) ||
          note.content.toLowerCase().includes(searchQuery) ||
          note.excerpt?.toLowerCase().includes(searchQuery)
      );
    },

    // ==================== 数据管理 ====================
    setNotes: (notes: Note[]) => {
      set((state) => {
        state.notes = notes;
      });
    },

    clearNotes: () => {
      set((state) => {
        state.notes = [];
      });
    }
  }))
);
