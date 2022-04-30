import { StatusType, TableData } from "@/config/type";
import {
  defaultNetAddress,
  defaultNetAddressData,
  defaultNetAddressSearch,
  deleteNetAddress,
  getNetAddressList,
  INetAddress,
  INetAddressData,
  INetAddressSearch,
  putNetAddress,
} from "@/service/netAddress";
import { Button, Modal, Table, message, Form, FormItem, Input, Card, Row, Col } from "ant-design-vue";
import { defineComponent, onMounted, reactive } from "vue";
import { onBeforeRouteUpdate, RouterLink } from "vue-router";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    // 搜索参数
    const searchParams = reactive<INetAddressSearch>({
      ...defaultNetAddressSearch,
    });
    // 返回结果
    const dataSource = reactive<INetAddressData>({
      ...defaultNetAddressData,
    });
    const columns = [
      {
        dataIndex: "id",
        title: "ID",
      },
      {
        dataIndex: "name",
        title: "服务网点名称",
      },
      {
        dataIndex: "address",
        title: "地址",
      },
      {
        dataIndex: "longlat",
        title: "经纬度",
      },
      {
        dataIndex: "created_at",
        title: "创建时间",
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
              <RouterLink to={{ name: "system-netAddress-edit", params: { id: record.id } }} class="mar-r-2-item ant-btn ant-btn-primary">
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
                        const sendItem: INetAddress = defaultNetAddress;
                        sendItem.id = data[0].id;
                        sendItem.name = data[0].name;
                        sendItem.address = data[0].address;
                        sendItem.long = data[0].long;
                        sendItem.lat = sendItem.lat;
                        sendItem.status = data[0].status === 1 ? 0 : 1;
                        return putNetAddress(sendItem).then(() => {
                          fetchData();
                        });
                      }
                    },
                  });
                }}
              >
                {record.status === StatusType.ONLINE ? "下线" : "上线"}
              </Button>
              <Button
                class="mar-r-2-item"
                danger
                onClick={() => {
                  Modal.confirm({
                    title: `确认要删除${record.name}吗？`,
                    onOk: () => {
                      return deleteNetAddress(record.id).then(() => {
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
      getNetAddressList(searchParams)
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

    return () => (
      <div class="content-box">
        <Form model={searchParams} onFinish={e => fetchData()} layout="vertical" class="d-flex flex-item-extend">
          <Row align="top" gutter={[20, 20]} justify="start" wrap={true} class="flex-item-extend">
            <Col flex={1} span={6}>
              <FormItem name="name" label="服务网点名称">
                <Input placeholder="请输入服务网点名称" v-model={[searchParams.name, "value"]}></Input>
              </FormItem>
            </Col>
            <Col flex={1} span={6} push={14}>
              <div class="d-flex justify-center direction-row align-items-center">
                <Button htmlType="submit" type="primary">
                  查询
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
        <Card
          bodyStyle={{ "padding-bottom": 0, "border-top": "none" }}
          title={
            <span class="font-normal font-small">
              共<span class="font-primary font-bold font-large">{dataSource.totals}</span>个服务网点
            </span>
          }
          extra={
            <div class="d-flex justify-center direction-row align-items-center">
              <RouterLink to={{ name: "system-netAddress-add" }} class="ant-btn ant-btn-primary">
                新增
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
