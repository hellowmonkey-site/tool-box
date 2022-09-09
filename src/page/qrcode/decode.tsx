import { copyText, fileToBase64 } from "@/helper";
import { UploadFileOutlined } from "@vicons/material";
import { NIcon, NText, NUpload, NUploadDragger, UploadFileInfo, useDialog } from "naive-ui";
import { defineComponent } from "vue";
import qrcodeDecoder from "qrcode-decoder";
import { message } from "@/service/common";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    const dialog = useDialog();

    async function uploadImage({ file }: UploadFileInfo) {
      if (!file) {
        return;
      }
      const src = await fileToBase64(file);
      const img = new Image();
      img.src = src as string;
      await new Promise(resolve => {
        img.onload = e => {
          resolve(e);
        };
      });
      const qr = new qrcodeDecoder();
      const { data } = await qr.decodeFromImage(img);
      dialog.success({
        title: "解码成功",
        content: data,
        positiveText: "复制",
        onPositiveClick() {
          copyText(data);
          message.success("复制成功");
        },
      });
    }

    return () => (
      <>
        <NUpload onBeforeUpload={e => uploadImage(e.file)} fileList={[]} listType="image" showDownloadButton class="mar-b-5-item">
          <NUploadDragger>
            <div class="d-flex direction-column align-items-center justify-center pad-5">
              <NIcon size={60} class="mar-b-5-item">
                <UploadFileOutlined />
              </NIcon>
              <NText>点击或者拖动.png文件到该区域来上传</NText>
            </div>
          </NUploadDragger>
        </NUpload>
      </>
    );
  },
});
