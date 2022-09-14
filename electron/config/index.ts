import { join } from "path";
import { tinifyKeys } from "../data/keys.json";
const isDev = process.env.NODE_ENV === "development";

export default {
  isDev,
  tinifyKeys,
  width: 1200,
  height: 800,
  title: "沃德工具箱",
  icon: join(__dirname, "../resource/image/logo.png"),
  url: isDev ? "http://127.0.0.1:3032" : "https://tool.hellowmonkey.cc",
};
