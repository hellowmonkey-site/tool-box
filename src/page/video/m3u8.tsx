// import fly from "flyio";
import config from "@/config";
import { downLoad, getFullUrl } from "@/helper";
import ajax from "@/helper/ajax";
import { message } from "@/service/common";
import { DownloadStatus, IM3u8Item, ITsItem } from "@/service/video";
import { NAlert, NButton, NCard, NInput, NInputGroup, NInputGroupLabel, NProgress } from "naive-ui";
import { computed, defineComponent, reactive, ref } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    const route = useRoute();
    const form = reactive({
      name: "",
      filePath: "",
      url: (route.query.url as string) || "",
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
      loading.value = true;
      try {
        const data = await ajax(form.url);
        data.split(/\s/).forEach(item => {
          if (/\.ts(\?.+)?$/.test(item)) {
            const arr = form.url.split("/");
            const baseUrl = form.url.replace(arr[arr.length - 1], "");
            const src = getFullUrl(baseUrl, item);
            tsList.value.push({
              status: DownloadStatus.WAITING,
              name: form.name,
              m3u8Src: form.url,
              filePath: form.filePath,
              src,
              file: undefined,
            });
          }
        });
        for (let i = 0; i < 30; i++) {
          downloadTs();
        }
      } finally {
        loading.value = false;
      }
    }

    // 批量下载ts
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
    function downloadFile(m3u8: IM3u8Item) {
      const fileDataList = tsList.value
        .filter(v => v.m3u8Src === m3u8.src)
        .map(v => v.file!)
        .filter(v => !!v);
      const fileBlob = new Blob(fileDataList, { type: "video/MP2T" });
      const url = URL.createObjectURL(fileBlob);
      downLoad(url, `D:\\Soft\\${m3u8.name}.mp4`);
    }

    return () => (
      <div>
        <NCard class="mar-b-5-item">
          <div class="mar-b-3-item">
            <NInputGroup>
              <NInputGroupLabel size="large">视频地址</NInputGroupLabel>
              <NInput size="large" placeholder="请输入m3u8地址" v-model={[form.url, "value"]} class="mar-b-3-item" />
            </NInputGroup>
          </div>
          <div class="mar-b-3-item">
            <NInputGroup>
              <NInputGroupLabel size="large">文件名称</NInputGroupLabel>
              <NInput size="large" placeholder="请输入保存的文件名称" v-model={[form.name, "value"]} class="mar-b-3-item" />
            </NInputGroup>
          </div>
          <NButton
            block
            size="large"
            type="primary"
            loading={loading.value}
            onClick={() => {
              downloadM3u8();
            }}
          >
            解析
          </NButton>
        </NCard>
        {config.isElectron ? (
          <NAlert type="info" class="mar-b-5-item" showIcon title={`视频下载后保存在：${form.filePath || "下载后询问"}`}>
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
        {m3u8List.value.map(item => (
          <NCard size="small" class="mar-b-3-item">
            {{
              default() {
                return (
                  <div class="d-flex align-items-center justify-between">
                    <div class="mar-r-3-item d-flex align-items-center">
                      {item.name ? <span class="mar-r-5-item space-nowrap">{item.name}</span> : null}
                      <span class="mar-r-5-item font-small flex-item-extend">{item.src}</span>
                    </div>
                    <div class="flex-item-extend d-flex justify-end">
                      {item.status === DownloadStatus.DOWNLOADING ? null : item.status === DownloadStatus.ERROR ? (
                        <NButton
                          onClick={() => {
                            tsList.value
                              .filter(v => v.m3u8Src === item.src && v.status === DownloadStatus.ERROR)
                              .forEach(item => {
                                item.status = DownloadStatus.WAITING;
                              });
                          }}
                        >
                          重试
                        </NButton>
                      ) : item.status === DownloadStatus.FINISHED ? (
                        <NButton
                          onClick={() => {
                            downloadFile(item);
                          }}
                        >
                          下载文件
                        </NButton>
                      ) : (
                        <span>等待下载</span>
                      )}
                    </div>
                  </div>
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
