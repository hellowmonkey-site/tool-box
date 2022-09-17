import { join } from "path";
const isDev = process.env.NODE_ENV === "development";

export default {
  isDev,
  tinifyKeys: ["4RxZwMzdcMT4ksdgYnVYJzMtn2R7cgCT", "XrHtLVmrnvnhGLHH2RCkRN9BPm7ZdJg1", "ZZtYtycXQk4d5P11NmFTt70YnJrJx1Qk"],
  width: 1200,
  height: 800,
  title: "沃德工具箱",
  icon: join(__dirname, "../resource/image/logo.png"),
  url: isDev ? "http://127.0.0.1:3030" : "https://tool.hellowmonkey.cc",
};
