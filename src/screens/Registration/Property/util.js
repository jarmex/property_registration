const futch = (url, opts = {}, onProgress) => {
  console.log(url, opts); // eslint-disable-line
  return new Promise((res, rej) => {
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.open(opts.method || 'get', url);
    const optheader = opts.headers || {};
    for (const k of Object.keys(optheader)) {
      xhr.setRequestHeader(k, optheader[k]);
    }
    xhr.onload = (e) => res(e.target);
    xhr.onerror = rej;
    if (xhr.upload && onProgress) xhr.upload.onprogress = onProgress; // event.loaded / event.total * 100 ; //event.lengthComputable
    xhr.send(opts.body);
  });
};
export { futch };
