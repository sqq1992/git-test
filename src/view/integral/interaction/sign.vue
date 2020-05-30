<template>
	<div class="sign-box interaction-box" v-loading="createLoading">
		<div v-if="signData">
<el-form :label-position="labelPosition" label-width="200px" :model="signData">
			<el-form-item label="活动名称：">
				<el-input class="w200" :disabled="activityStatusVal == 'invalid'"  @keyup.native="checkActName(signData.activityName)" v-model.trim="signData.activityName" auto-complete="off"></el-input>
				<span>{{signData .activityName.length}}/20</span>
				<p class="error-tip red" v-if="actNameError!=''">{{actNameError}}</p>
			</el-form-item>
			<el-form-item label="活动起止时间：">
				<el-date-picker
					v-model="signData.startTime"
					:clearable = false
					type="datetime"
					placeholder="选择日期"
					class="ui-filter-pd w200"
					:picker-options="pickerStartTime" :disabled="activityStatus">
				</el-date-picker> -
				<el-date-picker
					v-model="signData.endTime"
					:clearable = false
					type="datetime"
					placeholder="选择日期"
					class="ui-filter-pd w200"
					:picker-options="pickerEndTime" :disabled="activityStatusVal == 'invalid'">
				</el-date-picker>
				<span class="ml_5 gray ft-14">活动有效期不得超过订购有效期</span>
				<a href="http://fw.jd.com/657606.html" class="renew" target="_blank">立即续订</a>
			</el-form-item>
			<el-form-item label="参与等级：">
				<el-checkbox disabled checked>全体会员</el-checkbox>
			</el-form-item>
			<el-form-item label="签到设置：">
				<div class="sign-set-conten">
					<div class="sign-set">
						<span class="lab">每日签到奖励：</span>
						<p><el-input class="w50" :disabled="activityStatus" @blur="blurMore(signData.everydaySignSetting.signRuleDesc[0].pointValue,'everydaySignSetting','pointValue',0)"  v-model.trim="signData.everydaySignSetting.signRuleDesc[0].pointValue" auto-complete="off"></el-input><span class="ml_5">积分</span></p>
					</div>
					<div class="sign-set" v-for="(obj,index) in signData.continueSignSetting.signRuleDesc">
						<span class="lab">连续签到奖励：</span>
						<el-checkbox :disabled="activityStatus" v-model="obj.continueSign">开启连续签到奖励</el-checkbox>
						<div>
							<span>每连续签到</span><el-input  @blur="blurMore(obj.continueDays,'continueSignSetting','continueDays',index)" class="w50 ml_5 mr_5" :disabled="!obj.continueSign || activityStatus"  v-model.trim="obj.continueDays" auto-complete="off"></el-input>天，可获得额外奖励：
							<el-checkbox-group v-model="obj.rewardType" @change="handlecheckedRewardsChange" style="display:inline-block;margin-left:10px;">
								<el-checkbox v-for="reward in rewardType" :disabled="!obj.continueSign || activityStatus"  :label="reward" :key="reward">{{rewardTypeMap[reward]}}</el-checkbox>
							</el-checkbox-group>
						</div>
						<div>
							<p><span>积分：</span><el-input class="w50" @blur="blurMore(obj.pointValue,'continueSignSetting','pointValue',index)"  :disabled="obj.rewardType.indexOf('points') == -1 || activityStatus || !obj.continueSign"  v-model.trim="obj.pointValue" auto-complete="off"></el-input><span class="ml_5">积分</span></p>
							<p><span>优惠券：</span><span>{{obj.giftName || '暂无'}}</span><el-button class="ml_5" type="text" @click="checkCoupon(index,'continueSignSetting', obj)" v-if="obj.rewardType.indexOf('coupon') != -1 && !activityStatus && obj.continueSign">{{obj.giftName ? '重新选择':'选择优惠券'}}</el-button></p>
							<p v-if="obj.giftMsg">{{obj.giftMsg}}</p>
						</div>
						<p class="error-tip red" v-if="obj.errorTip">{{obj.errorTip}}</p>
					</div>
					<div class="sign-set" style="border: 0">
                       <span class="lab">累计签到奖励：</span>
					   <el-checkbox :disabled="activityStatus" @change="setTotalSign()"  v-model="totalSignVal">开启累计签到奖励</el-checkbox><span class="fc_999">（最多可设置5档累计签到奖励）</span>
					   <div class="sign-set-item mb_10" v-for="(obj,index) in signData.accumulatedSignSetting.signRuleDesc">
							<div>
								<p>{{grade[index]}}档</p>
								<span>累计签到</span><el-input class="w50 ml_5 mr_5" @blur="blurMore(obj.totalDays,'accumulatedSignSetting','totalDays',index)" :disabled="!totalSignVal || activityStatus"  v-model.trim="obj.totalDays" auto-complete="off"></el-input>天，可获得额外奖励：
								<el-checkbox-group v-model="obj.rewardType" @change="handlecheckedRewardsChange(obj)" style="display:inline-block;margin-left:10px;">
									<el-checkbox v-for="reward in rewardType" :disabled="!totalSignVal || activityStatus"  :label="reward" :key="reward">{{rewardTypeMap[reward]}}</el-checkbox>
								</el-checkbox-group>
							</div>
							<div>
								<p><span>积分：</span><el-input @blur="blurMore(obj.pointValue,'accumulatedSignSetting','pointValue',index)" class="w50" :disabled="obj.rewardType.indexOf('points') == -1 || activityStatus || !totalSignVal"  v-model.trim="obj.pointValue" auto-complete="off"></el-input><span class="ml_5">积分</span></p>
								<p><span>优惠券：</span><span>{{obj.giftName || '暂无'}}</span><el-button class="ml_5" type="text" @click="checkCoupon(index,'accumulatedSignSetting', obj)" v-if="obj.rewardType.indexOf('coupon') != -1 && !activityStatus && totalSignVal">{{obj.giftName ? '重新选择':'选择优惠券'}}</el-button></p>
							    <p v-if="obj.giftMsg">{{obj.giftMsg}}</p>
							</div>
							<p class="error-tip red" v-if="obj.errorTip">{{obj.errorTip}}</p>
							<a v-if="index != 0 && !activityStatus" class="del" @click="del(index)" href="javascript:;"></a>
					   </div>
					   <el-button v-if="signData.accumulatedSignSetting.signRuleDesc.length<5 && !activityStatus" size='small' @click="add()" class="queryBtn">新增一档</el-button>
					</div>
				</div>
			</el-form-item>
			<el-form-item label="活动规则:">
				<el-button size='small' @click="setRules()" class="queryBtn">自动生成</el-button>
				<span class="ml_5">应平台要求请使用自动生成的活动规则内容，可自定义添加规则内容</span>
			</el-form-item>
			<div class="rules" ref="editArea" contenteditable="true" v-if="signData.activityDesc" v-html="formatActivityDesc(signData.activityDesc)"></div>
			<div class="rules" ref="editArea" contenteditable="true" v-else>
				<p>1.活动时间：{{today}} 至 {{today30}}</p>
				<p>2.参与会员：全体会员</p>
				<p>3.每日签到可获得1积分</p>
				<p>4.奖品数量有限，先到先得</p>
			</div>
			<div class="sign-btn">
				<el-button size='small' class="queryBtn" @click="back">{{activityStatusVal != 'invalid'? '取消':'返回'}}</el-button>
				<el-button type="primary" v-if="activityStatusVal != 'invalid'" size='small' @click="createAct()">{{activityId ? '保存活动': '保存并创建活动'}}</el-button>
			</div>
		</el-form>
		<coupon-dialog ref="addCoupon" @showCoupon="showCouponMsg" :data="currentAcitveData"></coupon-dialog>
		</div>
	</div>
</template>

<script>
  import formatActivityDesc from './util';
import dateFormat from 'src/common/dateFormat.js';
import { clone, isWhiteList } from 'src/common/public.js';
import couponDialog from './coupons.vue';
import ajax from 'src/api/index.js';
import store from 'src/store.js';
	export default{
		data() {
			return{
				activityId: '',
				hsitoryUrl: '',
				activityStatusVal: '',
				totalSignVal: false,
				isSubmit: false,
				isOk: true,
				shopName: '',
				activityStatus: false,
				actNameError: "",
				labelPosition: 'right',
				rewardType: ['points','coupon'],
				today: dateFormat(new Date().setHours(0,0,0,0),'YY-MM-DD HH:MM:SS'),
				today30: dateFormat(new Date(new Date().getTime() + 2592000000).setHours(23,59,59,59),'YY-MM-DD HH:MM:SS'),
				rewardTypeMap: {
					'points': '积分',
					'coupon': '优惠券'
				},
				grade: ['一','二','三','四','五'],
				currentAcitveData: {},
				checkCouponName: '',
				signData:{
					 activityName: '每日签到'+dateFormat(new Date(),'YYMMDDHHMMSS'),
				     startTime: dateFormat(new Date().setHours(0,0,0,0),'YY-MM-DD HH:MM:SS'),
					 endTime: dateFormat(new Date(new Date().getTime() + 2592000000).setHours(23,59,59,59),'YY-MM-DD HH:MM:SS'),
					 level: '0,1,2,3,4,5',
					 everydaySignSetting: {
						 "signType": "everyDay",
						 "signRuleDesc" : [
							 {
								 "pointValue": "1",
								 "rewardType": [],
								 "couponId": "",
								 "link": "",
								 "giftName": "",
								 "couponCheckType": "",
								 "bindType": "",
								 "giftMsg": "",
								 "quota": "",
								 "couponValue": "",
								 "couponSource": ""
							 }
						 ]

					 },
					 continueSignSetting: {//连续签到
					     "signType": "continues",
						 "signRuleDesc" : [
							 {
								 "continueDays": "",
								 "continueSign": false,
								 "pointValue": "",
								 "rewardType": [],
								 "couponId": "",
								 "link": "",
								 "giftName": "",
								 "couponCheckType": "",
								 "bindType": "",
								 "giftMsg": "",
								 "quota": "",
								 "couponValue": "",
								 "couponSource": ""
							 }
						 ]
					 },
					 accumulatedSignSetting: {//累计签到
						"signType": "total",
						"signRuleDesc": [
							{
								"totalSign": false,
								"totalDays": "",
								"rewardType": [],
								"pointValue": "",
								"couponId": "",
								"link": "",
								"giftName": "",
								"couponCheckType": "",
								"bindType": "",
								"giftMsg": "",
								"quota": "",
								"couponValue": "",
								"couponSource": ""
							}
						]
					 },
					 activityDesc: ''
				},
				createLoading: false,
				pickerStartTime: {
					disabledDate: (time) => {
						if(isWhiteList()){
							return false;
						}
						return (time.getTime() > new Date(this.signData.endTime).getTime()) || (time.getTime() < Date.now() - 8.64e7);
					}
				},
				pickerEndTime: {
					disabledDate: (time) => {
						if(isWhiteList()){
							return false;
						}
						return time.getTime() <  new Date(new Date().setHours(0,0,0,0)).getTime() || time.getTime() > new Date(store.state.user.endTime).getTime()
					}
				},
			}
		},
	    beforeRouteEnter(to, from, next){
			next(vm => {
				vm.hsitoryUrl = from.path;
			})
		},
		watch: {
			'signData.startTime'(val){
				if(val){
					this.pickerEndTime = {
						disabledDate(time) {
							if(isWhiteList()){
								return false;
							}
							return time.getTime() < new Date(val).setHours(0,0,0,0) || time.getTime() > new Date(store.state.user.endTime).getTime()
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
			'signData.endTime'(val){
				if(val){
					this.pickerStartTime = {
						disabledDate: (time) => {
							if(isWhiteList()){
								return false;
							}
							return (time.getTime() > new Date(this.signData.endTime).getTime()) || (time.getTime() < Date.now() - 8.64e7);
						}
					}
				} else {
					this.pickerStartTime = {
						disabledDate(time){
							return false;
						}
					};
				}
			},
		},
		created(){
			//判断默认时间与软件到期时间
			if(new Date(store.state.user.endTime).getTime() < new Date().getTime() + 2592000000) {
				this.signData.endTime = store.state.user.endTime;
				this.today30 = store.state.user.endTime;
			};
			this.activityId = this.$route.query.id;
			this.getSignMsg(this.activityId)
		},
		components: {
			couponDialog
		},
		methods: {
      formatActivityDesc(value) {
        return formatActivityDesc(value);
      },
			checkActName(_val) {
               if(!_val || _val == '') {
				  this.actNameError = '活动名称不能为空！';
				   this.isOk = false;
			   }else if(_val.length>20) {
				   this.actNameError = '活动名称最多20个字！';
                   this.isOk = false;
			   }else {
				   this.actNameError = '';
			   }
			},
			setTotalSign() {
			   let vm = this;
               vm.signData.accumulatedSignSetting.signRuleDesc.forEach(item => {
				   item.totalSign = vm.totalSignVal;
			   })
			},
			handlecheckedRewardsChange(obj) {

			},
			checkCoupon(index,name, obj) {
			   let chheckId = this.signData[name].signRuleDesc[index].couponId || '',
			       custom = '';
			   this.checkCouponName = name;
			   if(obj.giftMsg && !obj.couponId) {
				custom =  {
						bindType: obj.bindType,
						name: obj.giftName,
						discountType: obj.couponCheckType,
						quota: obj.quota,
						discount: obj.couponValue,
						link: obj.link
					};
			   };
			   this.$refs.addCoupon.addCoupons(index,chheckId,custom);
			},
			showCouponMsg(data,index) {
				let _discount = data.discountType == 1 ? data.discount : data.discount*10,
					type = data.bindType == 1 ? '店铺优惠券' : '商品优惠券',
					_obj = this.signData[this.checkCouponName].signRuleDesc[index],
					_giftMsg = '';
				this.$set(_obj,'giftName',data.name);
				this.$set(_obj,'couponId',data.couponId);
				_obj.link = data.link;
				_obj.couponCheckType = data.discountType;
				_obj.bindType = data.bindType;
				_obj.couponValue = _discount;
				_obj.quota = data.quota;
				_giftMsg = type + '，' + '满'+(data.quota || '-')+'元可用，'+'优惠券面值：'+_discount+(data.discountType == 1 ? '元':'折');
				this.$set(_obj,'giftMsg',_giftMsg);
				this.$set(_obj,'couponSource',data.couponSource);
			},
			blurMore(obj,item,child,index) {
				if(!obj) {
					this['signData'][item]['signRuleDesc'][index][child] = '1';
					return;
				}else if(isNaN(Number(obj)) || /\./.test(obj) || /\+/.test(obj) || Number(obj <= 0)) {
					this.$message.error('只能输入正整数！');
					this['signData'][item]['signRuleDesc'][index][child] = '1';
					return;
				}
				return;
			},
			blurInp(item) {
				let obj = this['signData'][item];
				if(!obj) {
					this['signData'][item] = '1';
					return;
				}else if(isNaN(Number(obj)) || /\./.test(obj) || /\+/.test(obj) || Number(obj <= 0)) {
					this.$message.error('只能输入正整数！');
					this['signData'][item] = '1';
					return;
				}
				return;
			},
			add() {
				var vm = this;
				this.signData.accumulatedSignSetting.signRuleDesc.push({
					"totalSign": vm.signData.accumulatedSignSetting.signRuleDesc[0].totalSign,
					"totalDays": "",
					"rewardType": [],
					"pointValue": "",
					"couponId": "",
					"link": "",
					"giftName": "",
					"couponCheckType": "",
					"bindType": "",
					"giftMsg": "",
					"quota": "",
					"couponValue": ""
				})
			},
			del(index) {
                this.signData.accumulatedSignSetting.signRuleDesc.splice(index,1)
			},
			setRules() {
			   let list = '',
				   rewardList = '',
				   index = 3;
			   //连续签到
			   this.signData.continueSignSetting.signRuleDesc.forEach(item => {
				   if(item.continueSign && item.continueDays) {
					   if(item.rewardType.length) {
							let msg = '';
							index ++;
							item.rewardType.forEach(obj => {
								switch (obj) {
									case 'points':
										if(item.pointValue) {
											msg ? msg += '、' : '';
											msg += item.pointValue+'个积分';
										};
										break;
									case 'coupon':
										if(item.giftName) {
											msg ? msg += '、' : '';
											msg += item.giftName+'优惠券';
										};
										break;
									default:
										break;
								}
							});
							msg ? rewardList += '<p>'+index+'.每连续签到'+item.continueDays+'天可获得'+msg+'</p>' : '';
					   }
				   }
			   });
			   //累计签到
               	this.signData.accumulatedSignSetting.signRuleDesc.forEach(item => {
				   if(item.totalSign && item.totalDays) {
					   if(item.rewardType.length) {
							let msg = '';
							index ++;
							item.rewardType.forEach(obj => {
								switch (obj) {
									case 'points':
										if(item.pointValue) {
											msg ? msg += '、' : '';
											msg += item.pointValue+'个积分';
										};
										break;
									case 'coupon':
										if(item.giftName) {
											msg ? msg += '、' : '';
											msg += item.giftName+'优惠券';
										};
										break;
									default:
										break;
								}
							});
							msg ? rewardList += '<p>'+index+'.累计签到'+item.totalDays+'天可获得'+msg+'</p>' : '';
					   }
				   }
			   });
			   list += [
                    '<p>1.活动时间：'+dateFormat(this.signData.startTime,'YY-MM-DD HH:MM:SS')+' 至 '+dateFormat(this.signData.endTime,'YY-MM-DD HH:MM:SS')+'</p>',
					'<p>2.参与会员：全体会员</p>',
					'<p>3.每日签到可获得'+this.signData.everydaySignSetting.signRuleDesc[0].pointValue+'积分</p>',
					rewardList,
					'<p>'+(index+1)+'.奖品数量有限，先到先得</p>',
			   ].join('');
			   this.signData.activityDesc = list;
			},
			createAct() {
				let vm = this,
					signParma = clone(vm.signData);
				vm.isOk = true;
				vm.checkActName(signParma.activityName);
				//每日签到奖励
				let everydaySignSetting = signParma.everydaySignSetting.signRuleDesc[0];
				everydaySignSetting.rewardType = 'points';
				//空字段删除
				for (let item in everydaySignSetting) {
					everydaySignSetting[item] ? '': delete everydaySignSetting[item];
				};
				//连续签到奖励
				signParma.continueSignSetting.signRuleDesc.forEach((item,index) => {
					delete item.giftMsg;
					let errorMsg = '';
					item.rewardType = item.rewardType.join(',');
					if(item.continueSign) {
						if(item.rewardType.length == 0) {
								errorMsg = '请选择至少一项奖励！';
								vm.isOk = false;
						}else if (!item.continueDays) {
								errorMsg = '请设置连续签到天数！';
								vm.isOk = false;
						}else if(item.rewardType.indexOf('points') != -1 && !item.pointValue) {
								errorMsg = '请设置奖励积分值！';
								vm.isOk = false;
						}else if(item.rewardType.indexOf('coupon') != -1 && !item.giftName) {
								errorMsg = '请选择优惠券奖励！';
								vm.isOk = false;
						};
						if(vm.isOk) {
						   vm.$delete(item, 'errorTip');
						}else {
							vm.$set(vm.signData.continueSignSetting.signRuleDesc[index], 'errorTip', errorMsg)
						}
					}
					//空字段删除
					for (let obj in item) {
						item[obj] === '' ? delete item[obj]: '';
					};
				});
				//累计签到奖励
				let totalArr = [],_totalSign = vm.totalSignVal;
				signParma.accumulatedSignSetting.signRuleDesc.forEach((item,index) => {
					delete item.giftMsg;
					let errorMsg = '';
					item.rewardType = item.rewardType.join(',')
					item.totalSign = _totalSign;
					if(item.totalSign) {
						if(item.rewardType.length == 0) {
								errorMsg = '请选择至少一项奖励！';
								vm.isOk = false;
						}else if (!item.totalDays) {
								errorMsg = '请设置累计签到天数！';
								vm.isOk = false;
						}else if(item.rewardType.indexOf('points') != -1 && !item.pointValue) {
								errorMsg = '请设置奖励积分值！';
								vm.isOk = false;
						}else if(item.rewardType.indexOf('coupon') != -1 && !item.giftName) {
								errorMsg = '请选择优惠券奖励！';
								vm.isOk = false;
						}else if(item.totalDays) {
                          if(totalArr.length > 0) {
							  totalArr.forEach((k,t) => {
								  if(Number(item.totalDays) <= k) {
										errorMsg = '累计签到奖励设置天数必须呈递增状态，请重新设置';
								        vm.isOk = false;
                                    }
							  })
                            }
                            totalArr.push(Number(item.totalDays));
						}
						if(vm.isOk) {
						   vm.$delete(item, 'errorTip');
						}else {
						   vm.$set(vm.signData.accumulatedSignSetting.signRuleDesc[index], 'errorTip', errorMsg)
						}
					}
					//空字段删除
					for (let obj in item) {
						item[obj] === '' ? delete item[obj]: '';
					};
				});
				delete signParma.status;
				if(!vm.isOk) {
					this.$message.error('信息填写有误，请检查后重新提交！');
					return false;
				};
				if(vm.isOk && !vm.isSubmit) {
				   //拦截关键词
				   let _activityDesc = vm.$refs.editArea.innerText,
					   sensitive = ['解释','解释权','商家所有','归商家所有'],
					   isHasSensitive = false;
					   sensitive.forEach(obj => {
						   if(_activityDesc.indexOf(obj) != -1) {
                                isHasSensitive = true;
						   }
					   });
					if(isHasSensitive)  {
						this.$message.error('活动规则不合法，请使用系统自动生成规则！');
						return false;
					}

				   signParma.activityDesc = _activityDesc;
				   signParma.everydaySignSetting = JSON.stringify(signParma.everydaySignSetting);
				   signParma.continueSignSetting = JSON.stringify(signParma.continueSignSetting);
				   signParma.accumulatedSignSetting = JSON.stringify(signParma.accumulatedSignSetting);
				   signParma.startTime = signParma.startTime ? (dateFormat(signParma.startTime,'YY-MM-DD HH:MM:SS')) : '';
                   signParma.endTime = signParma.endTime ? (dateFormat(signParma.endTime,'YY-MM-DD HH:MM:SS')) : '';
          if(new Date(signParma.startTime) > new Date(signParma.endTime)) {
            vm.$message.error('开始时间不能大于结束时间！');
            return false;
          }
				   vm.createLoading = true;
				   vm.isSubmit = true;
				   ajax({
						api_name: 'addSignRule',
						data: signParma
					}, result => {
						vm.createLoading = false;
						this.$message.success(vm.activityId ? '活动修改并保存成功！': '活动创建成功！');
						setTimeout(() => {
							this.$router.push({path: '/interactionList'});
						}, 1000);
					}, error => {
						vm.createLoading = false;
						vm.isSubmit = false;
						vm.$message.error(error.message || (vm.activityId ?'活动修改并保存失败！':'活动创建失败！'));
					});
				}
			},
			getSignMsg(id) {
				let vm = this,
				    _id = id || '';
				vm.createLoading = true;
				_id ? vm.signData = '' : '';
				 ajax({
					api_name: 'getSignRuleById',
					data: {
						id: _id
					},
					vm: this
				}, result => {
					vm.createLoading = false;
					vm.shopName =  result.data.shopName;
					if(_id) {
						vm.$set(vm,'signData',result.data);
						vm.signData.everydaySignSetting = JSON.parse(vm.signData.everydaySignSetting);
						vm.signData.continueSignSetting = JSON.parse(vm.signData.continueSignSetting);
						vm.signData.accumulatedSignSetting = JSON.parse(vm.signData.accumulatedSignSetting);
						vm.activityStatus = result.data.status == 'valid' || result.data.status == 'invalid' ? true : false;
						vm.activityStatusVal = result.data.status;
						vm.totalSignVal = vm.signData.accumulatedSignSetting.signRuleDesc[0].totalSign;
						vm.signData.everydaySignSetting.signRuleDesc.forEach(item => {
							  let _rewardType = item.rewardType ? item.rewardType.split(',') : [];
							  vm.$set(item,'rewardType',_rewardType);
						})
						vm.signData.continueSignSetting.signRuleDesc.forEach(item => {
							 let _rewardType = item.rewardType ? item.rewardType.split(',') : [];
							 vm.$set(item,'rewardType',_rewardType);
							 if(item.couponId || (!item.couponId && item.couponSource == 2)) {
                                let _type = item.bindType == 1 ? '店铺优惠券' : '商品优惠券',
							      _discount = item.couponCheckType == 1 ? item.couponValue : data.couponValue*10;
							    item.giftMsg = _type + '，' + '满'+(item.quota || '-')+'元可用，'+'优惠券面值:'+_discount+(item.couponCheckType == 1 ? '元':'折');
							 }
						})
						vm.signData.accumulatedSignSetting.signRuleDesc.forEach(item => {
							  let _rewardType = item.rewardType ? item.rewardType.split(',') : [];
							  vm.$set(item,'rewardType',_rewardType);
							  if(item.couponId || (!item.couponId && item.couponSource == 2)) {
                                let _type = item.bindType == 1 ? '店铺优惠券' : '商品优惠券',
							          _discount = item.couponCheckType == 1 ? item.couponValue : data.couponValue*10;
							    item.giftMsg = _type + '，' + '满'+(item.quota || '-')+'元可用，'+'优惠券面值:'+_discount+(item.couponCheckType == 1 ? '元':'折');
							  }
						})
					};

				}, error => {
						vm.$message.error(error.message || '获取活动信息失败！');
				});
			},
			back() {
				let _url = this.hsitoryUrl == '/' ? '/interactionCenter' :  this.hsitoryUrl;
				this.$router.push({path: _url})
			}
		}
	}
</script>
<style lang="less">
.sign-box {
	.el-input{
		height: 30px;
		line-height: 28px;
		&.w200 {
			width: 200px;
		}
		&.w150 {
			width: 150px;
		}
		&.w50 {
			width: 50px;
		}
		.el-input__inner{
			width: 100%;
			height: 100%;
		}
	}
	.el-form-item {
		margin-bottom: 10px;
	}
}
</style>
<style lang="less" scoped>
  .sign-box {
	  padding: 20px 0 50px 20px;
	  box-sizing: border-box;
	  .gray {
		  color: #666;
	  }
	  .renew {
		  color: #3089DE;
		  font-size: 14px;
		  margin-left: 5px;
	  }
	  .ml_5 {
		  margin-left: 5px;
	  }
	  .mr_5 {
          margin-right: 5px;
	  }
	  .mt_10 {
		  margin-top: 10px;
	  }
	  .mb_10 {
		  margin-bottom: 10px;
	  }
	  .fc_999 {
		  color: #999;
	  }
	  .sign-set-conten {
		  padding: 10px;
		  min-width: 600px;
		  display: inline-block;
		  background: #f6f6f6;
		  border: 1px solid #ddd;
		  .sign-set {
				padding: 10px 0 10px 110px;
				border-bottom: 1px solid #ddd;
				position: relative;
				.lab {
					position: absolute;
					top: 10px;
					left: 10px;
				}
				.sign-set-item {
					padding: 10px;
					border: 1px solid #ddd;
					position: relative;
				}
		}
		.del {
			width: 33px;
			height: 33px;
			display: block;
			background: #d8d8d8;
			position: absolute;
			top: -1px;
			right: 0;
			&::before {
				    width: 14px;
					height: 16px;
					content: '';
					display: block;
					background: url(../../../assets/images/del.svg) no-repeat center;
					position: absolute;
					top: 50%;
					left: 50%;
					margin: -8px 0 0 -7px;
					background-size: 100%;
			}
		}
	  }
	  	.rules {
			margin-left: 200px;
			border: 1px solid #ccc;
			width: 700px;
			padding: 10px;
			min-height: 128px;
		}
		.sign-btn {
			margin: 20px 0 0 200px;
		}
		.error-tip {
		   line-height: 14px;
		   font-size: 12px;
	    }
  }
</style>
