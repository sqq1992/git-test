<template>
	<div id="peoplrDialog" v-loading="loadingPage">
		<div class="hidden m_b20 row_line priceName">
	  		<span>规则名称：</span>
	  		<el-input @blur="blurName" v-model.trim="diaInput" :maxlength="15" class="el_inp el_input" placeholder="请输入内容"></el-input>
	  		<span class="m_l20">最多15个汉字</span>
	  		<div class="red" v-if="hasName">
	  			该规则名称已存在
	  		</div>
	  		<div class="red" v-if="nullName">
	  			请设置规则名称
	  		</div>
	  	</div>
	  	<div class="hidden m_b20 row_line">
	  		<span>规则开关：</span>
	  		<el-switch
			  	v-model="switchVal"
			  	on-color="#13ce66"
			  	on-text="生效中"
			  	off-text="未生效"
			  	:width="74"
			  	off-color="#ff4949">
			</el-switch>
	  	</div>
		<div class="clearfix row_line">
			<div class="f-fl dia_left">
				<p class="m_b10">1. 选择条件</p>
				<div class="dia_style">
					<span>交易相关</span>
					<ul class="clearfix left_ul">
						<li class="f-fl m_b10 m_l10" @click="chooseItem(item)" :class="{'choose': item.check, 'last_li': (item.name == '订单实付金额（不含邮费）')}" v-for="item in diaArr">{{item.name}}</li>
					</ul>
					<span>会员相关</span>
					<ul class="clearfix left_ul">
						<li class="f-fl m_b10 m_l10" @click="chooseItem(item)" :class="{'choose': item.check}" v-for="item in memberLevel">{{item.name}}</li>
					</ul>
				</div>
			</div>
			<div class="f-fl dia_right m_l10">
				<p class="m_b10">2. 设置条件规则</p>
				<div class="dia_style" v-if="chooseArr.length">
					<div class="chooseStyle m_b10 font12" v-for="items in chooseArr">
						
						<p class="clearfix">
							<span class="f-fl">{{items.name}}</span><span class="blueColor f-fr cursor" @click="deleteItems(items)">删除</span>
						</p>
						<p class="grayColor">
							{{items.desc}}
						</p>
						<div v-if="items.name == '下单时间'">
							<div class="m_t5 m_b5">
								<el-select class="lastSelect" v-model="lastTime" placeholder="">
						      		<el-option label="指定时间" value="3"></el-option>
						      		<el-option label="每月" value="2"></el-option>
						      		<el-option label="每周" value="1"></el-option>
						    	</el-select>
						    	<div class="inline_block m_l5" v-if="lastTime == '3'">
						    		<el-date-picker
						    			:editable="false"
						    			:clearable="false"
						    		  class="datewidth"
								      v-model="dateOne"
								      type="date"
								      placeholder="选择日期">
								    </el-date-picker>
								    <span>至</span>
								    <el-date-picker
								    	:editable="false"
								    	:clearable="false"
								      class="datewidth"
								      v-model="dateTwo"
								      type="date"
								      placeholder="选择日期">
								    </el-date-picker>
						    	</div>
						    	<div class="inline_block m_l5" v-else-if="lastTime == '2'">
						    		<el-select class="dayWidthSel" v-model="monthOne" placeholder="">
							      		<el-option :label="(item > 9 ? item : ('0' + item))" :value="item" v-for="item in 30"></el-option>
							    	</el-select>
							    	<span>至</span>
							    	<el-select class="dayWidthSel" v-model="monthTwo" placeholder="">
							      		<el-option :label="(item > 9 ? item : ('0' + item))" :value="item" v-for="item in 30"></el-option>
							    	</el-select>
							    	<span>日</span>
						    	</div>
						    	<div class="inline_block m_l5" v-else-if="lastTime == '1'">
						    		<el-select class="dayWidthSel" v-model="weekOne" placeholder="">
							      		<el-option :label="item" :value="(index + 1)" v-for="(item,index) in weekArr"></el-option>
							    	</el-select>
							    	<span>至</span>
							    	<el-select class="dayWidthSel" v-model="weekTwo" placeholder="">
							      		<el-option :label="item" :value="(index + 1)" v-for="(item,index) in weekArr"></el-option>
							    	</el-select>
						    	</div>
							</div>
						</div>
						<div v-if="items.name == '付款时间'">
							<div class="m_t5 m_b5">
								<el-select class="lastSelect" v-model="payTime" placeholder="">
						      		<el-option label="指定时间" value="3"></el-option>
						      		<el-option label="每月" value="2"></el-option>
						      		<el-option label="每周" value="1"></el-option>
						    	</el-select>
						    	<div class="inline_block m_l5" v-if="payTime == '3'">
						    		<el-date-picker
						    			:editable="false"
						    			:clearable="false"
						    		  class="datewidth"
								      v-model="payDateOne"
								      type="date"
								      placeholder="选择日期">
								    </el-date-picker>
								    <span>至</span>
								    <el-date-picker
								    	:editable="false"
								    	:clearable="false"
								      class="datewidth"
								      v-model="payDateTwo"
								      type="date"
								      placeholder="选择日期">
								    </el-date-picker>
						    	</div>
						    	<div class="inline_block m_l5" v-else-if="payTime == '2'">
						    		<el-select class="dayWidthSel" v-model="paymonthOne" placeholder="">
							      		<el-option :label="(item > 9 ? item : ('0' + item))" :value="item" v-for="item in 30"></el-option>
							    	</el-select>
							    	<span>至</span>
							    	<el-select class="dayWidthSel" v-model="paymonthTwo" placeholder="">
							      		<el-option :label="(item > 9 ? item : ('0' + item))" :value="item" v-for="item in 30"></el-option>
							    	</el-select>
							    	<span>日</span>
						    	</div>
						    	<div class="inline_block m_l5" v-else-if="payTime == '1'">
						    		<el-select class="dayWidthSel" v-model="payweekOne" placeholder="">
							      		<el-option :label="item" :value="(index + 1)" v-for="(item,index) in weekArr"></el-option>
							    	</el-select>
							    	<span>至</span>
							    	<el-select class="dayWidthSel" v-model="payweekTwo" placeholder="">
							      		<el-option :label="item" :value="(index + 1)" v-for="(item,index) in weekArr"></el-option>
							    	</el-select>
						    	</div>
							</div>
						</div>
						<div v-if="items.name == '交易完成时间'">
							<div class="m_t5 m_b5">
								<el-select class="lastSelect" v-model="overTime" placeholder="">
						      		<el-option label="指定时间" value="3"></el-option>
						      		<el-option label="每月" value="2"></el-option>
						      		<el-option label="每周" value="1"></el-option>
						    	</el-select>
						    	<div class="inline_block m_l5" v-if="overTime == '3'">
						    		<el-date-picker
						    			:editable="false"
						    			:clearable="false"
						    		  class="datewidth"
								      v-model="overDateOne"
								      type="date"
								      placeholder="选择日期">
								    </el-date-picker>
								    <span>至</span>
								    <el-date-picker
								    	:editable="false"
								    	:clearable="false"
								      class="datewidth"
								      v-model="overDateTwo"
								      type="date"
								      placeholder="选择日期">
								    </el-date-picker>
						    	</div>
						    	<div class="inline_block m_l5" v-else-if="overTime == '2'">
						    		<el-select class="dayWidthSel" v-model="overmonthOne" placeholder="">
							      		<el-option :label="(item > 9 ? item : ('0' + item))" :value="item" v-for="item in 31"></el-option>
							    	</el-select>
							    	<span>至</span>
							    	<el-select class="dayWidthSel" v-model="overmonthTwo" placeholder="">
							      		<el-option :label="(item > 9 ? item : ('0' + item))" :value="item" v-for="item in 31"></el-option>
							    	</el-select>
							    	<span>日</span>
						    	</div>
						    	<div class="inline_block m_l5" v-else-if="overTime == '1'">
						    		<el-select class="dayWidthSel" v-model="overweekOne" placeholder="">
							      		<el-option :label="item" :value="(index + 1)" v-for="(item,index) in weekArr"></el-option>
							    	</el-select>
							    	<span>至</span>
							    	<el-select class="dayWidthSel" v-model="overweekTwo" placeholder="">
							      		<el-option :label="item" :value="(index + 1)" v-for="(item,index) in weekArr"></el-option>
							    	</el-select>
						    	</div>
							</div>
						</div>
						<div v-if="items.name == '订单实付金额（不含邮费）'">
							<div class="m_t5 m_b5">
								<el-select class="dealWidth" v-model="priceVal" placeholder="">
						      		<el-option label="大于等于" value="1"></el-option>
						      		<el-option label="小于等于" value="2"></el-option>
						    	</el-select>
						    	<div class="inline_block m_l5">
						    		<el-input @blur="blurInp('priceOne')" class="dayWidth" v-model.trim="priceOne"></el-input>
							    	<span>元</span>
						    	</div>
							</div>
						</div>
						<div v-if="items.name == '指定商品'">
							<div class="m_t5 m_b5">
								<span style="display: inline-block;" class="blueColor cursor m_t5" @click="setGoods(goodsMsg.skuList)">设置商品</span>
							    <div>
									<span>已设置<span class="orangeColor">{{goodsMsg.goodsNum || 0}}</span>个指定商品，</span>
									<el-select class="limitWidth" v-model="filterSkusType" placeholder="">
										<el-option label="每个订单只需包含任意一个指定商品即可" :value="1"></el-option>
										<el-option label="每个订单必须包含所有指定商品" :value="2"></el-option>
									</el-select>
								</div>
							</div>
						</div>
						<div v-if="items.name == '屏蔽优惠订单'">
							<div class="m_t5 m_b5">
							 	<el-radio v-model="radio" label="1">屏蔽</el-radio>
							</div>
						</div>
						<div v-if="items.name == '会员等级'">
							<div class="m_t5 m_b5">
								<el-checkbox-group 
							    v-model="checkedList">
								    <el-checkbox v-for="item in lists" :label="item" :key="item">{{item}}</el-checkbox>
							  	</el-checkbox-group>
							</div>
						</div>
					</div>
				</div>
				 <!-- v-if="chooseArr.length" -->
				<div class="dia_style" v-else>
					暂未设置规则
				</div>
			</div>
			<div class="f-fr dia_right_">
				<p class="m_b10">3. 设置奖励积分</p>
				<div class="dia_style">
					<el-radio class="radio" v-model="priceInte" label="1">固定积分</el-radio>
					<el-input @blur="blurInp('setIntegral')" v-model.trim="setIntegral" class="inpWidth"></el-input>
					积分
					<br />
					<br />
					<el-radio class="radio" v-model="priceInte" label="2">成交金额</el-radio>
					<el-input @blur="blurInps('setMoney')" v-model.trim="setMoney" class="inpWidth"></el-input>
					倍
				</div>
			</div>
		</div>
		<p class="m_t10 text-center">
			<el-button size="small" @click="sureBut(true)">取 消</el-button>
			<el-button type="primary" size="small" @click="sureBut()">确 定</el-button>
		</p>
	</div>
</template>

<script>
import dateFormat from './../../common/dateFormat.js'
import http from './../../api/index.js';
	export default{
		data() {
			return{
				nullName: false,
				hasName: false,
				loadingPage: false,
				priceInte: '1',
				setIntegral: '',
				setMoney: '',
				switchVal: false,
				dateOne: '',
				dateTwo: '',
				diaValue: '1',
				diaInput: '',
				diaArr: [{
					name: '下单时间',
					desc: '订单创建的时间范围',
					check: false
				}, {
					name: '付款时间',
					desc: '订单完成付款的时间范围',
					check: false
				}, {
					name: '交易完成时间',
					desc: '订单交易完成的时间范围',
					check: false
				}, {
					name: '屏蔽优惠订单',
					desc: '享受了优惠券或折扣的订单无法获得奖励积分',
					check: false
				}, {
					name: '订单实付金额（不含邮费）',
					desc: '买家实际付款的金额范围，扣除邮费',
					check: false
				}, {
					name: '指定商品',
					desc: '订单包含指定商品',
					check: false
				}],
				memberLevel: [{
					name: '会员等级',
					desc: '会员所属会员等级范围',
					check: false
				}],
				weekArr: ['周一','周二','周三','周四','周五','周六','周日'],
				lastTime: '3',
				payTime: '3',
				overTime: '3',
				monthOne: 1,
				monthTwo: 1,
				payDateOne: '',
				payDateTwo: '',
				paymonthOne: 1,
				paymonthTwo: 1,
				weekOne: 1,
				weekTwo: 1,
				payweekOne: 1,
				payweekTwo: 1,
				overDateOne: '',
				overDateTwo: '',
				overmonthOne: 1,
				overmonthTwo: 1,
				overweekOne: 1,
				overweekTwo: 1,
				options: [{
					label: '会员生命周期',
					value: '1'
				}],
				chooseArr: [],
				priceVal: '1',
				priceOne: '',
				radio: '1',
				checkedList: [],
				lists: ['铜牌会员', '银牌会员', '金牌会员', '铂金会员', '钻石会员'],
				filterSkusType: 1
			}
		},
		props: {
			levelName: Object,
			levelList: Object,
			rowObj: [Object, Number, Array],
			dialogVisible: [Boolean],
			tableData: Array,
			goodsMsg: Object
		},
		mounted() {
			this.listData();
			if(this.rowObj) {
				this.initData();
			} else {
				this.noDataInit();
			}
			
		},
		created() {
		},
		watch: {
			diaInput(val) {
				if(!val) {
					this.nullName = true;
				} else {
					this.nullName = false;
				}
			},
			dialogVisible(val) {
				this.nullName = false;
				if(!val) {
					return
				}
				this.listData();
				if(this.rowObj) {
					this.initData();
				} else {
					this.noDataInit();
				}
			}
		},
		methods: {
			setGoods(list) {
			   this.$emit('showGoods', list);
			},
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
			blurName() {			//名字检测重复
				this.tableData.some(item => {
					if((item.ruleName == this.diaInput) && (this.rowObj.ruleName != item.ruleName)) {
						this.hasName = true;
						return true;
					} else {
						this.hasName = false;
					}
				});
			},	
			blurInps(item) {
				if(isNaN(Number(this[item])) || /\+/.test(this[item]) || /\-/.test(this[item])) {
					this.$message.error('只能输入数值型！');
					this[item] = '';
					return
				}
			},
			listData() {
				this.checkedList = [];
				this.lists = []
				for (let i in this.levelName) {
					if(Number(i)) {
						this.lists.push(this.levelName[i]);
					}
				}
				// this.dateOne = this.dateOne ? this.dateOne : new Date();
				// this.payDateOne = this.payDateOne ? this.payDateOne : new Date();
				// this.overDateOne = this.overDateOne ? this.overDateOne : new Date();
				// this.dateTwo = this.dateTwo ? this.dateTwo : ((new Date).setDate((new Date).getDate() + 30));
				// this.payDateTwo = this.payDateTwo ? this.payDateTwo : ((new Date).setDate((new Date).getDate() + 30));
				// this.overDateTwo = this.overDateTwo ? this.overDateTwo : ((new Date).setDate((new Date).getDate() + 30));
			},
			noDataInit() {
				this.chooseArr = [];
				this.diaArr.forEach(item => {
					item.check = false;
				});
				this.memberLevel[0].check = false;
				this.diaInput = "";
				this.switchVal = false;
				this.checkedList = [];
				this.setMoney = '';
				this.setIntegral = '';
				this.priceInte = '1';
				this.filterSkusType = 1;

				this.dateOne = new Date();
				this.payDateOne = new Date();
				this.overDateOne = new Date();
				this.dateTwo = ((new Date).setDate((new Date).getDate() + 30));
				this.payDateTwo = ((new Date).setDate((new Date).getDate() + 30));
				this.overDateTwo = ((new Date).setDate((new Date).getDate() + 30));

				setTimeout(() => {
					this.nullName = false;
				}, 10);
			},
			sureBut(cancel) {
				if(cancel) {
					this.$emit('sureBut', cancel);
					return
				}
				if(!this.diaInput) {
					this.nullName = true;
					return
				}
				if(this.hasName) {
					return
				}
				
				
				if(this.diaArr[4].check && (!this.priceOne || this.priceOne == 0)) {
					this.$message.error('订单实付金额范围需为正整数！');
					return
				}
                console.log(this.diaArr[5])
				let api_name = this.rowObj ? 'membermodify' : 'memberadd';
				let compareType = this.diaArr[4].check ? Number(this.priceVal) : 0;
				let orderDateType = this.diaArr[0].check ? Number(this.lastTime) : 0;
				let payDateType = this.diaArr[1].check ? Number(this.payTime) : 0;
				let tradeDateType = this.diaArr[2].check ? Number(this.overTime) : 0;
				let score = this.priceInte == '1' ? this.setIntegral : this.setMoney;
				let skus = this.diaArr[5].check ? this.goodsMsg.skuList : [];
				let filterSkusType = this.diaArr[5].check && skus &&  skus.length ? this.filterSkusType : 0;

				if(!Number(score)) {
					this.$message.error('奖励积分需为正数！');
					return
				}
				let shieldDiscountOrder = this.diaArr[3].check ? 1 : 0;
				let arr = [];
				this.checkedList.forEach(item => {
					if(item) {
						arr.push(this.levelList[item]);
					}
				});
				if(!arr.length && this.memberLevel[0].check) {
					this.$message.error('请设置会员等级！');
					return
				}
				let data = {
					isOn: this.switchVal ? 1 : 0,
					memberType: JSON.stringify(arr),
					compareType: compareType,
					orderDateType: orderDateType,
					payDateType: payDateType,
					tradeDateType: tradeDateType,
					paid: this.priceOne,
					ruleName: this.diaInput,
					score: score,
					scoreType: Number(this.priceInte),
					shieldDiscountOrder: shieldDiscountOrder,
					skus: skus,
					filterSkusType: filterSkusType
				};
				if(this.diaArr[0].check) {
					let start = (this.lastTime == '1') ? this.weekOne : (this.lastTime == '2' ? this.monthOne : this.dateOne); 
					let end = (this.lastTime == '1') ? this.weekTwo : (this.lastTime == '2' ? this.monthTwo : this.dateTwo); 
					let left = 0,right = 0;
					if(this.lastTime == '3') {
						data.orderStartTime = dateFormat(start, 'YY-MM-DD') + ' 00:00:00';
						data.orderEndTime = dateFormat(end, 'YY-MM-DD') + ' 23:59:59';
						left = Date.parse(data.orderStartTime);
						right = Date.parse(data.orderEndTime);
					} else {
						data.orderStartDate = start;
						data.orderEndDate = end;
						left = data.orderStartDate;
						right = data.orderEndDate;
					}
					if(left > right) {
						this.$message.error('右侧下单时间需大于、等于左侧时间！');
						return
					}
				}
				if(this.diaArr[1].check) {
					let start = (this.payTime == '1') ? this.payweekOne : (this.payTime == '2' ? this.paymonthOne : this.payDateOne); 
					let end = (this.payTime == '1') ? this.payweekTwo : (this.payTime == '2' ? this.paymonthTwo : this.payDateTwo); 
					let left = 0,right = 0;
					if(this.payTime == '3') {
						data.payStartTime = dateFormat(start, 'YY-MM-DD') + ' 00:00:00';
						data.payEndTime = dateFormat(end, 'YY-MM-DD') + ' 23:59:59';
						left = Date.parse(data.payStartTime);
						right = Date.parse(data.payEndTime);
					} else {
						data.payStartDate = start;
						data.payEndDate = end;
						left = data.payStartDate;
						right = data.payEndDate;
					}
					if(left > right) {
						this.$message.error('右侧付款时间需大于、等于左侧时间！');
						return
					}
				}
				if(this.diaArr[2].check) {
					let start = (this.overTime == '1') ? this.overweekOne : (this.overTime == '2' ? this.overmonthOne : this.overDateOne); 
					let end = (this.overTime == '1') ? this.overweekTwo : (this.overTime == '2' ? this.overmonthTwo : this.overDateTwo); 
					let left = 0,right = 0;
					if(this.overTime == '3') {
						data.tradeStartTime = dateFormat(start, 'YY-MM-DD') + ' 00:00:00';
						data.tradeEndTime = dateFormat(end, 'YY-MM-DD') + ' 23:59:59';
						left = Date.parse(data.tradeStartTime);
						right = Date.parse(data.tradeEndTime);
					} else {
						data.tradeStartDate = start;
						data.tradeEndDate = end;
						left = data.tradeStartDate;
						right = data.tradeEndDate;
					}
					if(left > right) {
						this.$message.error('右侧交易完成时间需大于、等于左侧时间！');
						return
					}
				}
				if(this.rowObj) {
					data.id = this.rowObj.id
				}
				this.loadingPage = true;
				this.saveRule(api_name, data);
			},
			saveRule(api_name,data) {
				http({
					api_name: api_name,
					vm: this,
					data: data
				}, (res) => {
					this.loadingPage = false;
					this.$emit('sureBut', false);
				}, (error) => {
					this.loadingPage = false;
				});
			},
			chooseItem(item, flag) {
				if(!flag) {
					item.check = !item.check;
				}
				if(item.check) {
					this.chooseArr.push(item);
				} else {
					let num = -1;
					this.chooseArr.some((items, index) => {
						if(items.name == item.name) {
							num = index;
							return true;
						}
					});
					if(num > -1) {
						this.chooseArr.splice(num, 1);
					}
				}
			},
			deleteItems(item) {			//删除
				this.chooseItem(item);
			},
			initData() {
				this.chooseArr = [];
				this.switchVal = this.rowObj.isOn ? true : false;
				this.diaInput = this.rowObj.ruleName;
				this.diaArr[0].check = this.rowObj.orderDateType ? true : false;
				this.diaArr[1].check = this.rowObj.payDateType ? true : false;
				this.diaArr[2].check = this.rowObj.tradeDateType ? true : false;
				this.diaArr[3].check = this.rowObj.shieldDiscountOrder;
				this.diaArr[4].check = this.rowObj.paid ? true : false;
				this.diaArr[5].check = this.rowObj.skus && JSON.parse(this.rowObj.skus).length ? true : false;
				this.filterSkusType =  this.rowObj.filterSkusType || 1; 
				this.goodsMsg.goodsNum = this.rowObj.skus ? JSON.parse(this.rowObj.skus).length : 0;
				this.goodsMsg.skuList = this.rowObj.skus ? JSON.parse(this.rowObj.skus) : [];
				this.memberLevel[0].check = this.rowObj.memberType && JSON.parse(this.rowObj.memberType).length;
				this.priceInte = this.rowObj.scoreType ? this.rowObj.scoreType.toString() : '1';
				this.diaArr.forEach((item) => {
					this.chooseItem(item, true);
				});
				this.memberLevel.forEach((item) => {
					this.chooseItem(item, true);
				});
				
				this.lastTime = this.rowObj.orderDateType ? this.rowObj.orderDateType.toString() : '3';
				this.payTime = this.rowObj.payDateType ? this.rowObj.payDateType.toString() : '3';
				this.overTime = this.rowObj.tradeDateType ? this.rowObj.tradeDateType.toString() : '3';
				this.setIntegral = (this.rowObj.scoreType == 1) ? this.rowObj.score : '';
				this.setMoney = (this.rowObj.scoreType == 2) ? this.rowObj.score : '';
				this.priceVal = this.rowObj.compareType ? this.rowObj.compareType.toString() : '1';
				this.priceOne = this.rowObj.paid;
				
				//下单时间
				this.dateOne = this.rowObj.orderStartTime ? this.rowObj.orderStartTime : (new Date());
				this.dateTwo = this.rowObj.orderEndTime ? this.rowObj.orderEndTime : ((new Date).setDate((new Date).getDate() + 30));
				this.monthOne = (this.rowObj.orderStartDate && (this.rowObj.orderDateType == 2)) ? this.rowObj.orderStartDate : 1;
				this.monthTwo = (this.rowObj.orderEndDate && (this.rowObj.orderDateType == 2)) ? this.rowObj.orderEndDate : 1;
				this.weekOne = (this.rowObj.orderStartDate && (this.rowObj.orderDateType == 1)) ? this.rowObj.orderStartDate : 1;
				this.weekTwo = (this.rowObj.orderEndDate && (this.rowObj.orderDateType == 1)) ? this.rowObj.orderEndDate : 1;
				//付款时间
				this.payDateOne = this.rowObj.payStartTime ? this.rowObj.payStartTime : (new Date());
				this.payDateTwo = this.rowObj.payEndTime ? this.rowObj.payEndTime : ((new Date).setDate((new Date).getDate() + 30));
				this.paymonthOne = (this.rowObj.payStartDate && (this.rowObj.payDateType == 2)) ? this.rowObj.payStartDate : 1;
				this.paymonthTwo = (this.rowObj.payEndDate && (this.rowObj.payDateType == 2)) ? this.rowObj.payEndDate : 1;
				this.payweekOne = (this.rowObj.payStartDate && (this.rowObj.payDateType == 1)) ? this.rowObj.payStartDate : 1;
				this.payweekTwo = (this.rowObj.payEndDate && (this.rowObj.payDateType == 1)) ? this.rowObj.payEndDate : 1;
				//交易完成
				this.overDateOne = this.rowObj.tradeStartTime ? this.rowObj.tradeStartTime : (new Date());
				this.overDateTwo = this.rowObj.tradeEndTime ? this.rowObj.tradeEndTime : ((new Date).setDate((new Date).getDate() + 30));
				this.overmonthOne = (this.rowObj.tradeStartDate && (this.rowObj.tradeDateType == 2)) ? this.rowObj.tradeStartDate : 1;
				this.overmonthTwo = (this.rowObj.tradeEndDate && (this.rowObj.tradeDateType == 2)) ? this.rowObj.tradeEndDate : 1;
				this.overweekOne = (this.rowObj.tradeStartDate && (this.rowObj.tradeDateType == 1)) ? this.rowObj.tradeStartDate : 1;
				this.overweekTwo = (this.rowObj.tradeEndDate && (this.rowObj.tradeDateType == 1)) ? this.rowObj.tradeEndDate : 1;
				this.listData();
				setTimeout(() => {
					if(this.rowObj.memberType) {
						let arr = JSON.parse(this.rowObj.memberType);
						arr.forEach(item => {
							this.checkedList.push(this.levelName[item]);
						});
					}
				}, 10);
			}
		}
	}
</script>

<style lang="less" scoped>
	.el_select{
		width: 140px;
	}
	.el_input{
		width: 200px;
	}
	.el_input_desc{
		width: 500px;
	}
	.dia_left{
		width: 250px;
		.left_ul{
			padding-top: 10px;
			li{
				width: 88px;
				border: 1px solid rgb(215,215,215);
				height: 30px;
				text-align: center;
				line-height: 30px;
				cursor: pointer;
				background-color: #fff;
				font-size: 12px;
			}
			.last_li{
				width: 180px;
			}
			.choose{
				background-image: url(../../assets/images/u472.png);
				background-repeat: no-repeat;
				background-position: 74px 16px;
				border: 1px solid rgb(48,137, 220);
			}
			.last_li.choose{
				background-image: url(../../assets/images/u472.png);
				background-repeat: no-repeat;
				background-position: 166px 16px;
				border: 1px solid rgb(48,137, 220);
			}
		}
	}
	.dia_style{
		box-sizing: border-box;
		padding: 14px;
		background: rgb(243,247,254);
		border: 1px solid rgb(215,215,215);
		max-height: 257px;
		overflow: auto;
	}
	.chooseStyle{
		padding: 8px;
		border: 1px solid rgb(215,215,215);
		background-color: #fff;
		.inpWidth{
			width: 100px;
		}
		.datewidth{
			width: 113px;
		}
		.dayWidth{
			width: 74px;
		}
		.dealWidth{
			width: 135px;
		}
		.limitWidth {
			width: 290px;
		}
		.lastdayWidth{
			width: 50px;
		}
		.dayWidthSel{
			width: 90px
		}
		.lastSelect{
			width: 95px;
		}
	}
	.dia_right{
		width:480px;
		button{
			width: 80px;
		}
	}
	.dia_right_{
		width: 225px;
		.inpWidth{
			width: 60px;
		}
	}
	.priceName{
		margin-bottom: 10px;
		height: 47px;
		.red{
			font-size: 12px;
			margin-left: 76px;
		}
	}

</style>