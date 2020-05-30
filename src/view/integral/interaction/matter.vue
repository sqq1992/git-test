<template>
    <div>
        <div class="coupons_choose_dialog m-content diaWidth">
            <el-dialog
                title="设置实物奖品"
                :before-close="cancel"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                :visible.sync="dialogVisible">
                <div v-loading="loadingDia" class="fontClass inputSet">
                    <el-form :model="formInline" class="demo-form-inline">
                        <el-form-item label="奖品名称：">
                            <el-input class="w200" v-model="formInline.name" placeholder=""></el-input><span class="ml_5">{{formInline.name.length}}/10</span>
                            <p class="error-tip matter-tip" v-if="formInline.name.length > 10">奖品名称最多可输入10个字！</p>
                            <p class="error-tip matter-tip" v-if="!formInline.name && isSubmit">奖品名称不能为空！</p>
                        </el-form-item>
                        <el-form-item label="奖品面值：">
                            <span class="mr_3">￥</span><el-input @blur="rewardBlur()" class="inpWidth" v-model="formInline.price" placeholder=""></el-input>
                            <p class="error-tip matter-tip" v-if="!formInline.price && isSubmit">奖品面值不能为空！</p>
                        </el-form-item>
                        <el-form-item label="奖品图片：">
                            <div class="img_content">
                                <span class="loading" v-if="uploadFlg"  v-loading="uploadFlg" style="line-height: 0;"></span>
                                <img v-if="formInline.pic" :src="formInline.pic">
                                <div class="no-img" v-else></div>
                                <el-upload
                                    class="img_box"
                                    action="/common/picUpload"
                                    :show-file-list="false"
                                    :on-success="uploadSuccess"
                                    :before-upload="uploadBefore">
                                    <span v-if="!uploadFlg">上传图片</span>
                                </el-upload>
                                <span class="upload-tip">建议图片尺寸：80*80像素</span>
                            </div>
                            <p class="error-tip matter-tip" v-if="!formInline.pic && isSubmit">奖品图片不能为空！</p>
                        </el-form-item>
                    </el-form>
                    <div class="turntable-btn">
                        <el-button size='small' @click="cancel" class="queryBtn">取消</el-button>
                        <el-button type="primary" size='small' @click="setSure">确定</el-button>
                    </div>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import http from 'src/api/index.js';
export default {
    data(){
        return {
            rewardIndex: '',
            dialogVisible: false,
            loadingDia: false,
            uploadFlg: false,
            isSubmit: false,
            formInline: {
                name: '',
                price: '',
                pic: ''
            },
        }
    },
    methods: {
        rewardBlur(item,child,n) {
            let _val = this.formInline.price;
            if(!_val) {
                this.$set(this.formInline, 'price','1');	
            }else if(isNaN(Number(_val)) || /\./.test(_val) || /\+/.test(_val) || Number(_val <= 0)) {
                this.$message.error('只能输入正整数！');
                this.$set(this.formInline, 'price','1');	
            };
        },
        setMatters(obj, link){
            if(!link) {
               this.isSubmit = false;
               this.$set(this,'formInline',{
                    name: '',
                    price: '',
                    pic: ''
               });
            } else {
               this.$set(this,'formInline',{
                    name: obj.giftName,
                    price: obj.rewardTypeValue,
                    pic: obj.link
               });
            }
            this.rewardIndex = obj.index;
            this.dialogVisible = true;
        },
        uploadSuccess(file) {
			if(file.result == '100') {
				this.formInline.pic = file.data.picUrl;
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
        cancel() {
            this.dialogVisible = false;
            this.isSubmit = false;
        },
        setSure() {
            let obj = this.formInline;
            this.isSubmit = true;
            if(!obj.name || !obj.price || !obj.pic || obj.name.length > 10) {
                return false;
            }else {
                this.dialogVisible = false;
                this.$emit('showMatter',this.formInline,this.rewardIndex);
            }
        }
    }
}
</script>

<style lang="less" scoped>
	.m-content{
		.inpWidth{
			width: 110px;
        }
        .ml_5 {
            margin-left: 5px;
        }
        .mr_3 {
            margin-right: 3px;
        }
        .w200 {
            width: 200px;
        }
        .turntable-btn {
            margin: 20px 0 0 79px;
        }
		.img_content {
            position: relative;
            .no-img {
                width: 100px;
                height: 100px;
                background: rgba(0,0,0,0.4);
                display: inline-block;
            }
            img {
                width: 100px;
                height: 100px;
            }
            .loading {
                position: absolute;
                top: 52px;
                left:110px;
            }
            .img_box {
                position: absolute;
                bottom: 35px;
                left: 195px;
                span {
                    color: #3089DE;
                }
            }
            .upload-tip {
                position: absolute;
                bottom: 6px;
                left: 195px;
            }
        }
        .error-tip {
            margin-top: 5px;
            line-height: 12px;
            font-size: 12px;
            color: red;
            text-indent: 85px;
        }
	}
</style>

