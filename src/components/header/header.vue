<template>
    <div id="header">
        <div class="header-placeholder"></div>
        <div class="header">
            <div class="clearfix header-inner">
                <h1 class="site-logo">
                    <a href="#/index/"></a>
                </h1>
                <div class="header-user-info">
                    <span class="user-name">
                        <em>{{user.shopName || '请登录'}}:{{user.pin || ''}}</em>
                        <!-- <b v-if="user.pin"></b> -->
                        <!-- <span class="up-sj" v-if="user.shopId"></span>
                        <ul class="user-opr-list" v-if="user.shopId">
                            <li><a class="J_Logout" data-name="logout"><i class="icon-quit"></i>退出</a></li>
                        </ul> -->
                    </span>
                    <span class="header_dqsj">到期：{{user.endTime}}</span>
                    <a href="http://fw.jd.com/657606.html" ref="headerBtn" class="headerBtn" target="_blank">续费</a>
                    <span class="restMsgCount mr_10">
                        短信余额：{{user.restMsgCount}}条
                    </span>
                    <a href="#/marketingSmsRecharge" class="headerBtn" style="margin-right:10px;" target="_blank">充值</a>
                    <!-- <span class="desk-quick"></span>
                    <span class="header_dxye">0</span>
                    <button data-name="recharge" class="headerBtn">充值</button> -->
                </div>
            </div>
        </div>
        <div class="act_zz" data-name="header_renew_close"></div>
        <div class="toTops">
            <p class="p0"></p>
            <p class="p1"></p>
            <p class="p2"></p>
        </div>
    </div>
</template>

<script>
import store from 'src/store';
import dateFormat from 'src/common/dateFormat.js';
export default {
    data(){
        return {
            user: {}
        }
    },
    watch: {
        '$route' (to, from) {
            this.user = store.state.user;
            this.countdown();
        }
    },
    created(){
        this.user = store.state.user;
    },
    mounted(){
        this.countdown();
    },
    methods: {
        countdown(){
            let day = this.diff(this.user.endTime, dateFormat(new Date(), 'YY-MM-DD HH:MM:SS'));
            if(day <= 5){
                let showConfirm = window.localStorage.getItem('showConfirm');
                if(!showConfirm || (showConfirm != dateFormat(new Date(), 'YY-MM-DD'))){
                    this.showConfirm(day);
                }
            } else if(day <= 15){
                // let showMarketing = window.localStorage.getItem('showMarketing');
                // if(!showMarketing || (showMarketing != dateFormat(new Date(), 'YY-MM-DD'))){
                //     this.showMarketing();
                // }
            }
        },
        showConfirm(day){
            this.$confirm(day > 0? `当前插件还有${day}天到期，请及时续订` : '当前插件已到期，请及时续订', '温馨提示', {
                confirmButtonText: '续费',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                this.$refs.headerBtn.click();
            }).catch(() => {
            });
            window.localStorage.setItem('showConfirm', dateFormat(new Date(), 'YY-MM-DD'));
        },
        showMarketing(){
            const h = this.$createElement;
            this.$msgbox({
                title: '温馨提示',
                message: h('p', { style: 'color: #999;line-height: 1.6;' }, [
                    h('span', null, '推广期让利 现在续订软件享八折优惠  7月13号之后立马恢复原价！抢购链接：'),
                    h('a', { style: 'color: #20a0ff;', attrs: { href: "http://fw.jd.com/657606.html", target: "_blank" } }, 'http://fw.jd.com/657606.html'),
                ]),
                showCancelButton: false,
                confirmButtonText: '好的',
                cancelButtonText: '取消'
            });
            window.localStorage.setItem('showMarketing', dateFormat(new Date(), 'YY-MM-DD'));
        },
        diff: function(d1, d2){
            var day = 24 * 60 * 60 * 1000;
            try {
                d1 = new Date(d1);
                var checkTime = d1.getTime();
                d2 = new Date(d2);
                var checkTime2 = d2.getTime();
                var cha = (checkTime - checkTime2) / day;
                return Math.round(cha);
            } catch (e) {
                console.log(e);
                return 0;
            }
        }
    }
}
</script>

<style lang="less" scoped>
    @import '../../assets/css/modules/module.user.header.less';
</style>

