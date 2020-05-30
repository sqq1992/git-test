<template>
	<div class="m-content inputSet" v-loading="loadingPage">
		<!-- <div class="m-content-main main_height inputSet"> -->
			<div class="clearfix m_b20">
				<div class="f-fl headLeft hidden">
					<div class="row_line inline_block">
						<span class="row-item__inline">会员账号：</span>
						<el-input @keyup.native.enter="memberList(true)" v-model.trim="userName" class="userName"></el-input>
					</div>
					<div class="row_line inline_block">
						<span class="row-item__inline">会员昵称：</span>
						<el-input @keyup.native.enter="memberList(true)" v-model.trim="userNick" class="userName"></el-input>
					</div>
					<div class="row_line inline_block">
						<span class="row-item__inline">会员手机号：</span>
						<el-input @keyup.native.enter="memberList(true)" v-model.trim="userPhone" class="userName"></el-input>
					</div>
					<div class="row_line inline_block">
						<span class="row-item__inline">激活状态：</span>
						<el-select @change="memberList(true)" class="userName" v-model="jiStatus" placeholder="">
						    <el-option
						      v-for="item in options"
						      :key="item.value"
						      :label="item.label"
						      :value="item.value">
						    </el-option>
					  	</el-select>
					</div>
					<div class="row_line inline_block m_t20">
						<span class="row-item__inline">会员职业：</span>
						<el-select class="userName" v-model="profession" placeholder="">
							<el-option :value="''" label="不限"></el-option>
							<el-option :value="'学生'" label="学生"></el-option>
							<el-option :value="'白领'" label="白领"></el-option>
							<el-option :value="'教师'" label="教师"></el-option>
							<el-option :value="'军人'" label="军人"></el-option>
							<el-option :value="'警察'" label="警察"></el-option>
							<el-option :value="'记者'" label="记者"></el-option>
							<el-option :value="'医生'" label="医生"></el-option>
							<el-option :value="'其他'" label="其他"></el-option>
						</el-select>
					</div>

          <!-- <div class="row_line inline_block m_t20">
            <span class="row-item__inline">最近营销时间：</span>
            <el-date-picker
              :editable="false"
              :picker-options="pickerLeft"
              class="dateWidth"
              v-model="leftLastMarketingDate"
              type="date"
              placeholder="">
            </el-date-picker>
            <span>-</span>
            <el-date-picker
              :editable="false"
              :picker-options="pickerRight"
              class="dateWidth"
              v-model="rightLastMarketingDate"
              type="date"
              placeholder="">
            </el-date-picker>
          </div> -->

					<div class="row_line inline_block m_t20">
						<span class="row-item__inline">会员生日：</span>
						<el-select @change="birthdayChange" class="date" v-model="birthdayMonthOne" placeholder="">
							<el-option :value="''" label="不限"></el-option>
							<el-option v-for="m in month" :value="m" :label="m+'月'"></el-option>
						</el-select>
						<span>-</span>
						<el-select @change="birthdayChange" :disabled="!checkMonth1" class="date" v-model="birthdayDayOne" placeholder="">
							<el-option v-for="m in day" :value="m" :label="m+'日'"></el-option>
						</el-select>
						<span>至</span>
						<el-select @change="birthdayChange" class="date" v-model="birthdayMonthTwo" placeholder="">
							<el-option :value="''" label="不限"></el-option>
							<el-option v-for="m in month2" :value="m" :label="m+'月'"></el-option>
						</el-select>
						<span>-</span>
						<el-select @change="birthdayChange" :disabled="!checkMonth2" class="date" v-model="birthdayDayTwo" placeholder="">
							<el-option v-for="m in day2" :value="m" :label="m+'日'"></el-option>
						</el-select>
					</div>



				</div>
				<div class="f-fl hidden">
					<el-button type='primary' size='small' @click="memberList(true)">查 询</el-button>
				</div>
			</div>
			<unDealVipTable :tableData="tableData"></unDealVipTable>
			<div class="text-right" v-if="pageInfo.total">
		  		<el-pagination
	  				:current-page="pageInfo.pageNo"
		  			@current-change="handleCurrentChange"
			  		:page-size="pageInfo.pageSize"
				    layout="total, prev, pager, next"
				    :total="pageInfo.total">
			  	</el-pagination>
		  	</div>
		<!-- </div> -->
	</div>
</template>

<script>
import http from './../../../api/index.js';
import unDealVipTable from './unDealVipTable';
import {formatDate} from 'src/common/utils';
	export default{
		data() {
			return {
				loadingPage: false,
				dialogVisible: false,
				userName: '',
				userNick: '',
				userPhone: '',
				profession: '',
				month: 12,
				day: 31,
				month2: 12,
				day2: 31,
				birthdayMonthOne: '',
				birthdayDayOne: '',
				birthdayMonthTwo: '',
				birthdayDayTwo: '',
        leftLastMarketingDate: '',
        rightLastMarketingDate: '',
				checkMonth1: false,
				checkMonth2: false,
				options: [{
					label: '不限',
					value: ''
				},{
					label: '已激活',
					value: 1
				},{
					label: '未激活',
					value: 0
				}],
				pageInfo: {
					pageNo: 1,
					pageSize: 10,
					total: 0
				},
				jiStatus: '',
				tableData: [],

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
			}
		},
		created() {
			this.memberList(true);
		},
		methods: {
		    //生日选择
			birthdayChange: function() {
				let vm = this;
				if(vm.birthdayMonthOne) {
					vm.checkMonth1 = true;
					vm.birthdayDayOne = vm.birthdayDayOne || 1;
					vm.month2 = [];
					for(let num = vm.birthdayMonthOne; num < 13; num ++) {
                       vm.month2.push(num);
					};
					let odd = [1,3,5,7,8,10,12],
						even = [4,6,9,11];
					switch (true) {
						case odd.indexOf(vm.birthdayMonthOne) != -1:
							vm.day = 31;
							break;
						case even.indexOf(vm.birthdayMonthOne) != -1:
							vm.day = 30;
							break;
						case vm.birthdayMonthOne == 2:
						    vm.day = 29;
						    break;
						default:
							break;
					}
				}else {
					vm.checkMonth1 = false;
					vm.birthdayDayOne = '';
					vm.month2 = 12;
				}
				if(vm.birthdayMonthTwo) {
					vm.checkMonth2 = true;
					vm.birthdayDayTwo = vm.birthdayDayTwo || 1;
					vm.month = [];
					for(let num = 1; num < vm.birthdayMonthTwo + 1; num ++) {
                       vm.month.push(num);
					};
					let odd = [1,3,5,7,8,10,12],
						even = [4,6,9,11];
					switch (true) {
						case odd.indexOf(vm.birthdayMonthTwo) != -1:
							vm.day2 = 31;
							break;
						case even.indexOf(vm.birthdayMonthTwo) != -1:
							vm.day2 = 30;
							break;
						case vm.birthdayMonthTwo == 2:
						    vm.day2 = 29;
						    break;
						default:
							break;
					}
				}else {
					vm.checkMonth2 = false;
					vm.birthdayDayTwo = '';
					vm.month = 12;
				}
			},
			getNumber(num) {
               if(num < 10) {
				   num = '0'+num;
			   };
			   return num;
			},
			memberList(init) {
				this.loadingPage = true;
				if(init) {
					this.pageInfo.pageNo = 1;
				};
				http({
					api_name: 'memberList',
					vm: this,
					data: {
						activationState: this.jiStatus,
						customerType: 1,
						mobile: this.userPhone,
						pin: this.userName,
						userNick: this.userNick,
						profession: this.profession,
						birthdayLess: this.birthdayMonthOne ? this.getNumber(this.birthdayMonthOne) + '-' + this.getNumber(this.birthdayDayOne) : '',
						birthdayGreat: this.birthdayMonthTwo ? this.getNumber(this.birthdayMonthTwo) + '-' + this.getNumber(this.birthdayDayTwo) : '',
						pageNo: this.pageInfo.pageNo,
						pageSize: this.pageInfo.pageSize,
            leftLastMarketingDate: formatDate('yyyy-MM-dd 00:00:00',this.leftLastMarketingDate),
            rightLastMarketingDate: formatDate('yyyy-MM-dd 23:59:59',this.rightLastMarketingDate),
            isMember:true
					}
				}, (res) => {
					this.loadingPage = false;
					this.tableData = res.data ? (res.data.crmCustomerList ? res.data.crmCustomerList : []) : [];
					this.pageInfo.total = res.data ? (res.data.total ? res.data.total : (res.data.crmCustomerList ? res.data.crmCustomerList.length : 0)) : 0;
				}, (error) => {
					this.loadingPage = false;
				});
			},
			handleCurrentChange(e) {
				this.pageInfo.pageNo = Number(e);
				this.memberList();
			}
		},
		components: {
			unDealVipTable
		}
	}
</script>

<style lang="less" scoped>
	.headLeft{
		width: 900px;
		.row_line{
			.row_name{
				width: 70px;
				height: 28px;
				line-height: 28px;
				text-align: right;
			}
			.phone_name{
				width: 85px;
			}
			.date {
				width: 80px;
			}
			.userName{
				width: 125px;
			}
			.moneyOne{
				width: 68.5px;
			}
			.dateWidth{
				width: 115px;
			}

      .row-item__inline {
        width: 8em;
        text-align: right;
        height: 28px;
        line-height: 28px;
        display: inline-block;
      }
		}
	}
	.hidden{
		button{
			width: 70px;
		}
	}
</style>
