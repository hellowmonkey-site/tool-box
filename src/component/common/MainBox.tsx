import { Button, Col, Row } from "ant-design-vue";
import { defineComponent, PropType } from "vue";

interface ISearch {
  tip: string;
  component: () => JSX.Element;
  span?: number;
}

export default defineComponent({
  name: "MainBox",
  props: {
    searchList: {
      type: Array as PropType<ISearch[]>,
      default: undefined,
    },
  },
  emits: ["search"],
  setup: (props, { slots, emit }) => {
    return () => (
      <>
        {slots.search || props.searchList?.length ? (
          <div class="d-flex justify-between align-items-end content-form">
            <div class="flex-item-extend mar-r-4-item">
              {slots.search ? (
                slots.search()
              ) : props.searchList?.length ? (
                <Row gutter={20}>
                  {props.searchList.map(item => {
                    return (
                      <Col sm={item.span || 8} class="d-flex direction-column pad-b-4">
                        <div class="font-small mar-b-2-item form-tip">{item.tip}</div>
                        <item.component />
                      </Col>
                    );
                  })}
                </Row>
              ) : null}
            </div>
            <Button
              class="form-btn"
              type="primary"
              size="large"
              onClick={() => {
                emit("search");
              }}
            >
              搜索
            </Button>
          </div>
        ) : null}

        <div class="content-box">{slots.default && slots.default()}</div>
      </>
    );
  },
});
