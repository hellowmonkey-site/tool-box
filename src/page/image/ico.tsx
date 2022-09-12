import { random } from "@/helper";
import { loadingProgressBar, message } from "@/service/common";
import { UploadFileOutlined } from "@vicons/material";
import { NIcon, NRadio, NRadioGroup, NText, NUpload, NUploadDragger, UploadFileInfo } from "naive-ui";
import { defineComponent, ref } from "vue";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    const fileList = ref<UploadFileInfo[]>([]);
    const icoSizes = ref<number[]>([16, 24, 32, 48, 64, 128, 256]);
    const icoSize = ref<number>(256);

    function uploadImage({ file }: UploadFileInfo) {
      if (!file) return;
      const item: UploadFileInfo = { id: file.name, name: file.name, status: "uploading", file };
      fileList.value.push(item);
      const index = fileList.value.length - 1;
      const timer = setInterval(() => {
        const li: UploadFileInfo = fileList.value[index];
        const percentage = Math.max(99, li.percentage! + random(10, 300) / 100);
        fileList.value.splice(index, 1, { ...li, percentage });
      }, 100);
      const hide = loadingProgressBar();
      electronAPI
        .pngToIco(file.path, icoSize.value)
        .then(data => {
          fileList.value.splice(index, 1, { ...item, status: "finished" });
          message.success("转化成功，请检查文件目录的favicon.ico文件");
        })
        .catch(e => {
          fileList.value.splice(index, 1, { ...item, status: "error" });
          message.error(`${item.name}转化失败`);
        })
        .finally(() => {
          clearInterval(timer);
          hide();
        });
      return false;
    }

    return () => (
      <>
        <div class="d-flex justify-end mar-b-2-item align-items-center">
          <NText>选择尺寸：</NText>
          <NRadioGroup v-model={[icoSize.value, "value"]}>
            {icoSizes.value.map(size => (
              <NRadio value={size} key={size}>
                {size}
              </NRadio>
            ))}
          </NRadioGroup>
        </div>
        <NUpload
          accept="image/png"
          onBeforeUpload={e => uploadImage(e.file)}
          fileList={fileList.value}
          listType="image"
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
              <NText>点击或者拖动.png文件到该区域来进行转换</NText>
            </div>
          </NUploadDragger>
        </NUpload>
      </>
    );
  },
});
