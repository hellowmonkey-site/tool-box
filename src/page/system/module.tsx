import { TableData } from "@/config/type";
import { deleteModule, getModuleList, IModule, moduleList } from "@/service/module";
import { Button, message, Modal, Table } from "ant-design-vue";
import { defineComponent, onMounted } from "vue";
import { RouterLink } from "vue-router";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    const columns = [
      {
        dataIndex: "id",
        title: "ID",
      },
      {
        dataIndex: "title",
        title: "模块名称",
      },
      {
        dataIndex: "sort",
        title: "排序",
      },
      {
        key: "action",
        title: "操作",
        customRender({ record }: TableData<IModule>) {
          return (
            <>
              <RouterLink to={{ name: "system-module-edit", params: { id: record.id } }} class="mar-r-2-item ant-btn ant-btn-primary">
                编辑
              </RouterLink>
              <Button
                class="mar-r-2-item"
                danger
                onClick={() => {
                  Modal.confirm({
                    title: `确认要删除${record.title}吗？`,
                    onOk: () => {
                      return deleteModule(record.id).then(() => {
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
      getModuleList().finally(() => {
        hide();
      });
    }

    onMounted(() => {
      fetchData();
    });

    return () => (
      <div class="content-box">
        <div class="d-flex justify-end mar-b-3">
          <RouterLink to={{ name: "system-module-add" }} class="ant-btn">
            添加
          </RouterLink>
        </div>
        <Table bordered columns={columns} pagination={false} dataSource={moduleList.value}></Table>
      </div>
    );
  },
});
