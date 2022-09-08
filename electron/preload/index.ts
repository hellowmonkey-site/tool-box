import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  // 设置title
  setTitle: (title: string) => ipcRenderer.send("set-title", title),
  // 图片压缩
  compressImage: (filePath: string, targetPath?: string) => ipcRenderer.invoke("compress-image", filePath, targetPath),
  // 保存对话框
  saveDialog: (title: string) => ipcRenderer.invoke("save-dialog", title),
  // 选择文件夹
  selectDirectory: (path: string) => ipcRenderer.invoke("select-directory", path),
  // 选择文件夹
  openDirectory: (title: string) => ipcRenderer.invoke("open-directory", title),
});
