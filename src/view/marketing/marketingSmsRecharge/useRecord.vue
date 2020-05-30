<template>
    <div class="useRecord">
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
            <el-table-column label="短信使用数量" min-width="140" align="left">
                <template scope="scope">
                <el-row>
                    <el-col>
                    {{scope.row.count | numFormat()}}
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
import { clone } from 'src/common/public.js';
export default {
    name:'useRecord',
    components:{

    },
    data() {
        return{
            tableData:[],
            queryData:{
                pageNo: 1,
                pageSize: 20,
            },
            total:0,
            loading:false
        }
    },
    created() {
        this.getSmsUseRocordList();
    },
  computed: {
    isZiying(){
      return this.$store.state.ziying.isZiying
    }
  },
    methods:{
        handleCurrentChange(e){
            this.queryData.pageNo = Number(e);
            this.getSmsUseRocordList();
        },
        getSmsUseRocordList() {
            let queryData = clone(this.queryData);
            this.loading = true;
            http({
                api_name: 'smsRecordListByDate',
                data: {
                  ...queryData,
                  operateType: this.isZiying ? 1 : ''
                },
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


