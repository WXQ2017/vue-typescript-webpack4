import Axios from "axios";
/**
 * 环境枚举
 */
export const enum Env {
  DEV = 1,
  TEST,
  UAT,
  MASTER,
}

export function getEnv(name: string) {
  switch (name) {
    case "DEV":
      return Env.DEV;
    case "TEST":
      return Env.TEST;
    case "UAT":
      return Env.UAT;
    case "MASTER":
      return Env.MASTER;
    default:
      return Env.DEV;
  }
}

/**
 * 站点信息
 */
export interface ISite {
  local: string;
  remote: string;
  appID?: string;
  supPath?: string;
  protocol?: string;
}

/**
 * 主机信息
 */
export interface IHost {
  domain?: string;
  dir: string;
}

/**
 * 主机、站点集合对象
 */
export declare interface IHosts {
  [key: string]: IHost;
}
export declare interface ISites {
  [key: string]: ISite;
}

/**
 * 接口配置对象
 */
export interface IApiConfig {
  [key: string]: any;
  /**
   * 主机信息
   */
  hosts: IHosts;
  /**
   * post 方式接口配置
   */
  post: { [key: string]: string };
  /**
   * get 方式接口配置
   */
  get: { [key: string]: string };
  /**
   * put 方式接口配置
   */
  put: { [key: string]: any };
  /**
   * delete 方式接口配置
   */
  delete: { [key: string]: any };
  /**
   * 各服务代理（可选）
   */
  serviceFactory?: any;
}

/**
 * 模拟数据
 */
export interface IMockData {
  [key: string]: any;
  post: { [key: string]: any };
  get: { [key: string]: any };
  put: { [key: string]: any };
  delete: { [key: string]: any };
}

/**
 * 服务器配置对象
 */
export interface IServerConfig {
  appKey: string[];
  env: Env;
  debug: boolean;
  protocol: string;
  publicPath: string;
  sites: ISites;
  successCode: string;
  successCallback?: <T>(
    res: T,
    resolve: T | PromiseLike<T> | undefined,
    reject: any,
  ) => void;
  failCallback?: <T>(
    res: T,
    resolve: (value?: T | PromiseLike<T> | undefined) => void,
    reject: any,
  ) => void;
  isMock?: boolean;
  wXJsSign?: string;
  wXOAuth?: string;
  jsApiList?: string[];
}

export interface IConfigAdapter {
  env: Env;
  readonly debug: boolean;
  readonly protocol: string;
  readonly hosts: IHosts;
  readonly serviceFactory: any;
  readonly successCode: string;
  readonly isMock?: boolean;
  readonly mockData: IMockData;
  // readonly curSite: ISite;
  readonly domain: string;
  readonly localSite: string;
  readonly entrance: string;
  /** 认证url */
  readonly jsSignUrl?: string;
  readonly jsApiList?: string[];
  readonly appId?: string;
  sites: ISites;
  curSite: ISite;

  failCallback?: <T>(
    res: T,
    resolve: (value?: T | PromiseLike<T> | undefined) => void,
    reject: any,
  ) => void;
  getApi(method: string, apiName: string): string;
}

export type IConfigAdapterConstructor = new (
  apiConfig: IApiConfig,
  serverConfig: IServerConfig,
  mockData: IMockData,
) => IConfigAdapter;

export function createConfigAdapter(
  ctor: IConfigAdapterConstructor,
  apiConfig: IApiConfig,
  serverConfig: IServerConfig,
  mockData: IMockData,
) {
  return new ctor(apiConfig, serverConfig, mockData);
}

export class ConfigAdapter implements IConfigAdapter {
  static envInfo: any = {};

  set sites(val: ISites) {
    this.serverConfig.sites = val;
    this.dealConfig();
  }

  get token() {
    return "d2a57dc1d883fd21fb9951699df71cc7";
  }

  static fetchConfig(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.envInfo.env) {
        resolve(this.envInfo);
      } else {
        const url: any =
          process.env.NODE_ENV === "production"
            ? "/config/site.json?t=" + Date.now()
            : "/config/site.json?t=" + Date.now();
        Axios.get(url)
          .then(res => {
            const o: any = {};
            o[Env.DEV] = res.data.DEV;
            o[Env.TEST] = res.data.TEST;
            o[Env.UAT] = res.data.UAT;
            o[Env.MASTER] = res.data.MASTER;
            const env = getEnv(res.data.runtimes);
            const sites = o;
            this.envInfo = { env, sites };
            resolve(this.envInfo);
          })
          .catch(reason => {
            reject();
          });
      }
    });
  }
  env: Env = Env.DEV;
  debug: boolean;
  protocol: string;
  hosts: IHosts;
  successCode: string;
  isMock?: boolean;
  mockData: IMockData;
  domain: string;
  localSite: string;
  entrance: string;
  serviceFactory: any;
  jsSignUrl?: string;
  jsApiList?: string[] | undefined;
  appId?: string;
  siteList: ISites;
  serverConfig: IServerConfig;
  curSite: ISite;

  failCallback?: (res: any, resolve: any, reject: any) => void;

  private URL_TPL = "//{DOMAIN}{HOST_API}?appId=APPID&path=PATH&state=!STATE";

  constructor(
    private apiConfig: IApiConfig,
    serverConfig: IServerConfig,
    mockData: IMockData,
  ) {
    this.serverConfig = serverConfig;
    this.hosts = apiConfig.hosts;
    this.serviceFactory = apiConfig.serviceFactory;
    this.env = serverConfig.env;
    this.debug = serverConfig.debug;
    this.successCode = serverConfig.successCode;
    this.isMock = serverConfig.isMock;
    this.mockData = mockData;
    this.siteList = serverConfig.sites;
    this.jsApiList = serverConfig.jsApiList;

    if (serverConfig.failCallback) {
      this.failCallback = serverConfig.failCallback;
    }
    this.dealConfig();
  }

  dealConfig() {
    this.curSite = !!this.serverConfig.sites
      ? this.serverConfig.sites[this.env]
      : { local: window.location.host, remote: window.location.host };
    this.domain = this.curSite.remote;
    console.log(this.curSite.supPath)
    this.localSite =
      location.protocol +
      "//" +
      this.curSite.local +
      this.curSite.supPath +
      this.serverConfig.publicPath;
    this.entrance =
      !!this.serverConfig.wXOAuth && !!this.curSite.appID
        ? this.curSite.protocol +
          this.URL_TPL.replace(/\{DOMAIN}/, this.curSite.remote)
            .replace(/\{HOST_API}/, this.serverConfig.wXOAuth)
            .replace("APPID", this.curSite.appID)
        : "";
    this.jsSignUrl = !!this.serverConfig.wXJsSign
      ? "//" + this.curSite.remote + this.serverConfig.wXJsSign
      : undefined;
    this.appId = this.curSite.appID;
  }

  public getApi(method: string, apiName: string): string {
    if (this.apiConfig[method] && this.apiConfig[method][apiName]) {
      return this.apiConfig[method][apiName];
    }
    return apiName;
  }

  fetchConfigFromJson() {}
}
