import { copyText, lineToHump, random } from "@/helper";
import { isEmpty } from "@/helper/validate";
import { globalTheme, message } from "@/service/common";
import { colors, VariableType, variableTypeList } from "@/service/devoloper";
import { NButton, NInput, NInputGroup, NInputGroupLabel, NSelect } from "naive-ui";
import { computed, defineComponent, onActivated, onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    const route = useRoute();
    const form = reactive({
      words: "",
      type: VariableType.HUMP,
    });
    const iptEl = ref<HTMLInputElement>();
    const data = ref<string[]>([]);
    const loading = ref(false);

    const dataList = computed<{ text: string; color: string }[]>(() => {
      const list = [
        ...new Set(
          data.value.map(v =>
            v
              .split("")
              .map(val => val.toLocaleLowerCase().replace(/[\.\,\?\!\~\/]/g, ""))
              .join("")
          )
        ),
      ];
      return list.map(text => {
        text = text.replace(/\s/g, "-");
        if (form.type === VariableType.HUMP) {
          text = lineToHump(text);
        } else if (form.type === VariableType.UNDERLINE) {
          text = text.replace(/-/g, "_");
        }
        return {
          text,
          color: colors[random(0, colors.length - 1)],
        };
      });
    });

    function handleSubmit() {
      if (!form.words || !/[\u4e00-\u9fa5]{0,}/g.test(form.words)) {
        message.error("请先输入变量中文名");
        return;
      }
      loading.value = true;
      electronAPI
        .youdaoTranslate(form.words)
        .then(list => {
          data.value = list;
          if (!dataList.value.length) {
            message.error("未匹配到相关数据");
          }
        })
        .finally(() => {
          loading.value = false;
        });
    }

    onMounted(() => {
      const { words, type } = route.query;
      if (words) {
        form.words = words as string;
      }
      if (!isEmpty(type)) {
        form.type = Number(type);
      }
    });

    onActivated(() => {
      iptEl.value?.focus();
    });

    return () => (
      <div class="d-flex direction-column">
        <div class="d-flex mar-b-5-item">
          <div class="mar-r-3-item flex-item-extend">
            <NInputGroup>
              <NInputGroupLabel size="large">变量中文名</NInputGroupLabel>
              <NInput
                placeholder="请输入变量中文名，回车翻译"
                size="large"
                ref={iptEl}
                v-model={[form.words, "value"]}
                onKeydown={e => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              />
              <NSelect
                size="large"
                options={variableTypeList.map(v => ({ label: v.text, value: v.value }))}
                v-model={[form.type, "value"]}
              />
            </NInputGroup>
          </div>

          {form.words ? (
            <NButton
              type="primary"
              size="large"
              class="mar-r-3-item"
              loading={loading.value}
              onClick={() => {
                handleSubmit();
              }}
            >
              翻译
            </NButton>
          ) : null}
        </div>
        {data.value.length ? (
          <div class="clearfix">
            {dataList.value.map(item => (
              <NButton
                size="small"
                ghost={globalTheme.value === null ? false : true}
                color={item.color}
                class="float-left mar-r-3-item mar-b-3-item"
                onClick={() => {
                  copyText(item.text).then(() => {
                    message.success("复制成功");
                  });
                }}
              >
                {item.text}
              </NButton>
            ))}
          </div>
        ) : null}
      </div>
    );
  },
});
