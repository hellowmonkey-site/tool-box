import { defineComponent, ref } from "vue";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import { NButton, NIcon, NInput, NInputGroup, NInputGroupLabel, NText, NUpload, NUploadDragger, UploadFileInfo } from "naive-ui";
import { UploadFileOutlined } from "@vicons/material";
import { downLoad, fileToBase64 } from "@/helper";
import config from "@/config";
import { dialog, message } from "@/service/common";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    const orgSrc = ref<string>("");
    const orgImg = ref<HTMLImageElement>();
    const loading = ref(false);
    let cropper: Cropper;
    let timer: NodeJS.Timeout;

    async function uploadImage({ file }: UploadFileInfo) {
      if (!file) return;
      orgSrc.value = await fileToBase64(file).then(v => v as string);
      cropper?.destroy();
      clearTimeout(timer);
      timer = setTimeout(() => {
        cropper = new Cropper(orgImg.value!, {
          viewMode: 1,
          dragMode: "crop",
          initialAspectRatio: 1,
          aspectRatio: 1,
          preview: ".preview",
          zoomOnWheel: true,
        });
      }, 100);
    }

    async function handleClip() {
      const src = cropper
        ?.getCroppedCanvas({
          imageSmoothingQuality: "high",
        })
        .toDataURL("image/png");
      loading.value = true;
      try {
        if (config.isElectron) {
          const { filePath } = await electronAPI.saveBase64File(src);
          await electronAPI.openDirectory(filePath);
          try {
            await electronAPI.notification("成功提示", "下载成功");
          } catch (e) {
            message.success("下载成功");
          }
        } else {
          const iptEl = ref<HTMLInputElement>();
          const fileName = ref("");
          await new Promise((resolve, reject) => {
            dialog.warning({
              title: "请输入文件名称",
              content() {
                return (
                  <NInputGroup>
                    <NInput v-model={[fileName.value, "value"]} ref={iptEl} placeholder="请输入文件名称" />
                    <NInputGroupLabel>.png</NInputGroupLabel>
                  </NInputGroup>
                );
              },
              negativeText: "取消",
              positiveText: "确认",
              onPositiveClick(e) {
                resolve(e);
              },
              onNegativeClick(e) {
                reject(e);
              },
              onAfterEnter() {
                iptEl.value?.focus();
              },
            });
          });
          if (!fileName.value) {
            message.error("请先输入文件名称");
            return;
          }
          downLoad(src, fileName.value);
        }
      } finally {
        loading.value = false;
      }
    }

    return () => (
      <>
        <NUpload
          accept="image/*"
          onBeforeUpload={e => uploadImage(e.file)}
          fileList={[]}
          class="mar-b-5-item"
          showCancelButton={false}
          showDownloadButton={false}
          showRemoveButton={false}
          showRetryButton={false}
          showPreviewButton={false}
        >
          <NUploadDragger>
            <div class="d-flex direction-column align-items-center justify-center pad-5">
              <NIcon size={60} class="mar-b-5-item">
                <UploadFileOutlined />
              </NIcon>
              <NText>点击或者拖动图片到该区域来进行裁剪</NText>
            </div>
          </NUploadDragger>
        </NUpload>
        {orgSrc.value ? (
          <div class="d-flex justify-between">
            <div style="width: calc(100% - 480px)">
              <img src={orgSrc.value} alt="图片裁剪" ref={orgImg} />
            </div>
            <div class="d-flex direction-column">
              <div class="border preview overflow-hidden mar-b-4-item" style="width: 450px; height: 450px"></div>
              <NButton
                block
                type="primary"
                size="large"
                onClick={() => {
                  handleClip();
                }}
                loading={loading.value}
              >
                确认裁切
              </NButton>
            </div>
          </div>
        ) : null}
      </>
    );
  },
});
