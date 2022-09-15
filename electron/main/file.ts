import { dialog, SaveDialogOptions, shell } from "electron";
import { writeFileSync } from "fs-extra";

// 保存文件弹框
export function saveDialog(opts: SaveDialogOptions) {
  return dialog.showSaveDialog(opts).then(data => data.filePath);
}

// 保存文件
export function saveBase64File(base64Str: string, fileName = "") {
  base64Str = base64Str.replace(/^data:image\/\w+;base64,/, "");
  return saveDialog({ title: "保存图片", filters: [{ extensions: ["png"], name: fileName }] }).then(filePath => {
    if (!filePath) {
      return Promise.reject("位置选择错误");
    }
    writeFileSync(filePath, Buffer.from(base64Str, "base64"));
    return filePath;
  });
}

// 选择文件夹
export function selectDirectory(title = "选择文件夹") {
  return dialog.showOpenDialog({ title, properties: ["openDirectory"] }).then(data => data.filePaths[0]);
}

// 打开文件夹
export function openDirectory(path: string) {
  return shell.openPath(path);
}
