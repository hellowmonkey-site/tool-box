import { sep } from "path";
import { Notification } from "electron";
import config from "../config";
import https from "https";

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

// 网络请求
export function ajax<T>(url: string, data?: any) {
  if (data && typeof data === "object") {
    const arr: string[] = [];
    Object.keys(data).forEach(k => {
      arr.push(`${k}=${data[k]}`);
    });
    if (arr.length) {
      url = url + `?${arr.join("&")}`;
    }
  }
  return new Promise<T>((resolve, reject) => {
    https
      .get(url, res => {
        const list: Uint8Array[] = [];
        res.on("data", chunk => {
          list.push(chunk);
        });
        res.on("end", () => {
          try {
            let str = Buffer.concat(list).toString();
            const freg = /^\w+\s?\(/g;
            const lreg = /\)$/g;
            if (freg.test(str) && lreg.test(str)) {
              str = str.replace(freg, "").replace(lreg, "");
            }
            const data = JSON.parse(str);
            resolve(data);
          } catch (error) {
            reject(error);
          }
        });
      })
      .on("error", err => {
        reject(err);
      });
  });
}
