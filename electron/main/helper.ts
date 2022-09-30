import { sep } from "path";
import { Notification } from "electron";
import config from "../config";

// 获取文件路径
export function getFilePath(fullPath: string) {
  const arr = fullPath.split(sep);
  const fileName = arr[arr.length - 1];
  const filePath = arr.slice(0, arr.length - 1).join(sep);
  return {
    fileName,
    filePath,
  };
}

// 获取文件名和扩展名
export function getFilePathInfo(fileName: string): [string, string] {
  const arr = fileName.split(".");
  const str = arr.slice(0, arr.length - 1).join("");
  const ext = arr[arr.length - 1];
  return [str, ext];
}

// 通知
export function notification(title: string, body: string) {
  if (!Notification.isSupported()) {
    return Promise.reject("不支持");
  }
  return new Notification({
    title,
    body,
    icon: config.icon,
  }).show();
}
