/**
 * TipTap 自定义扩展类型声明
 */
import "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    image: {
      setImage: (options: { src: string; alt?: string; title?: string; width?: string | number }) => ReturnType;
    };
  }
}
