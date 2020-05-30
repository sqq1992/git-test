export const mainUrl = 'https://wdkj-isv.isvjcloud.com/';
// export const mainUrl = 'https://wdkj-isv.jdfw1.com/';

export const menu = [
    {
        name: '商品链接',
        value: 'good'
    },
    {
        name: '店铺首页',
        value: 'shopindex'
    },
    {
        name: '会员互动',
        value: 'hudong',
        children: [
            {
                name: '每日签到',
                value: 'sign',
                haveChild: true
            },
            {
                name: '大转盘',
                value: 'draw',
                haveChild: true
            }
        ]
    },
    {
        name: '积分商城',
        value: 'mall',
        children: [
            {
                name: '优惠券',
                value: 'coupons',
                haveChild: true
            },
            {
                name: '商品折扣',
                value: 'discount',
                haveChild: true
            },
            {
                name: '实物礼品',
                value: 'physical',
                haveChild: true
            }
        ]
    },
    {
        name: '常用页面',
        value: 'page',
        children: [
            {
                name: '互动中心',
                value: 'hdlist',
                link: mainUrl+'?href=hd/list'
            },
            {
                name: '积分商城',
                value: 'malllist',
                link: mainUrl+'?href=integral/mall'
            },
            {
                name: '品牌故事',
                value: 'shopstory',
                link: mainUrl+'?href=user/shopStory'
            },
            {
                name: '会员升级',
                value: 'userlevel',
                link: mainUrl+'?href=user/level'
            },
            {
                name: '个性会员卡',
                value: 'usercard',
                link: mainUrl+'?href=user/me'
            }
        ]
    },
    {
        name: '自定义链接',
        value: 'customlink'
    }
];
