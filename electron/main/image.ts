import tinify from "tinify";
import toIco from "png-to-ico";
import { join, sep } from "path";
import * as fse from "fs-extra";

const tinifyKeys = ["4RxZwMzdcMT4ksdgYnVYJzMtn2R7cgCT", "XrHtLVmrnvnhGLHH2RCkRN9BPm7ZdJg1", "ZZtYtycXQk4d5P11NmFTt70YnJrJx1Qk"];

// 压缩图片
export async function compressImage(filePath: string, targetPath?: string) {
  let i = 0;
  const arr = filePath.split(sep);
  const fileName = arr[arr.length - 1];
  if (!targetPath) {
    targetPath = arr.slice(0, arr.length - 1).join(sep);
  }
  while (i < tinifyKeys.length) {
    tinify.key = tinifyKeys[i];
    try {
      const source = tinify.fromFile(filePath);
      await source.toFile(join(targetPath, fileName));
      return Promise.resolve(targetPath);
    } catch (error) {
      i++;
    }
  }
  return Promise.reject("压缩失败");
}

// png转ico
export async function pngToIco(filePath: string, size = 32) {
  const arr = filePath.split(sep);
  const targetPath = arr.slice(0, arr.length - 1).join(sep);
  const buf = await toIco(filePath);
  fse.writeFileSync(join(targetPath, "favicon.ico"), buf);
  return buf;
}
