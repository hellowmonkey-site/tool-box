import { copyText } from "@/helper";
import { message } from "@/service/common";
import { NAlert, NButton, NInput } from "naive-ui";
import { defineComponent, onActivated, ref } from "vue";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    const num = ref<string | null>(null);
    const ret = ref<string>("");
    const iptEl = ref<HTMLInputElement>();

    function digitUppercase(n: number) {
      const fraction = ["角", "分"];
      const digit = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
      const unit = [
        ["元", "万", "亿"],
        ["", "拾", "佰", "仟"],
      ];
      const head = n < 0 ? "欠" : "";
      n = Math.abs(n);
      let s = "";
      for (let i = 0; i < fraction.length; i++) {
        s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, "");
      }
      s = s || "整";
      n = Math.floor(n);
      for (let i = 0; i < unit[0].length && n > 0; i++) {
        let p = "";
        for (let j = 0; j < unit[1].length && n > 0; j++) {
          p = digit[n % 10] + unit[1][j] + p;
          n = Math.floor(n / 10);
        }
        s = p.replace(/(零.)*零$/, "").replace(/^$/, "零") + unit[0][i] + s;
      }
      return (
        head +
        s
          .replace(/(零.)*零元/, "元")
          .replace(/(零.)+/g, "零")
          .replace(/^整$/, "零元整")
      );
    }

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
        <NInput
          placeholder="请输入金额，回车转换"
          class="mar-b-4-item"
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
            class="mar-b-4-item"
            block
            onClick={() => {
              handleSubmit();
            }}
          >
            转换
          </NButton>
        ) : null}
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
