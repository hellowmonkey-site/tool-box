import { TableData } from "@/config/type";
import { deleteRouter, getRouterList, IRoute } from "@/service/route";
import { Button, message, Modal, Table } from "ant-design-vue";
import { defineComponent, onMounted, ref } from "vue";
import { onBeforeRouteUpdate, RouterLink, useRoute } from "vue-router";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    const route = useRoute();
    const dataSource = ref<IRoute[]>([]);
    let parentId = 0;
    const columns = [
      {
        dataIndex: "id",
        title: "ID",
      },
      {
        dataIndex: "name",
        title: "标题",
      },
      {
        key: "is_menu",
        title: "是不是菜单",
        customRender({ record }: TableData<IRoute>) {
          return record.is_menu ? "是" : "否";
        },
      },
      {
        dataIndex: "sort",
        title: "排序",
      },
      {
        dataIndex: "key",
        title: "name",
      },
      {
        key: "action",
        title: "操作",
        customRender({ record }: TableData<IRoute>) {
          return (
            <>
              <RouterLink to={{ name: "system-route-index", query: { parent_id: record.id } }} class="mar-r-2-item ant-btn">
                查看子页面
              </RouterLink>
              <RouterLink to={{ name: "system-route-edit", params: { id: record.id } }} class="mar-r-2-item ant-btn ant-btn-primary">
                编辑
              </RouterLink>
              <Button
                class="mar-r-2-item"
                danger
                onClick={() => {
                  console.log(record);
                  Modal.confirm({
                    title: `确认要删除${record.name}吗？`,
                    onOk: () => {
                      return deleteRouter(record.id).then(() => {
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
      getRouterList(parentId)
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
      <div class="content-box">
        <div class="d-flex justify-end mar-b-3">
          <RouterLink to={{ name: "system-route-add", query: { parent_id: parentId } }} class="ant-btn">
            添加页面
          </RouterLink>
          <Button
            onClick={() => {
              electronAPI.setTitle("hahahaha");
            }}
          >
            换标题
          </Button>
        </div>
        <Table bordered columns={columns} pagination={false} dataSource={dataSource.value}></Table>
      </div>
    );
  },
});
