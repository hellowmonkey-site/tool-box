const isDev = import.meta.env.DEV;
const isElectron = typeof electronAPI !== "undefined";
import { version } from "../../package.json";
import { productName } from "../../electron-builder.json";

const releaseName = `${productName}-Windows-Setup-${version}.exe`;
const releaseUrl = `/release/${releaseName}`;

export default {
  isDev,
  isElectron,
  dbName: "tool",
  dbVersion: 1,
  version,
  productName,
  releaseName,
  releaseUrl,
  movieUrl: "https://movie.hellowmonkey.cc",
};
