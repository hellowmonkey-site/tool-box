import { LeftOutlined, LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined, ReloadOutlined, RightOutlined } from "@ant-design/icons-vue";
import {
  Button,
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutSider,
  Menu,
  MenuItem,
  MenuItemGroup,
  Modal,
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
      <Layout class="d-flex full-height-vh">
        <LayoutSider v-model={[isCollapsed.value, "collapsed"]} trigger={null} collapsible breakpoint="lg" class="app-sider" width={220}>
          <div class="d-flex font-light pad-5 direction-column align-items-center justify-center">
            <div class="bg-cover border-radius-4 mar-b-3-item logo" style={{ backgroundImage: `url(${Logo})` }}></div>
            {isCollapsed.value ? null : (
              <div class="d-flex align-items-center justify-between flex-item-extend">
                <span class="font-large mar-r-3-item">{userInfo.username}</span>
                <Tooltip title="退出登录" placement="bottom">
                  <div
                    class="cursor-pointer"
                    onClick={() => {
                      Modal.confirm({
                        title: "确认退出登录吗？",
                        onOk() {
                          setUserToken("");
                          router.push({ name: "login" });
                        },
                      });
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
        <Layout class="app-layout flex-item-extend d-flex direction-column">
          <LayoutHeader class="app-header d-flex align-items-end">
            <div class="d-flex align-items-center pad-l-3 pad-r-4 mar-b-2">
              <Tooltip title={isCollapsed.value ? "展开菜单" : "收起菜单"} placement="bottom">
                <Button
                  class="mar-r-2-item"
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
              </Tooltip>
              {config.isElectron ? (
                <>
                  <Tooltip title="后退" placement="bottom">
                    <Button
                      class="mar-r-2-item"
                      onClick={() => {
                        router.back();
                      }}
                    >
                      {{
                        icon() {
                          return <LeftOutlined />;
                        },
                      }}
                    </Button>
                  </Tooltip>
                  <Tooltip title="前进" placement="bottom">
                    <Button
                      class="mar-r-2-item"
                      onClick={() => {
                        router.forward();
                      }}
                    >
                      {{
                        icon() {
                          return <RightOutlined />;
                        },
                      }}
                    </Button>
                  </Tooltip>
                  <Tooltip title="刷新" placement="bottom">
                    <Button
                      class="mar-r-2-item"
                      onClick={() => {
                        location.reload();
                      }}
                    >
                      {{
                        icon() {
                          return <ReloadOutlined />;
                        },
                      }}
                    </Button>
                  </Tooltip>
                </>
              ) : null}
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
          </LayoutHeader>
          <LayoutContent class="flex-item-extend overflow-y-auto">
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
          </LayoutContent>
        </Layout>
      </Layout>
    );
  },
});
