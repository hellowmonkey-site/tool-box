import { NButton, NCard, NCheckbox, NDrawer, NDrawerContent, NIcon, NInput, NUpload, UploadFileInfo } from "naive-ui";
import { defineComponent, onActivated, ref } from "vue";
import { awaitLoadImg, awaitNextTick, downLoad, fileToBase64, sleep } from "@/helper";
import qrcode from "qrcode";
import { DeleteOutlined, UploadFileOutlined } from "@vicons/material";
import { addLogo, deleteLogo, getLogoList, logoList } from "@/service/qrcode";
import config from "@/config";

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

    // 生成二维码
    async function makeQrcode() {
      if (!text.value) {
        return;
      }
      showPreview.value = true;
      await awaitNextTick();
      await qrcode.toCanvas(canvasEl.value, text.value, { width: 260, margin: 2 });
    }

    // 下载二维码
    async function downCanvas() {
      if (!canvasEl.value) {
        return;
      }
      const imgURL = canvasEl.value.toDataURL("image/png");
      downLoad(imgURL, "qrcode.png");
    }

    // 上传logo
    async function uploadImage({ file }: UploadFileInfo) {
      if (!file) return;
      const url = await fileToBase64(file).then(v => v as string);
      await addLogo(url);
      return false;
    }

    // 渲染logo
    async function renderLogo() {
      if (!canvasEl.value) {
        return;
      }
      if (!logo.value) {
        makeQrcode();
        return;
      }
      const img = await awaitLoadImg(logo.value);
      await makeQrcode();
      if (!config.isElectron) {
        await sleep(1000);
      }
      const width = 50;
      const ctx = canvasEl.value.getContext("2d");
      const w = canvasEl.value.offsetWidth;
      const h = canvasEl.value.offsetHeight;
      if (!ctx) {
        return;
      }
      const height = (width * img.height) / img.width;
      ctx.drawImage(img, (w - width) / 2, (h - height) / 2, width, height);
    }

    onActivated(() => {
      iptEl.value?.focus();
    });

    return () => (
      <>
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
                        上传logo
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
            <div class="d-flex direction-column">
              <NUpload accept="image/*" onBeforeUpload={e => uploadImage(e.file)} fileList={[]} class="mar-b-5-item">
                <NButton size="large" block>
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
                        renderLogo();
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
                            deleteLogo(item.id);
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
            </div>
          </NDrawerContent>
        </NDrawer>
      </>
    );
  },
});
