import { TableData } from "@/config/type";
import router from "@/router";
import { defaultBanner, deleteBanner, getBannerList, IBananer, putBanner } from "@/service/banner";
import { Button, Image, Modal, Table, Pagination, Tabs, TabPane, Input, Form, DatePicker, message, FormItem } from "ant-design-vue";
import { Key } from "ant-design-vue/lib/_util/type";
import { defineComponent, onMounted, ref } from "vue";
import { onBeforeRouteUpdate, RouterLink, useRouter } from "vue-router";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    const dataSource = ref<IBananer[]>([]);
    const route = useRouter()

    const columns = [
      {
        dataIndex: "id",
        title: "ID",
      },
      {
        dataIndex: "name",
        title: "标题",
      },
      {
        dataIndex: "pic",
        title: "图片",
        customRender({ record }: TableData) {
          return (
            <>
              <Image width={80} height={80} src={record.img_path} placeholder={true}></Image>
            </>
          );
        },
      },
      {
        dataIndex: "url",
        title: "url",
      },
      {
        dataIndex: "status",
        title: "状态",
        customRender({ record }: TableData) {
          return (
            <>
              {record.status===1?"上线":"下线"}
            </>
          );
        },
      },
      {
        key: "action",
        title: "操作",
        customRender({ record }: TableData) {
          return (
            <>
            <RouterLink to={{ name: "system-banner-edit", params: { id: record.id } }} class="mar-r-2-item ant-btn ant-btn-primary">
             编辑
            </RouterLink>
            <Button
                class="mar-r-2-item"
                onClick={() => {
                  Modal.confirm({
                    title: `确认要${record.status===1?"下线":"上线"}${record.name}吗？`,
                    onOk: () => {
                      const data = dataSource.value.filter(item=> item.id===record.id)
                      if (data && data.length>0) {
                        const sendItem: IBananer = defaultBanner;
                        sendItem.id = data[0].id 
                        sendItem.name = data[0].name
                        sendItem.img_path = data[0].img_id || ""
                        sendItem.url = sendItem.url || ""
                        sendItem.status = data[0].status===1?0:1
                        return putBanner(sendItem).then(() => {
                          fetchData();
                        });
                      }
                    },
                  });
                }}
              >
                {record.status===1?"下线":"上线"}
              </Button>
              <Button
                class="mar-r-2-item"
                danger
                onClick={() => {
                  Modal.confirm({
                    title: `确认要删除${record.name}吗？`,
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

    function fetchData() {
      const hide = message.loading("数据加载中...");
      getBannerList()
        .then(data => {
          dataSource.value = data;
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
        <div class='d-flex justify-end direction-row align-items-center'>
          {/* <Tabs class="flex-item-extend" onTabClick={ e => { fetchData(e) } }>
            <TabPane key="1" tab="幻灯片列表">
            </TabPane>
            <TabPane key="2" tab="已上线"></TabPane>
            <TabPane key="3" tab="已下线"></TabPane>
          </Tabs> */}
          <RouterLink to={{ name: "system-banner-add" }} class="mar-l-5 mar-b-5 ant-btn ant-btn-primary">
                新 增
          </RouterLink>
        </div>
        <Table columns={columns} pagination={false} dataSource={dataSource.value}>
        </Table>
        <div class="d-flex direction-row justify-end mar-t-5">
          <Pagination hideOnSinglePage={true}></Pagination>
        </div>
      </div>
    );
  },
});

