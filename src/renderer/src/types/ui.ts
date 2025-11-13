// ==================== 基础 UI 状态类型 ====================

// ==================== 编辑器状态 ====================

export interface EditorState {
  activeNoteId?: string;
  isEditing: boolean;
  hasUnsavedChanges: boolean;
}

// ==================== 应用主题 ====================

export type Theme = "light" | "dark";
