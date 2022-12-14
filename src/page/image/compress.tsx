import { random } from "@/helper";
import { UploadFileOutlined } from "@vicons/material";
import { NAlert, NButton, NCard, NCheckbox, NIcon, NInput, NProgress, NText, NUpload, NUploadDragger, UploadFileInfo } from "naive-ui";
import { defineComponent, ref } from "vue";
import { loadingProgressBar, message } from "@/service/common";
import config from "@/config";

type UploadFile = UploadFileInfo & {
  fileSize: number;
  targetSize: number;
};

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    const fileList = ref<UploadFile[]>([]);
    const saveDirectory = ref("");
    const checkOpen = ref(true);
    const checkResize = ref(false);
    const width = ref<string | null>(null);
    let timer: NodeJS.Timeout;

    async function uploadImage({ file }: UploadFileInfo) {
      if (!file) return;
      const init: UploadFile = {
        id: file.path,
        name: file.name,
        status: "pending",
        percentage: 0,
        file,
        fileSize: file.size,
        targetSize: file.size,
      };
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
      const hide = loadingProgressBar(4000);
      try {
        await Promise.all(
          list
            .map(v => v.file)
            .map(file => {
              const index = fileList.value.findIndex(v => v.id === file!.path);
              const item = fileList.value[index];
              fileList.value.splice(index, 1, { ...item, status: "uploading" });
              const t = setInterval(() => {
                const li = fileList.value[index];
                const percentage = Math.min(99, li.percentage! + random(10, 300) / 100);
                fileList.value.splice(index, 1, { ...li, percentage: Number(percentage.toFixed(2)), status: "uploading" });
              }, 100);
              return electronAPI
                .compressImage(file!.path, saveDirectory.value, checkResize.value && width.value ? Number(width.value) : undefined)
                .then(e => {
                  fileList.value.splice(index, 1, { ...item, status: "finished", file: undefined, percentage: 100, ...e });
                })
                .catch(e => {
                  fileList.value.splice(index, 1);
                  message.error(`${item.name}????????????`);
                  return Promise.reject(new Error(`${item.name}????????????`));
                })
                .finally(() => {
                  clearInterval(t);
                });
            })
        );
        message.success("??????????????????");
        if (config.isElectron) {
          electronAPI.notification("??????????????????", list.map(v => v.name).join(","));
        }
        if (checkOpen.value && saveDirectory.value) {
          electronAPI.openDirectory(saveDirectory.value);
        }
      } finally {
        hide();
      }
    }

    return () => (
      <div>
        <NAlert type="info" class="mar-b-5-item" showIcon title={`???????????????????????????${saveDirectory.value || "?????????"}`}>
          <div class="d-flex justify-end">
            <NButton
              type="primary"
              class="mar-r-4-item"
              onClick={() => {
                electronAPI.selectDirectory("??????????????????????????????").then(data => {
                  if (data) {
                    saveDirectory.value = data;
                  }
                });
              }}
              size="small"
            >
              ????????????
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
                ????????????
              </NButton>
            ) : null}
          </div>
        </NAlert>
        <div class="d-flex justify-between mar-b-2-item">
          <div class="d-flex align-items-center justify-start flex-item-extend">
            <NCheckbox
              checked={checkResize.value}
              onUpdateChecked={e => (checkResize.value = e)}
              class="mar-r-2-item"
              label="??????????????????"
            ></NCheckbox>
            {checkResize.value ? (
              <NInput
                placeholder="???????????????????????????"
                style="width: 150px"
                value={width.value}
                onUpdateValue={e => {
                  if (Number(e)) {
                    width.value = e;
                  }
                }}
              />
            ) : null}
          </div>
          {saveDirectory.value ? (
            <NCheckbox
              checked={checkOpen.value}
              onUpdateChecked={e => {
                checkOpen.value = e;
              }}
            >
              ?????????????????????????????????
            </NCheckbox>
          ) : null}
        </div>
        <NUpload
          multiple
          directoryDnd
          showCancelButton={false}
          showDownloadButton={false}
          showRemoveButton={false}
          showRetryButton={false}
          showPreviewButton={false}
          onBeforeUpload={e => uploadImage(e.file)}
          fileList={[]}
          class="mar-b-5-item"
        >
          <NUploadDragger>
            <div class="d-flex direction-column align-items-center justify-center pad-5">
              <NIcon size={60} class="mar-b-5-item">
                <UploadFileOutlined />
              </NIcon>
              <NText>???????????????????????????????????????????????????</NText>
            </div>
          </NUploadDragger>
        </NUpload>
        <div class="upload-list">
          {fileList.value.map(item => (
            <NCard class="mar-b-3-item">
              <div class="d-flex justify-between align-items-center" key={item.id}>
                <div class="d-flex align-items-center justify-between mar-r-4-item" style="width: 440px">
                  <NText class="text-elip mar-r-4-item" style="width: 320px">
                    {item.name}
                  </NText>
                  <NText type="primary" class="mar-r-4-item">
                    {(item.fileSize / 1024).toFixed(2)}kb
                  </NText>
                </div>
                <NProgress
                  class="mar-r-4-item flex-item-extend"
                  type="line"
                  indicator-placement="inside"
                  processing={item.status === "uploading"}
                  status={item.status === "finished" ? "success" : "default"}
                  percentage={item.percentage as number}
                />
                <div class="d-flex align-items-center justify-between mar-r-4-item" style="width: 160px">
                  {item.status === "finished" ? (
                    <>
                      <NText type="primary" class="mar-r-4-item">
                        {(item.targetSize / 1024).toFixed(2)}kb
                      </NText>
                      <NText>-{(((item.fileSize - item.targetSize) / item.fileSize) * 100).toFixed(2)}%</NText>
                    </>
                  ) : null}
                </div>
              </div>
            </NCard>
          ))}
        </div>
      </div>
    );
  },
});
