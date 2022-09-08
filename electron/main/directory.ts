import { dialog, shell } from "electron";

// 保存文件
export function saveDialog(title: string) {
  return dialog.showSaveDialog({ title }).then(data => data.filePath);
}

// 选择文件夹
export function selectDirectory(title = "选择文件夹") {
  return dialog.showOpenDialog({ title, properties: ["openDirectory"] }).then(data => data.filePaths[0]);
}

// 打开文件夹
export function openDirectory(path: string) {
  return shell.openPath(path);
}
