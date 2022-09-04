import { NButton, NResult } from "naive-ui";
import { defineComponent } from "vue";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    return () => (
      <NResult status="404" title="哎呀，迷路了..." description="可能的原因：原来的页面不存在了；您的链接写错了；">
        {{
          footer() {
            return <NButton>返回首页</NButton>;
          },
        }}
      </NResult>
    );
  },
});
