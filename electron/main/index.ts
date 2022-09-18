import { app, BrowserWindow, globalShortcut, ipcMain, Menu, SaveDialogOptions, Tray } from "electron";
import { join } from "path";
import { writeJSONSync, readJSONSync, existsSync, mkdirSync } from "fs-extra";
import { compressImage, pngToIco } from "./image";
import { openDirectory, saveDialog, saveBase64File, selectDirectory, writeFile } from "./file";
import { notification } from "./helper";
import config from "../config";
import defaultUserConfig from "../data/config.json";

let tray: Tray, win: BrowserWindow;

const userConfigPath = app.getPath("userData");
const userConfigFile = join(userConfigPath, "config.json");
console.log(userConfigPath);
if (!existsSync(userConfigPath)) {
  mkdirSync(userConfigPath);
}
const userConfig: { keyboard: string; openAtLogin: boolean } = Object.assign({}, defaultUserConfig, readJSONSync(userConfigFile));
writeJSONSync(userConfigFile, userConfig);

function toggleWin() {
  if (win?.isVisible()) {
    hideWin();
  } else {
    showWin();
  }
}

function showWin() {
  if (win.isMinimized()) win.restore();
  win?.show();
  win?.focus();
  win?.setSkipTaskbar(false);
  win?.maximize();
}

function hideWin() {
  win?.hide();
  win?.setSkipTaskbar(true);
}

function destroyApp() {
  win?.destroy();
  app.quit();
  tray?.destroy();
}

function createWindow() {
  win = new BrowserWindow({
    width: config.width,
    height: config.height,
    title: config.title,
    minWidth: config.width,
    minHeight: config.height,
    autoHideMenuBar: true,
    backgroundColor: "#ffffff",
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
    },
    show: false,
  });

  const loading = new BrowserWindow({
    autoHideMenuBar: true,
    width: 375,
    height: 650,
    title: config.title,
    hasShadow: false,
    show: false,
    parent: win,
  });

  loading.loadFile(join(__dirname, "../resource/html/loading.html"));
  loading.setIcon(config.icon);
  loading.once("ready-to-show", () => {
    if (!loading.isDestroyed()) {
      loading.show();
    }
  });
  loading.on("close", () => {
    const { openAsHidden } = app.getLoginItemSettings();
    if (!(process.argv.indexOf("--openAsHidden") !== -1 || openAsHidden)) {
      showWin();
      if (config.isDev) {
        win.webContents.openDevTools();
      }
    }
  });

  win.setIcon(config.icon);
  win.removeMenu();

  win.loadURL(config.url).then(() => {
    loading.hide();
    loading.close();
  });
  win.on("close", e => {
    e.preventDefault();
    hideWin();
  });

  // 新建托盘
  tray = new Tray(config.icon);
  // 托盘名称
  tray.setToolTip(config.title);
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
    // 快捷键
    if (userConfig.keyboard) {
      globalShortcut.register(userConfig.keyboard, () => {
        toggleWin();
      });
    }
    // 开机自启
    app.setLoginItemSettings({
      openAtLogin: app.isPackaged && userConfig.openAtLogin,
      args: ["--openAsHidden"],
      openAsHidden: true,
    });
  });

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    destroyApp();
  }
});

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  destroyApp();
} else {
  app.on("second-instance", () => {
    showWin();
  });
}

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
ipcMain.handle("save-base64-file", (e, base64Str: string, fileName?: string) => {
  return saveBase64File(base64Str, fileName);
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

// 保存文件
ipcMain.handle("write-file", (e, filePath: string, buf: NodeJS.ArrayBufferView) => {
  return writeFile(filePath, buf);
});

// 设置config
ipcMain.handle("set-config", (e, data: unknown) => {
  Object.assign(userConfig, data);
  writeJSONSync(userConfigFile, userConfig);
  tray?.destroy();
  app.relaunch({ args: process.argv.slice(1).concat(["--relaunch"]) });
  app.exit(0);
});

// 获取config
ipcMain.handle("get-config", () => userConfig);
