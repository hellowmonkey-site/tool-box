import { NumberBoolean } from "@/config/type";
import fly from "flyio";
import { ref } from "vue";
import { IPermission } from "./permission";
import { IRoute } from "./route";

export interface IRole {
  id: number;
  status?: NumberBoolean;
  name: string;
  home_url?: string;
  permissions?: Array<any>; ////string[] | IPermission[]
  route?: Array<any>; ////string[] | IRoute[]
}

export const defaultRole: IRole = {
  id: 0,
  name: "",
  home_url: "",
  status: 1,
  permissions: [],
  route: [],
};

export const roleList = ref<IRole[]>([]);

// 获取角色列表
export function getRoleList() {
  return fly
    .get<IRole[]>("admin/role")
    .then(data => data.data)
    .then(data => {
      roleList.value = data;
      return data;
    });
}

// 获取角色详情
export function getRoleDetail(id: number) {
  // 获取权限id
  const checkedRouteKeys: string[] = [];
  const checkedPermissionsKeys: string[] = [];
  function handleRouteCheckId(child: IRoute) {
    checkedRouteKeys.push(child.id.toString());
    if (child && child.children && child.children.length > 0) {
      child.children.forEach((element: IRoute) => {
        handleRouteCheckId(element);
      });
    } else {
      return;
    }
  }
  function handlePermissionCheckId(child: IPermission) {
    checkedPermissionsKeys.push(child.id.toString());
    if (child && child.children && child.children.length > 0) {
      child.children.forEach((element: IPermission) => {
        handlePermissionCheckId(element);
      });
    } else {
      return;
    }
  }
  return fly.get<IRole>(`admin/role/${id}`).then(data => {
    if (data?.data?.permissions) {
      data.data.permissions.forEach(checkItem => {
        handlePermissionCheckId(checkItem);
      });
      data.data.permissions = checkedPermissionsKeys;
    }
    if (data?.data?.route) {
      data.data.route.forEach(checkItem => {
        handleRouteCheckId(checkItem);
      });
      data.data.route = checkedRouteKeys;
    }
    return data.data;
  });
}

// 删除角色
export const deleteRole = (id: number) => {
  return fly.delete(`admin/role/${id}`).then(data => data.data);
};

// 创建角色
export const postRole = (params: IRole) => {
  return fly.post("admin/role", params).then(data => data.data);
};

// 编辑角色
export const putRole = ({ id, ...params }: IRole) => {
  return fly.put(`admin/role/${id}`, params).then(data => data.data);
};
