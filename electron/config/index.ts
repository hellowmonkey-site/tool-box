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
  youdaoAppId: "4942fc478d27c774",
  youdaoKey: "qLDdY5g9qUNQN8WV1WBSVOGYjRfug0mq",
  baiduAppId: "20221003001368543",
  baiduKey: "tVV9MC_Jdtse2oO3CAEU",
  scheme: "tool-box",
};
