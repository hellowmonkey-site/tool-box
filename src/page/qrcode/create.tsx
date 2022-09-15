import { NButton, NCard, NCheckbox, NDrawer, NDrawerContent, NIcon, NInput, NUpload, UploadFileInfo } from "naive-ui";
import { defineComponent, onActivated, ref } from "vue";
import { awaitLoadImg, awaitNextTick, downLoadBase64File, fileToBase64, randomString } from "@/helper";
import qrcode from "qrcode";
import { DeleteOutlined, UploadFileOutlined, UploadOutlined } from "@vicons/material";
import { addLogo, deleteLogo, getLogoList, logoList, logoOpts } from "@/service/qrcode";
import { dialog } from "@/service/common";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    const text = ref("");
    const canvasEl = ref<HTMLCanvasElement>();
    const iptEl = ref<HTMLInputElement>();
    const showPreview = ref(false);
    const logo = ref("");
    const logoDrawer = ref(false);

    function clip(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
      ctx.beginPath();
      ctx.moveTo(x + logoOpts.radius, y);
      ctx.arcTo(x + w, y, x + w, y + h, logoOpts.radius);
      ctx.arcTo(x + w, y + h, x, y + h, logoOpts.radius);
      ctx.arcTo(x, y + h, x, y, logoOpts.radius);
      ctx.arcTo(x, y, x + w, y, logoOpts.radius);
      ctx.closePath();
    }

    async function drawImg(url: string, x: number, y: number, width: number, height: number) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
      const img = await awaitLoadImg(url);
      canvas.width = width + x * 2;
      canvas.height = height + y * 2;
      ctx.drawImage(img, x, y, width, height);
      return canvas.toDataURL("image/png");
    }
    // 生成有圆角的矩形
    async function drawRoundedImg(url: string, width: number, height: number, x = 0, y = 0) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
      const imgX = x + logoOpts.border,
        imgY = y + logoOpts.border,
        imgW = width - logoOpts.border * 2,
        imgH = height - logoOpts.border * 2;
      const src = await drawImg(url, imgX, imgY, imgW, imgH);
      const img = await awaitLoadImg(src);

      canvas.width = width;
      canvas.height = height;
      clip(ctx, x, y, width, height);
      ctx.fillStyle = logoOpts.bgColor;
      ctx.fill();
      clip(ctx, imgX, imgY, imgW, imgH);
      ctx.fillStyle = ctx.createPattern(img, "no-repeat")!;
      ctx.fill();
      const data = canvas.toDataURL("image/png");
      return data;
    }

    // 生成二维码
    async function makeQrcode() {
      if (!text.value) {
        return;
      }
      showPreview.value = true;
      await awaitNextTick();
      await qrcode.toCanvas(canvasEl.value, text.value, { width: 260, margin: 2 });

      if (!canvasEl.value) {
        return;
      }
      if (!logo.value) {
        return;
      }

      const ctx = canvasEl.value.getContext("2d");
      const w = canvasEl.value.offsetWidth;
      const h = canvasEl.value.offsetHeight;
      if (!ctx) {
        return;
      }
      let img = await awaitLoadImg(logo.value);
      const height = (logoOpts.width * img.height) / img.width;
      const x = (w - logoOpts.width) / 2;
      const y = (h - height) / 2;

      const temSrc = canvasEl.value.toDataURL();
      const temImg = await awaitLoadImg(temSrc);
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(temImg, 0, 0, w, h);

      const src = await drawRoundedImg(logo.value, logoOpts.width, height);
      img = await awaitLoadImg(src);

      ctx.drawImage(img, x, y, logoOpts.width, height);
    }

    // 下载二维码
    async function downCanvas() {
      if (!canvasEl.value) {
        return;
      }
      const imgURL = canvasEl.value.toDataURL("image/png");
      downLoadBase64File(imgURL, `qrcode-${randomString(10)}.png`);
    }

    // 上传logo
    async function uploadImage({ file }: UploadFileInfo) {
      if (!file) return;
      const url = await fileToBase64(file).then(v => v as string);
      await addLogo(url);
      return false;
    }

    onActivated(() => {
      iptEl.value?.focus();
    });

    return () => (
      <div>
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
                    <div class="d-flex direction-column">
                      <NButton
                        block
                        class="mar-b-3-item"
                        onClick={() => {
                          logoDrawer.value = true;
                          getLogoList();
                        }}
                      >
                        {{
                          icon() {
                            return (
                              <NIcon>
                                <UploadOutlined />
                              </NIcon>
                            );
                          },
                          default() {
                            return "上传logo";
                          },
                        }}
                      </NButton>
                      <NButton
                        block
                        size="large"
                        type="primary"
                        class="mar-b-3-item"
                        onClick={() => {
                          downCanvas();
                        }}
                      >
                        下载
                      </NButton>
                    </div>
                  );
                },
              }}
            </NCard>
          ) : null}
        </div>
        <NDrawer to="body" v-model={[logoDrawer.value, "show"]} placement="right" closeOnEsc resizable defaultWidth={500}>
          <NDrawerContent title="上传logo" closable>
            <>
              <NUpload accept="image/*" onBeforeUpload={e => uploadImage(e.file)} fileList={[]} class="mar-b-5-item full-width">
                <NButton size="large" block class="full-width">
                  {{
                    icon() {
                      return (
                        <NIcon>
                          <UploadFileOutlined />
                        </NIcon>
                      );
                    },
                    default() {
                      return "上传";
                    },
                  }}
                </NButton>
              </NUpload>
              {logoList.value.length ? (
                <div class="d-flex wrap">
                  {logoList.value.map(item => (
                    <NCheckbox
                      key={item.id}
                      value={item.url}
                      onUpdateChecked={checked => {
                        logo.value = checked ? item.url : "";
                        makeQrcode();
                        logoDrawer.value = false;
                      }}
                      checked={logo.value === item.url}
                    >
                      <div class="logo-box">
                        <img src={item.url} class="object-cover full-width full-height" />
                        <NButton
                          class="logo-delete-btn"
                          tertiary
                          type="error"
                          size="small"
                          onClick={e => {
                            e.stopPropagation();
                            dialog.warning({
                              title: "删除确认",
                              content: "确认要删除此logo？",
                              positiveText: "确认",
                              negativeText: "取消",
                              onPositiveClick() {
                                return deleteLogo(item.id);
                              },
                              maskClosable: false,
                            });
                          }}
                        >
                          {{
                            icon() {
                              return (
                                <NIcon>
                                  <DeleteOutlined />
                                </NIcon>
                              );
                            },
                          }}
                        </NButton>
                      </div>
                    </NCheckbox>
                  ))}
                </div>
              ) : null}
            </>
          </NDrawerContent>
        </NDrawer>
      </div>
    );
  },
});
