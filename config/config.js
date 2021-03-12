var config_env = {
  DEV: {
    remote: "",
    otherRemotes: {},
    local: "",
    entrance: "/login",
    appID: "xxx",
    protocol: "http:",
    publicPath: "/",
  },
  TEST: {
    remote: "",
    otherRemotes: {},
    local: "",
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
