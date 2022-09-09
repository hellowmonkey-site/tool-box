import { random } from "@/helper";
import { UploadFileOutlined } from "@vicons/material";
import { NAlert, NButton, NCheckbox, NIcon, NText, NUpload, NUploadDragger, UploadFileInfo } from "naive-ui";
import { defineComponent, ref } from "vue";
import successImg from "@/static/image/success.png";
import { message } from "@/service/common";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    const fileList = ref<UploadFileInfo[]>([]);
    const saveDirectory = ref("");
    const checkOpen = ref(true);
    let timer: NodeJS.Timeout;

    async function uploadImage({ file }: UploadFileInfo) {
      if (!file) return;
      const init: UploadFileInfo = { id: file.path, name: file.name, status: "pending", percentage: 0, file };
      if (fileList.value.some(v => v.id === init.id)) {
        return;
      }
      fileList.value.push(init);
      if (!saveDirectory.value) {
        saveDirectory.value = file.path.replace(file.name, "");
      }
      clearTimeout(timer);
      await new Promise(resolve => {
        timer = setTimeout(resolve, 100);
      });
      const list = fileList.value.filter(v => v.status === "pending");
      console.log("%c [ list ]-32", "font-size:13px; background:pink; color:#bf2c9f;", list);
      await Promise.all(
        list
          .map(v => v.file)
          .map(file => {
            const index = fileList.value.findIndex(v => v.id === file!.path);
            const item = fileList.value[index];
            console.log("%c [ item ]-39", "font-size:13px; background:pink; color:#bf2c9f;", item);
            fileList.value.splice(index, 1, { ...item, status: "uploading" });
            const t = setInterval(() => {
              const li = fileList.value[index];
              const percentage = Math.min(99, li.percentage! + random(10, 300) / 100);
              fileList.value.splice(index, 1, { ...li, percentage, status: "uploading" });
            }, 100);
            return electronAPI
              .compressImage(file!.path, saveDirectory.value)
              .then(() => {
                fileList.value.splice(index, 1, { ...item, status: "finished", thumbnailUrl: successImg, file: undefined });
              })
              .catch(e => {
                fileList.value.splice(index, 1, { ...item, status: "error" });
                message.error(`${item.name}压缩失败`);
              })
              .finally(() => {
                clearInterval(t);
              });
          })
      );
      message.success("压缩成功");
      if (checkOpen.value && saveDirectory.value) {
        electronAPI.openDirectory(saveDirectory.value);
      }
    }

    return () => (
      <>
        <NAlert type="info" class="mar-b-5-item" showIcon title={`图片压缩后保存在：${saveDirectory.value || "原位置"}`}>
          <div class="d-flex justify-end">
            <NButton
              type="primary"
              class="mar-r-4-item"
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
            {saveDirectory.value ? (
              <NButton
                size="small"
                class="mar-r-4-item"
                type="primary"
                ghost
                onClick={() => {
                  electronAPI.openDirectory(saveDirectory.value);
                }}
              >
                打开位置
              </NButton>
            ) : null}
          </div>
        </NAlert>
        {saveDirectory.value ? (
          <div class="d-flex justify-end mar-b-1-item">
            <NCheckbox
              checked={checkOpen.value}
              onUpdateChecked={e => {
                checkOpen.value = e;
              }}
            >
              上传完成后自动打开位置
            </NCheckbox>
          </div>
        ) : null}
        <NUpload
          multiple
          directoryDnd
          showCancelButton={false}
          showDownloadButton={false}
          showRemoveButton={false}
          showRetryButton={false}
          showPreviewButton={false}
          listType="image"
          onBeforeUpload={e => uploadImage(e.file)}
          // onUpdate:fileList={fileList => uploadImage(fileList)}
          onUpdate:fileList={e => {
            console.log(e);
          }}
          fileList={fileList.value}
          class="mar-b-2-item"
        >
          <NUploadDragger>
            <div class="d-flex direction-column align-items-center justify-center pad-5">
              <NIcon size={60} class="mar-b-5-item">
                <UploadFileOutlined />
              </NIcon>
              <NText>点击或者拖动文件到该区域来上传</NText>
            </div>
          </NUploadDragger>
        </NUpload>
      </>
    );
  },
});
