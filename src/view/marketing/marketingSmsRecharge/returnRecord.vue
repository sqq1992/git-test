<template>
    <div class="rechargeRecord">
        <el-form inline>
            <el-form-item label="查询时间：">
              <el-date-picker
                v-model="startTime"
                size="small"
                align="right"
                type="date"
                placeholder="选择起始日期"
              />
              -
              <el-date-picker
                v-model="endTime"
                size="small"
                align="right"
                type="date"
                placeholder="选择起始日期"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="handleCurrentChange(1)">查询</el-button>
            </el-form-item>
        </el-form>
        <el-table
        class="fontClass"
        :data="tableData"
        stripe
        :border="false"
        v-loading="loading"
        style="width: 100%">
            <el-table-column label="日期" min-width="140" align="left">
                <template scope="scope">
                <el-row>
                    <el-col>
                    {{scope.row.date}}
                    </el-col>
                </el-row>
                </template>
            </el-table-column>
            <el-table-column label="订单编号" min-width="140" align="left">
                <template scope="scope">
                <el-row>
                    <el-col>
                    {{scope.row.orderNum}}
                    </el-col>
                </el-row>
                </template>
            </el-table-column>
            <el-table-column label="返还条数" min-width="140" align="left">
                <template scope="scope">
                <el-row>
                    <el-col>
                    {{scope.row.count | numFormat()}}
                    </el-col>
                </el-row>
                </template>
            </el-table-column>
            <el-table-column label="返还原因" min-width="100" align="left">
                <template scope="scope">
                <el-row>
                    <el-col>
                    {{scope.row.reason}}
                    </el-col>
                </el-row>
                </template>
            </el-table-column>
        </el-table>
        <div class="table_footer" v-if="total">
            <el-pagination
                layout="prev, pager, next"
                :current-page="queryData.pageNo"
                :page-size="queryData.pageSize"
                @current-change="handleCurrentChange"
                :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import http from './../../../api/index.js';
import dateFormat from '../../../common/dateFormat.js';
import { clone } from 'src/common/public.js';
import {formatDate} from 'src/common/utils.js';
export default {
    name:'returnRecord',
    data() {
        return{
            tableData:[],
            startTime:new Date(new Date().getTime() - (7 * 86400000)),
            endTime:new Date(),
            queryData: {
                pageNo: 1,
                pageSize: 20,
            },
            total:0,
            loading:true
        }
    },
    created() {
        this.getReturnRecordList();
    },
    methods:{
        handleCurrentChange(e){
            this.queryData.pageNo = Number(e);
            this.getReturnRecordList();
        },
        getReturnRecordList(isSearch) {
            let queryData = clone(this.queryData);
            queryData.startTime = formatDate("yyyy-MM-dd",this.startTime);
            queryData.endTime = formatDate("yyyy-MM-dd",this.endTime)
            this.loading = true;
            http({
                api_name:'smsRecordList',
                data:queryData
            },res => {
                this.tableData = res.data.list || [];
                this.total = res.data.total;
                this.loading = false;
            },error => {
                this.loading = false;
            })
        }
    }
}
</script>
<style lang="less" scoped>
    .table_footer{
        text-align: right;
    }
</style>


