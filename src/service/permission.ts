import flyio from "flyio";
import { ref } from "vue";

export interface IPermission {
  children?: IPermission[];
  key: string;
  parent_id: number;
  sort: number;
  path: string;
  app_id: number | null;
  module_id: number | null;
  method: string;
  id: number;
  name: string;
}

export const defaultPermission: IPermission = {
  key: "",
  parent_id: 0,
  sort: 0,
  method: "",
  module_id: null,
  path: "",
  app_id: null,
  id: 0,
  name: "",
};

export const allPermissionList = ref<IPermission[]>([]);

// 获取父级权限列表
export const getPermissionList = (parent_id = 0) => {
  return flyio.get<IPermission[]>("permission", { parent_id }).then(data => data.data);
};

// 获取权限详情
export const getPermissionDetail = (id: number) => {
  return flyio.get<IPermission>(`permission/${id}`).then(data => data.data);
};

// 删除权限
export const deletePermission = (id: number) => {
  return flyio.delete(`permission/${id}`).then(data => data.data);
};

// 创建权限
export const postPermission = (params: IPermission) => {
  return flyio.post("permission", params).then(data => data.data);
};

// 编辑权限
export const putPermission = ({ id, ...params }: IPermission) => {
  return flyio.put(`permission/${id}`, params).then(data => data.data);
};

// 获取所有权限
export const getAllPermissionList = () => {
  return flyio
    .get<IPermission[]>("permission")
    .then(data => data.data)
    .then(data => {
      allPermissionList.value = data;
      return data;
    });
};
