<template>
    <span class="crm-dialog-btn-wrapper">
        <el-button slot="button" @click="showDialog">选择其他智能人群</el-button>
        <el-dialog
        title="其他智能人群"
        :visible.sync="dialogVisible"
        @close="handleClose">
        <div>
            <div class="clearfix hidden m_b10 inputSet">
                    <span>所属分组：</span>
                    <el-select @change="crmCrowdList(true)" :clearable="true" v-model="value" class="el_inp el_select row_line" placeholder="请选择">
                        <el-option
                            v-for="item in optionss"
                            :key="item.id"
                            :label="item.groupName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                    <span class="m_l20">人群名称：</span>
                    <el-input @keyup.native.enter="crmCrowdList(true)" v-model="input" style="width:200px;" class="el_inp el_input row_line" placeholder="请输入内容"></el-input>
                    <el-button @click="crmCrowdList(true)" class="m_l20" size="small">查询</el-button>
            </div>
            <el-table
            class="fontClass"
            v-loading="loadingPage"
            :data="tableData"
            :border="false"
            style="width: 100%">
                <el-table-column label="人群名称" min-width="160" align="left" prop="crowdName" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column label="人群介绍" min-width="160" align="left" prop="crowdDesc" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column label="客户数量" align="left" min-width="120">
                    <template scope="scope">
                        <el-row>
                            <el-col>
                                <el-button type="text" @click="lookItem(scope.row.dealSet)" v-if="scope.row.customerCount || scope.row.customerCount == 0">{{scope.row.customerCount | numFormat}}</el-button>
                                <span v-if="!scope.row.customerCount && scope.row.customerCount != 0">计算中...</span>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="left" min-width="140">
                    <template scope="scope">
                        <el-row>
                            <el-col>
                                <el-button type="text" @click="setRule(scope.row)">选中人群</el-button>
                                <!-- <el-button type="text" @click="routerTo(scope.row)">立即营销</el-button>
                                <el-button type="text" @click="edit(scope.row)">编辑</el-button>
                                <el-button class="m_l20" type="text" @click="deleterow(scope.row)">删除</el-button> -->
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
            </el-table>
            <div class="text-right" v-if="pageInfo.total">
                <el-pagination
                    :current-page="pageInfo.pageNo"
                    @current-change="handleCurrentChange"
                    :page-size="pageInfo.pageSize"
                    layout="prev, pager, next"
                    :total="pageInfo.total">
                </el-pagination>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">{{ onConfirm ? cancelText : confirmText }}</el-button>
            <el-button type="primary" @click="handleConfirm" v-if="onConfirm">{{ confirmText }}</el-button>
        </span>
        </el-dialog>
    </span>
</template>
<script>
import http from 'src/api'
export default {
    props: {
      title:String,
      buttonName:String,
      cache:{
        type:Boolean,
        default:true
      },
      customClass: String,
      confirmText:{
        type:String,
        default:'确 定'
      },
      cancelText:{
        type:String,
        default:'取 消'
      },
      onConfirm:Function,
      changeRule:Function
    },
    data() {
        return {
            tableData:[],
            optionss: [],
            loadingPage:false,
            pageInfo: {
                pageNo: 1,
                pageSize: 10,
                total: 0
            },
            value: '',
            input: '',
            dialogVisible:false
        }
    },
    methods: {
        showDialog() {
            this.dialogVisible = true;
            this.crmGroupList();
        },
        handleClose() {
            this.$emit('onCancel')
        },
        handleConfirm() {
            // 弹框确定按钮事件
            this.$emit('onConfirm',() => {
            this.dialogVisible = false
            })
        },
        handleCurrentChange(e) {		//翻页
            this.pageInfo.pageNo = Number(e);
            this.crmCrowdList();
        },
        crmGroupList() {			//查询分组列表
            http({
                api_name: 'crmGroupList',
                vm: this,
                data: {}
            }, (res) => {
                this.options = res.data ? (res.data.crmGroupList ? res.data.crmGroupList : []) : [];
                this.optionss = [];
                // this.optionss = res.data ? (res.data.crmGroupList ? res.data.crmGroupList : []) : [];
                this.optionss.push({
                    groupName: '不限',
                    id: ''
                });
                this.options.forEach(item => {
                    this.optionss.push(item);
                });
                this.crmCrowdList();
            }, (error) => {});
        },
        crmCrowdList(flag) {
            if(flag) {
					this.pageInfo.pageNo = 1;
            }
            this.loadingPage = true;
            http({
                api_name: 'crmCrowdList',
                vm: this,
                data: {
                    crowdName: this.input,
                    groupId: this.value,
                    page: this.pageInfo.pageNo,
                    pageSize: this.pageInfo.pageSize
                }
            }, (res) => {
                try{
                    let data = res.data ? (res.data.crmCrowdList ? res.data.crmCrowdList : []) : [];
                    this.tableData = data;
                    this.num = res.data.allTotal;
                    this.pageInfo.total = res.data.allTotal;
                    this.loadingPage = false;
                    this.tableData.forEach(item => {
                        this.queryGroupNumber(item);
                    });
                } catch(e){
                    console.log(e);
                }
            }, (error) => {
                this.loadingPage = false;
            });
        },
        queryGroupNumber(item, cb){
            http({
                api_name: 'queryCrowdCount',
                data: {
                    dealSet: item.dealSet
                },
                vm: this,
            }, result => {
                this.$set(item, 'customerCount', result.data.count);
                /* 如果当前查询的是 星标人群，则将  人群列表中的 星标人群进行更改 */
                // if(item.signFlag){
                /* 低效率大循环体，因为异步的原因 暂时没有想到该如何进行同步 双向数据 */
                this.cusArr.forEach((ele, index) => {
                    this.tableData.some((data, i) => {
                        if(ele.id == data.id){
                            this.$set(data, 'customerCount', ele.customerCount);
                            return true;
                        }
                    });
                });
                // }
                cb && cb(result.data.count);
            });
        },
        setRule(data) {
            this.$emit('setOtherCrowd',data);
            this.dialogVisible = false;
        }
    }
}
</script>

<style scoped lang="less" rel="stylesheet/less">
  .crm-dialog-btn-wrapper{
    & + .crm-dialog-btn-wrapper {
      margin-left:16px;
    }
  }

  .el-button--mini{font-size: 12px ;border-radius: 2px;padding:7px 12px;}
</style>
