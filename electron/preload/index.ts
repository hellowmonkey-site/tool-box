import { contextBridge, ipcRenderer } from "electron";
import { keyboard } from "../data/config.json";

contextBridge.exposeInMainWorld("electronAPI", {
  // 快捷键
  keyboard,
  // 设置进度条
  setProgressBar: (...args: any[]) => ipcRenderer.send("set-progress-bar", ...args),
  // 设置title
  setTitle: (...args: any[]) => ipcRenderer.send("set-title", ...args),
  // 图片压缩
  compressImage: (...args: any[]) => ipcRenderer.invoke("compress-image", ...args),
  // 保存对话框
  saveDialog: (...args: any[]) => ipcRenderer.invoke("save-dialog", ...args),
  // 保存文件
  saveBase64File: (...args: any[]) => ipcRenderer.invoke("save-base64-file", ...args),
  // 选择文件夹
  selectDirectory: (...args: any[]) => ipcRenderer.invoke("select-directory", ...args),
  // 选择文件夹
  openDirectory: (...args: any[]) => ipcRenderer.invoke("open-directory", ...args),
  // 选择文件夹
  pngToIco: (...args: any[]) => ipcRenderer.invoke("png-to-ico", ...args),
  // 选择文件夹
  notification: (...args: any[]) => ipcRenderer.invoke("notification", ...args),
  // 保存文件
  writeFile: (...args: any[]) => ipcRenderer.invoke("write-file", ...args),
  // 设置config
  setConfig: (...args: any[]) => ipcRenderer.invoke("set-config", ...args),
});
