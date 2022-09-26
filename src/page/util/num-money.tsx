import { copyText } from "@/helper";
import { message } from "@/service/common";
import { digitUppercase } from "@/service/util";
import { NAlert, NButton, NInput } from "naive-ui";
import { defineComponent, onActivated, ref } from "vue";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    const num = ref<string | null>(null);
    const ret = ref<string>("");
    const iptEl = ref<HTMLInputElement>();

    function handleSubmit() {
      if (!num.value) {
        return;
      }
      ret.value = digitUppercase(Number(num.value));
    }

    onActivated(() => {
      iptEl.value?.focus();
    });

    return () => (
      <div class="d-flex direction-column">
        <div class="d-flex">
          <NInput
            placeholder="请输入金额，回车转换"
            class="mar-r-3-item"
            value={num.value}
            onInput={val => {
              if (Number(val)) {
                num.value = val;
              }
            }}
            size="large"
            ref={iptEl}
            onKeydown={e => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          {num.value ? (
            <NButton
              type="primary"
              size="large"
              class="mar-r-3-item"
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
                  copyText(ret.value);
                  message.success("复制成功");
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
