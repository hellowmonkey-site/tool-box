import { awaitLoadImg, awaitNextTick, copyImg, downLoadBase64File, fileToBase64, getFilePathInfo } from "@/helper";
import { message } from "@/service/common";
import { UploadFileOutlined } from "@vicons/material";
import { NButton, NColorPicker, NIcon, NInput, NSlider, NSwitch, NText, NUpload, NUploadDragger, UploadFileInfo } from "naive-ui";
import { defineComponent, reactive, ref } from "vue";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    const canvasEl = ref<HTMLCanvasElement>();
    const iptEl = ref<HTMLInputElement>();
    const loading = ref(false);
    const form = reactive({
      color: "rgba(0, 0, 0, 0.6)",
      fontSize: 12,
      margin: 20,
      space: 20,
      angle: 45,
      src: "",
      bold: false,
      text: "",
      fontFamily: '-apple-system,"Helvetica Neue",Helvetica,Arial,"PingFang SC","Hiragino Sans GB","WenQuanYi Micro Hei",sans-serif',
      fileName: "",
    });

    // 上传
    async function uploadImage({ file }: UploadFileInfo) {
      if (!file) {
        return false;
      }
      form.fileName = file.name;
      form.src = await fileToBase64(file).then(v => v as string);
      await awaitNextTick();
      render();
      iptEl.value?.focus();
      return false;
    }

    // 下载二维码
    function downCanvas() {
      if (!canvasEl.value) {
        return;
      }
      const imgURL = canvasEl.value.toDataURL("image/png");
      const [name, ext] = getFilePathInfo(form.fileName);
      loading.value = true;
      downLoadBase64File(imgURL, `${name}-watermark.${ext}`).finally(() => {
        loading.value = false;
      });
    }

    // 渲染
    async function render() {
      if (!form.src) {
        return;
      }
      const canvas = canvasEl.value;
      if (!canvas) {
        return;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const img = await awaitLoadImg(form.src);
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);
      if (form.text) {
        const fontArr = [form.fontSize + "px", form.fontFamily];
        if (form.bold) {
          fontArr.unshift("bold");
        }
        ctx.fillStyle = form.color;
        ctx.font = fontArr.join(" ");
        ctx.rotate((form.angle * Math.PI) / 180);
        const width = ctx.measureText(form.text).width;
        const step = Math.sqrt(Math.pow(canvas.width, 2) + Math.pow(canvas.height, 2));
        const x = Math.ceil(step / (width + form.space));
        const y = Math.ceil(step / (form.margin * form.fontSize) / 2);
        let i, j, k, l, ref, ref1, ref2;
        for (i = k = 0, ref = x; 0 <= ref ? k <= ref : k >= ref; i = 0 <= ref ? ++k : --k) {
          for (j = l = ref1 = -y, ref2 = y; ref1 <= ref2 ? l <= ref2 : l >= ref2; j = ref1 <= ref2 ? ++l : --l) {
            ctx.fillText(form.text, (width + form.space) * i, form.margin * form.fontSize * j);
          }
        }
      }
    }

    let timer: NodeJS.Timeout;
    function delayRender() {
      clearTimeout(timer);
      timer = setTimeout(() => {
        render();
      }, 500);
    }

    return () => (
      <div>
        <NUpload accept="image/*" onBeforeUpload={e => uploadImage(e.file)} fileList={[]} class="mar-b-7-item">
          <NUploadDragger>
            <div class="d-flex direction-column align-items-center justify-center pad-5">
              <NIcon size={60} class="mar-b-5-item">
                <UploadFileOutlined />
              </NIcon>
              <NText>点击或者拖动图片到该区域</NText>
            </div>
          </NUploadDragger>
        </NUpload>
        {form.src ? (
          <>
            <div class="d-flex align-items-center mar-b-4-item">
              <NText class="item-label">水印文字</NText>
              <NInput
                ref={iptEl}
                v-model={[form.text, "value"]}
                placeholder="请输入水印文字, 回车渲染"
                onKeydown={e => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    render();
                  }
                }}
                class="flex-item-extend"
              />
            </div>
            <div class="d-flex align-items-center mar-b-4-item">
              <NText class="item-label">字体颜色</NText>
              <NColorPicker v-model={[form.color, "value"]} onUpdateValue={() => delayRender()} class="flex-item-extend" />
            </div>
            <div class="d-flex align-items-center mar-b-4-item">
              <NText class="item-label">字体大小</NText>
              <NSlider min={8} max={40} v-model={[form.fontSize, "value"]} onUpdateValue={() => delayRender()} class="flex-item-extend" />
            </div>
            <div class="d-flex align-items-center mar-b-4-item">
              <NText class="item-label">字体加粗</NText>
              <NSwitch v-model={[form.bold, "value"]} onUpdateValue={() => delayRender()} />
            </div>
            <div class="d-flex align-items-center mar-b-4-item">
              <NText class="item-label">空白间距</NText>
              <NSlider min={5} max={100} v-model={[form.margin, "value"]} onUpdateValue={() => delayRender()} class="flex-item-extend" />
            </div>
            <div class="d-flex align-items-center mar-b-4-item">
              <NText class="item-label">文字间距</NText>
              <NSlider min={5} max={100} v-model={[form.space, "value"]} onUpdateValue={() => delayRender()} class="flex-item-extend" />
            </div>
            <div class="d-flex align-items-center mar-b-4-item">
              <NText class="item-label">角度</NText>
              <NSlider min={0} max={180} v-model={[form.angle, "value"]} onUpdateValue={() => delayRender()} class="flex-item-extend" />
            </div>
            <div class="mar-b-4-item">
              <canvas ref={canvasEl} class="full-width" />
            </div>
            <NButton
              block
              size="large"
              type="primary"
              ghost
              class="mar-b-3-item"
              onClick={() => {
                copyImg(canvasEl.value!.toDataURL("image/png")).then(() => {
                  message.success("复制成功");
                });
              }}
            >
              复制图片
            </NButton>
            <NButton
              block
              size="large"
              type="primary"
              class="mar-b-3-item"
              onClick={() => {
                downCanvas();
              }}
              loading={loading.value}
            >
              下载图片
            </NButton>
          </>
        ) : null}
      </div>
    );
  },
});
