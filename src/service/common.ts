import config from "@/config";
import { DialogApiInjection } from "naive-ui/lib/dialog/src/DialogProvider";
import { NotificationApiInjection } from "naive-ui/lib/notification/src/NotificationProvider";
import { computed, ref } from "vue";
import { darkTheme, GlobalTheme, GlobalThemeOverrides, useOsTheme } from "naive-ui";
import { localStorage } from "@/helper/storage";
import { MessageApiInjection } from "naive-ui/lib/message/src/MessageProvider";

const os = useOsTheme();

export let notification: NotificationApiInjection;
export function setNotification(e: NotificationApiInjection) {
  notification = e;
}
export let dialog: DialogApiInjection;
export function setDialog(e: DialogApiInjection) {
  dialog = e;
}

export let message: MessageApiInjection;
export function setMessage(e: MessageApiInjection) {
  message = e;
}

// 返回顶部按钮
export const isShowBackTop = ref(false);

// 设置
export const settingOpen = ref(false);

// history页数
export const visitedPageNum = ref(0);

export const enum ThemeTypes {
  OS = "os",
  LIGHT = "light",
  DARK = "dark",
}
export const themeTypes = [
  {
    label: "跟随系统",
    key: ThemeTypes.OS,
  },
  {
    label: "亮色",
    key: ThemeTypes.LIGHT,
  },
  {
    label: "暗色",
    key: ThemeTypes.DARK,
  },
];

export const enum ThemeColors {
  RED = "red",
  GREEN = "green",
  BLUE = "blue",
  YELLOW = "yellow",
  PURPLE = "purple",
}
export const themeColors = [
  {
    label: "红色",
    key: ThemeColors.RED,
    color: "#f5222d",
    hoverColor: "#ff3b45",
    pressedColor: "#e01a24",
  },
  {
    label: "绿色",
    key: ThemeColors.GREEN,
    color: "#18a058",
    hoverColor: "#24b86a",
    pressedColor: "#1a7f4a",
  },
  {
    label: "蓝色",
    key: ThemeColors.BLUE,
    color: "#2f54eb",
    hoverColor: "#4e6ef2",
    pressedColor: "#2e49ba",
  },
  {
    label: "黄色",
    key: ThemeColors.YELLOW,
    color: "#dcbf00",
    hoverColor: "#dbc433",
    pressedColor: "#c1aa14",
  },
  {
    label: "紫色",
    key: ThemeColors.PURPLE,
    color: "#722ed1",
    hoverColor: "#934af8",
    pressedColor: "#5a1fab",
  },
];

export const themeOverrides = computed<GlobalThemeOverrides>(() => {
  const themeColor = themeColors.find(v => v.key === appConfig.value.themeColor);
  const common: GlobalThemeOverrides["common"] = { fontSize: "16px" };
  if (themeColor) {
    common.primaryColor = themeColor.color;
    common.primaryColorHover = themeColor.hoverColor;
    common.primaryColorPressed = themeColor.pressedColor;
    common.primaryColorSuppl = themeColor.pressedColor;
  }

  return { common };
});

// 个性化配置
export interface IConfig {
  // 主题
  themeType: ThemeTypes;
  themeColor: ThemeColors;
}

export const defaultConfig: IConfig = {
  themeType: ThemeTypes.OS,
  themeColor: ThemeColors.GREEN,
};
let localConfig = localStorage.get<IConfig>("appConfig") || defaultConfig;
if (typeof localConfig === "string" || Array.isArray(localConfig)) {
  localConfig = defaultConfig;
}
export const appConfig = ref<IConfig>(defaultConfig);
export function setAppConfig(params: Partial<IConfig>) {
  if (params.themeType !== undefined) {
    const value = params.themeType;
    if (themeTypes.some(v => v.key === value)) {
      appConfig.value.themeType = value;
    }
  }
  if (params.themeColor !== undefined) {
    const value = params.themeColor;
    if (themeColors.some(v => v.key === value)) {
      appConfig.value.themeColor = value;
    }
  }
  localStorage.set("appConfig", appConfig.value);
}
setAppConfig(localConfig);

// export const themeType = ref<ThemeTypes>(appConfig.value.themeType);
// export function changeThemeType(type: ThemeTypes) {
//   themeType.value = type;
// }
export const globalTheme = computed<GlobalTheme | null>(() => {
  if (appConfig.value.themeType === ThemeTypes.DARK || (appConfig.value.themeType === ThemeTypes.OS && os.value === "dark")) {
    return darkTheme;
  }
  return null;
});

// 设置标题
export const setTitle = (title: string) => {
  document.title = title || config.title;
  if (config.isElectron) {
    electronAPI?.setTitle(title);
  }
};
