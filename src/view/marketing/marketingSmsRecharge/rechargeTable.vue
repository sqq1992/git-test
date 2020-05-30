<template>
    <div class="rechargeTableContent">
        <el-table
        class="rechargeTable"
        :data="tableData"
        stripe
        :border="false"
        v-loading="loading"
        style="width: 100%">
        <el-table-column label="充值短信包" min-width="140" align="left">
            <template scope="scope">
            <el-row>
                <el-col>
                {{scope.row.msgCount}}
                </el-col>
            </el-row>
            </template>
      </el-table-column>
      <el-table-column label="市场价" min-width="140" align="left">
        <template scope="scope">
          <el-row>
            <el-col style="text-decoration:line-through">
              ￥{{scope.row.marketingPrice | numFormat(2)}}
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="优惠价" min-width="100" align="left">
        <template scope="scope">
          <el-row>
            <el-col>
              ￥{{scope.row.discountPrice | numFormat(2)}}
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="短信单价" align="left" min-width="120">
        <template scope="scope">
          <el-row>
            <el-col class="">
              {{scope.row.unitPrice | numFormat(2)}}分
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left" min-width="120">
        <template scope="scope">
          <el-row>
            <el-col>
                <el-button type="primary" size="small" @click="buyConfirm(scope.row)">立即充值</el-button>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import {point} from 'src/common/point.js';
import http from './../../../api/index.js';
import { mapState } from "vuex";
import { getCookie } from '@/common/utils';
export default {
    name:'rechargeTable',
    components:{
    },
    props:{
      agreeDate:String,
      showAgreement:Function,
      tableData:Array,
      loading:Boolean
    },
    computed: {
      ...mapState({
            user: state => state.user
      }),
    },
    methods:{

      buyConfirm(row) {
        const {smsLink,msgCount} = row;
        switch(msgCount) {
          case 500:
            point('37977.37978.37981')
          break;
          case 2000:
            point('37977.37978.37982')
          break;
          case 10000:
            point('37977.37978.37983')
          break;
          case 20000:
            point('37977.37978.37984')
          break;
          case 50000:
            point('37977.37978.37985')
          break;
          case 100000:
            point('37977.37978.37986')
          break;
        }
        if(!this.agreeDate) {
          this.$emit("showAgreement");
          return;
        }
        window.open(smsLink);
        this.$confirm(`若已充值成功，请点击“充值成功”按钮`,
          {
            title:'短信充值确认结果',
            confirmButtonText:'充值成功'
          }
        ).then(() => {
          window.location.reload();
        }).catch(() => {})
      }
    }
}
</script>
<style lang="less" >
  .el-table.rechargeTable{
    th{
      background: #3089dc;
      .cell{
        background-color:#3089dc ;
        color:#fff;
      }
    }
  }
</style>


