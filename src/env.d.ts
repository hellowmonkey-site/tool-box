/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare let electronAPI: {
  setProgressBar: (progress: number) => void;
  setTitle: (title: string) => void;
  compressImage: (filePath: string, targetPath?: string, width?: number) => Promise<{ fileSize: number; targetSize: number }>;
  saveDialog: (title: string) => Promise<string>;
  openDirectory: (path: string) => Promise<void>;
  selectDirectory: (title?: string) => Promise<string>;
  pngToIco: (filePath: string, size?: number) => Promise<Buffer>;
};

declare module "qrcode-decoder";
