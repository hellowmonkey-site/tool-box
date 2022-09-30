import { copyText } from "@/helper";
import { message } from "@/service/common";
import { NAlert, NButton, NInput, NInputGroup, NInputGroupLabel, NSelect } from "naive-ui";
import { defineComponent, onActivated, reactive, ref } from "vue";
import { DateType } from "@/service/util";
import dayjs from "dayjs";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    const form = reactive<{ value: string; type: DateType }>({
      value: "",
      type: DateType.S,
    });
    const ret = ref<string>("");
    const iptEl = ref<HTMLInputElement>();

    function handleSubmit() {
      let value = Number(form.value);
      if (form.type === DateType.S) {
        value = Math.ceil(value * 1000);
      }
      ret.value = dayjs(value).format("YYYY-MM-DD HH:mm:ss");
    }

    onActivated(() => {
      iptEl.value?.focus();
    });

    return () => (
      <div>
        <div class="d-flex mar-b-5-item">
          <div class="mar-r-3-item flex-item-extend">
            <NInputGroup>
              <NInputGroupLabel size="large">时间戳</NInputGroupLabel>
              <NInput
                size="large"
                ref={iptEl}
                onKeydown={e => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                v-model={[form.value, "value"]}
                placeholder="请输入时间戳，回车转换"
              />
              <NSelect
                size="large"
                options={[
                  {
                    label: "秒(s)",
                    value: DateType.S,
                  },
                  {
                    label: "毫秒(ms)",
                    value: DateType.MS,
                  },
                ]}
                v-model={[form.type, "value"]}
              />
            </NInputGroup>
          </div>
          {form.value ? (
            <NButton
              size="large"
              type="primary"
              onClick={() => {
                handleSubmit();
              }}
            >
              转换
            </NButton>
          ) : null}
        </div>
        {ret.value ? (
          <NAlert type="success" showIcon title={ret.value}>
            <div class="d-flex justify-end">
              <NButton
                type="primary"
                onClick={() => {
                  copyText(ret.value).then(() => {
                    message.success("复制成功");
                  });
                }}
                size="small"
              >
                复制
              </NButton>
            </div>
          </NAlert>
        ) : null}
      </div>
    );
  },
});
