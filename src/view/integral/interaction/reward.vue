<template>
	<div>
		<welfare-top v-if="actType == 'welfare'"></welfare-top>
        <interaction-top v-else></interaction-top>
		<div class="list fontClass" v-loading="listLoading" :element-loading-text="loadingText">
			<div>
				<span class="ui-filter-item-group">
                    <span class="ui-filter-hd">活动名称：</span>
                    <span>{{interactionMsg.actName}}</span>
                </span>
				<span class="ui-filter-item-group">
                    <span class="ui-filter-hd w100">活动起止时间：</span>
                    <span>{{interactionMsg.startTime}} 至 {{interactionMsg.type == '7'&& interactionMsg.endTime == '2037-12-31 23:59:59' ? '永久' : interactionMsg.endTime}}</span>
                </span>
			</div>
			<div>
				<span class="ui-filter-item-group">
                    <span class="ui-filter-hd">会员账号：</span>
                    <el-input v-model="queryData.userNick" style="width: auto;"></el-input>
                </span>
				<span class="ui-filter-item-group" v-if="interactionMsg.type == '7'">
                    <span class="ui-filter-hd">奖品类型：</span>
                    <el-select v-model="queryData.awardType" class="ui-filter-pd">
                        <el-option :value="''" label="不限"></el-option>
                        <el-option :value="'jd_complete_coupon&1'" label="店铺优惠券"></el-option>
                        <el-option :value="'jd_complete_coupon&2'" label="商品优惠券"></el-option>
                        <el-option :value="'point'" label="积分"></el-option>
                    </el-select>
                </span>
                <span class="ui-filter-item-group" v-else>
                    <span class="ui-filter-hd">奖品类型：</span>
                    <el-select v-model="queryData.awardType" class="ui-filter-pd">
                        <el-option :value="''" label="不限"></el-option>
                        <el-option :value="'dynamic_coupon&1'" label="店铺优惠券"></el-option>
                        <el-option :value="'dynamic_coupon&2'" label="商品优惠券"></el-option>
                        <el-option :value="'dynamic_wareDiscount'" label="商品折扣"></el-option>
                        <el-option v-if="interactionMsg.type == '2'" :value="'dynamic_commodity'" label="实物奖品"></el-option>
                        <el-option :value="'point'" label="积分"></el-option>
                    </el-select>
                </span>
				<span class="ui-filter-item-group">
                    <span class="ui-filter-hd">发放结果：</span>
                    <el-select v-model="queryData.givestatus" class="ui-filter-pd">
                        <el-option :value="''" label="不限"></el-option>
                        <el-option :value="'1'" label="发放成功"></el-option>
						<el-option :value="'-2'" label="发放失败"></el-option>
                    </el-select>
                </span>
				<span class="ui-filter-item-group">
                    <span class="ui-filter-hd">发放时间：</span>
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
                  <el-button size='small' @click="getPartakeList(1)" class="queryBtn">查询</el-button>
                  <el-button size="small" type="primary" class="queryBtn" @click="exportReward()">导出记录</el-button>
                </span>

			</div>
            <div class='mt_10' v-if="interactionMsg.type == '2'">
                 <a :href="'/gift/exportCommodityGiftList?giveStatus=0&activityId='+queryData.id" class="primary_btn" target="_blank">导出未发放实物奖品</a>
                 <el-upload
                    action="/gift/importCommodityGiftList"
                    :on-success="handleFileSuccess"
                    :before-upload="beforeFileUpload"
                    :showFileList=false
                    :on-error="handleFileError"
                    style="display: inline-block;margin-left: 20px;">
                    <el-button type="primary">批量发放实物奖品</el-button>
                </el-upload>
            </div>
			<div class="list_table">
                <el-table
                    :data="tableData"
                    :border="false"
                    style="width: 100%">
                    <el-table-column label="会员账号" min-width="13%" align="left">
                        <template scope="scope">
                            <el-row>
                                <el-col>
                                    <span v-if="scope.row.pin">{{scope.row.pin}}</span>
                                    <el-tooltip
                                      :content="scope.row.customerPin"
                                      popper-class="my_poper"
                                      placement="top"
                                     v-else-if="scope.row.customerPin"
                                    >
                                      <span class="clamp_two_row">
                                        <span class="mi_icon">密</span>
                                        {{scope.row.customerPin}}
                                      </span>
                                    </el-tooltip>
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column label="会员昵称" min-width="13%" align="left">
                        <template scope="scope">
                            <el-row>
                                <el-col>
                                    {{scope.row.userNick}}
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column> -->
                    <el-table-column label="奖品名称" min-width="13%" prop="awardName" align="left" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="面值" align="left" min-width="13%">
                        <template scope="scope">
                            <el-row>
                                <el-col>
                                    <span v-if="scope.row.faceType == '2'">{{scope.row.point}}</span>
                                    <span v-else>{{scope.row.faceValue | numFormat(2)}}</span>
                                    <span>{{scope.row.faceType == '1' || !scope.row.faceType ? '元': scope.row.faceType == '2' ? '积分' :'折'}}</span>
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column label="奖品类型" align="left" min-width="13%">
                        <template scope="scope">
                            <el-row>
                                <el-col>
                                    <span v-if="scope.row.awardType == 'dynamic_coupon' || scope.row.awardType == 'jd_complete_coupon'">{{scope.row.bindType =="1" ? '店铺':'商品'}}</span><span>{{awardMap[scope.row.awardType]}}</span>
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column label="发放结果" align="left" min-width="13%">
                        <template scope="scope">
                            <el-row>
                                <el-col v-if="interactionMsg.type == '2' && scope.row.awardType == 'dynamic_commodity'">
                                    <el-button type="text" @click="sendGift(scope.row, 'detail')" v-if="scope.row.trackingNo">发放成功</el-button>
                                    <el-button type="text" @click="sendGift(scope.row, 'send')" v-if="!scope.row.trackingNo">未发放</el-button>
                                </el-col>
                                <el-col v-else>
                                    {{scope.row.giveStatus}}
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column label="发放时间" align="left" min-width="20%">
                        <template scope="scope">
                            <el-row>
                                <el-col v-if="interactionMsg.type == '2'  && scope.row.awardType == 'dynamic_commodity'">
                                    <span v-if="scope.row.trackingNo">{{scope.row.givetTime}}</span>
                                </el-col>
                                <el-col v-else>
                                    <span>{{scope.row.givetTime}}</span>
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="table_footer"  v-if="total">
                    <el-pagination
                        layout="prev, pager, next"
                        :current-page="queryData.pageNo"
                        :page-size="queryData.pageSize"
                        @current-change="getPartakeList"
                        :total="total">
                    </el-pagination>
                </div>
            </div>
	    </div>
        <send-dialog ref="sendDetail" @getList="getPartakeList" :data="sendMsg"></send-dialog>
	</div>
</template>

<script>
import interactionTop from 'src/components/integral-interaction/interaction-statistics-top';
import welfareTop from 'src/components/integral-interaction/welfare-statistics-top';
import ajax from 'src/api/index.js';
import sendDialog from '../shop/sendDetail.vue';
import { clone } from 'src/common/public.js';
import dateFormat from '../../../common/dateFormat.js';
	export default{
        props: {
			actType: {
				type: String,
				default: 'interaction'
			}
		},
		data() {
			return{
				tableData: [],
                listLoading: false,
                interactionMsg: {},
                loadingText: '',
				queryData: {
					pageNo: 1,
					pageSize: 20,
					startTime: '',
					endTime: '',
					userNick: '',
                    givestatus: '',
                    awardType: '',
                    bindType: '',
                    id: ''
                },
                sendMsg: {
                    type: 'detail'
                },
                awardMap: {
                    'dynamic_coupon': '优惠券',
                    'commodity':'实物',
                    'dynamic_wareDiscount': '商品折扣',
                    'dynamic_commodity': '实物奖品',
                    'jd_complete_coupon': '优惠券',
                    'dynamic_point':'积分',
                    'jd_complete_point':'积分',
                    'newcomer_activity_coupon':'优惠券'
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
            let json = JSON.parse(sessionStorage.getItem('interactionMsg'));
            this.$set(this,'interactionMsg',json);
            this.queryData.id = json.id;
            //邀请关注加个活动类型字段
            if(json.type == 4) {
                this.queryData.activityType = 'dynamic_invitationPeople';
            };
           this.getPartakeList(1);
		},
		components: {
            interactionTop,
            welfareTop,
            sendDialog
		},
		methods: {
            exportReward() {
              let queryData = clone(this.queryData);
              queryData.startTime = queryData.startTime ? (dateFormat(queryData.startTime,'YY-MM-DD HH:MM:SS')) : '';
              queryData.endTime = queryData.endTime ? (dateFormat(queryData.endTime,'YY-MM-DD')) + ' 23:59:59' : '';
              queryData.pin = queryData.userNick;
              delete queryData.pageNo;
              delete queryData.pageSize;
              delete queryData.userNick;
              let params = '',currentData;
              for(let key in queryData) {
                currentData = queryData[key];
                if(currentData) {
                  params += `${key}=${currentData}&`
                }
              }
              window.open(`http://${location.hostname}/gift/exportCommodityGiftList?${params}`);
            },
            beforeFileUpload(file){
                let reg = /^.*\.(?:xls|xlsx)$/i;//文件名可以带空格
                if (!reg.test(file.name)) {//校验不通过
                    this.$message.error('请上传excel格式的文件!');
                    return false;
                }
                this.listLoading = true;
                this.loadingText = '文件上传中...';
                return true;
            },
            handleFileSuccess(file){
                this.listLoading = false;
                this.loadingText = '';
                if(file.result != 100){
                    this.$message.error(file.message);
                    return;
                }
                this.getPartakeList(1);
            },
            handleFileError(){
                this.listLoading = false;
                this.loadingText = '';
                this.$message.error('当前网络发生错误，请重新上传');
            },
			getPartakeList(page) {
				this.queryData.pageNo = page || this.queryData.pageNo;
				this.listLoading = true;
				let queryData = clone(this.queryData);
				queryData.startTime = queryData.startTime ? (dateFormat(queryData.startTime,'YY-MM-DD HH:MM:SS')) : '';
				queryData.endTime = queryData.endTime ? (dateFormat(queryData.endTime,'YY-MM-DD')+' 23:59:59') : '';
                //区分店铺商品优惠券
                queryData.bindType = queryData.awardType.split('&')[1];
                queryData.awardType = queryData.awardType.split('&')[0];
				ajax({
					api_name: 'awardRecord',
					data: queryData,
					vm: this
				}, result => {
					this.tableData = result.data.list;
					this.total = result.data.total;
					this.listLoading = false;
				});
            },
            sendGift(item,type) {
                this.sendMsg.type = type;
                ajax({
                    api_name: 'giveGiftInfo',
                    data: {
                        id: item.id,
                        nick: item.pin
                    },
                    vm: this
                }, result => {
                    this.$refs.sendDetail.showMsg(result,item.id,'dynamic_commodity');
                });
            },
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
    }
    .mt_10 {
        margin-top: 10px;
    }
    .primary_btn{
            display: inline-block;
            line-height: 1;
            white-space: nowrap;
            cursor: pointer;
            background: #fff;
            border: 1px solid #c4c4c4;
            color: #1f2d3d;
            margin: 0;
            padding: 10px 15px;
            border-radius: 4px;
            color: #fff;
            background-color: #20a0ff;
            border-color: #20a0ff;
            &:hover,&:focus{
                background: #4db3ff;
                border-color: #4db3ff;
                color: #fff;
            }
        }
</style>
