import router from "@/router";
import { removeTab } from "@/service/common";
import { getModuleList, IModule, moduleList } from "@/service/module";
import { defaultRoute, getRouterDetail, IRoute, postRouter, putRouter } from "@/service/route";
import { Button, Form, FormItem, Input, Modal, Select, SelectOption, Switch } from "ant-design-vue";
import { defineComponent, onMounted, reactive, ref } from "vue";
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
    const route = useRoute();
    const form = reactive<IRoute>({
      ...defaultRoute,
    });
    const isAddPage = props.id === null;

    const dataSource = ref<IModule[]>([]);

    const handleSubmit = (params: IRoute) => {
      console.log(params);

      Modal.confirm({
        title: `确认${isAddPage ? "添加" : "编辑此"}页面？`,
        onOk: () => {
          return (isAddPage ? postRouter({ ...params, parent_id: Number(route.query.parent_id || 0) }) : putRouter(form)).then(e => {
            router.back();
            removeTab(String(route.name));
          });
        },
      });
    };

    onMounted(() => {
      if (!isAddPage) {
        getRouterDetail(props.id).then(data => {
          form.id = data.id;
          form.is_menu = data.is_menu;
          form.key = data.key;
          form.parent_id = data.parent_id;
          form.sort = data.sort;
          form.name = data.name;
          form.module_id = data.module_id;
          // ({
          //   id: form.id,
          //   is_menu: form.is_menu,
          //   key: form.key,
          //   parent_id: form.parent_id,
          //   sort: form.sort,
          //   name: form.name,
          //   module_id: form.module_id,
          // } = data)
        });
      }
      getModuleList().then(data => {
        dataSource.value = moduleList.value;
      });
    });

    return () => (
      <Form model={form} labelCol={{ sm: 4 }} onFinish={e => handleSubmit(e)}>
        <FormItem name="name" label="标题" rules={[{ required: true, message: "请先输入标题" }]}>
          <Input placeholder="请输入标题" v-model={[form.name, "value"]}></Input>
        </FormItem>
        <FormItem name="key" label="name" rules={[{ required: true, message: "请先输入name" }]}>
          <Input placeholder="请输入name" v-model={[form.key, "value"]}></Input>
        </FormItem>
        <FormItem name="is_menu" label="是不是菜单" rules={[{ required: true, message: "请先输入是不是菜单" }]}>
          <Switch v-model={[form.is_menu, "checked"]} checkedChildren="是" unCheckedChildren="不是" unCheckedValue={0} checkedValue={1} />
        </FormItem>
        <FormItem name="sort" label="排序" rules={[{ required: true, message: "请先输入排序" }]}>
          <Input placeholder="请输入排序" type="number" v-model={[form.sort, "value"]}></Input>
        </FormItem>
        <FormItem name="module_id" label="所属模块" rules={[{ required: true, message: "请选择所属模块" }]}>
          <Select v-model={[form.module_id, "value"]}>
            {() => dataSource.value.map(item => <SelectOption value={item.id}>{item.title}</SelectOption>)}
          </Select>
        </FormItem>
        <FormItem name="url" label="url" rules={[{ required: true, message: "请先输入路由地址" }]}>
          <Input placeholder="请输入路由地址" type="text" v-model={[form.url, "value"]}></Input>
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
