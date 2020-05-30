<template>
  <BaseDialog title="添加黑名单" @onConfirm="onConfirm" @onCancel="onCancel" custom-class="crm-dialog-width__blackname-one">
    <el-form ref="form" label-position="right" :model="form" :rules="rules" label-width="8em">
      <el-form-item label="黑名单类型：">
        <el-radio-group v-model="form.type">
          <el-radio label="user">会员账号</el-radio>
          <el-radio label="phone">手机号</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="添加黑名单：" prop="name" :error="errorMessage">
        <el-input
          resize="none"
          :style="{width:'262px'}"
          :autosize="{ minRows: 6, maxRows: 6}"
          type="textarea"
          class="textarea"
          v-model.trim="form.name"
          placeholder="每行一条记录，最多可一次性输入500条记录"
        />
      </el-form-item>
    </el-form>
  </BaseDialog>
</template>

<script>
  import BaseDialog from 'src/components/baseDialog'
  import {splitNick,splitPhone} from 'src/common/utils'
  export default {
    data() {
      return {
        errorMessage:'',
        form: {
          type:"user",
          name:"",
        },
        rules: {
          name: [
            { required: true, message:"请输入黑名单",trigger: 'blur' },
          ],
        },
      }
    },
    created(){
      console.log(this);
    },
    methods: {
      onConfirm(handleClose) {
        this.$refs.form.validate((valid) => {
          if(valid) {
            const {type,name} = this.form
            const blacklists = type === 'phone' ? splitPhone(name).filterPhones : splitNick(name)
            if(blacklists.length) {
              this.$emit('onConfirm',type === 'phone' ? 2 : 1,blacklists+"",handleClose)
            }else {
              this.errorMessage = type === 'phone' ? '请输入有效的手机号码' : '请输入有效的用户';
            }
          }
        })
      },
      onCancel() {
        // 清空 form
        this.$refs.form.resetFields()
        this.errorMessage = '';
      }
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
  .crm-dialog-width__blackname-one {
    width: 460px;
  }
</style>
