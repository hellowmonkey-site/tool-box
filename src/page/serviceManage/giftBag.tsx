import { TableData } from "@/config/type";
import { ICoupon } from "@/service/coupon";
import {
  defaultGiftBag,
  defaultGiftBagData,
  defaultGiftBagSearch,
  deleteGiftBag,
  getGiftBagList,
  IGiftBag,
  IGiftBagData,
  IGiftBagSearch,
  putGiftBag,
} from "@/service/giftBag";
import { Button, Modal, Table, message, Form, FormItem, Input, Card, Row, Col, List } from "ant-design-vue";
import { defineComponent, onMounted, reactive } from "vue";
import { onBeforeRouteUpdate, RouterLink, useRouter } from "vue-router";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    const route = useRouter();
    // 搜索参数
    const searchParams = reactive<IGiftBagSearch>({
      ...defaultGiftBagSearch,
    });
    // 返回结果
    const dataSource = reactive<IGiftBagData>({
      ...defaultGiftBagData,
    });
    const columns = [
      {
        dataIndex: "id",
        title: "ID",
      },
      {
        dataIndex: "name",
        title: "增值礼包名称",
      },
      {
        dataIndex: "content",
        title: "礼包内容",
        customRender({ record }: TableData) {
          return (
            <>
              <List size="small" dataSource={record.coupon.map((item: ICoupon) => item.name)}></List>
            </>
          );
        },
      },
      {
        dataIndex: "price",
        title: "报价",
      },
      {
        dataIndex: "created_at",
        title: "创建时间",
      },
      {
        dataIndex: "status",
        title: "状态",
        customRender({ record }: TableData) {
          return <>{record.status === 1 ? "上线" : "下线"}</>;
        },
      },
      {
        key: "action",
        title: "操作",
        customRender({ record }: TableData) {
          return (
            <>
              <Button
                class="mar-r-2-item"
                onClick={() => {
                  Modal.confirm({
                    title: `确认要${record.status === 1 ? "下线" : "上线"}${record.name}吗？`,
                    onOk: () => {
                      const data = dataSource.items.filter(item => item.id === record.id);
                      if (data && data.length > 0) {
                        const sendItem: IGiftBag = defaultGiftBag;
                        sendItem.id = data[0].id;
                        sendItem.name = data[0].name;
                        sendItem.start_money = data[0].start_money;
                        sendItem.end_money = data[0].end_money;
                        sendItem.price = sendItem.price;
                        sendItem.status = data[0].status === 1 ? 0 : 1;
                        return putGiftBag(sendItem).then(() => {
                          fetchData();
                        });
                      }
                    },
                  });
                }}
              >
                {record.status === 1 ? "下线" : "上线"}
              </Button>
              <Button
                class="mar-r-2-item"
                danger
                onClick={() => {
                  Modal.confirm({
                    title: `确认要删除${record.name}吗？`,
                    onOk: () => {
                      return deleteGiftBag(record.id).then(() => {
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
      getGiftBagList(searchParams)
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
      <div>
        <Form model={searchParams} onFinish={e => fetchData()} layout="vertical" class="d-flex flex-item-extend">
          <Row align="top" gutter={[20, 20]} justify="start" wrap={true} class="flex-item-extend">
            <Col flex={1} span={6}>
              <FormItem name="name" label="增值礼包名称">
                <Input placeholder="请输入增值礼包名称" v-model={[searchParams.name, "value"]}></Input>
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
              共<span class="font-primary font-bold font-large">{dataSource.totals}</span>个增值礼包
            </span>
          }
          extra={
            <div class="d-flex justify-center direction-row align-items-center">
              <RouterLink to={{ name: "service-giftBag-add" }} class="ant-btn ant-btn-primary">
                设置申请
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
