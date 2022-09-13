import config from "@/config";

export default class Db {
  db?: IDBDatabase;
  readonly idKey = { keyPath: "id", autoIncrement: true };

  open(createTableName?: string) {
    return new Promise<this>(resolve => {
      const request = indexedDB.open(config.dbName, config.dbVersion);
      request.onupgradeneeded = () => {
        this.db = request.result;
        if (createTableName && !this.db.objectStoreNames.contains(createTableName)) {
          this.db.createObjectStore(createTableName, this.idKey);
        }
      };
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this);
      };
    });
  }

  // 获取单条记录
  findOne<T>(tableName: string, id: number) {
    if (!this.db) {
      throw new Error("错误的db");
    }

    return new Promise<T>((resolve, reject) => {
      const request = this.db!.transaction(tableName).objectStore(tableName).get(id);
      request.onerror = event => {
        reject(event);
      };

      request.onsuccess = () => {
        resolve(request.result);
      };
    });
  }

  // 获取多条记录
  findAll<T>(tableName: string, query?: any) {
    if (!this.db) {
      throw new Error("错误的db");
    }

    return new Promise<T[]>((resolve, reject) => {
      const request = this.db!.transaction(tableName, "readwrite").objectStore(tableName).getAll(query);
      request.onerror = event => {
        reject(event);
      };

      request.onsuccess = () => {
        resolve(request.result);
      };
    });
  }

  // 添加
  insert(tableName: string, data: any) {
    if (!this.db) {
      throw new Error("错误的db");
    }

    return new Promise<number>((resolve, reject) => {
      const request = this.db!.transaction(tableName, "readwrite")
        .objectStore(tableName)
        .add({ ...data, createdAt: Date.now() });
      request.onerror = event => {
        reject(event);
      };

      request.onsuccess = () => {
        resolve(data.id);
      };
    });
  }

  // 更新
  update(tableName: string, data: any) {
    if (!this.db) {
      throw new Error("错误的db");
    }

    return new Promise((resolve, reject) => {
      const request = this.db!.transaction(tableName, "readwrite").objectStore(tableName).put(data);
      request.onerror = event => {
        reject(event);
      };

      request.onsuccess = () => {
        resolve(request.result);
      };
    });
  }

  // 删除
  delete(tableName: string, id: number) {
    if (!this.db) {
      throw new Error("错误的db");
    }

    return new Promise((resolve, reject) => {
      const request = this.db!.transaction(tableName, "readwrite").objectStore(tableName).delete(id);
      request.onerror = event => {
        reject(event);
      };

      request.onsuccess = () => {
        resolve(request.result);
      };
    });
  }
}
