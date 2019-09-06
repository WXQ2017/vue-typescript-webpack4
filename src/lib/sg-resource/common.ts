import { IConfigAdapter, IHost } from "./config";
import { SGVFactory } from "./factory";

export interface ICommon {
  /**
   * 去两端空格
   * @param s 字符串
   * @return 字符串
   */
  trim(s: string): string;
  /**
   * 处理路径
   * @param apiKey Api的配置key
   * @param method HTTP method (e.g. 'GET', 'POST', etc)
   */
  dealPath(apiKey: string, method: string): string;
  upperFirst(str: string): string;
  getUrlQuery(key: string): string;
  descriptorOf(
    target: any,
    propertyKey: string,
  ): PropertyDescriptor | undefined;
}

export type ICommonConstructor = new () => ICommon;

export function createCommon(ctor: ICommonConstructor): ICommon {
  return new ctor();
}

export class Common implements ICommon {
  // private msgs: string[];
  // private isShowModal: boolean;

  private configAdapter: IConfigAdapter;

  constructor() {
    this.configAdapter = SGVFactory.createConfigAdapter();
    // this.msgs = [];
    // this.isShowModal = false;
  }

  public dealPath(apiKey = "", method = "GET"): string {
    let api = "";
    let url = apiKey;
    method = method.toLocaleLowerCase();
    api = this.configAdapter.getApi(method, apiKey);
    if (api === "") {
      return api;
    }
    if (api.indexOf(":") !== -1) {
      url = "{PROTOCOL}//{DOMAIN}{SUPPATH}{HOST}{API}";
      const path = api.split(":");
      path[0] = this.trim(path[0]);
      path[1] = this.trim(path[1]);
      const host: IHost = this.configAdapter.hosts[path[0]];
      const domain =
        host && host.domain ? host.domain : this.configAdapter.domain;
      const supPath =
        (this.configAdapter.curSite && this.configAdapter.curSite.supPath) ||
        "";
      url = url
        .replace(
          /\{PROTOCOL}/,
          this.configAdapter.curSite.protocol || location.protocol,
        )
        .replace(/\{DOMAIN}/, domain)
        .replace(/\{SUPPATH}/, supPath)
        .replace(/\{HOST}/, host.dir)
        .replace(/\{API}/, path[1]);
    } else {
      url = api;
    }
    return url;
  }

  public trim(s: string): string {
    return s.replace(/(^\s*)|(\s*$)/g, "");
  }

  public upperFirst(str: string) {
    const first = str.substr(0, 1).toLocaleUpperCase();
    const surplus = str.substr(1, str.length);
    return first + surplus;
  }
  /**
   * 获取该属性的描述对象
   * @param target 类
   * @param propertyKey 目标属性
   */
  public descriptorOf(
    target: any,
    propertyKey: string,
  ): PropertyDescriptor | undefined {
    return Reflect.getOwnPropertyDescriptor(
      (target && target.prototype) || target,
      propertyKey,
    );
  }
  getUrlQuery(key: string) {
    const regx = new RegExp("[&|?]" + key + "=([^&]+)&?");
    const m = location.search.match(regx);
    if (m != null) {
      const [, value] = m;
      return value;
    }
    return "";
  }
}
