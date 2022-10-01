import { openUrl } from "@/helper";
import { isUrl } from "@/helper/validate";
import { message } from "@/service/common";
import { circuits, videoList } from "@/service/video";
import { NButton, NInput, NInputGroup, NInputGroupLabel, NSelect, NTooltip } from "naive-ui";
import { defineComponent, onActivated, onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    const route = useRoute();
    const form = reactive({
      circuit: circuits[0].value,
      url: "",
    });
    const iframeSrc = ref<string>("");
    const iptEl = ref<HTMLInputElement>();

    function handleParse(check = true) {
      if (check) {
        if (!form.url) {
          message.error("请先输入播放地址");
          return;
        }
        if (!isUrl(form.url)) {
          message.error("播放地址输入错误");
          return;
        }
      }
      iframeSrc.value = form.circuit.replace("__URL__", form.url);
    }

    onActivated(() => {
      iptEl.value?.focus();
    });

    onMounted(() => {
      const { url, circuit } = route.query;
      if (url) {
        form.url = url as string;
      }
      if (circuit) {
        form.circuit = circuit as string;
      }
    });

    return () => (
      <div>
        <div class="mar-b-5-item">
          <NInputGroup>
            <NInputGroupLabel size="large">播放地址</NInputGroupLabel>
            <NInput
              size="large"
              v-model={[form.url, "value"]}
              onKeydown={e => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleParse();
                }
              }}
              ref={iptEl}
              placeholder="请输入播放地址，回车解析"
            />
          </NInputGroup>
        </div>
        <div class="mar-b-4-item">
          <NInputGroup>
            <NInputGroupLabel size="large">线路节点</NInputGroupLabel>
            <NSelect
              size="large"
              onUpdateValue={() => {
                handleParse(false);
              }}
              options={circuits}
              v-model={[form.circuit, "value"]}
            />
          </NInputGroup>
        </div>
        <div class="mar-b-7-item d-flex direction-column">
          {form.url ? (
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
                        openUrl(item.url);
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
        <div class="content">
          {iframeSrc.value ? (
            <div style="background-color: #000; margin-bottom: 100px">
              <iframe src={iframeSrc.value} frameborder="0" class="full-width" style="height: calc(100vh - 300px)" scrolling="no"></iframe>
            </div>
          ) : null}
        </div>
      </div>
    );
  },
});
