export default function ajax<T = string>(url: string, type: XMLHttpRequestResponseType = "") {
  return new Promise<T>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    if (type) {
      xhr.responseType = type;
    }

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        const status = xhr.status;
        if (status >= 200 && status < 300) {
          resolve(xhr.response);
        } else {
          reject(new Error("请求失败"));
        }
      }
    };

    xhr.open("GET", url, true);
    xhr.send(null);
  });
}
