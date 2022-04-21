import UploadImageList from "@/component/UploadImageList";
import { StorageType } from "@/config/type";
import router from "@/router";
import { defaultBanner, getBannerDetail, IBananer, postBanner, putBanner } from "@/service/banner";
import { removeTab } from "@/service/common";
import { Button, Form, FormItem, Input, Modal, Radio, RadioGroup } from "ant-design-vue";
import { defineComponent, onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
  props: {
    id: {
      type: Number,
      default: null,
    },
  },
  emits: [],
  setup: (props, ctx) => {
    const form = reactive<IBananer>({
      ...defaultBanner,
    });
    const isAddPage = props.id === null;
    const route = useRoute();

    const imgPath = ref<string>("");

    const handleSubmit = (params: IBananer) => {
      Modal.confirm({
        title: `确认${isAddPage ? "添加" : "编辑此"}幻灯？`,
        onOk: () => {
          if (form.img_path) {
            params.img_path = form.img_path
          }
          return (isAddPage ? postBanner({ ...params }) : putBanner(form)).then(e => {
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
        getBannerDetail(props.id).then(data => {
          form.id = data.id;
          form.name = data.name;
          form.status = data.status;
          form.url = data.url;
          if (data.img_id) {
            form.img_path = data.img_id
          }
          imgPath.value = data.img_path.toString()
        });
      }
    });

    function checkImages() {
      if (form.img_path && form.img_path > 0) {
        return Promise.resolve();
      }
      return Promise.reject(new Error('请先上传图片!'));
    }

    return () => (
      <Form model={form} labelCol={{ sm: 4 }} onFinish={e => handleSubmit(e)}>
        <FormItem name="name" label="名称" rules={[{ required: true, message: "请先输入名称" }]}>
          <Input placeholder="请输入标题" v-model={[form.name, "value"]}></Input>
        </FormItem>
        <FormItem name="img_path" label="上传图片" rules={[{required: true, validator: checkImages }]}>
          <UploadImageList images={[{id: 0, path:imgPath.value}]} maxCount={1} onChange={e=>{
            if (e && e.length > 0) {
              form.img_path = e[0].id
              imgPath.value = e[0].path
            } else {
              form.img_path = 0
              imgPath.value = ""
            }
          }}></UploadImageList>
        </FormItem>
        <FormItem name="url" label="url">
          <Input placeholder="请输入url" v-model={[form.url, "value"]}></Input>
        </FormItem>
        <FormItem name="status" label="是否上线">
          <RadioGroup v-model={[form.status, 'value']}>
            <Radio value={1}>是</Radio>
            <Radio value={0}>否</Radio>
          </RadioGroup>
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
