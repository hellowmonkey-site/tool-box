import tinify from "tinify";
import { join } from "path";
import * as fse from "fs-extra";
import { getFilePath, getFilePathInfo } from "./helper";
import toIco from "png-to-ico";
import config from "../config";

// 压缩图片
export async function compressImage(orgPath: string, targetPath?: string, width?: number) {
  let i = 0;
  const { fileName, filePath } = getFilePath(orgPath);
  if (!targetPath) {
    targetPath = filePath;
  }
  if (width) {
    const [name, ext] = getFilePathInfo(fileName);
    targetPath = join(targetPath, `${name}--width-${width}.${ext}`);
  } else {
    targetPath = join(targetPath, fileName);
  }
  const fileSize = fse.statSync(orgPath).size;
  while (i < config.tinifyKeys.length) {
    tinify.key = config.tinifyKeys[i];
    try {
      let source = tinify.fromFile(orgPath);
      if (width) {
        source = source.resize({
          method: "scale",
          width,
        });
      }
      await source.toFile(targetPath);
      const targetSize = fse.statSync(targetPath).size;
      return Promise.resolve({ fileSize, targetSize });
    } catch (error) {
      i++;
    }
  }
  return Promise.reject("压缩失败");
}

// png转ico
export async function pngToIco(filePath: string, size = 32) {
  const { filePath: targetPath, fileName } = getFilePath(filePath);
  const targetFile = join(targetPath, "favicon.ico");
  const tempPath = join(__dirname, "../temp");
  const tempFile = join(tempPath, fileName);
  let i = config.tinifyKeys.length - 1;
  if (!fse.existsSync(tempPath)) {
    fse.mkdirSync(tempPath);
  }
  while (i >= 0) {
    tinify.key = config.tinifyKeys[i];
    try {
      await tinify
        .fromFile(filePath)
        .resize({
          method: "scale",
          width: size,
        })
        .toFile(tempFile);
      break;
    } catch (error) {
      i--;
    }
  }
  const buf = await toIco([tempFile]);
  fse.writeFileSync(targetFile, buf);
  fse.removeSync(tempFile);
  return targetFile;
}
