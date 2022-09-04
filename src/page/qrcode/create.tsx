import { NButton, NCard, NInput, NText } from "naive-ui";
import { defineComponent } from "vue";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    return () => (
      <div class="d-flex align-items-start">
        <div class="d-flex align-items-center direction-column justify-center flex-item-extend mar-r-4-item">
          <NInput type="textarea" placeholder="请输入文字内容" rows={13} class="mar-b-5-item" />
          <NButton type="primary" size="large">
            生成二维码
          </NButton>
        </div>
        <NCard style={{ width: "300px" }} title="预览区" bordered>
          {{
            default() {
              return (
                <div class="d-flex align-items-center justify-center">
                  <NText code>预览区</NText>
                </div>
              );
            },
            footer() {
              return (
                <NButton block size="large" type="primary">
                  下载
                </NButton>
              );
            },
          }}
        </NCard>
      </div>
    );
  },
});
