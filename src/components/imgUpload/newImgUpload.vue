<template>
    <div>
        <div class="module_ctrol imgs_ctrol">
            <div class="module_ctrol_title">上传图片</div>
            <div class="module_ctrol_cont">
                <span class="module_imgs_box" v-loading="data.uploadFlg" style="line-height: 0;">
                <el-upload
                    class="module_imgs_box"
                    action="/common/picUpload"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :on-error="handleAvatarError"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="data.imgsrc" :src="data.imgsrc">
                    <div v-else class="noImg"><span>+</span>上传图片</div>
                </el-upload>
                </span>
                <div class="module_imgs_hint">建议最大尺寸：750 * 1206像素</div>
                <div class="module_imgs_hint">图片不能超过1.5M</div>
                <div class="module_imgs_link_box">
                    <div class="module_imgs_link_hint">设置跳转链接：（不设置则点击图片后不跳转）</div>
                    <div class="module_imgs_link_choose">
                        <span>{{data.redirectType}}</span>
                        <el-button type="text" @click="showImgLinkDialog">{{data.redirectType ? '重新' : ''}}设置</el-button>
                    </div>
                    <div class="module_imgs_link_focus" v-if="showBottom"><el-checkbox v-model="data.canFollow" :disabled="data.redirectType == '自定义链接' || !data.redirectType ">支持用户快速关注</el-checkbox></div>
                </div>
            </div>
        </div>
        <set-link :data="data" v-if="dialogTableVisible" @checkImgLink="checkImgLink"></set-link>
    </div>
</template>

<script>
import setLink from './setLink.vue';
export default {
    props: {
        data: {
            type: Object,
            default: {}
        },
        showBottom: {
            type: Boolean,
            default: true
        }
    },
    data(){
        return {
            dialogTableVisible: false
        }
    },
    created(){
    },
    methods: {
        beforeAvatarUpload(file) {
            const isIMAGE = /image\/\w+/.test(file.type);
            const isLt2M = file.size / 1024 / 1024 < 1.5;

            if (!isIMAGE) {
                this.$message.error('上传图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 1.5MB!');
            }
            if(isIMAGE && isLt2M){
                this.data.uploadFlg = true;
            }
            return isIMAGE && isLt2M;
        },
        handleAvatarSuccess(file){
            if(file.result != 100){
                this.$message.error(file.message);
                this.data.uploadFlg = false;
                return;
            }
            this.$set(this.data, 'imgsrc', file.data.picUrl);
            // this.data.imgsrc = file.data.picUrl;
            this.data.uploadFlg = false;
            this.saveDAta();
        },
        handleAvatarError() {
          this.$message.error('图片上传失败，请重新上传');
        },
        showImgLinkDialog(){
            this.dialogTableVisible = true;
        },
        checkImgLink(){
            this.dialogTableVisible = false;
            this.$emit('checkImgLink', this.data);
        }
    },
    components: {
        setLink
    }
}
</script>

<style lang="less" scoped>
    .module_ctrol{
        width: 555px;
        border: 1px solid #e6e6e6;
        background: #fafafa;
        border-radius: 2px;
        padding: 0 20px 12px;
        box-sizing: border-box;
        margin-top: 20px;
        .module_ctrol_title{
            height: 33px;
            line-height: 33px;
            border-bottom: 1px solid #E6E6E6;
            counter-reset: #666;
            font-size: 12px;
        }
        .module_ctrol_input{
            p{
                height: 40px;
                line-height: 40px;
                color: #666;
                font-size: 12px;
            }
            input{
                width: 380px;
            }
        }
        .module_ctrol_cont{
            padding-top: 15px;
        }
        .module_imgs_box {
            width: 125px;
            height: 60px;
            border-radius: 5px;
            overflow: hidden;
            background: #ccc;
            display: inline-block;
            color: #333;
            text-align: center;
            line-height: 80px;
            vertical-align: bottom;
            cursor: pointer;
            position: relative;
            img {
                width: 125px;
                height: 60px;
            }
            .noImg {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                text-align: center;
                line-height: 60px;
                color: #fff;
                padding-left: 20px;
                span {
                    display: inline-block;
                    transform: scaleY(0.9);
                    font-size: 20px;
                    margin-right: 5px;
                    position: absolute;
                    left: 30px;
                }
            }
        }
        .module_imgs_hint{
            display: inline-block;
            vertical-align: bottom;
            margin-left: 5px;
            color: #999;;
            margin-top: 15px;
            font-size: 12px;
        }
        .module_imgs_link_box{
            margin-top: 12px;
            .module_imgs_link_hint{
                color: #666;
                font-size: 12px;
            }
            .module_imgs_link_choose{
                margin-top: 10px;
                a{
                    margin-left: 5px;
                    color: #3089DE;
                }
            }
            .module_imgs_link_focus{
                margin-top: 13px;
            }
        }
    }
</style>

