import config from "@/config";

export default class Db {
  db?: IDBDatabase;
  table: IDBObjectStore | null = null;
  idKey = { keyPath: "id", autoIncrement: true };

  open(createTableName?: string) {
    return new Promise<this>(resolve => {
      const request = indexedDB.open(config.dbName, config.dbVersion);
      request.onupgradeneeded = () => {
        this.db = request.result;
        if (createTableName && !this.db.objectStoreNames.contains(createTableName)) {
          this.table = this.db.createObjectStore(createTableName, this.idKey);
        }
      };
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this);
      };
    });
  }

  checkTable() {
    if (!this.db) {
      throw new Error("错误的db");
    }
    if (!this.table) {
      throw new Error("错误的table");
    }
  }

  // 选择表
  selectTable(tableName: string) {
    if (!this.db) {
      throw new Error("请先选择表");
    }
    this.table = this.db!.transaction(tableName, "readwrite").objectStore(tableName);
    return this;
  }

  // 获取单条记录
  findOne<T>(id: number) {
    this.checkTable();

    return new Promise<T>((resolve, reject) => {
      const request = this.table!.get(id);
      request.onerror = event => {
        reject(event);
      };

      request.onsuccess = () => {
        resolve(request.result);
      };
    });
  }

  // 获取多条记录
  findAll<T>(query?: any) {
    this.checkTable();

    return new Promise<T[]>((resolve, reject) => {
      const request = this.table!.getAll(query);
      request.onerror = event => {
        reject(event);
      };

      request.onsuccess = () => {
        resolve(request.result);
      };
    });
  }

  // 添加
  insert(data: any) {
    this.checkTable();

    return new Promise<number>((resolve, reject) => {
      const request = this.table!.add(data);
      request.onerror = event => {
        reject(event);
      };

      request.onsuccess = () => {
        resolve(data.id);
      };
    });
  }

  // 更新
  update(data: any) {
    this.checkTable();

    return new Promise((resolve, reject) => {
      const request = this.table!.put(data);
      request.onerror = event => {
        reject(event);
      };

      request.onsuccess = () => {
        resolve(request.result);
      };
    });
  }

  // 删除
  delete(id: number) {
    this.checkTable();

    return new Promise((resolve, reject) => {
      const request = this.table!.delete(id);
      request.onerror = event => {
        reject(event);
      };

      request.onsuccess = () => {
        resolve(request.result);
      };
    });
  }
}
