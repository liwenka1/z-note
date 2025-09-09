import { app, shell, BrowserWindow, ipcMain } from "electron";
import { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "../../resources/icon.png?asset";

// 导入数据库和IPC处理器
import { getDatabase } from "./database/db";
import { seedDatabase } from "./database/seed";
import { IpcRegistry } from "./ipc/ipc-registry";

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1242,
    height: 832,
    minWidth: 800,
    minHeight: 600,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

// 初始化数据库和IPC处理器
async function initializeBackend() {
  try {
    console.log("🚀 初始化后端服务...");

    // 初始化数据库连接
    const db = getDatabase();
    console.log("✅ 数据库连接成功");

    // 检查是否需要插入初始数据
    const { notes } = await import("./database/schema");

    const existingData = await db.select().from(notes).limit(1);
    if (existingData.length === 0) {
      console.log("📥 插入初始数据...");
      await seedDatabase();
    }

    // 注册IPC处理器
    IpcRegistry.registerAll();

    console.log("🎉 后端服务初始化完成");
  } catch (error) {
    console.error("❌ 后端服务初始化失败:", error);
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId("com.electron");

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // 初始化后端服务
  await initializeBackend();

  // IPC test
  ipcMain.on("ping", () => console.log("pong"));

  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
