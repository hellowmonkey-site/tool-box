import { TableData } from "@/config/type";
import { getAppList, IApp, appList, deleteApp } from "@/service/app";
import { Button, message, Modal, Table } from "ant-design-vue";
import { defineComponent, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    const dataSource = ref<IApp[]>([]);
    const columns = [
      {
        dataIndex: "id",
        title: "ID",
      },
      {
        dataIndex: "name",
        title: "app名称",
      },
      {
        dataIndex: "app_key",
        title: "app_key",
      },
      {
        dataIndex: "secret_key",
        title: "secret_key",
      },
      {
        dataIndex: "status",
        title: "状态",
        customRender({ record }: TableData) {
          return <>{record.status === 1 ? "启用" : "停用"}</>;
        },
      },
      {
        key: "action",
        title: "操作",
        customRender({ record }: TableData) {
          return (
            <>
              <RouterLink to={{ name: "system-app-edit", params: { id: record.id } }} class="mar-r-2-item ant-btn ant-btn-primary">
                编辑
              </RouterLink>
              <Button
                class="mar-r-2-item"
                danger
                onClick={() => {
                  Modal.confirm({
                    title: `确认要删除${record.title}吗？`,
                    onOk: () => {
                      return deleteApp(record.id).then(() => {
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
      getAppList()
        .then(data => {
          dataSource.value = appList.value;
        })
        .finally(() => {
          hide();
        });
    }

    onMounted(() => {
      fetchData();
    });

    return () => (
      <>
        <div class="d-flex justify-end mar-b-3">
          <RouterLink to={{ name: "system-app-add" }} class="ant-btn">
            添加
          </RouterLink>
        </div>
        <Table bordered columns={columns} pagination={false} dataSource={dataSource.value}></Table>
      </>
    );
  },
});
