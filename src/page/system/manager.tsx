import Avatar from "@/component/common/Avatar";
import { PageData, PageParamsType, TableData } from "@/config/type";
import { deleteManager, getManagerPageList, IManager } from "@/service/manager";
import { Button, message, Modal, Table } from "ant-design-vue";
import { defineComponent, onMounted, reactive, ref } from "vue";
import { RouterLink } from "vue-router";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    const form = reactive<
      PageParamsType & {
        parent_id: number;
      }
    >({
      parent_id: 0,
      page_size: 20,
      page: 1,
    });
    const dataSource = ref<PageData<IManager>>();
    const columns = [
      {
        dataIndex: "id",
        title: "ID",
      },
      {
        dataIndex: "username",
        title: "登录账号",
      },
      {
        key: "avatar",
        title: "头像",
        customRender({ record }: TableData<IManager>) {
          return record.avatar ? <Avatar src={record.avatar.path} /> : null;
        },
      },
      {
        key: "roles",
        title: "角色",
        customRender({ record }: TableData<IManager>) {
          return Array.from(record.roles).join(",");
        },
      },
      {
        dataIndex: "home_url",
        title: "首页地址",
      },
      {
        key: "action",
        title: "操作",
        customRender({ record }: TableData<IManager>) {
          return (
            <>
              <RouterLink to={{ name: "system-manager-edit", params: { id: record.id } }} class="mar-r-2-item ant-btn ant-btn-primary">
                编辑
              </RouterLink>
              <Button
                class="mar-r-2-item"
                danger
                onClick={() => {
                  Modal.confirm({
                    title: `确认要删除${record.username}吗？`,
                    onOk: () => {
                      return deleteManager(record.id).then(() => {
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
      const hide = message.loading("加载中...");
      getManagerPageList(form)
        .then(data => {
          dataSource.value = data;
        })
        .finally(() => {
          hide();
        });
    }

    onMounted(() => {
      fetchData();
    });

    return () => (
      <div class="content-box">
        <div class="d-flex justify-end mar-b-3">
          <RouterLink to={{ name: "system-manager-add" }} class="ant-btn ant-btn-primary">
            添加员工
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
      </div>
    );
  },
});
