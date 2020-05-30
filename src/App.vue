<template>
    <div id="app">
        <header-temp v-if="!hideTop"></header-temp>
        <left-temp :style="{'height': height+'px'}" v-on:navTextChange="bandNavChange" v-if="!hideLeft && ziying.update"></left-temp>
        <div id="container" :style="!hideTop ? `height: ${height}px;` : 'padding-left: 0;'">
            <div class="common-toolbar" id="toolbar" v-if="!hideTop">
                <div class="brand-nav">
                    <span>
                        <span v-for="(nav, navIndex) in navObj" :key="navIndex">
                            <span v-if="navIndex > 0"> > </span>
                            <router-link :to="nav.href" v-if="nav.href">{{nav.name}}</router-link>
                            <span v-if="!nav.href">{{nav.name}}</span>
                        </span>
                    </span>
                    <div class="top_kf">
                        <!-- <span class="red" style="margin-right: 5px;cursor: pointer;" @click="showUpdateInfo">功能更新</span> -->
                        <!-- <a class="blue" href="../static/旺店会员20180813.html" target="_blank">帮助说明</a> -->
                        <a href="javascript: void(0)" style="color: red;margin-right: 5px;" @click="showLevelDialog">重要通知：京东商城优惠逻辑升级</a>
                        <!-- <a class="blue" href="https://jdprice.shop.jd.com/discount/query" target="_blank" style="margin-right: 5px;color: #20a0ff;">查看店铺优惠监控</a> -->
                        <el-tooltip effect="light" placement="bottom">
                            <div slot="content"><img src="~assets/img/qqGroup.png" alt="" width="240"><p class="qqGroupName">商家交流群</p></div>
                            <a class="blue" href="javascript: void(0)" target="_blank" style="margin-right: 5px;color: #20a0ff;">QQ交流群</a>
                        </el-tooltip>
                        <a class="blue" href="../static/旺店会员v1.3.pdf" target="_blank" download>帮助说明</a>
                        <!-- 客服咨询：<a target="_blank" href="https://dd2-web.jd.com/pop/MTAzMTQwMDA"><img border="0" src="./assets/images/dongdong.png" width="15px"/></a> -->
                        客服咨询：<a target="_blank" href="https://jdcs.jd.com/index.action?venderId=790307"><img border="0" src="./assets/images/dongdong.png" width="15px"/></a>
                    </div>
                </div>
            </div>
            <router-view name="basicBlockTemp" v-if="$route.meta.replace" :style="!hideTop ? 'margin-top: 10px;min-height: calc(100% - 52px);background: #fff;' : 'background: #fff;'" v-on:navTextChange="bandNavChange"></router-view>
            <router-view :style="!hideTop ? 'margin-top: 10px;min-height: calc(100% - 52px);background: #fff;' : 'background: #fff;'" v-on:navTextChange="bandNavChange" v-else></router-view>
        </div>
        <div class="footer">
          Copyright © 2004 - 2020京东isvjcloud.com 版权所有 京ICP备17005970号-4
        </div>
        <!-- <bounce-in v-if="showDoble12" @close="showDoble12 = false"></bounce-in> -->
        <announcement v-if="ziying.update"></announcement>
    </div>
</template>
<script>
import { mapMutations,mapActions } from 'vuex';
import http from './api/index.js';
import {point} from 'src/common/point.js';
import formatDate from './common/formatDate.js';
import headerTemp from 'components/header/header.vue';
import leftTemp from 'components/left/left.vue';
// import $ from 'jquery';
import bounceIn from 'components/bounceIn/bounceIn.vue';
import announcement from 'components//announcement/announcement.vue';
import { mapState } from "vuex";
export default {
    name: 'app',
    data() {
        return {
            navObj: [{
                href: '',
                name: ''
            }],
            height: 0,
            hideTop: false,
            hideLeft: false,
            showDoble12: false
        }
    },
    mounted(){
        this.getHeight();
        window.onresize = this.getHeight;
        if(!window.localStorage.getItem('showUpdateInfo1_4_1')){
            this.showUpdateInfo();
            window.localStorage.setItem('showUpdateInfo1_4_1', 'true');
        }
        // if(!localStorage.getItem('showDoble12')){
        //     this.showDoble12 = true;
        //     window.localStorage.setItem('showDoble12', 'true');
        // }
        if(!localStorage.getItem('showHelpDialog_20190218')){
            this.showLevelDialog();
            window.localStorage.removeItem('showHelpDialog_20190215');
            window.localStorage.setItem('showHelpDialog_20190218', 'true');
        }
    },
    watch: {
        '$route'(){
            this.hideTop = this.$route.meta.hideTop;
            this.hideLeft = this.$route.meta.hideLeft;
        }
    },
    methods: {
        bandNavChange(navObj) {
            this.navObj = [];
            let vm = this;
            function changeNavObjType(obj){
                vm.navObj.push({
                    name: obj.name,
                    href: obj.href
                });
                if(obj.childer){
                    changeNavObjType(obj.childer);
                }
            }
            changeNavObjType(navObj);
        },
        getHeight(){
            this.height = $(window).height() - (45 + 40);
        },
        showUpdateInfo(){
            const h = this.$createElement;
            this.$msgbox({
                title: '功能更新',
                message: h('div', null, [
                    h('p', { style: 'color: #666;line-height: 1.6;' }, '让店铺的“会员中心”更加个性化：'),
                    h('p', { style: 'color: #666;line-height: 2;text-indent: 14px;font-size: 13px;' }, [
                        h('span', null, '1. 支持手动调整互动活动的展示顺序。'),
                        h('a', { style: 'color: #20a0ff;margin-left: 10px;', attrs: { href: "#/interactionList"} }, '立即体验')
                    ]),
                    h('p', { style: 'color: #666;line-height: 2;text-indent: 14px;font-size: 13px;' }, [
                        h('span', null, '2. 支持手动调整积分礼品的展示顺序。'),
                        h('a', { style: 'color: #20a0ff;margin-left: 10px;', attrs: { href: "#/giftList"} }, '立即体验')
                    ]),
                    h('p', { style: 'color: #666;line-height: 2;text-indent: 14px;font-size: 13px;' }, [
                        h('span', null, '3. 支持控制“会员中心”页面“会员权益”、“热门互动”等模块的展示状态和页面排序。'),
                        h('a', { style: 'color: #20a0ff;margin-left: 10px;', attrs: { href: "#/userCenter"} }, '立即体验')
                    ]),
                    h('p', { style: 'color: #666;line-height: 2;text-indent: 14px;font-size: 13px;' }, [
                        h('span', null, '4. 支持修改“会员权益”模块中的图标。'),
                        h('a', { style: 'color: #20a0ff;margin-left: 10px;', attrs: { href: "#/userIconSetting"} }, '立即体验')
                    ])
                ]),
                showCancelButton: false,
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            });
            $('body').on('click', '.el-message-box__wrapper .el-message-box__content .el-message-box__message a', function(){
                $('.el-message-box__wrapper').click();
            });
        },
        showShareAlert(){
            const h = this.$createElement;
            this.$msgbox({
                title: '温馨提示',
                message: h('div', null, [
                    h('p', null, '尊敬的商家：'),
                    h('p', null, '为确保大促期间会员中心页面能在微信端正常访问，应京麦服务市场要求，系统将于2018年10月18日起暂时关闭积分互动模块的微信分享功能，并预计在2018年11月12日重新开放。在此期间将无法新建【邀请好友关注店铺】、【拼团】和【砍价】活动。给您带来不便，敬请谅解。'),
                ])
            });
            return;
        },
        showHelpDialog(){
            const h = this.$createElement;
            this.$msgbox({
                title: '重要通知',
                message: h('div', null, [
                    h('p', { style: 'color: #666;line-height: 2;' }, '亲爱的商家，您好！'),
                    h('p', { style: 'color: #666;line-height: 1.6;font-size: 13px;' }, '接京麦开放平台通知：'),
                    h('p', { style: 'color: #666;line-height: 1.6;font-size: 13px;' }, '京东商城优惠逻辑将于2019年2月15日正式变更为平行优惠形式，限制创建促销&优惠规则如下：'),
                    h('p', { style: 'color: #666;line-height: 1.6;font-size: 13px;' }, '1. 2019年1月15日之前创建的活动，将于2019年2月15日之前全部失效。'),
                    h('p', { style: 'color: #666;line-height: 1.6;font-size: 13px;' }, '2. 2019年1月15日至2月15日之间，不可创建跨2月15日的活动。'),
                    h('p', { style: 'color: #666;line-height: 1.6;font-size: 13px;' }, '3. 1月15日至2月15日之间、以及2月15日之后创建活动，需商家在商家后台考试后才可创建。'),
                    h('p', { style: 'text-align: center;margin-top: 40px;' }, [
                        h('a', {
                            style: 'padding: 10px 15px;border-radius: 4px;color: #fff;background: #20a0ff;',
                            attrs: {
                                href: 'https://mtt.jd.com/article/articleView/4b73bcda-4f02-4915-be3d-732018b3ad0f.action',
                                target: '_blank'
                            }
                        }, '立即了解【平行式门槛计算规则】')
                    ])
                ]),
                showCancelButton: false,
                showConfirmButton: false,
                confirmButtonText: '立即了解【平行式门槛计算规则】'
            });
        },
        showLevelDialog(){
            const h = this.$createElement;
            this.$msgbox({
                title: '京东商城优惠逻辑升级通知',
                message: h('div', null, [
                    h('p', { style: 'color: #666;line-height: 2;' }, '亲爱的商家，您好！'),
                    h('p', { style: 'color: #666;line-height: 1.6;font-size: 13px;' }, '接京麦开放平台通知：'),
                    h('p', { style: 'color: #666;line-height: 1.6;font-size: 13px;' }, '京东商城优惠逻辑已于2019年2月15日凌晨1点正式变更为平行优惠形式！'),
                    h('p', { style: 'color: #666;line-height: 1.6;font-size: 13px;' }, [
                        h('span', {}, '为避免店铺资损，请认真阅读'),
                        h('a', {
                            style: 'color: #3089dc;line-height: 1.6;font-size: 13px;',
                            attrs: {
                                href: 'http://mjbbs.jd.com/thread-156565-1-1.html',
                                target: '_blank'
                            }
                        }, '《平行式门槛计算规则重要解析》'),
                        h('span', {}, '、'),
                        h('a', {
                            style: 'color: #3089dc;line-height: 1.6;font-size: 13px;',
                            attrs: {
                                href: 'https://mtt.jd.com/article/articleView/4b73bcda-4f02-4915-be3d-732018b3ad0f.action',
                                target: '_blank'
                            }
                        }, '《平行式门槛计算规则测试及其意见征集》'),
                        h('span', {}, '，并访问商家后台进行再次考试。')
                    ]),
                    h('p', { style: 'color: #666;line-height: 1.6;font-size: 13px;' }, [
                        h('a', {
                            style: 'color: #3089dc;line-height: 1.6;font-size: 13px;',
                            attrs: {
                                href: 'https://prom.shop.jd.com/promotion/info/info2_queryPromotionsNew.action',
                                target: '_blank'
                            }
                        }, '→去考试'),
                    ]),
                    h('p', { style: 'color: #666;line-height: 1.6;font-size: 13px;' }, '同时请您检查当前正在进行中的商品折扣促销活动是否正常，若出现异常请立即结束相应活动，并按照升级后的优惠逻辑重新创建相应活动'),
                    h('p', { style: 'color: red;line-height: 1.6;font-size: 13px;' }, '若会员互动和积分商城中使用了优惠券，则在2019年1月15日之前创建的优惠券将无法领取，建议商家手动关闭，重新设置')
                ]),
                showCancelButton: true,
                showConfirmButton: true,
                confirmButtonText: '查看优惠监控',
                cancelButtonText: '知道了'
            }).then(action => {
                window.open('https://jdprice.shop.jd.com/discount/query');
            });
        }
    },
    computed: {
        ...mapState({
            ziying: state => state.ziying
        }),
        path() {
            return this.$route.path;
        }
    },
    components: {
        headerTemp,
        leftTemp,
        bounceIn,
        announcement
    }
}
</script>
<style lang="less">
#app {
    font-family: Microsoft YaHei, 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    background-color: #edf2f8;
    width: 100%;
    height: 100%;
    overflow: hidden;
    min-width: 1400px;
}
#container{
    padding-left: 20px;
    box-sizing: border-box;
    height: 100%;
    padding-right: 10px;
    overflow: auto;
    .common-toolbar{
        height: 40px;
        line-height: 40px;
        // border-bottom: #d2d2d2 solid 1px;
        background: #fbfbfb;
        position: relative;
        padding-left: 20px;
        padding-right: 10px;
        width: 100%;
        margin-left: -20px;
        margin-right: -10px;
        .brand-nav{
            float: left;
            display: inline;
            margin-left: 20px;
            color: #666;
            font-size: 12px;
            .top_kf{
                // width: 250px;
                height: 36px;
                line-height: 36px;
                display: inline-block;
                position: absolute;
                top: 4px;
                right: 5px;
                text-align: right;
                padding-right: 10px;
                img{
                    vertical-align: middle;
                }
                .blue{
                    margin-right: 10px;
                    &:hover{
                        color: #20a0ff;
                    }
                }
            }
            a{
                color: #666;
                font-size: 12px;
            }
        }
    }
}
.el-tooltip__popper.is-light[x-placement^=bottom]{
    border-color: #eee;
    .popper__arrow{
        border-bottom-color: #eee;
    }
}
.qqGroupName{
    text-align: center;
    color: #666;
    margin-top: 10px;
    font-size: 14px;
}
.el-message-box__content {
  word-break: break-all;
}
.footer {
  text-align: center;
  padding:10px 0;
}
</style>
