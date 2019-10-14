var config_env = {
  DEV: {
    remote: "",
    otherRemotes: {},
    local: "180.167.88.250:13089",
    entrance: "/login",
    appID: "xxx",
    protocol: "http:",
    publicPath: "/",
  },
  TEST: {
    remote: "",
    otherRemotes: {},
    local: "172.16.107.229",
    entrance: "/login",
    appID: "xxx",
    protocol: "http:",
    publicPath: "/",
  },
  UAT: {
    remote: "",
    otherRemotes: {},
    local: "",
    entrance: "/login",
    protocol: "http:",
    publicPath: "/",
  },
  MASTER: {
    remote: "",
    otherRemotes: {},
    local: "",
    entrance: "/login",
    protocol: "https:",
    publicPath: "/",
  },
  runtimes: "DEV",
};
if (typeof global === "object") {
  global.config_env = config_env;
}
