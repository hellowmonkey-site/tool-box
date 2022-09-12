const isDev = import.meta.env.DEV;
const isElectron = typeof electronAPI !== "undefined";

export default {
  isDev,
  isElectron,
  title: "沃德工具箱",
  releaseUrl: "https://github.com",
};
