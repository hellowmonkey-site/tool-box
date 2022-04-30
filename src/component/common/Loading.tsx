import { LoadingOutlined } from "@ant-design/icons-vue";

interface IProp {
  title: string;
}

export default function Loading(prop: IProp) {
  return (
    <>
      <div class="ant-message ani-zoom" style={{ top: "45%" }}>
        <div class="ant-message-notice">
          <div class="ant-message-notice-content">
            <div class="ant-message-custom-content ant-message-loading">
              <LoadingOutlined />
              <span>{prop.title}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="ani-fade ant-modal-mask"></div>
    </>
  );
}
