import { MenuFoldOutlined } from "@ant-design/icons-vue";
import { Layout, LayoutContent, LayoutHeader, LayoutSider, Menu, MenuItem } from "ant-design-vue";
import { defineComponent, ref } from "vue";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    const slideCollapsed = ref(false);
    return () => (
      <Layout>
        <LayoutSider v-model={[slideCollapsed, "collapsed"]} trigger={null} collapsed breakpoint="lg" class="full-height-vh">
          <div>logo</div>
          <Menu theme="dark" mode="inline">
            <MenuItem>aa</MenuItem>
          </Menu>
        </LayoutSider>
        <Layout>
          <LayoutHeader class="app-header">
            <MenuFoldOutlined />
          </LayoutHeader>
          <LayoutContent>aa</LayoutContent>
        </Layout>
      </Layout>
    );
  },
});
