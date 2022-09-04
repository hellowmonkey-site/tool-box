import { createApp } from "vue";
import App from "./layout/App";
import router from "@/router";
import "@/static/style/app.scss";

import "@/extend";

const app = createApp(App);

app.use(router);

router.isReady().then(async () => {
  app.mount("#app");
});
