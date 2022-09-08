import tinify from "tinify";
import { join, sep } from "path";

export async function compressImage(filePath: string, targetPath?: string) {
  tinify.key = "4RxZwMzdcMT4ksdgYnVYJzMtn2R7cgCT";
  const arr = filePath.split(sep);
  const fileName = arr[arr.length - 1];
  if (!targetPath) {
    targetPath = arr.slice(0, arr.length - 1).join(sep);
  }
  const source = tinify.fromFile(filePath);
  await source.toFile(join(targetPath, fileName));
  return targetPath;
}
