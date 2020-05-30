<template>
	<div id="integralTwo" v-loading="loadingPage">
		<div class="row_line m_b20">
			<span class="nameSpan">会员账号：</span>
			<el-input @keyup.native.enter="searchBut" class="row_user" v-model.trim="user"></el-input>
			<span class="row_name">当前积分值：</span>
			<el-input class="row_integral" @blur="blurInp('intOne', 'intTwo')" v-model.trim="intOne"></el-input>
			<span> - </span>
			<el-input class="row_integral" @blur="blurInp('intTwo', 'intOne')" v-model.trim="intTwo"></el-input>
			<span class="row_name">激活状态：</span>
			<el-select @change="changeVal" v-model="value" class="row_state" placeholder="请选择">
			    <el-option
			      v-for="item in options"
			      :key="item.value"
			      :label="item.label"
			      :value="item.value">
			    </el-option>
		  	</el-select>
		</div>
		<div class="row_line clearfix m_b20 selectTime">
			<span class="f-fl nameSpan">会员激活时间：</span>
			<el-date-picker
				:editable="false"
				:picker-options="pickerLeft"
				class="row_date f-fl"
		      	v-model="dateOne"
	      		type="date"
		      	placeholder="选择日期">
		    </el-date-picker>
		    <span class="f-fl"> - </span>
		    <el-date-picker
		    	:editable="false"
		    	:picker-options="pickerRight"
		    	class="row_date f-fl"
		      	v-model="dateTwo"
		      	type="date"
		      	placeholder="选择日期">
		    </el-date-picker>
		    <el-button @click="searchBut" class="m_l20 f-fl selectBut" type="primary" size="small">查询</el-button>
        <el-button @click="exportPoint" class="m_l20 f-fl selectBut" size="small">积分导出</el-button>
		</div>
		<integralTable @changeinte="changeinte" :tableData="tableData"></integralTable>
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
</template>

<script>
import dateFormat from './../../common/dateFormat.js';
import http from './../../api/index.js';
import integralTable from './integralTable';
import {point} from 'src/common/point.js';
	export default{
		data() {
			return{
				intOne: '',
				intTwo: '',
				user: '',
				options: [{
					label: '不限',
					value: ''
				}, {
					label: '已激活',
					value: 1
				}, {
					label: '未激活',
					value: 0
				}],
				value: '',
				dateOne: '',
				dateTwo: '',
				tableData: [],
				pageInfo: {
					pageNo: 1,
					pageSize: 10,
					total: 0
				},
				loadingPage: false,
				pickerLeft: {
		          	disabledDate(time) {
		            	return time.getTime() > Date.now();
		          	}
		        },
		        pickerRight: {
		          	disabledDate(time) {
		            	return time.getTime() > Date.now();
		          	}
		        }
			}
		},
		components: {
			integralTable
		},
		created() {
      point('37977.39407.39464');
			this.init();
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
			}
		},
		methods: {
			changeinte() {
				this.init();
			},
			init(init) {
				if(init) {
					this.pageInfo.pageNo = 1;
				}
				this.loadingPage = true;
				let start = this.dateOne ? (dateFormat(this.dateOne,'YY-MM-DD') + ' 00:00:00') : '';
				let end = this.dateTwo ? (dateFormat(this.dateTwo,'YY-MM-DD') + ' 23:59:59') : '';
				http({
					api_name: 'memberScoreList',
					vm: this,
					data: {
						activationEndTime: end,
						activationStartTime: start,
						activationState: this.value,
						customerLeftPoints: this.intOne,
						customerRightPoints: this.intTwo,
						pageNo: this.pageInfo.pageNo,
						pageSize: this.pageInfo.pageSize,
						pin: this.user
					}
				}, (res) => {
					this.loadingPage = false;
					this.tableData = res.data ? (res.data.crmCustomerList ? res.data.crmCustomerList : []) : [];
					this.pageInfo.total = res.data ? (res.data.total ? res.data.total : res.data.crmCustomerList.length) : 0;
				}, (error) => {
					this.tableData = [];
					this.pageInfo.total = 0;
					this.loadingPage = false;
				});
			},
			handleCurrentChange(e) {		//翻页
				this.pageInfo.pageNo = Number(e);
				this.init();
			},
			searchBut() {					//查询按钮点击
				this.init(true);
			},
			changeVal() {					//激活状态改变
				this.init(true);
			},
			blurInp(item, other) {
				if(this[item]) {
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
					if(isNaN(Number(this[item]))) {
						this.$message.error('积分值必须为数字！');
						this[item] = '';
						return
					} else {
						if(this[other] && (Number(this.intTwo) < Number(this.intOne))) {
							let message = other == 'intTwo' ? '左侧积分值必须小于等于右侧积分值！' : '右侧积分值必须大于等于左侧积分值！';
							this.$message.error(message);
							this[item] = '';
							return
						}
					}
				}
      },
      exportPoint() {
        let start = this.dateOne ? (dateFormat(this.dateOne,'YY-MM-DD') + ' 00:00:00') : '';
				let end = this.dateTwo ? (dateFormat(this.dateTwo,'YY-MM-DD') + ' 23:59:59') : '';
        let currentData,params = '';
        var paramsData = {
          activationEndTime: end,
          activationStartTime: start,
          activationState: this.value,
          customerLeftPoints: this.intOne,
          customerRightPoints: this.intTwo,
          // pageNo: this.pageInfo.pageNo,
          // pageSize: this.pageInfo.pageSize,
          pin: this.user
        }
        for(let key in paramsData) {
          currentData = paramsData[key];
          if(currentData) {
            params += `${key}=${currentData}&`
          }
        }
        window.open(`http://${location.hostname}/member/exportWithPoint?${params}`);
      }
		}
	}
</script>

<style lang="less" scoped>
	#integralTwo{
		color: #333;
	}
	.row_line{
		height: 38px;
		line-height: 36px;
		overflow: hidden;
	}
	.selectTime{
		height: 30px;
		line-height: 28px;
	}
	.selectBut{
		// margin-top: 1px;
		font-size: 14px;
	}
	.row_user{
		width: 160px;
	}
	.row_integral{
		width: 74px;
	}
	.row_state{
		width: 130px;
	}
	.row_name{
		margin-left: 105px;
	}
	.row_date{
		width: 130px;
	}
	.nameSpan{
		display: inline-block;
		width: 100px;
		text-align: right;
	}
</style>
