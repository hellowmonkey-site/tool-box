import { LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons-vue";
import {
  Button,
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutSider,
  Menu,
  MenuItem,
  MenuItemGroup,
  TabPane,
  Tabs,
  Tooltip,
} from "ant-design-vue";
import { computed, defineComponent, KeepAlive, ref } from "vue";
import { RouteLocationNormalizedLoaded, RouterView, useRoute } from "vue-router";
import Logo from "@/static/image/logo.png";
import { setUserToken, userInfo, userMenus } from "@/service/user";
import { version } from "../../package.json";
import config from "@/config";
import { removeRouteTab, routeTabList } from "@/service/common";
import router from "@/router";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    const route = useRoute();

    const isCollapsed = ref(false);

    // 选中的tab
    const activeTab = computed(() => {
      const name = routeTabList.value.find(v => v.name === route.name)?.name;
      return String(name || "index");
    });

    return () => (
      <Layout>
        <LayoutSider
          v-model={[isCollapsed.value, "collapsed"]}
          trigger={null}
          collapsible
          breakpoint="lg"
          class="full-height-vh app-sider"
          width={220}
        >
          <div class="d-flex font-light pad-5 direction-column align-items-center justify-center">
            <div class="bg-cover border-radius-4 mar-b-3-item logo" style={{ backgroundImage: `url(${Logo})` }}></div>
            {isCollapsed.value ? null : (
              <div class="d-flex align-items-center justify-between flex-item-extend">
                <span class="font-large mar-r-3-item">{userInfo.username}</span>
                <Tooltip title="退出登录" placement="bottom">
                  <div
                    class="cursor-pointer"
                    onClick={() => {
                      setUserToken("");
                      router.push({ name: "login" });
                    }}
                  >
                    <LogoutOutlined style={{ fontSize: "14px" }} />
                  </div>
                </Tooltip>
              </div>
            )}
          </div>
          <Menu theme="dark" mode="inline">
            {userMenus.value.map(item => {
              if (item.children?.length) {
                <MenuItemGroup>
                  {item.children.map(child => {
                    <MenuItem key={child.id} title={child.name}>
                      {child.name}
                    </MenuItem>;
                  })}
                </MenuItemGroup>;
              } else {
                <MenuItem key={item.id} title={item.name}>
                  {item.name}
                </MenuItem>;
              }
            })}
          </Menu>
          <div class="d-flex align-items-center justify-center font-gray tip">
            {isCollapsed.value ? null : <span class="mar-r-2-item">{config.title}</span>}
            <span class="font-mini">v {version}</span>
          </div>
        </LayoutSider>
        <Layout class="app-layout">
          <LayoutHeader class="app-header d-flex align-items-end">
            <div class="d-flex align-items-center pad-l-3 pad-r-3 mar-b-2">
              <Button
                class="mar-r-3-item"
                onClick={() => {
                  isCollapsed.value = !isCollapsed.value;
                }}
              >
                {{
                  icon() {
                    return isCollapsed.value ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />;
                  },
                }}
              </Button>
            </div>
            <Tabs
              type="editable-card"
              hideAdd
              size="small"
              activeKey={activeTab.value}
              onEdit={name => {
                if (typeof name === "string") {
                  removeRouteTab(name);
                }
              }}
              onChange={name => {
                const item = routeTabList.value.find(v => v.name === name);
                if (!item) {
                  return;
                }
                router.push(item.fullPath);
              }}
            >
              {{
                default() {
                  return (
                    <>
                      {routeTabList.value
                        .filter(item => !!item.name)
                        .map(item => {
                          return <TabPane key={item.name!} tab={item.meta.title || "导航"} />;
                        })}
                    </>
                  );
                },
              }}
            </Tabs>
            {/* <Button
              class="mar-r-3-item"
              onClick={() => {
                isCollapsed.value = !isCollapsed.value;
              }}
            >
              {{
                icon() {
                  return isCollapsed.value ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />;
                },
              }}
            </Button>
            <div class="d-flex justify-between align-items-center flex-item-extend">
              <div class="d-flex align-items-center flex-item-extend overflow-x-auto">
                {new Array(20).fill(1).map((v, i) => {
                  return (
                    <Button
                      key={i}
                      class="mar-r-3-item"
                      onClick={() => {
                        isCollapsed.value = !isCollapsed.value;
                      }}
                    >
                      <span>哈哈哈</span>
                      <CloseCircleOutlined />
                    </Button>
                  );
                })}
              </div>
              <Dropdown>
                {{
                  default: () => <Button>{{ icon: () => <DownOutlined /> }}</Button>,
                  overlay: () => (
                    <Menu>
                      <MenuItem
                        onClick={e => {
                          // removeRouteTab(String(route.name));
                          // activeCurrentTab();
                        }}
                      >
                        关闭当前
                      </MenuItem>
                      <MenuItem
                        onClick={e => {
                          // tabList.value = tabList.value.filter(v => v.name === route.name);
                        }}
                      >
                        关闭其他
                      </MenuItem>
                      <MenuItem
                        onClick={e => {
                          // tabList.value = tabList.value.filter(v => v.name === indexName);
                          // router.replace({ name: indexName });
                        }}
                      >
                        关闭全部
                      </MenuItem>
                    </Menu>
                  ),
                }}
              </Dropdown>
            </div> */}
          </LayoutHeader>
          <LayoutContent>
            <div class="pad-4">
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
          </LayoutContent>
        </Layout>
      </Layout>
    );
  },
});
