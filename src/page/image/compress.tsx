import { compressImage } from "@/service/image";
import { UploadFileOutlined } from "@vicons/material";
import { NIcon, NText, NUpload, NUploadDragger, UploadFileInfo } from "naive-ui";
import { defineComponent, ref } from "vue";
import fly from "flyio";

export default defineComponent({
  props: {},
  emits: [],
  setup: (props, ctx) => {
    const fileList = ref<File[]>([]);

    function uploadImage(list: UploadFileInfo[]) {
      list
        .filter(v => v.file)
        .map(v => v.file)
        .forEach(file => {
          // compressImage(file).then(data => {
          //   console.log(data);
          // });
          fileList.value.push(file!);
          // const formData = new FormData();
          // formData.append(file!.name, file!);
          // fly
          //   .post("https://api.tinify.com/shrink", formData, { headers: { Authorization: "Basic 4RxZwMzdcMT4ksdgYnVYJzMtn2R7cgCT" } })
          //   .then(data => data.data);
          electronAPI.compressImage("aaa").then(data => {
            console.log(data);
          });
        });
      console.log(list);
    }

    return () => (
      <>
        <NUpload multiple directoryDnd onUpdate:fileList={fileList => uploadImage(fileList)} fileList={[]}>
          <NUploadDragger>
            <div class="d-flex direction-column align-items-center justify-center pad-5">
              <NIcon size={60} class="mar-b-5-item">
                <UploadFileOutlined />
              </NIcon>
              <NText>点击或者拖动文件到该区域来上传</NText>
            </div>
          </NUploadDragger>
        </NUpload>
        {fileList.value.map(item => (
          <div>{item.name}</div>
        ))}
      </>
    );
  },
});
