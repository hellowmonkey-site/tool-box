import Loading from "@/component/common/Loading";
import config from "@/config";
import { createVNode, render } from "vue";

let div: HTMLDivElement;
let timer: number;

export function hideLoading() {
  if (!div) {
    return;
  }
  render(null, div);
}

export default function loading(title = "处理中...", timeout = config.timeout) {
  if (!div) {
    div = document.createElement("div");
    document.body.appendChild(div);
  }

  const vnode = createVNode(Loading, { title });
  render(vnode, div);
  timer = setTimeout(hideLoading, timeout);
  return () => {
    clearTimeout(timer);
    hideLoading();
  };
}
