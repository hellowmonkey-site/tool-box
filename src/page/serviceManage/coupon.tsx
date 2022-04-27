import { TableData } from "@/config/type";
import { defaultCouponData, defaultCouponSearch, getCouponList, ICouponData, ICouponSearch } from "@/service/coupon";
import { Button, Table, message, Form, FormItem, Input, Card, Row, Col } from "ant-design-vue";
import { defineComponent, onMounted, reactive } from "vue";
import { onBeforeRouteUpdate, useRouter } from "vue-router";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    const route = useRouter();
    // 搜索参数
    const searchParams = reactive<ICouponSearch>({
      ...defaultCouponSearch,
    });
    // 返回结果
    const dataSource = reactive<ICouponData>({
      ...defaultCouponData,
    });

    const columns = [
      {
        dataIndex: "id",
        title: "ID",
      },
      {
        dataIndex: "name",
        title: "增值券名称",
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
        dataIndex: "status",
        title: "状态",
        customRender({ record }: TableData) {
          return <>{record.status === 1 ? "已上线" : "已下线"}</>;
        },
      },
    ];

    function fetchData() {
      const hide = message.loading("数据加载中...");
      getCouponList(searchParams)
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
              <FormItem name="name" label="增值券名称">
                <Input placeholder="请输入增值券名称" v-model={[searchParams.name, "value"]}></Input>
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
              共<span class="font-primary font-bold font-large">{dataSource.totals}</span>个增值券
            </span>
          }
          extra={
            <div class="d-flex justify-center direction-row align-items-center">
              <Button
                class="mar-r-2-item"
                type="primary"
                onClick={() => {
                  fetchData();
                }}
              >
                刷新
              </Button>
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
