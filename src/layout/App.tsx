import { ConfigProvider, Modal } from "ant-design-vue";
import { defineComponent } from "vue";
import { RouterView } from "vue-router";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import { isIE } from "@/helper/validate";

export default defineComponent({
  setup() {
    return () => (
      <ConfigProvider locale={zhCN}>
        <RouterView />
      </ConfigProvider>
    );
  },
  mounted() {
    // 判断是不是IE浏览器
    if (isIE) {
      Modal.warning({
        title: "重要提示",
        content: "监测到您当前浏览器版本过低，会影响部分功能的使用，建议使用谷歌、火狐等高级浏览器，或将360等双核心的浏览器切换至极速模式",
        okText: "立即升级",
        onOk() {
          window.open("https://www.microsoft.com/zh-cn/edge");
          return Promise.reject({ message: "" });
        },
      });
    }
  },
});
