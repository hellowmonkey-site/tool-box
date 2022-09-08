import { app, BrowserWindow, ipcMain } from "electron";
import { join } from "path";
import { compressImage } from "./image";
import { openDirectory, saveDialog, selectDirectory } from "./directory";

const width = 1200;
const height = 800;
const title = "沃德工具箱";
const icon = join(__dirname, "../resource/image/logo.png");
const isDev = process.env.NODE_ENV === "development";
const url = isDev ? "http://127.0.0.1:3030" : "https://tool.hellowmonkey.cc";

function createWindow() {
  const win = new BrowserWindow({
    width,
    height,
    minWidth: width,
    minHeight: height,
    title,
    autoHideMenuBar: true,
    backgroundColor: "#ffffff",
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
    },
    show: false,
  });

  const loading = new BrowserWindow({
    autoHideMenuBar: true,
    title,
    width,
    height,
    hasShadow: false,
    show: false,
    parent: win,
  });

  loading.loadFile(join(__dirname, "../resource/html/loading.html"));
  loading.setIcon(icon);
  loading.once("ready-to-show", () => {
    if (!loading.isDestroyed()) {
      loading.show();
    }
  });

  win.setIcon(icon);
  win.removeMenu();

  win.loadURL(url).then(() => {
    win.maximize();
    if (isDev) {
      win.webContents.openDevTools();
    }
  });
  win.once("ready-to-show", () => {
    win.show();
    loading.hide();
    loading.close();
    win.focus();
  });

  // 设置title
  ipcMain.on("set-title", (event, title) => {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);
    win?.setTitle(title);
  });

  // 图片压缩
  ipcMain.handle("compress-image", async (e, filePath: string, targetPath?: string) => {
    return compressImage(filePath, targetPath);
  });

  // 选择保存位置弹框
  ipcMain.handle("save-dialog", (e, title: string) => {
    return saveDialog(title);
  });

  // 选择文件夹
  ipcMain.handle("select-directory", (e, path: string) => {
    return selectDirectory(path);
  });

  // 打开文件夹
  ipcMain.handle("open-directory", (e, title: string) => {
    return openDirectory(title);
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
