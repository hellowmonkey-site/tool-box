import { getAllPermissionList, IPermission } from "@/service/permission";
import { getAllRouterList, IRoute } from "@/service/route";
import { Card, Tree } from "ant-design-vue";
import { defineComponent, onMounted, PropType, ref, watch } from "vue";

export default defineComponent({
  props: {
    premissions: {
      type: Array as PropType<string[]>,
      default: []
    },
    route: {
      type: Array as PropType<string[]>,
      default: []
    }
  },
  emits: ["routeKeyChange", "permissionKeyChange"],
  setup: (props, ctx) => {
    const routeTreeData = ref<IRoute[]>([]);
    const permissionTreeData = ref<IPermission[]>([]);
    
    function fetchData() {
      getAllPermissionList().then(data=>{
        data.forEach(element => {
          element.key = element.id.toString();
          element.title = element.name
          handleChildKey(element);
        });
        permissionTreeData.value = data
      });
      getAllRouterList().then(data=>{
        data.forEach(element => {
          element.key = element.id.toString();
          element.title = element.name
          handleChildKey(element);
        });
        routeTreeData.value = data
      });
    }

    function handleChildKey ( child: IPermission | IRoute | undefined ) {
      if (child && child.children && child.children.length > 0)
      {
        child.children.forEach(element => {
           element.key = element.id.toString()
           element.title = element.name
           handleChildKey(element)
        });
      }
      else {
        return
      }
    }

    const routeCheckedKeys = ref<string[]>([]);
    const permissionCheckedKeys = ref<string[]>([]);

    watch(props, (newVaule) => {
      routeCheckedKeys.value = newVaule.route
      permissionCheckedKeys.value = newVaule.premissions
    });

    watch(routeCheckedKeys, () => {
      // 页面权限修改
      ctx.emit("routeKeyChange", routeCheckedKeys.value)
    });
    watch(permissionCheckedKeys, () => {
      // 操作权限修改
      ctx.emit("permissionKeyChange", permissionCheckedKeys.value)
    });

    onMounted(() => {
      fetchData();
    });

    return () => (
      <div>
        <div class="d-flex direction-row justify-around align-items-stretch">
          <Card title="页面权限管理" style="width:49%;">
            <Tree
              class="flex-item-extend"
              checkable
              treeData = {routeTreeData.value}
              v-model={[routeCheckedKeys.value, "checkedKeys"]}
            >
            </Tree>
          </Card>
          <Card title="操作权限管理" style="width:49%;">
            <Tree
              class="flex-item-extend"
              checkable
              treeData = {permissionTreeData.value}
              v-model={[permissionCheckedKeys.value, "checkedKeys"]}
            >
            </Tree>
          </Card>
        </div>
      </div>
    );
  },
});
