<template>
    <div class="search" v-loading="isLoading">
        <div class="tips">系统每日凌晨统计汇总前一日的会员数据，且只保留最近90天的数据，若需90天之前的数据，请联系客服 <span class="fr">数据更新时间：{{lastUplateTime}}</span></div>
        <div class="search_box ui-filter-item-group">
            <span class="search_text">数据统计范围：</span>
            <span class="search_btn_group">
                <span class="search_btn" :class="{'active': index === activeIndex}" v-for="(item, index) in btnList" :key="'bnt_'+index" @click="changeQuickTime(item.value)">{{item.name}}</span>
            </span>
            <span class="search_time">
                <el-date-picker
                    v-model="query.startTime"
                    align="right"
                    type="date"
                    placeholder="选择日期"
                    class="ui-filter-pd"
                    :picker-options="startOptions"
                ></el-date-picker> -
                <el-date-picker
                    v-model="query.endTime"
                    align="right"
                    type="date"
                    placeholder="选择日期"
                    class="ui-filter-pd"
                    :picker-options="endOptions"
                ></el-date-picker>
            </span>
            <el-button size='small' class="queryBtn" @click="clickSearch">查询</el-button>
            <el-button v-if="showSummaryQuery" size='small' class="summaryQueryBtn" @click="summaryQuery">汇总查询</el-button>
        </div>
        <slot></slot>
        <div class="search_data">
            <el-table
                :data="list"
                empty-text="暂无数据，系统会在每日凌晨同步汇总前一日的数据"
            >
                <el-table-column
                    :fixed="item.key == 'date'"
                    :render-header="renderHeader"
                    :label="item.name" v-for="(item, index) in headers" :key="'column_'+index">
                    <template scope="scope">
                      {{scope.row[item.key] || '-'}}
                    </template>
                </el-table-column>
            </el-table>
            <div class="table_footer" v-if="list.length">
                <el-pagination
                    layout="prev, pager, next"
                    :page-size="20"
                    :current-page="pageNo"
                    @current-change="paginQuery"
                    :total="total">
                </el-pagination>
            </div>
        </div>
        <summary-detail :title="summaryTitle" :summaryData="summaryData" :showSummary="showSummary" @hideSummary="hideSummary"></summary-detail>
    </div>
</template>

<script>
import formatDate from 'src/common/formatDate';
import { extend, clone } from 'src/common/public';
import dateFormat from 'src/common/dateFormat.js';
import ajax from 'src/api/index.js';
import summaryDetail from './summyDetail';
export default {
    props: {
        link: {
            type: String
        },
        data: {
            type: Object,
            default(){
                return {}
            }
        },
        headers: {
            type: Array,
            default(){
                return []
            }
        },
        showSummaryQuery:{
          type:Boolean,
          default() {
            return false
          }
        }
    },
    components:{summaryDetail},
    data(){
        return {
            activeIndex: 0,
            btnList: [
                {
                    name: '近7天',
                    value: '7'
                },
                {
                    name: '近15天',
                    value: '15'
                },
                {
                    name: '近30天',
                    value: '30'
                }
            ],
            startTime: '',
            endTime: '',
            query: {
                startTime: '',
                endTime: '',
                pageSize: 20,
                pageNo: 1
            },
            startOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now() - 8.64e7 || time.getTime() < Date.now() - 7776000000;
                }
            },
            endOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now() - 8.64e7 || time.getTime() < Date.now() - 7776000000;
                }
            },
            list: [],
            pageNo: 1,
            total: 0,
            lastUplateTime: '',
            showSummary:false,
            summaryTitle:'',
            summaryData:[],
            isLoading:false
        }
    },
    watch: {
        'startTime'(val){
            if(val){
                this.endOptions = {
                    disabledDate(time) {
                        return time.getTime() > Date.now() - 8.64e7 || time.getTime() < new Date(val)  || time.getTime() < Date.now() - 7776000000;
                    }
                }
            } else {
                this.endOptions = {
                    disabledDate(time){
                        return time.getTime() > Date.now() - 8.64e7 || time.getTime() < Date.now() - 7776000000;
                    }
                };
            }
        },
        'endTime'(val){
            if(val){
                this.startOptions = {
                    disabledDate(time) {
                        return time.getTime() > Date.now() - 8.64e7 || time.getTime() > new Date(val)  || time.getTime() < Date.now() - 7776000000;
                    }
                }
            } else {
                this.startOptions = {
                    disabledDate(time){
                        return time.getTime() > Date.now() - 8.64e7 || time.getTime() < Date.now() - 7776000000;
                    }
                };
            }
        }
    },
    created() {
        this.changeQuickTime('7');
    },
    methods: {
        queryData(data = {}){
            let queryData = clone(this.query);
            queryData.startTime = queryData.startTime ? (dateFormat(queryData.startTime,'YY-MM-DD')) : '';
            queryData.endTime = queryData.endTime ? (dateFormat(queryData.endTime,'YY-MM-DD')) : '';
            ajax({
                api_name: this.link,
                data: extend(extend(queryData, this.data), data),
                vm: this
            }, result => {
                this.list = result.data.list;
                this.total = result.data.total;
                this.lastUplateTime = result.data.lastUplateTime || '尚未更新';
                this.$emit('getData', result);
            }, error => {
                console.error(error);
            });
        },
        summaryQuery() {
          let queryData = clone(this.query);
          queryData.startTime = queryData.startTime ? (dateFormat(queryData.startTime,'YY-MM-DD')) : '';
          queryData.endTime = queryData.endTime ? (dateFormat(queryData.endTime,'YY-MM-DD')) : '';
          this.summaryTitle = queryData.startTime + '至' +queryData.endTime + '互动统计数据汇总'
          this.isLoading = true;
          ajax({
            api_name:'dynamicTotalStatistics',
            data:queryData,
            vm:this
          },result => {
            this.isLoading = false;
            this.summaryData = result.data.statistics;
            this.showSummary = true;
          },error => {
            console.error(error);
          })
        },
        hideSummary() {
          this.showSummary = false;
        },
        // 快捷查询
        changeQuickTime(day){
            let i = this.btnList.map(item => item.value).indexOf(day);
            this.activeIndex = i;
            let nowDate = new Date().getTime();
            this.query.startTime = formatDate(nowDate - day * 8.64e7);
            this.query.endTime = formatDate(nowDate - 8.64e7);

            this.clickSearch();
        },
        // 查询按钮点击
        clickSearch(){
            this.queryData({
                pageNo: 1
            });
        },
        // 翻页的查询
        paginQuery(pageNo){
            this.pageNo = pageNo;
            this.queryData({
                pageNo
            })
        },
        renderHeader(h, {column, index}){
            return h('span', { style: 'font-size: 12px;' }, column.label);
        }
    }
}
</script>

<style lang="less" scoped>
    .fr{
        float: right;
    }
    .search_box{
        padding: 0 20px;
        margin-top: 15px;
        .search_text{
        }
        .search_btn_group{
            margin-left: 10px;
            .search_btn{
                display: inline-block;
                height: 30px;
                line-height: 30px;
                width: 70px;
                text-align: center;
                border: 1px solid #999;
                border-radius: 4px;
                margin-right: 10px;
                cursor: pointer;
                position: relative;
                &:hover{
                    border-color: #3089dc;
                }
                &.active{
                    border-color: #3089dc;
                    color: #3089dc;
                    &:after{
                        content: '';
                        display: inline-block;
                        width: 13px;
                        height: 13px;
                        background-image: url('~assets/images/sprite-tag-group.gif');
                        background-size: 100% 100%;
                        position: absolute;
                        right: 0;
                        bottom: 0;
                    }
                }
            }
        }
        .search_time{
            margin-left: 10px;
        }
        .queryBtn{
            margin-left: 15px;
        }
    }
    .search_data{
        margin-top: 30px;
    }
    .table_footer{
        text-align: right;
    }
</style>
