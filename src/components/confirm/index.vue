<template>
    <el-dialog
        class="confirm"
        :visible.sync="confirmDialog"
        :show-close="false"
        :close-on-press-escape="false"
        :close-on-click-modal="false">
        <h3 class="title">会员开卡升级公告</h3>
        <p class="black">为配合京东官方升级，现需要您重新在官方配置会员开卡页面的相关信息； </p>
        <p class="black">配置功能位置：营销中心-用户营销-会员管理-会员等级：勾选开卡入会模式-完成会员卡基础设置-完成开卡页设置；</p>
        <p class="black">操作指引：<a href="https://helpcenter.jd.com/vender/issue/835-5575.html">https://helpcenter.jd.com/vender/issue/835-5575.html</a></p>
        <p class="black">请您在4月8日前尽快完成官方开卡页面信息的配置，如仍未配置，系统将无法正确展示您的“会员”入口，若您已在官方配置完成开卡页面，或是品牌会员可忽略此通知。</p>
        <p class="black">官方公告地址：<a href="http://mjbbs.jd.com/thread-175725-1-1.html">http://mjbbs.jd.com/thread-175725-1-1.html</a></p>
        <p class="black mt10">给您带来的不便尽请谅解</p>
        <p class="footer">
            <el-button @click="confirmDialog = false" type="primary">知道了</el-button>
        </p>
    </el-dialog>
</template>
<script>
export default {
    data() {
        return {
            confirmDialog: false
        }
    },
    mounted () {
        this.confirmDialog = true
    }
}
</script>
<style lang="less">
    .confirm {
        .el-dialog--small{
            width: 35%
        }
        .el-dialog__body {
            padding: 10px 20px;
        }
        .black{
            line-height: 20px;
            color: #333;
            font-size: 14px;
        }
        .center{
            text-align: center;
            margin-left: 0;
        }
        a{
            color: #20a0ff;
        }
        .mt10{
            margin-top: 10px;
        }
        .footer{
        margin-top: 20px;
        }
        .title{
            text-align: center;
            margin-bottom: 10px;
        }
    }
</style>
