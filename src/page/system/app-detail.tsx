import router from "@/router";
import { defaultApp, getAppDetail, IApp, postApp, putApp } from "@/service/app";
import { removeTab } from "@/service/common";
import { Button, Form, FormItem, Input, Modal, Switch } from "ant-design-vue";
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
    const form = reactive<IApp>({
      ...defaultApp,
    });
    const isAddPage = props.id === null;
    const route = useRoute();

    const handleSubmit = (params: IApp) => {
      Modal.confirm({
        title: `确认${isAddPage ? "添加" : "编辑此"}模块？`,
        onOk: () => {
          return (isAddPage ? postApp({ ...params }) : putApp(form)).then(e => {
            router.back();
            removeTab(String(route.name));
          });
        },
      });
    };

    onMounted(() => {
      if (!isAddPage) {
        getAppDetail(props.id).then(data => {
          form.id = data.id;
          form.name = data.name;
          form.app_key = data.app_key;
          form.secret_key = data.secret_key;
          form.status = data.status;
        });
      }
    });

    return () => (
      <Form model={form} labelCol={{ sm: 4 }} onFinish={e => handleSubmit(e)}>
        <FormItem name="name" label="APP名称" rules={[{ required: true, message: "请先输入APP名称" }]}>
          <Input placeholder="请输入APP名称" v-model={[form.name, "value"]}></Input>
        </FormItem>
        <FormItem name="app_key" label="app_key">
          <Input placeholder="请输入app_key" v-model={[form.app_key, "value"]}></Input>
        </FormItem>
        <FormItem name="secret_key" label="secret_key">
          <Input placeholder="请输入secret_key" v-model={[form.secret_key, "value"]}></Input>
        </FormItem>
        <FormItem name="status" label="是否启用" rules={[{ required: false, message: "请先选择是不是集团用户" }]}>
          <Switch v-model={[form.status, "checked"]} checkedChildren="是" unCheckedChildren="否" unCheckedValue={0} checkedValue={1} />
        </FormItem>
        <div class="d-flex align-items-center justify-center">
          <Button htmlType="submit" type="primary" size="large">
            提交
          </Button>
        </div>
      </Form>
    );
  },
});
