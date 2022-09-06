import { app, BrowserWindow, ipcMain } from "electron";
import { join } from "path";
import { compressImage } from "./image";

const width = 1200;
const height = 800;
const title = "沃德工具箱";
const icon = join(__dirname, "../resource/image/logo.png");

function createWindow() {
  const win = new BrowserWindow({
    width,
    height,
    minWidth: width,
    minHeight: height,
    title,
    transparent: true,
    frame: false,
    autoHideMenuBar: true,
    backgroundColor: "#ffffff",
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
    },
    show: false,
  });

  win.loadURL("http://127.0.0.1:3030").then(() => {
    win.maximize();
  });

  const loading = new BrowserWindow({
    autoHideMenuBar: true,
    title,
    width,
    height,
    show: false,
  });

  loading.loadFile(join(__dirname, "../resource/html/loading.html"));
  loading.setIcon(icon);

  loading.once("ready-to-show", () => {
    loading.show();
  });

  win.once("ready-to-show", () => {
    win.show();
    loading.hide();
    loading.close();
    if (import.meta.env.DEV) {
      win.webContents.openDevTools();
    }
  });

  win.setIcon(icon);
  win.removeMenu();

  // 设置title
  ipcMain.on("set-title", (event, title) => {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);
    win?.setTitle(title);
  });

  // 图片压缩
  ipcMain.handle("compress-image", compressImage);
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
