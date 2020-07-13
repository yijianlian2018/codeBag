if(!self.__appxInited) {
self.__appxInited = 1;


require('./config$');


var AFAppX = self.AFAppX.getAppContext
  ? self.AFAppX.getAppContext().AFAppX
  : self.AFAppX;
self.getCurrentPages = AFAppX.getCurrentPages;
self.getApp = AFAppX.getApp;
self.Page = AFAppX.Page;
self.App = AFAppX.App;
self.my = AFAppX.bridge || AFAppX.abridge;
self.abridge = self.my;
self.Component = AFAppX.WorkerComponent || function(){};
self.$global = AFAppX.$global;
self.requirePlugin = AFAppX.requirePlugin;
        


function success() {
require('../../app');
require('../../components/articleList');
require('../../components/uni-popup/uni-popup');
require('../../components/activityList');
require('../../pages/index/index');
require('../../pages/index/citys/citys');
require('../../pages/index/search/search');
require('../../pages/index/articleList/articleList');
require('../../pages/index/article/article');
require('../../pages/index/comment/comment');
require('../../pages/index/author/author');
require('../../pages/index/actList/actList');
require('../../pages/index/activity/activity');
require('../../pages/index/courseList/courseList');
require('../../pages/index/course/course');
require('../../pages/message/message');
require('../../pages/message/detail/detail');
require('../../pages/ucenter/ucenter');
require('../../pages/ucenter/setting/setting');
require('../../pages/ucenter/setting/mobile/mobile');
require('../../pages/ucenter/setting/pwd/pwd');
require('../../pages/ucenter/setting/about/about');
require('../../pages/ucenter/setting/complaint/complaint');
require('../../pages/ucenter/setting/complaint/submit/submit');
require('../../pages/ucenter/info/info');
require('../../pages/ucenter/attention/attention');
require('../../pages/ucenter/order/order');
require('../../pages/ucenter/integral/integral');
require('../../pages/ucenter/getCoupon/getCoupon');
require('../../pages/ucenter/record/record');
require('../../pages/ucenter/collection/collection');
require('../../pages/ucenter/coupon/coupon');
require('../../pages/ucenter/activity/activity');
require('../../pages/ucenter/servicer/servicer');
require('../../pages/ucenter/serviceType/serviceType');
require('../../pages/index/video/video');
require('../../pages/index/success/success');
require('../../pages/index/signDetail/signDetail');
require('../../pages/login/login');
require('../../pages/getPwd/getPwd');
require('../../pages/register/register');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
}