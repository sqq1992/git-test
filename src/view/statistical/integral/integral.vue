<template>
    <div class="integral_box" v-loading="loading">
        <search-top  link="pointStatistics" :headers="headers" @getData="getData">
                <div class="tab_box">
                    <a class="current"  href="javascript:;">互动积分数据统计</a>
                </div>
                <echarts :msg="msg"></echarts>
        </search-top>
    </div>
</template>

<script>
import searchTop from '../search_top/index.vue';
import echarts from '../statistical-echarts/echarts.vue';
export default {
    data(){
        return {
            isActive: 1,
            msg: {
                yAxisName: '积分数',
                x2: 180,x2: 180,
                echartsName: {
                   date: '日期',
                   giftConsume: '兑换消耗积分',
                   interactConsume: '互动消耗积分',
                   interactAdd: '互动发放积分'
                },
                list: []
            },
            headers: [
                {
                    name: '日期',
                    key: 'date'
                },
                {
                    name: '当日互动发放积分数',
                    key: 'interactAdd'
                },
                {
                    name: '当日互动消耗积分数',
                    key: 'interactConsume'
                },
                {
                    name: '当日兑换消耗积分数',
                    key: 'giftConsume'
                }
            ],
            loading:true
        }
    },
    created() {

    },
    methods: {
        getData(result) {
           this.loading = false;
           this.$set(this.msg, 'list',  result.data.chartData)
        }
    },
    components: {
        searchTop,
        echarts
    }
}
</script>

<style lang="less" scoped>
    .integral_box{
        padding: 12px;
        .tab_box{
            font-size: 0;
            margin-top: 20px;
            a {
                font-size: 14px;
                padding: 6px 20px;
                display: inline-block;
                text-decoration: none;
                color: #3089dc;
                border: 1px solid #3089dc;
                border-left: none;
                &:first-child {
                    border-left: 1px solid #3089dc;
                }
                &.current {
                    background: #3089dc;
                    color: #fff;
                }
            }
            p {
                display: inline-block;
                font-size: 12px;
                color: #999;
                margin-left: 10px;
            }
        }
    }
</style>
