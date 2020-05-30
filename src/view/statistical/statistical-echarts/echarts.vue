<template>
    <div class="echarts_box">
        <el-form label-position="left" class="mt_20 ml_20" v-if="condition.label">
            <el-form-item :label="condition.label">
                <el-checkbox  v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                <el-checkbox-group v-model="checkedMembers" @change="handlecheckedMembersChange" style="display:inline-block;margin-left:10px;">
                    <el-checkbox  v-for="member in condition.members" :label="member" :key="member">{{member}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
        </el-form>
        <div id="charts"></div>
    </div>
</template>

<script>
import echarts from 'echarts';
export default {
    props: {
        msg: {
            type: Object,
            default() {
              return {
                  yAxisName: '',
                  list: []
              }
            }
        },
        condition: {
            type: Object,
            default() {
              return {}
            }
        }
    },
    data(){
        return {
            checkedMembers: this.condition.members,
            checkAll: true
        }
    },
    watch: {
        'checkedMembers'() {
            let _val = [];
            this.checkedMembers.forEach(item => {
                _val.push(this.condition.memberMap[item])
            });
            this.$emit('refList', _val.join(','));
        },
        'msg.list'(){
            this.initCharts(this.msg.list);
        }
    },
    mounted() {
        this.initCharts(this.msg.list);
    },
    methods: {
        handleCheckAllChange(val) {
            if(this.checkAll) {
                this.checkedMembers = this.condition.members;
                this.checkAll = true;
            }else {
                this.checkedMembers = [];
                this.checkAll = false;
            }
        },
        handlecheckedMembersChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.condition.members.length;
        },
        initCharts(data) {
            const myChart = echarts.init(document.getElementById('charts'));
            let _x = [],
                _seriesMap = {},
                _legend = [];
            data.forEach((item) => {
                for(let obj in item) {
                    if(obj == 'date') {
                        _x.push(item.date);
                    }else {
                        if(_seriesMap[obj]) {
                            _seriesMap[obj].data.push(item[obj])
                        }else {
                            _legend.push(this.msg.echartsName[obj]);
                            var itemData = {
                              name: this.msg.echartsName[obj] || '',
                              type: 'line',
                              data: [item[obj]]
                            }
                            //5积分的情况下 会出现 小数积分
                            if(obj == 'points') {
                              itemData.yAxisIndex = 1;
                            }
                            _seriesMap[obj] = itemData
                        }
                    }
                };
            });
            let _series = [];
            for(let item in _seriesMap) {
               _series.push(_seriesMap[item]);
            }
            let option = {
                tooltip : {
                    trigger: 'axis'
                },
                grid:{
                    x:50,
                    y:45,
                    x2: this.msg.x2 || ''
                },
                legend: {
                    type: 'scroll',
                    orient: 'vertical',
                    right: 10,
                    top: 20,
                    bottom: 20,
                    data: _legend
                },
                calculable : true,
                xAxis : [
                    {
                        type : 'category',
                        data : _x
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        name: this.msg.yAxisName
                    },
                    {
                      type:'value',
                      name:'积分',
                      splitLine:{
                          show:false
                      },
                      axisLabel: {
                          formatter: '{value}积分'
                      }
                    }
                ],
                series: _series
            };
            myChart.setOption(option);
            window.onresize = myChart.resize;
        },
    }
}
</script>

<style lang="less" scoped>
    .echarts_box {
        .ml_20 {
            margin-left: 20px;
        }
        .mt_20 {
            margin-top: 20px;
        }
        #charts {
            height: 350px;
        }
    }
</style>
