<template>
    <div>
       <el-form-item label="仅限指定名单：">
            <el-radio class="radio" :disabled = 'giftStatus' v-model="limitMemberVal" label="0">不限制</el-radio>
            <el-radio class="radio" :disabled = 'giftStatus' v-model="limitMemberVal" label="1">仅限指定会员参与</el-radio>
            <el-button v-if="limitMemberVal == 1 && !giftStatus" class="m_l10" type="text" @click="checkNameList()">指定会员名单</el-button>
        </el-form-item>
        <el-dialog
            title="会员名单"
            :visible.sync="dialogVisible"
            size="tiny"
            @close="handleClose" v-loading="listLoading" :element-loading-text="loadingText">
            <div class="upload-box">
                <p class="upload-top"><span>说明: 请导入xls、xlsx格式的文件</span><a href="/template/importCrmLimitMembers.xlsx">下载示例文件</a></p>
                <div class="upload-success" v-if="isUpload">
                    <h2>导入成功</h2>
                    <ul>
                        <li>文件名：{{fileMsg.fileName}}</li>
                        <li>导入会员数：{{fileMsg.validCount}}</li>
                        <li>去重会员数：{{fileMsg.repeatCount}}</li>
                    </ul>
                </div>
                <div class="upload-area" v-else>
                    <span class="upload-tip">请导入会员名单，最多20000条</span>
                </div>
                <el-upload
                    action="/gift/analyzeLimitCustomerFile"
                    :on-success="handleFileSuccess"
                    :before-upload="beforeFileUpload"
                    :showFileList=false
                    :on-error="handleFileError"
                    class="upload-btn">
                    <el-button type="text">导入会员</el-button>
                </el-upload>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose()">关 闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: {
        limitMembers: {
            type: [Number, String],
            default: '0'
        },
        giftStatus: Boolean,
        actType: {
            type: String,
            default: ''
        }
    },
    watch: {
        'limitMemberVal'() {
           this.$emit('updateMsg', {
               child: this.actType == 'turntable' ? 'isLimitMembers':'limitMembers',
               val: this.limitMemberVal
           });
        }
    },
    data(){
        return {
            limitMemberVal: this.limitMembers + '',
            dialogVisible: false,
            isUpload: false,
            fileMsg: {},
            listLoading: false,
            loadingText: ''
        }
    },
    methods: {
        checkNameList() {
            this.dialogVisible = true;
        },
        handleClose() {
            this.dialogVisible = false;
        },
        handleFileSuccess(file) {
            this.listLoading = false;
            this.loadingText = '';
            this.isUpload = true;
            if(file.result != 100){
                this.$message.error(file.message);
                return;
            }
            this.fileMsg = {
                repeatCount: file.data.repeatCount,
                validCount: file.data.validCount,
                fileName: file.data.fileName
            }
        },
        beforeFileUpload(file) {
            let reg = /^.*\.(?:xls|xlsx)$/i;//文件名可以带空格
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!reg.test(file.name)) {//校验不通过
                this.$message.error('请上传excel格式的文件!');
                return false;
            };
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 2MB!');
                return false;
            };
            this.listLoading = true;
            this.loadingText = '文件上传中...';
            this.$emit('getUploadFile', file);
        },
        handleFileError() {

        }
    },
    components: {
        
    }
}
</script>


<style lang="less" scoped>
.upload-box {
    position: relative;
    .upload-btn {
        position: absolute;
        line-height: normal;
        right: 9px;
        bottom: 0px;
    }
   .upload-top {
    font-size: 12px;
    color: #666666;
    a {
        color: #3089DE;
        margin-left: 10px;
    }
   }
   .upload-area {
       margin-top: 8px;
       width: 360x;
       height: 156px;
       background: #F7F8FA;
       text-align: center;
       line-height: 156px;
       font-size: 12px;
       color: #999999;
   }
   .upload-success {
       width: 360x;
       height: 136px;
       background: #F7F8FA;
       padding-top: 20px;
       margin-top: 8px;
       h2 {
           margin-left: 18px;
           font-size: 16px;
           color: #333333;
           vertical-align: middle;
           &::before {
               content: '';
               width: 32px;
               height: 32px;
               background: url(../../../assets/images/ok-icon.png);
               display: inline-block;
               vertical-align: middle;
               margin-right: 10px;
           }
       }
       ul {
           margin-left: 60px;
           li {
                font-size: 12px;
                color: #666666;
                line-height: 18px;
           }
       }
   }
}
</style>

