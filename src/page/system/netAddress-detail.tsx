import router from "@/router";
import { defaultNetAddress, getNetAddressDetail, INetAddress, postNetAddress, putNetAddress } from "@/service/netAddress";
import { removeRouteTab } from "@/service/common";
import { Button, Col, Form, FormItem, Input, Modal } from "ant-design-vue";
import { defineComponent, onMounted, reactive } from "vue";
import { useRoute } from "vue-router";
import config from "@/config";
import AMapLoader from "@amap/amap-jsapi-loader";

export default defineComponent({
  props: {
    id: {
      type: Number,
      default: null,
    },
  },
  emits: [],
  setup: (props, ctx) => {
    const form = reactive<INetAddress>({
      ...defaultNetAddress,
    });
    const isAddPage = props.id === null;
    const route = useRoute();

    AMapLoader.load({
      key: config.amapKey,
      version: "2.0",
    })
      .then(AMap => {
        const map = new AMap.Map("address");
        AMap.plugin(["AMap.ToolBar"], function () {
          //异步加载插件
          const toolbar = new AMap.ToolBar();
          map.addControl(toolbar);
        });
      })
      .catch(e => {
        console.log(e);
      });
    // 加载插件

    onMounted(() => {
      if (!isAddPage) {
        getNetAddressDetail(props.id).then(data => {
          form.id = data.id;
          form.name = data.name;
          form.status = data.status;
          form.address = data.address;
          form.long = data.long;
          form.lat = data.lat;
        });
      }
    });

    const handleSubmit = (params: INetAddress) => {
      Modal.confirm({
        title: `确认${isAddPage ? "添加" : "编辑此"}网点？`,
        onOk: () => {
          return (isAddPage ? postNetAddress({ ...params }) : putNetAddress(form)).then(e => {
            router.back();
            removeRouteTab(String(route.name));
          });
        },
      });
    };
    const getLocation = () => {
      return 1;
    };

    return () => (
      <div class="content-box">
        <Form model={form} labelCol={{ sm: 4 }} onFinish={e => handleSubmit(e)}>
          <FormItem name="name" label="服务网点名称" rules={[{ required: true, message: "请先输入服务器网点名称" }]}>
            <Input placeholder="请输入名称" v-model={[form.name, "value"]}></Input>
          </FormItem>
          <FormItem name="address" label="地址" rules={[{ required: true, message: "请先输入地址" }]}>
            <div class="d-flex direction-row align-items-center">
              <Input
                placeholder="请输入地址"
                v-model={[form.address, "value"]}
                onPressEnter={e => {
                  getLocation();
                }}
              ></Input>
              <div class="font-gray space-nowrap mar-l-3">按回车键，搜索位置，定位经纬度</div>
            </div>
          </FormItem>
          <Col span={20} push={4} class="mar-t-5">
            <div class="mar-b-5" id="address" style="width: 300px; height: 300px;"></div>
          </Col>
          <FormItem name="long" label="经度" rules={[{ required: true, message: "请先输入经度" }]}>
            <Input placeholder="请输入经度" v-model={[form.long, "value"]}></Input>
          </FormItem>
          <FormItem name="lat" label="纬度" rules={[{ required: true, message: "请先输入纬度" }]}>
            <Input placeholder="请输入纬度" v-model={[form.lat, "value"]}></Input>
          </FormItem>
          <div class="d-flex align-items-center justify-center">
            <Button htmlType="submit" type="primary" size="large">
              提交
            </Button>
          </div>
        </Form>
      </div>
    );
  },
});
