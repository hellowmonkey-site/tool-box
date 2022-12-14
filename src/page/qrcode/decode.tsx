import { copyText, fileToBase64 } from "@/helper";
import { UploadFileOutlined } from "@vicons/material";
import { NIcon, NText, NUpload, NUploadDragger, UploadFileInfo } from "naive-ui";
import { defineComponent } from "vue";
import qrcodeDecoder from "qrcode-decoder";
import { dialog, message } from "@/service/common";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
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
          copyText(data).then(() => {
            message.success("复制成功");
          });
        },
      });
    }

    return () => (
      <div>
        <NUpload
          accept="image/*"
          onBeforeUpload={e => uploadImage(e.file)}
          fileList={[]}
          listType="image"
          showDownloadButton
          class="mar-b-5-item"
        >
          <NUploadDragger>
            <div class="d-flex direction-column align-items-center justify-center pad-5">
              <NIcon size={60} class="mar-b-5-item">
                <UploadFileOutlined />
              </NIcon>
              <NText>点击或者拖动图片到该区域来上传</NText>
            </div>
          </NUploadDragger>
        </NUpload>
      </div>
    );
  },
});
