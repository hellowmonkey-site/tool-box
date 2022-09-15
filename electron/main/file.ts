import { dialog, SaveDialogOptions, shell } from "electron";
import { writeFileSync } from "fs-extra";
import { getFilePath } from "./helper";
import { compressImage } from "./image";

// 保存文件弹框
export function saveDialog(opts: SaveDialogOptions) {
  return dialog.showSaveDialog(opts).then(data => data.filePath);
}

// 保存文件
export async function saveBase64File(base64Str: string, name = "") {
  base64Str = base64Str.replace(/^data:image\/\w+;base64,/, "");
  const fullPath = await saveDialog({ title: "保存图片", filters: [{ extensions: ["png"], name }] });
  if (!fullPath) {
    return Promise.reject("位置选择错误");
  }
  writeFileSync(fullPath, Buffer.from(base64Str, "base64"));
  const data = await compressImage(fullPath);
  const { fileName, filePath } = getFilePath(fullPath);
  return {
    ...data,
    fullPath,
    fileName,
    filePath,
  };
}

// 选择文件夹
export function selectDirectory(title = "选择文件夹") {
  return dialog.showOpenDialog({ title, properties: ["openDirectory"] }).then(data => data.filePaths[0]);
}

// 打开文件夹
export function openDirectory(path: string) {
  return shell.openPath(path);
}
