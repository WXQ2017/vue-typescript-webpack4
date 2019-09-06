/**
 * 微信JSSDK类型定义文件
 * @author sean@seage.net
 */
declare namespace wx {
  // 通过config接口注入权限验证配置
  function config(para: ConfigPara): void;
  // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
  function ready(fun: Function): void;
  // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
  function error(fun: Function): void;
  /*基础接口*/
  // 判断当前客户端版本是否支持指定JS接口
  function checkJsApi(para: CheckJsApiPara): void;
  /*分享接口*/
  // 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
  function onMenuShareTimeline(para: MenuShareTimelinePara): void;
  // 获取“分享给朋友”按钮点击状态及自定义分享内容接口
  function onMenuShareAppMessage(para: MenuShareAppMessagePara): void;
  // 获取“分享到QQ”按钮点击状态及自定义分享内容接口
  function onMenuShareQQ(para: MenuShareQQPara): void;
  // 获取“分享到腾讯微博”按钮点击状态及自定义分享内容接口
  function onMenuShareWeibo(para: MenuShareWeiboPara): void;
  // 获取“分享到QQ空间”按钮点击状态及自定义分享内容接口
  function onMenuShareQZone(para: MenuShareQZonePara): void;
  /*图像接口*/
  // 拍照或从手机相册中选图接口
  function chooseImage(para: ChooseImagePara): void;
  // 预览图片接口
  function previewImage(para: PreviewImagePara): void;
  // 上传图片接口
  function uploadImage(para: UploadImagePara): void;
  // 下载图片接口
  function downloadImage(para: DownloadImagePara): void;
  /*音频接口*/
  // 开始录音接口
  function startRecord(): void;
  // 停止录音接口
  function stopRecord(para: StopRecordPara): void;
  // 监听录音自动停止接口
  function onVoiceRecordEnd(para: OnVoiceRecordEndPara): void;
  /*智能接口*/
  /*设备信息*/
  /*地理位置*/
  // 使用微信内置地图查看位置接口
  function openLocation(para: OpenLocationPara): void;
  // 获取地理位置接口
  function getLocation(para: GetLocationPara): void;
  /*摇一摇周边*/
  /*界面操作*/
  /*微信扫一扫*/
  // 调起微信扫一扫接口
  function scanQRCode(para: ScanQRCodePara): void;
  /*微信小店*/
  /*微信卡券*/
  /*微信支付*/
  // 发起一个微信支付请求
  function chooseWXPay(para: ChooseWXPayPara): void;

  interface Result {
    errMsg: string;
    [propName: string]: any;
  }

  interface CommonPara {
    success?(res: Result): any;
    fail?(res: Result): any;
    complete?(res: Result): any;
    cancel?(res: Result): any;
    trigger?(res: Result): any;
  }

  interface ConfigPara {
    // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    debug: boolean;
    // 必填，公众号的唯一标识
    appId: string;
    // 必填，生成签名的时间戳
    timestamp: number;
    // 必填，生成签名的随机串
    nonceStr: string;
    // 必填，签名，见附录1
    signature: string;
    // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    jsApiList: Array<string>;
  }

  interface CheckJsApiPara extends CommonPara {
    jsApiList: Array<string>;
    success(res: CheckJsApiSuccessResult): any;
  }

  interface CheckJsApiSuccessResult extends Result {
    checkResult: Object;
  }

  interface MenuShareTimelinePara extends CommonPara {
    /** 分享标题 */
    title: string;
    /** 分享链接 */
    link: string;
    /** 分享图标 */
    imgUrl: string;
  }

  interface MenuShareAppMessagePara extends MenuShareTimelinePara {
    /** 分享描述 */
    desc: string;
    //分享类型,music、video或link，不填默认为link
    type?: string;
    // 如果type是music或video，则要提供数据链接，默认为空
    dataUrl?: string;
  }

  interface MenuShareQQPara extends MenuShareTimelinePara {
    // 分享描述
    desc: string;
  }

  interface MenuShareWeiboPara extends MenuShareQQPara {

  }

  interface MenuShareQZonePara extends MenuShareQQPara {

  }

  interface ChooseImagePara extends CommonPara {
    // 默认9
    count: number;
    // ['original', 'compressed'], 可以指定是原图还是压缩图，默认二者都有
    sizeType: Array<string>;
    // ['album', 'camera'], 可以指定来源是相册还是相机，默认二者都有
    sourceType: Array<string>;
    success(res: ChooseImageSuccessResult): any;
  }

  interface ChooseImageSuccessResult extends Result {
    // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
    localIds: Array<string>
  }

  interface PreviewImagePara extends CommonPara {
    // 当前显示图片的http链接
    current: string;
    // 需要预览的图片http链接列表
    urls: Array<string>;
  }

  interface UploadImagePara extends CommonPara {
    localId: string;
    isShowProgressTips: number;
    success(res: UploadImageSuccessResult): any
  }

  interface UploadImageSuccessResult extends Result {
    // 返回图片的服务器端ID
    serverId: string;
  }

  interface DownloadImagePara {
    serverId: string;
    isShowProgressTips: number;
    success(res: DownloadImageSuccessResult): any;
  }

  interface DownloadImageSuccessResult extends Result {
    // 返回图片下载后的本地ID
    localId: string
  }

  interface StopRecordPara {
    success(res: StopRecordSuccessResult): any;
  }

  interface StopRecordSuccessResult extends DownloadImageSuccessResult {
  }

  interface OnVoiceRecordEndPara {
    complete(res: OnVoiceRecordEndCompleteResult): any;
  }
  interface OnVoiceRecordEndCompleteResult extends DownloadImageSuccessResult {
  }

  interface OpenLocationPara {
    // 纬度，浮点数，范围为90 ~ -90
    latitude: number;
    // 经度，浮点数，范围为180 ~ -180。
    longitude: number;
    // 位置名
    name: string;
    // 地址详情说明
    address: string;
    // 地图缩放级别,整形值,范围从1~28。默认为最大
    scale: number;
    // 在查看位置界面底部显示的超链接,可点击跳转
    infoUrl: string;
  }
  interface GetLocationPara {
    // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
    type: string;
    success(res: Coordinates): any;
    fail(err: any): any;
  }
  interface ScanQRCodePara {
    // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
    needResult: number;
    //  ["qrCode","barCode"], 可以指定扫二维码还是一维码，默认二者都有
    scanType: Array<string>;
    success(res: ScanQRCodeSuccessResult): any;
  }
  interface ScanQRCodeSuccessResult extends Result {
    // 当needResult 为 1 时，扫码返回的结果
    resultStr: string
  }
  interface ChooseWXPayPara {
    // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
    timestamp: number;
    // 支付签名随机串，不长于 32 位
    nonceStr: string;
    // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
    package: string;
    // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
    signType: string;
    // 支付签名
    paySign: string;
    // 支付成功后的回调函数
    success(res: any): any;
  }
}