import router from "@/router";
import { defaultGiftBag, getGiftBagDetail, IGiftBag, postGiftBag, putGiftBag } from "@/service/giftBag";
import { removeRouteTab } from "@/service/common";
import {
  Button,
  Col,
  Form,
  FormItem,
  Input,
  InputNumber,
  Modal,
  Radio,
  RadioGroup,
  Row,
  Select,
  SelectOption,
  Space,
} from "ant-design-vue";
import { defineComponent, onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { defaultCoupon, getAllCouponList, ICoupon } from "@/service/coupon";
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons-vue";
import { Rule } from "ant-design-vue/lib/form";

export default defineComponent({
  props: {
    id: {
      type: Number,
      default: null,
    },
  },
  emits: [],
  setup: (props, ctx) => {
    const form = reactive<IGiftBag>({
      ...defaultGiftBag,
    });
    const isAddPage = props.id === null;
    const route = useRoute();
    const couponList = ref<ICoupon[]>([]);

    const handleSubmit = (params: IGiftBag) => {
      Modal.confirm({
        title: `确认${isAddPage ? "添加" : "编辑此"}增值礼包？`,
        onOk: () => {
          return (isAddPage ? postGiftBag({ ...params }) : putGiftBag(form)).then(e => {
            router.back();
            removeRouteTab(String(route.name));
          });
        },
      });
    };

    onMounted(() => {
      if (!isAddPage) {
        getGiftBagDetail(props.id).then(data => {
          form.id = data.id;
          form.name = data.name;
          form.status = data.status;
          form.price = data.price;
          form.start_money = data.start_money;
          form.end_money = data.end_money;
          form.coupon = data.coupon;
        });
      } else {
      }
      getAllCouponList().then(data => {
        couponList.value = data;
      });
    });

    function clickPlusCoupon() {
      form.coupon.push("");
    }
    function clickMinusCoupon(index: number) {
      if (index >= 0 && index < form.coupon.length) {
        form.coupon.splice(index, 1);
      }
    }

    const checkPrice = async (_rule: Rule, value: string) => {
      if (!value) {
        return Promise.reject("请输入报价");
      }
      if (Number(value) <= 0) {
        return Promise.reject("请输入正确的报价");
      } else {
        return Promise.resolve();
      }
    };
    const checkStartMoney = async (_rule: Rule, value: string) => {
      if (!value) {
        return Promise.reject("请输入限制金额");
      }
      if (Number(value) <= 0) {
        return Promise.reject("请输入正确的限制金额");
      } else if (Number(value) >= form.end_money) {
        return Promise.reject("最小限制金额必须小于最大限制金额");
      } else {
        return Promise.resolve();
      }
    };
    const checkEndMoney = async (_rule: Rule, value: string) => {
      if (!value) {
        return Promise.reject("请输入限制金额");
      }
      if (Number(value) <= 0) {
        return Promise.reject("请输入正确的限制金额");
      } else if (Number(value) <= form.start_money) {
        return Promise.reject("最大限制金额必须大于最大限制金额");
      } else {
        return Promise.resolve();
      }
    };

    const rules: Record<string, Rule[]> = {
      price: [{ required: true, validator: checkPrice, trigger: "change" }],
      start_money: [{ required: true, validator: checkStartMoney, trigger: "change" }],
      end_money: [{ required: true, validator: checkEndMoney, trigger: "change" }],
    };

    return () => (
      <Form model={form} labelCol={{ sm: 4 }} onFinish={e => handleSubmit(e)} rules={rules}>
        <FormItem name="name" label="增值礼包名称" rules={[{ required: true, message: "请先输入增值礼包名称" }]}>
          <Input placeholder="请输入增值礼包名称" v-model={[form.name, "value"]}></Input>
        </FormItem>
        <Row align="top" justify="start" wrap={true}>
          <Col span={24}>
            <FormItem name="coupon" label="增值券添加" rules={[{ required: true, message: "请选择增值券" }]}>
              <div class="d-flex align-items-start justify-between">
                <Select placeholder="请选择增值券" class="d-flex flex-item-extend">
                  {" "}
                  {couponList.value.map(item => {
                    return <SelectOption value={item.id}>{item.name}</SelectOption>;
                  })}
                </Select>
                <FormItem name="coupon_num" class="mar-l-5" style="width: 120px;">
                  <InputNumber defaultValue={1} min={1} placeholder="增值券数量" addonAfter="个"></InputNumber>
                </FormItem>
              </div>

              {form.coupon.length === 0 ? (
                <PlusCircleOutlined style={{ "font-size": "20px", "margin-top": "10px" }} onClick={clickPlusCoupon} />
              ) : null}
            </FormItem>
          </Col>
          {form.coupon.length > 0
            ? form.coupon.map((currentCoupon, index) => {
                return (
                  <Col span={20} push={4}>
                    <FormItem>
                      <div class={["d-flex justify-start direction-row align-items-center", index > 0 ? "mar-t-3" : ""]}>
                        <Select placeholder="请选择增值券" class="d-flex flex-item-extend">
                          {" "}
                          {couponList.value.map(item => {
                            return <SelectOption value={item.id}>{item.name}</SelectOption>;
                          })}
                        </Select>
                        <MinusCircleOutlined
                          style={{ "font-size": "20px", "margin-left": "10px" }}
                          onClick={() => {
                            clickMinusCoupon(index);
                          }}
                        />
                      </div>
                      {index === form.coupon.length - 1 ? (
                        <PlusCircleOutlined style={{ "font-size": "20px", "margin-top": "10px" }} onClick={clickPlusCoupon} />
                      ) : null}
                    </FormItem>
                  </Col>
                );
              })
            : null}
        </Row>
        <FormItem hasFeedback={true} class="d-flex flex-item-extend" name="price" label="报价">
          <InputNumber
            class="d-flex full-width"
            placeholder="请输入报价"
            precision={2}
            min={0}
            v-model={[form.price, "value"]}
          ></InputNumber>
        </FormItem>
        <FormItem label="限制金额" rules={[{ required: true }]}>
          <div class="d-flex justify-around direction-row align-items-center">
            <FormItem name="start_money" class="d-flex flex-item-extend">
              <InputNumber
                class="full-width"
                precision={2}
                min={0}
                placeholder="请输入限制金额"
                v-model={[form.start_money, "value"]}
              ></InputNumber>
            </FormItem>
            <FormItem>
              <div class="mar-l-5 mar-r-5"> - </div>
            </FormItem>
            <FormItem label="" class="d-flex flex-item-extend">
              <InputNumber
                name="end_money"
                class="full-width"
                precision={2}
                min={0}
                placeholder="请输入限制金额"
                v-model={[form.end_money, "value"]}
              ></InputNumber>
            </FormItem>
          </div>
        </FormItem>
        <FormItem name="status" label="是否上线">
          <RadioGroup v-model={[form.status, "value"]}>
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
