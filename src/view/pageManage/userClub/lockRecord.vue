<template>
    <div>
        <user-club-top></user-club-top>
        <div class="lockRecord fontClass" v-loading="fullscreenLoading">
            <div class="record_top">
                <span class="ui-filter-item-group">
                    <span class="ui-filter-hd">会员账号：</span>
                    <el-input v-model="queryData.userName" style="width: auto;"></el-input>
                </span>
                <span class="ui-filter-item-group">
                    <span class="ui-filter-hd">解锁类型：</span>
                    <el-select v-model="queryData.type" class="ui-filter-pd">
                        <el-option :value="''" label="不限"></el-option>
                        <el-option :value="1" label="会员卡"></el-option>
                        <el-option :value="2" label="头像徽章"></el-option>
                    </el-select>
                </span>
                <span class="ui-filter-item-group">
                    <span class="ui-filter-hd">解锁内容：</span>
                    <el-select v-model="queryData.content" class="ui-filter-pd">
                        <el-option :value="''" label="不限"></el-option>
                        <el-option
                            v-for="(tag, index) in memberCard"
                            :key="'memberCard_'+index"
                            v-if="queryData.type == 1 || queryData.type == 0"
                            :value="tag.title"
                            :label="tag.title">
                        </el-option>
                        <el-option
                            v-for="(tag, index) in avatarBrade"
                            :key="'avatarBrade_'+index"
                            v-if="queryData.type == 2 || queryData.type == 0"
                            :value="tag.title"
                            :label="tag.title">
                        </el-option>
                    </el-select>
                </span>
                <span class="ui-filter-item-group">
                    <span class="ui-filter-hd">解锁时间：</span>
                    <el-date-picker
                        v-model="queryData.unlockStartTime"
                        type="date"
                        placeholder="选择日期"
                        class="ui-filter-pd"
                        :picker-options="pickerStartTime">
                    </el-date-picker> - 
                    <el-date-picker
                        v-model="queryData.unlockEndTime"
                        type="date"
                        placeholder="选择日期"
                        class="ui-filter-pd"
                        :picker-options="pickerEndTime">
                    </el-date-picker>
                </span>
                <el-button size='small' @click="queryVipLookRecord()" class="queryBtn">查询</el-button>
            </div>
            <div class="record_table">
                <el-table
                    :data="tableData"
                    :border="false"
                    style="width: 100%">
                    <el-table-column label="会员账号" min-width="160" align="left">
                        <template scope="scope">
                            <el-row>
                                <el-col>
                                    {{scope.row.userName}}
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column label="会员昵称" min-width="160" align="left">
                        <template scope="scope">
                            <el-row>
                                <el-col>
                                    {{scope.row.userNick}}
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column label="会员等级" align="left" min-width="140">
                        <template scope="scope">
                            <el-row>
                                <el-col>
                                    {{levelName[scope.row.level]}}
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column label="类型" align="left" min-width="120">
                        <template scope="scope">
                            <el-row>
                                <el-col>
                                    {{scope.row.type == 1 ? '会员卡' : '头像徽章'}}
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column label="内容" align="left" min-width="140">
                        <template scope="scope">
                            <el-row>
                                <el-col>
                                    {{scope.row.title}}
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column label="解锁时间" align="left" min-width="180">
                        <template scope="scope">
                            <el-row>
                                <el-col>
                                    {{scope.row.operateTime}}
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column label="消耗积分" align="left" min-width="140">
                        <template scope="scope">
                            <el-row>
                                <el-col>
                                    {{scope.row.cost | numFormat}}
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
                        @current-change="getRecordList"
                        :total="queryData.total">
                    </el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ajax from 'src/api/index.js';
import userClubTop from 'src/components/user-club-top/user-club-top';
import { clone } from 'src/common/public.js';
import dateFormat from 'src/common/dateFormat.js';
export default {
    data(){
        return {
            tableData: [],
            queryData: {
                pageNo: 1,
                pageSize: 20,
                unlockStartTime: '',
                unlockEndTime: '',
                userName: '',
                type: '',
                content: '',
                total: 0
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
            fullscreenLoading: true,
            avatarBrade: [],
            memberCard: [],
            levelName: {}
        }
    },
    watch: {
        'queryData.unlockStartTime'(val){
            if(val){
                this.pickerEndTime = {
                    disabledDate(time) {
                        return time.getTime() < new Date(val);
                    }
                }
            } else {
                this.pickerEndTime = {
                    disabledDate(time){
                        return false;
                    }
                };
            }
        },
        'queryData.unlockEndTime'(val){
            if(val){
                this.pickerStartTime = {
                    disabledDate(time) {
                        return time.getTime() > new Date(val);
                    }
                }
            } else {
                this.pickerStartTime = {
                    disabledDate(time){
                        return false;
                    }
                };
            }
        }
    },
    created(){
        this.getUnlockTypeList();
        this.getRecordList(1);
        this.memberLevelList();
    },
    methods: {
        getUnlockTypeList(){
            ajax({
                api_name: 'unlockTypeList',
                data: {},
                vm: this
            }, result => {
                this.memberCard = result.data.memberCard;
                this.avatarBrade = result.data.avatarBrade;
            });
        },
        getRecordList(page){
            this.queryData.pageNo = page;
            this.fullscreenLoading = true;
            let queryData = clone(this.queryData);
            queryData.unlockStartTime = queryData.unlockStartTime ? (dateFormat(queryData.unlockStartTime,'YY-MM-DD HH:MM:SS')) : '';
            queryData.unlockEndTime = queryData.unlockEndTime ? (dateFormat(queryData.unlockEndTime,'YY-MM-DD')+' 23:59:59') : '';
            ajax({
                api_name: 'queryVipLookRecord',
                data: queryData,
                vm: this
            }, result => {
                this.tableData = result.data.page.content;
                this.queryData.total = result.data.page.total;
                this.fullscreenLoading = false;
            });
        },
        queryVipLookRecord(){
            this.getRecordList(1);
        },
        memberLevelList() {			//会员等级规则
            let _self = this;
            ajax({						
                api_name: 'memberLevelList',
                vm: this,
                data: {}
            }, (res) => {
                let obj = {};
                let arr = res.data ? (res.data.levelList ? res.data.levelList : []) : [];
                arr.forEach(item => {
                    obj[item.memberLevel] = item.name ? item.name : item.nameSource;
                    
                });
                this.levelName = obj;
            }, (error) => {
            })
        }
    },
    components: {
        userClubTop
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
    .lockRecord{
        padding: 0 20px;
        .record_table{
            margin-top: 20px;
        }
        .table_footer{
            text-align: right;
        }
        .queryBtn{
            vertical-align: middle;
            margin-top: 3px;
        }
    }
</style>
