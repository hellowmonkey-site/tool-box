import { TypeItem } from "@/config/type";
import { Type } from "naive-ui/es/button/src/interface";

export const enum DownloadStatus {
  WAITING,
  DOWNLOADING,
  FINISHED,
  ERROR,
}
export const downloadStatusList: TypeItem[] = [
  {
    text: "等待下载",
    value: DownloadStatus.WAITING,
    color: "default",
  },
  {
    text: "下载中",
    value: DownloadStatus.DOWNLOADING,
    color: "info",
  },
  {
    text: "下载完成",
    value: DownloadStatus.FINISHED,
    color: "success",
  },
  {
    text: "下载失败",
    value: DownloadStatus.ERROR,
    color: "error",
  },
];

export interface ITsItem {
  status: DownloadStatus;
  src: string;
  m3u8Src: string;
  name: string;
  filePath: string;
  file?: Buffer;
}
export interface IM3u8Item {
  status: DownloadStatus;
  src: string;
  name: string;
  filePath: string;
  percentage: number;
  total: number;
  doneNum: number;
}

export const circuits: { label: string; value: string }[] = [
  {
    label: "vip解析",
    value: "https://www.ckmov.vip/api.php?url=__URL__",
  },
  {
    label: "云解析",
    value: "https://jx.aidouer.net/?url=__URL__",
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
