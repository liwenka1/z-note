import { useCallback } from "react";
import { useNotesStore, useFoldersStore, useTagsStore } from "./notes";
import { useSelectionStore, useLoadingStore } from "./ui";
import { useStorageStore } from "./data";

// ==================== 组合后的主要hook ====================
const useAppStore = () => {
  const notesStore = useNotesStore();
  const foldersStore = useFoldersStore();
  const tagsStore = useTagsStore();
  const selectionStore = useSelectionStore();
  const loadingStore = useLoadingStore();
  const storageStore = useStorageStore();

  // ==================== 数据持久化相关 ====================
  const saveToLocalStorage = useCallback(() => {
    const data = {
      notes: notesStore.notes,
      folders: foldersStore.folders,
      tags: tagsStore.tags
    };
    storageStore.saveToLocalStorage(data);
  }, [notesStore.notes, foldersStore.folders, tagsStore.tags, storageStore]);

  const initializeData = useCallback(() => {
    loadingStore.setLoading(true);

    storageStore.initializeData({
      setNotes: notesStore.setNotes,
      setFolders: foldersStore.setFolders,
      setTags: tagsStore.setTags
    });

    loadingStore.setLoading(false);
  }, [storageStore, notesStore, foldersStore, tagsStore, loadingStore]);

  // ==================== 增强的业务方法 ====================
  const createNote = useCallback(
    (input: Parameters<typeof notesStore.createNote>[0]) => {
      const noteId = notesStore.createNote(input);
      selectionStore.setSelectedNote(noteId);
      saveToLocalStorage();
      return noteId;
    },
    [notesStore, selectionStore, saveToLocalStorage]
  );

  const updateNote = useCallback(
    (id: string, updates: Parameters<typeof notesStore.updateNote>[1]) => {
      notesStore.updateNote(id, updates);
      saveToLocalStorage();
    },
    [notesStore, saveToLocalStorage]
  );

  const deleteNote = useCallback(
    (id: string) => {
      notesStore.deleteNote(id);
      if (selectionStore.selectedNoteId === id) {
        selectionStore.setSelectedNote(undefined);
      }
      saveToLocalStorage();
    },
    [notesStore, selectionStore, saveToLocalStorage]
  );

  const createFolder = useCallback(
    (input: Parameters<typeof foldersStore.createFolder>[0]) => {
      const folderId = foldersStore.createFolder(input);
      saveToLocalStorage();
      return folderId;
    },
    [foldersStore, saveToLocalStorage]
  );

  const deleteFolder = useCallback(
    (id: string) => {
      // 删除文件夹下的所有笔记
      const notesToDelete = notesStore.getNotesByFolder(id);
      notesToDelete.forEach((note) => notesStore.deleteNote(note.id));

      foldersStore.deleteFolder(id);

      if (selectionStore.selectedFolderId === id) {
        selectionStore.setSelectedFolder(undefined);
      }

      saveToLocalStorage();
    },
    [foldersStore, notesStore, selectionStore, saveToLocalStorage]
  );

  const addTagToNote = useCallback(
    (noteId: string, tagId: string) => {
      const note = notesStore.getNoteById(noteId);
      if (note && !note.tags.includes(tagId)) {
        notesStore.updateNote(noteId, {
          tags: [...note.tags, tagId]
        });
        tagsStore.updateTagUsage(tagId, true);
        saveToLocalStorage();
      }
    },
    [notesStore, tagsStore, saveToLocalStorage]
  );

  const removeTagFromNote = useCallback(
    (noteId: string, tagId: string) => {
      const note = notesStore.getNoteById(noteId);
      if (note && note.tags.includes(tagId)) {
        notesStore.updateNote(noteId, {
          tags: note.tags.filter((id) => id !== tagId)
        });
        tagsStore.updateTagUsage(tagId, false);
        saveToLocalStorage();
      }
    },
    [notesStore, tagsStore, saveToLocalStorage]
  );

  // ==================== 计算属性 ====================
  const currentFolderNotes = useCallback(() => {
    return notesStore.getNotesByFolder(selectionStore.selectedFolderId);
  }, [notesStore, selectionStore.selectedFolderId]);

  const folderTree = useCallback(() => {
    return foldersStore.getFolderTree();
  }, [foldersStore]);

  // ==================== 返回组合后的store ====================
  return {
    // 原始store
    notes: notesStore,
    folders: foldersStore,
    tags: tagsStore,
    ui: {
      selection: selectionStore,
      loading: loadingStore
    },
    storage: storageStore,

    // 增强的方法
    createNote,
    updateNote,
    deleteNote,
    createFolder,
    deleteFolder,
    addTagToNote,
    removeTagFromNote,

    // 计算属性
    currentFolderNotes,
    folderTree,

    // 数据管理
    initializeData,
    saveToLocalStorage
  };
};

// ==================== 向后兼容的导出 ====================
// 为了保持向后兼容，可以导出一个类似原来结构的hook
export const useNotesStoreCompat = () => {
  const app = useAppStore();

  // 模拟原来的结构，便于迁移
  return {
    // 数据
    notes: app.notes.notes,
    folders: app.folders.folders,
    tags: app.tags.tags,

    // UI状态
    selectedFolderId: app.ui.selection.selectedFolderId,
    selectedNoteId: app.ui.selection.selectedNoteId,
    isLoading: app.ui.loading.isLoading,
    error: app.ui.loading.error,

    // 计算属性
    folderTree: app.folderTree(),
    currentFolderNotes: app.currentFolderNotes(),
    allNotes: app.notes.getAllNotes(),
    deletedNotes: app.notes.getDeletedNotes(),
    favoriteNotes: app.notes.getFavoriteNotes(),

    // 方法
    initializeData: app.initializeData,
    saveToLocalStorage: app.saveToLocalStorage,
    createNote: app.createNote,
    updateNote: app.updateNote,
    deleteNote: app.deleteNote,
    createFolder: app.createFolder,
    deleteFolder: app.deleteFolder,
    setSelectedFolder: app.ui.selection.setSelectedFolder,
    setSelectedNote: app.ui.selection.setSelectedNote
    // ... 其他方法可以按需添加
  };
};
