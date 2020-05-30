<template>
	<div id="peoplrDialog" v-loading="loadingPage">
		<div class="hidden row_line errorMess">
	  		<span>人群名称：</span>
	  		<el-input :disabled="readOnly" v-model.trim="diaInput" :maxlength="15" class="el_inp el_input" placeholder="请输入内容"></el-input>
	  		<span class="m_l20 red" v-if="diaInput.length > 15">最多15个汉字</span>
	  		<div class="reds" v-if="nullName">请输入人群名称</div>
	  	</div>
	  	<div class="hidden m_b20 row_line">
	  		<span>人群分组：</span>
	  		<el-select v-if="!readOnly" v-model="diaValue" class="el_inp el_select" placeholder="请选择">
			    <el-option
			      	v-for="item in options"
			      	:key="item.id"
			      	:label="item.groupName"
			      	:value="item.id">
			    </el-option>
		  	</el-select>
			<el-select class="el_inp el_select" disabled v-else :value="rowObj.groupName">
				<el-option :label="rowObj.groupName" :value="rowObj.groupName"></el-option>
			</el-select>
	  	</div>
	  	<div class="hidden row_line errorMess">
	  		<span>人群介绍：</span>
	  		<el-input :disabled="readOnly" v-model.trim="input" :maxlength="50" class="el_inp el_input_desc" placeholder="请输入内容"></el-input>
	  		<div class="m_l20 reds" v-if="input.length > 50">最多50个汉字</div>
	  	</div>
		<div class="clearfix row_line">
			<div class="f-fl dia_left">
				<p class="m_b10">1. 选择人群条件</p>
				<div class="dia_style">
					<span>交易相关</span>
					<ul class="clearfix left_ul" v-if="!readOnly">
						<li class="f-fl m_b10 m_l10" @click="chooseItem(item)" :class="{'choose': item.check}" v-for="item in diaArr">{{item.name}}</li>
					</ul>
					<ul class="clearfix left_ul" v-else>
						<li class="f-fl m_b10 m_l10" :class="{'choose': item.check}" v-for="item in diaArr">{{item.name}}</li>
					</ul>
					<span>会员相关</span>
					<ul class="clearfix left_ul" v-if="!readOnly">
						<li class="f-fl m_b10 m_l10" @click="chooseItem(item)" :class="{'choose': item.check}" v-for="item in memberLevel">{{item.name}}</li>
					</ul>
					<ul class="clearfix left_ul" v-else>
						<li class="f-fl m_b10 m_l10" :class="{'choose': item.check}" v-for="item in memberLevel">{{item.name}}</li>
					</ul>
				</div>
			</div>
			<div class="f-fr dia_right">
				<p class="m_b10">2. 设置人群规则</p>
				<div class="dia_style" v-if="chooseArr.length">
					<div class="chooseStyle m_b10 font12" v-for="items in chooseArr">

						<p class="clearfix">
							<span class="f-fl">{{items.name}}</span><span v-if="!readOnly" class="blueColor f-fr cursor" @click="deleteItem(items)">删除</span>
						</p>
						<p class="grayColor">
							{{items.desc}}
						</p>
						<div v-if="items.name == '最后交易时间'">
							<div class="m_t5 ">
								<el-select :disabled="readOnly" class="lastSelect" v-model="lastTime" placeholder="">
						      		<el-option label="指定时间" value="0"></el-option>
						      		<el-option label="相对最近时间" value="1"></el-option>
						    	</el-select>
						    	<div class="inline_block m_l5" v-if="lastTime == '0'">
						    		<el-date-picker
										:disabled="readOnly"
						    			:editable="false"
						    			:clearable="false"
						    		  class="datewidth"
								      v-model="dateOne"
								      type="date"
								      placeholder="选择日期">
								    </el-date-picker>
								    <span>至</span>
								    <el-date-picker
										:disabled="readOnly"
								    	:editable="false"
						    			:clearable="false"
								      class="datewidth"
								      v-model="dateTwo"
								      type="date"
								      placeholder="选择日期">
								    </el-date-picker>
						    	</div>
						    	<div class="inline_block m_l5" v-else-if="lastTime == '1'">
						    		<el-select :disabled="readOnly" class="dayWidthSel" v-model="lastTimeType" placeholder="">
							      		<el-option label="大于等于" value="2"></el-option>
							      		<el-option label="小于等于" value="0"></el-option>
							      		<el-option label="介于" value="1"></el-option>
							    	</el-select>
							    	<el-input :disabled="readOnly" @blur="blurInp('dayOne')" class="lastdayWidth" v-model.trim="dayOne"></el-input>
							    	<span v-if="lastTimeType == 1">至</span>
							    	<el-input :disabled="readOnly" v-if="lastTimeType == 1" class="lastdayWidth" @blur="blurInp('dayTwo')" v-model.trim="dayTwo"></el-input>
							    	<span>天</span>
						    	</div>
							</div>
						</div>
						<div v-else-if="items.name == '累计成交次数'">
							<div class="m_t5 ">
								<el-select :disabled="readOnly" class="dealWidth" v-model="dealVal" placeholder="">
						      		<el-option label="大于等于" value="2"></el-option>
						      		<el-option label="小于等于" value="0"></el-option>
						      		<el-option label="介于" value="1"></el-option>
						    	</el-select>
						    	<div class="inline_block m_l5" v-if="dealVal == '1'">
						    		<el-input :disabled="readOnly" @blur="blurInp('dealOne')" class="dayWidth" v-model.trim="dealOne"></el-input>
							    	<span>至</span>
							    	<el-input :disabled="readOnly" @blur="blurInp('dealTwo')" class="dayWidth" v-model.trim="dealTwo"></el-input>
							    	<span>次</span>
						    	</div>
						    	<div class="inline_block m_l5" v-else>
						    		<el-input :disabled="readOnly" @blur="blurInp('dealAbout')" class="dayWidth" v-model.trim="dealAbout"></el-input>
							    	<span>次</span>
						    	</div>
							</div>
						</div>
						<div v-else-if="items.name == '累计成交金额'">
							<div class="m_t5 ">
								<el-select :disabled="readOnly" class="dealWidth" v-model="moneyVal" placeholder="">
						      		<el-option label="大于等于" value="2"></el-option>
						      		<el-option label="小于等于" value="0"></el-option>
						      		<el-option label="介于" value="1"></el-option>
						    	</el-select>
						    	<div class="inline_block m_l5" v-if="moneyVal == '1'">
						    		<el-input :disabled="readOnly" @blur="blurInp('moneyOne')" class="dayWidth" v-model.trim="moneyOne"></el-input>
							    	<span>至</span>
							    	<el-input :disabled="readOnly" @blur="blurInp('moneyTwo')" class="dayWidth" v-model.trim="moneyTwo"></el-input>
							    	<span>元</span>
						    	</div>
						    	<div class="inline_block m_l5" v-else>
						    		<el-input :disabled="readOnly" @blur="blurInp('moneyAbout')" class="dayWidth" v-model.trim="moneyAbout"></el-input>
							    	<span>元</span>
						    	</div>
							</div>
						</div>
						<div v-else-if="items.name == '平均客单价'">
							<div class="m_t5 ">
								<el-select :disabled="readOnly" class="dealWidth" v-model="priceVal" placeholder="">
						      		<el-option label="大于等于" value="2"></el-option>
						      		<el-option label="小于等于" value="0"></el-option>
						      		<el-option label="介于" value="1"></el-option>
						    	</el-select>
						    	<div class="inline_block m_l5" v-if="priceVal == '1'">
						    		<el-input :disabled="readOnly" @blur="blurInp('priceOne')" class="dayWidth" v-model.trim="priceOne"></el-input>
							    	<span>至</span>
							    	<el-input :disabled="readOnly" @blur="blurInp('priceTwo')" class="dayWidth" v-model.trim="priceTwo"></el-input>
							    	<span>元</span>
						    	</div>
						    	<div class="inline_block m_l5" v-else>
						    		<el-input :disabled="readOnly" @blur="blurInp('priceAbout')" class="dayWidth" v-model.trim="priceAbout"></el-input>
							    	<span>元</span>
						    	</div>
							</div>
						</div>
						<div v-else-if="items.name == '会员等级'">
							<div class="m_t5 ">
								<el-checkbox-group
							    v-model="checkedList">
								    <el-checkbox :disabled="readOnly" v-for="item in lists" :label="item" :key="item">{{item}}</el-checkbox>
							  	</el-checkbox-group>
							</div>
						</div>
           				<!-- 以后添加的类型用下面的方式 请不要在用上面的方式了 谢谢 -->
						<InfoItem v-else-if="items.name == '首次下单时间'" :disabled="readOnly" ref="firstOrder" prop="date" :init-date-type="firstOrderDateType" :right-val="rightFirstOrderDate" :left-val="leftFirstOrderDate"></InfoItem>
						<InfoItem v-else-if="items.name == '关闭交易次数'" :disabled="readOnly" ref="closeTradeCount" :right-val="rightCloseTradeCount" :left-val="leftCloseTradeCount"></InfoItem>
						<InfoItem v-else-if="items.name == '关闭交易金额'" :disabled="readOnly" ref="closeTradeAmount"  :right-val="rightCloseTradeAmount" :left-val="leftCloseTradeAmount"></InfoItem>
						<InfoItem v-else-if="items.name == '购买商品件数'" :disabled="readOnly" ref="itemNumCheck"  :right-val="rightItemNum" :left-val="leftItemNum"></InfoItem>
					</div>
				</div>
				 <!-- v-if="chooseArr.length" -->
				<div class="dia_style" v-else>
					暂未设置规则
				</div>
			</div>
		</div>
		<p class="m_t10" style="text-align: center;">
			<el-button size="small" @click="sureBut(true)">取 消</el-button>
			<el-button type="primary" size="small" @click="sureBut()">确 定</el-button>
		</p>
	</div>
</template>

<script>
import dateFormat from './../../../common/dateFormat.js';
import http from './../../../api/index.js';
import InfoItem from './components/infoItem.vue'
import {formatDate} from 'src/common/utils';
import {point} from 'src/common/point.js';
	export default{
    components: {InfoItem},
		data() {
			return{
				nullName: false,
				input: '',
				dateOne: '',
				dateTwo: '',
				diaValue: '',
				diaInput: '',
				diaArr: [{
					name: '最后交易时间',
					desc: '在当前店铺中最后一笔订单创建时间范围',
					title: 'timeCheck',
					check: false
				}, {
					name: '累计成交次数',
					desc: '在当前店铺中交易完成的累计次数',
					title: 'countCheck',
					check: false
				}, {
					name: '累计成交金额',
					desc: '在当前店铺中交易完成的总金额',
					title: 'amountCheck',
					check: false
				}, {
					name: '平均客单价',
					desc: '累计成交金额/累计成交次数',
					title: 'priceCheck',
					check: false
				},{
					name: '首次下单时间',
					desc: '在当前店铺中第一笔订单创建时间范围',
					title: 'firstOrderCheck',
					check: false
				},{
					name: '关闭交易次数',
					desc: '在当前店铺中关闭交易的累计次数',
					title:'closeTradeCountCheck',
					check: false
				},{
					name: '关闭交易金额',
					desc: '在当前店铺中关闭交易的订单总金额',
					title: 'closeTradeAmountCheck',
					check: false
				},{
					name: '购买商品件数',
					desc: '在当前店铺中累计成功购买商品件数',
					title: 'itemNumCheck',
					check: false
				},
				],
				memberLevel: [{
					name: '会员等级',
					desc: '会员所属会员等级范围',
					title: 'gradeCheck',
					check: false
				}],
				lastTime: '0',
				lastTimeType: '0',
				dayOne: '',
				dayTwo: '',
				monthone: 1,
				monthtwo: 1,
				chooseArr: [],
				dealOne: '',
				dealTwo: '',
				dealVal: '2',
				dealAbout: '',
				moneyVal: '2',
				moneyOne: '',
				moneyTwo: '',
				moneyAbout: '',
				priceVal: '2',
				priceOne: '',
				priceTwo: '',
				priceAbout: '',
				checkedList: [],
				lists: ['铜牌会员', '银牌会员', '金牌会员', '铂金会员', '钻石会员'],
				loadingPage: false,
				optiMap: new Map(),

        leftFirstOrderDate: '',
        rightFirstOrderDate: '',
        firstOrderDateType: 1,
        leftCloseTradeCount:'',
        rightCloseTradeCount:'',
        leftCloseTradeAmount:'',
        rightCloseTradeAmount:'',
        leftItemNum:'',
        rightItemNum:'',
			}
		},
		props: {
			levelName: Object,
			levelList: Object,
			rowObj: [Object, Number, Array],
			dialogVisible: [Boolean],
			options: Array,
			readOnly:[String,Boolean]
		},
		watch: {
			diaInput() {
				this.nullName = false;
			},
			dialogVisible(val) {
				this.nullName = false;
				if(!val) {
					return
				}
				!this.readOnly && (this.optionsArr());
				this.listData();
				if(this.rowObj) {
					this.initData();
				} else {
					this.noDataInit();
				}
			}
		},
		mounted() {
			!this.readOnly && (this.optionsArr());
			this.listData();
			if(this.rowObj) {
				this.initData();
			} else {
				this.noDataInit();
			}
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
			// 遍历options
			optionsArr() {
				this.optiMap.clear();
				this.options.forEach(item => {
					this.optiMap.set(item.id, item.groupName);
				});
			},
			listData() {
				this.checkedList = [];
				this.lists = []
				for (let i in this.levelName) {
					if(Number(i) || i === '0') {
						this.lists.push(this.levelName[i]);
					}
				}
			},
			noDataInit() {
				this.chooseArr = [];
				this.diaArr.forEach(item => {
					item.check = false;
				});
				this.memberLevel[0].check = false;
				this.diaInput = "";
				this.diaValue = this.options[0].id;
				this.checkedList = [];
				this.input = '';
				this.leftFirstOrderDate = this.dateOne = new Date();
				this.rightFirstOrderDate = this.dateTwo = new Date(((new Date).setDate((new Date).getDate() + 30)));
				this.firstOrderDateType = 1
			},
			sureBut(cancel) {		//确定
				if(cancel || this.readOnly) {
					this.$emit('sureBut', cancel);
					return
				}
				if(!this.diaInput) {
					this.nullName = true;
					return
				}
				if(this.diaInput.length > 15) {
					return
				}
				let dealSet = {},
					checkList = ['timeCheck','countCheck','amountCheck','priceCheck','firstOrderCheck','closeTradeCountCheck','closeTradeAmountCheck','itemNumCheck'];
				checkList.forEach((item,index) => {
					dealSet[item] = !!this.diaArr[index].check;
				})
				let gradeCheck = !!this.memberLevel[0].check;
				let arr = [];
				if(!this.diaArr.some(({check}) => check) && !this.memberLevel.some(({check}) => check)){
					this.$message.error('至少需要一条规则');
					return
				}
				this.checkedList.forEach(item => {
					if(item) {
						arr.push(this.levelList[item]);
					}
				});
				let data = {};
				data.crowdDesc = this.input;
				data.crowdName = this.diaInput;
				data.groupId = this.diaValue;
				data.groupName = this.optiMap.get(this.diaValue);
				data.signFlag = (this.rowObj && this.rowObj.signFlag) ? this.rowObj.signFlag : 0;
				if(this.rowObj) {
					data.id = this.rowObj.id;
					data.modelId = this.rowObj.modelId;
				}
				if(dealSet.timeCheck) {
					dealSet.timeType = Number(this.lastTime);
					if(this.lastTime == 1) {
						if(this.lastTimeType == 1) {
							if(Number(this.dayTwo) < Number(this.dayOne)) {
								this.$message.error('右侧时间要大于左侧时间！');
								return
							}
							dealSet.maxLastTradeDate = Number(this.dayTwo) || null;
							dealSet.minLastTradeDate = Number(this.dayOne) || null;
						} else {
							dealSet.maxLastTradeDate = Number(this.dayOne) || null;
							dealSet.minLastTradeDate = Number(this.dayOne) || null;
						}
						dealSet.rType = Number(this.lastTimeType);
					} else {
						let start = typeof(this.dateOne) == 'number' ? this.dateOne : Date.parse(this.dateOne);
						let end = typeof(this.dateTwo) == 'number' ? this.dateTwo : Date.parse(this.dateTwo);
						if(start > end) {
							this.$message.error('右侧时间要大于左侧时间！');
							return
						}
						dealSet.maxLastTradeTime = dateFormat(this.dateTwo, 'YY-MM-DD') + ' 23:59:59';
						dealSet.minLastTradeTime = dateFormat(this.dateOne, 'YY-MM-DD') + ' 00:00:00';
					}
				}

				if(dealSet.countCheck) {
					dealSet.fType = Number(this.dealVal);
					if(this.dealVal == 1) {
						if(Number(this.dealTwo) < Number(this.dealOne)) {
							this.$message.error('右侧成交次数要大于左侧成交次数！');
							return
						}
						dealSet.maxTradeCount = this.dealTwo ? Number(this.dealTwo) : null;
						dealSet.minTradeCount = this.dealOne ? Number(this.dealOne) : null;
					} else {
						dealSet.maxTradeCount = this.dealAbout ? Number(this.dealAbout) : null;
						dealSet.minTradeCount = this.dealAbout ? Number(this.dealAbout) : null;
					}
					if(!dealSet.minTradeCount || !dealSet.maxTradeCount) {
						this.$message.error('累计成交次数需为正整数！')
						return
					}
				}

				if(dealSet.amountCheck) {
					dealSet.xType = Number(this.moneyVal);
					if(this.moneyVal == 1) {
						if(Number(this.moneyTwo) < Number(this.moneyOne)) {
							this.$message.error('右侧交易金额要大于左侧交易金额！');
							return
						}
						dealSet.maxTradeAmount = this.moneyTwo ? Number(this.moneyTwo) : null;
						dealSet.minTradeAmount = this.moneyOne ? Number(this.moneyOne) : null;
					} else {
						dealSet.maxTradeAmount = this.moneyAbout ? Number(this.moneyAbout) : null;
						dealSet.minTradeAmount = this.moneyAbout ? Number(this.moneyAbout) : null;
					}
					if(!dealSet.minTradeAmount || !dealSet.maxTradeAmount) {
						this.$message.error('累计成交金额需为正整数！')
						return
					}
				}

				if(dealSet.priceCheck) {
					dealSet.yType = Number(this.priceVal);
					if(this.priceVal == 1) {
						if(Number(this.priceTwo) < Number(this.priceOne)) {
							this.$message.error('右侧客单价要大于左侧客单价！');
							return
						}
						dealSet.maxAvgPrice = this.priceTwo ? Number(this.priceTwo) : null;
						dealSet.minAvgPrice = this.priceOne ? Number(this.priceOne) : null;
					} else {
						dealSet.maxAvgPrice = this.priceAbout ? Number(this.priceAbout) : null;
						dealSet.minAvgPrice = this.priceAbout ? Number(this.priceAbout) : null;
					}
					if(!dealSet.maxAvgPrice || !dealSet.minAvgPrice) {
						this.$message.error('平均客单价需为正整数！')
						return
					}
				}

				if(dealSet.firstOrderCheck) {
					const [left,right, mode, dateType] = this.$refs.firstOrder[0].getValue();
					dealSet.firstOrderDateType = dateType || 2
					if(dateType !== 1) {
						dealSet.leftFirstOrderDate = mode < 2 ? left || null : null;
						dealSet.rightFirstOrderDate = mode > 0 ? right || null : null;
					} else {
						if(left > right) {
							this.$message.error('右侧时间要大于左侧时间！');
							return
						}
						dealSet.rightFirstOrderDate = formatDate('yyyy-MM-dd 23:59:59',right);
						dealSet.leftFirstOrderDate = formatDate('yyyy-MM-dd 00:00:00',left);
					}
        		}
				if(dealSet.closeTradeCountCheck) {
					const [left,right, mode ] = this.$refs.closeTradeCount[0].getValue()
					dealSet.leftCloseTradeCount = mode < 2 ? left || null : null;
					dealSet.rightCloseTradeCount = mode > 0 ? right || null : null;
				}

				if(dealSet.closeTradeAmountCheck) {
					const [left,right, mode ] = this.$refs.closeTradeAmount[0].getValue()
					dealSet.leftCloseTradeAmount = mode < 2 ? left || null : null;
					dealSet.rightCloseTradeAmount = mode > 0 ? right || null : null;
				}

				if(dealSet.itemNumCheck) {
					const [left,right, mode ] = this.$refs.itemNumCheck[0].getValue()
					dealSet.leftItemNumCheck = mode < 2 ? left || null : null;
					dealSet.rightItemNumCheck = mode > 0 ? right || null : null;
				}

				if(gradeCheck) {
					if(!arr.length) {
						this.$message.error('请设置会员等级！');
						return
					}
					dealSet.gradeCheck = true;
					dealSet.grade = JSON.stringify(arr);
				}

				data.dealSet = JSON.stringify(dealSet);
				this.loadingPage = true;
				this.saveRule(data);
			},
			saveRule(data) {
				http({
					api_name: 'crmCrowdEdit',
					vm: this,
					data: data
				}, (res) => {
          point("37977.39398.39421");
					this.loadingPage = false;
					if(res.data.id){
						data.id = res.data.id;
						data.created = dateFormat(new Date(), 'YY-MM-DD HH:MM:SS');
						data.isAdd = true;
					}
					this.$emit('sureBut', false, data);
				}, (error) => {this.loadingPage = false;});
			},
			initData() {
				this.chooseArr = [];
				this.diaInput = this.rowObj.crowdName;
				this.input = this.rowObj.crowdDesc;
				this.diaValue = this.rowObj.groupId;
        this.rowObj.dealSet = (typeof(this.rowObj.dealSet) == 'string') ? JSON.parse(this.rowObj.dealSet) : this.rowObj.dealSet;
        //默认人群特殊处理
        // this.defaultMemberCheck(this.rowObj.dealSet);
				// 警告 这种代码只是我迭代的 不是我创造的！！！！！！！！！！！！！！
				for (let key in this.rowObj.dealSet) {
					let val = this.rowObj.dealSet[key]
					this.diaArr.forEach(item => {
						item.title == key && (item.check = !!val);
					})
					this.memberLevel.forEach(item => {
						item.title == key && (item.check = !!val);
					})
				}
				this.diaArr.forEach((item) => {
					this.chooseItem(item, true);
				});
				this.memberLevel.forEach((item) => {
					this.chooseItem(item, true);
				});
				// 最后交易时间
				this.lastTime = this.rowObj.dealSet.timeType ? this.rowObj.dealSet.timeType.toString() : '0';

				this.lastTimeType = this.rowObj.dealSet.rType ? this.rowObj.dealSet.rType.toString() : '0';
				this.dateOne = this.rowObj.dealSet.minLastTradeTime ? this.rowObj.dealSet.minLastTradeTime : (new Date());
				this.dateTwo = this.rowObj.dealSet.maxLastTradeTime ? this.rowObj.dealSet.maxLastTradeTime : ((new Date).setDate((new Date).getDate() + 30));

				this.dayOne = this.rowObj.dealSet.minLastTradeDate ? this.rowObj.dealSet.minLastTradeDate : '';
				this.dayTwo = this.rowObj.dealSet.maxLastTradeDate ? this.rowObj.dealSet.maxLastTradeDate : '';

				//累计成交次数
				this.dealVal = this.rowObj.dealSet.fType ? this.rowObj.dealSet.fType.toString() : '0';
				//介于
				this.dealAbout = this.rowObj.dealSet.fType == 0 ? (this.rowObj.dealSet.maxTradeCount) : (this.rowObj.dealSet.fType == 2 ? (this.rowObj.dealSet.minTradeCount) : '');
				//大于、小于、等于
				this.dealOne = this.rowObj.dealSet.minTradeCount ? this.rowObj.dealSet.minTradeCount : '';
				this.dealTwo = this.rowObj.dealSet.maxTradeCount ? this.rowObj.dealSet.maxTradeCount : '';

				//累计成交金额
				this.moneyVal = this.rowObj.dealSet.xType ? this.rowObj.dealSet.xType.toString() : '0';
				this.moneyAbout = this.rowObj.dealSet.xType == 0 ? (this.rowObj.dealSet.maxTradeAmount) : (this.rowObj.dealSet.xType == 2 ? (this.rowObj.dealSet.minTradeAmount) : '');
				this.moneyOne = this.rowObj.dealSet.minTradeAmount ? this.rowObj.dealSet.minTradeAmount : '';
				this.moneyTwo = this.rowObj.dealSet.maxTradeAmount ? this.rowObj.dealSet.maxTradeAmount : '';

				//平均客单价
				this.priceVal = this.rowObj.dealSet.yType ? this.rowObj.dealSet.yType.toString() : '0';
				this.priceAbout = this.rowObj.dealSet.yType == 0 ? (this.rowObj.dealSet.maxAvgPrice) : (this.rowObj.dealSet.yType == 2 ? (this.rowObj.dealSet.minAvgPrice) : '');
				this.priceOne = this.rowObj.dealSet.minAvgPrice ? this.rowObj.dealSet.minAvgPrice : '';
				this.priceTwo = this.rowObj.dealSet.maxAvgPrice ? this.rowObj.dealSet.maxAvgPrice : '';


				// 代码全靠枚举 666
				const {
				  	firstOrderDateType,leftFirstOrderDate,rightFirstOrderDate, // 首次下单时间
					leftCloseTradeCount,rightCloseTradeCount, // 关闭交易次数
					leftCloseTradeAmount,rightCloseTradeAmount, // 关闭交易金额
					leftItemNumCheck,rightItemNumCheck, // 购买商品件数
				} = this.rowObj.dealSet
				this.firstOrderDateType = firstOrderDateType || 1
				this.leftFirstOrderDate = leftFirstOrderDate || (new Date())
				this.rightFirstOrderDate = rightFirstOrderDate || (new Date(((new Date).setDate((new Date).getDate() + 30))))
				this.leftCloseTradeCount = leftCloseTradeCount
				this.rightCloseTradeCount = rightCloseTradeCount
				this.leftCloseTradeAmount = leftCloseTradeAmount
				this.rightCloseTradeAmount = rightCloseTradeAmount
				this.leftItemNum = leftItemNumCheck
				this.rightItemNum = rightItemNumCheck

				this.listData();
				setTimeout(() => {
					if(this.rowObj.dealSet.grade) {
						let arr = JSON.parse(this.rowObj.dealSet.grade);
						arr.forEach(item => {
							this.checkedList.push(this.levelName[item]);
						});
					}
				}, 10);
      },
      defaultMemberCheck(obj) {//默认人群特殊处理
        obj.timeType && (obj.timeCheck = true);//最后交易时间
        obj.fType && (obj.countCheck = true);//累计成交次数
        obj.xType && (obj.amountCheck = true);//累计成交金额
        obj.yType && (obj.priceCheck = true);//平均客单价
        obj.timeType && (obj.timeCheck = true);//最后交易时间
        obj.firstOrderDateType && (obj.firstOrderCheck = true);//首次下单时间
        (obj.leftCloseTradeCount || obj.rightCloseTradeCount) && (obj.closeTradeCountCheck = true);//关闭交易次数
        (obj.leftCloseTradeAmount || obj.rightCloseTradeAmount) && (obj.closeTradeAmountCheck = true);//关闭交易金额
        (obj.leftItemNumCheck || obj.rightItemNumCheck) && (obj.itemNumCheck  = true);//购买商品件数
        (obj.grade && obj.grade.length) && (obj.gradeCheck = true);//会员等级
        return obj;
      },
			deleteItem(item) {
				this.chooseItem(item);
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
		width: 270px;
		.left_ul{
			padding-top: 10px;
			li{
				width: 98px;
				border: 1px solid rgb(215,215,215);
				height: 30px;
				text-align: center;
				line-height: 30px;
				cursor: pointer;
				background-color: #fff;
			}
			.choose{
				background-image: url(../../../assets/images/u472.png);
				background-repeat: no-repeat;
				background-position: 84px 16px;
				border: 1px solid rgb(48,137, 220);
			}
		}
	}
	.dia_style{
		box-sizing: border-box;
		padding: 14px;
		background: rgb(243,247,254);
		border: 1px solid rgb(215,215,215);
		max-height: 214px;
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
      width: 66px;
		}
		.dealWidth{
      width: 92px;
		}
		.lastdayWidth{
			width: 50px;
		}
		.dayWidthSel{
			width: 90px
		}
		.lastSelect{
			width: 120px;
		}
	}
	.dia_right{
		width:450px;
		button{
			width: 80px;
		}
	}
	.errorMess{
		height: 48px;
		.reds{
			color: red;
			font-size: 12px;
			margin-left: 74px;
		}
	}

</style>
