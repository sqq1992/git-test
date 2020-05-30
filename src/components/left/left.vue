<template>
    <div class="col-side" id="module-user-leftNav">
        <!-- 左侧二级导航 -->
        <div class="crm_leftNav" id="modlue_leftNav" style="min-height: 140px;">
            <ul class="leftNav">
                <!-- <li :class="{'curs': one == 0}">
                    <h3><router-link :to="{path: 'index'}">首页</router-link></h3>
                </li> -->
                <li :class="{'curs': one.includes(1)}">
                    <h3>
                        <router-link :to="{path: 'intePeople'}">
                            <span>会员管理</span>
                        </router-link>
                        <i class="icon" :class="{'el-icon-arrow-down': !one.includes(1), 'el-icon-arrow-up': one.includes(1)}" @click="changeNavSlide(1)"></i>
                    </h3>
                    <div v-show="one.includes(1)">
                        <router-link v-if="!inBrand" :class="{'curs': thisOne == 1 && two == 0}" :to="{path: '/intePeople'}">智能人群</router-link>
                        <router-link :class="{'curs': thisOne == 1 && two == 1}" :to="{path: '/vipList'}">会员列表</router-link>
                        <router-link v-if="!inBrand" :class="{'curs': thisOne == 1 && two == 2}" :to="{path: '/vipAnalysis'}">会员分析</router-link>
                    </div>
                </li>

                <li :class="{'curs': one.includes(7)}">
                  <h3>
                    <router-link :to="{path: 'marketingDate'}">
                      <span>智能营销</span>
                    </router-link>
                    <i class="icon" :class="{'el-icon-arrow-down': !one.includes(7), 'el-icon-arrow-up': one.includes(7)}" @click="changeNavSlide(7)"></i>
                  </h3>
                  <div v-show="one.includes(7)">
                    <!-- <router-link :class="{'curs': thisOne == 7 && two == 0}" :to="{path: 'marketingDate'}">营销日历</router-link> -->
                    <router-link  :class="{'curs': thisOne == 7 && two == 1}" :to="{path: '/marketing'}">智能营销</router-link>
                    <router-link :class="{'curs': thisOne == 7 && two == 2}" :to="{path: '/marketingSmsRecharge'}">短信充值</router-link>
                    <router-link v-if="!isZiying" :class="{'curs': thisOne == 7 && two == 3}" :to="{path:'/marketingAutoMessage'}">订单关怀 <span class="fc--red fw--bold">New</span> </router-link>
                  </div>
                </li>
                 <li :class="{'curs': one.includes(5)}">
                    <h3>
                        <router-link :to="{path: 'interactionCenter'}">
                            <span>积分互动</span>
                        </router-link>
                        <i class="icon" :class="{'el-icon-arrow-down': !one.includes(5), 'el-icon-arrow-up': one.includes(5)}" @click="changeNavSlide(5)"></i>
                    </h3>
                    <div v-show="one.includes(5)">
                        <router-link :class="{'curs': thisOne == 5 && two == 0}" :to="{path: '/interactionCenter'}">互动管理</router-link>
                        <router-link :class="{'curs': thisOne == 5 && two == 1}" :to="{path: '/integralCenter'}">积分商城</router-link>
                        <router-link :class="{'curs': thisOne == 5 && two == 2}" :to="{path: '/welfare'}">会员福利社</router-link>
                    </div>
                </li>
                <li :class="{'curs': one.includes(2)}">
                    <h3>
                        <router-link :to="{path: 'member'}">
                            <span>会员忠诚度</span>
                        </router-link>
                        <i class="icon" :class="{'el-icon-arrow-down': !one.includes(2), 'el-icon-arrow-up': one.includes(2)}" @click="changeNavSlide(2)"></i>
                    </h3>
                    <div v-show="one.includes(2)">
                        <router-link :class="{'curs': thisOne == 2 && two == 0}" :to="{path: '/member'}">等级规则</router-link>
                        <router-link :class="{'curs': thisOne == 2 && two == 1}" :to="{path: '/integral'}">积分管理</router-link>
                        <router-link :class="{'curs': thisOne == 2 && two == 2}" :to="{path: '/memberPower'}">会员权益</router-link>
                    </div>
                </li>
                <!-- <li :class="{'curs': one.includes(3)}">
                    <h3>
                        <router-link :to="{path: 'memberPower'}">
                            <span>会员权益</span>
                            <i class="icon" :class="{'el-icon-arrow-down': !one.includes(3), 'el-icon-arrow-up': one.includes(3)}" @click="changeNavSlide(3)"></i>
                        </router-link>
                    </h3>
                    <div v-show="one.includes(3)">
                        <router-link :class="{'curs': one.includes(3) && two == 0}" :to="{path: 'memberPower'}">专属权益</router-link>
                        <a target="_blank" href="https://crm.shop.jd.com/crm/createMarketing/createMarketing.action">营销工具</a>
                    </div>
                </li> -->
                <li :class="{'curs': one.includes(4)}">
                    <h3>
                        <router-link :to="{path: 'pageManage'}">
                            <span>会员中心</span>
                        </router-link>
                        <i class="icon" :class="{'el-icon-arrow-down': !one.includes(4), 'el-icon-arrow-up': one.includes(4)}" @click="changeNavSlide(4)"></i>
                    </h3>
                    <div v-show="one.includes(4)">
                        <router-link :class="{'curs': thisOne == 4 && two == 0}" :to="{path: '/pageManage'}">页面设置</router-link>
                        <!-- <router-link :class="{'curs': thisOne == 4 && two == 0}" :to="{path: '/userCenter'}">会员中心</router-link>
                        <router-link :class="{'curs': thisOne == 4 && two == 1}" :to="{path: '/shopList'}">品牌故事</router-link> -->
                        <router-link :class="{'curs': thisOne == 4 && two == 1}" :to="{name: 'cardSetting'}">个性化设置</router-link>
                        <router-link :class="{'curs': thisOne == 4 && two == 2}" :to="{name: 'userPages'}">常用页面</router-link>
                    </div>
                </li>
                <li :class="{'curs': one.includes(6)}">
                    <h3>
                        <router-link :to="{name: 'todayStatical'}">
                            <span>数据统计</span>
                        </router-link>
                        <i class="icon" :class="{'el-icon-arrow-down': !one.includes(6), 'el-icon-arrow-up': one.includes(6)}" @click="changeNavSlide(6)"></i>
                    </h3>
                    <div v-show="one.includes(6)">
                        <router-link :class="{'curs': thisOne == 6 && two == 0}" :to="{name: 'todayStatical'}">每日数据汇总</router-link>
                        <router-link :class="{'curs': thisOne == 6 && two == 1}" :to="{name: 'integralStatical'}">积分统计</router-link>
                        <router-link :class="{'curs': thisOne == 6 && two == 2}" :to="{name: 'interactiveStatical'}">互动统计</router-link>
                        <router-link :class="{'curs': thisOne == 6 && two == 3}" :to="{name: 'exchangeStatical'}">兑换统计</router-link>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
// import $ from 'jquery';
export default {
    data() {
        return {
            isZiying:this.$store.state.ziying.isZiying,
            inBrand:this.$store.state.user.inBrand,
            one: [1, 2, 4, 5, 6, 7],
            thisOne: 1,
            two: 0,
            routeObj: {
                //智能人群
                "index": [0],
                //智能人群
                "intePeople": [1,0],
                "manageGroup": [1,0],
                //会员分析
                "vipAnalysis": [1,2],
                //会员列表
                "vipList": [1,1],
                // 智能人群
                "smartPeople": [1,0],
                // 会员列表
                "memberList": [1,1],
                // 会员分析
                "memberAnaly": [1,2],
                //积分互动
                "interactionCenter": [5,0],
                "interactionList": [5,0],
                "turntable": [5,0],
                "sign": [5,0],
                "interactionStatistics": [5,0],
                "interactionPartake": [5,0],
                "interactionReward": [5,0],
                "followShop": [5,0],
                "h5Game": [5,0],
                "focusGoods": [5,0],
                "buyGoods": [5,0],
                "inviting": [5,0],
                "perfectMsg": [5,0],
                "newMembership":[5,0],
                "purchase":[5,0],
                "invitePurchase":[5,0],
                //积分商城
                "integralCenter": [5,1],
                "giftList": [5,1],
                "exchangeList": [5,1],
                "giftCoupon": [5,1],
                "matter": [5, 1],
                "goodsDiscount": [5, 1],
                //会员福利社
                "welfare": [5,2],
                "collage": [5,2],
                "bargain": [5,2],
                "welfareList": [5,2],
                "welfarePartake": [5,2],
                "welfareReward": [5,2],
                "partition": [5,2],
                "welfareStatistics": [5,2],
                // 会员等级规则
                'member': [2,0],
                // 积分管理
                'integral': [2,1],
                // 会员专享权益
                'memberPower': [2,2],
                'memberCardList':[2,2,1],
                'createCard':[2,2,2],
                'checkCard':[2,2,3],
                // 会员专享券 
                'onlymember': [2,2,0],
                // 新会员专享券
                'newmember': [2,2,1],
                'promotion': [2,2,2,0],//会员专享价活动管理
                'promotionList': [2,2,2,1],//会员专享价参与记录
                'memberDiscount': [2,2,2,2],//会员专享价创建
                //会员专享权益 / 新会员专享券 ／ 新建
                'createMembere': [2,2,0,1],
                //会员专享权益 / 会员专享券 / 查看
                'seeMember': [2,2],
                // 页面管理
                'pageManage': [4,0],
                // 会员中心
                'userCenter': [4,0,0],
                // 品牌故事
                'shopStory': [4,0,1],
                // 品牌故事列表
                'shopList': [4,0,1],
                // 会员卡设置
                'cardSetting': [4,1,0],
                // 头像徽章设置
                'tagSetting': [4,1,1],
                // 解锁记录
                'lockRecord': [4,1,2],
                // 头像徽章设置
                'iconSetting': [4,1,3],
                // 常用页面
                'userPages': [4,2],
                // 基础版 介绍页
                'basicBlock': [0],
                // 每日统计
                'todayStatical': [6, 0],
                // 积分统计
                'integralStatical': [6, 1],
                // 互动统计
                'interactiveStatical': [6, 2],
                // 兑换统计
                'exchangeStatical': [6, 3],
                'marketingDate': [7,0],
                'marketing': [7,1],
                'marketingMember': [7,1,0],
                'memberZY':[7,1,0],
                'marketingMobile': [7,1,1],
                'marketingAssignMember': [7,1,2],
                'marketingSmsRecharge': [7,2],
                'marketingAutoMessage':[7,3],//自动短信
                'analysis': [],
                'analysisZY':[]
            },
            textArr: [
                {
                    name: '工作台',
                    href: '/index',
                },
                {
                    name: '会员管理',
                    href: '/intePeople',
                    children: [
                        {
                            name: '智能人群',
                            href: '/intePeople',
                            children: [{
                                name: '管理分组',
                                href: '/manageGroup'
                            }]
                        },
                        {
                            name: '会员列表',
                            href: '/vipList',
                        },
                        {
                            name: '会员分析',
                            href: '/vipAnalysis'
                        },
                    ]
                },
                {
                    name: '会员忠诚度',
                    href: '/member',
                    children: [
                        {
                            name: '等级规则',
                            href: '/member'
                        },
                        {
                            name: '积分管理',
                            href: '/integral'
                        },
                        {
                            name: '专属权益',
                            href: '/memberPower',
                            children: [
                                {
                                    name: '会员专享券',
                                    href: '/onlymember',
                                    children: [
                                        {
                                            name: '新建会员专享券',
                                        },
                                        {
                                            name: '查看会员专享券'
                                        }
                                    ]
                                },
                                {
                                    name: '新会员专享券',
                                    href: '/newmember',
                                    children: [
                                        {
                                            name: '新建新会员专享券',
                                        },
                                        {
                                            name: '查看新会员专享券'
                                        }
                                    ]
                                },
                                {
                                    name: '会员专享价',
                                    href: '/promotion',
                                    children: [
                                        {
                                            name: '会员专享价活动管理',
                                        },
                                        {
                                            name: '会员专享价参与记录'
                                        },
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    name: '会员权益',
                    href: '/memberPower',
                    children: [
                        {
                            name: '专属权益',
                            href: '/memberPower',
                            children: [
                                {
                                    name: '会员专享券',
                                    href: '/onlymember',
                                    children: [
                                        {
                                            name: '新建会员专享券',
                                        },
                                        {
                                            name: '查看会员专享券'
                                        }
                                    ]
                                },
                                {
                                    name: '新会员专享券',
                                    href: '/newmember',
                                    children: [
                                        {
                                            name: '新建新会员专享券',
                                        },
                                        {
                                            name: '查看新会员专享券'
                                        }
                                    ]
                                },
                                {
                                    name: '会员专享价',
                                    href: '/promotion',
                                    children: [
                                        {
                                            name: '会员专享价活动管理',
                                        },
                                        {
                                            name: '会员专享价参与记录'
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            name: '平台权益',
                            href: ''
                        }
                    ]
                },
                {
                    name: '会员中心',
                    href: '/pageManage',
                    children: [
                        {
                            name: '页面设置',
                            href: '/pageManage',
                            children: [
                                {
                                    name: '会员中心',
                                    href: '/userCenter'
                                },
                                {
                                    name: '品牌故事',
                                    href: '/shopStory'
                                }
                            ]
                        },
                        {
                            name: '个性化设置',
                            href: '/userCardSetting',
                            children: [
                                {
                                    name: '会员卡设置',
                                    href: '/userCardSetting'
                                },
                                {
                                    name: '头像徽章设置',
                                    href: '/usertTagSetting'
                                },
                                {
                                    name: '解锁记录',
                                    href: '/userLockRecord'
                                },
                                {
                                    name: '图标设置',
                                    href: '/userIconSetting'
                                }
                            ]
                        },
                    ]
                },
                {
                    name: '积分互动',
                    href: '/interactionCenter',
                    children: [
                        {
                            name: '互动管理',
                            href: '/interactionCenter'
                        },
                        {
                            name: '积分商城',
                            href: '/integralCenter'
                        },
                        {
                            name: '会员福利社',
                            href: '/welfare'
                        },
                    ]
                },
                {
                    name: '数据统计',
                    href: '/statical/today',
                    children: [
                        {
                            name: '每日数据汇总',
                            href: '/statical/today'
                        },
                        {
                            name: '积分统计',
                            href: '/statical/integral'
                        },
                        {
                            name: '互动统计',
                            href: '/statical/interactive'
                        },
                        {
                            name: '兑换统计',
                            href: '/statical/exchange'
                        },
                    ]
                },
                {
                  name: '智能营销',
                  href: '/marketingDate',
                  children: [
                    {
                      name: '营销日历',
                      href: '/marketingDate'
                    },
                    {
                      name: '智能营销',
                      href: '/marketing',
                      children: [
                        {
                          name: '新建会员营销',
                          href: '/marketingMember',
                          children: [
                            {
                              name: '新建会员营销'
                            },
                            {
                              name: '查看会员营销'
                            },
                          ]
                        },
                        {
                          name: '新建会员营销',
                          href: '/memberZY',
                          children: [
                            {
                              name: '新建会员营销'
                            },
                            {
                              name: '查看会员营销'
                            },
                          ]
                        },
                        {
                          name: '指定号码营销',
                          href: '/marketingMobile',
                          children: [
                            {
                              name: '新建指定号码营销'
                            },
                            {
                              name: '查看指定号码营销'
                            },
                          ]
                        },

                        {
                          name: '指定会员营销',
                          href: '/marketingAssignMember',
                          children: [
                            {
                              name: '新建指定会员营销'
                            },
                            {
                              name: '查看指定会员营销'
                            },
                          ]
                        },
                      ]
                    },
                    {
                      name: '短信充值',
                      href: '/marketingSmsRecharge'
                    },
                    {
                      name: '订单关怀',
                      href: '/marketingAutoMessage'
                    }
                  ]
                }
            ]
        }
    },
    watch: {
        '$route' (to, from) {
            let routeArray = this.routeObj[to.name];
            this.thisOne = this.routeObj[to.name][0];
            this.two = (this.routeObj[to.name][1] > -1) ? this.routeObj[to.name][1] : -1;
            if(to.name == 'manageGroup') {
                return
            }
            if(this.textArr[this.thisOne]){
                let navObj = returnRouterHref(this.textArr, routeArray, -1);
                function returnRouterHref(array, soureArr, index){
                    index++;
                    if(array[soureArr[index]]){
                        let obj = {};
                        obj.name = array[soureArr[index]].name;
                        obj.href = array[soureArr[index]].href;
                        if(array[soureArr[index]].children){
                            obj.children = returnRouterHref(array[soureArr[index]].children, soureArr, index);
                        }
                        return obj;
                    }
                }
                if(to.name != 'createMembere'){
                    this.$emit('navTextChange', navObj);
                }
            }
        }
    },
    methods: {
        changeLeftAcitve(){
            let path = this.$route.path;
            let pageLink = $('#modlue_leftNav a');
            pageLink.each((index, element) => {
                element = $(element);
                if(path == element.attr('href')){
                    element.addClass('curs').parents('li').addClass('curs');
                } else {
                    let childHrefs = element.attr('childHrefs');
                    if(childHrefs){
                        childHrefs = childHrefs.indexOf(',') != -1 ? childHrefs.split(',') : [childHrefs];
                        childHrefs.forEach(href => {
                            if(path == href){
                                element.addClass('curs').parents('li').addClass('curs');
                            }
                        });
                    }
                }
            });
        },
        changeNavSlide(num = 1){
            let index = this.one.indexOf(num);
            if(index === -1){
                this.one.push(num);
            } else {
                this.one.splice(index, 1);
            }
        }
    }
}
</script>

<style lang="less" scoped>
    // @import url('../../assets/css/modules/module.user.leftNav.less');
    #module-user-leftNav {
        width: 170px;
        background: #fff;
        float: left;
        overflow: auto;
        padding-right: 12px;
        box-sizing: border-box;
        .crm_leftNav{
            background: #fff;
            .leftNav{
                padding-top: 10px;
                a,li{
                    font-size: 14px; line-height: 46px; text-indent: 20px; color: #666; font-weight: 400; display: block; text-decoration: none;
                }
                a{
                    position: relative;font-size: 14px;line-height: 40px;text-indent: 30px;color: #666;font-weight: 400;display: block;text-decoration: none;
                    &:hover{
                        background: #fff; color: #000;
                    }
                    &.curs{
                        border-right: 2px solid #2987df; background: #e5f2ff; color: #2987df;
                    }
                    i.dot{
                        width: 6px; height: 6px; border-radius: 50%; background: red; position: absolute;
                    }
                }
                li{
                    // height: 46px;
                    position: relative;
                    // overflow: hidden;
                    transition: height .5s ease;
                    h3{font-size: 100%;padding: 0;
                        a{font-size: 14px;text-indent: 10px;}
                    }
                    &.curs{
                        height: auto;
                        h3{background: #fff; color: #333;
                            a{color: #333;}
                        }
                    }
                    a{
                        font-size: 12px; padding-left: 8px;
                        &.curs,&:hover{
                            background: #fff; color: #3089DE; background: #F7F8FA;
                        }
                        &.hover{
                            border: none;
                        }
                    }
                    .icon{
                        font-size: 11px;
                        color:  #999;
                        position: absolute;
                        right: 20px;
                        top: 17px;
                        cursor: pointer;
                    }
                }
            }
        }
    }
</style>

