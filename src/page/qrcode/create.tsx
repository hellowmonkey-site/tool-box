import { NButton, NCard, NInput } from "naive-ui";
import { defineComponent, nextTick, onActivated, ref } from "vue";
import { downLoad } from "@/helper";
import qrcode from "qrcode";
import Db from "@/helper/db";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    const text = ref("");
    const canvasEl = ref<HTMLCanvasElement>();
    const iptEl = ref<HTMLInputElement>();
    const showPreview = ref(false);

    function makeQrcode() {
      if (!text.value) {
        return;
      }
      showPreview.value = true;
      nextTick(() => {
        qrcode.toCanvas(canvasEl.value, text.value, { width: 260, margin: 2 });
      });
    }

    async function downCanvas() {
      if (!canvasEl.value) {
        return;
      }
      const imgURL = canvasEl.value.toDataURL("image/png");
      // const table = await new Db().open("logo").then(t => t.selectTable("logo"));
      // const data = await table.findAll();
      // console.log(data);
      downLoad(imgURL, "qrcode.png");
    }

    onActivated(() => {
      iptEl.value?.focus();
    });

    return () => (
      <div class="d-flex align-items-start">
        <div class="d-flex align-items-center direction-column justify-center flex-item-extend mar-r-4-item">
          <NInput
            type="textarea"
            onUpdateValue={() => {
              showPreview.value = false;
            }}
            ref={iptEl}
            placeholder="请输入文字内容"
            rows={8}
            class="mar-b-5-item"
            v-model={[text.value, "value"]}
          />
          {text.value ? (
            <NButton
              type="primary"
              size="large"
              onClick={() => {
                makeQrcode();
              }}
            >
              生成二维码
            </NButton>
          ) : null}
        </div>
        {text.value && showPreview.value ? (
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
        ) : null}
      </div>
    );
  },
});
