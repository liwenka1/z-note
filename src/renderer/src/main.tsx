import "./assets/main.css";

import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "next-themes";
import { enableMapSet } from "immer";

import { Toaster } from "@renderer/components/ui/sonner";

// 启用 Immer 的 MapSet 插件
enableMapSet();

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { queryClient } from "./lib/query-client";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="z-note-theme">
          <RouterProvider router={router} />
          <ReactQueryDevtools initialIsOpen={false} />
          <Toaster />
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>
  );
}
