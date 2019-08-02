// WXQ-BUILD-PAGE # NOT DELETE
export function HomePagePreloading(): Promise<any> {
  return new Promise(resolve => {
    require.ensure([], require => {
      const Home = require("./home/home.vue").default;
      resolve(Home);
    });
  });
}

/**
 * 错误处理
 *
 * @param {*} err
 */
function dealWithError(err: any, page: string) {
  console.log(page, err);
}
