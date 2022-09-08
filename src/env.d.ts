/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare let electronAPI: {
  setTitle: (title: string) => void;
  compressImage: (filePath: string, targetPath?: string) => Promise<string>;
  saveDialog: (title: string) => Promise<string>;
  openDirectory: (path: string) => Promise<void>;
  selectDirectory: (title?: string) => Promise<string>;
};
