import UserPermissions from "@/component/UserPermissions";
import router from "@/router";
import { removeTab } from "@/service/common";
import { defaultRole, getRoleDetail, IRole, postRole, putRole } from "@/service/role";
import { Button, Form, FormItem, Input, Modal, Radio, RadioGroup } from "ant-design-vue";
import { defineComponent, onMounted, reactive, ref } from "vue";
import route from "./route";

export default defineComponent({
  props: {
    id: {
      type: Number,
      default: null,
    },
  },
  emits: [],
  setup: (props, ctx) => {
    const form = reactive<IRole>({
      ...defaultRole,
    });
    const isAddPage = props.id === null;

    const handleSubmit = (params: IRole) => {
      Modal.confirm({
        title: `确认${isAddPage ? "添加" : "编辑此"}角色？`,
        onOk: () => {
          if (form.permissions) {
            params.permissions = form.permissions;
          }
          if (form.route) {
            params.route = form.route;
          }
          return (isAddPage ? postRole({ ...params }) : putRole(form)).then(e => {
            router.back();
            removeTab(String(route.name));
          });
        },
      });
    };

    onMounted(() => {
      if (!isAddPage) {
        getRoleDetail(props.id).then(data => {
          console.log(data);
          form.id = data.id;
          form.name = data.name;
          form.home_url = data.home_url;
          form.status = data.status;
          form.permissions = data.permissions;
          form.route = data.route;
        });
      }
    });

    return () => (
      <Form model={form} labelCol={{ sm: 4 }} onFinish={e => handleSubmit(e)}>
        <FormItem name="name" label="角色名称" rules={[{ required: true, message: "请先输入角色名称" }]}>
          <Input placeholder="请输入角色名称" v-model={[form.name, "value"]}></Input>
        </FormItem>
        <FormItem name="home_url" label="首页地址">
          <Input placeholder="请输入首页地址" v-model={[form.home_url, "value"]}></Input>
        </FormItem>
        <FormItem name="status" label="是否激活" rules={[{ required: true, message: "请选择是否激活" }]}>
          <RadioGroup v-model={[form.status, "value"]}>
            <Radio value={1}>是</Radio>
            <Radio value={0}>否</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="权限管理">
          <UserPermissions
            premissions={form.permissions}
            route={form.route}
            onPermissionKeyChange={item => {
              form.permissions = item;
            }}
            onRouteKeyChange={item => {
              form.route = item;
            }}
          ></UserPermissions>
        </FormItem>

        <div class="d-flex align-items-center justify-center mar-t-5">
          <Button htmlType="submit" type="primary" size="large">
            提交
          </Button>
        </div>
      </Form>
    );
  },
});
