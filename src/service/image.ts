import Compressor from "compressorjs";

const defaultCompressImageOpts: Compressor.Options = { quality: 0.8, maxWidth: 1300, maxHeight: 1800, convertSize: 1024 * 1024 * 2 };

export function compressImage(file: File, opts?: Compressor.Options): Promise<File> {
  const { quality, maxWidth, convertSize, maxHeight } = Object.assign({}, defaultCompressImageOpts, opts || {});
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-new
    new Compressor(file, {
      quality,
      maxWidth,
      maxHeight,
      convertSize,
      success(res) {
        const data = new File([res], (res as File).name, {
          type: res.type,
          lastModified: Date.now(),
        });
        resolve(data);
      },
      error(e) {
        reject(e);
      },
    });
  });
}
