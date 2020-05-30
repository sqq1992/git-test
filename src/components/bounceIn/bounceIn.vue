<template>
    <div class="dialog_wrepper">
        <div class="dialog">
            <div class="dialog_cont bounceIn">
                <img src="~assets/img/promotion/dobule12/dialog.png" alt="" width="100%" height="100%">
                <img src="~assets/img/promotion/dobule12/btn.png" alt="" width="100%" height="100%" class="dialog_btn">
                <div class="close_btn" @click="close"></div>
                <div class="check_btn" id="copyBtn" :data-clipboard-text="qq"></div>
                <div class="dialog_body">
                    <p>• 现在的会员中心页太普通，想要更个性化的页面？</p>
                    <p>• 插件里已有的功能还不够深入，想要更高级的功能？</p>
                    <p>• 准备12.12大干一场，想看相应的活动转化效果？</p>
                    <p class="hint">快联系旺店产品提交会员互动相关的活动或数据分析需求，没准12.12就用上想要的新功能了呢~</p>
                    <div class="btn_hint" v-if="copySuccess">已成功复制QQ号，请添加产品QQ~</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Clipboard from 'clipboard';
// import $ from 'jquery';
export default {
    data(){
        return {
            copySuccess: false,
            qq: '2057344781',
            clipboard: ''
        }
    },
    mounted() {
        this.initClip();
    },
    methods: {
        close(){
            this.$emit('close');
        },
        initClip() {
            this.clipboard = new Clipboard('#copyBtn');
            let vm = this;
            this.clipboard.off('success').on('success', function(e) {
                e.clearSelection();
                vm.copySuccess = true;
            });

            this.clipboard.off('error').on('error', function(e) {
                console.error('Action:', e.action);
                console.error('Trigger:', e.trigger);
            });
        }
    }
}
</script>

<style lang="less" scoped>
    @import url('~assets/css/animate.css');
    .dialog_wrepper{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        z-index: 10000;
        .dialog{
            position: absolute;
            top: 40%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
        .dialog_cont{
            width: 400px;
            height: 300px;
            border-radius: 10px;
            position: relative;
            .dialog_btn{
                position: absolute;
                top: 0;
                left: 0;
            }
            .close_btn{
                position: absolute;
                width: 20px;
                height: 20px;
                cursor: pointer;
                right: 2px;
                top: 0;
                z-index: 10;
            }
            .check_btn{
                position: absolute;
                width: 135px;
                height: 40px;
                cursor: pointer;
                right: 132px;
                bottom: 31px;
                z-index: 100;
            }
            .dialog_body{
                position: absolute;
                width: 335px;
                height: 130px;
                top: 99px;
                left: 50%;
                transform: translateX(-50%);
                color: #fff;
                z-index: 1;
                p{
                    font-size: 14px;
                    line-height: 1.6;
                }
                .hint{
                    font-size: 12px;
                    margin-top: 10px;
                }
                .btn_hint{
                    position: absolute;
                    width: 100%;
                    bottom: -60px;
                    font-size: 12px;
                    text-align: center;
                    color: #f1ea6b;
                }
            }
        }
    }
</style>
