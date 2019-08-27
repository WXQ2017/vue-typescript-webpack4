// WXQ-BUILD-PAGE # NOT DELETE
// Home PAGE BEGIN
export function HomePagePreloading(): Promise<any> {
  return new Promise(resolve => {
    require.ensure([], require => {
      const Home = require("./home/home.vue").default;
      resolve(Home);
    });
  });
}
// Home PAGE END

/**
 * 错误处理
 *
 * @param {*} err
 */
function dealWithError(err: any, page: string) {
  console.log(page, err);
}
