import { Type } from "naive-ui/es/button/src/interface";

export const circuits: { label: string; value: string }[] = [
  {
    label: "vip解析",
    value: "http://www.ckmov.vip/api.php?url=__URL__",
  },
  {
    label: "云解析",
    value: "http://jx.aidouer.net/?url=__URL__",
  },
];
export const videoList: { name: string; url: string; type: Type }[] = [
  {
    name: "爱奇艺",
    url: "https://www.iqiyi.com/",
    type: "primary",
  },
  {
    name: "腾讯视频",
    url: "https://v.qq.com/",
    type: "info",
  },
  {
    name: "优酷视频",
    url: "https://youku.com/",
    type: "success",
  },
  {
    name: "芒果TV",
    url: "https://www.mgtv.com/",
    type: "warning",
  },
  {
    name: "哔哩哔哩",
    url: "https://www.bilibili.com/",
    type: "error",
  },
];
