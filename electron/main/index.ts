import { app, BrowserWindow, globalShortcut, ipcMain, Menu, SaveDialogOptions, Tray } from "electron";
import { join } from "path";
import { compressImage, pngToIco } from "./image";
import { openDirectory, saveDialog, saveBase64File, selectDirectory } from "./file";
import { getFilePath, notification } from "./helper";

const width = 1200;
const height = 800;
const title = "沃德工具箱";
const icon = join(__dirname, "../resource/image/logo.png");
const isDev = process.env.NODE_ENV === "development";
const url = isDev ? "http://127.0.0.1:3030" : "https://tool.hellowmonkey.cc";

let tray: Tray, win: BrowserWindow;

function toggleWin() {
  if (win?.isVisible()) {
    hideWin();
  } else {
    showWin();
  }
}

function showWin() {
  win?.show();
  win?.setSkipTaskbar(false);
}

function hideWin() {
  win?.hide();
  win?.setSkipTaskbar(true);
}

function destroyApp() {
  app.quit();
  tray.destroy();
}

function createWindow() {
  win = new BrowserWindow({
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
  win.on("close", e => {
    e.preventDefault();
    hideWin();
  });

  // 新建托盘
  tray = new Tray(icon);
  // 托盘名称
  tray.setToolTip(title);
  // 托盘菜单
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "显示",
      click: () => {
        showWin();
      },
    },
    {
      type: "separator",
    },
    {
      label: "退出",
      click: () => {
        destroyApp();
      },
    },
  ]);
  // 载入托盘菜单
  tray.setContextMenu(contextMenu);

  tray.on("click", () => {
    toggleWin();
  });
}

app
  .whenReady()
  .then(() => {
    createWindow();

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  })
  .then(() => {
    globalShortcut.register("Alt+CommandOrControl+A", () => {
      toggleWin();
    });
  });

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    destroyApp();
  }
});

// 设置title
ipcMain.on("set-title", (event, title) => {
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  win?.setTitle(title);
});

// 设置进度条
ipcMain.on("set-progress-bar", (e, progress: number) => {
  win?.setProgressBar(progress);
});

// 图片压缩
ipcMain.handle("compress-image", async (e, filePath: string, targetPath?: string, width?: number) => {
  return compressImage(filePath, targetPath, width);
});

// 选择保存位置弹框
ipcMain.handle("save-dialog", (e, opts: SaveDialogOptions) => {
  return saveDialog(opts);
});

// 保存base64文件
ipcMain.handle("save-base64-file", (e, base64Str: string) => {
  return saveBase64File(base64Str).then(fullPath => {
    return compressImage(fullPath).then(data => {
      const { fileName, filePath } = getFilePath(fullPath);
      return {
        ...data,
        fullPath,
        fileName,
        filePath,
      };
    });
  });
});

// 选择文件夹
ipcMain.handle("select-directory", (e, path: string) => {
  return selectDirectory(path);
});

// 打开文件夹
ipcMain.handle("open-directory", (e, title: string) => {
  return openDirectory(title);
});

// png转ico
ipcMain.handle("png-to-ico", (e, filePath: string, size: number) => {
  return pngToIco(filePath, size);
});

// 通知
ipcMain.handle("notification", (e, title: string, content: string) => {
  return notification(title, content);
});
