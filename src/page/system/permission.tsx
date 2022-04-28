import { TableData } from "@/config/type";
import { deletePermission, getPermissionList, IPermission } from "@/service/permission";
import { Button, message, Modal, Table } from "ant-design-vue";
import { defineComponent, onMounted, ref } from "vue";
import { onBeforeRouteUpdate, RouterLink, useRoute } from "vue-router";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    const route = useRoute();
    const dataSource = ref<IPermission[]>([]);
    let parentId = 0;
    const columns = [
      {
        dataIndex: "id",
        title: "ID",
      },
      {
        dataIndex: "app_id",
        title: "app_id",
      },
      {
        dataIndex: "name",
        title: "权限名称",
      },
      {
        dataIndex: "key",
        title: "标记",
      },
      {
        dataIndex: "path",
        title: "请求地址",
      },
      {
        dataIndex: "method",
        title: "请求方法",
      },
      {
        dataIndex: "sort",
        title: "排序",
      },
      {
        key: "action",
        title: "操作",
        customRender({ record }: TableData<IPermission>) {
          return (
            <>
              <RouterLink to={{ name: "system-permission-index", query: { parent_id: record.id } }} class="mar-r-2-item ant-btn">
                查看子权限
              </RouterLink>
              <RouterLink to={{ name: "system-permission-edit", params: { id: record.id } }} class="mar-r-2-item ant-btn ant-btn-primary">
                编辑
              </RouterLink>
              <Button
                class="mar-r-2-item"
                danger
                onClick={() => {
                  Modal.confirm({
                    title: `确认要删除${record.name}吗？`,
                    onOk: () => {
                      return deletePermission(record.id).then(() => {
                        fetchData();
                      });
                    },
                  });
                }}
              >
                删除
              </Button>
            </>
          );
        },
      },
    ];

    function fetchData() {
      const hide = message.loading("数据加载中...");
      getPermissionList(parentId)
        .then(data => {
          dataSource.value = data;
        })
        .finally(() => {
          hide();
        });
    }

    onBeforeRouteUpdate(e => {
      parentId = Number(e.query.parent_id || 0);
      fetchData();
    });

    onMounted(() => {
      parentId = Number(route.query.parent_id || 0);
      fetchData();
    });

    return () => (
      <>
        <div class="d-flex justify-end mar-b-3">
          <RouterLink to={{ name: "system-permission-add", query: { parent_id: parentId } }} class="ant-btn">
            添加权限
          </RouterLink>
        </div>
        <Table bordered columns={columns} pagination={false} dataSource={dataSource.value}></Table>
      </>
    );
  },
});
