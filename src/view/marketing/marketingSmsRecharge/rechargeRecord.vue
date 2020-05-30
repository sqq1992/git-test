<template>
    <div class="rechargeRecord">
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
                    {{scope.row.created}}
                    </el-col>
                </el-row>
                </template>
            </el-table-column>
            <el-table-column label="订购数量" min-width="140" align="left">
                <template scope="scope">
                <el-row>
                    <el-col>
                    {{scope.row.rechargeCount | numFormat()}}
                    </el-col>
                </el-row>
                </template>
            </el-table-column>
            <el-table-column label="订购形式" min-width="100" align="left">
                <template scope="scope">
                <el-row>
                    <el-col>
                    {{scope.row.remark}}
                    </el-col>
                </el-row>
                </template>
            </el-table-column>
            <el-table-column label="订购费用" align="left" min-width="120">
                <template scope="scope">
                <el-row>
                    <el-col class="">
                    ￥{{scope.row.totalCost | numFormat(2)}}
                    </el-col>
                </el-row>
                </template>
            </el-table-column>
            <el-table-column label="到期时间" align="left" min-width="120">
                <template scope="scope">
                <el-row>
                    <el-col>
                        {{scope.row.expireTime || '永久有效'}}
                    </el-col>
                </el-row>
                </template>
            </el-table-column>
             <el-table-column label="过期数量" align="left" min-width="120">
                <template scope="scope">
                <el-row>
                    <el-col>
                        {{scope.row.expireNum }}
                    </el-col>
                </el-row>
                </template>
            </el-table-column>
             <el-table-column label="订单编号" align="left" min-width="120">
                <template scope="scope">
                <el-row>
                    <el-col>
                        {{scope.row.orderCode }}
                    </el-col>
                </el-row>
                </template>
            </el-table-column>
        </el-table>
        <div class="table_footer" v-if="queryData.total">
            <el-pagination
                layout="prev, pager, next"
                :current-page="queryData.pageNo"
                :page-size="queryData.pageSize"
                @current-change="handleCurrentChange"
                :total="queryData.total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import http from './../../../api/index.js';
import dateFormat from '../../../common/dateFormat.js';
import { clone } from 'src/common/public.js';
export default {
    name:'rechargeRecord',
    components:{

    },
    data() {
        return{
            tableData:[],
            queryData: {
                pageNo: 1,
                pageSize: 20,
                total:0
            },
            loading:true
        }
    },
    created() {
        this.getChargeRecordList();
    },
    methods:{
        handleCurrentChange(e){
            this.queryData.pageNo = Number(e);
            this.getChargeRecordList();
        },
        getChargeRecordList() {
            let queryData = clone(this.queryData);
            this.loading = true;
            http({
                api_name:'getChargeRecordList',
                data:queryData
            },res => {
                this.tableData = res.data.list || [];
                this.queryData.total = res.data.num;
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


