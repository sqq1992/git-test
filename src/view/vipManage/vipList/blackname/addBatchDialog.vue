<template>
  <BaseDialog
    title="批量导入"
    custom-class="crm-dialog-width__blackname-batch"
    confirm-text="提交"
    cancel-text="取消"
    @onConfirm="onConfirm"
    @onCancel="onCancel"
  >
    <el-form ref="form" label-position="right" :model="form" :rules="rules" label-width="9em">
      <el-form-item label="批量导入模板：">
        <a href="/template/importBlacklistTemplate.xls" download target="_blank"><el-button type="text">点击下载</el-button></a>
      </el-form-item>
      <el-form-item label="批量导入黑名单：" prop="fileList">
        <el-upload
          ref="upload"
          :action="action"
          accept=".xls"
          :on-remove="handleRemove"
          :on-change="handleChange"
          :file-list="form.fileList"
          :on-success="onSuccess"
          :auto-upload="false">
          <el-button slot="trigger" size="small" type="text">选择文件</el-button>
          <span slot="tip" class="el-upload__tip m_l10">仅支持xls,最大5m</span>
        </el-upload>
      </el-form-item>
    </el-form>
  </BaseDialog>
</template>

<script>
  import BaseDialog from 'src/components/baseDialog'
  const LIMIT = 5,TYPE = ['xls']
  export default {
    data() {
      return {
        form: {
          fileList:[]
        },
        rules: {
          fileList: [
            { trigger: 'blur' , validator(rule, value, callback) {
              if(value.length) {
                callback()
              }else {
                callback('请添加文件')
              }
            }},
          ],
        },

        action: '/crmcustomerblacklist/import',
        fileList:[],
        handleClose: function() {}
      }
    },
    methods: {
      onConfirm(handleClose) {
        this.handleClose = handleClose
        this.$refs.form.validate((valid) => {
          if(valid) {
            const {fileList} = this.form
            fileList[0].status = "ready" // 组件bug 强制上传
            this.$refs.upload.submit()
          }
        })
      },
      onCancel() {
        // 清空 form
        this.$refs.form.resetFields()
      },
      onSuccess(response, file, fileList) {
        if(response.result != 100){
          this.$message.error(response.message);
        }else {
          this.handleClose();
          let count = response.data.successCount;
          this.$alert(`已成功导入${count}条记录！`);
          this.$emit('refresh');
        }
      },
      // 删除添加的文件
      handleRemove() {
        this.form.fileList = []
      },
      // 浏览文件按钮
      handleChange(file,fileList) {
        if(file.status == "ready"){
          if(this.beforeAvatarUpload(file)) {
            this.form.fileList = [file]
          }else {
            this.form.fileList = []
          }
        }
      },
      // 文件验证
      beforeAvatarUpload(file) {
        let type = file.name.substr(file.name.lastIndexOf(".")+1).toLowerCase()
        const size = file.size / 1024 / 1024
        const isLt2M = size < LIMIT
        if (!TYPE.includes(type)) {
          this.$message.error(`只支持${TYPE.join('、')}格式文件！`)
          return false
        }
        if (!isLt2M) {
          this.$message.error('上传文件大小不能超过 ' + LIMIT + 'MB!')
        }
        return isLt2M
      },

    },
    components:{
      BaseDialog
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  .textarea {

  }
  .el-form-item:last-of-type{
    margin-bottom:0;
  }
</style>
<style>
  .crm-dialog-width__blackname-batch {
    width: 500px;
  }
</style>
