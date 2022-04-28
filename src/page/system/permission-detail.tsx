import { getModuleList, moduleList } from "@/service/module";
import { appList, getAppList } from "@/service/app";
import { defaultPermission, getPermissionDetail, IPermission, postPermission, putPermission } from "@/service/permission";
import { Button, Form, FormItem, Input, Modal, Select, SelectOption } from "ant-design-vue";
import { defineComponent, onMounted, reactive } from "vue";
import { useRoute } from "vue-router";
import { removeRouteTab } from "@/service/common";

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
    const form = reactive<IPermission>({
      ...defaultPermission,
    });
    const isAddPage = props.id === null;

    const handleSubmit = (params: IPermission) => {
      Modal.confirm({
        title: `确认${isAddPage ? "添加" : "编辑此"}权限？`,
        onOk: () => {
          return (isAddPage ? postPermission({ ...params, parent_id: Number(route.query.parent_id || 0) }) : putPermission(form)).then(
            () => {
              removeRouteTab(route.name!);
            }
          );
        },
      });
    };

    onMounted(() => {
      if (!isAddPage) {
        getPermissionDetail(props.id).then(data => {
          form.id = data.id;
          form.key = data.key;
          form.parent_id = data.parent_id;
          form.sort = data.sort;
          form.method = data.method;
          form.module_id = data.module_id;
          form.app_id = data.app_id;
          form.name = data.name;
          form.path = data.path;
        });
      }
      getModuleList();
      getAppList();
    });

    return () => (
      <Form model={form} labelCol={{ sm: 4 }} onFinish={e => handleSubmit(e)}>
        <FormItem name="name" label="名称" rules={[{ required: true, message: "请先输入权限名称" }]}>
          <Input placeholder="请输入权限名称" v-model={[form.name, "value"]}></Input>
        </FormItem>
        <FormItem name="key" label="name" rules={[{ required: true, message: "请先输入name" }]}>
          <Input placeholder="请输入name" v-model={[form.key, "value"]}></Input>
        </FormItem>
        <FormItem name="app_id" label="APP" rules={[{ required: true, message: "请先输入app_id" }]}>
          <Select v-model={[form.app_id, "value"]} placeholder="请选择所属APP">
            {() => appList.value.map(item => <SelectOption value={item.id}>{item.name}</SelectOption>)}
          </Select>
        </FormItem>
        <FormItem name="sort" label="排序" rules={[{ required: false, message: "请先输入排序" }]}>
          <Input placeholder="请输入排序" type="number" v-model={[form.sort, "value"]}></Input>
        </FormItem>
        <FormItem name="module_id" label="所属模块" rules={[{ required: true, message: "请选择所属模块" }]}>
          <Select v-model={[form.module_id, "value"]} placeholder="请选择所属模块">
            {() => moduleList.value.map(item => <SelectOption value={item.id}>{item.title}</SelectOption>)}
          </Select>
        </FormItem>
        <FormItem name="path" label="请求地址" rules={[{ required: true, message: "请先输入请求地址" }]}>
          <Input placeholder="请输入请求地址" type="text" v-model={[form.path, "value"]}></Input>
        </FormItem>
        <FormItem name="method" label="请求方法" rules={[{ required: true, message: "请先输入请求方法" }]}>
          <Input placeholder="请输入请求方法" type="text" v-model={[form.method, "value"]}></Input>
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
