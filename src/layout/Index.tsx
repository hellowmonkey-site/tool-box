import { isIE } from "@/helper/validate";
import {
  appConfig,
  dialog,
  isShowBackTop,
  menuCollapsed,
  setAppConfig,
  settingOpen,
  themeColors,
  ThemeTypes,
  visitedPageNum,
} from "@/service/common";
import { globalTheme, themeTypes } from "@/service/common";
import {
  DialogOptions,
  MenuOption,
  NBackTop,
  NButton,
  NDivider,
  NDrawer,
  NDrawerContent,
  NDropdown,
  NDynamicInput,
  NH2,
  NIcon,
  NInput,
  NLayout,
  NLayoutHeader,
  NLayoutSider,
  NMenu,
  NResult,
  NSelect,
  NSwitch,
  NText,
  NTooltip,
  useOsTheme,
} from "naive-ui";
import { computed, defineComponent, KeepAlive, onMounted, reactive, ref, Transition } from "vue";
import { RouteLocationNormalizedLoaded, RouterLink, RouterView, useRoute, useRouter } from "vue-router";
import {
  ChevronLeftRound,
  ChevronRightRound,
  DeveloperBoardOutlined,
  DownloadFilled,
  DownloadOutlined,
  HomeOutlined,
  ImageOutlined,
  PanToolAltOutlined,
  QrCodeOutlined,
  ReplayOutlined,
  SettingsFilled,
  SettingsOutlined,
  VideocamOutlined,
  WbSunnyFilled,
  WbSunnyOutlined,
} from "@vicons/material";
import config from "@/config";
import { menuRoutes } from "@/router";
import Logo from "@/static/image/logo.png";
import { downLoad } from "@/helper";

export const firstMenus: MenuOption[] = [
  {
    label: "图片",
    key: "image",
    icon() {
      return (
        <NIcon>
          <ImageOutlined />
        </NIcon>
      );
    },
  },
  {
    label: "二维码",
    key: "qrcode",
    icon() {
      return (
        <NIcon>
          <QrCodeOutlined />
        </NIcon>
      );
    },
  },
  {
    label: "视频",
    key: "video",
    icon() {
      return (
        <NIcon>
          <VideocamOutlined />
        </NIcon>
      );
    },
  },
  {
    label: "开发",
    key: "developer",
    icon() {
      return (
        <NIcon>
          <DeveloperBoardOutlined />
        </NIcon>
      );
    },
  },
  {
    label: "日常",
    key: "util",
    icon() {
      return (
        <NIcon>
          <PanToolAltOutlined />
        </NIcon>
      );
    },
  },
];

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    const route = useRoute();
    const router = useRouter();
    const os = useOsTheme();
    const electronConfig = reactive<{ keyboard: string; openAtLogin: boolean; compressDirs: string[]; compressNotify: boolean }>({
      keyboard: "",
      openAtLogin: true,
      compressDirs: [],
      compressNotify: true,
    });
    const compressDirs = ref<string[]>([]);
    const showCompressDirsBtn = computed(() => {
      return electronConfig.compressDirs.join("") !== [...new Set(compressDirs.value.filter(v => !!v))].join("");
    });

    function renderMenu(item: MenuOption): MenuOption {
      return {
        ...item,
        children: menuRoutes
          .filter(v => new RegExp(`^${item.key}-`).test(v.name as string))
          .map<MenuOption>(v => {
            return {
              label() {
                return <RouterLink to={{ name: v.name }}>{v.meta!.title}</RouterLink>;
              },
              key: v.name as string,
            };
          }),
      };
    }

    const menus: MenuOption[] = [
      {
        label() {
          return <RouterLink to={{ name: "index" }}>首页</RouterLink>;
        },
        key: "index",
        icon() {
          return (
            <NIcon>
              <HomeOutlined />
            </NIcon>
          );
        },
      },
      ...firstMenus.map(v => renderMenu(v)),
    ];

    // 设置系统快捷键
    function setAppKeyboard(e: KeyboardEvent) {
      e.stopPropagation();
      e.preventDefault();
      // 清空
      if (e.key === "Backspace") {
        showConfigDialog(
          {
            title: "取消快捷键",
            content: "确认取消打开工具的快捷键吗？",
          },
          { keyboard: "" }
        );
        return;
      }
      const arr: string[] = [];
      if (e.altKey) {
        arr.push("Alt");
      }
      if (e.shiftKey) {
        arr.push("Shift");
      }
      if (e.ctrlKey) {
        arr.push("CommandOrControl");
      }
      if (arr.length && e.key.length === 1 && /[a-z]/i.test(e.key)) {
        arr.push(e.key.toLocaleUpperCase());
        const val = [...new Set(arr)].join("+");
        if (electronConfig.keyboard !== val) {
          showConfigDialog(
            {
              title: "设置快捷键",
              content: `确认修改打开工具的快捷键为【${val}】吗？`,
            },
            { keyboard: val }
          );
        }
      }
    }

    function showConfigDialog(opts: DialogOptions, data: unknown) {
      dialog.warning({
        positiveText: "确认",
        negativeText: "取消",
        onPositiveClick() {
          electronAPI.setConfig(data);
        },
        ...opts,
        content() {
          return (
            <>
              <div class="mar-b-2-item font-large">{opts.content}</div>
              <NText depth="3" class="mar-b-2-item font-small">
                设置后将自动重启软件!
              </NText>
            </>
          );
        },
      });
    }

    // 图片自动压缩位置保存
    function saveCompressDirs() {
      compressDirs.value = compressDirs.value.filter(v => !!v);
      showConfigDialog(
        {
          title: "修改需要自动压缩的图片目录",
          content: `${compressDirs.value.length ? "确认修改需要自动压缩的图片目录？" : "确认关闭图片自动压缩监听？"}`,
        },
        { compressDirs: Array.from(compressDirs.value) }
      );
    }

    onMounted(() => {
      if (config.isElectron) {
        electronAPI.getConfig().then(data => {
          electronConfig.keyboard = data.keyboard;
          electronConfig.openAtLogin = data.openAtLogin;
          electronConfig.compressDirs = data.compressDirs;
          compressDirs.value = Array.from(electronConfig.compressDirs);
        });
      }

      // 判断是不是IE浏览器
      if (isIE) {
        dialog.warning({
          title: "重要提示",
          content:
            "监测到您当前浏览器版本过低，会影响部分功能的使用，建议使用谷歌、火狐等高级浏览器，或将360等双核心的浏览器切换至极速模式",
          positiveText: "立即升级",
          maskClosable: false,
          onPositiveClick() {
            window.open("https://www.microsoft.com/zh-cn/edge");
            return Promise.reject({ message: "" });
          },
        });
      }
    });
    return () => (
      <>
        <NLayout position="absolute" class="app-layout">
          <NLayoutHeader data-tauri-drag-region bordered class="d-flex align-items-center justify-between pad-3">
            {config.isElectron ? (
              <div class="mar-r-4-item">
                <NTooltip>
                  {{
                    default: () => <span>后退</span>,
                    trigger: () => (
                      <NButton
                        size="tiny"
                        class="mar-r-2-item"
                        type="primary"
                        circle
                        disabled={visitedPageNum.value === 0}
                        onClick={() => {
                          router.back();
                        }}
                      >
                        {{
                          icon: () => (
                            <NIcon>
                              <ChevronLeftRound />
                            </NIcon>
                          ),
                        }}
                      </NButton>
                    ),
                  }}
                </NTooltip>
                <NTooltip>
                  {{
                    default: () => <span>前进</span>,
                    trigger: () => (
                      <NButton
                        size="tiny"
                        class="mar-r-2-item"
                        type="primary"
                        circle
                        onClick={() => {
                          router.forward();
                        }}
                      >
                        {{
                          icon: () => (
                            <NIcon>
                              <ChevronRightRound />
                            </NIcon>
                          ),
                        }}
                      </NButton>
                    ),
                  }}
                </NTooltip>
                <NTooltip>
                  {{
                    default: () => <span>刷新</span>,
                    trigger: () => (
                      <NButton
                        size="tiny"
                        class="mar-r-2-item"
                        type="primary"
                        circle
                        onClick={() => {
                          location.reload();
                        }}
                      >
                        {{
                          icon: () => (
                            <NIcon>
                              <ReplayOutlined />
                            </NIcon>
                          ),
                        }}
                      </NButton>
                    ),
                  }}
                </NTooltip>
              </div>
            ) : null}
            <div class="d-flex align-items-center">
              <img src={Logo} class="logo mar-r-3-item" />
              <RouterLink to={{ name: "index" }} class="font-large mar-r-5-item space-nowrap">
                {config.productName}
              </RouterLink>
            </div>
            <div class="flex-item-extend d-flex justify-end">
              {!config.isElectron ? (
                <NTooltip>
                  {{
                    default: () => <span>下载客户端</span>,
                    trigger: () => (
                      <NButton
                        size="large"
                        type="primary"
                        ghost
                        class="mar-r-3-item"
                        circle
                        onClick={() => {
                          downLoad(config.releaseUrl, config.releaseName);
                        }}
                      >
                        {{
                          icon: () => <NIcon>{globalTheme.value === null ? <DownloadOutlined /> : <DownloadFilled />}</NIcon>,
                        }}
                      </NButton>
                    ),
                  }}
                </NTooltip>
              ) : null}
              <NDropdown
                options={themeTypes.map(v => {
                  return {
                    ...v,
                    icon() {
                      switch (v.key) {
                        case ThemeTypes.OS:
                          return <NIcon>{os.value === "dark" ? <WbSunnyFilled /> : <WbSunnyOutlined />}</NIcon>;
                        case ThemeTypes.LIGHT:
                          return (
                            <NIcon>
                              <WbSunnyOutlined />
                            </NIcon>
                          );
                        case ThemeTypes.DARK:
                          return (
                            <NIcon>
                              <WbSunnyFilled />
                            </NIcon>
                          );
                      }
                    },
                  };
                })}
                trigger="click"
                onSelect={themeType => {
                  setAppConfig({ themeType });
                }}
              >
                <NTooltip>
                  {{
                    default: () => <span>选择主题</span>,
                    trigger: () => (
                      <NButton size="large" class="mar-r-3-item" circle>
                        {{
                          icon: () => <NIcon>{globalTheme.value === null ? <WbSunnyOutlined /> : <WbSunnyFilled />}</NIcon>,
                        }}
                      </NButton>
                    ),
                  }}
                </NTooltip>
              </NDropdown>
              <NTooltip>
                {{
                  default: () => <span>系统设置</span>,
                  trigger: () => (
                    <NButton
                      size="large"
                      class="mar-r-3-item"
                      circle
                      onClick={() => {
                        settingOpen.value = true;
                      }}
                    >
                      {{
                        icon: () => <NIcon>{globalTheme.value === null ? <SettingsOutlined /> : <SettingsFilled />}</NIcon>,
                      }}
                    </NButton>
                  ),
                }}
              </NTooltip>
            </div>
          </NLayoutHeader>
          <NLayout hasSider position="absolute" style={{ top: "61px" }}>
            <NLayoutSider bordered showTrigger collapseMode="width" v-model={[menuCollapsed.value, "collapsed"]}>
              <NMenu
                options={menus}
                value={route.name as string}
                defaultExpandedKeys={menus.filter(v => v.children?.some(item => item.key === route.name)).map(v => v.key!)}
              ></NMenu>
            </NLayoutSider>
            <NLayout>
              <div class="pad-4">
                {route.meta.title ? (
                  <NH2 prefix="bar" class="mar-b-4-item">
                    <NText>{route.meta.title}</NText>
                  </NH2>
                ) : null}
                <RouterView>
                  {{
                    default: ({ Component, route }: { Component: () => JSX.Element; route: RouteLocationNormalizedLoaded }) => {
                      if (route.meta.electron && !config.isElectron) {
                        return (
                          <div class="d-flex direction-column align-items-center justify-center" style="height: 60vh">
                            <NResult status="403" title="此功能暂不支持在浏览器使用，请下载客户端进行食用">
                              {{
                                footer() {
                                  return (
                                    <NButton
                                      onClick={() => {
                                        downLoad(config.releaseUrl, config.releaseName);
                                      }}
                                    >
                                      下载客户端
                                    </NButton>
                                  );
                                },
                              }}
                            </NResult>
                          </div>
                        );
                      }
                      return (
                        <Transition name="slider-top">
                          <KeepAlive>
                            <Component key={String(route.name)} />
                          </KeepAlive>
                        </Transition>
                      );
                    },
                  }}
                </RouterView>
              </div>

              {/* 返回顶部 */}
              <NBackTop
                visibilityHeight={10}
                onUpdate:show={(show: boolean) => {
                  isShowBackTop.value = show;
                }}
              />
            </NLayout>
          </NLayout>
        </NLayout>
        <NDrawer v-model={[settingOpen.value, "show"]} class="setting-drawer" style="width: 90vw; max-width: 500px;">
          <NDrawerContent title="系统设置" closable class="d-flex direction-column justify-between">
            <div>
              <NDivider titlePlacement="left">主题设置</NDivider>
              <div class="d-flex justify-between align-items-center mar-b-6-item">
                <span class="font-gray font-small mar-r-7 flex-item-extend">选择主题</span>
                <NSelect
                  style={{ width: "65%" }}
                  value={appConfig.value.themeType}
                  onUpdateValue={themeType => setAppConfig({ themeType })}
                  options={themeTypes.map(v => {
                    return {
                      label: v.label,
                      value: v.key,
                    };
                  })}
                ></NSelect>
              </div>
              <div class="d-flex justify-between align-items-center mar-b-6-item">
                <span class="font-gray font-small mar-r-7 flex-item-extend">主题颜色</span>
                <NSelect
                  style={{ width: "65%" }}
                  value={appConfig.value.themeColor}
                  onUpdateValue={themeColor => setAppConfig({ themeColor })}
                  options={themeColors.map(v => {
                    return {
                      label() {
                        return (
                          <div class="d-flex align-items-center">
                            <span class="color-box mar-r-3-item" style={{ backgroundColor: v.color }}></span>
                            <span style={{ color: v.color }}>{v.label}</span>
                          </div>
                        );
                      },
                      value: v.key,
                    };
                  })}
                ></NSelect>
              </div>
              {config.isElectron ? (
                <>
                  <NDivider titlePlacement="left">通用设置</NDivider>
                  <div class="d-flex justify-between align-items-center mar-b-6-item">
                    <span class="font-gray font-small mar-r-7">开机自启</span>
                    <NSwitch
                      value={electronConfig.openAtLogin}
                      onUpdateValue={val => {
                        showConfigDialog(
                          {
                            title: "开机自启",
                            content: `确认要${val ? "启动" : "取消"}开机自启吗？`,
                          },
                          { openAtLogin: val }
                        );
                      }}
                    />
                  </div>
                  <NDivider titlePlacement="left">快捷键</NDivider>
                  <div class="d-flex justify-between align-items-center mar-b-6-item">
                    <span class="font-gray font-small mar-r-7 flex-item-extend">打开工具</span>
                    <div class="d-flex direction-column" style={{ width: "65%" }}>
                      <NInput
                        placeholder="请输入快捷键"
                        class="mar-b-2-item"
                        value={electronConfig.keyboard || "无"}
                        onKeydown={e => {
                          setAppKeyboard(e);
                        }}
                      />
                      <NText depth="3" class="font-small">
                        Ctrl或Alt或Shift的任意组合+字母
                      </NText>
                    </div>
                  </div>
                  <NDivider titlePlacement="left">自动化</NDivider>
                  <div class="mar-b-6-item">
                    <div class="d-flex justify-between align-items-center mar-b-3-item">
                      <span class="font-gray font-small mar-r-7 flex-item-extend">图片自动压缩目录</span>
                      {showCompressDirsBtn.value ? (
                        <NButton
                          onClick={() => {
                            saveCompressDirs();
                          }}
                        >
                          保存
                        </NButton>
                      ) : null}
                    </div>
                    <NDynamicInput
                      class="mar-b-6-item"
                      value={compressDirs.value}
                      onCreate={index => {
                        compressDirs.value.splice(index, 0, "");
                      }}
                      onRemove={index => {
                        compressDirs.value.splice(index, 1);
                      }}
                    >
                      {{
                        "create-button-default"() {
                          return "添加目录";
                        },
                        default({ value, index }: { value: string; index: number }) {
                          return (
                            <NInput
                              readonly
                              placeholder="选择需要自动压缩的图片目录"
                              onClick={() => {
                                electronAPI.selectDirectory("选择需要自动压缩的图片目录", value).then(data => {
                                  if (data) {
                                    compressDirs.value.splice(index, 1, data);
                                  }
                                });
                              }}
                              value={value}
                            />
                          );
                        },
                      }}
                    </NDynamicInput>
                    <div class="d-flex justify-between align-items-center mar-b-6-item">
                      <span class="font-gray font-small mar-r-7">图片压缩成功后通知</span>
                      <NSwitch
                        value={electronConfig.compressNotify}
                        onUpdateValue={val => {
                          showConfigDialog(
                            {
                              title: "图片压缩成功后通知",
                              content: `确认要${val ? "开启" : "取消"}图片压缩成功后通知吗？`,
                            },
                            { compressNotify: val }
                          );
                        }}
                      />
                    </div>
                  </div>
                </>
              ) : null}
              <NDivider titlePlacement="left">关于</NDivider>
              <div class="d-flex justify-between align-items-center mar-b-6-item">
                <span class="font-gray font-small mar-r-7 flex-item-extend">版本</span>
                <NText depth="3" class="font-small">
                  v {config.version}
                </NText>
              </div>
            </div>
          </NDrawerContent>
        </NDrawer>
      </>
    );
  },
});
