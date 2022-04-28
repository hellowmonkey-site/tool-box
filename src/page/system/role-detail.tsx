import { StatusType, TreeType } from "@/config/type";
import { removeRouteTab } from "@/service/common";
import { allPermissionList, getAllPermissionList, IPermission } from "@/service/permission";
import { defaultRole, getRoleDetail, IRole, postRole, putRole } from "@/service/role";
import { allRouteList, getAllRouterList, IRoute } from "@/service/route";
import { Button, Card, Form, FormItem, Input, Modal, Radio, RadioGroup, Tree } from "ant-design-vue";
import { computed, defineComponent, onMounted, reactive, ref } from "vue";
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
    const form = reactive<IRole>({
      ...defaultRole,
    });
    const isAddPage = props.id === null;

    const routeCheckedKeys = ref<string[]>([]);
    const permissionCheckedKeys = ref<string[]>([]);

    function handleChildKey<T extends { id: number; parent_id: number; name: string }>(arr: T[] = [], parentId = 0): TreeType[] {
      const data = arr
        .filter(v => v.parent_id === parentId)
        .map(v => {
          return {
            key: String(v.id),
            title: v.name,
            children: handleChildKey(arr, v.id),
          };
        });
      return data;
    }

    const routeTreeData = computed(() => {
      return handleChildKey<IRoute>(allRouteList.value);
    });
    const permissionTreeData = computed(() => {
      return handleChildKey<IPermission>(allPermissionList.value);
    });

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
            removeRouteTab(String(route.name));
          });
        },
      });
    };

    onMounted(() => {
      if (!isAddPage) {
        getRoleDetail(props.id).then(data => {
          form.id = data.id;
          form.name = data.name;
          form.home_url = data.home_url;
          form.status = data.status;
          form.permissions = data.permissions;
          form.route = data.route;
        });
      }
      getAllRouterList();
      getAllPermissionList();
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
            <Radio value={StatusType.ONLINE}>是</Radio>
            <Radio value={StatusType.OFFLINE}>否</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="权限管理">
          <div class="d-flex justify-around align-items-stretch">
            <Card title="页面权限管理" class="mar-r-3-item flex-item-extend">
              <Tree checkable treeData={routeTreeData.value} v-model={[routeCheckedKeys.value, "checkedKeys"]}></Tree>
            </Card>
            <Card title="操作权限管理" class="mar-r-3-item flex-item-extend">
              <Tree
                checkable
                // loadData={node => {
                //   console.log(node);
                //   return Promise.resolve();
                // }}
                treeData={permissionTreeData.value}
                v-model={[permissionCheckedKeys.value, "checkedKeys"]}
              ></Tree>
            </Card>
          </div>
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
