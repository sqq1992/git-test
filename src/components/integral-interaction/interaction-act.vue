<template>
    <div>
        <div class="statistics-data">
            <div class="statistics-data-box statistics-rs">
                <label class="fc-gray">参与人数统计</label>
                <ul>
                    <li>
                        <p>{{data.personTime | numFormat}}</p>
                        <span>参与次数</span>
                    </li>
                    <li>
                        <p>{{data.personNum | numFormat}}</p>
                        <span>参与人数</span>
                    </li>
                    <li>
                        <p>{{data.personNumAvg | numFormat}}</p>
                        <span>人均参与次数</span>
                    </li>
                </ul>
            </div>
            <div class="statistics-data-box statistics-hy">
                <label class="fc-gray">参与会员统计</label>
                <ul>
                    <li v-for="(item,key) in memberArr">
                        <p>{{data.partInMemberData[key + 1] | numFormat}}</p><span>{{item}}</span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="statistics-charts">
            <label class="fc-gray">每日参与次数统计</label>
            <div class="statistics-tab">
                <a href="javascript:;" @click="tabChange(7,data.day7Data)" v-bind:class="{ current: isActive == '7' }">近7日</a>
                <a href="javascript:;" @click="tabChange(15,data.day15Data)" v-bind:class="{ current: isActive == '15' }">近15日</a>
                <a href="javascript:;" @click="tabChange(30,data.day30Data)" v-bind:class="{ current: isActive == '30' }">近30日</a>
            </div>
            <div id="charts" class="charts"></div>
        </div>
    </div>
</template>

<script>
import echarts from 'echarts';
import ajax from 'src/api/index.js';
import dateFormat from 'src/common/dateFormat.js';
export default {
    props: {
        data: {
            type: Object,
            default: {},
        },
        type: String
    },
    data() {
        return {
            isActive: '7',
            memberArr: [],
            defaultData: []
        }
    },
    mounted() {
        let _data = this.data.day7Data.length ? this.data.day7Data : this.getDefault(7);
        this.initCharts(_data);
        this.getMemberSet();
    },
    methods: {
        tabChange(day,data) {
           let _data = data.length ? data : this.getDefault(day);
           this.isActive = day;
           this.initCharts(_data);
        },
        //获取设置的会员名称
        getMemberSet() {
          let vm = this;
          ajax({
                api_name: 'memberLevelList',
            }, (res) => {
                if(res.data.levelList && res.data.levelList.length) {
                    res.data.levelList.forEach(item => {
                       vm.memberArr.push(item.name || item.nameSource);
                    })
                }else {
                    vm.memberArr = ['注册会员','一星会员','二星会员','三星会员','四星会员','五星会员'];
                }
            }, (error) => {
                this.$message.error(error.errorMessage);
            });
        },
        initCharts(data) {
                const myChart = echarts.init(document.getElementById('charts'));
                let _x = [],
                    _y = [];
                data.forEach((item) => {
                    for(let obj in item) {
                        _x.push(obj);
                        _y.push(item[obj]);
                    }
                });
                let _max = Math.max.apply(null,_y),
                    _min = Math.min.apply(null,_y);
				let option = {
                    tooltip : {
                        trigger: 'axis'
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
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            name:'人次',
                            type:'line',
                            data: _y,
                            markPoint : {
                                data : [
                                    {name : '', value : _max, xAxis: _y.indexOf(_max), yAxis: _max},
                                    {name : '', value : _min, xAxis: _y.indexOf(_min), yAxis: _min}
                                ]
                            },
                            markLine : {
                                data : [
                                    {
                                        type: 'average', name: '平均值',
                                        lineStyle: {
                                            normal: {
                                                color: 'green'
                                            }
                                        },
                                        symbol: 'circle',
                                        label: {
                                            normal: {
                                                formatter: '平均值'
                                            }
                                        },
                                    },
                                     [{
                                        symbol: 'none',
                                        x: '95%',
                                        yAxis: 'max',
                                    }, {
                                        symbol: 'circle',
                                        label: {
                                            normal: {
                                                position: 'start',
                                                formatter: '最大值'
                                            }
                                        },
                                        type: 'max',
                                        name: '最大值',
                                        lineStyle: {
                                            normal: {
                                                color: 'red'
                                            }
                                        }
                                    }],
                                    [{
		                        symbol: 'none',
                                        x: '95%',
                                        yAxis: 'min',
                                    }, {
                                        symbol: 'circle',
                                        label: {
                                            normal: {
                                                position: 'start',
                                                formatter: '最小值'
                                            }
                                        },
                                        type: 'min',
                                        name: '最小值'
                                    }]
                                ]
                            }
                        }
                    ]
                };
                myChart.setOption(option);
                window.onresize = myChart.resize;
            },
            getDefault(day) {
                let arr = [],
                    today = new Date();
                for(let i = day-1;i>=0;i--) {
                      let _day = dateFormat(today.setDate(today.getDate() - 1),'YY-MM-DD');
                      arr[i] = {};
                      arr[i][_day] = 0;
                }
                return arr;
            }
    }
}
</script>


<style lang="less">
.statistics-data {
    position: relative;
    margin-top: 10px;
    .statistics-data-box {
        border: 1px solid #ddd;
        padding: 8px 10px 20px;
        box-sizing: border-box;
        min-height: 116px;
        label {
            display: inline-block;
            position: relative;
            text-indent: 5px;
            &::before {
                background: #3089dc;
                width: 2px;
                height: 15px;
                content: "";
                display: block;
                position: absolute;
                top: 2px;
                left: 0;
            }
        }
        ul {
            margin-top: 16px;
            li {
                width: 33.33%;
                text-align: center;
                position: relative;
                float: left;
                &::before {
                    content: '';
                    width: 1px;
                    height: 32px;
                    background: #ddd;
                    display: block;
                    position: absolute;
                    top: 10px;
                    left: 0;
                }
                &:first-child {
                    &::before {
                        display: none;
                    }
                }
                p {
                    font-size: 20px;
                    word-break: break-all;
                }
                span {
                    color: #666;
                    font-size: 12px;
                }
            }
        }
        &.statistics-rs {
            width: 383px;
            position: absolute;
            top: 0;
            left: 0;
        }
        &.statistics-hy {
            margin-left: 393px;
            ul {
                li {
                    width: 16.66%;
                }
            }
        }
    }
}
.statistics-charts {
    margin: 10px 0;
    border: 1px solid #ddd;
    padding: 8px 10px 20px;
    label {
        display: inline-block;
        position: relative;
        text-indent: 5px;
        margin-bottom: 10px;
        &::before {
            background: #3089dc;
            width: 2px;
            height: 15px;
            content: "";
            display: block;
            position: absolute;
            top: 2px;
            left: 0;
        }
    }
    .statistics-tab {
        font-size: 0px;
        a {
            padding: 6px 20px;
            display: inline-block;
            text-decoration: none;
            color: #3089dc;
            border: 1px solid #3089dc;
            font-size: 12px;
            border-left: none;
            &:first-child {
                border-left: 1px solid #3089dc;
            }
            &.current {
                background: #3089dc;
                color: #fff;
            }
        }
    }
}
.charts{
        height: 400px;
    }
</style>
