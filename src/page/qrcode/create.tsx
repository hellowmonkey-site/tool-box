import { NButton, NCard, NInput } from "naive-ui";
import { defineComponent, ref } from "vue";
import qrcode from "qrcode";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    const text = ref("");
    const canvasEl = ref<HTMLCanvasElement>();

    function makeQrcode() {
      qrcode.toCanvas(canvasEl.value, text.value, { width: 260, margin: 2 });
    }

    function downCanvas() {
      if (!canvasEl.value) {
        return;
      }
      const imgURL = canvasEl.value.toDataURL("image/png");
      const dlLink = document.createElement("a");
      dlLink.download = "qrcode.png";
      dlLink.href = imgURL;
      dlLink.click();
    }

    return () => (
      <div class="d-flex align-items-start">
        <div class="d-flex align-items-center direction-column justify-center flex-item-extend mar-r-4-item">
          <NInput type="textarea" placeholder="请输入文字内容" rows={8} class="mar-b-5-item" v-model={[text.value, "value"]} />
          <NButton
            type="primary"
            size="large"
            onClick={() => {
              makeQrcode();
            }}
          >
            生成二维码
          </NButton>
        </div>
        <NCard style={{ width: "300px" }} title="预览区" bordered>
          {{
            default() {
              return (
                <div class="d-flex align-items-center justify-center">
                  <canvas ref={canvasEl} style="width: 100%"></canvas>
                </div>
              );
            },
            footer() {
              return (
                <NButton
                  block
                  size="large"
                  type="primary"
                  onClick={() => {
                    downCanvas();
                  }}
                >
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