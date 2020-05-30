<template>
  <div class="buyer-info" v-loading="isLoading">
     <el-form inline>
      <el-form-item label="客户行为：" >
        <el-select size="small" v-model="condition.status">
          <el-option value="" :label="'下单'"></el-option>
          <el-option value="1" :label="'成交'"></el-option>
          <el-option value="2" :label="'意向'"></el-option>
          <el-option value="3" :label="'退款'"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="订单来源：">
        <el-select>
          <el-option>PC端</el-option>
          <el-option>手机端</el-option>
          <el-option>聚划算</el-option>
          <el-option>全部终端</el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="手机号：">
        <el-input size="small" v-model="condition.receiverMobile"/>
      </el-form-item>
      <el-form-item label="买家姓名：">
        <el-input size="small" v-model="condition.buyerName"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleCurrentChange(1)" size="small">查询</el-button>
      </el-form-item>
     </el-form>
     <div>
      分析时间：营销开始后的:
      <el-select size="small" style="width:100px;" v-model="condition.lastDay">
        <el-option value="3" :label="'3天内'"></el-option>
        <el-option value="5" :label="'5天内'"></el-option>
        <el-option value="7" :label="'7天内'"></el-option>
      </el-select>
      <span>
        {{sendTime}} - {{endTime}}
      </span>
    </div>
    <el-table
        :data="data.buyerInfos"
        width="100%"
        border
        style="margin-top:20px;"
      >
         <el-table-column label="买家昵称" prop="">
            <template scope="scope">
              <div class="receiverName">
                {{scope.row.buyerNick}}
              </div>
            </template>
         </el-table-column>
         <el-table-column label="买家姓名">
            <template scope="scope">
              <ul class="cell_ul">
                <li v-for="item in scope.row.list">{{item.receiverName}}</li>
              </ul>
            </template>
         </el-table-column>
         <el-table-column label="手机号">
           <template scope="scope">
              <ul class="cell_ul">
                <li v-for="item in scope.row.list">{{item.receiverMobile}}</li>
              </ul>
           </template>
         </el-table-column>
         <el-table-column label="订单金额" sortable :sort-method="sortTotalFee">
            <template scope="scope">
              <ul class="cell_ul">
                <li v-for="item in scope.row.list">{{item.totalFee}}</li>
              </ul>
            </template>
         </el-table-column>
         <el-table-column label="订单笔数" sortable :sort-method="sortTradeNum">
            <template scope="scope">
              <ul class="cell_ul">
                <li v-for="item in scope.row.list">{{item.tradeNum}}</li>
              </ul>
            </template>
         </el-table-column>
         <el-table-column label="宝贝件数" sortable :sort-method="sortGoodsNum">
            <template scope="scope">
              <ul class="cell_ul">
                <li v-for="item in scope.row.list">{{item.goodsNum}}</li>
              </ul>
            </template>
         </el-table-column>
         <el-table-column label="省">
            <template scope="scope">
              <ul class="cell_ul">
                <li v-for="item in scope.row.list">{{item.receiverState}}</li>
              </ul>
            </template>
         </el-table-column>
         <el-table-column label="城市" prop="buyerNick">
           <template scope="scope">
              <ul class="cell_ul">
                <li v-for="item in scope.row.list">{{item.receiverCity}}</li>
              </ul>
           </template>
         </el-table-column>
      </el-table>
      <div class="table_footer" v-if="data.total">
        <el-pagination
            layout="prev, pager, next"
            :current-page="data.pageNo"
            :page-size="data.pageSize"
            @current-change="handleCurrentChange"
            :total="data.total">
        </el-pagination>
      </div>
  </div>
</template>
<script>
import ajax from 'src/api/index.js'
import moment from 'moment'
export default {
  props:{
    sendTime:String,
    id:[String,Number]
  },
  watch: {
    'condition.lastDay'() {
      this.calcTime();
    }
  },
  data() {
    return {
      test:[1,2,3,4],
      data:[],
      isLoading:false,
      endTime:'',
      condition:{
        status:'1',
        receiverMobile:'',
        buyerName:'',
        activityId:this.id,
        lastDay:'7'
      },
      queryData:{
        pageNo:1,
        pageSize:20,
      },
    }
  },
  mounted() {
    this.calcTime();
    this.searchData();
  },
  methods:{
    sortTotalFee(a,b) {
      return this.sortFunc(a,b,'totalFee');
    },
    sortTradeNum(a,b) {
      return this.sortFunc(a,b,'tradeNum');
    },
    sortGoodsNum(a,b) {
      return this.sortFunc(a,b,'goodsNum');
    },
    sortFunc(a,b,type) {
      let prev = a.list.length > 1 ? a.list.reduce((p,n) => {
        return parseFloat(p[type]) + parseFloat(n[type]);
      }) : parseFloat(a.list[0][type]);
      let next = a.list.length > 1 ? b.list.reduce((p,n) => {
        return parseFloat(p[type]) + parseFloat(n[type]);
      }) : parseFloat(b.list[0][type]);
      return prev > next;
    },
    calcTime() {
      let endTime = new Date(this.sendTime).getTime() + this.condition.lastDay * 86400000;
      this.endTime = moment(endTime).format("YYYY-MM-DD HH:mm:ss");
    },
    handleCurrentChange(e) {
      this.queryData.pageNo = Number(e);
      this.searchData();
    },
    searchData() {
      this.isLoading = true;
      ajax({
        api_name: 'marketingBuyerInfo',
        data: {
          ...this.queryData,
          ...this.condition
        }
      },result => {
        this.isLoading = false;
        this.data = result.data;
      },error => {

      })
    }
  }
}
</script>
<style lang="less" scoped>
  .buyer-info {
    .table_footer {
      text-align: right;
    }
    .el-table__row {
      td {
        height:auto;
        .cell {
          padding:0;
          .receiverName {
            padding:0 18px;
          }
        }
        .cell_ul {
          width:100%;
          padding:0;
          box-sizing: border-box;
          li  {
            width: 100%;
            padding:10px 18px;
            margin:0;
            &:not(:last-child) {
              border-bottom:1px solid #ddd;
            }
          }
        }
      }
    }

  }
</style>
