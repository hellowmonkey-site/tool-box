import Db from "@/helper/db";
import { ref } from "vue";

const tableName = "logo";
let db: Db;

export interface ILogoItem {
  id: number;
  url: string;
  createdAt: number;
}

// logo列表
export const logoList = ref<ILogoItem[]>([]);

// 获取logo列表
export async function getLogoList() {
  if (!db) {
    db = await new Db().open(tableName);
  }
  logoList.value = await db.findAll<ILogoItem>(tableName);
  return logoList.value;
}

// 添加logo
export async function addLogo(url: string) {
  if (!db) {
    db = await new Db().open(tableName);
  }
  await db.insert(tableName, { url });
  await getLogoList();
  return logoList.value;
}

// 删除logo
export async function deleteLogo(id: number) {
  if (!db) {
    db = await new Db().open(tableName);
  }
  await db.delete(tableName, id);
  await getLogoList();
  return logoList.value;
}
