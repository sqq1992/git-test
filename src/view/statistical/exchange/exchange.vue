<template>
    <div class="exchange_box" v-loading="loading">
        <search-top :data="detaultData" link="exchangeStatistics" :headers="headers" @getData="getData" ref="top">
            <echarts :condition="condition" :msg="msg" @refList="refList"></echarts>
        </search-top>
    </div>
</template>

<script>
import searchTop from '../search_top/index.vue';
import echarts from '../statistical-echarts/echarts.vue';
export default {
    data(){
        return {
            condition: {
                label: '选择礼品类型',
                members: ['优惠券', '实物', '商品折扣'],
                memberMap: {
                    '优惠券': 'coupon',
                    '实物': 'commodity',
                    '商品折扣': 'gift_wareDiscount',
                },
            },
            headers: [
                {
                    name: '日期',
                    key: 'date'
                },
                {
                    name: '兑换情况汇总（人/次/消耗积分)',
                    key: 'all'
                },
                {
                    name: '优惠券（人/次/消耗积分）',
                    key: 'coupon'
                },
                {
                    name: '实物（人/次/消耗积分）',
                    key: 'commodity'
                },
                {
                    name: '商品折扣（人/次/消耗积分）',
                    key: 'wareDiscount'
                },
            ],
            msg: {
                yAxisName: '兑换情况',
                x2: 200,
                echartsName: {
                   date: '日期',
                   participatePeoples: '参与人数',
                   participates: '参与人次',
                },
                list: []
            },
            detaultData: {
                giftType: 'coupon,commodity,gift_wareDiscount'
            },
            loading:true
        }
    },
    methods: {
        getData(result) {
           this.loading = false;
           this.$set(this.msg, 'list',  result.data.chartData)
        },
        refList(val) {
            this.$refs.top.queryData({
                giftType: val
            })
        }
    },
    components: {
        searchTop,
        echarts
    }
}
</script>

<style lang="less" scoped>
    .exchange_box{
        padding: 12px;
    }
</style>
