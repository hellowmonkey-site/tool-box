import { compressImage } from "@/service/image";
import { UploadFileOutlined } from "@vicons/material";
import { NAlert, NButton, NIcon, NSpin, NText, NUpload, NUploadDragger, UploadFileInfo } from "naive-ui";
import { defineComponent, ref } from "vue";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    const fileList = ref<{ name: string; success: boolean; path?: string }[]>([]);
    const saveDirectory = ref("");

    function uploadImage(list: UploadFileInfo[]) {
      list
        .map(v => v.file)
        .forEach(file => {
          if (file) {
            fileList.value.push({ name: file.name, success: false });
            const index = fileList.value.length - 1;
            electronAPI.compressImage(file.path, saveDirectory.value).then(path => {
              fileList.value.splice(index, 1, { name: file.name, success: true, path });
            });
          }
          // compressImage(file).then(data => {
          //   console.log(data);
          // });
        });
      console.log(list);
    }

    return () => (
      <>
        <NAlert type="info" class="mar-b-5-item" showIcon title={`图片压缩后保存在：${saveDirectory.value || "原位置"}`}>
          <div class="d-flex justify-end">
            <NButton
              type="primary"
              onClick={() => {
                electronAPI.selectDirectory("图片压缩后保存的位置").then(data => {
                  if (data) {
                    saveDirectory.value = data;
                  }
                });
              }}
              size="small"
            >
              选择位置
            </NButton>
          </div>
        </NAlert>
        <NUpload multiple directoryDnd onUpdate:fileList={fileList => uploadImage(fileList)} fileList={[]} class="mar-b-5-item">
          <NUploadDragger>
            <div class="d-flex direction-column align-items-center justify-center pad-5">
              <NIcon size={60} class="mar-b-5-item">
                <UploadFileOutlined />
              </NIcon>
              <NText>点击或者拖动文件到该区域来上传</NText>
            </div>
          </NUploadDragger>
        </NUpload>

        {fileList.value.map(item => (
          <NAlert title={item.name} type={item.success ? "success" : "warning"} class="mar-b-3-item">
            {{
              icon() {
                return item.success ? null : <NSpin size="small" />;
              },
              default() {
                return item.path ? (
                  <div class="d-flex justify-end">
                    <NButton
                      size="small"
                      type="primary"
                      onClick={() => {
                        electronAPI.openDirectory(item.path!);
                      }}
                    >
                      打开文件位置
                    </NButton>
                  </div>
                ) : null;
              },
            }}
          </NAlert>
        ))}
      </>
    );
  },
});
