/* eslint-disable @typescript-eslint/no-var-requires */
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  // 设置title
  setTitle: (title: string) => ipcRenderer.send("set-title", title),
  // 图片压缩
  compressImage: (file: string) => ipcRenderer.invoke("compress-image", file),
});
