import router from "@/router";
import { defaultBanner, getBannerDetail, IBananer, postBanner, putBanner } from "@/service/banner";
import { removeTab } from "@/service/common";
import { Button, Form, FormItem, Input, Modal, Radio, RadioGroup } from "ant-design-vue";
import { defineComponent, onMounted, reactive } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
  props: {
    id: {
      type: Number,
      default: null,
    },
  },
  emits: [],
  setup: (props, ctx) => {
    const form = reactive<IBananer>({
      ...defaultBanner,
    });
    const isAddPage = props.id === null;
    const route = useRoute();
    const handleSubmit = (params: IBananer) => {
      Modal.confirm({
        title: `确认${isAddPage ? "添加" : "编辑此"}幻灯？`,
        onOk: () => {
          return (isAddPage ? postBanner({ ...params }) : putBanner(form)).then(e => {
            router.back();
            if (typeof route.name === 'string') {
              removeTab(route.name)
            }
          });
        },
      });
    };

    onMounted(() => {
      if (!isAddPage) {
        getBannerDetail(props.id).then(data => {
          form.id = data.id;
          form.title = data.title;
          // form.status = data.status;
          // form.sort = data.sort;
        });
      }
    });

    return () => (
      <Form model={form} labelCol={{ sm: 4 }} onFinish={e => handleSubmit(e)}>
        <FormItem name="title" label="标题" rules={[{ required: true, message: "请先输入标题" }]}>
          <Input placeholder="请输入标题" v-model={[form.title, "value"]}></Input>
        </FormItem>
        {/* <FormItem name="sort" label="排序">
          <Input placeholder="请输入排序" v-model={[form.sort, "value"]}></Input>
        </FormItem>
        <FormItem name="status" label="是否启用" rules={[{ required: true, message: "请选择是否启用" }]}>
          <RadioGroup v-model={[form.status, 'value']}>
            <Radio value={1}>是</Radio>
            <Radio value={0}>否</Radio>
          </RadioGroup>
        </FormItem> */}
        <div class="d-flex align-items-center justify-center">
          <Button htmlType="submit" type="primary" size="large">
            提交
          </Button>
        </div>
      </Form>
    );
  },
});
