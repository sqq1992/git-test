<template>
    <el-dialog title="人群设置" :visible.sync="dialogCrowdVisible">
        <div class="crowdTop">
            <div class="crowdText">
                <span class="crowdName">目标人群：</span>
                <span class="crowdValue">{{data.crowdName}}<el-button type="text" @click="showCrowdTableFn">{{data.crowdName ? '重新选择目标人群' : '选择目标人群'}}</el-button></span>
            </div>
            <div class="crowdText">
                <span class="crowdName">优先级：</span>
                <span class="crowdValue">
                    <el-select v-model="data.orderNum" placeholder="请选择">
                        <el-option
                            v-for="item in priorityList"
                            :key="item"
                            :label="item"
                            :value="item">
                        </el-option>
                    </el-select>
                    <span class="crowdHint">
                        优先级数字越小，排在越前面
                    </span>
                </span>
            </div>
        </div>
        <div class="crowdCont" v-if="showCrowdTable">
            <div class="crowdCont_top">
                <span class="crowdCont_top_name">人群名称：</span>
                <span class="crowdCont_top_value" style="padding-left: 12px;"><el-input v-model="pageData.crowdName"></el-input></span>
                <span class="crowdCont_top_name">所属分组：</span>
                <span class="crowdCont_top_value">
                    <el-select v-model="pageData.groupId">
                        <el-option :value="''" label="不限">不限</el-option>
                        <el-option
                            v-for="(item, index) in crowdGroup"
                            :key="'crowdGroup_'+index"
                            :label="item.groupName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </span>
                <el-button type="text" @click="getCrowdsList">查询</el-button>
            </div>
            <el-table
                :data="crowdList"
            >
                <el-table-column
                    prop="crowdName"
                    label="人群名称">
                </el-table-column>
                <el-table-column label="操作" align="left" width="180">
                    <template scope="scope">
                        <el-row>
                            <el-col>
                                <el-button type="text" @click="checkCrowdId(scope.row)" v-if="!scope.row.selectedByOtherShopStory || (data.crowdId == scope.row.id)">{{data.crowdId == scope.row.id ? '已选取' : '选取'}}</el-button>
                                <span v-if="scope.row.selectedByOtherShopStory && (data.crowdId != scope.row.id)">已被其他页面选取</span>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
            </el-table>
            <div class="crowdCont_footer">
                <el-pagination
                    layout="prev, pager, next"
                    :current-page="pageData.pageNo"
                    @current-change="getCrowds"
                    :page-size="pageData.pageSize"
                    :total="pageData.total">
                </el-pagination>
            </div>
        </div>
        <div class="crowdDialog_btns" v-if="!showCrowdTable">
            <el-button type="primary" @click="checkCrowdDialog">确定</el-button>
            <el-button @click="closeCrowaDialog">取消</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { clone } from 'src/common/public.js';
import ajax from 'src/api/index.js';
export default {
    props: {
        data: {
            type: Object,
            default: {}
        }
    },
    watch: {
        'data' (val){
        }
    },
    data(){
        return {
            priorityList: [
                10,
                9,
                8,
                7,
                6,
                5,
                4,
                3,
                2,
                1
            ],
            dialogCrowdVisible: false,
            crowdList: [],
            pageData: {
                pageNo: 1,
                pageSize: 5,
                total: 0,
                crowdName: '',
                groupId: ''
            },
            showCrowdTable: false,
            crowdGroup: [],
            oldData: {}
        };
    },
    created(){
        ajax({
            api_name: 'getCrmGroupList',
            vm: this,
            data: this.pageData
        }, result => {
            this.crowdGroup = result.data.crmGroupList;
        });
    },
    methods: {
        getCrowdsList(){
            this.getCrowds(1);
        },
        getCrowds(pageNo){
            this.pageData.pageNo = pageNo;
            ajax({
                api_name: 'queryCrowds',
                vm: this,
                data: this.pageData
            }, result => {
                this.pageData.total = result.data.total;
                this.crowdList = result.data.crowds;
            });
        },
        checkCrowdId(data){
            this.crowdList.forEach(element => {
                if(element.id == this.data.crowdId){
                    element.selectedByOtherShopStory = false;
                }
            });
            this.data.crowdId = data.id;
            this.data.crowdName = data.crowdName;
            this.showCrowdTable = false;
        },
        showCrowdTableFn(){
            this.showCrowdTable = !this.showCrowdTable;
            this.pageData.pageNo = 1;
        },
        showCrowdDialog(){
            this.dialogCrowdVisible = true;
            this.oldData = clone(this.data);
            this.getCrowds(1);
        },
        closeCrowaDialog(){
            this.dialogCrowdVisible = false;
            this.showCrowdTable = false;
            this.$emit('save', this.oldData, false);
        },
        checkCrowdDialog(){
            if(!this.data.crowdId){
                this.$message({
                    type: 'error',
                    message: '请选择目标人群'
                });
                return;
            }
            this.dialogCrowdVisible = false;
            this.showCrowdTable = false;
            this.$emit('save', this.data, true);
        }
    }
}
</script>

<style lang="less">
.crowdTop .crowdText .crowdValue .el-input__inner{
    height: 36px;
}
.crowdCont .crowdCont_top .el-input__inner{
    height: 36px;
}
</style>

<style lang="less" scoped>

.crowdTop{
    .crowdText{
        height: 35px;
        line-height: 35px;
        margin-top: 10px;
        &:first-child{
            margin-top: 0;
        }
        .crowdName{
            display: inline-block;
            width: 80px;
            text-align: right;
        }
        .crowdValue{
            margin-left: 10px;
            max-width: ~'calc(100% - 100px)';
            .crowdHint{
                color: #999;
                margin-left: 5px;
            }
        }
    }
}
.crowdCont{
    margin-top: 20px;
    .crowdCont_top{
        margin-bottom: 20px;
    }
    .crowdCont_top_name{
        display: inline-block;
        width: 80px;
        text-align: right;
    }
    .crowdCont_top_value{
        display: inline-block;
        width: 130px;
        margin-right: 30px;
    }
    .crowdCont_footer{
        text-align: right;
    }
}
.crowdDialog_btns{
    text-align: center;
    margin-top: 20px;
}
</style>
