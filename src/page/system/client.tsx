import MainBox from "@/component/common/MainBox";
import { PageData, PageParamsType, StatusType, TableData } from "@/config/type";
import { deleteClient, getClientPageList, IClient } from "@/service/client";
import { Button, Input, message, Modal, Table } from "ant-design-vue";
import { defineComponent, onMounted, reactive, ref } from "vue";
import { onBeforeRouteUpdate, RouterLink, useRoute } from "vue-router";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    const route = useRoute();
    const dataSource = ref<PageData<IClient>>();

    const form = reactive<
      PageParamsType & {
        parent_id: number;
        name?: string;
      }
    >({
      name: "",
      parent_id: 0,
      page_size: 20,
      page: 1,
    });

    const columns = [
      {
        dataIndex: "id",
        title: "ID",
      },
      {
        dataIndex: "name",
        title: "名称",
      },
      {
        dataIndex: "short_name",
        title: "简称",
      },
      {
        key: "key",
        title: "状态",
        customRender({ record }: TableData<IClient>) {
          return record.status === StatusType.OFFLINE ? "下线" : "上线";
        },
      },
      {
        key: "action",
        title: "操作",
        customRender({ record }: TableData<IClient>) {
          return (
            <>
              <RouterLink to={{ name: "system-client-index", query: { parent_id: record.id } }} class="mar-r-2-item ant-btn">
                查看子商家
              </RouterLink>
              <RouterLink to={{ name: "system-client-edit", params: { id: record.id } }} class="mar-r-2-item ant-btn ant-btn-primary">
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
                      return deleteClient(record.id).then(() => {
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
      getClientPageList(form)
        .then(data => {
          dataSource.value = data;
        })
        .finally(() => {
          hide();
        });
    }

    onBeforeRouteUpdate(e => {
      form.parent_id = Number(e.query.parent_id || 0);
      fetchData();
    });

    onMounted(() => {
      form.parent_id = Number(route.query.parent_id || 0);
      fetchData();
    });

    return () => (
      <MainBox
        onSearch={fetchData}
        searchList={[
          {
            tip: "名称",
            component() {
              return <Input placeholder="请输入名称" v-model={[form.name, "value"]} />;
            },
          },
        ]}
      >
        <div class="d-flex justify-end mar-b-3">
          <RouterLink to={{ name: "system-client-add", query: { parent_id: form.parent_id } }} class="ant-btn">
            添加商家
          </RouterLink>
        </div>
        <Table
          bordered
          columns={columns}
          pagination={{
            total: dataSource.value?.totals,
            current: dataSource.value?.page,
            pageSize: dataSource.value?.per_page,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal(total, range) {
              return `共${total}条数据, 当前为${range.join("-")}条`;
            },
            onChange(page, pageSize) {
              form.page = page;
              form.page_size = pageSize;
              fetchData();
            },
          }}
          dataSource={dataSource.value?.items}
        ></Table>
      </MainBox>
    );
  },
});
