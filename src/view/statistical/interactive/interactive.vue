<template>
    <div class="integral_box" v-loading="loading">
        <search-top :data="detaultData" link="interactStatistics"  @getData="getData" :headers="headers" ref="top" :showSummaryQuery="true">
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
                label: '选择互动类型',
                members: ['每日签到', '大转盘', '关注店铺', '邀请好友关注店铺', '完善会员信息','抢红包','打地鼠','新人入会礼'],
                memberMap: {
                    '每日签到': 'sign_turntable',
                    '大转盘': 'dynamic_turntable',
                    '关注店铺': 'dynamic_followShop',
                    '邀请好友关注店铺': 'dynamic_invitationPeople',
                    '完善会员信息': 'jd_complete',
                    '抢红包':'openRedEnvelope',
                    '打地鼠':'whackDiglett',
                    '新人入会礼':'newcomerActivity'
                },
            },
            headers: [
                {
                    name: '日期',
                    key: 'date'
                },
                {
                    name: '参与情况汇总（人/次/积分发放）',
                    key: 'all'
                },
                {
                    name: '大转盘（人/次/积分发放）',
                    key: 'turntable'
                },
                {
                    name: '签到（人/次/积分发放）',
                    key: 'sign'
                },
                {
                    name: '关注店铺（人/次/积分发放）',
                    key: 'followshop'
                },
                {
                    name: '邀请好友关注店铺（人/次/积分发放）',
                    key: 'invitation'
                },
                {
                    name: '完善会员信息（人/次/积分发放）',
                    key: 'complete'
                },
                {
                    name:'抢红包（人/次/积分发放）',
                    key: 'openRedEnvelope'
                },
                {
                    name:'打地鼠(人/次/积分发放）',
                    key: 'whackDiglett'
                },
                {
                    name:'新人入会礼(人/次/积分发放）',
                    key: 'newcomerActivity'
                }
            ],
            msg: {
                yAxisName: '参与情况',
                x2: 180,
                echartsName: {
                   date: '日期',
                   participatePeoples: '参与人数',
                   participates: '参与人次',
                   points:'积分'
                },
                list: []
            },
            list: [],
            detaultData: {
                interactType: 'sign_turntable,dynamic_turntable,dynamic_followShop,dynamic_invitationPeople,jd_complete,openRedEnvelope,whackDiglett,newcomerActivity'
            },
            loading:true
        }
    },
    created() {
    },
    methods: {
        getData(result) {
            this.loading = false;
            this.$set(this.msg, 'list',  result.data.chartData)
        },
        refList(val) {
            this.$refs.top.queryData({
                interactType: val
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
    .integral_box{
        padding: 12px;
    }
</style>
