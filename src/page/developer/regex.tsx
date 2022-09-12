import { copyText } from "@/helper";
import { message } from "@/service/common";
import { NButton, NCard, NH4 } from "naive-ui";
import { defineComponent } from "vue";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    const regList: { title: string; code: string }[] = [
      {
        title: "邮箱",
        code: "^([A-Za-z0-9_\\-\\.])+\\@([A-Za-z0-9_\\-\\.])+\\.([A-Za-z]{2,4})$",
      },
      {
        title: "手机号",
        code: "^[1]([3-9])[0-9]{9}$",
      },
      {
        title: "固定电话",
        code: "(\\(\\d{3,4}\\)|\\d{3,4}-|\\s)?\\d{8}",
      },
      {
        title: "车牌号",
        code: "^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Za-z]{1}[A-Za-z]{1}(([0-9]{5}[DFdf])|([DFdf]([A-HJ-NP-Za-hj-np-z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Za-z]{1}[A-Za-z]{1}[A-HJ-NP-Za-hj-np-z0-9]{4}[A-HJ-NP-Za-hj-np-z0-9挂学警港澳]{1})$",
      },
      {
        title: "身份证号",
        code: "^[1-9]\\d{5}(18|19|([23]\\d))\\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$",
      },
      {
        title: "域名",
        code: "^((http:\\/\\/)|(https:\\/\\/))?([a-zA-Z0-9]([a-zA-Z0-9\\-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,6}(\\/)",
      },
      {
        title: "IP地址",
        code: "((?:(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d))",
      },
      {
        title: "汉字",
        code: "^[\\u4e00-\\u9fa5]{0,}$",
      },
    ];

    return () => (
      <>
        {regList.map(item => (
          <>
            <NH4 prefix="bar">{item.title}</NH4>
            <NCard>
              <div class="d-flex align-items-center justify-between mar-b-4-item">
                <div class="wrap">{item.code}</div>
                <NButton
                  class="mar-l-4"
                  onClick={() => {
                    copyText(item.code);
                    message.success("复制成功");
                  }}
                >
                  复制
                </NButton>
              </div>
            </NCard>
          </>
        ))}
      </>
    );
  },
});