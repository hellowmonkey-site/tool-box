import router from "@/router";
import { defaultNetAddress, getNetAddressDetail, INetAddress, postNetAddress, putNetAddress } from "@/service/netAddress";
import { removeTab } from "@/service/common";
import { Button, Form, FormItem, Input, Modal } from "ant-design-vue";
import { defineComponent, onMounted, reactive } from "vue";
import { useRoute } from "vue-router";
import config from "@/config";


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

    // const loader = new AMapJS.AMapLoader({
    //   key: config.AMAP_KEY,
    //   version: '2.0',
    //   plugins: [],
    //   security: { serviceHost: '您的代理服务器域名或地址/_AMapService' }
    // });

    const handleSubmit = (params: INetAddress) => {
      Modal.confirm({
        title: `确认${isAddPage ? "添加" : "编辑此"}网点？`,
        onOk: () => {
          return (isAddPage ? postNetAddress({ ...params }) : putNetAddress(form)).then(e => {
            router.back();
            if (typeof route.name === 'string') {
              removeTab(route.name)
            }
          });
        },
      });
    };

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

    return () => (
      <Form model={form} labelCol={{ sm: 4 }} onFinish={e => handleSubmit(e)}>
        <FormItem name="name" label="服务网点名称" rules={[{ required: true, message: "请先输入服务器网点名称" }]}>
          <Input placeholder="请输入名称" v-model={[form.name, "value"]}></Input>
        </FormItem>
        <FormItem name="address" label="地址" rules={[{ required: true, message: "请先输入地址" }]}>
          <div class="d-flex direction-row align-items-center">
            <Input 
              placeholder="请输入地址" 
              v-model={[form.address, "value"]} 
              onPressEnter={(e)=>{
                
              }}></Input>
            <div class="font-gray space-nowrap mar-l-3">按回车键，搜索位置，定位经纬度</div>
          </div>
        </FormItem>
        {/* <FormItem>
          <div>
            {
            ()=>{
            }}
          </div>
        </FormItem> */}
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
    );
  },
});
