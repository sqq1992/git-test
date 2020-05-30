// import Vue from 'vue';
// import VueRouter from 'vue-router';
import store from './store.js';
import http from './api/index';
import { basicBlock, ziying } from './config';
import {point} from 'src/common/point.js';
import confirm from './components/confirm/index';

Vue.use(VueRouter);

// 忠诚度管理
//会员等级规则
const member = resolve => require(['./view/loyalty/member'], resolve);
//积分管理
const integral = resolve => require(['./view/loyalty/integral'], resolve);

// 权益中心
//会员专享权益
const memberPower = resolve => require(['./view/member/memberPower'], resolve);
//会员专享权益 / 会员专享券
const onlymember = resolve => require(['./view/member/onlymember'], resolve);
//会员专享权益 / 新会员专享券
const newmember = resolve => require(['./view/member/newmember'], resolve);
//会员专享权益 / 新会员专享券 ／ 新建
const createMembere = resolve => require(['./view/member/createMembere'], resolve);
//会员专享权益 / 会员开卡
const memberCardList = resolve => require(['./view/member/cardList'], resolve);
//会员专享权益 / 会员开卡 ／ 新建
const createCard = resolve => require(['./view/member/createCard'], resolve);
//会员专享权益 / 会员开卡 ／ 查看
const checkCard = resolve => require(['./view/member/checkCard'], resolve);
//会员专享权益 / 会员专享券 / 查看
const seeMember = resolve => require(['./view/member/seeMember'], resolve);
//会员专享权益 / 会员专享促销 /
const promotion = resolve => require(['./view/member/promotion'], resolve);
//会员专享权益 / 会员专享促销 / 参与记录
const promotionList = resolve => require(['./view/member/promotionList'], resolve);
//会员专享权益 / 会员专享促销 / 创建会员专享价
const memberDiscount = resolve => require(['./view/member/memberDiscount'], resolve);


// 页面管理
const pageManage = resolve => require(['./view/pageManage/pageManage'], resolve);
// 会员中心
const userCenter = resolve => require(['./view/pageManage/userCenter'], resolve);
// 店铺故事
const shopStory = resolve => require(['./view/pageManage/shopStory'], resolve);
// 品牌故事列表页
const shopList = resolve => require(['./view/pageManage/shopList'], resolve);
// 会员俱乐部
const userClub = resolve => require(['./view/pageManage/userClub/userClub'], resolve);
// 会员卡设置
const cardSetting = resolve => require(['./view/pageManage/userClub/cardSetting'], resolve);
// 图标设置
const iconSetting = resolve => require(['./view/pageManage/userClub/iconSetting'], resolve);
// 头像徽章设置
const tagSetting = resolve => require(['./view/pageManage/userClub/tagSetting'], resolve);
// 解锁记录
const lockRecord = resolve => require(['./view/pageManage/userClub/lockRecord'], resolve);
// 常用页面
const userPages = resolve => require(['./view/pageManage/userPages'], resolve);



//智能人群
const intelligentPeople = resolve => require(['./view/vipManage/intelligentPeople'], resolve);
//管理分组
const manageGroup = resolve => require(['./view/vipManage/smartProple/manageGroup'], resolve);
//会员列表
const vipList = resolve => require(['./view/vipManage/vipList'], resolve);
//会员分析
const vipAnalysis = resolve => require(['./view/vipManage/vipAnalysis'], resolve);

//积分互动-互动中心
const interactionCenter = resolve => require(['./view/integral/interaction/center'], resolve);
//积分互动-活动列表
const interactionList = resolve => require(['./view/integral/interaction/list'], resolve);
//积分互动-创建幸运大转盘
const turntable = resolve => require(['./view/integral/interaction/turntable'], resolve);
//积分互动-创建每日签到
const sign = resolve => require(['./view/integral/interaction/sign'], resolve);
//积分互动-活动统计
const interactionStatistics = resolve => require(['./view/integral/interaction/interactionStatistics'], resolve);
//积分互动-参与记录
const interactionPartake = resolve => require(['./view/integral/interaction/interactionPartake'], resolve);
//积分互动-奖品记录
const interactionReward = resolve => require(['./view/integral/interaction/interactionReward'], resolve);
//积分商城
const integralCenter = resolve => require(['./view/integral/shop/center'], resolve);
//积分商城-礼品列表
const giftList = resolve => require(['./view/integral/shop/list'], resolve);
//积分商城-兑换列表
const exchangeList = resolve => require(['./view/integral/shop/exchange'], resolve);
//积分商城-新建优惠券礼品
const giftCoupon = resolve => require(['./view/integral/shop/coupon'], resolve);
const jdGiftCoupon = resolve => require(['./view/integral/shop/jdCoupon'], resolve);
//积分商城-新建优惠券礼品
const matter = resolve => require(['./view/integral/shop/matter'], resolve);
// 积分商城-新建商品折扣
const goodsDiscount = resolve => require(['./view/integral/shop/goodsDiscount'], resolve);
//积分互动-关注店铺
const followShop = resolve => require(['./view/integral/interaction/followShop'], resolve);
//积分互动-加购商品
const buyGoods = resolve => require(['./view/integral/interaction/buyGoods'], resolve);
//积分互动-关注商品
const focusGoods = resolve => require(['./view/integral/interaction/focusGoods'], resolve);
//积分互动-邀请好友关注店铺
const inviting = resolve => require(['./view/integral/interaction/inviting'], resolve);
//积分互动-会员福利社
const welfare = resolve => require(['./view/integral/welfare/center'], resolve);
//积分互动-会员福利社-拼团
const collage = resolve => require(['./view/integral/welfare/collage'], resolve);
//积分互动-会员福利社-砍价
const bargain = resolve => require(['./view/integral/welfare/bargain'], resolve);
//积分互动-会员福利社-活动列表
const welfareList = resolve => require(['./view/integral/welfare/list'], resolve);
//积分互动-会员福利社-活动统计
const welfareStatistics = resolve => require(['./view/integral/welfare/welfareStatistics'], resolve);
//积分互动-会员福利社-参与记录
const welfarePartake = resolve => require(['./view/integral/welfare/welfarePartake'], resolve);
//积分互动-会员福利社-奖品记录
const welfareReward = resolve => require(['./view/integral/welfare/welfareReward'], resolve);
//积分互动-会员福利社-瓜分优惠券
const partition = resolve => require(['./view/integral/welfare/partition'], resolve);
//积分互动-关注店铺
const perfectMsg = resolve => require(['./view/integral/interaction/perfectMsg'], resolve);
//积分互动-新人入会礼
const newMembership = resolve => require(['./view/integral/interaction/newMembership'],resolve);
//积分互动-加购有礼
const purchase = resolve => require(['./view/integral/interaction/purchase'],resolve);
//积分互动-邀请加购有礼
const invitePurchase =resolve => require(['./view/integral/interaction/invitePurchase'],resolve);
//积分互动-h5小游戏
const h5Game = resolve => require(['./view/integral/interaction/h5Game'],resolve);

// 数据统计
// 每日统计
const todayStatical = resolve => require(['./view/statistical/today/today'], resolve);
// 积分统计
const integralStatical = resolve => require(['./view/statistical/integral/integral'], resolve);
// 互动统计
const interactiveStatical = resolve => require(['./view/statistical/interactive/interactive'], resolve);
// 兑换统计
const exchangeStatical = resolve => require(['./view/statistical/exchange/exchange'], resolve);

// 智能营销
const marketing = resolve => require(['./view/marketing/marketing'], resolve);
const marketingMember = resolve => require(['./view/marketing/marketing/action/member'], resolve);
const memberZY = resolve => require(['./view/marketing/marketing/action/memberZY'],resolve);
const marketingMobile = resolve => require(['./view/marketing/marketing/action/mobile'], resolve);
const marketingAssignMember = resolve => require(['./view/marketing/marketing/action/assignMember'], resolve);
const marketingSmsRecharge = resolve => require(['./view/marketing/marketingSmsRecharge'], resolve);
const marketingDate = resolve => require(['./view/marketing/marketingDate'], resolve);
const marketingAutoMessage = resolve => require(['./view/marketing/marketingAutoMessage'], resolve);

//效果分析
const analysis = resolve => require(['./view/analysis/index'], resolve);
//效果分析--自营店
const analysisZY = resolve => require(['./view/analysisZY/index'], resolve);

// 临时页面
const vedioTemp = resolve => require(['./view/promotion/video'], resolve);
const exchangeTemp = resolve => require(['./view/promotion/uploadExchangeList'], resolve);

// 基础版提示页面
const basicBlockTemp = resolve => require(['./view/basicBlock'], resolve);

// 首页
const index = resolve => require(['./view/index'], resolve);

const pointCtrol = name => {//打点
  switch(name) {
    case 'marketingSmsRecharge'://充值页
      point('37977.37978');
    break;
    case 'intePeople'://智能人群
      point('37977.39398');
    break;
    case 'vipList'://会员列表
      point('37977.39399');
    break;
    case 'vipAnalysis'://会员分析
      point('37977.39400');
    break;
    case 'marketing'://智能营销
      point('37977.39401');
    break;
    // case ''://短信充值
    //   point('37977.39402');
    // break;
    case 'interactionCenter'://互动管理
      point('37977.39403');
    break;
    case 'integralCenter'://积分商城
      point('37977.39404');
    break;
    case 'welfare'://会员福利社
      point('37977.39405');
    break;
    case 'member'://等级规则
      point('37977.39406');
    break;
    case 'integral'://积分管理
      point('37977.39407');
    break;
    case 'memberPower'://会员权益
      point('37977.39408');
    break;
    case 'pageManage'://页面设置
      point('37977.39409')
    break;
    case 'userCardSetting'://个性化设置
      point('37977.39410');
    break;
    case 'userPages'://常用页面
      point('37977.39411');
    break;
    case 'todayStatical'://每日数据统计
      point('37977.39412');
    break;
    case 'integralStatical'://积分统计
      point('37977.39413');
    break;
    case 'interactiveStatical'://互动统计
      point('37977.39414');
    break;
    case 'exchangeStatical'://兑换统计
      point('37977.39415');
    break;
    // default:
    // break;
  }
}
const beforeEnter = (to, from, next) => {
    if(!store.state.user.shopName){
        // const param = fetchQuery()
        // toast.show();
        http({
            api_name: 'memberquery',
            vm: this,
            data: {}
        }, ({data:{CrmUser,balance}}) => {
            let data = Object.assign(CrmUser,balance);
            store.dispatch('user', data).then(() => {
                /* 0 pop 1 自营 */
                store.dispatch('updateIsZiying', !!CrmUser.venderType).then(() => {
                    /* 为了保证 奖励积分规则也能正确的使用到  vuex 中的 isZiying，只能在初始化页面的时候，进行调取 */
                    pointCtrol(to.name);//打点
                    versionCtrol(to, from, next);
                });
            });
            if (localStorage.getItem('hasInfo') != 'true') {
                setTimeout(() => {
                    let confirmCom = Vue.extend(confirm)
                    let component = new confirmCom().$mount()
                    document.getElementById('app').appendChild(component.$el)
                    localStorage.setItem('hasInfo', true)
                },200)
            }
        });
    }else {
        pointCtrol(to.name);//打点
        versionCtrol(to, from, next)
    }
}

// 版本控制方法
const versionCtrol = (to, from, next) => {
    // 是否为自营店的控制方法     先判断是否为  自营  在判断 版本
    let versionRank = Number(store.state.user.versionRank);
    next();

    function isZiyingGo(){
        if(ziying[to.name]){
            if(store.state.ziying.isZiying){
                Vue.prototype.$alert('该功能暂不支持自营店铺', '温馨提示');
                next(false);
            } else {
                basicCtrolFn();
            }
        } else {
            basicCtrolFn();
        }
    }
    function basicCtrolFn(){
        next();
        return;
        switch(versionRank){
            case 0:
                basicCtrol(to, from, next);
                break;
            default:
                next();
                break;
        }
    }
    isZiyingGo();
}

// 基础版控制方法
const basicCtrol = (to, from, next) => {
    if(basicBlock[to.name]){
        let data = basicBlock[to.name];
        if(data.replace){
            /* 将config中的参数附加到 meta 中，供后面进行使用 */
            let keys = Object.keys(data);
            keys.forEach(i => {
                to['meta'][i] = data[i];
            });
            next();
        } else if(data.back){
            // 中断当前导航
            next(false);
        } else if(data.alert){
            Vue.prototype.$alert('您目前是免费体验版，无法使用该功能，订购一个月及以上版本后即可使用(暂不支持自营店铺)', '温馨提示', {
                confirmButtonText: '立即订购',
                callback: action => {
                    if(action == 'confirm'){
                        window.open('http://fw.jd.com/657606.html');
                    }
                }
            });
            next(false);
        }
    } else {
        next();
    }
}

const routes = [
    //首页
    {
        path: '/index',
        components: {
            'default': index,
            basicBlockTemp
        },
        name: 'index',
        redirect: { name: 'intePeople' },
        beforeEnter
    },
    //积分管理
    {
        path: '/integral',
        components: {
            'default': integral,
            basicBlockTemp
        },
        name: 'integral',
        beforeEnter
    },
    //会员等级规则
    {
        path: '/member',
        components: {
            'default': member,
            basicBlockTemp
        },
        name: 'member',
        beforeEnter
    },
    //会员专享权益
    {
        path: '/memberpower',
        components: {
            'default': memberPower,
            basicBlockTemp
        },
        name: 'memberPower',
        beforeEnter
    },
    //会员专享权益 / 会员专享券
    {
        path: '/onlymember',
        components: {
            'default': onlymember,
            basicBlockTemp
        },
        name: 'onlymember',
        beforeEnter
    },
    //会员专享权益 / 新会员专享券
    {
        path: '/newmember',
        components: {
            'default': newmember,
            basicBlockTemp
        },
        name: 'newmember',
        beforeEnter
    },
    // 会员卡包列表
    {
        path: '/memberCardList',
        components: {
            'default': memberCardList,
            basicBlockTemp
        },
        name: 'memberCardList',
        beforeEnter
    },
    //会员专享权益 / 新会员专享券 ／ 新建
    {
        path: '/createMembere',
        components: {
            'default': createMembere,
            basicBlockTemp
        },
        name: 'createMembere',
        beforeEnter
    },
    //会员专享权益 / 会员开卡 ／ 新建
    {
        path: '/createCard',
        components: {
            'default': createCard,
            basicBlockTemp
        },
        name: 'createCard',
        beforeEnter
    },
    //会员专享权益 / 会员开卡 / 查看
    {
        path: '/checkCard',
        components: {
            'default': checkCard,
            basicBlockTemp
        },
        name: 'checkCard',
        beforeEnter
    },
    //会员专享权益 / 会员专享券 / 查看
    {
        path: '/seeMember',
        components: {
            'default': seeMember,
            basicBlockTemp
        },
        name: 'seeMember',
        beforeEnter
    },
    //会员专享权益 / 会员专享促销 /
    {
        path: '/promotion',
        components: {
            'default': promotion,
            basicBlockTemp
        },
        name: 'promotion',
        beforeEnter
    },
    //会员专享权益 / 会员专享促销 / 参与记录
    {
        path: '/promotionList',
        components: {
            'default': promotionList,
            basicBlockTemp
        },
        name: 'promotionList',
        beforeEnter
    },
    //会员专享权益 / 会员专享促销 / 创建
    {
        path: '/memberDiscount',
        components: {
            'default': memberDiscount,
            basicBlockTemp
        },
        name: 'memberDiscount',
        beforeEnter
    },
    // 页面管理
    {
        path: '/pageManage',
        components: {
            'default': pageManage,
            basicBlockTemp
        },
        name: 'pageManage',
        beforeEnter
    },
    // 会员中心
    {
        path: '/userCenter',
        components: {
            'default': userCenter,
            basicBlockTemp
        },
        name: 'userCenter',
        beforeEnter
    },
    // 品牌故事列表页
    {
        path: '/shopList',
        name: 'shopList',
        components: {
            'default': shopList,
            basicBlockTemp
        },
        beforeEnter
    },
    // 品牌故事
    {
        path: '/shopStory',
        components: {
            'default': shopStory,
            basicBlockTemp
        },
        name: 'shopStory',
        beforeEnter
    },
    // 会员卡设置
    {
        path: '/userCardSetting',
        name: 'cardSetting',
        components: {
            'default': cardSetting,
            basicBlockTemp
        },
        beforeEnter
    },
    // 图标设置
    {
        path: '/userIconSetting',
        name: 'iconSetting',
        components: {
            'default': iconSetting,
            basicBlockTemp
        }
    },
    // 头像徽章设置
    {
        path: '/usertTagSetting',
        name: 'tagSetting',
        components: {
            'default': tagSetting,
            basicBlockTemp
        },
        beforeEnter
    },
    // 解锁记录
    {
        path: '/userLockRecord',
        name: 'lockRecord',
        components: {
            'default': lockRecord,
            basicBlockTemp
        },
        beforeEnter
    },
    // 常用页面
    {
        path: '/userPages',
        name: 'userPages',
        components: {
            'default': userPages,
            basicBlockTemp
        },
        beforeEnter
    },
    //智能人群
    {
        path: '/intePeople',
        components: {
            'default': intelligentPeople,
            basicBlockTemp
        },
        name: 'intePeople',
        beforeEnter
    },
    //管理分组
    {
        path: '/manageGroup',
        components: {
            'default': manageGroup,
            basicBlockTemp
        },
        name: 'manageGroup',
        beforeEnter
    },
    //会员分析
    {
        path: '/vipAnalysis',
        components: {
            'default': vipAnalysis,
            basicBlockTemp
        },
        name: 'vipAnalysis',
        beforeEnter
    },
    //会员列表
    {
        path: '/vipList',
        components: {
            'default': vipList,
            basicBlockTemp
        },
        name: 'vipList',
        beforeEnter
    },
    //积分互动-互动中心
    {
        path: '/interactionCenter',
        components: {
            'default': interactionCenter,
            basicBlockTemp
        },
        name: 'interactionCenter',
        beforeEnter
    },
    //积分互动-活动列表
    {
        path: '/interactionList',
        components: {
            'default': interactionList,
            basicBlockTemp
        },
        name: 'interactionList',
        beforeEnter
    },
     //积分互动-大转盘
     {
        path: '/turntable',
        components: {
            'default': turntable,
            basicBlockTemp
        },
        name: 'turntable',
        beforeEnter
    },
    //积分互动-签到
    {
        path: '/sign',
        components: {
            'default': sign,
            basicBlockTemp
        },
        name: 'sign',
        beforeEnter
    },
    //积分互动-关注店铺
    {
        path: '/followShop',
        components: {
            'default': followShop,
            basicBlockTemp
        },
        name: 'followShop',
        beforeEnter
    },
    //积分互动-完善会员信息
    {
        path: '/perfectMsg',
        components: {
            'default': perfectMsg,
            basicBlockTemp
        },
        name: 'perfectMsg',
        beforeEnter
    },
    //积分互动-新人入会礼
    {
      path: '/newMembership',
      components: {
        'default': newMembership,
        basicBlockTemp
      },
      name: 'newMembership',
      beforeEnter
    },
    //积分互动-加购有礼
    {
      path: '/purchase',
      components: {
        'default': purchase,
        basicBlockTemp
      },
      name: 'newMembership',
      beforeEnter
    },
     //积分互动-邀请加购有礼
    {
      path: '/invitePurchase',
      components: {
        'default': invitePurchase,
        basicBlockTemp
      },
      name: 'newMembership',
      beforeEnter
    },
    //积分互动-h5小游戏
    {
      path:'/h5Game',
      components:{
        'default':h5Game,
        basicBlockTemp
      },
      name:'h5Game',
      beforeEnter
    },
    //积分互动-邀请好友关注店铺
    {
        path: '/inviting',
        components: {
            'default': inviting,
            basicBlockTemp
        },
        name: 'inviting',
        beforeEnter
    },
    //积分互动-关注商品
    {
        path: '/focusGoods',
        components: {
            'default': focusGoods,
            basicBlockTemp
        },
        name: 'focusGoods',
        beforeEnter
    },
    //积分互动-加购商品
    {
        path: '/buyGoods',
        components: {
            'default': buyGoods,
            basicBlockTemp
        },
        name: 'buyGoods',
        beforeEnter
    },
    //积分互动-活动统计
    {
        path: '/interactionStatistics',
        components: {
            'default': interactionStatistics,
            basicBlockTemp
        },
        name: 'interactionStatistics',
        beforeEnter
    },
    //积分互动-参与记录
    {
        path: '/interactionPartake',
        components: {
            'default': interactionPartake,
            basicBlockTemp
        },
        name: 'interactionPartake',
        beforeEnter
    },
    //积分互动-奖品记录
    {
        path: '/interactionReward',
        components: {
            'default': interactionReward,
            basicBlockTemp
        },
        name: 'interactionReward',
        beforeEnter
    },
    //积分商城
    {
        path: '/integralCenter',
        components: {
            'default': integralCenter,
            basicBlockTemp
        },
        name: 'integralCenter',
        beforeEnter
    },
    //积分商城-礼品列表
    {
        path: '/giftList',
        components: {
            'default': giftList,
            basicBlockTemp
        },
        name: 'giftList',
        beforeEnter
    },
    //积分商城-兑换列表
    {
        path: '/exchangeList',
        components: {
            'default': exchangeList,
            basicBlockTemp
        },
        name: 'exchangeList',
        beforeEnter
    },
    //积分商城-创建优惠券
    {
        path: '/giftCoupon',
        components: {
            'default': giftCoupon,
            basicBlockTemp
        },
        name: 'giftCoupon',
        beforeEnter
    },
    //积分商城-创建jd优惠券
    {
      path: '/jdGiftCoupon',
      components: {
        'default': jdGiftCoupon,
        basicBlockTemp
      },
      name: 'jdGiftCoupon',
      beforeEnter
    },
    //积分商城-创建实物
    {
        path: '/matter',
        components: {
            'default': matter,
            basicBlockTemp
        },
        name: 'matter',
        beforeEnter
    },
    // 积分商品-商品折扣
    {
        path: '/discount',
        components: {
            'default': goodsDiscount,
            basicBlockTemp
        },
        name: 'goodsDiscount',
        beforeEnter
    },
    // 视频帮助
    {
        path: '/promotion/videoHelp',
        component: vedioTemp,
        name: 'promotionVedio',
        meta: {
            hideTop: true,
            hideLeft: true
        }
    },
    // 批量导入导出帮助
    {
        path: '/promotion/exchangeTemp',
        component: exchangeTemp,
        name: 'promotionExchange',
        meta: {
            hideTop: true,
            hideLeft: true
        }
    },
    //积分互动-会员福利社-活动统计
    {
        path: '/welfareStatistics',
        components: {
            'default': welfareStatistics,
            basicBlockTemp
        },
        name: 'welfareStatistics',
        beforeEnter
    },
    //积分互动-会员福利社-参与记录
    {
        path: '/welfarePartake',
        components: {
            'default': welfarePartake,
            basicBlockTemp
        },
        name: 'welfarePartake',
        beforeEnter
    },
    //积分互动-会员福利社-奖品记录
    {
        path: '/welfareReward',
        components: {
            'default': welfareReward,
            basicBlockTemp
        },
        name: 'welfareReward',
        beforeEnter
    },
    //积分互动-会员福利社-瓜分优惠券
    {
        path: '/partition',
        components: {
            'default': partition,
            basicBlockTemp
        },
        name: 'partition',
        beforeEnter
    },
    //积分互动-会员福利社
    {
        path: '/welfare',
        components: {
            'default': welfare,
            basicBlockTemp
        },
        name: 'welfare',
        beforeEnter
    },
    //积分互动-会员福利社-活动列表
    {
        path: '/welfareList',
        components: {
            'default': welfareList,
            basicBlockTemp
        },
        name: 'welfareList',
        beforeEnter
    },
    //积分互动-会员福利社-砍价
    {
        path: '/bargain',
        components: {
            'default': bargain,
            basicBlockTemp
        },
        name: 'bargain',
        beforeEnter
    },
    //积分互动-会员福利社-拼团
    {
        path: '/collage',
        components: {
            'default': collage,
            basicBlockTemp
        },
        name: 'collage',
        beforeEnter
    },
    // 每日统计
    {
        path: '/statical/today',
        components: {
            'default': todayStatical,
            basicBlockTemp
        },
        name: 'todayStatical',
        beforeEnter
    },
    // 积分统计
    {
        path: '/statical/integral',
        components: {
            'default': integralStatical,
            basicBlockTemp
        },
        name: 'integralStatical',
        beforeEnter
    },
    // 互动统计
    {
        path: '/statical/interactive',
        components: {
            'default': interactiveStatical,
            basicBlockTemp
        },
        name: 'interactiveStatical',
        beforeEnter
    },
    // 兑换统计
    {
        path: '/statical/exchange',
        components: {
            'default': exchangeStatical,
            basicBlockTemp
        },
        name: 'exchangeStatical',
        beforeEnter
    },

    // 智能营销 - 营销日历
    // {
    //     path: '/marketingDate',
    //     components: {
    //         'default': marketingDate,
    //         basicBlockTemp
    //     },
    //     name: 'marketingDate',
    //     beforeEnter
    // },

    // 智能营销 - 智能营销
    {
      path: '/marketing',
      components: {
        'default': marketing,
        basicBlockTemp
      },
      name: 'marketing',
      beforeEnter
    },

      // 智能营销 - 新建会员营销
      {
        path: '/marketingMember',
        components: {
          'default': marketingMember,
          basicBlockTemp
        },
        name: 'marketingMember',
        beforeEnter
      },
      {
        path:'/memberZY',
        components: {
          'default': memberZY,
          basicBlockTemp
        },
        name: 'memberZY',
        beforeEnter
      },
      // 智能营销 - 新建会员营销
      {
        path: '/marketingMobile',
        components: {
          'default': marketingMobile,
          basicBlockTemp
        },
        name: 'marketingMobile',
        beforeEnter
      },
      // 智能营销 - 新建会员营销
      {
        path: '/marketingAssignMember',
        components: {
          'default': marketingAssignMember,
          basicBlockTemp
        },
        name: 'marketingAssignMember',
        beforeEnter
      },



    // 智能营销 - 短信充值
    {
      path: '/marketingSmsRecharge',
      components: {
        'default': marketingSmsRecharge,
        basicBlockTemp
      },
      name: 'marketingSmsRecharge',
      beforeEnter
    },
    //智能营销 - 自动短信
    {
      path: '/marketingAutoMessage',
      components: {
        'default':marketingAutoMessage,
        basicBlockTemp
      },
      name: 'marketingAutoMessage',
      beforeEnter
    },

    {
      path: '/analysis',
      components: {
        'default':analysis
      },
      name:'analysis',
      beforeEnter
    },
    {
      path: '/analysisZY',
      components: {
        'default':analysisZY
      },
      name:'analysisZY',
      beforeEnter
    },

    // 404
    {
        path: '*',
        redirect: {
            name: 'intePeople'
        }
    }
];


const router = new VueRouter({
    routes: routes,
    mode: 'hash',
    linkActiveClass: 'active'
});

export default router;
