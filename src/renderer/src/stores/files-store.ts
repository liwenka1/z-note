import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { fileSystemApi, workspaceApi, configApi, CONFIG_KEYS, FILE_EXTENSIONS } from "@renderer/api";
import type {
  FileNode,
  WorkspaceConfig,
  ScanOptions,
  SortType,
  SortDirection,
  FileTreeState,
  WorkspaceState,
  FileEditState,
  SearchResultItem
} from "@renderer/types";

// ==================== Files 状态管理 ====================

interface FilesState {
  // 文件树状态
  fileTree: FileTreeState;

  // 工作区状态
  workspace: WorkspaceState;

  // 当前编辑文件状态
  currentFile: FileEditState;

  // UI 状态
  ui: {
    // 侧边栏展开状态
    sidebarCollapsed: boolean;
    // 搜索状态
    searchQuery: string;
    searchResults: SearchResultItem[];
    isSearching: boolean;
    // 选择状态
    selectedPaths: Set<string>;
    isMultiSelectMode: boolean;
    // 拖拽状态
    isDragging: boolean;
    draggedNode?: FileNode;
    // 右键菜单状态
    contextMenuVisible: boolean;
    contextMenuPosition?: { x: number; y: number };
    contextMenuNode?: FileNode;
  };
}

interface FilesActions {
  // ==================== 文件树操作 ====================
  /** 加载工作区文件树 */
  loadFileTree: () => Promise<void>;
  /** 刷新文件树 */
  refreshFileTree: () => Promise<void>;
  /** 内部方法：静默刷新文件树（避免闪烁） */
  _refreshFileTreeSilent: () => Promise<void>;
  /** 展开/折叠文件夹 */
  toggleFolder: (folderPath: string) => void;
  /** 展开文件夹 */
  expandFolder: (folderPath: string) => void;
  /** 折叠文件夹 */
  collapseFolder: (folderPath: string) => void;
  /** 设置排序方式 */
  setSortOptions: (type: SortType, direction: SortDirection) => void;

  // ==================== 文件操作 ====================
  /** 选择文件 */
  selectFile: (filePath: string) => Promise<void>;
  /** 创建新文件 */
  createFile: (parentPath: string, fileName?: string) => Promise<void>;
  /** 创建新文件夹 */
  createFolder: (parentPath: string, folderName?: string) => Promise<void>;
  /** 创建新文件 */
  createNewFile: (fileName: string, content?: string) => Promise<string>;
  /** 创建新文件夹 */
  createNewFolder: (folderName: string) => Promise<string>;
  /** 重命名文件/文件夹 */
  renameFile: (oldPath: string, newName: string) => Promise<string>;
  /** 删除文件/文件夹 */
  deleteFile: (filePath: string) => Promise<void>;
  /** 移动文件/文件夹 */
  moveFile: (sourcePath: string, targetPath: string) => Promise<void>;
  /** 复制文件 */
  copyFile: (sourcePath: string, targetPath: string) => Promise<void>;

  // ==================== 文件内容操作 ====================
  /** 读取文件内容 */
  readFileContent: (filePath: string) => Promise<string>;
  /** 保存文件内容 */
  saveFileContent: (filePath: string, content: string) => Promise<void>;
  /** 更新当前编辑内容 */
  updateCurrentContent: (content: string) => void;
  /** 标记文件有未保存更改 */
  markFileAsModified: (modified: boolean) => void;

  // ==================== 工作区操作 ====================
  /** 初始化工作区 */
  initializeWorkspace: () => Promise<void>;
  /** 切换工作区 */
  switchWorkspace: (workspacePath: string) => Promise<void>;
  /** 选择新工作区 */
  selectWorkspace: () => Promise<void>;
  /** 保存工作区配置 */
  saveWorkspaceConfig: () => Promise<void>;

  // ==================== 搜索操作 ====================
  /** 搜索文件 */
  searchFiles: (query: string, options?: { searchInContent?: boolean }) => Promise<void>;
  /** 清除搜索 */
  clearSearch: () => void;

  // ==================== UI 操作 ====================
  /** 切换侧边栏 */
  toggleSidebar: () => void;
  /** 设置选择模式 */
  setMultiSelectMode: (enabled: boolean) => void;
  /** 切换文件选择 */
  toggleFileSelection: (filePath: string) => void;
  /** 清除选择 */
  clearSelection: () => void;
  /** 设置拖拽状态 */
  setDragState: (isDragging: boolean, draggedNode?: FileNode) => void;
  /** 显示右键菜单 */
  showContextMenu: (position: { x: number; y: number }, node: FileNode) => void;
  /** 隐藏右键菜单 */
  hideContextMenu: () => void;

  // ==================== 配置操作 ====================
  /** 加载用户配置 */
  loadUserConfig: () => Promise<void>;
  /** 保存用户配置 */
  saveUserConfig: () => Promise<void>;
}

type FilesStore = FilesState & FilesActions;

// 默认状态
const defaultFileTreeState: FileTreeState = {
  nodes: [],
  expandedPaths: new Set(),
  loading: false,
  sortOptions: {
    type: "name",
    direction: "asc",
    foldersFirst: true
  }
};

const defaultWorkspaceState: WorkspaceState = {
  config: {
    workspacePath: "",
    recentFiles: [],
    excludePatterns: ["node_modules", ".git", ".DS_Store"],
    includeExtensions: [".md", ".markdown", ".txt"],
    watchEnabled: true,
    maxFileSize: 10 * 1024 * 1024 // 10MB
  },
  initialized: false,
  loading: false
};

const defaultFileEditState: FileEditState = {
  content: "",
  hasUnsavedChanges: false,
  saving: false
};

// 创建 Store
export const useFilesStore = create<FilesStore>()(
  immer((set, get) => ({
    // ==================== Initial State ====================
    fileTree: defaultFileTreeState,
    workspace: defaultWorkspaceState,
    currentFile: defaultFileEditState,
    ui: {
      sidebarCollapsed: false,
      searchQuery: "",
      searchResults: [],
      isSearching: false,
      selectedPaths: new Set(),
      isMultiSelectMode: false,
      isDragging: false,
      contextMenuVisible: false
    },

    // ==================== 文件树操作 ====================
    loadFileTree: async () => {
      const { workspace } = get();

      if (!workspace.config.workspacePath) {
        console.warn("工作区路径未设置");
        return;
      }

      set((state) => {
        state.fileTree.loading = true;
        state.fileTree.error = undefined;
      });

      try {
        const scanOptions: ScanOptions = {
          recursive: true,
          includeHidden: false,
          includeExtensions: [...FILE_EXTENSIONS.ALL_SUPPORTED],
          maxDepth: 10
        };

        const nodes = await fileSystemApi.scanDirectory(workspace.config.workspacePath, scanOptions);

        set((state) => {
          state.fileTree.nodes = nodes;
          state.fileTree.loading = false;
        });

        // 恢复展开状态
        const savedExpandedPaths = (await configApi.get<string[]>("workspace.expandedPaths")) || [];
        const expandedPaths = new Set(savedExpandedPaths);
        set((state) => {
          state.fileTree.expandedPaths = expandedPaths;
        });
      } catch (error) {
        console.error("加载文件树失败:", error);
        set((state) => {
          state.fileTree.loading = false;
          state.fileTree.error = error instanceof Error ? error.message : "加载失败";
        });
      }
    },

    // 内部方法：刷新文件树但不显示loading状态（避免闪烁）
    _refreshFileTreeSilent: async () => {
      const { workspace } = get();

      if (!workspace.config.workspacePath) {
        console.warn("工作区路径未设置");
        return;
      }

      try {
        const scanOptions: ScanOptions = {
          recursive: true,
          includeHidden: false,
          includeExtensions: [...FILE_EXTENSIONS.ALL_SUPPORTED],
          maxDepth: 10
        };

        const nodes = await fileSystemApi.scanDirectory(workspace.config.workspacePath, scanOptions);

        set((state) => {
          state.fileTree.nodes = nodes;
          // 不改变loading状态
        });

        // 恢复展开状态
        const savedExpandedPaths = (await configApi.get<string[]>("workspace.expandedPaths")) || [];
        const expandedPaths = new Set(savedExpandedPaths);
        set((state) => {
          state.fileTree.expandedPaths = expandedPaths;
        });
      } catch (error) {
        console.error("刷新文件树失败:", error);
        set((state) => {
          state.fileTree.error = error instanceof Error ? error.message : "刷新失败";
        });
      }
    },

    refreshFileTree: async () => {
      await get().loadFileTree();
    },

    toggleFolder: (folderPath: string) => {
      set((state) => {
        if (state.fileTree.expandedPaths.has(folderPath)) {
          state.fileTree.expandedPaths.delete(folderPath);
        } else {
          state.fileTree.expandedPaths.add(folderPath);
        }
      });
    },

    expandFolder: (folderPath: string) => {
      set((state) => {
        state.fileTree.expandedPaths.add(folderPath);
      });
    },

    collapseFolder: (folderPath: string) => {
      set((state) => {
        state.fileTree.expandedPaths.delete(folderPath);
      });
    },

    setSortOptions: (type: SortType, direction: SortDirection) => {
      set((state) => {
        state.fileTree.sortOptions.type = type;
        state.fileTree.sortOptions.direction = direction;
      });
    },

    // ==================== 文件操作 ====================
    selectFile: async (filePath: string) => {
      try {
        const content = await fileSystemApi.readFile(filePath);

        set((state) => {
          state.fileTree.selectedPath = filePath;
          state.currentFile = {
            filePath,
            content,
            hasUnsavedChanges: false,
            saving: false
          };
        });

        // 保存最后打开的文件
        await configApi.set(CONFIG_KEYS.LAST_OPENED_FILE, filePath);
      } catch (error) {
        console.error("选择文件失败:", error);
        set((state) => {
          state.fileTree.error = error instanceof Error ? error.message : "文件读取失败";
        });
      }
    },

    createFile: async (parentPath: string, fileName?: string) => {
      try {
        const name = fileName || "new-file.md";
        const uniqueName = await fileSystemApi.createUniqueFileName(
          parentPath,
          name.replace(/\.[^/.]+$/, ""),
          name.includes(".") ? `.${name.split(".").pop()}` : ".md"
        );
        const filePath = `${parentPath}/${uniqueName}`;

        await fileSystemApi.writeFile(filePath, "");

        // 使用静默刷新避免闪烁
        await get()._refreshFileTreeSilent();
        await get().selectFile(filePath);
      } catch (error) {
        console.error("创建文件失败:", error);
        set((state) => {
          state.fileTree.error = error instanceof Error ? error.message : "创建文件失败";
        });
      }
    },

    createFolder: async (parentPath: string, folderName?: string) => {
      try {
        const name = folderName || "new-folder";
        const uniqueName = await fileSystemApi.createUniqueFileName(parentPath, name, "");
        const folderPath = `${parentPath}/${uniqueName}`;

        await fileSystemApi.createDirectory(folderPath);

        // 使用静默刷新避免闪烁
        await get()._refreshFileTreeSilent();
        get().expandFolder(folderPath);
      } catch (error) {
        console.error("创建文件夹失败:", error);
        set((state) => {
          state.fileTree.error = error instanceof Error ? error.message : "创建文件夹失败";
        });
      }
    },

    renameFile: async (oldPath: string, newName: string) => {
      try {
        const parentPath = oldPath.substring(0, oldPath.lastIndexOf("/"));
        const newPath = `${parentPath}/${newName}`;

        await fileSystemApi.renameFile(oldPath, newPath);
        await get().refreshFileTree();

        // 如果重命名的是当前打开的文件，更新路径
        const { currentFile } = get();
        if (currentFile.filePath === oldPath) {
          set((state) => {
            state.currentFile.filePath = newPath;
          });
        }

        return newPath;
      } catch (error) {
        console.error("重命名失败:", error);
        set((state) => {
          state.fileTree.error = error instanceof Error ? error.message : "重命名失败";
        });
        throw error;
      }
    },

    deleteFile: async (filePath: string) => {
      try {
        await fileSystemApi.deleteFile(filePath);
        await get().refreshFileTree();

        // 如果删除的是当前打开的文件，清除状态
        const { currentFile } = get();
        if (currentFile.filePath === filePath) {
          set((state) => {
            state.currentFile = defaultFileEditState;
            state.fileTree.selectedPath = undefined;
          });
        }
      } catch (error) {
        console.error("删除失败:", error);
        set((state) => {
          state.fileTree.error = error instanceof Error ? error.message : "删除失败";
        });
      }
    },

    moveFile: async (sourcePath: string, targetPath: string) => {
      try {
        await fileSystemApi.renameFile(sourcePath, targetPath);
        await get().refreshFileTree();
      } catch (error) {
        console.error("移动失败:", error);
        set((state) => {
          state.fileTree.error = error instanceof Error ? error.message : "移动失败";
        });
      }
    },

    copyFile: async (sourcePath: string, targetPath: string) => {
      try {
        await fileSystemApi.copyFile(sourcePath, targetPath);
        await get().refreshFileTree();
      } catch (error) {
        console.error("复制失败:", error);
        set((state) => {
          state.fileTree.error = error instanceof Error ? error.message : "复制失败";
        });
      }
    },

    // ==================== 文件内容操作 ====================
    readFileContent: async (filePath: string) => {
      try {
        return await fileSystemApi.readFile(filePath);
      } catch (error) {
        console.error("读取文件内容失败:", error);
        throw error;
      }
    },

    saveFileContent: async (filePath: string, content: string) => {
      set((state) => {
        state.currentFile.saving = true;
      });

      try {
        await fileSystemApi.writeFile(filePath, content);

        set((state) => {
          state.currentFile.hasUnsavedChanges = false;
          state.currentFile.saving = false;
          state.currentFile.lastSaved = new Date();
        });
      } catch (error) {
        console.error("保存文件失败:", error);
        set((state) => {
          state.currentFile.saving = false;
          state.fileTree.error = error instanceof Error ? error.message : "保存失败";
        });
        throw error;
      }
    },

    updateCurrentContent: (content: string) => {
      set((state) => {
        state.currentFile.content = content;
        state.currentFile.hasUnsavedChanges = true;
      });
    },

    markFileAsModified: (modified: boolean) => {
      set((state) => {
        state.currentFile.hasUnsavedChanges = modified;
      });
    },

    // ==================== 工作区操作 ====================
    initializeWorkspace: async () => {
      set((state) => {
        state.workspace.loading = true;
      });

      try {
        // 获取工作区配置
        let config = await workspaceApi.getConfig();

        // 验证工作区路径
        const validation = await workspaceApi.validateWorkspace(config.workspacePath);
        if (!validation.valid) {
          // 使用默认工作区
          const defaultPath = await workspaceApi.getDefaultPath();
          config = {
            workspacePath: defaultPath,
            recentFiles: [],
            excludePatterns: ["node_modules", ".git", ".DS_Store"],
            includeExtensions: [".md", ".markdown", ".txt"],
            watchEnabled: true,
            maxFileSize: 10 * 1024 * 1024
          };
          await workspaceApi.setConfig(config);
        }

        set((state) => {
          state.workspace.config = config;
          state.workspace.initialized = true;
          state.workspace.loading = false;
        });

        // 加载文件树
        await get().loadFileTree();

        // 恢复最后打开的文件
        const lastOpenedFile = await configApi.get<string>(CONFIG_KEYS.LAST_OPENED_FILE);
        if (lastOpenedFile && (await fileSystemApi.exists(lastOpenedFile))) {
          await get().selectFile(lastOpenedFile);
        }
      } catch (error) {
        console.error("初始化工作区失败:", error);
        set((state) => {
          state.workspace.loading = false;
          state.workspace.error = error instanceof Error ? error.message : "初始化失败";
        });
      }
    },

    switchWorkspace: async (workspacePath: string) => {
      const validation = await workspaceApi.validateWorkspace(workspacePath);
      if (!validation.valid) {
        throw new Error(validation.error || "工作区路径无效");
      }

      const config: WorkspaceConfig = {
        workspacePath,
        recentFiles: [],
        excludePatterns: ["node_modules", ".git", ".DS_Store"],
        includeExtensions: [".md", ".markdown", ".txt"],
        watchEnabled: true,
        maxFileSize: 10 * 1024 * 1024
      };

      await workspaceApi.setConfig(config);

      set((state) => {
        state.workspace.config = config;
        state.currentFile = defaultFileEditState;
        state.fileTree.selectedPath = undefined;
      });

      await get().loadFileTree();
    },

    selectWorkspace: async () => {
      const selectedPath = await workspaceApi.selectDirectory();
      if (selectedPath) {
        await get().switchWorkspace(selectedPath);
      }
    },

    saveWorkspaceConfig: async () => {
      const { workspace, fileTree } = get();

      // 保存展开状态到应用配置
      await configApi.set("workspace.expandedPaths", Array.from(fileTree.expandedPaths));

      await workspaceApi.setConfig(workspace.config);
    },

    // ==================== 搜索操作 ====================
    searchFiles: async (query: string, options = {}) => {
      if (!query.trim()) {
        get().clearSearch();
        return;
      }

      set((state) => {
        state.ui.searchQuery = query;
        state.ui.isSearching = true;
      });

      try {
        const { workspace } = get();
        const results = await fileSystemApi.searchFiles(workspace.config.workspacePath, query, {
          searchInContent: options.searchInContent || false,
          fileExtensions: [...FILE_EXTENSIONS.ALL_SUPPORTED],
          caseSensitive: false,
          maxResults: 50
        });

        set((state) => {
          state.ui.searchResults = results.map((node) => ({ ...node }));
          state.ui.isSearching = false;
        });
      } catch (error) {
        console.error("搜索失败:", error);
        set((state) => {
          state.ui.isSearching = false;
          state.fileTree.error = error instanceof Error ? error.message : "搜索失败";
        });
      }
    },

    clearSearch: () => {
      set((state) => {
        state.ui.searchQuery = "";
        state.ui.searchResults = [];
        state.ui.isSearching = false;
      });
    },

    // ==================== UI 操作 ====================
    toggleSidebar: () => {
      set((state) => {
        state.ui.sidebarCollapsed = !state.ui.sidebarCollapsed;
      });
    },

    setMultiSelectMode: (enabled: boolean) => {
      set((state) => {
        state.ui.isMultiSelectMode = enabled;
        if (!enabled) {
          state.ui.selectedPaths.clear();
        }
      });
    },

    toggleFileSelection: (filePath: string) => {
      set((state) => {
        if (state.ui.selectedPaths.has(filePath)) {
          state.ui.selectedPaths.delete(filePath);
        } else {
          state.ui.selectedPaths.add(filePath);
        }
      });
    },

    clearSelection: () => {
      set((state) => {
        state.ui.selectedPaths.clear();
      });
    },

    setDragState: (isDragging: boolean, draggedNode?: FileNode) => {
      set((state) => {
        state.ui.isDragging = isDragging;
        state.ui.draggedNode = draggedNode;
      });
    },

    showContextMenu: (position: { x: number; y: number }, node: FileNode) => {
      set((state) => {
        state.ui.contextMenuVisible = true;
        state.ui.contextMenuPosition = position;
        state.ui.contextMenuNode = node;
      });
    },

    hideContextMenu: () => {
      set((state) => {
        state.ui.contextMenuVisible = false;
        state.ui.contextMenuPosition = undefined;
        state.ui.contextMenuNode = undefined;
      });
    },

    // ==================== 配置操作 ====================
    loadUserConfig: async () => {
      try {
        const sortType = (await configApi.get<SortType>(CONFIG_KEYS.SORT_TYPE)) || "name";
        const sortDirection = (await configApi.get<SortDirection>(CONFIG_KEYS.SORT_DIRECTION)) || "asc";
        const sidebarCollapsed = (await configApi.get<boolean>(CONFIG_KEYS.FILE_TREE_WIDTH)) || false;

        set((state) => {
          state.fileTree.sortOptions.type = sortType;
          state.fileTree.sortOptions.direction = sortDirection;
          state.ui.sidebarCollapsed = sidebarCollapsed;
        });
      } catch (error) {
        console.error("加载用户配置失败:", error);
      }
    },

    saveUserConfig: async () => {
      try {
        const { fileTree, ui } = get();

        await Promise.all([
          configApi.set(CONFIG_KEYS.SORT_TYPE, fileTree.sortOptions.type),
          configApi.set(CONFIG_KEYS.SORT_DIRECTION, fileTree.sortOptions.direction),
          configApi.set(CONFIG_KEYS.FILE_TREE_WIDTH, ui.sidebarCollapsed)
        ]);
      } catch (error) {
        console.error("保存用户配置失败:", error);
      }
    },

    // ==================== 文件操作 ====================
    createNewFile: async (fileName: string, content = "") => {
      const { workspace } = get();

      if (!workspace.config.workspacePath) {
        throw new Error("工作区路径未设置");
      }

      try {
        // 生成唯一文件名
        const uniqueFileName = await fileSystemApi.createUniqueFileName(
          workspace.config.workspacePath,
          fileName.replace(/\.[^/.]+$/, ""), // 去掉扩展名
          fileName.match(/\.[^/.]+$/)?.[0] // 提取扩展名
        );

        const filePath = `${workspace.config.workspacePath}/${uniqueFileName}`;
        await fileSystemApi.writeFile(filePath, content);

        // 刷新文件树
        await get().loadFileTree();

        return filePath;
      } catch (error) {
        console.error("创建文件失败:", error);
        throw error;
      }
    },

    createNewFolder: async (folderName: string) => {
      const { workspace } = get();

      if (!workspace.config.workspacePath) {
        throw new Error("工作区路径未设置");
      }

      try {
        // 生成唯一文件夹名
        const uniqueFolderName = await fileSystemApi.createUniqueFileName(workspace.config.workspacePath, folderName);

        const folderPath = `${workspace.config.workspacePath}/${uniqueFolderName}`;
        await fileSystemApi.createDirectory(folderPath);

        // 刷新文件树
        await get().loadFileTree();

        return folderPath;
      } catch (error) {
        console.error("创建文件夹失败:", error);
        throw error;
      }
    }
  }))
);

// 导出类型供组件使用
export type { FilesStore };
