import { app, BrowserWindow, globalShortcut, ipcMain, Menu, SaveDialogOptions, Tray, Notification, shell } from "electron";
import { join, resolve } from "path";
import { writeJSONSync, readJSONSync, existsSync, mkdirSync } from "fs-extra";
import chokidar from "chokidar";
import { compressImage, pngToIco } from "./image";
import { openDirectory, saveDialog, saveBase64File, selectDirectory, writeFile } from "./file";
import { getFilePath, notification } from "./helper";
import { translate } from "./developer";
import config from "../config";
import defaultUserConfig from "../data/config.json";

let tray: Tray, win: BrowserWindow;

const schemeReg = new RegExp(`^${config.scheme}:\/\/`);

const userConfigPath = app.getPath("userData");
const userConfigFile = join(userConfigPath, "config.json");
if (!existsSync(userConfigPath)) {
  mkdirSync(userConfigPath);
}
if (!existsSync(userConfigFile)) {
  writeJSONSync(userConfigFile, defaultUserConfig);
}
const userConfig: { keyboard: string; openAtLogin: boolean; compressDirs: string[]; compressNotify: boolean } = Object.assign(
  {},
  defaultUserConfig,
  readJSONSync(userConfigFile)
);
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

  const { openAsHidden } = app.getLoginItemSettings();
  const hidden = process.argv.indexOf("--openAsHidden") !== -1 || openAsHidden;

  loading.loadFile(join(__dirname, "../resource/html/loading.html"));
  loading.setIcon(config.icon);
  loading.once("ready-to-show", () => {
    if (!hidden && !loading.isDestroyed()) {
      loading.show();
    }
  });
  loading.on("close", () => {
    if (!hidden) {
      showWin();
    }
    if (config.isDev) {
      win.webContents.openDevTools();
    }
    // ????????????
    tray = new Tray(config.icon);
    // ????????????
    tray.setToolTip(config.title);
    // ????????????
    const contextMenu = Menu.buildFromTemplate([
      {
        label: "??????",
        click: () => {
          showWin();
        },
      },
      {
        type: "separator",
      },
      {
        label: "??????",
        click: () => {
          destroyApp();
        },
      },
    ]);
    // ??????????????????
    tray.setContextMenu(contextMenu);

    tray.on("click", () => {
      toggleWin();
    });
  });

  win.setIcon(config.icon);
  win.removeMenu();

  let { url } = config;
  const schemeUrl = process.argv[process.argv.length - 1];
  if (schemeReg.test(schemeUrl)) {
    url = schemeUrl.replace(schemeReg, config.url + "/");
  }

  win.loadURL(url).then(() => {
    loading.hide();
    loading.close();
  });
  win.on("close", e => {
    e.preventDefault();
    hideWin();
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
    // ?????????
    if (userConfig.keyboard) {
      globalShortcut.register(userConfig.keyboard, () => {
        toggleWin();
      });
    }
    // ????????????
    app.setLoginItemSettings({
      openAtLogin: app.isPackaged && userConfig.openAtLogin,
      args: ["--openAsHidden"],
      openAsHidden: true,
    });
    // ??????????????????
    if (userConfig.compressDirs.length) {
      chokidar
        .watch(userConfig.compressDirs, {
          persistent: true,
          depth: 9,
        })
        .on("add", (path, stat) => {
          if (stat?.birthtime && Date.now() - stat.birthtime.getTime() < 60 * 1000) {
            compressImage(path).then(() => {
              if (userConfig.compressNotify) {
                const { filePath } = getFilePath(path);
                const notify = new Notification({
                  title: "??????????????????",
                  body: path,
                  icon: config.icon,
                });
                notify.on("click", () => {
                  openDirectory(filePath);
                });
                notify.show();
              }
            });
          }
        });
    }
  });

// ???????????????
if (!app.isDefaultProtocolClient(config.scheme)) {
  if (app.isPackaged) {
    app.setAsDefaultProtocolClient(config.scheme);
  } else {
    app.setAsDefaultProtocolClient(config.scheme, process.execPath, [resolve(process.argv[1])]);
  }
}
// app.removeAsDefaultProtocolClient(config.scheme, process.execPath, [resolve(process.argv[1])]);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    destroyApp();
  }
});

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  destroyApp();
} else {
  app.on("second-instance", (e, args) => {
    const schemeUrl = args[args.length - 1];
    if (schemeReg.test(schemeUrl)) {
      win.loadURL(schemeUrl.replace(schemeReg, config.url + "/"));
    }
    showWin();
  });
}

// ??????title
ipcMain.on("set-title", (event, title) => {
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  win?.setTitle(title);
});

// ???????????????
ipcMain.on("set-progress-bar", (e, progress: number) => {
  win?.setProgressBar(progress);
});

// ????????????
ipcMain.handle("compress-image", async (e, filePath: string, targetPath?: string, width?: number) => {
  return compressImage(filePath, targetPath, width);
});

// ????????????????????????
ipcMain.handle("save-dialog", (e, opts: SaveDialogOptions) => {
  return saveDialog(opts);
});

// ??????base64??????
ipcMain.handle("save-base64-file", (e, base64Str: string, fileName?: string) => {
  return saveBase64File(base64Str, fileName);
});

// ???????????????
ipcMain.handle("select-directory", (e, path: string, defaultPath?: string) => {
  return selectDirectory(path, defaultPath);
});

// ???????????????
ipcMain.handle("open-directory", (e, title: string) => {
  return openDirectory(title);
});

// png???ico
ipcMain.handle("png-to-ico", (e, filePath: string, size: number) => {
  return pngToIco(filePath, size);
});

// ??????
ipcMain.handle("notification", (e, title: string, content: string) => {
  return notification(title, content);
});

// ????????????
ipcMain.handle("write-file", (e, filePath: string, buf: NodeJS.ArrayBufferView) => {
  return writeFile(filePath, buf);
});

// ??????config
ipcMain.handle("set-config", (e, data: unknown) => {
  Object.assign(userConfig, data);
  writeJSONSync(userConfigFile, userConfig);
  tray?.destroy();
  app.relaunch({ args: process.argv.slice(1).concat(["--relaunch"]) });
  app.exit(0);
});

// ??????config
ipcMain.handle("get-config", () => userConfig);

// ????????????
ipcMain.handle("open-url", (e, url: string) => shell.openExternal(url));

// ??????
ipcMain.handle("translate", (e, words: string) => translate(words));
