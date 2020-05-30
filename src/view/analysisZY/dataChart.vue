<template>
  <div class="analysis-chart">
     <div class="chart-box">
      <div class="control-box">
        <el-button-group>
          <el-button :type="showType == 0 ? 'primary' : 'normal'" @click="() => {this.showType = 0}">图表</el-button>
          <el-button :type="showType == 1 ? 'primary' : 'normal'" @click="() => {this.showType = 1}">列表详情</el-button>
        </el-button-group>
        <div class="control-right">
          <div v-if="showType == 0">
            <el-popover
            ref="popover1"
            placement="bottom-start"
            width="400"
            trigger="click"
            >
              <div class="chart-control" style="padding:20px;">
                <span style="padding-right:10px;font-size:14px;">客户：</span>
                <el-radio v-model="khType" label="trade">下单客户</el-radio>
                <el-radio v-model="khType" label="payTrade">成交客户</el-radio>
                <el-radio v-model="khType" label="tradeClose">意向客户</el-radio>
                <p style="padding:10px 0;">分析指标：最多同时选择2个分析指标！</p>
                <el-checkbox-group v-model="indicators">
                  <el-checkbox :disabled="indicators.length >= 2 && indicators.indexOf('客户数量') == -1" label="客户数量" />
                  <el-checkbox :disabled="indicators.length >= 2 && indicators.indexOf('订单金额') == -1" label="订单金额" />
                  <el-checkbox :disabled="indicators.length >= 2 && indicators.indexOf('订单数量') == -1" label="订单数量" />
                  <el-checkbox :disabled="indicators.length >= 2 && indicators.indexOf('响应率') == -1" label="响应率" />
                </el-checkbox-group>
                <div style="margin-top:20px;text-align:right;">
                  <el-button type="primary" @click="changeCharts" :disabled="indicators.length == 0">确定</el-button>
                  <el-button type="normal" @click="() => {this.$refs.popover1.doClose()}">取消</el-button>
                </div>
              </div>
            </el-popover>
            <el-button type="success"  v-popover:popover1>分析指标设置 <i class="el-icon-arrow-down"></i></el-button>
          </div>
          <el-select size="large" v-model="tableType" v-if="showType == 1">
            <el-option value="trade" label="下单客户"></el-option>
            <el-option value="payTrade" label="成交客户"></el-option>
            <el-option value="tradeClose" label="意向客户"></el-option>
          </el-select>
        </div>
      </div>
      <div v-if="chartData && chartData.length > 0">
        <div id="charts"></div>
        <Table v-if="showType == 1" :data="chartData" :tableType="tableType"/>
      </div>
      <div v-else class="noData">
         暂无数据，请在营销后的第二天查看~
      </div>
     </div>
  </div>
</template>
<script>
import echarts from 'echarts'
import Table from './table'
import deepClone from '@/common/deepClone'
export default {
  props:{
    chartData:{
      type:Array,
      deafult:[]
    }
  },
  watch:{
    'chartData' (val) {
      console.log(val.length)
    }
  },
  components:{
    echarts,
    Table
  },
  // created() {
  //   console.log(this.chartData);
  // },
  data() {
    return {
      myChart:'',
      showType:0,//展示图标或表格
      tableType:'payTrade',//表格客户类型
      khType:'payTrade',//图表客户类型
      indicators:['客户数量','响应率'],
      chartOption:{
        type: "payTrade",
        list: [
          {
            name: "客户数量",
            value: "PeopleCount"
          },
          {
            name: "响应率",
            value: "Ratio"
          }
        ]
      }
    }
  },
  watch:{
    chartData() {
      this.$nextTick(() => {
        this.initCharts();
      })
    },
    showType(val) {
      if(val == 0) {
        if(document.getElementById('charts')) {
          document.getElementById('charts').style.display = "block";
        }
      } else {
        if(document.getElementById('charts')) {
          document.getElementById('charts').style.display = "none";
        }
      }
    }
  },
  mounted() {
  },
  methods:{
    changeCharts() {
      let data = {
        type:this.khType,
        list:[]
      };
      let indicatorsMap = {
        '客户数量':'PeopleCount',
        '订单金额':'Amount',
        '订单数量':'Count',
        '响应率':'Ratio',
      }
      this.indicators.forEach(key => {
        data.list.push({
          name:key,
          value:indicatorsMap[key]
        })
      })
      this.$refs.popover1.doClose();
      this.chartOption = data;
      this.initCharts();
    },
    initCharts() {
      if(!this.chartData.length > 0) return false;
      const list = deepClone(this.chartData);
      const data = this.chartOption;
      if (this.myChart) {
        this.myChart.dispose();
        this.myChart = '';
      }
      let myChart = echarts.init(document.getElementById('charts'));
      var colors = ['#5793f3', '#d14a61', '#675bba'];
      var listNameOne = data.type + data.list[0].value;
      var listNameTwo = data.list[1] ? (data.type + data.list[1].value) : "";  //payTradeRatio tradeRatio tradeCloseRatio
      // if (listNameOne == "payTradePeopleCount") {
      //   listNameOne = "payPeopleCount";
      // }
      // if (listNameTwo == "payTradePeopleCount") {
      //   listNameTwo = "payPeopleCount";
      // }
      if (listNameOne == "payTradeCount") {
        listNameOne = "payTraderCount";
      }
      if (listNameTwo == "payTradeCount") {
        listNameTwo = "payTraderCount";
      }
      if (listNameOne == "tradeCount") {
        listNameOne = "traderCount";
      }
      if (listNameTwo == "tradeCount") {
        listNameTwo = "traderCount";
      }
      list.forEach(item => {//返回带%的字符串 echarts无法解析 需要手动转为数值
        (item[listNameOne] + '').indexOf('%') > -1 && (item[listNameOne] = Number(item[listNameOne].slice(0,-1)));
        (item[listNameTwo] + '').indexOf('%') > -1 && (item[listNameTwo] = Number(item[listNameTwo].slice(0,-1)));
      })
      var option = {
        color: colors,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        xAxis: [//横轴
          {
            type: 'category',
            axisTick: {
              alignWithLabel: true
            },
            // data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
            data: list.map(it => it.date)
          }
        ],
        yAxis: data.list.length > 1 ? [//数轴
          {
            type: 'value',
            name: data.list[0].name,
            // min: 0,
            // max: 250,
            position: 'left',
            axisLine: {
              lineStyle: {
                color: colors[0]
              }
            },
            axisLabel: {
              formatter: listNameOne.indexOf('Ratio') > -1 ? '{value}%' : '{value}'
            }
          },
          {
            type: 'value',
            name: data.list[1].name,
            splitLine:{//不显示区域分割线
              show:false
            },
            // min: 0,
            // max: 25,
            position: 'right',
            axisLine: {
              lineStyle: {
                color: colors[1]
              }
            },
            axisLabel: {
              formatter: listNameTwo.indexOf('Ratio') > -1 ? '{value}%' : '{value}'
            }
          }
        ] : {
          type: 'value',
          name: data.list[0].name,
          // min: 0,
          // max: 250,
          position: 'left',
          axisLine: {
            lineStyle: {
              color: colors[0]
            }
          },
          axisLabel: {
            formatter: listNameOne.indexOf('Ratio') > -1 ? '{value}%' : '{value}'
          }
        },
        series: data.list.length > 1 ? [
          {
            name: data.list[0].name,
            type: 'line', // 'bar',
            data: list.map(it => it[listNameOne])
          },
          {
            name: data.list[1].name,
            type:'line',
            yAxisIndex: 1,
            data: list.map(it => it[listNameTwo])
          }
        ] : {
          name: data.list[0].name,
          type:'line',
          data: list.map(it => it[listNameOne])
        }
      };
      myChart.setOption(option);
      this.myChart = myChart;
      window.onresize = this.myChart.resize;
    }
  }
}
</script>
<style lang="less" scoped>
  .analysis-chart {
    margin-top:20px;
    .control-box {
      .control-right {
        float:right;
      }
    }
    #charts {
      height:360px;
    }
    .noData {
      height:200px;
      display:flex;
      justify-content: center;
      align-items: center;
      font-size:14px;
    }

  }
</style>
