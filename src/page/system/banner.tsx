import OperationTip from "@/component/OperationTip";
import { TableData } from "@/config/type";
import router from "@/router";
import { deleteBanner, IBananer, offlineBanner, onlineBanner } from "@/service/banner";
import { PlusOutlined } from "@ant-design/icons-vue";
import { Button, message, Modal, Table, Breadcrumb, BreadcrumbItem, Pagination, Tabs, TabPane, Input, Form, DatePicker } from "ant-design-vue";
import { defineComponent, onMounted, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    const dataSource = ref<IBananer[]>([]);
    const route = useRouter()

    function handleSubmit(e: Event) {
      console.log(e)
    }
    function fetchData() {

    }

    const columns = [
      {
        dataIndex: "id",
        title: "ID",
      },
      {
        dataIndex: "title",
        title: "标题",
      },
      {
        dataIndex: "content",
        title: "内容",
      },
      {
        dataIndex: "type",
        title: "方式",
      },
      {
        dataIndex: "way",
        title: "投放终端",
      },
      {
        dataIndex: "pos",
        title: "投放位置",
      },
      {
        dataIndex: "pic",
        title: "图片",
      },
      {
        dataIndex: "sort",
        title: "排序",
      },
      {
        dataIndex: "status",
        title: "状态",
      },
      {
        key: "action",
        title: "操作",
        customRender({ record }: TableData) {
          return (
            <>
              <Button
                class="mar-r-2-item"
                danger
                onClick={() => {
                  Modal.confirm({
                    title: `确认要上线${record.title}吗？`,
                    onOk: () => {
                      return onlineBanner(record.id).then(() => {
                        fetchData();
                      });
                    },
                  });
                }}
              >
                上线
              </Button>
              <Button
                class="mar-r-2-item"
                danger
                onClick={() => {
                  Modal.confirm({
                    title: `确认要下线${record.title}吗？`,
                    onOk: () => {
                      return offlineBanner(record.id).then(() => {
                        fetchData();
                      });
                    },
                  });
                }}
              >
                下线
              </Button>
              <Button
                class="mar-r-2-item"
                danger
                onClick={() => {
                  Modal.confirm({
                    title: `确认要删除${record.title}吗？`,
                    onOk: () => {
                      return deleteBanner(record.id).then(() => {
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

    return () => (
      <div>
        <div class='d-flex justify-between direction-row align-items-center'>
          <Tabs class="flex-item-extend">
            <TabPane key="1" tab="幻灯片列表">
            </TabPane>
            <TabPane key="2" tab="已上线"></TabPane>
            <TabPane key="3" tab="已下线"></TabPane>
          </Tabs>
          <RouterLink to={{ name: "system-banner-add" }} class="mar-l-5 mar-b-5 ant-btn ant-btn-primary">
                新 增
          </RouterLink>
        </div>
          <div>
            
          </div>
          <Form class="d-block" onSubmit={e=>{ handleSubmit(e) }}>
            <div class="d-flex justify-between direction-row align-items-start border pad-3">
              <div class="flex-item-extend wrap d-flex justify-start direction-row align-items-start">
                <div class="wrap-nowrap d-flex justify-start direction-row align-items-center">
                  <span class="space-nowrap mar-r-3">幻灯标题</span>
                  <Input></Input>
                </div>
                <div class="wrap-nowrap mar-l-5 d-flex justify-start direction-row align-items-center">
                  <span class="space-nowrap mar-r-3 mar-l-3">创建日期</span>
                  <DatePicker></DatePicker>
                </div>
              </div>
              <Button type="primary" class="font-light mar-l-3">查询</Button>
            </div>
          </Form>
        
        <Table columns={columns} pagination={false} dataSource={dataSource.value}>
        </Table>
        <div class="d-flex direction-row justify-end mar-t-5">
          <Pagination hideOnSinglePage={true}></Pagination>
        </div>
      </div>
    );
  },
});

