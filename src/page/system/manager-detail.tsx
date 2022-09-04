import UploadImageList from "@/component/common/UploadImageList";
import { removeRouteTab } from "@/service/common";
import { defaultManager, getManagerDetail, IManagerInput, postManager, putManager } from "@/service/manager";
import { getRoleList, roleList } from "@/service/role";
import { Button, Form, FormItem, Input, InputPassword, Modal, Select, SelectOption } from "ant-design-vue";
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
    const route = useRoute();

    const form = reactive<IManagerInput>({
      ...defaultManager,
    });
    const isAddPage = props.id === null;

    const handleSubmit = (params: IManagerInput) => {
      Modal.confirm({
        title: `确认${isAddPage ? "添加" : "编辑此"}用户？`,
        onOk: () => {
          return (isAddPage ? postManager({ ...params }) : putManager(form)).then(e => {
            removeRouteTab(route.name!);
          });
        },
      });
    };

    onMounted(() => {
      if (!isAddPage) {
        getManagerDetail(props.id).then(data => {
          form.id = data.id;
          form.username = data.username;
          form.home_url = data.home_url;
          form.avatar = data.avatar;
          form.nickname = data.nickname;
          form.remark = data.remark;
          form.client_id = data.client_id;
          form.role = data.roles.map(v => v.id);
        });
      }
      // 获取角色列表
      getRoleList();
    });

    return () => (
      <div class="content-box">
        <Form model={form} labelCol={{ sm: 4 }} onFinish={e => handleSubmit(e)}>
          <FormItem name="username" label="登录账号" rules={[{ required: true, message: "请先输入登录账号" }]}>
            <Input placeholder="请输入登录账号" v-model={[form.username, "value"]}></Input>
          </FormItem>
          {isAddPage ? (
            <FormItem name="password" label="密码" rules={[{ required: true, message: "请先输入密码" }]}>
              <InputPassword placeholder="请输入密码" v-model={[form.password, "value"]} />
            </FormItem>
          ) : null}
          <FormItem name="avatar" label="头像">
            <UploadImageList
              maxCount={1}
              images={form.avatar ? [form.avatar] : []}
              onChange={list => (form.avatar = list[list.length - 1])}
            />
          </FormItem>
          <FormItem name="role" label="角色" rules={[{ required: true, message: "请先选择角色" }]}>
            <Select mode="multiple" v-model={[form.role, "value"]} placeholder="请选择角色">
              {roleList.value.map(item => (
                <SelectOption value={item.id}>{item.name}</SelectOption>
              ))}
            </Select>
          </FormItem>
          <FormItem name="home_url" label="首页地址">
            <Input placeholder="请输入首页地址" v-model={[form.home_url, "value"]}></Input>
          </FormItem>
          <FormItem name="nickname" label="昵称">
            <Input placeholder="请输入昵称" v-model={[form.nickname, "value"]}></Input>
          </FormItem>
          <div class="d-flex align-items-center justify-center">
            <Button htmlType="submit" type="primary" size="large">
              提交
            </Button>
          </div>
        </Form>
      </div>
    );
  },
});