<template>
  <div class="crm-table__log">
    <Table>
      <BaseDialog
        title="历史发送日志查询"
        @onConfirm="close"
      >
        <el-button slot="button" type="text">查询30天前发送日志</el-button>
        <Table type="history" />
      </BaseDialog>
    </Table>


  </div>
</template>

<script>
  import Table from './table.vue'
  import BaseDialog from 'src/components/baseDialog'
  export default {
    name: '',
    components: {BaseDialog,Table},
    data() {
      return {
        tableData: [],
      }
    },
    methods: {
      close(cb) {
        cb && cb()
      }
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">

</style>
