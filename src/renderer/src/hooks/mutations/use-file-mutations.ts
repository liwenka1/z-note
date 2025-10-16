// ==================== 文件变更 Hooks ====================

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { filesApi } from "@renderer/api/files";
import { fileQueryKeys } from "@renderer/hooks/queries/use-files";
import { ErrorHandler } from "@renderer/lib/error-handler";
import type { NoteFileContent } from "@renderer/types/file-content";
import type { JSONContent } from "@tiptap/react";

/**
 * 创建笔记文件
 */
export function useCreateNoteFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ filePath, title }: { filePath: string; title?: string }) => {
      return await filesApi.createNoteFile(filePath, title);
    },
    onSuccess: (newFile, { filePath }) => {
      // 更新缓存
      queryClient.setQueryData(fileQueryKeys.file(filePath), newFile);

      ErrorHandler.success("笔记创建成功");
    },
    onError: (error) => {
      ErrorHandler.handle(error, "创建笔记");
    }
  });
}

/**
 * 更新笔记文件
 */
export function useUpdateNoteFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ filePath, content, title }: { filePath: string; content: JSONContent; title?: string }) => {
      return await filesApi.updateNoteFile(filePath, content, title);
    },
    onMutate: async ({ filePath, content, title }) => {
      // 取消正在进行的查询
      await queryClient.cancelQueries({ queryKey: fileQueryKeys.file(filePath) });

      // 保存之前的数据以便回滚
      const previousData = queryClient.getQueryData<NoteFileContent>(fileQueryKeys.file(filePath));

      // 乐观更新
      if (previousData) {
        queryClient.setQueryData(fileQueryKeys.file(filePath), {
          ...previousData,
          content,
          metadata: {
            ...previousData.metadata,
            title: title || previousData.metadata.title,
            updatedAt: new Date().toISOString()
          }
        });
      }

      return { previousData };
    },
    onError: (error, { filePath }, context) => {
      // 回滚乐观更新
      if (context?.previousData) {
        queryClient.setQueryData(fileQueryKeys.file(filePath), context.previousData);
      }
      ErrorHandler.handle(error, "更新笔记");
    },
    onSuccess: (updatedFile, { filePath }) => {
      // 确保缓存是最新的
      queryClient.setQueryData(fileQueryKeys.file(filePath), updatedFile);
    }
  });
}

/**
 * 删除笔记文件
 */
export function useDeleteNoteFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (filePath: string) => {
      return await filesApi.deleteNoteFile(filePath);
    },
    onSuccess: (_, filePath) => {
      // 移除缓存
      queryClient.removeQueries({ queryKey: fileQueryKeys.file(filePath) });
      queryClient.removeQueries({ queryKey: fileQueryKeys.metadata(filePath) });

      ErrorHandler.success("笔记删除成功");
    },
    onError: (error) => {
      ErrorHandler.handle(error, "删除笔记");
    }
  });
}

/**
 * 写入笔记文件（原始写入，不更新元数据）
 */
export function useWriteNoteFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ filePath, content }: { filePath: string; content: NoteFileContent }) => {
      await filesApi.writeNoteFile(filePath, content);
      return content;
    },
    onSuccess: (content, { filePath }) => {
      // 更新缓存
      queryClient.setQueryData(fileQueryKeys.file(filePath), content);
    },
    onError: (error) => {
      ErrorHandler.handle(error, "写入笔记");
    }
  });
}
