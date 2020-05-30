<template>
  <span class="crm-dialog-btn-wrapper">
    <span @click="dialogVisible = true"><slot name="button"><el-button type='primary' size='small'>{{buttonName || title}}</el-button></slot></span>
    <el-dialog
      :modal="modal"
      :title="title"
      :customClass="customClass"
      :visible.sync="dialogVisible"
      :size="size || 'small' "
      @close="handleClose">
      <slot></slot>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{onlyCansel ?  confirmText: cancelText}}</el-button>
        <el-button type="primary" @click="handleConfirm" v-if="!onlyCansel">{{ confirmText }}</el-button>
      </span>
    </el-dialog>
  </span>
</template>

<script>
  export default {
    props: {
      size:String,
      title:String,
      buttonName:String,
      modal:{
        type:Boolean,
        default:true
      },
      cache:{
        type:Boolean,
        default:true
      },
      customClass: String,
      confirmText:{
        type:String,
        default:'确 定'
      },
      cancelText:{
        type:String,
        default:'取 消'
      },
      onConfirm:Function,
      onlyCansel:[String,Boolean]
    },
    data() {
      return {
        dialogVisible: false,
      }
    },
    created() {
      console.log(this.dialogVisible);
    },
    methods: {
      handleClose() {
        this.$emit('onCancel')
      },
      handleConfirm() {
        // 弹框确定按钮事件
        this.$emit('onConfirm',() => {
          this.dialogVisible = false
        })
      },
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  .crm-dialog-btn-wrapper{
    & + .crm-dialog-btn-wrapper {
      margin-left:16px;
    }
  }

  .el-button--mini{font-size: 12px ;border-radius: 2px;padding:7px 12px;}
</style>
