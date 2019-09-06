import { Env, IServerConfig } from "../../lib/sg-resource";
import Common from "../core/common";

export const serverConfig: IServerConfig = {
  appKey: [],
  debug: false,
  env: Env.DEV,
  isMock: false,
  protocol: window.location.protocol,
  publicPath: Common.getPublicPath(),
  sites: Common.getSiteInfo(),
  successCode: "0",
};

serverConfig.successCallback = (res: any, resolve, reject) => {
  console.log("successCallback response.data:", JSON.stringify(res.data));
};

serverConfig.failCallback = (res: any, resolve, reject) => {
  console.error(JSON.stringify(res));
  reject(res);
};
