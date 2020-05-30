<template>
    <div>
        <div class="promotion-act-dialog">
            <el-dialog :title="'活动页面展示'" :visible.sync="dialogTableVisible">
              <ul>
                  <li class="clearfix" ref="test">
                    <el-form label-position="right" label-width="160px" :model="info">
                        <el-form-item label="活动列表默认展示形式:">
                            <el-radio v-model="info.displayType" label="1">列表形式</el-radio>
                            <el-radio v-model="info.displayType" label="2">小图形式</el-radio>
                        </el-form-item>
                        <el-form-item label="是否展示未开始互动:">
                            <el-radio v-model="info.showNotStarted" label="1">展示</el-radio>
                            <el-radio v-model="info.showNotStarted" label="2">不展示</el-radio>
                        </el-form-item>
                        <el-form-item label="活动页面banner:">
                            <div class="img_content">
                                <span class="loading" v-if="uploadFlg"  v-loading="uploadFlg" style="line-height: 0;"></span>
                                <el-upload
                                    class="img_box"
                                    action="/common/picUpload"
                                    :show-file-list="false"
                                    :on-success="uploadSuccess"
                                    :before-upload="uploadBefore">
                                    <img v-if="info.banner" :src="info.banner">
                                    <img v-else :src="promotionImg">
                                    <span v-if="!uploadFlg">上传图片</span>
                                </el-upload>
                                <p class="upload-tip">建议尺寸：750*280像素，上传图片大小不能超过 1.5MB！</p>
                            </div>
                        </el-form-item>
                    </el-form>
                  </li>
                  <li class="send-btn">
                      <el-button type="primary" size='small' @click="sureSet" class="queryBtn">确定</el-button>
                      <el-button size='small' @click="cancel" class="queryBtn">取消</el-button>
                  </li>
              </ul>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import QRCode from 'qrcode'
import promotionImg from 'src/assets/images/promotion.png' 
export default {
    data(){
        return {
            dialogTableVisible: false,
            info: {
                displayType: '1',
                showNotStarted: '1',
                banner: ''
            },
            uploadFlg: false,
            promotionImg
        }
    },
    created() {   
        
    },
    mounted() {
    },
    methods: {
        cancel() {
            this.dialogTableVisible  = false;
        },
        showDialog(data) {
            this.info = {
                displayType: data.displayType + '' || '1',
                showNotStarted: data.showNotStarted +'' || '1',
                banner: data.banner || ''
            };
            this.dialogTableVisible  = true;
        },
        uploadSuccess(file) {
            if(file.result == '100') {
                this.info.banner = file.data.picUrl;
            }else {
                this.$message.error(file.message || '图片上传失败！');
            };
            this.uploadFlg = false;
        },
        uploadBefore(file) {
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
        sureSet() {
            this.$emit('setConfig', this.info);
        }
    },
    components: {
        
    }
}
</script>

<style lang="less">
.promotion-act-dialog {
    .el-dialog {
        width: 600px;
    }
}
</style>
<style lang="less" scoped>
ul {
    li {
        width: 100%;
        margin-bottom: 10px;
        &.send-btn {
            text-align: center;
            margin-top: 30px;
            button {
               width: 100px;
            }
        }
        textarea {
			border: 1px solid #ccc;
			width: 500px;
			padding: 10px;
            min-height: 128px;
            resize: none;
            font-family: yes;
        }
        .tip {
            text-align: left;
            text-indent: 20px;
            margin-bottom: 10px;
        }
        .img_content {
            position: relative;
            .upload-tip {
            font-size: 12px;
            color: #999;
            line-height: normal;
            }
            .img_box {
                width: 375px;
                height: 140px;
                border-radius: 4px;
                overflow: hidden;
                position: relative;
                text-align: center;
                display: inline-block;
                img {
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    z-index: 2;
                    left: 0;
                    top: 0;
                }
                span {
                    font-size: 14px;
                    line-height: 140px;
                    color: #fff;
                    position: absolute;
                    top: 0;
                    left: 0;
                    bottom: 0;
                    right: 0;
                    z-index: 3;
                    background: rgba(79,79,79,0.5)
                }
            }
            .loading {
                width: 375px;
                height: 140px;
                position: absolute;
                z-index: 4;
                left: 0;
                top: 0;
            }
        }
    }
}
</style>

