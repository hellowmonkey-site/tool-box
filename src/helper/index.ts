import config from "@/config";
import { ObjType } from "@/config/type";
import { isNumberLike, isEmpty, isUrl } from "@/helper/validate";
import { message } from "@/service/common";
import { nextTick } from "vue";

// 加零
export const addZero = (num: number | string): string => {
  num = Number(Number(num));
  if (num < 10) {
    num = "0" + num;
  }
  return String(num);
};

// 获取数据类型
export const getType = (item: any): string => {
  const str = Object.prototype.toString.call(item);
  return str.substring(8, str.length - 1).toLocaleLowerCase();
};

// 对象值处理
export const filterObject = (obj: ObjType = {}, transformNum = false) => {
  const params: ObjType = {};
  for (const key in obj) {
    let data = obj[key];
    if (!isEmpty(data)) {
      if (typeof data === "string") {
        data = data.trim();
      }
      if (transformNum && isNumberLike(data)) {
        data = Number(data);
      }
      params[key] = data;
    }
  }
  return params;
};

// 路由参数过滤
export const filterParams = (query: ObjType = {}) => {
  const data = filterObject(query, true);
  for (const key in data) {
    query[key] = data[key];
  }
  return query;
};

// 参数对象转参数字符串
export const stringifyParams = (obj: ObjType = {}, strict = true): string => {
  const arr = [];
  let str = "";
  if (strict) {
    obj = filterObject(obj);
  } else {
    obj = filterParams(obj);
  }
  for (const key in obj) {
    let data = obj[key];
    if (getType(data) === "array") {
      data = data.join(",");
    }
    if (!strict || !isEmpty(data)) {
      arr.push(`${key}=${data}`);
    }
  }
  str = arr.join("&");
  if (str.length > 0) {
    str = "?" + str;
  }
  return str;
};

// 链接转参数对象
export const parseParams = (str = window.location.href) => {
  const params: ObjType = {};
  const arr = str.split("?");
  const query = arr[1];
  if (!query) {
    return params;
  }
  const paramsArr = query.split("&");
  paramsArr.forEach(item => {
    const arrs = item.split("=");
    params[arrs[0]] = arrs[1];
  });
  return params;
};

// 追加链接参数
export const putParams = (url = "", putParams = {}): string => {
  const oldParams = parseParams(url);
  const path = url.split("?")[0];
  // 去除原有参数
  for (const key in putParams) {
    delete oldParams[key];
  }
  const oldParamsStr = stringifyParams(oldParams);
  let putParamsStr = stringifyParams(putParams, false);
  if (oldParamsStr.includes("?")) {
    putParamsStr = putParamsStr.replace("?", "&");
  }
  return path + oldParamsStr + putParamsStr;
};

// 合并链接
export const getFullUrl = (...urls: string[]): string => {
  urls.slice(1).forEach((value, index) => {
    if (isUrl(value)) {
      urls.slice(0, index + 1).forEach((v, k) => {
        urls[k] = "";
      });
    }
  });
  const arr = urls.filter(v => !!v).map(v => v.replace(/\/$/, "").replace(/^\//, ""));
  return arr.join("/");
};

// 随机数
export const random = (n: number, m: number) => {
  return Math.floor(Math.random() * (m - n + 1) + n);
};

// 随机字符串
const stringTemplate = "1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
export const randomString = (length = 6) => {
  return new Array(length)
    .fill(1)
    .map(() => stringTemplate[random(0, stringTemplate.length - 1)])
    .join("");
};

// 深度拷贝
export const deepEachObjClone = (obj: any, cache = new WeakMap()) => {
  if (typeof obj !== "object") return obj; // 普通类型，直接返回
  if (obj === null) return obj;
  if (cache.get(obj)) return cache.get(obj); // 防止循环引用，程序进入死循环
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);

  // 找到所属原型上的constructor，所属原型上的constructor指向当前对象的构造函数
  const cloneObj = new obj.constructor();
  cache.set(obj, cloneObj); // 缓存拷贝的对象，用于处理循环引用的情况
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloneObj[key] = deepEachObjClone(obj[key], cache); // 递归拷贝
    }
  }
  return cloneObj;
};

// 将base64转换为file
export const base64ToFile = (dataurl: string): File => {
  const base64Prefix = "data:image/png;base64,";
  if (!/^data:image\/.+;base64,/.test(dataurl)) {
    dataurl = base64Prefix + dataurl;
  }
  let mime = "png";
  const arr = dataurl.split(",");
  const match = arr[0].match(/:(.*?);/);
  if (match) {
    mime = match[1];
  }
  const suffix = String(mime).replace("image/", "");
  const filename = randomString(16) + "." + suffix;
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  const file = new File([u8arr], filename, {
    type: mime,
  });
  return file;
};

// file转base64
export const fileToBase64 = (file: File): Promise<FileReader["result"]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = error => reject(error);
  });
};

// style拼接
export function putStyle(params: ObjType) {
  const style = document.body.getAttribute("style") || "";
  const obj: ObjType = {};
  const arr = String(style)
    .split(";")
    .filter(v => !!v);
  arr.forEach(item => {
    const [k, v] = String(item).split(":");
    obj[k] = v;
  });
  let str = "";
  Object.assign(obj, params);
  Object.keys(obj).forEach(k => {
    str += `${k}: ${obj[k]};`;
  });
  return str;
}

// 复制文本到剪贴板
export async function copyText(text: string): Promise<void> {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
  } else {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    if (!successful) {
      throw new Error("复制失败");
    }
  }
}

// 复制图片到剪贴板
export async function copyImg(src: string) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }

  const img = await awaitLoadImg(src);
  const { width, height } = img;
  canvas.width = width;
  canvas.height = height;
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0);
  const blob = await new Promise<Blob | null>(resolve => {
    canvas.toBlob(blob => {
      resolve(blob);
    });
  });
  if (!blob) {
    return;
  }
  const data = [
    new ClipboardItem({
      [blob.type]: blob,
    }),
  ];
  await navigator.clipboard.write(data);
}

// 横线转驼峰
export function lineToHump(str: string, lineType = "-") {
  const reg = new RegExp(`${lineType}(\\w)`, "g");
  return str.replace(reg, (all, letter) => {
    return letter.toUpperCase();
  });
}

// 横线转大驼峰
export function lineToBigHump(str: string, lineType = "-") {
  const [first, ...data] = lineToHump(str, lineType);
  return first.toLocaleUpperCase() + data.join("");
}

// 驼峰转横线
export function humpToLine(str: string, lineType = "-") {
  let temp = str.replace(/[A-Z]/g, i => {
    return lineType + i.toLowerCase();
  });
  if (temp.slice(0, 1) === lineType) {
    temp = temp.slice(1);
  }
  return temp;
}

// 下载
let a: HTMLAnchorElement;
export function downLoad(url: string, fileName = "") {
  if (!a) {
    a = document.createElement("a");
  }
  a.href = url;
  a.download = fileName;
  a.click();
}

// 下载图片
export async function downLoadBase64File(base64Str: string, fileName?: string) {
  if (config.isElectron) {
    const { filePath } = await electronAPI.saveBase64File(base64Str, fileName);
    await electronAPI.openDirectory(filePath);
    message.success(`下载成功：【${filePath}/${fileName!}】`);
  } else {
    downLoad(base64Str, fileName);
  }
}

// 等待一段时间
export function sleep(s: number) {
  return new Promise<NodeJS.Timeout>(resolve => {
    const timer = setTimeout(() => {
      resolve(timer);
    }, s);
  });
}

// nextTick的Promise
export function awaitNextTick(data?: any) {
  return new Promise(resolve => {
    nextTick(() => {
      resolve(data);
    });
  });
}

// 图片加载
export function awaitLoadImg(src: string) {
  const img = new Image();
  img.crossOrigin = "Anonymous";
  img.src = src;
  return new Promise<HTMLImageElement>((resolve, reject) => {
    img.onload = () => {
      resolve(img);
    };
    img.onerror = e => {
      reject(e);
    };
  });
}

// 获取文件名和扩展名
export function getFilePathInfo(fileName: string): [string, string] {
  const arr = fileName.split(".");
  const str = arr.slice(0, arr.length - 1).join("");
  const ext = arr[arr.length - 1];
  return [str, ext];
}

// 打开链接
export function openUrl(url: string) {
  if (config.isElectron) {
    electronAPI.openUrl(url);
  } else {
    window.open(url);
  }
}
