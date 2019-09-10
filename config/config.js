var config_env = {
  DEV: {
    remote: "shuwen.test.trial.link:18081",
    otherRemotes: {},
    local: "180.167.88.250:13089",
    entrance: "/login",
    appID: "xxx",
    protocol: "http:",
    publicPath: "/",
  },
  TEST: {
    remote: "shuwen.test.trial.link:18081",
    otherRemotes: {},
    local: "172.16.107.229",
    entrance: "/login",
    appID: "xxx",
    protocol: "http:",
    publicPath: "/",
  },
  UAT: {
    remote: "erp.shuwen.uat.trial.link:18080",
    otherRemotes: {},
    local: "shuwen.test.yaoyanshe.com",
    entrance: "/login",
    protocol: "http:",
    publicPath: "/",
  },
  MASTER: {
    remote: "erp.shuwen.trial.link",
    otherRemotes: {},
    local: "erp.shuwen.trial.link",
    entrance: "/login",
    protocol: "https:",
    publicPath: "/",
  },
  runtimes: "DEV",
};
if (typeof global === "object") {
  global.config_env = config_env;
}
