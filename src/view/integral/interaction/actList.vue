<template>
    <div>
        <welfare-top v-if="actType == 'welfare'"></welfare-top>
        <interaction-top v-else></interaction-top>
        <div class="list fontClass" v-loading="listLoading">
            <div class="record_top">
                <span class="ui-filter-item-group">
                    <span class="ui-filter-hd">活动名称：</span>
                    <el-input v-model="queryData.activityName" style="width: auto;"></el-input>
                </span>
                <span class="ui-filter-item-group">
                    <span class="ui-filter-hd">活动类型：</span>
                    <el-select v-model="queryData.activityType" class="ui-filter-pd" v-if="actType == 'welfare'">
                        <el-option :value="''" label="不限"></el-option>
                        <el-option :value="'collage'" label="拼团"></el-option>
                        <el-option :value="'dynamic_bargain'" label="砍价"></el-option>
                    </el-select>
                    <el-select v-model="queryData.activityType" class="ui-filter-pd" v-else>
                        <el-option :value="''" label="不限"></el-option>
                        <el-option :value="'sign_turntable'" label="每日签到"></el-option>
                        <el-option :value="'dynamic_turntable'" label="大转盘"></el-option>
                        <el-option :value="'dynamic_followShop'" label="关注店铺"></el-option>
                        <el-option :value="'dynamic_invitationPeople'" label="邀请关注店铺"></el-option>
                        <el-option :value="'jd_complete'" label="完善会员信息"></el-option>
                        <el-option :value="'newcomer_activity'" :label="inBrand ? '开卡奖励' : '新人入会礼'"></el-option>
                        <el-option :value="'dynamic_whackDiglett'" label="打地鼠游戏"></el-option>
                        <el-option :value="'dynamic_openRedEnvelope'" label="抢红包游戏"></el-option>
                        <el-option :value="'dynamic_wareFollow'" label="加购关注商品有礼"></el-option>
                        <el-option :value="'dynamic_invitationWareFollow'" label="邀请加购关注商品"></el-option>
                    </el-select>
                </span>
                <span class="ui-filter-item-group">
                    <span class="ui-filter-hd">活动状态：</span>
                    <el-select v-model="queryData.activityStatus" class="ui-filter-pd">
                        <el-option :value="''" label="不限"></el-option>
                        <el-option :value="'wait'" label="未开始"></el-option>
                        <el-option :value="'valid'" label="进行中"></el-option>
                        <el-option :value="'invalid'" label="已结束"></el-option>
                    </el-select>
                </span>
                <span class="ui-filter-item-group">
                    <span class="ui-filter-hd w100">活动开始时间：</span>
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
                <el-button size='small' @click="getActivityList(1)" class="queryBtn">查询</el-button>
            </div>
            <list-sort type='activity' :getList="getAllActivityList" :header="headers" :data="allActivityList" :sort1="descOrder" :sort2="ascOrder" @checkSortList="checkSortList"></list-sort>
            <div class="list_table">
                <el-table
                    :data="tableData"
                    :border="false"
                    style="width: 100%">
                    <el-table-column label="活动名称" min-width="120" prop="activityName" align="left" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column label="活动类型" min-width="90" align="left">
                        <template scope="scope">
                            <el-row>
                                <el-col>
                                    {{activityMap[scope.row.activityType]}}
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column label="活动对象" align="left" min-width="70" v-if="actType == 'welfare'">
                        <template scope="scope">
                            <el-row>
                                <el-col>商品</el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" align="left" min-width="70">
                        <template scope="scope">
                            <el-row>
                                <el-col>
                                   {{statusMap[scope.row.status]}}
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column label="开始时间" align="left" min-width="140">
                        <template scope="scope">
                            <el-row>
                                <el-col>
                                    {{scope.row.startTime}}
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column label="结束时间" align="left" min-width="140">
                        <template scope="scope">
                            <el-row>
                                <el-col>
                                    <span v-if="scope.row.endTime == '2037-12-31 23:59:59'">永久</span>
                                    <span v-else>{{scope.row.endTime}}</span>
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column label="参与人次" align="left" min-width="80" v-if="actType != 'welfare'">
                        <template scope="scope">
                            <el-row>
                                <el-col>
                                    {{scope.row.partInNum | numFormat}}
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="left" min-width="260">
                        <template scope="scope">
                            <el-row>
                                <el-col v-if="scope.row.status == 'wait'">
                                    <el-button type="text" @click="startAct(scope.row)">立即开始</el-button>
                                    <el-button class="m_l20" type="text" @click="edit(scope.row)">编辑</el-button>
                                    <el-button v-if="actType == 'welfare'" class="m_l20" type="text" @click="promotionAudit(scope.row)">促销审核</el-button>
                                    <el-button v-if="canPreview(scope.row.activityType)" class="m_l20" type="text" @click="preview(scope.row)">提取链接</el-button>
                                    <el-button class="m_l20" type="text" @click="deleterow(scope.row)">删除</el-button>
                                </el-col>
                                <el-col v-else-if="scope.row.status == 'valid'">
                                    <el-button type="text" @click="edit(scope.row)">编辑</el-button>
                                    <el-button v-if="actType == 'welfare'" class="m_l20" type="text" @click="promotionAudit(scope.row)">促销审核</el-button>
                                    <el-button class="m_l20" type="text" @click="down(scope.row)">立即结束</el-button>
                                    <el-button class="m_l20" type="text" @click="detail(scope.row)">活动数据</el-button>
                                    <el-button v-if="canPreview(scope.row.activityType)" class="m_l20" type="text" @click="preview(scope.row)">提取链接</el-button>
                                </el-col>
                                <el-col v-else-if="scope.row.status == 'invalid'">
                                    <el-button type="text" @click="edit(scope.row)">查看</el-button>
                                    <el-button class="m_l20" type="text" @click="detail(scope.row)">活动数据</el-button>
                                    <el-button class="m_l20" type="text" @click="deleterow(scope.row)">删除</el-button>
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
        <qr-dialog ref="qrDetail"></qr-dialog>
        <discount-tip-dialog ref="discountTip"></discount-tip-dialog>
    </div>
</template>

<script>
import interactionTop from 'src/components/integral-interaction/interaction-top';
import welfareTop from 'src/components/integral-interaction/welfare-top';
import ajax from 'src/api/index.js';
import { clone } from 'src/common/public.js';
import dateFormat from '../../../common/dateFormat.js';
import qrDialog from 'src/components/integral-interaction/qrcode.vue';
import discountTipDialog from 'src/components/integral-interaction/discountTip.vue';
import listSort from 'src/components/list-sort/list-sort.vue';
import {point} from 'src/common/point.js';
export default {
    props: {
        actType: {
            type: String,
            default: 'interaction'
        }
    },
    data(){
        let inBrand = this.$store.state.user.inBrand;
        return {
            tableData: [],
            dialogVisible: false,
            queryData: {
                pageNo: 1,
                pageSize: 20,
                startTime: '',
                endTime: '',
                activityName: '',
                activityType: '',
                activityStatus: ''
            },
            inBrand,
            activityMap: {
                'sign_turntable': '每日签到',
                'dynamic_turntable': '大转盘',
                'dynamic_followShop': '关注店铺',
                'dynamic_invitationPeople': '邀请关注店铺',
                'dynamic_bargain': '砍价',
                'collage': '拼团',
                'jd_complete': '完善会员信息',
                'newcomer_activity': (inBrand ? '开卡奖励' :'新人入会礼'),
                'dynamic_whackDiglett':'打地鼠',
                'dynamic_openRedEnvelope':'抢红包',
                'dynamic_wareFollow':'加购关注商品有礼',
                'dynamic_invitationWareFollow':'邀请加购关注商品'
            },
            statusMap: {
                'wait': '未开始',
                'valid': '进行中',
                'invalid': '已结束'
            },
            total: 0,
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
            listLoading: true,
            headers: [
                {
                    key: 'activityName',
                    text: '活动名称',
                    width: 150
                },
                {
                    key: 'startTime',
                    text: '开始时间'
                },
                {
                    key: 'endTime',
                    text: '结束时间'
                }
            ],
            allActivityList: []
        }
    },
    watch: {
        'queryData.startTime'(val){
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
        'queryData.endTime'(val){
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
        point('37977.39403.39435')
        this.getActivityList(1);
    },
    methods: {
        //促销审核
        promotionAudit(item) {
            let vm = this;
            ajax({
                api_name: 'getFollowShopRuleById',
                data: {
                    id: item.id
                }
            }, result => {
                let lottoSetting = JSON.parse(result.data.lottoSetting),
                    promoId = '';
                if(lottoSetting && lottoSetting.length) {
                    lottoSetting.forEach(obj => {
                        if(obj.type == 'dynamic_wareDiscount') {
                            promoId = obj.rewardTypeValue;
                        }
                    });
                    //促销审核请求
                    ajax({
                        api_name: 'approveUnitPromotionWrite',
                        data: {
                            promoId: promoId
                        }
                    }, result => {
                        vm.$refs.discountTip.show("close", {
                            title: '促销审核',
                            content: '已审核，请致<a href="https://prom.shop.jd.com/promotion/info/info_queryPromotions.action" target="_blank">商家后台-促销列表</a>查看对应商品促销是否已生效。',
                            okVal: '确定'
                        });
                    }, error => {
                        vm.$message.success('促销已审核！');
                    });
                }else {
                    vm.$message.success('促销已审核！');
                }
            }, error => {
                vm.$message.success('促销已审核！');
            });
        },
        getActivityList(page){
            this.queryData.pageNo = page || this.queryData.pageNo;
            this.listLoading = true;
            let queryData = clone(this.queryData);
            queryData.startTime = queryData.startTime ? (dateFormat(queryData.startTime,'YY-MM-DD')) + ' 00:00:00' : '';
            queryData.endTime = queryData.endTime ? (dateFormat(queryData.endTime,'YY-MM-DD')) + ' 23:59:59' : '';
            if(this.actType == 'welfare') {
                queryData.searchFlag = 1;
            };
            ajax({
                api_name: 'signActivityList',
                data: queryData,
                vm: this
            }, result => {
                this.tableData = result.data.list;
                // this.tableData = [];
                this.total = result.data.total;
                // this.total = 0;
                this.listLoading = false;
            });
        },
        deleterow(item) {
            this.$confirm(item.status == 'wait' ? '确定删除该活动吗？' : '删除活动后将无法查看活动数据', '删除提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                this.listLoading = true;
                ajax({
                    api_name: 'deleteActivity',
                    data: {
                        id: item.id
                    },
                    vm: this
                }, (res) => {
                    this.getActivityList(1);
                    this.$message({
                        message: '删除成功'
                    });
                }, (error) => {
                    this.listLoading = false;
                });
            }).catch(() => {
            });
        },
        down(item) {
            this.$confirm('确定结束该活动吗？', '操作提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                this.listLoading = true;
                ajax({
                    api_name: 'onOrOff',
                    data: {
                        id: item.id,
                        type:"invalid"
                    },
                    vm: this
                }, (res) => {
                    this.getActivityList();
                    this.$message({
                        message: '活动结束成功'
                    });
                }, (error) => {
                    this.listLoading = false;
                });
            }).catch(() => {
            });
        },
        startAct(item) {
            this.$confirm('确定立即开始该活动吗？', '操作提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                this.listLoading = true;
                ajax({
                    api_name: 'onOrOff',
                    data: {
                        id: item.id,
                        type:"valid"
                    },
                    vm: this
                }, (res) => {
                    this.getActivityList();
                    this.$message({
                        message: '活动立即开始成功'
                    });
                }, (error) => {
                    this.listLoading = false;
                });
            }).catch(() => {
            });
        },
        detail(data) {
            let typeMap = {
                "sign_turntable": "1",//签到
                "dynamic_turntable": "2",//大转盘
                "dynamic_followShop": "3",//关注店铺
                "dynamic_invitationPeople": "4",//邀请关注
                "dynamic_bargain": "5",//砍价
                "collage": "6",//拼团
                "jd_complete": "7",//完善会员信息
                "newcomer_activity":"8",//新人入会礼
                "dynamic_openRedEnvelope":"9",//抢红包
                "dynamic_whackDiglett":"10",//打地鼠
                "dynamic_wareFollow":"11",//收藏加购
                "dynamic_invitationWareFollow":"12",//邀请收藏加购
            };
            let _type = typeMap[data.activityType],
                _json = JSON.stringify({
                    type: _type,
                    id: data.id,
                    startTime: data.startTime,
                    endTime: data.endTime,
                    actName: data.activityName
                });
            sessionStorage.setItem('interactionMsg',_json);
            switch (this.actType) {
                case 'welfare':
                    this.$router.push({path: '/welfareStatistics'});
                    break;

                default:
                    if(_type == '7' || _type == '8') {
                       this.$router.push({path: '/interactionPartake'});
                    }else {
                       this.$router.push({path: '/interactionStatistics'});
                    }
                    break;
            }
        },
        edit(data) {
            switch (data.activityType) {
                case 'sign_turntable':
                    this.$router.push({path: '/sign',query:{id: data.id}});
                    break;
                case 'dynamic_turntable':
                    this.$router.push({path: '/turntable',query:{id: data.id}});
                    break;
                case 'dynamic_followShop':
                    this.$router.push({path: '/followShop',query:{id: data.id}});
                    break;
                case 'dynamic_invitationPeople':
                    this.$router.push({path: '/inviting',query:{id: data.id}});
                    break;
                case 'dynamic_bargain':
                    this.$router.push({path: '/bargain',query:{id: data.id}});
                    break;
                case 'collage':
                    this.$router.push({path: '/collage',query:{id: data.id}});
                    break;
                case 'jd_complete':
                    this.$router.push({path: '/perfectMsg',query:{id: data.id}});
                    break;
                case 'newcomer_activity':
                    this.$router.push({path: '/newMembership',query:{id: data.id}});
                    break;
                case 'dynamic_whackDiglett': case 'dynamic_openRedEnvelope':
                    this.$router.push({path:'/h5Game',query:{id:data.id}});
                    break;
                case 'dynamic_wareFollow':
                    this.$router.push({path:'/purchase',query:{id:data.id}});
                    break;
                case 'dynamic_invitationWareFollow':
                   this.$router.push({path:'/invitePurchase',query:{id:data.id}});
                    break;
                default:
                    break;
            }
        },
        preview(data) {
            this.$refs.qrDetail.showMsg(data,'interaction');
        },
        descOrder(a, b){
            return new Date(b.startTime.replace(/\-/g, '/')).getTime() - new Date(a.startTime.replace(/\-/g, '/')).getTime();
        },
        ascOrder(a, b){
            return new Date(a.startTime.replace(/\-/g, '/')).getTime() - new Date(b.startTime.replace(/\-/g, '/')).getTime();
        },
        checkSortList(dataList){
            let metaData = clone(this.allActivityList).reduce((a, b) => {
                return a.concat([b.id])
            }, []);
            dataList = dataList.reduce((a, b) => {
                return a.concat([b.id])
            }, []);
            metaData = metaData.join(',');
            dataList = dataList.join(',');
            // 如果一致就不上传了
            if(metaData == dataList){
                this.$message({
                    message: '排序成功',
                    type: 'success'
                });
                return;
            }
            ajax({
                api_name: 'saveActivityOrderList',
                data: {
                    afterId: dataList,
                    beforeId: metaData
                },
                vm: this
            }, result => {
                this.$message({
                    message: '排序成功',
                    type: 'success'
                });
            });
        },
        getAllActivityList(){
            ajax({
                api_name: 'signActivityList',
                data: {
                    isMobile: 1,
                    pageSize: 1000
                },
                vm: this
            }, result => {
                this.allActivityList = result.data.list;
            });
        },
        canPreview(activityType) {
          return this.$store.state.user.inBrand ? true : (activityType != 'dynamic_followShop' && activityType != 'newcomer_activity');
        }
    },
    components: {
        interactionTop,
        qrDialog,
        welfareTop,
        discountTipDialog,
        listSort
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
            margin-top: 10px;
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
