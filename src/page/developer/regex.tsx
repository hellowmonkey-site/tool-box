import { copyText } from "@/helper";
import { message } from "@/service/common";
import { regList } from "@/service/devoloper";
import { NButton, NCard, NH4 } from "naive-ui";
import { defineComponent } from "vue";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    return () => (
      <div>
        {regList.map(item => (
          <>
            <NH4 prefix="bar">{item.title}</NH4>
            <NCard>
              <div class="d-flex align-items-center justify-between mar-b-4-item">
                <div class="wrap">{item.code}</div>
                <NButton
                  class="mar-l-4"
                  onClick={() => {
                    copyText(item.code).then(() => {
                      message.success("复制成功");
                    });
                  }}
                >
                  复制
                </NButton>
              </div>
            </NCard>
          </>
        ))}
      </div>
    );
  },
});
