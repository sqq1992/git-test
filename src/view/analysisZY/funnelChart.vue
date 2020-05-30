<template>
  <div class="charts-box">
      <div id="charts1" class="charts">
      </div>
      <div id="charts2" class="charts"></div>
  </div>
</template>
<script>
// import highchartsMore from 'highcharts/highcharts-more';
import Highcharts from 'highcharts';
import Funnel from 'vue-highcharts-funnel';
import deepClone from '@/common/deepClone';
Funnel(Highcharts);
export default {
  components:{
    Highcharts,
    // highchartsMore
  },
  props:{
    chartData:{
      type:Object,
      default:{}
    }
  },
  data() {
    return {
      chart1:'',
      chart2:'',
      baseOption: {
         chart: {
          type: 'funnel',
          marginRight: 100
        },
        title: {
          text: '漏斗图',
          x: -50
        },
        plotOptions: {
          series: {
            dataLabels: {
              enabled: true,
              crop : false,
              // inside:true,
              x:-20,
              overflow: 'none',
              format: '<b>{point.name}</b> ({point.y:,.0f})',
              color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
              softConnector: true
            },
            neckWidth: '0%',
            neckHeight: '0%'
            //-- Other available options
            // height: pixels or percent
            // width: pixels or percent
          }
        },
        legend: {
          enabled: false
        },
        series: [{
          name: '人数',
          data: [
            ['未下单人数',    16],
            ['下单人数',    1]
          ]
        }]
      }
    }
  },
  mounted() {
    this.initCharts();
  },
  watch:{
     chartData() {
      this.$nextTick(() => {
        this.initCharts();
      })
    }
  },
  methods:{
    initCharts() {
      let {payPinsRate,orderPinsRate,orderPins,  peopleSentNum, payPins} = this.chartData;
      let {baseOption} = this,
          opt1 = deepClone(baseOption),
          opt2 = deepClone(baseOption);
      opt1.title.text = '下单转化率'+ (orderPinsRate || '') ;
      opt1.series[0] = {
        name:'人数',
        data:[
            ['未下单客户', peopleSentNum - orderPins],
            ['下单人数', orderPins]
        ]
      }
      opt2.title.text = '成交转化率 '+ (payPinsRate || '') ;
      opt2.series[0] = {
        name:'人数',
        data:[
            ['下单未购买客户',    orderPins - payPins],
            ['成交客户',    payPins]
        ]
      }
      Highcharts.chart('charts1',opt1);
      Highcharts.chart('charts2',opt2);

      // window.onresize = this.chart1.resize;
      // window.onresize = this.chart2.resize;
    }
  }
}
</script>
<style lang="less">
  text.highcharts-credits{
	  display: none;
  }
</style>
<style lang="less" scoped>
  .charts-box {
    display: flex;
    justify-content: center;
    align-content: center;
  }
  .charts {
    height:360px;
    width:480px;
    display: inline-block;
  }

</style>
