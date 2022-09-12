import { copyText } from "@/helper";
import { message } from "@/service/common";
import { NButton, NInput, NInputGroup, NInputGroupLabel, NSelect, NTooltip } from "naive-ui";
import { Type } from "naive-ui/es/button/src/interface";
import { defineComponent, onActivated, ref } from "vue";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    const circuits: { label: string; value: string }[] = [
      {
        label: "vip解析",
        value: "http://www.ckmov.vip/api.php?url=__URL__",
      },
      {
        label: "云解析",
        value: "http://jx.aidouer.net/?url=__URL__",
      },
    ];
    const videoList: { name: string; url: string; type: Type }[] = [
      {
        name: "爱奇艺",
        url: "https://www.iqiyi.com/",
        type: "primary",
      },
      {
        name: "腾讯视频",
        url: "https://v.qq.com/",
        type: "info",
      },
      {
        name: "优酷视频",
        url: "https://youku.com/",
        type: "success",
      },
      {
        name: "芒果TV",
        url: "https://www.mgtv.com/",
        type: "warning",
      },
      {
        name: "哔哩哔哩",
        url: "https://www.bilibili.com/",
        type: "error",
      },
    ];
    const circuit = ref<string>(circuits[0].value);
    const url = ref<string>("");
    const iframeSrc = ref<string>("");
    const iptEl = ref<HTMLInputElement>();

    function handleParse() {
      if (!url.value) {
        message.error("请先输入播放地址");
        return;
      }
      iframeSrc.value = circuit.value.replace("__URL__", url.value);
    }

    onActivated(() => {
      iptEl.value?.focus();
    });

    return () => (
      <div class="content">
        <div class="mar-b-4-item">
          <NInputGroup>
            <NInputGroupLabel size="large">线路节点</NInputGroupLabel>
            <NSelect
              size="large"
              onUpdateValue={() => {
                handleParse();
              }}
              options={circuits}
              v-model={[circuit.value, "value"]}
            />
          </NInputGroup>
        </div>
        <div class="mar-b-5-item">
          <NInputGroup>
            <NInputGroupLabel size="large">播放地址</NInputGroupLabel>
            <NInput
              size="large"
              v-model={[url.value, "value"]}
              onKeydown={e => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleParse();
                }
              }}
              ref={iptEl}
              placeholder="请输入播放地址"
            />
          </NInputGroup>
        </div>
        <div class="mar-b-7-item d-flex direction-column">
          {url.value ? (
            <NButton
              block
              size="large"
              type="primary"
              onClick={() => {
                handleParse();
              }}
              class="mar-b-3-item"
            >
              解析
            </NButton>
          ) : null}
          <div class="d-flex justify-center align-items-center">
            {videoList.map(item => (
              <NTooltip>
                {{
                  trigger: () => (
                    <NButton
                      class="mar-r-2-item"
                      strong
                      secondary
                      type={item.type}
                      onClick={() => {
                        copyText(item.url);
                        message.success("复制成功");
                      }}
                    >
                      {item.name}
                    </NButton>
                  ),
                  default: () => item.url,
                }}
              </NTooltip>
            ))}
          </div>
        </div>
        {iframeSrc.value ? (
          <div style="background-color: #000; margin-bottom: 100px">
            <iframe src={iframeSrc.value} frameborder="0" class="full-width" style="height: calc(100vh - 300px)" scrolling="no"></iframe>
          </div>
        ) : null}
      </div>
    );
  },
});
