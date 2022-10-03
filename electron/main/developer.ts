import { createHash } from "crypto";
import { ajax } from "./helper";
import config from "../config";

function truncate(q: string) {
  const len = q.length;
  if (len <= 20) return q;
  return q.substring(0, 10) + len + q.substring(len - 10, len);
}

// 有道翻译
export interface IYoudao {
  errorCode: string;
  query: string;
  translation?: string[];
  basic?: {
    explains: string[];
  };
  web?: { key: string; value: string[] }[];
}
export function youdaoTranslate(q = "") {
  const appKey = config.youdaoAppId;
  const now = Date.now();
  const salt = now;
  const curtime = Math.round(now / 1000);
  const from = "zh-CHS";
  const to = "en";
  const sign = createHash("SHA256")
    .update(appKey + truncate(q) + salt + curtime + config.youdaoKey)
    .digest("hex");

  return ajax<IYoudao>("https://openapi.youdao.com/api", {
    q,
    appKey,
    salt,
    from,
    to,
    sign,
    signType: "v3",
    curtime,
  }).then(data => {
    if (data.errorCode === "0") {
      const arr: string[] = [];
      if (data.translation?.length) {
        arr.push(...data.translation);
      }
      if (data.basic?.explains.length) {
        arr.push(...data.basic.explains);
      }
      if (data.web?.length) {
        const value = data.web.find(v => v.key === q)?.value;
        if (value?.length) {
          arr.push(...value);
        }
      }
      return arr;
    } else {
      return Promise.reject(new Error("youdao error"));
    }
  });
}

// 百度翻译
export interface IBaidu {
  from: string;
  to: string;
  trans_result: {
    src: string;
    dst: string;
  }[];
  error_msg?: string;
}
export function baiduTranslate(q = "") {
  const appid = config.baiduAppId;
  const salt = Date.now();
  const from = "zh";
  const to = "en";
  const sign = createHash("MD5")
    .update(appid + q + salt + config.baiduKey)
    .digest("hex");

  return ajax<IBaidu>("https://api.fanyi.baidu.com/api/trans/vip/translate", {
    q,
    appid,
    salt,
    from,
    to,
    sign,
  }).then(data => {
    if (data.error_msg) {
      return Promise.reject(new Error(data.error_msg));
    } else {
      return data.trans_result.map(v => v.dst);
    }
  });
}

// 翻译
export async function translate(words: string) {
  const arr: string[] = [];
  try {
    await Promise.any([
      youdaoTranslate(words).then(data => {
        arr.push(...data);
      }),
      baiduTranslate(words).then(data => {
        arr.push(...data);
      }),
    ]);
  } finally {
    return arr;
  }
}
