import { NButton, NInput, NInputGroup, NInputGroupLabel, NSelect } from "naive-ui";
import { defineComponent, ref } from "vue";

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
    const circuit = ref<string>(circuits[0].value);
    const url = ref<string>("");
    const iframeSrc = ref<string>("");

    return () => (
      <div class="content">
        <div class="mar-b-2-item">
          <NInputGroup>
            <NInputGroupLabel size="large">选择线路节点</NInputGroupLabel>
            <NSelect size="large" options={circuits} v-model={[circuit.value, "value"]} />
          </NInputGroup>
        </div>
        <div class="mar-b-4-item">
          <NInputGroup>
            <NInputGroupLabel size="large">播放地址</NInputGroupLabel>
            <NInput size="large" v-model={[url.value, "value"]} placeholder="请输入播放地址" />
          </NInputGroup>
        </div>
        <div class="mar-b-5-item d-flex direction-column">
          <NButton
            block
            size="large"
            type="primary"
            onClick={() => {
              if (!url.value) return;
              iframeSrc.value = circuit.value.replace("__URL__", url.value);
            }}
            class="mar-b-3-item"
          >
            解析
          </NButton>
          <div class="d-flex justify-center align-items-center">
            <NButton class="mar-r-2-item" strong secondary type="primary">
              爱奇艺
            </NButton>
            <NButton class="mar-r-2-item" strong secondary type="info">
              腾讯视频
            </NButton>
            <NButton class="mar-r-2-item" strong secondary type="success">
              优酷视频
            </NButton>
            <NButton class="mar-r-2-item" strong secondary type="warning">
              芒果TV
            </NButton>
            <NButton class="mar-r-2-item" strong secondary type="error">
              哔哩哔哩
            </NButton>
            <NButton class="mar-r-2-item" strong secondary type="primary">
              土豆网
            </NButton>
          </div>
        </div>
        {iframeSrc.value ? <iframe src={iframeSrc.value} frameborder="0"></iframe> : null}
      </div>
    );
  },
});
