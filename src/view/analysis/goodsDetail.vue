<template>
  <div class="goods-detail" v-loading="isLoading">
    <el-form inline>
      <el-form-item label="商品ID：">
        <el-input size="small" v-model="condition.numIid"/>
      </el-form-item>
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
        :data="data.list"
        width="100%"
        border
        style="margin-top:20px;"
      >
          <el-table-column label="商品" width="300">
           <template scope="scope">
              <div class="good-content">
                <img :src="scope.row.picUrl" class="good-img"/>
                <div class="good-info">
                  <p>
                    <a :href="'https://item.taobao.com/item.htm?id=' + scope.row.wareId" target="_blank">{{scope.row.title}}</a>
                  </p>
                  <p>
                    商品ID：{{scope.row.wareId}}
                  </p>
                </div>
              </div>
           </template>
         </el-table-column>
         <el-table-column label="价格" prop="payment"></el-table-column>
         <el-table-column label="客户数" prop="customerNum" sortable></el-table-column>
         <el-table-column label="订单金额" prop="totalFee" sortable></el-table-column>
         <el-table-column label="订单笔数" prop="tradeNum" sortable></el-table-column>
         <el-table-column label="宝贝件数" prop="goodsNum" sortable></el-table-column>
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
      data:{},
      endTime:'',
      condition:{
        status:'1',
        numIid:'',
        lastDay:'7',
        activityId:this.id
      },
      queryData:{
        pageNo:1,
        pageSize:20,
      },
      isLoading:false
    }
  },
  mounted() {
    this.calcTime();
    this.searchData();
  },
  methods: {
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
        api_name: 'marketingGoods',
        data: {
          ...this.queryData,
          ...this.condition
        }
      },result => {
        this.data = result.data;
        this.isLoading = false;
      },error => {

      })
    }
  }
}
</script>
<style lang="less" scoped>
  .goods-detail {
    .good-content {
      overflow: hidden;
      padding:5px 0;
      .good-img {
        width:60px;
        height:60px;
        float:left;
        margin-right:15px;
      }
      .good-info {
        width:220px;
        a{
          color:#20a0ff;
        }
      }
    }
    .table_footer {
      text-align: right;
    }
  }
</style>
