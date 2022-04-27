import { removeTab, tabList } from "@/service/common";
import { DownOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons-vue";
import { Avatar, Button, Dropdown, LayoutHeader, LayoutSider, Menu, MenuDivider, MenuItem, SubMenu, TabPane, Tabs } from "ant-design-vue";
import { defineComponent, KeepAlive, ref } from "vue";
import { RouteLocationNormalizedLoaded, RouterView, useRoute, useRouter } from "vue-router";
import Logo from "@/static/image/logo.png";
import { userInfo } from "@/service/user";
import { indexName } from "@/router";

interface SliderSubItem {
  name: string;
  key: string;
}

export default defineComponent({
  props: {},
  emits: [],
  setup(props, ctx) {
    const router = useRouter();
    const route = useRoute();
    const collapsed = ref(false);
    const currentName = ref<string>("");
    const activeCurrentTab = () => {
      const prev = tabList.value[tabList.value.length - 1];
      if (!prev) {
        router.replace("/");
        return;
      }
      if (route.name !== prev.name) {
        router.replace({ name: String(prev.name) });
      }
    };

    const sliderItems = [
      // 保险管理
      {
        title: "首页",
        subItems: [],
      },
      {
        title: "保险管理",
        subItems: [
          {
            name: "保险类别列表",
            key: "bxlb",
          },
          {
            name: "方案设置",
            key: "fasz",
          },
        ],
      },
      //订单管理
      {
        title: "订单管理",
        subItems: [
          {
            name: "订单列表",
            key: "ddlb",
          },
        ],
      },
      // 案件管理
      {
        title: "案件管理",
        subItems: [
          {
            name: "案件列表",
            key: "ajlb",
          },
        ],
      },
      // 用户管理
      {
        title: "用户管理",
        subItems: [
          {
            name: "用户列表",
            key: "yhlb",
          },
          {
            name: "车辆列表",
            key: "cllb",
          },
        ],
      },
      // 服务管理
      {
        title: "服务管理",
        subItems: [
          {
            name: "增值礼包列表",
            key: "service-giftBag-index",
          },
          {
            name: "增值卷列表",
            key: "service-coupon-index",
          },
          {
            name: "增值卷查询",
            key: "zzjcx",
          },
          {
            name: "增值服务列表",
            key: "service-carService-index",
          },
        ],
      },
      // 系统管理
      {
        title: "系统管理",
        subItems: [
          {
            name: "幻灯管理",
            key: "system-banner",
          },
          {
            name: "用户管理",
            key: "system-user",
          },
          {
            name: "服务网点",
            key: "system-netAddress-index",
          },
          {
            name: "模块管理",
            key: "system-module-index",
          },
          {
            name: "APP管理",
            key: "system-app-index",
          },
          {
            name: "权限管理",
            key: "system-permission-index",
          },
          {
            name: "路由管理",
            key: "system-route-index",
          },
          {
            name: "角色管理",
            key: "system-role-index",
          },
        ],
      },
    ];

    const mItem = (titleList: SliderSubItem[]) => {
      return titleList.map(item => (
        <MenuItem title="item.name" key={item.key}>
          {{
            default: () => <span>{item.name}</span>,
          }}
        </MenuItem>
      ));
    };

    return () => (
      <div class="d-flex app-layout full-height-vh direction-column">
        <div>
          <LayoutSider
            theme="dark"
            collapsible
            class="app-sider overflow-y-auto slider"
            v-model={[collapsed.value, "collapsed"]}
            trigger={<div class="font-light ant-layout-sider">{collapsed.value ? <RightOutlined /> : <LeftOutlined />}</div>}
          >
            <div class="text-center pad-5 font-light ant-layout-sider">国元经纪在线保险综合服务平台</div>
            <Menu
              theme="dark"
              mode="inline"
              onClick={({ key }) => {
                if (key) {
                  router.push({ name: String(key) });
                }
              }}
            >
              {() =>
                sliderItems.map(item => (
                  <SubMenu title={item.title} key={item.title}>
                    {{
                      default: () => {
                        return mItem(item.subItems);
                      },
                      // icon: () => {
                      //   return <UnorderedListOutlined />
                      // }
                    }}
                  </SubMenu>
                ))
              }
            </Menu>
            <div class="ant-layout-sider" style="height: 50px;"></div>
          </LayoutSider>
        </div>
        <LayoutHeader class="d-flex justify-between align-items-center app-header">
          {/* <img src={Logo} alt="logo" class="app-logo mar-r-5" /> */}
          {/* <Menu theme="dark" mode="horizontal" selectedKeys={["1"]} onSelect={e => console.log(e)} class="flex-item-extend">
            {["1", "2", "3", "4"].map(item => (
              <MenuItem title={item} key={item}>
                一级菜单{item}
              </MenuItem>
            ))}
          </Menu> */}
          <div class={["font-light d-flex app-router", collapsed.value ? "collapsed" : ""]}>{currentName.value}</div>
          <Dropdown>
            {{
              default: () => (
                <div class="d-flex align-items-center">
                  <Avatar src={Logo} />
                  <span class="mar-l-2 font-light mar-r-2">{userInfo.username}</span>
                  <DownOutlined style="color: #fff" />
                </div>
              ),
              overlay: () => (
                <Menu>
                  <MenuItem
                    onClick={e => {
                      console.log(e);
                    }}
                  >
                    修改密码
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem
                    danger
                    onClick={e => {
                      console.log(e);
                      router.push({ name: "login" });
                    }}
                  >
                    退出登录
                  </MenuItem>
                </Menu>
              ),
            }}
          </Dropdown>
        </LayoutHeader>
        {tabList.value.length ? (
          //  pad-b-0 会被app-router 覆盖样式
          <div class={["app-router d-flex", collapsed.value ? "collapsed" : ""]} style="padding-bottom: 0;">
            <Tabs
              hideAdd
              type="editable-card"
              class="flex-item-extend"
              activeKey={String(route.name)}
              onEdit={name => {
                removeTab(String(name));
                activeCurrentTab();
              }}
              onChange={name => {
                const toItem = tabList.value.filter(IItem => IItem.name === name);
                let params = {};
                if (toItem?.length > 0) {
                  params = toItem[0].params;
                }
                router.push({ name: String(route.name), params });
              }}
            >
              {tabList.value.map(item => (
                <TabPane tab={String(item.meta.title || "导航")} closable key={String(item.name)}></TabPane>
              ))}
            </Tabs>

            <Dropdown>
              {{
                default: () => <Button>{{ icon: () => <DownOutlined /> }}</Button>,
                overlay: () => (
                  <Menu>
                    <MenuItem
                      onClick={e => {
                        removeTab(String(route.name));
                        activeCurrentTab();
                      }}
                    >
                      关闭当前
                    </MenuItem>
                    <MenuItem
                      onClick={e => {
                        tabList.value = tabList.value.filter(v => v.name === route.name);
                      }}
                    >
                      关闭其他
                    </MenuItem>
                    <MenuItem
                      onClick={e => {
                        tabList.value = tabList.value.filter(v => v.name === indexName);
                        router.replace({ name: indexName });
                      }}
                    >
                      关闭全部
                    </MenuItem>
                  </Menu>
                ),
              }}
            </Dropdown>
          </div>
        ) : null}
        {
          /* <div class="flex-item-extend pad-l-5 pad-r-5 overflow-y-auto">
          <div class="app-content">
            <LayoutSider collapsible class="app-sider" v-model={[collapsed.value, "collapsed"]}>
              <Menu
                theme="light"
                mode="inline"
                onSelect={({ key }) => {
                  router.push({ name: key });
                }}
              >
                <SubMenu title="二级菜单">
                  {{
                    default: () => {
                      return ["user-index", "article-index"].map(name => (
                        <MenuItem title="111" key={name}>
                          {{
                            default: () => <span>{name}</span>,
                            icon: () => <UpCircleFilled />,
                          }}
                        </MenuItem>
                      ));
                    },
                    icon: () => <UpCircleFilled />,
                  }}
                </SubMenu>
              </Menu>
            </LayoutSider>*/
          <div class={["app-router overflow-x-hidden", collapsed.value ? "collapsed" : ""]}>
            <RouterView>
              {{
                default: ({ Component, route }: { Component: () => JSX.Element; route: RouteLocationNormalizedLoaded }) => {
                  if (route.meta.keepAlive) {
                    return (
                      <KeepAlive>
                        <Component />
                      </KeepAlive>
                    );
                  } else {
                    return <Component />;
                  }
                },
              }}
            </RouterView>
          </div>
          //   </div>
          // </div>
        }
        //{" "}
      </div>
    );
  },
});
