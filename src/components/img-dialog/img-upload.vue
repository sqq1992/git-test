<template>
    <el-upload
        class="module_imgs_box"
        :action="action"
        :show-file-list="false"
            v-loading="uploadFlg"
        :on-success="handleAvatarSuccess"
         :on-error="handleAvatarError"
        :before-upload="beforeAvatarUpload">
        <img v-if="data" :src="data">
        <div v-else class="noImg"><span>上传图片</span></div>
    </el-upload>
</template>

<script>
export default {
    props: {
        data: {
            type: String,
            default: ''
        }
    },
    data(){
        return {
            action: '/common/picUpload',
            uploadFlg: false
            // action: 'http://testpcjdcrm.wangdiankeji.com/common/picUpload',
        }
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
                this.uploadFlg = true;
            }
            return isIMAGE && isLt2M;
        },
        handleAvatarSuccess(file){
            if(file.result != 100){
                this.$message.error(file.message);
                this.uploadFlg = false;
                return;
            }
            this.$set(this, 'data', file.data.picUrl);
            this.uploadFlg = false;
            this.$emit('success', this.data);
        },
        handleAvatarError() {
          this.$message.error('图片上传失败，请重新上传');
        },
    }
}
</script>

<style lang="less">
    .el-upload{
        width: 100%;
        height: 100%;
    }
</style>


<style lang="less" scoped>
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
            width: 100%;
            height: 100%;
        }
        .noImg {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            text-align: center;
            color: #999;
            display: flex;
            justify-content: center;
            align-items: center;
            span {
                font-size: 14px;
            }
        }
    }
</style>
