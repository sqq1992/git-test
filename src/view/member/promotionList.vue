<template>
    <div>
        <promotion-top></promotion-top>
        <div class="list fontClass" v-loading="listLoading">
            <div class="record_top">
                <span class="ui-filter-item-group">
                    <span class="ui-filter-hd">活动名称：</span>
                    <el-input v-model="queryData.activityName" style="width: auto;"></el-input>
                </span>
                <span class="ui-filter-item-group">
                    <span class="ui-filter-hd">会员账号：</span>
                    <el-input v-model="queryData.userNick" style="width: auto;"></el-input>
                </span>
                <span class="ui-filter-item-group">
                    <span class="ui-filter-hd">参与时间：</span>
                    <el-date-picker
                        v-model="queryData.startTime"
                        type="date"
                        placeholder="选择日期"
                        class="ui-filter-pd"
                        :picker-options="pickerStartTime">
                    </el-date-picker> -
                    <el-date-picker
                        v-model="queryData.endTime"
                        type="date"
                        placeholder="选择日期"
                        class="ui-filter-pd"
                        :picker-options="pickerEndTime">
                    </el-date-picker>
                </span>
                <span class="ui-filter-item-group">
                    <span class="ui-filter-hd">参与状态：</span>
                    <el-select v-model="queryData.status" class="ui-filter-pd">
                        <el-option :value="''" label="不限"></el-option>
                        <el-option :value="'1'" label="参与成功"></el-option>
                        <el-option :value="'-2'" label="参与失败"></el-option>
                    </el-select>
                </span>
                <el-button size='small' @click="getActivityList(1)" class="queryBtn">查询</el-button>
            </div>
            <div class="list_table">
                <el-table
                    :data="tableData"
                    :border="false"
                    style="width: 100%">
                    <el-table-column label="活动名称" min-width="80" align="left" prop="activityName" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column label="关联商品" min-width="120" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <a :href="`https://item.jd.com/${scope.row.firstSkuId}.html`" target="_blank" class="buttonText shop-link">{{scope.row.wareTitle}}</a>
                        </template>
                    </el-table-column>
                    <el-table-column label="会员账号" align="left" min-width="60">
                        <template scope="scope">
                            <el-row>
                                <el-col>
                                    <span v-if="scope.row.pin">{{scope.row.pin}}</span>
                                    <el-tooltip :content="scope.row.customerPin" popper-class="my_poper" placement="top" v-else-if="scope.row.customerPin">
                                      <span class="clamp_two_row">
                                        <span class="mi_icon">密</span>
                                        {{scope.row.customerPin}}
                                      </span>
                                    </el-tooltip>
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column label="参与时间" align="left" min-width="60">
                        <template scope="scope">
                            <el-row>
                                <el-col>
                                    {{scope.row.paertInTime}}
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column label="参与状态" align="left" min-width="80">
                        <template scope="scope">
                            <el-row>
                                <el-col>
                                    {{statusMap[scope.row.status]}}
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="table_footer">
                    <el-pagination
                        layout="prev, pager, next"
                        :current-page="queryData.pageNo"
                        :page-size="queryData.pageSize"
                        @current-change="getActivityList"
                        :total="total">
                    </el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import promotionTop from 'src/components/member/promotion-top';
import ajax from 'src/api/index.js';
import { clone } from 'src/common/public.js';
export default {
    data(){
        return {
            tableData: [],
            queryData: {
                pageNo: 1,
                pageSize: 20,
                activityName: '',
                userNick: '',
                status: '',
                startTime: '',
                endTime: ''
            },
            pickerStartTime: {
                disabledDate(time){
                    return false;
                }
            },
            pickerEndTime: {
                disabledDate(time){
                    return false;
                }
            },
            statusMap: {
                '1': '参与成功',
                '-2': '参与失败',
            },
            total: 0,
            listLoading: true,
            allGiftList: []
        }
    },
    created(){
        this.queryData.activityName = sessionStorage.getItem('promotionName') || '';
        sessionStorage.removeItem('promotionName');
        this.getActivityList(1);
    },
    methods: {
        getActivityList(page){
            this.queryData.pageNo = page || this.queryData.pageNo;
            this.listLoading = true;
            let queryData = clone(this.queryData);
            ajax({
                api_name: 'memberShipDiscountRecord',
                data: queryData,
                vm: this
            }, result => {
                this.tableData = result.data.list;
                this.total = result.data.total;
                this.listLoading = false;
            });
        },
    },
    components: {
        promotionTop
    }
}
</script>

<style lang="less">
    .ui-filter-item-group{
        display: inline-block;
        margin-right: 20px;
        margin-top: 10px;
        .ui-filter-hd{
            display: inline-block;
            width: 60px;
            text-align: right;
            font-size: 12px;
        }
        .w100{
            width: 100px;
        }
        .el-input{
            height: 30px;
            .el-input__inner{
                height: 100%;
            }
        }
        .ui-filter-pd{
            width: 140px;
        }
    }
</style>

<style lang="less" scoped>
    .list{
        padding: 10px 20px;
        .list_table{
            margin-top: 20px;
        }
        .table_footer{
            text-align: right;
        }
        .queryBtn{
            vertical-align: middle;
            margin-top: 3px;
        }
        .itemPrice{
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .shop-link {
            color: #3089dc;
        }
    }
</style>
