<template>
  <div class="analysis-table">
    <el-table
      :data="data"
      width="100%"
      border
      style="margin-top:20px;"
      >
        <el-table-column label="时间" prop="date"></el-table-column>
        <el-table-column :label="getTableLabel() + '客户数'" prop="date">
          <template scope="scope">
            {{tableType === "payTrade" ? scope.row.payPeopleCount : scope.row[tableType + "PeopleCount"]}}
          </template>
        </el-table-column>
        <el-table-column :label="getTableLabel() + '订单数'">
          <template scope="scope">
            {{tableType === "tradeClose" ? scope.row.tradeCloseCount : scope.row[tableType + "rCount"]}}
          </template>
        </el-table-column>
        <el-table-column :label="getTableLabel() + '金额'">
          <template scope="scope">
          {{scope.row[tableType + "Amount"]}}
          </template>
        </el-table-column>
        <el-table-column label="客单价">
          <template scope="scope">
          {{
            (scope.row[tableType + "Amount"] || 0) / ((tableType === "payTrade" ? scope.row.payPeopleCount : scope.row[tableType + "PeopleCount"]) || 1) | numFormat(2)
          }}
          </template>
        </el-table-column>
        <el-table-column :label="getTableLabel() + '响应率'">
          <template scope="scope">
            {{typeof scope.row[tableType + "Ratio"] != "undefined" ? scope.row[tableType + "Ratio"]  : ""}}
          </template>
        </el-table-column>
      </el-table>
  </div>
</template>
<script>
export default {
  props:{
    data:[Array,Object],
    tableType:String
  },
  created() {
    console.log(this.data);
  },
  methods: {
     getTableLabel() {
      const {tableType} = this;
      return tableType == 'trade' ? '下单' : tableType == 'payTrade' ? '成交' :'意向';
    },
  }
}
</script>
<style lang="less" scoped>
  .analysis-table {
    margin-top:20px;
  }
</style>
