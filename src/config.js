export const basicBlock = {
    //智能人群
    'intePeople': {
        replace: true,
        back: false
    },
    //管理分组
    'manageGroup': {
        replace: true,
        back: false
    },
    // 会员卡设置
    'cardSetting': {
        replace: true,
        back: false
    },
    // 头像徽章设置
    'tagSetting': {
        replace: true,
        back: false
    },
    // 解锁记录
    'lockRecord': {
        replace: true,
        back: false
    },
    //积分互动-大转盘
    // 'turntable': {
    //     replace: false,
    //     back: false,
    //     alert: true
    // },
    // //积分互动-签到
    // 'sign': {
    //     replace: false,
    //     back: false,
    //     alert: true
    // },
    // //积分互动-关注店铺
    // 'followShop': {
    //     replace: false,
    //     back: false,
    //     alert: true
    // },
    // //积分互动-邀请好友关注店铺
    // 'inviting': {
    //     replace: false,
    //     back: false,
    //     alert: true
    // },
    //积分互动-关注商品
    'focusGoods': {
        replace: false,
        back: false,
        alert: true
    },
    //积分互动-加购商品
    'buyGoods': {
        replace: false,
        back: false,
        alert: true
    },
    // 积分商品-商品折扣
    'goodsDiscount': {
        replace: false,
        back: false,
        alert: true
    },
    //积分商城-创建实物
    'matter': {
        replace: false,
        back: false,
        alert: true
    },
    //积分商城-创建优惠券
    // 'giftCoupon': {
    //     replace: false,
    //     back: false,
    //     alert: true
    // },
    //积分互动-会员福利社-拼团
    'collage': {
        replace: false,
        back: false,
        alert: true
    },
    //积分互动-会员福利社-砍价
    'bargain': {
        replace: false,
        back: false,
        alert: true
    }
};

export const ziying = {
    //积分商城-创建优惠券
    // 'giftCoupon': {},
    // 积分商品-商品折扣
    //'goodsDiscount': {},
    // 创建优惠券
    // 'createMembere': {},
    //商品折扣
    'goodsDiscount': {},
    //积分互动-会员福利社-拼团
    'collage': {},
    //积分互动-会员福利社-砍价
    'bargain': {},
    //会员权益-会员专享价
    'promotion':{}
};

export const friendBlockList = [
    '1000001036',
    '739130'
]

//todo 很重要判断效果的逻辑
//    /marketing/getMarketingList
//        (1)/marketing/getMarketingAnalyzeData  参数type:1 自有通道
//    /jdMarketing/list
//        (1)type:1     /jdMarketing/getSmsEffect
//        (2)type:3或4  /marketing/getMarketingAnalyzeData  参数 type:2 京东通道
export const PlatFormType = {
  own: "1",
  jd: "2"
};
export const JdMarketingTypeMap = {
  1: {
    platFormType: "2",
    path: "analysisZY"
  },
  2:{
  },
  3: {
    platFormType: "1",
    paramType: 2,
    path: "analysis"
  },
  4: {
    platFormType: "1",
    paramType: 2,
    path: "analysis"
  }
};

export const YYYYMMDD = 'YYYY-MM-DD';
export const YYYYMM = 'YYYY-MM';
export const TWOYYYYMMDD = 'YYYY.MM.DD';
export const YYYYMMDDhhmmss = 'YYYY-MM-DD HH:mm:ss';
export const YYYYMMDDhhmm = 'YYYY-MM-DD HH:mm';
export const yyyymmddhhmm = 'YYYY/MM/DD HH:mm';
export const MMDD = 'MM-DD';
export const MMDOTDD = 'MM.DD';
export const HHmm = 'HH:mm';
export const YYYYMMDDhhmmssString = 'YYYYMMDDHHmmss';
