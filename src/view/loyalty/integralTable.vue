<template>
	<div id="memberTable" class="integralTable fontClass">
		<div class="flexDiv">
			<div class="flexchild one">会员账号</div>
			<div class="flexchild addone">会员名称</div>
			<div class="flexchild two">会员等级</div>
			<div class="flexchild thr">当前积分</div>
			<div class="flexchild four">会员激活状态
			    <el-tooltip placement="top">
				  	<div slot="content">会员首次进入会员中心<br/>页面时自动激活</div>
				  	<i class="el-icon-information cursor"></i>
				</el-tooltip>
			</div>
			<div class="flexchild five">激活时间</div>
			<div class="flexchild six">操作</div>
		</div>
		<el-table
			:show-header="false"
	    	:data="tableData"
	    	:border="false"
	    	style="width: 100%">
		    <el-table-column label="会员账号" min-width="160" align="left">
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
		    <el-table-column label="会员名称" min-width="130" align="left">
		        <template scope="scope">
		            <el-row>
		                <el-col>
							{{scope.row.userNick}}
		                </el-col>
		            </el-row>
		        </template>
		    </el-table-column>
		    <el-table-column label="会员等级" min-width="100" align="left">
		        <template scope="scope">
		            <el-row>
		                <el-col>
							{{(scope.row.gradeRuleType == 1) ? scope.row.gradeName : '--'}}
		                </el-col>
		            </el-row>
		        </template>
		    </el-table-column>
		    <el-table-column label="当前积分" min-width="100" align="left">
		        <template scope="scope">
		            <el-row>
		                <el-col>
		                	{{(scope.row.pointsRuleType == 1) ? scope.row.customerPoints : '--' | numFormat}}
		                </el-col>
		            </el-row>
		        </template>
		    </el-table-column>
		    <el-table-column label="会员激活状态" align="left" min-width="160">
		        <template scope="scope">
		            <el-row>
		                <el-col>
		                <span class="initSpan" :class="{'arealdySpan': scope.row.activationState}">{{scope.row.activationState ? '已激活' : '未激活'}}</span>
		                </el-col>
		            </el-row>
		        </template>
		    </el-table-column>
		    <el-table-column label="激活时间" align="left" min-width="180">
		        <template scope="scope">
		            <el-row>
		                <el-col>
		                	{{scope.row.activationTime}}
		                </el-col>
		            </el-row>
		        </template>
		    </el-table-column>
		    <el-table-column label="操作" align="left" min-width="180">
		        <template scope="scope">
		            <el-row>
		                <el-col>
		                	<el-button v-if="scope.row.pointsRuleType" type="text" @click="lookDetail(scope.row, '积分明细')">积分明细</el-button>
		                	<el-button v-if="scope.row.pointsRuleType" type="text" @click="lookDetail(scope.row, '变更积分')">变更积分</el-button>
		                </el-col>
		            </el-row>
		        </template>
		    </el-table-column>
	  	</el-table>

	  	<el-dialog
		  	:title="title"
		  	:close-on-click-modal="false"
		  	:close-on-press-escape="false"
		  	:visible.sync="dialogVisible">
		  	<div v-loading="loadingDia" class="fontClass">
		  		<div class="row_line clearfix m_b10">
			  		<span :title="memberName">会员账号：{{memberName.slice(0,15) + (memberName.length > 15 ? '...': '')}}</span>
			  		<span class="m_l20">当前积分：{{memberIntegral}}</span>
			  	</div>
			  	<div v-if="title == '积分明细'">
			  		<div class="row_line clearfix m_b20 selectTime">
						<span class="f-fl">会员激活时间：</span>
						<el-date-picker
							:editable="false"
							:picker-options="pickerLeft"
							class="row_date f-fl"
					      	v-model="dateOne"
				      		type="date"
					      	placeholder="选择日期">
					    </el-date-picker>
					    <span class="f-fl">-</span>
					    <el-date-picker
					    	:editable="false"
					    	:picker-options="pickerRight"
					    	class="row_date f-fl"
					      	v-model="dateTwo"
					      	type="date"
					      	placeholder="选择日期">
					    </el-date-picker>
					    <el-button @click="selectBut" class="m_l20 f-fl selectBut" type="primary" size="small">查询</el-button>
					</div>
				  	<el-table
				    	:data="diaData"
				    	:border="false"
				    	style="width: 100%">
					    <el-table-column label="时间" min-width="" align="left">
					        <template scope="scope">
					            <el-row>
					                <el-col>
					                	{{scope.row.occurTime}}
					                </el-col>
					            </el-row>
					        </template>
					    </el-table-column>
					    <el-table-column label="积分值" align="left" min-width="">
					        <template scope="scope">
					            <el-row>
					                <el-col>
					                	{{scope.row.points}}
					                </el-col>
					            </el-row>
					        </template>
					    </el-table-column>
					    <el-table-column label="备注" align="left" min-width="">
					        <template scope="scope">
					            <el-row>
					                <el-col>
					                	<div v-if="scope.row.msg && scope.row.msg.length > 10">
					                		<el-tooltip class="item" effect="dark" :content="scope.row.msg" placement="top">
										      	<span>{{scope.row.msg.slice(0, 10)}}</span>
										    </el-tooltip>
					                	</div>
					                	<span v-else>{{scope.row.msg}}</span>
					                </el-col>
					            </el-row>
					        </template>
					    </el-table-column>
				  	</el-table>
				  	<div class="text-right m_t10">
						<el-button @click="handleCurrentChange(false)" :disabled="pageInfo.pageNo == 1" size="small">上一页</el-button>
						<el-button @click="handleCurrentChange(true)" :disabled="!hasNext" size="small">下一页</el-button>
				  	</div>
			  	</div>
			  	<div v-else class="levelName">
			  		<el-form label-position="right" label-width="85px">
					  	<el-form-item label="变更操作：">
						    <el-select v-model="changeVal" placeholder="请选择">
							    <el-option
							      v-for="item in changeOption"
							      :key="item.value"
							      :label="item.label"
							      :value="item.value">
							    </el-option>
						  	</el-select>
					  	</el-form-item>
					  	<el-form-item label="积分值：">
					    	<el-input v-model.trim="region" @blur="blurInp('region')"></el-input>
					    	<div class="red font12" v-if="nullName">
								积分值不能为空
							</div>
					  	</el-form-item>
					</el-form>

					<div class="text-center m_t10">
						<el-button size="small" type="primary" @click="changeinte">确定</el-button>
						<el-button size="small" @click="dialogVisible = false">取消</el-button>
				  	</div>
			  	</div>
		  	</div>
		</el-dialog>
	</div>
</template>

<script>
import http from './../../api/index.js';
import dateFormat from './../../common/dateFormat.js';
	export default{
		data() {
			return {
				nullName: false,
	          	changeVal: 0,
	          	region: '',
	          	changeOption: [{
	          		label: '发放',
	          		value: 0
	          	}, {
	          		label: '扣减',
	          		value: 1
	          	}],
				hasNext: true,
				memberName: '',
				memberIntegral: '',
				dialogVisible: false,
				input: '',
				_index: -1,

				dateOne: '',
				dateTwo: '',
				diaData: [],
				pageInfo: {
					pageNo: 1,
					pageSize: 10,
					total: 0
				},
				detailItem: {},
				loadingDia: false,
				pickerLeft: {
		          	disabledDate(time) {
		            	return time.getTime() > Date.now();
		          	}
		        },
		        pickerRight: {
		          	disabledDate(time) {
		            	return time.getTime() > Date.now();
		          	}
		        },
		        pageMap: new Map(),
		        title: '积分明细'
			}
		},
		props: {
			tableData: Array
		},
		watch: {
			dateOne(val) {
				if(val) {
					this.pickerRight = {
						disabledDate(time) {
			            	return time.getTime() < val;
			          	}
					}
				} else {
					this.pickerRight = {
			          	disabledDate(time) {
			            	return time.getTime() > Date.now();
			          	}
			        }
				}
			},
			dateTwo(val) {
				if(val) {
					this.pickerLeft = {
						disabledDate(time) {
			            	return time.getTime() > val;
			          	}
					}
				} else {
					this.pickerLeft = {
			          	disabledDate(time) {
			            	return time.getTime() > Date.now();
			          	}
			        }
				}
			},
			dialogVisible(val) {
				this.nullName = false;
				this.pageInfo.pageNo = 1;
				this.pageMap.clear();
				this.pageMap.set(1, '');
			},
			region(val) {
				this.nullName = false;
			}
		},
		mounted() {
			this.pageMap.set(1, '');
		},
		methods: {
			blurInp(item) {			//失焦事件
				if(isNaN(Number(this[item])) || /\./.test(this[item]) || /\+/.test(this[item])) {
					this.$message.error('只能输入正整数！');
					this[item] = '';
					return
				}
				if(Number(this[item] < 0)) {
					this.$message.error('只能输入正整数！');
					this[item] = '';
					return
				}
			},
			changeinte() {		//变更积分
				if(!this.region) {
					this.nullName = true;
					return
				}
				if((Number(this.region) > Number(this.memberIntegral)) && (this.changeVal == 1)){
					this.$message.error('积分不足！');
					return
				}
				this.loadingDia = true;
				http({
					api_name: 'memberchangePoints',
					vm: this,
					data: {
						changePoints: this.changeVal ? (this.region * -1) : this.region,
						changeType: this.changeVal,
						customerPoints: this.memberIntegral,
						id: this.detailItem.id,
						pin: this.detailItem.pin
					}
				}, (res) => {
					this.loadingDia = false;
					this.region = '';
					this.nullName = false;
					this.dialogVisible = false;
					this.$emit('changeinte', true);
				}, (error) => {this.loadingDia = false;});
			},
			lookDetail(item, dosome) {
				this.detailItem = item;
        this.memberName = item.pin || item.customerPin;
				this.memberIntegral = item.customerPoints;
        this.title = dosome;
				this.dialogVisible = true;
				if(dosome == '积分明细') {
					this.dateOne = new Date(new Date() - 60*60*24*30 *1000);
					this.dateTwo = new Date();
					this.memberScoreDetail(true);
				} else {

				}
			},
			memberScoreDetail(init) {
				if(init) {
					this.pageInfo.pageNo = 1;
				}
				this.loadingDia = true;
				let start = this.dateOne ? (dateFormat(this.dateOne,'YYMMDD') + '000000') : '';
				let end = this.dateTwo ? (dateFormat(this.dateTwo,'YYMMDD') + '235959') : '';
				let data = {
					venderId: this.detailItem.venderId,
					customerPin: this.detailItem.customerPin,
					endTime: end,
					pageNo: this.pageInfo.pageNo,
					pageSize: this.pageInfo.pageSize,
					startTime: start,
					userId: this.detailItem.userId,
					pin: this.detailItem.pin
				}
				if(this.pageInfo.pageNo > 1) {
					data.startRowKey = this.pageMap.get(this.pageInfo.pageNo);
				}
				http({
					api_name: 'memberScoreDetail',
					vm: this,
					data: data
				}, (res) => {
					this.pageMap.set(this.pageInfo.pageNo + 1, res.data.startRowKey);
					this.hasNext = res.data ? res.data.hasNext :  true;
					this.loadingDia = false;
					this.diaData = res.data ? (res.data.crmCustomerDetailList ? res.data.crmCustomerDetailList : []) : [];
				}, (error) => {
					this.loadingDia = false;
				});
			},
			handleCurrentChange(flag) {		//翻页
				if(flag) {
					this.pageInfo.pageNo++;
				} else {
					this.pageInfo.pageNo--;
				}
				this.memberScoreDetail();
			},
			selectBut() {					//查询
				this.memberScoreDetail(true);
			}
		}
	}
</script>

<style lang="less" scoped>
	#memberTable{
		color: #333;
	}
	.row_line{
		// height: 38px;
		line-height: 36px;
		overflow: hidden;
	}
	.selectTime{
		height: 30px;
		line-height: 28px;
	}
	.selectBut{
		margin-top: 1px;
		font-size: 14px;
	}
	.row_date{
		width: 130px;
	}
	.flexDiv{
		display: -webkit-flex;
    	display: flex;
    	height: 38px;
    	background: #eef1f6;
    	border: 1px solid #dfe6ec;
    	border-bottom: none;
    	.flexchild{
			height: 38px;
			line-height: 38px;
			padding: 0 5px;
			box-sizing: border-box;
			font-size:12px;
			font-family:PingFangSC-Regular;
			color:rgba(102,102,102,1);
    	}
    	.one{
    		width: 16%;
    		padding-left: 18px;
    	}
    	.addone{
			width: 13%;
    		padding-left: 18px;
    	}
    	.two{
    		width: 10%;
    		padding-left: 18px;
    	}
    	.thr{
    		width: 10.3%;
    		padding-left: 18px;
    	}
    	.four{
    		width: 16%;
    	}
    	.five{
    		width: 17%;
    	}
    	.six{
    		width: 16%;
    		padding-left: 18px;
    	}
	}
	.inter_page{
		display: inline-block;
		width: auto;
		height: 28px;
		line-height: 28px;
		border: 1px solid #d1dbe5;
		padding: 0 5px;
		cursor: pointer;
	}
	.initSpan{
		width:54px;
		height:22px;
		background:rgba(230,230,230,1);
		border-radius: 2px ;
		display: inline-block;
		text-align: center;
		line-height: 22px;
	}
	.arealdySpan{
		background:rgba(29,193,30,1);
		color: white;
	}
	.text-center{
		button {
			width: 70px;
		}
	}
</style>
