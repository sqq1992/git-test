<template>
    <div class="page_link">
        <span>{{name}}页面地址：{{url}}</span>
        <el-button id="htmlBtn" type="text" style="margin-left: 5px;" :data-clipboard-text='url'>复制链接</el-button>
        <el-button type="text" style="margin-left: 5px;" @click="show">预览</el-button>
        <a class="text_link" target="_blank" href="https://jshopx.jd.com/pageManage/m" v-if="name">装修店铺</a>
        <el-dialog :title="title" :visible.sync="dialogQrcodeVisible" size="tiny">
            <div class="qrocdeDialog">
                <div class="qrcodeTitle">使用京东App“扫啊扫”预览</div>
                <div>
                    <img :src="qrcode" alt="">
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import Clipboard from 'clipboard';
import QRCode from 'qrcode';
export default {
    props: {
        url: {
            type: String,
            default: ''
        },
        name: {
            type: String,
            default: '',
            required: true
        },
        title: {
            type: String,
            default: '',
            required: true
        }
    },
    data(){
        return {
            dialogQrcodeVisible: false,
            qrcode: '',
            clipboard: ''
        }
    },
    mounted(){
        this.initClip();
    },
    beforeDestroy(){
        this.clipboard.destroy();
    },
    methods: {
        initClip() {
            this.clipboard = new Clipboard('#htmlBtn');
            let vm = this;

            this.clipboard.off('success').on('success', function(e) {
                e.clearSelection();
                vm.$message("复制成功!");
            });

            this.clipboard.off('error').on('error', function(e) {
                console.error('Action:', e.action);
                console.error('Trigger:', e.trigger);
            });
        },
        show(){
            if(!this.qrcode){
                try{
                    QRCode.toDataURL(this.url, {errorCorrectionLevel: 'H'}, (err, url) => {
                        this.qrcode = url;
                    });
                } catch(e){
                    this.qrcode = '';
                }
            }
            this.$nextTick(() => {
                this.dialogQrcodeVisible = true;
            });
        },
        hide(){
            this.dialogQrcodeVisible = false;
        }
    }
}
</script>

<style lang="less" scoped>
    .page_link{
        height: 35px;
        line-height: 35px;
        border: 1px solid #e6e6e6;
        background: #fafafa;
        padding-left: 20px;
        font-size: 12px;
        position: relative;
        span{
            display: inline-block;
            max-width: 430px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            vertical-align: top;
        }
        &:after{
            position: absolute;
            content: '';
            border: 7px solid transparent;
            border-right: 7px solid #fafafa;
            top: 9px;
            left: -14px;
        }
        &:before{
            position: absolute;
            content: '';
            border: 8px solid transparent;
            border-right: 8px solid #e6e6e6;
            top: 8px;
            left: -16px;
        }
        .el-button, .el-textarea__inner{
            font-size: 12px;
        }
        .text_link{
            font-size: 12px;
            color: #20a0ff;
        }
    }
    .qrocdeDialog{
        text-align: center;
    }
</style>

