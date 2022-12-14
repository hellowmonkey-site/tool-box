/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare let electronAPI: {
  on(channel: string, listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void): Electron.IpcRenderer;
  setProgressBar: (progress: number) => void;
  setTitle: (title: string) => void;
  compressImage: (filePath: string, targetPath?: string, width?: number) => Promise<{ fileSize: number; targetSize: number }>;
  saveDialog: (opts: any) => Promise<string>;
  saveBase64File: (
    base64Str: string,
    fileName?: string
  ) => Promise<{ fileSize: number; targetSize: number; fullPath: string; fileName: string; filePath: string }>;
  openDirectory: (path: string) => Promise<void>;
  selectDirectory: (title?: string, defaultPath?: string) => Promise<string>;
  pngToIco: (filePath: string, size?: number) => Promise<string>;
  notification: (title: string, content: string) => Promise<void>;
  writeFile: (filePath: string, buf: NodeJS.ArrayBufferView) => Promise<void>;
  setConfig: (data: unknown) => Promise<void>;
  getConfig: () => Promise<{ keyboard: string; openAtLogin: boolean; compressDirs: string[]; compressNotify: boolean }>;
  openUrl: (url: string) => Promise<void>;
  translate: (words: string) => Promise<string[]>;
};

declare module "qrcode-decoder";

declare module "mux.js";
