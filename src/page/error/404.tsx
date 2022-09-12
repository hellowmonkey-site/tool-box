import { NButton, NResult } from "naive-ui";
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    const router = useRouter();

    return () => (
      <div class="d-flex direction-column align-items-center justify-center" style="height: 70vh">
        <NResult status="404" title="哎呀，迷路了..." description="可能的原因：原来的页面不存在了；您的链接写错了；">
          {{
            footer() {
              return <NButton onClick={() => router.replace({ name: "index" })}>返回首页</NButton>;
            },
          }}
        </NResult>
      </div>
    );
  },
});
