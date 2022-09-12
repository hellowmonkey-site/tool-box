import { firstMenus } from "@/layout/Index";
import { menuRoutes } from "@/router";
import { NCard, NGrid, NGridItem, NIcon } from "naive-ui";
import { defineComponent } from "vue";
import { RouterLink } from "vue-router";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    return () => (
      <NGrid xGap={8} yGap={8} cols="2 m:3 l:4 xl:5" responsive="screen">
        {menuRoutes.map(item => {
          const firstMenu = firstMenus.find(v => new RegExp(`^${v.key}-`).test(item.name as string));
          return (
            <NGridItem>
              <NCard class="box" contentStyle={{ display: "flex", padding: 0 }}>
                <RouterLink
                  to={{ name: item.name }}
                  class="d-flex direction-column align-items-center justify-center"
                  style={{ flex: "1" }}
                >
                  <NIcon size={45} class="mar-b-3-item">
                    {firstMenu?.icon!()}
                  </NIcon>
                  <span>{item.meta?.title}</span>
                </RouterLink>
              </NCard>
            </NGridItem>
          );
        })}
      </NGrid>
    );
  },
});
