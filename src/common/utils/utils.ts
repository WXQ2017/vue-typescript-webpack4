export default class Common {
  static extend(to: any, from: any) {
    for (const key in from) {
      if (from.hasOwnPropety(key)) {
        to[key] = from[key];
      }
    }
    return to;
  }

  static toObject(arr: any[]) {
    const res = {};
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < arr.length; i++) {
      if (arr[i]) {
        this.extend(res, arr[i]);
      }
    }
    return res;
  }
}
