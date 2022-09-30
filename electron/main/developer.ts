import { createHash } from "crypto";
import { ajax } from "./helper";
import config from "../config";

function truncate(q: string) {
  const len = q.length;
  if (len <= 20) return q;
  return q.substring(0, 10) + len + q.substring(len - 10, len);
}

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
        data.web.forEach(v => {
          if (v?.value?.length) {
            arr.push(...v.value);
          }
        });
      }
      return arr;
    } else {
      return Promise.reject(new Error("youdao error"));
    }
  });
}
