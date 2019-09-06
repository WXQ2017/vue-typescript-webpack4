import { Env, ISites } from "../../lib/sg-resource";
declare var PUBLIC_PATH: string;
declare var SITE_INFO: string;

export default class Common {
  /**
   * 得到环境变量的配置
   */
  static getPublicPath() {
    const publicPath: any = PUBLIC_PATH;
    return publicPath;
  }

  static getSiteInfo(): ISites {
    const siteInfo: any = SITE_INFO;
    const o: any = {};
    o[Env.DEV] = siteInfo.DEV;
    o[Env.TEST] = siteInfo.TEST;
    o[Env.UAT] = siteInfo.UAT;
    o[Env.MASTER] = siteInfo.MASTER;
    return o;
  }
  /**
   * 网站地址参数
   *
   * @static
   * @param {string} key
   * @returns
   * @memberof Common
   */
  static getUrlQuery(key: string) {
    const regx = new RegExp("[&|?]" + key + "=([^&]+)&?");
    const m = location.search.match(regx);
    if (m != null) {
      const [, value] = m;
      return value;
    }
    return "";
  }
}
