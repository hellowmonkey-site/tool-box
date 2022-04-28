import { StatusType, TableData } from "@/config/type";
import {
  defaultCarService,
  defaultCarServiceData,
  defaultCarServiceSearch,
  deleteCarService,
  getCarServiceList,
  ICarService,
  ICarServiceData,
  ICarServiceSearch,
  putCarService,
} from "@/service/carService";
import { Button, Modal, Table, message, Form, FormItem, Input, RangePicker, Card, Row, Col } from "ant-design-vue";
import { defineComponent, onMounted, reactive, ref } from "vue";
import { onBeforeRouteUpdate, RouterLink, useRouter } from "vue-router";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    const route = useRouter();
    // 搜索参数
    const searchParams = reactive<ICarServiceSearch>({
      ...defaultCarServiceSearch,
    });
    // 返回结果
    const dataSource = reactive<ICarServiceData>({
      ...defaultCarServiceData,
    });

    const dateSelect = ref<[string, string]>(["", ""]);

    const columns = [
      {
        dataIndex: "id",
        title: "ID",
      },
      {
        dataIndex: "name",
        title: "增值服务名称",
      },
      {
        dataIndex: "url",
        title: "跳转链接",
      },
      {
        dataIndex: "created_at",
        title: "创建时间",
      },
      {
        dataIndex: "update_at",
        title: "更新时间",
      },
      {
        dataIndex: "status",
        title: "状态",
        customRender({ record }: TableData) {
          return <>{record.status === StatusType.ONLINE ? "上线" : "下线"}</>;
        },
      },
      {
        key: "action",
        title: "操作",
        customRender({ record }: TableData) {
          return (
            <>
              <RouterLink to={{ name: "service-carService-edit", params: { id: record.id } }} class="mar-r-2-item ant-btn ant-btn-primary">
                编辑
              </RouterLink>
              <Button
                class="mar-r-2-item"
                onClick={() => {
                  Modal.confirm({
                    title: `确认要${record.status === StatusType.ONLINE ? "下线" : "上线"}${record.name}吗？`,
                    onOk: () => {
                      const data = dataSource.items.filter(item => item.id === record.id);
                      if (data && data.length > 0) {
                        const sendItem: ICarService = defaultCarService;
                        sendItem.id = data[0].id;
                        sendItem.name = data[0].name;
                        sendItem.img_path = data[0].img_id || "";
                        sendItem.url = sendItem.url || "";
                        sendItem.status = data[0].status === 1 ? 0 : 1;
                        return putCarService(sendItem).then(() => {
                          fetchData();
                        });
                      }
                    },
                  });
                }}
              >
                {record.status === StatusType.ONLINE ? "已下线" : "已上线"}
              </Button>
              <Button
                class="mar-r-2-item"
                danger
                onClick={() => {
                  Modal.confirm({
                    title: `确认要删除${record.name}吗？`,
                    onOk: () => {
                      return deleteCarService(record.id).then(() => {
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

      searchParams.start_time = dateSelect.value[0] || "";
      searchParams.end_time = dateSelect.value[1] || "";

      getCarServiceList(searchParams)
        .then(data => {
          dataSource.page = data.page;
          dataSource.page_count = data.page_count;
          dataSource.per_page = data.per_page;
          dataSource.items = data.items;
          dataSource.total = data.total;
          dataSource.totals = data.totals;
        })
        .finally(() => {
          hide();
        });
    }

    onBeforeRouteUpdate(e => {
      fetchData();
    });

    onMounted(() => {
      fetchData();
    });

    // function clickTab(e: Key) {
    //   fetchData()
    // }

    return () => (
      <div>
        <Form model={searchParams} onFinish={e => fetchData()} layout="vertical" class="d-flex flex-item-extend">
          <Row align="top" gutter={[20, 20]} justify="start" wrap={true} class="flex-item-extend">
            <Col flex={1} span={6}>
              <FormItem name="name" label="增值服务名称">
                <Input placeholder="请输入增值服务名称" v-model={[searchParams.name, "value"]}></Input>
              </FormItem>
            </Col>
            <Col flex={1} span={8}>
              <FormItem name="created_at" label="查询日期" class="flex-item-extend">
                <RangePicker class="flex-item-extend" v-model={[dateSelect.value, "value"]} valueFormat="YYYY-MM-DD" />
              </FormItem>
            </Col>
            <Col flex={1} span={6} push={6}>
              <div class="d-flex justify-center direction-row align-items-center">
                <Button htmlType="submit" type="primary">
                  查询
                </Button>
              </div>
            </Col>
          </Row>
        </Form>

        {/* <div class="d-flex justify-start direction-row align-items-center">
            
          <div class="d-flex align-items-center justify-center mar-l-5">
              
            </div>
        </div> */}
        <Card
          bodyStyle={{ "padding-bottom": 0, "border-top": "none" }}
          title={
            <span class="font-normal font-small">
              共<span class="font-primary font-bold font-large">{dataSource.totals}</span>个增值服务
            </span>
          }
          extra={
            <div class="d-flex justify-center direction-row align-items-center">
              <RouterLink to={{ name: "service-carService-add" }} class="ant-btn ant-btn-primary">
                新 增
              </RouterLink>
            </div>
          }
        >
          <Table
            columns={columns}
            pagination={{
              showSizeChanger: true,
              onChange(page, pageSize) {
                searchParams.page = page;
                searchParams.row = pageSize;
                fetchData();
              },
            }}
            dataSource={dataSource.items}
          ></Table>
        </Card>
      </div>
    );
  },
});