import config from "@/config";
import { downLoad, getFullUrl } from "@/helper";
import ajax from "@/helper/ajax";
import { dialog, message } from "@/service/common";
import { DownloadStatus, downloadStatusList, IM3u8Item, ITsItem } from "@/service/video";
import { NAlert, NButton, NCard, NInput, NInputGroup, NInputGroupLabel, NProgress, NTag, NText } from "naive-ui";
import { computed, defineComponent, onActivated, reactive, ref } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    const route = useRoute();
    const iptEl = ref<HTMLInputElement>();
    const form = reactive({
      name: "",
      filePath: "",
      url: "",
    });
    const loading = ref(false);
    const tsList = ref<ITsItem[]>([]);

    const m3u8List = computed<IM3u8Item[]>(() => {
      const arr = [...new Set(tsList.value.map(v => v.m3u8Src))];
      const data: IM3u8Item[] = arr.map(m3u8Src => {
        const list = tsList.value.filter(v => v.m3u8Src === m3u8Src)!;
        const [item] = list;
        let status = item.status;
        const total = list.length;
        const doneNum = list.filter(li => li.status === DownloadStatus.FINISHED).length;
        const percentage = Number((doneNum / total).toFixed(2)) * 100;
        if (tsList.value.some(t => t.status === DownloadStatus.DOWNLOADING)) {
          status = DownloadStatus.DOWNLOADING;
        } else if (tsList.value.some(t => t.status === DownloadStatus.ERROR)) {
          status = DownloadStatus.ERROR;
        } else if (percentage >= 100) {
          status = DownloadStatus.FINISHED;
        }
        return {
          name: item.name,
          src: m3u8Src,
          filePath: item.filePath,
          status,
          percentage,
          total,
          doneNum,
        };
      });
      return data;
    });

    async function downloadM3u8() {
      if (!form.url) {
        message.error("请先输入m3u8地址");
        return;
      }
      if (tsList.value.some(v => v.m3u8Src === form.url)) {
        message.error("此链接已被处理过");
        return;
      }
      const { origin } = new URL(form.url);
      loading.value = true;
      try {
        let data = await ajax(form.url);
        const newUrl = data.split(/\s/).find(item => /\.m3u8(\?.+)?$/i.test(item));
        if (newUrl) {
          data = await ajax(getFullUrl(origin, newUrl));
        }

        const tempArr: ITsItem[] = [];
        data.split(/\s/).forEach(item => {
          if (/\.ts(\?.+)?$/i.test(item)) {
            const src = getFullUrl(origin, item);
            tempArr.push({
              status: DownloadStatus.WAITING,
              name: form.name,
              m3u8Src: form.url,
              filePath: form.filePath,
              src,
              file: undefined,
            });
          }
        });
        if (!tempArr.length) {
          message.error("未解析到相关内容");
          return;
        }
        tsList.value.push(...tempArr);

        // 批量下载
        downloadTsList();

        form.name = "";
        form.url = "";
      } catch (e) {
        message.error("解析错误");
      } finally {
        loading.value = false;
      }
    }

    // 批量下载ts
    function downloadTsList() {
      for (let i = 0; i < 30 - tsList.value.filter(v => v.status === DownloadStatus.DOWNLOADING).length; i++) {
        downloadTs();
      }
    }
    function downloadTs() {
      const index = tsList.value.findIndex(v => v.status === DownloadStatus.WAITING);
      if (index === -1) {
        return;
      }
      tsList.value[index].status = DownloadStatus.DOWNLOADING;
      ajax<Buffer>(tsList.value[index].src, "arraybuffer")
        .then(data => {
          tsList.value[index].status = DownloadStatus.FINISHED;
          tsList.value[index].file = data;
          const m3u8 = m3u8List.value.find(v => v.src === tsList.value[index].m3u8Src);
          if (m3u8?.status === DownloadStatus.FINISHED) {
            downloadFile(m3u8);
          }
        })
        .catch(() => {
          tsList.value[index].status = DownloadStatus.ERROR;
        })
        .finally(() => {
          downloadTs();
        });
    }

    // 文件下载
    async function downloadFile(m3u8: IM3u8Item) {
      const fileDataList = tsList.value
        .filter(v => v.m3u8Src === m3u8.src)
        .map(v => v.file!)
        .filter(v => !!v);
      const fileBlob = new Blob(fileDataList, { type: "video/mp4" });
      const url = URL.createObjectURL(fileBlob);
      if (config.isElectron && m3u8.filePath) {
        const buf = await new Promise<NodeJS.ArrayBufferView>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsArrayBuffer(fileBlob);
          reader.onload = () => {
            if (reader.result && typeof reader.result !== "string") {
              resolve(new Uint8Array(reader.result));
            }
          };
          reader.onerror = error => reject(error);
        });
        const filePath = `${m3u8.filePath}/${m3u8.name}.mp4`;
        await electronAPI.writeFile(filePath, buf);
        message.success(`${filePath},下载成功!`);
      } else {
        downLoad(url, `${m3u8.name}.mp4`);
      }
    }

    // 修改文件名称
    function showFileNameDialog() {
      const iptEl = ref<HTMLInputElement>();
      const fileName = ref("");
      return new Promise<string>((resolve, reject) => {
        dialog.warning({
          title: "请输入文件名称",
          content() {
            return <NInput v-model={[fileName.value, "value"]} ref={iptEl} placeholder="请输入文件名称" />;
          },
          negativeText: "取消",
          positiveText: "确认",
          onPositiveClick() {
            resolve(fileName.value);
          },
          onNegativeClick(e) {
            reject(e);
          },
          onAfterEnter() {
            iptEl.value?.focus();
          },
        });
      });
    }

    onActivated(() => {
      iptEl.value?.focus();

      const { url } = route.query;
      if (url) {
        form.url = url as string;
      }
    });

    return () => (
      <div>
        <NCard class="mar-b-5-item">
          <div class="mar-b-4-item">
            <NInputGroup>
              <NInputGroupLabel size="large">视频地址</NInputGroupLabel>
              <NInput ref={iptEl} size="large" placeholder="请输入m3u8地址" v-model={[form.url, "value"]} />
            </NInputGroup>
          </div>
          <div class="mar-b-4-item">
            <NInputGroup>
              <NInputGroupLabel size="large">文件名称</NInputGroupLabel>
              <NInput
                size="large"
                placeholder="请输入保存的文件名称"
                onUpdateValue={e => {
                  tsList.value
                    .filter(v => v.m3u8Src === form.url)
                    .forEach(item => {
                      item.name = e;
                    });
                }}
                v-model={[form.name, "value"]}
              />
            </NInputGroup>
          </div>
          <NButton
            block
            class="mar-b-4-item"
            size="large"
            type="primary"
            loading={loading.value}
            onClick={() => {
              downloadM3u8();
            }}
          >
            解析
          </NButton>
          {config.isElectron ? (
            <NAlert type="info" class="mar-b-4-item" showIcon title={`视频下载后保存在：${form.filePath || "下载后询问"}`}>
              <div class="d-flex justify-end">
                <NButton
                  type="primary"
                  class="mar-r-4-item"
                  onClick={() => {
                    electronAPI.selectDirectory("视频下载后保存的位置").then(data => {
                      if (data) {
                        form.filePath = data;
                      }
                    });
                  }}
                  size="small"
                >
                  选择位置
                </NButton>
              </div>
            </NAlert>
          ) : null}
        </NCard>

        {m3u8List.value.map(item => (
          <NCard size="small" class="mar-b-3-item">
            {{
              default() {
                return (
                  <>
                    <div class="d-flex align-items-center justify-between mar-b-3-item">
                      <div class="mar-r-3-item d-flex align-items-center">
                        {(() => {
                          const data = downloadStatusList.find(v => v.value === item.status);
                          if (data) {
                            return (
                              <NTag class="mar-r-3-item" type={data.color}>
                                {data.text}
                              </NTag>
                            );
                          }
                          return null;
                        })()}
                        {item.name ? <span class="mar-r-2-item space-nowrap">{item.name}</span> : null}
                        {item.filePath ? (
                          <NText class="font-small mar-r-5-item" depth="3">
                            ({item.filePath})
                          </NText>
                        ) : null}
                      </div>
                      <div class="flex-item-extend d-flex justify-end">
                        {item.status === DownloadStatus.ERROR ? (
                          <NButton
                            class="mar-r-3-item"
                            onClick={() => {
                              tsList.value
                                .filter(v => v.m3u8Src === item.src && v.status === DownloadStatus.ERROR)
                                .forEach(item => {
                                  item.status = DownloadStatus.WAITING;
                                });
                              downloadTsList();
                            }}
                          >
                            重试下载
                          </NButton>
                        ) : null}
                        {item.status === DownloadStatus.FINISHED ? (
                          <NButton
                            class="mar-r-3-item"
                            onClick={() => {
                              downloadFile(item);
                            }}
                          >
                            保存视频
                          </NButton>
                        ) : null}
                        {config.isElectron ? (
                          <>
                            {item.filePath && item.status === DownloadStatus.FINISHED ? (
                              <NButton
                                class="mar-r-3-item"
                                onClick={() => {
                                  electronAPI.openDirectory(item.filePath);
                                }}
                              >
                                打开视频位置
                              </NButton>
                            ) : null}
                            <NButton
                              class="mar-r-3-item"
                              onClick={() => {
                                electronAPI.selectDirectory("视频下载后保存的位置").then(data => {
                                  if (data) {
                                    tsList.value
                                      .filter(v => v.m3u8Src === item.src)
                                      .forEach(item => {
                                        item.filePath = data;
                                      });
                                  }
                                });
                              }}
                            >
                              存放位置
                            </NButton>
                          </>
                        ) : null}
                        <NButton
                          class="mar-r-3-item"
                          onClick={() => {
                            showFileNameDialog().then(name => {
                              if (name) {
                                tsList.value
                                  .filter(v => v.m3u8Src === item.src)
                                  .forEach(item => {
                                    item.name = name;
                                  });
                              }
                            });
                          }}
                        >
                          文件名称
                        </NButton>
                      </div>
                    </div>
                    <div class="mar-b-3-item">
                      <NText class="font-small" depth="3">
                        {item.src}
                      </NText>
                    </div>
                  </>
                );
              },
              footer() {
                return (
                  <div class="d-flex align-items-center">
                    <NProgress
                      type="line"
                      indicator-placement="inside"
                      percentage={item.percentage}
                      processing={item.status === DownloadStatus.DOWNLOADING}
                      status={
                        item.status === DownloadStatus.FINISHED ? "success" : item.status === DownloadStatus.ERROR ? "error" : "default"
                      }
                      class="mar-r-3-item flex-item-extend"
                    />
                    <span class="space-nowrap d-flex align-items-center">
                      <span class="mar-r-1-item">{item.doneNum}</span>
                      <span class="font-small mar-r-1-item">/</span>
                      <span class="font-small mar-r-1-item">{item.total}</span>
                    </span>
                  </div>
                );
              },
            }}
          </NCard>
        ))}
      </div>
    );
  },
});
