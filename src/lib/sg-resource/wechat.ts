import Axios from "axios";
import { ICommon, IConfigAdapter, IProxyHttp, SGVFactory } from ".";

export interface IWechatShareParam extends wx.MenuShareAppMessagePara, wx.MenuShareQQPara,
  wx.MenuShareQZonePara, wx.MenuShareTimelinePara, wx.MenuShareWeiboPara {
}

export interface IWechatService {
  isWechat: boolean;
  wCJSSignature<T>(): Promise<T>;
  shareJoint(param: IWechatShareParam): void;
  getLocation(): Promise<Coordinates>;
  scanQRCode(needResult?: boolean): Promise<string>;
}
export interface IWechatServiceConstructor {
  new(): IWechatService;
}

export function createWechatService(ctor: IWechatServiceConstructor): IWechatService {
  return new ctor();
}

export class WechatService implements IWechatService {

  private configAdapter: IConfigAdapter;
  private common: ICommon;
  private proxyHttp: IProxyHttp;

  constructor() {
    this.common = SGVFactory.createCommon();
    this.configAdapter = SGVFactory.createConfigAdapter();
    this.proxyHttp = SGVFactory.createProxyHttp();
  }
  get isWechat(): boolean {
    const ua = navigator.userAgent.toLowerCase();
    return ua.search(/MicroMessenger/i) !== -1;
  }
  wCJSSignature<T>(): Promise<T> {
    const creditUrl = this.configAdapter.jsSignUrl;
    if (!creditUrl) {
      throw new Error("配置不全！");
    }
    return Axios.get(creditUrl, {
      params: {
        appId: this.configAdapter.appId,
        url: window.location.href.split("#")[0],
      },
    }).then((res) => {
      return new Promise<T>((resolve) => {
        const data = res.data.data;
        data.debug = this.configAdapter.debug;
        data.jsApiList = this.configAdapter.jsApiList;
        wx.config(data);
        resolve(data);
      });
    });
  }

  getLocation(): Promise<Coordinates> {
    return new Promise<Coordinates>((resolve, reject) => {
      if (this.isWechat) {
        wx.ready(() => {
          wx.getLocation({
            type: "wgs84", // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success(res) {
              const latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
              const longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
              const speed = res.speed; // 速度，以米/每秒计
              const accuracy = res.accuracy; // 位置精度
              resolve(res);
            },
            fail(err) {
              reject(err);
            },
          });
        });
      } else {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((coordinates) => {
            resolve(coordinates.coords);
          }, (error) => {
            reject(error);
          });
        } else {
          reject();
        }
      }
    });
  }

  scanQRCode(needResult = false): Promise<string> {
    return new Promise<string>((resolve) => {
      if (this.isWechat) {
        wx.ready(() => {
          wx.scanQRCode({
            needResult: needResult ? 1 : 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success(res) {
              resolve(res.resultStr);
            },
          });
        });
      }
    });
  }

  shareJoint(param: IWechatShareParam): void {
    if (this.isWechat) {
      wx.ready(() => {
        wx.onMenuShareAppMessage(param);
        wx.onMenuShareQQ(param);
        wx.onMenuShareQZone(param);
        wx.onMenuShareTimeline(param);
        wx.onMenuShareWeibo(param);
      });
    }
  }
}
