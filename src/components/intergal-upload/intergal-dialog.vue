<template>
    <div>
        <div class="intergal-upload-dialog">
            <el-dialog :title="'活动页面展示'" :visible.sync="dialogVisible">
              <ul>
                  <li class="clearfix" ref="test">
                    <el-form label-position="right" label-width="160px">
                        <el-form-item label="导入会员标识:">
                            <el-radio v-model="nickType" label="nick">会员昵称</el-radio>
                            <el-radio v-model="nickType" label="pin">会员账号</el-radio>
                        </el-form-item>
                        <el-form-item label="选择文件:">
                            <span v-if="fileName">{{fileName}}</span>
                            <span @click="clearFile">
                                <el-upload
                                    ref="upload"
                                    action="/points/excelUpload"
                                    :show-file-list="false"
                                    :auto-upload="false"
                                    :on-change="handleChange"
                                    :http-request="uploadRequest"
                                    style="display: inline-block;">
                                    <el-button type="text">{{fileName ? '重新选择':'选择文件'}}</el-button>
                                </el-upload>
                            </span>
                        </el-form-item>
                        <p class="tip">每次最多上传2M文件，批量修改积分可能需要较长时间，请耐心等待</p>
                    </el-form>
                  </li>
                  <li class="send-btn">
                      <el-button type="primary" size='small' class="queryBtn" @click="submitFile">立即上传</el-button>
                      <el-button size='small' @click="cancel" class="queryBtn">取消</el-button>
                  </li>
              </ul>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import ajax from 'src/api/index.js';
export default {
    data(){
        return {
            dialogVisible: false,
            nickType: 'nick',
            fileName: '',
            isQualified: false,
            errMsg: '',
            uploadError: false
        }
    },
    created() {
    },
    watch: {
          'dialogVisible'() {
            this.fileName = '';
            this.nickType = 'nick';
            this.isQualified = false;
            this.errMsg = '';
            this.uploadError = false;
          }
    },
    methods: {
        cancel() {
            this.dialogVisible = false;
        },
        show() {
            this.dialogVisible = true;
        },
        checkFileType(file) {
            let reg = /^.*\.(?:xls|xlsx)$/i;//文件名可以带空格
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!reg.test(file.name)) {//校验不通过
                this.errMsg = '请上传excel格式的文件!';
                this.$message.error(this.errMsg);
                this.isQualified = false;
                return false;
            };
            if (!isLt2M) {
                this.errMsg = '上传图片大小不能超过 2MB!';
                this.$message.error(this.errMsg);
                this.isQualified = false;
                return false;
            };
            this.isQualified = true;
            return true;
        },
        handleFileSuccess(file){
            this.$emit('toSubmitFinish');
        },
        handleFileError(){
            this.$emit('toSubmitFinish');
            this.$message.error('当前网络发生错误，请重新上传');
        },
        submitFile() {
            if(this.isQualified && !this.uploadError) {
                this.$refs.upload.submit();
            }else {
                this.$message.error(this.errMsg || '请选择文件！');
            }
        },
        handleChange(file, fileList) {
           this.isQualified = false;
           this.uploadError = false;
           this.fileName = file.name;
           this.checkFileType(file);
        },
        uploadRequest(parma) {
            this.dialogVisible = false;
            let formData = new FormData(),
                vm = this;
            formData.append('file', parma.file);
            formData.append('nickType', vm.nickType);
            vm.$emit('toSubmit');
            ajax({
                api_name: 'excelUpload',
                vm: this,
                data: formData,
            }, result => {
                vm.handleFileSuccess(result)
            }, (error) => {
                vm.$emit('toSubmitFinish');
                vm.$message.error(error.message);
            });
        },
        clearFile() {
            this.$refs.upload.clearFiles();
        }
    },
    components: {
    }
}
</script>

<style lang="less">
.intergal-upload-dialog {
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
            text-align: right;
            margin-top: 30px;
            button {
               width: 100px;
            }
        }
        .tip {
            text-indent: 90px;
        }
    }
}
</style>
