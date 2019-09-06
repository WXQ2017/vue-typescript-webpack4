declare module "qiniu-js" {
  export interface ISubscription {
    unsubscribe(): void;
  }
  interface IObserverCompleteResult {
    key: string;
    hash: string;
    url: string;
    downloadUrl: string;
  }
  export interface IObserver {
    next(res: any): void;
    error(err: any): void;
    complete(res: IObserverCompleteResult): void;
  }
  export interface IObservable {
    subscribe(observer: IObserver): ISubscription;
  }
  export interface IPutExtra {
    /**
     * 文件原文件名
     */
    fname: string;
    /**
     * 用来放置自定义变量
     */
    params: any;
    /**
     * 用来限制上传文件类型，为 null 时表示不对文件类型限制；限制类型放到数组里： ["image/png", "image/jpeg", "image/gif"]
     */
    mimeType: string[] | null;
  }
  export interface IConfig {
    /**
     * 表示是否使用 cdn 加速域名，为布尔值，true 表示使用，默认为 false。
     */
    useCdnDomain?: boolean;
    /**
     * 选择上传域名区域；当为 null 或 undefined 时，自动分析上传域名区域
     */
    region?: any;
    /**
     * 是否禁用日志报告，为布尔值，默认为false。
     */
    disableStatisticsReport?: boolean;
    /**
     * 上传自动重试次数（整体重试次数，而不是某个分片的重试次数）；默认 3 次（即上传失败后最多重试两次）；目前仅在上传过程中产生 599 内部错误时生效，但是未来很可能会扩展为支持更多的情况。
     */
    retryCount?: number;
    /**
     * 分片上传的并发请求量，number，默认为3；因为浏览器本身也会限制最大并发量，所以最大并发量与浏览器有关。
     */
    concurrentRequestLimit?: number;
    /**
     * 是否开启 MD5 校验，为布尔值；在断点续传时，开启 MD5 校验会将已上传的分片与当前分片进行 MD5 值比对，若不一致，则重传该分片，避免使用错误的分片。读取分片内容并计算 MD5 需要花费一定的时间，因此会稍微增加断点续传时的耗时，默认为 false，不开启。
     */
    checkByMD5?: boolean;
  }
  /**
   * 返回一个 observable 对象用来控制上传行为
   * @param file Blob 对象，上传的文件
   * @param key 文件资源名
   * @param token 上传验证信息，前端通过接口请求后端获得
   * @param putExtra
   * @param config
   */
  export function upload(
    file: Blob,
    key: string,
    token: string,
    putExtra: IPutExtra,
    config: IConfig,
  ): IObservable;

  export var region: {
    z0: string;
    z1: string;
    z2: string;
    na0: string;
    as0: string;
  };
}
