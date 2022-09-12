import { copyText } from "@/helper";
import { message } from "@/service/common";
import { NAlert, NButton, NInput, NInputGroup, NInputGroupLabel, NSelect } from "naive-ui";
import { defineComponent, onActivated, reactive, ref } from "vue";
import dayjs from "dayjs";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    const enum Type {
      S = "s",
      MS = "ms",
    }
    const form = reactive<{ value: string; type: Type }>({
      value: "",
      type: Type.MS,
    });
    const ret = ref<number>(0);
    const iptEl = ref<HTMLInputElement>();

    function handleSubmit() {
      const data = dayjs(form.value);
      if (!data.isValid()) {
        message.error("错误的日期");
        return;
      }
      let value = data.toDate().getTime();
      if (form.type === Type.S) {
        value = Math.ceil(value / 1000);
      }
      ret.value = value;
    }

    onActivated(() => {
      iptEl.value?.focus();
    });

    return () => (
      <>
        <div class="d-flex mar-b-5-item">
          <div class="mar-r-3-item flex-item-extend">
            <NInputGroup>
              <NInputGroupLabel size="large">日期</NInputGroupLabel>
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
                placeholder="请输入日期，回车转换"
              />
              <NSelect
                size="large"
                options={[
                  {
                    label: "秒(s)",
                    value: Type.S,
                  },
                  {
                    label: "毫秒(ms)",
                    value: Type.MS,
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
          <NAlert type="success" showIcon title={String(ret.value)}>
            <div class="d-flex justify-end">
              <NButton
                type="primary"
                onClick={() => {
                  copyText(String(ret.value));
                  message.success("复制成功");
                }}
                size="small"
              >
                复制
              </NButton>
            </div>
          </NAlert>
        ) : null}
      </>
    );
  },
});
