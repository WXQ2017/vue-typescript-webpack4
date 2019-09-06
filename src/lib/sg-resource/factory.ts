import { Common, createCommon, ICommon } from "./common";
import { ConfigAdapter, createConfigAdapter, IMockData } from "./config";
import { IApiConfig, IConfigAdapter, IServerConfig, ProxyHttp } from "./index";
import { createProxyHttp, IProxyHttp } from "./proxyHttp";

export abstract class SGVFactory {
  public static common: ICommon;
  public static proxyHttp: IProxyHttp;
  public static configAdapter: IConfigAdapter;

  /**
   * 使用时传参创建
   * @param apiConfig api配置
   * @param serverConfig 服务器配置
   * @param mockData 模拟数据配置
   */
  public static createConfigAdapter(
    apiConfig?: IApiConfig,
    serverConfig?: IServerConfig,
    mockData?: IMockData,
  ) {
    if (!this.configAdapter) {
      if (!!apiConfig && !!serverConfig && !!mockData) {
        this.configAdapter = createConfigAdapter(
          ConfigAdapter,
          apiConfig,
          serverConfig,
          mockData,
        );
      } else {
        throw new Error("config init fail!!");
      }
    }
    return this.configAdapter;
  }

  public static createProxyHttp(): IProxyHttp {
    if (!this.proxyHttp) {
      this.proxyHttp = createProxyHttp(ProxyHttp);
    }
    return this.proxyHttp;
  }

  public static createCommon() {
    if (!this.common) {
      this.common = createCommon(Common);
    }
    return this.common;
  }

  public static createVuePlugin() {
    return {
      install: (vue: any, { apiConfig, serverConfig, mockData }: any) => {
        const configAdapter = this.createConfigAdapter(
          apiConfig,
          serverConfig,
          mockData,
        );
        if (!vue.$sg) {
          vue.$sg = { configAdapter };
        } else {
          vue.$sg.configAdapter = configAdapter;
        }
        vue.mixin({
          created() {
            this.$sg = vue.$sg;
          },
        });
      },
    };
  }
}
