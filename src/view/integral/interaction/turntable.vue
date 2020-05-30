<template>
	<div class="turntable-box" v-loading="createLoading">
		<el-form :label-position="labelPosition" label-width="200px" :model="turntableData" v-if="turntableData.lottoSetting">
			<el-steps :space="500" :align-center="true" :active="page" finish-status="finish" process-status="process" style="margin-top: 20px;padding-left: 100px;margin-bottom: 30px;">
				<el-step title="模板选择"></el-step>
				<el-step title="活动设置"></el-step>
			</el-steps>
			<div v-if="page == 0">
				<div class="page_temp_show">
					<img :src="turntableData.tmpId == 1 ? page1Img : page2Img" alt="" width="375px" height="670px" :turntableDatatmpId="turntableData.tmpId">
				</div>
				<div class="page_temp_choose">
					<p><el-button type="primary" :class="{'active': turntableData.tmpId == 1}" :plain="true" @click="changeTemp(1)">模板一<i class="el-icon-check"></i></el-button></p>
					<p><el-button type="primary" :class="{'active': turntableData.tmpId == 2}" :plain="true" @click="changeTemp(2)">模板二<i class="el-icon-check"></i></el-button></p>
					<p style="margin-top: 100px;">
						<el-button class="queryBtn" @click="back">{{activityStatusVal != 'invalid'? '取消':'返回'}}</el-button>
						<el-button type="primary" @click="page = 1">下一步</el-button>
					</p>
				</div>
			</div>
			<div v-if="page == 1">
				<el-form-item label="活动名称：">
					<el-input class="w200" :disabled="activityStatusVal == 'invalid'" @keyup.native="checkActName(turntableData.activityName)" v-model.trim="turntableData.activityName" auto-complete="off"></el-input>
					<span>{{turntableData.activityName.length}}/20</span>
					<p class="error-tip red" v-if="actNameError!=''">{{actNameError}}</p>
				</el-form-item>
				<el-form-item label="活动起止时间：">
					<el-date-picker
						v-model="turntableData.startTime"
						:clearable = false
						type="datetime"
						placeholder="选择日期"
						class="ui-filter-pd w200"
						:picker-options="pickerStartTime" :disabled="activityStatus">
					</el-date-picker> -
					<el-date-picker
						v-model="turntableData.endTime"
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
					<el-checkbox :disabled="activityStatus" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
					<el-checkbox-group v-model="checkedMembers" @change="handlecheckedMembersChange" style="display:inline-block;margin-left:10px;">
						<el-checkbox :disabled="activityStatus" v-for="member in members" :label="member" :key="member">{{member}}</el-checkbox>
					</el-checkbox-group>
					<p class="error-tip red" v-if="!checkedMembers.length && members.length">请至少选中一个会员等级！</p>
				</el-form-item>
				<limit-member actType="turntable" :giftStatus="!!activityStatusVal" @getUploadFile="getUploadFile" :limitMembers="turntableData.isLimitMembers" @updateMsg="updateMsg"></limit-member>
				<el-form-item label="参与限制：">
					<el-checkbox :disabled="activityStatus" v-model="cy_limit" @change="limitChange">会员激活后</el-checkbox>
					<el-input class="w50" :disabled="!cy_limit || activityStatus" @blur="blurInp('unlockDays')" v-model.trim="turntableData.unlockDays" auto-complete="off"></el-input>
					<span>天内方可参与抽奖</span>
				</el-form-item>
				<el-form-item label="奖项设置：">
					<div class="reward-list">
						<ul class="ui-filter-list">
							<li class="ui-filter-item" v-for="(obj,n) in turntableData.lottoSetting">
								<label>奖项{{n+1}}</label>
								<el-select :disabled="activityStatus" @change="showReward(obj)" v-model="obj.type" class="ui-filter-pd">
									<el-option :value="'thanks'" label="谢谢参与"></el-option>
									<el-option :value="'dynamic_point'" label="积分"></el-option>
									<el-option :value="'dynamic_coupon'" label="优惠券"></el-option>
									<el-option :value="'dynamic_commodity'" label="实物奖品"></el-option>
								</el-select>
								<div class="potions-box" v-if="obj.type == 'dynamic_point'">
									<span class="ml_10">积分值：</span><el-input :disabled="activityStatus" @blur="rewardBlur(obj,'rewardTypeValue',n)" v-model.trim="obj.rewardTypeValue" class="w50" auto-complete="off"></el-input>
									<span class="ml_10">中奖概率：</span><el-input :disabled="activityStatus" @keyup.native="rateComputed(obj.rate,n)" @blur="rewardBlur(obj,'rate',n)" v-model.trim="obj.rate" class="w50" auto-complete="off"></el-input><span class="ml_5">%</span>
								</div>
								<div class="potions-box" v-else-if="obj.type == 'dynamic_coupon'">
									<span class="ml_10" v-if="obj.giftName">{{obj.giftName}}</span>
									<el-button v-if="!activityStatus" class="ml_10" type="text" @click="checkCoupon(obj)">{{obj.giftName ? '重新选择':'选择优惠券'}}</el-button>
									<span class="ml_10">数量：</span><el-input :disabled="activityStatus" @blur="rewardBlur(obj,'num',n)" v-model.trim="obj.num" class="w50" auto-complete="off"></el-input>
									<span class="ml_10">中奖概率：</span><el-input :disabled="activityStatus" @keyup.native="rateComputed(obj.rate,n)" @blur="rewardBlur(obj,'rate',n)" v-model.trim="obj.rate" class="w50" auto-complete="off"></el-input><span class="ml_5">%</span>
								</div>
								<div class="potions-box" v-else-if="obj.type == 'thanks'">
									<span class="ml_10">提示语：</span><el-input :disabled="activityStatusVal == 'invalid'" v-model.trim="prompt" class="w200" auto-complete="off"></el-input><span class="ml_5">{{prompt ? prompt.length : 0}}/20</span>
								</div>
								<div class="potions-box" v-else-if="obj.type == 'dynamic_commodity'">
									<span class="ml_10" v-if="obj.giftName">{{obj.giftName}}</span>
									<el-button v-if="!activityStatus" class="ml_10" type="text" @click="setMatter(obj)">{{obj.giftName ? '重新设置':'设置实物礼品'}}</el-button>
									<span class="ml_10">数量：</span><el-input :disabled="activityStatus" @blur="rewardBlur(obj,'num',n)" v-model.trim="obj.num" class="w50" auto-complete="off"></el-input>
									<span class="ml_10">中奖概率：</span><el-input :disabled="activityStatus" @keyup.native="rateComputed(obj.rate,n)" @blur="rewardBlur(obj,'rate',n)" v-model.trim="obj.rate" class="w50" auto-complete="off"></el-input><span class="ml_5">%</span>
								</div>
								<p class="error-tip red" v-if="obj.isError!=''">{{obj.isError}}</p>
							</li>
						</ul>
					</div>
					<p>当前总中奖概率为<span class="ft_orange"> {{rateCount}} </span>%</p>
					<p class="error-tip red" v-if="rateCount > 100">每个奖项的中奖概率，所有奖项中奖概率之和不得超过100%</p>
					<!-- <p class="error-tip red" v-if="!hasThanks">奖项设置中必须有一项“谢谢参与”！</p> -->
				</el-form-item>
				<el-form-item label="抽奖消耗积分:">
					<span>每次抽奖需要消耗</span>
					<el-input :disabled="activityStatus" v-model.trim="turntableData.usePointPer" class="w50" auto-complete="off"></el-input>
					<span>积分</span>
				</el-form-item>
				<el-form-item label="抽奖资格:">
					<el-checkbox :disabled="activityStatus" v-model="turntableData.triggerActive" :true-label="1" :false-label="0">关注店铺后才能参与抽奖</el-checkbox>
				</el-form-item>
				<el-form-item label="每日抽奖限制:">
					<span>每人每天最多能参与</span>
					<el-input :disabled="activityStatus" @blur="blurInp('limitLottoTime')" v-model.trim="turntableData.limitLottoTime" class="w50" auto-complete="off"></el-input>
					<span>次抽奖</span>
				</el-form-item>
				<el-form-item label="每日中奖上限:">
					<span>每人每天最多能中奖</span>
					<el-input :disabled="activityStatus" @blur="blurInp('limitLottoTime')" v-model.trim="turntableData.winTimeLimitEveryDay" class="w50" auto-complete="off"></el-input>
					<span>次</span>
				</el-form-item>
				<el-form-item label="赠送抽奖次数:">
					<p><el-checkbox :disabled="activityStatus" v-model="turntableData.giveLottoForAttention" :true-label="1" :false-label="0">关注店铺的会员可获得一次免费抽奖机会</el-checkbox></p>
					<p><el-checkbox :disabled="activityStatus" v-model="turntableData.giveLottoForShareActivity" :true-label="1" :false-label="0">分享活动页面可获得一次免费抽奖机会</el-checkbox></p>
				</el-form-item>
				<el-form-item label="中奖次数限制:">
					<span>活动期间每人最多能中</span>
					<el-input :disabled="activityStatus" @blur="blurInp('winTimeLimit')" v-model.trim="turntableData.winTimeLimit" class="w50" auto-complete="off"></el-input>
					<span>次奖</span>
				</el-form-item>
				<el-form-item label="活动入口:">
					<el-checkbox v-model="turntableData.hiddenEnter" :true-label="1" :false-label="0">在“会员中心”页面中隐藏活动入口，仅可通过点击活动链接或扫描活动二维码参与活动</el-checkbox>
				</el-form-item>
				<el-form-item label="活动规则:">
					<el-button size='small' @click="setRules()" class="queryBtn">自动生成</el-button>
					<span class="ml_5">应平台要求请使用自动生成的活动规则内容，可自定义添加规则内容</span>
				</el-form-item>
				<div class="rules" ref="editArea" contenteditable="true" v-if="turntableData.activityDesc" v-html="formatActivityDesc(turntableData.activityDesc)"></div>
				<div class="rules" ref="editArea" contenteditable="true" v-else>
					<p>1.活动时间：{{today}} 至 {{today30}}</p>
					<p>2.参与会员：全体用户</p>
					<p>3.每次抽奖需要消耗1积分</p>
					<p>4.每人每天最多能参与1次抽奖</p>
					<p>5.活动期间每人累计中奖不超过1次</p>
					<p>6.抽奖机会请在{{today30}}之前使用，过期无效</p>
					<p>7.奖品数量有限，先到先得。是否中奖以活动发布者后台统计结果为准</p>
				</div>
				<div class="turntable-btn">
					<el-button size='small' class="queryBtn" @click="page = 0">上一步</el-button>
					<el-button type="primary" v-if="activityStatusVal != 'invalid'" size='small' @click="createAct()">{{activityId ? '保存活动': '保存并创建活动'}}</el-button>
				</div>
			</div>
		</el-form>
		<coupon-dialog ref="addCoupon" @showCoupon="showCouponMsg" :data="currentAcitveData"></coupon-dialog>
		<matter-dialog ref="setMatter" @showMatter="showMatterMsg"></matter-dialog>
	</div>
</template>

<script>
import formatActivityDesc from './util';
import dateFormat from 'src/common/dateFormat.js';
import limitMember from '../interaction/limitMember.vue';
import { clone, isWhiteList } from 'src/common/public.js';
import couponDialog from './coupons.vue';
import matterDialog from './matter.vue';
import ajax from 'src/api/index.js';
import store from 'src/store.js';
import page1Img from 'src/assets/img/hudong/draw/page1.jpg';
import page2Img from 'src/assets/img/hudong/draw/page2.png';
	export default{
		data() {
			return {
				uploadFile: '',
				activityId: '',
				prompt: '',
				hsitoryUrl: '',
				activityStatus: false,
				isSubmit: false,
				activityStatusVal: '',
				cy_limit: false,
				actNameError: '',
				labelPosition: 'right',
				today: dateFormat(new Date().setHours(0,0,0,0),'YY-MM-DD HH:MM:SS'),
				today30: dateFormat(new Date(new Date().getTime() + 2592000000).setHours(23,59,59,59),'YY-MM-DD HH:MM:SS'),
				shopName: '',
				// hasThanks: true,
				turntableData: {
				   isLimitMembers: 0,
				   activityName: '大转盘'+dateFormat(new Date(),'YYMMDDHHMMSS'),
				   startTime: dateFormat(new Date().setHours(0,0,0,0),'YY-MM-DD HH:MM:SS'),
				   endTime: dateFormat(new Date(new Date().getTime() + 2592000000).setHours(23,59,59,59),'YY-MM-DD HH:MM:SS'),
				   unlockDays: '',//参与限制
				   activeEnable: 0,
				   winTimeLimit: '1',
				   limitLottoTime: '1',
				   usePointPer: '1',
				   lottoSetting: '',
				   activityDesc: '',
				   level: '',
				   tmpId: 1,
				   giveLottoForAttention: 0,
				   giveLottoForShareActivity: 0,
				   triggerActive: 1,
				   hiddenEnter: 0,
				   winTimeLimitEveryDay: 1
				},
				rateCount: 0,
				rateArr: {},
				lottoSettingMap: {
					'thanks': '谢谢参与',
					'dynamic_coupon': '优惠券',
					'dynamic_point': '积分',
					'dynamic_commodity': '实物奖品'
				},
				pickerStartTime: {
					disabledDate: (time) => {
						if(isWhiteList()){
							return false;
						}
						return (time.getTime() > new Date(this.turntableData.endTime).getTime()) || (time.getTime() < Date.now() - 8.64e7);
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
				currentAcitveData: {},
				checkAll: true,
				checkedMembers: [],
				members: [],
				memberMap: {
					'注册会员': '0',
					'一星会员': '1',
					'二星会员': '2',
					'三星会员': '3',
					'四星会员': '4',
					'五星会员': '5'
				},
				createLoading: false,
				isOk: true,
				page: 0,
				page1Img,
				page2Img
			};
		},
		beforeRouteEnter(to, from, next){
			next(vm => {
				vm.hsitoryUrl = from.path;
			})
		},
		watch: {
			'turntableData.startTime'(val){
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
			'turntableData.endTime'(val){
				if(val){
					this.pickerStartTime = {
						disabledDate: (time) => {
							if(isWhiteList()){
								return false;
							}
							return (time.getTime() > new Date(this.turntableData.endTime).getTime()) || (time.getTime() < Date.now() - 8.64e7);
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
			//判断默认时间与软件到期时间
			if(new Date(store.state.user.endTime).getTime() < new Date().getTime() + 2592000000) {
				this.turntableData.endTime = store.state.user.endTime;
				this.today30 = store.state.user.endTime;
			};
			this.activityId = this.$route.query.id;
			this.createLoading = true;
			this.getMemberSet(checkMember => {
				this.getTurnTable(this.activityId,checkMember)
			});
		},
		components: {
			couponDialog,
			matterDialog,
			limitMember
		},
		methods: {
      formatActivityDesc(value) {
        return formatActivityDesc(value);
      },
			updateMsg({child, val}) {
				this.turntableData[child] = val;
			},
			getUploadFile(file) {
                this.uploadFile = file;
			},
			getTurnTable(id,checkMember) {
				let _id = id || '',
				    vm = this;
				this.turntableData.lottoSetting = _id ? '' : [
					{"type":"thanks","name":"谢谢参与","index":1},
					{"type":"thanks","name":"谢谢参与","index":2},
					{"type":"thanks","name":"谢谢参与","index":3},
					{"type":"thanks","name":"谢谢参与","index":4},
					{"type":"thanks","name":"谢谢参与","index":5},
					{"type":"thanks","name":"谢谢参与","index":6},
					{"type":"thanks","name":"谢谢参与","index":7},
					{"type":"thanks","name":"谢谢参与","index":8}
				];
                ajax({
					api_name: 'getLottoRuleById',
					data: {
						id: _id
					},
					vm: this
				}, result => {
					this.createLoading = false;
					if(_id) {
						let _level = [],
						lottoSetting = JSON.parse(result.data.lottoSetting),
            _cy_limit = '';
						result.data.level.split(',').forEach(item => {
							_level.push(checkMember[item - 1])
						});
						this.checkedMembers = _level;
						_level.length >= 5 ? this.checkAll = true : this.checkAll = false;
						lottoSetting.forEach((item,no) => {
							item.isError = '';
							if(!isNaN(item.rate)) {
								this.rateCount += Number(item.rate);
								this.rateArr[no+1] = Number(item.rate);
							};
							if(item.prompt) {
								vm.$set(vm,'prompt',item.prompt);
							};
						});
						result.data.unlockDays = result.data.unlockDays || '';
						result.data.tmpId = result.data.tmpId || 1;
						result.data.giveLottoForAttention = result.data.giveLottoForAttention || 0;
						result.data.giveLottoForShareActivity = result.data.giveLottoForShareActivity || 0;
						result.data.triggerActive = result.data.triggerActive || 1;
						result.data.hiddenEnter = result.data.hiddenEnter || 0;
				   		result.data.winTimeLimitEveryDay = result.data.winTimeLimitEveryDay || result.data.winTimeLimit;
						vm.$set(vm,'turntableData',result.data);
						_cy_limit = this.turntableData.activeEnable == 0 ? false : true;
						vm.$set(vm,'cy_limit',_cy_limit);
						this.turntableData.lottoSetting = lottoSetting;
						this.activityStatus = result.data.status == 'valid' || result.data.status == 'invalid' ? true : false;
						this.activityStatusVal = result.data.status;
						this.page = 1;
					}
                    this.shopName =  result.data.shopName;
				}, error => {
					vm.$message.error(error.message || '获取活动信息失败！');
				});
			},
			limitChange() {
			  if(this.cy_limit) {
				  this.turntableData.activeEnable = 1;
				  this.turntableData.unlockDays = 1;
			  }else {
				  this.turntableData.activeEnable = 0;
				  this.turntableData.unlockDays = '';
			  }
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
			handleCheckAllChange(val) {
				if(this.checkAll) {
					this.checkedMembers = this.members;
					this.checkAll = true;
				}else {
					this.checkedMembers = [];
					this.checkAll = false;
				}
			},
			handlecheckedMembersChange(value) {
				let checkedCount = value.length;
				this.checkAll = checkedCount === this.members.length;
			},
			rewardBlur(item,child,n) {
			  let _val = item[child],
			      _judge = child == 'rate' ? Number(_val < 0) : Number(_val <= 0);
			  	if(!_val) {
					this.$set(item, child,'1');
				}else if(isNaN(Number(_val)) || /\./.test(_val) || /\+/.test(_val) || _judge) {
					this.$message.error('只能输入正整数！');
					this.$set(item, child,'1');
				};
				child == 'rate' ? this.rateComputed(item[child],n) : '';
			},
			blurInp(item) {
				let obj = this['turntableData'][item];
				if(!obj) {
					this['turntableData'][item] = '1';
					return;
				}else if(isNaN(Number(obj)) || /\./.test(obj) || /\+/.test(obj) || Number(obj <= 0)) {
					this.$message.error('只能输入正整数！');
					this['turntableData'][item] = '1';
					return;
				}
				return;
			},
			showReward(obj) {
				if(obj.rate && this.rateCount) {
					this.rateCount -=   Number(obj.rate);
					this.rateArr[obj.index] = '';
					this.$set(obj, 'rate', '');
				};
				this.$set(obj, 'name', this.lottoSettingMap[obj.type])
				this.$set(obj, 'rewardTypeValue', '1')
				this.$set(obj, 'giftName', '')
				this.$set(obj, 'link', '')
				this.$set(obj, 'couponCheckType','')
				this.$set(obj, 'bindType','')
				this.$set(obj, 'quota','')
			},
			createAct() {
				let vm = this,
					checkThanks = false,
					turntableParma = clone(vm.turntableData);
					vm.isOk = true,
				vm.checkActName(turntableParma.activityName);
				//时间设置
				turntableParma.startTime = dateFormat(turntableParma.startTime,'YY-MM-DD HH:MM:SS');
        turntableParma.endTime = dateFormat(turntableParma.endTime,'YY-MM-DD HH:MM:SS');
        if(new Date(turntableParma.startTime) > new Date(turntableParma.endTime)) {
            vm.$message.error('开始时间不能大于结束时间！');
            return false;
        }
				//会员等级
				let level = [];
				vm.checkedMembers.forEach(item => {
                    level.push(vm.memberMap[item])
				});
				level.length == 6 ? level.unshift('-2') : '';
				if(!level.length) {
					vm.isOk = false;
				};
				turntableParma.level = level.join(',');
				//奖项设置
				turntableParma.lottoSetting.forEach((item,key) => {
					let errorMsg = '',
					    delArr = [];
					delete item.isError;
					switch (item.type) {
						case 'thanks':
							checkThanks = true;
							if(vm.prompt) {
							   item.prompt = vm.prompt;
							   if(vm.prompt.length > 20) {
								   errorMsg = "提示语最多20个字符！";
								   vm.isOk = false;
							   }
							};
						    delArr = ['rewardTypeValue','rate','num','giftName','link','price','couponCheckType','bindType','quota'];
							break;
						case 'dynamic_point':
							if(!item.rate) {
								errorMsg = "请设置奖品中奖率！";
								vm.isOk = false;
							};
							delArr = ['num','giftName','link','price','couponCheckType','bindType','quota'];
							break;
						case 'dynamic_coupon':
						    if(!item.rate) {
								errorMsg = "请设置奖品中奖率！";
								vm.isOk = false;
							}else if(!item.giftName) {
								errorMsg = "请选择优惠券！";
								vm.isOk = false;
							}
							break;
						case 'dynamic_commodity':
						    if(!item.rate) {
								errorMsg = "请设置奖品中奖率！";
								vm.isOk = false;
							}else if(!item.giftName) {
								errorMsg = "请设置实物礼品！";
								vm.isOk = false;
							}else if(!item.num) {
								errorMsg = "请设置实物礼品数量！";
								vm.isOk = false;
							}
							delArr = ['couponCheckType','bindType','quota'];
						    break;
						default:
							break;
					};
					delArr.forEach(field => {
						delete item[field];
					})
					vm.$set(vm.turntableData.lottoSetting[key], 'isError', errorMsg)
				});
				// vm.hasThanks = checkThanks;
				// if(!vm.isOk || vm.rateCount > 100 || !vm.hasThanks) {
        if(!vm.isOk || vm.rateCount > 100) {
					this.$message.error('信息填写有误，请检查后重新提交！');
					return false;
				};
				if(!vm.isSubmit && vm.isOk) {
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

					vm.isSubmit = true;
					delete turntableParma.cy_limit;
					delete turntableParma.status;
					turntableParma.activityDesc = _activityDesc;
					turntableParma.startTime = turntableParma.startTime ? (dateFormat(turntableParma.startTime,'YY-MM-DD HH:MM:SS')) : '';
					turntableParma.endTime = turntableParma.endTime ? (dateFormat(turntableParma.endTime,'YY-MM-DD HH:MM:SS')) : '';
					//奖项string化
					turntableParma.lottoSetting = JSON.stringify(turntableParma.lottoSetting);

					let formData = new FormData();
					for(let item in turntableParma) {
						let _data = turntableParma[item];
						if(typeof _data == 'object'){
							_data = JSON.stringify(_data);
						}
						formData.append(item, _data)
					};
          formData.append('file', vm.uploadFile);
          if(turntableParma.usePointPer == 0) {
            this.$confirm("是否确认0积分即可参与抽奖？").then(() => {
    				  vm.send_ajax(formData);
            }).catch(() => {})
            return;
          }
					vm.send_ajax(formData);
				}
      },
      send_ajax(formData) {
        var vm = this;
        this.createLoading = true;
        ajax({
						api_name: 'addLotteryRule',
						data: formData
					}, result => {
						vm.createLoading = false;
						this.$message.success(vm.activityId ? '活动修改并保存成功！' : '活动创建成功！');
						setTimeout(() => {
							this.$router.push({path: '/interactionList'});
						}, 1000);
					}, error => {
						vm.createLoading = false;
						vm.isSubmit = false;
						vm.$message.error(error.message || (vm.activityId ? '活动修改并保存成功！':'活动创建失败！'));
					});
      },
			checkCoupon(obj) {
			   let custom = '';
			   if(obj.giftName && !obj.couponId) {
				custom =  {
						bindType: obj.bindType,
						name: obj.giftName,
						discountType: obj.couponCheckType,
						quota: obj.quota,
						discount: obj.price,
						link: obj.link
					};
			   };
               this.$refs.addCoupon.addCoupons(obj.index,obj.rewardTypeValue,custom);
			},
			setMatter(obj) {
               this.$refs.setMatter.setMatters(obj,obj.link);
			},
			showMatterMsg(data, index) {
               let obj = this.turntableData.lottoSetting[index-1];
			   obj.rewardTypeValue = data.price;
			   this.$set(obj, 'giftName', data.name);
			   this.$set(obj, 'link', data.pic);
			},
			showCouponMsg(data,index) {
				let obj = this.turntableData.lottoSetting[index-1];
				obj.rewardTypeValue = data.couponId;
				obj.price =  data.discountType == 1 ? data.discount : data.discount*10;
				obj.couponCheckType = data.discountType;
				obj.bindType = data.bindType;
				obj.quota = data.quota;
				this.$set(obj, 'giftName', data.name);
				this.$set(obj, 'link', data.link);
				this.$set(obj,'couponSource',data.couponSource);
			},
			rateComputed(rate,n) {
				isNaN(rate) ? rate = 1 : '';
				if(this.rateArr[n+1]) {
					this.rateCount -= Number(this.rateArr[n+1]);
                    this.rateCount += Number(rate);
				}else {
					this.rateCount += Number(rate);
				};
				this.rateArr[n+1] = rate;
			},
			setRules() {
				let list = '',
					reward = '',
					index = 0,
					vm = this;
				/* TODO */
				this.turntableData.lottoSetting.forEach(item => {
					switch (item.type) {
						case 'dynamic_point':
						    if(item.rewardTypeValue) {
								index ++;
								reward += '（'+index+'）'+item.rewardTypeValue+'个积分';
							}
							break;
						case 'dynamic_coupon':
							let _type = item.bindType == 1 ? '店铺优惠券' : '商品优惠券',
							    _unit = item.couponCheckType == 1 ? '元' : '折';
						    if(item.giftName) {
								index ++;
								reward += '（'+index+'）'+item.price+_unit+_type;
							}
							break;
						case 'dynamic_commodity':
						    if(item.link) {
								index ++;
								reward += '（'+index+'）'+item.giftName;
							}
						    break;
						default:
							break;
					}
				});
				let ruleArr = ['cy_limit','usePointPer','limitLottoTime','winTimeLimit', 'giveLottoForAttention', 'giveLottoForShareActivity', 'reward','end'],
					_list = '',
					_num = 2;
				ruleArr.forEach(item => {
					switch (item) {
						case 'cy_limit':
						    if(vm.cy_limit) {
								_num ++;
								_list += [
									'<p>'+_num+'.会员激活后'+vm.turntableData.unlockDays+'天内方可参与抽奖</p>'
								].join('')
							}
							break;
						case 'usePointPer':
						        _num ++;
								_list += [
									 '<p>'+_num+'.每次抽奖需要消耗'+vm.turntableData.usePointPer+'积分</p>',
								].join('')
							break;
						case 'limitLottoTime':
						        _num ++;
								_list += [
									'<p>'+_num+'.每人每天最多能参与'+vm.turntableData.limitLottoTime+'次抽奖</p>',
								].join('')
							break;
						case 'winTimeLimit':
						        _num ++;
								_list += [
									'<p>'+_num+'.活动期间每人累计中奖不超过'+vm.turntableData.winTimeLimit+'次</p>',
								].join('')
							break;
						case 'giveLottoForAttention':
							if(vm.turntableData.giveLottoForAttention){
								_num++;
								_list += [
										'<p>'+_num+'.活动期间关注店铺的用户可获得一次免费抽奖机会</p>',
								].join('');
							}
							break;
						case 'giveLottoForShareActivity':
							if(vm.turntableData.giveLottoForShareActivity){
								_num++;
								_list += [
										'<p>'+_num+'.活动期间分享活动页面可获得一次免费抽奖机会</p>',
								].join('');
							}
							break;
						case 'reward':
						    if(reward) {
						        _num ++;
						        _list += [
									 '<p>'+_num+'.奖项设置：'+reward+'</p>'
								].join('')
							}
							break;
						case 'end':
						        _list += [
									 '<p>'+(_num+1)+'.抽奖机会请在'+dateFormat(this.turntableData.endTime,'YY-MM-DD HH:MM:SS')+'之前使用，过期无效</p>',
				                     '<p>'+(_num+2)+'.奖品数量有限，先到先得。是否中奖以活动发布者后台统计结果为准</p>',
								].join('')
						    break;
						default:
							break;
					}
				})
				list += [
                    '<p>1.活动时间：'+dateFormat(this.turntableData.startTime,'YY-MM-DD HH:MM:SS')+' 至 '+dateFormat(this.turntableData.endTime,'YY-MM-DD HH:MM:SS')+'</p>',
					'<p>2.参与会员：'+(this.checkedMembers.length >5 ? this.turntableData.triggerActive ? '当前已关注店铺的全体用户' : '全体用户' : this.checkedMembers.join('，'))+'</p>',
					_list,
				].join('')
				this.turntableData.activityDesc = list;
			},
			back() {
				let _url = this.hsitoryUrl == '/' ? '/interactionCenter' :  this.hsitoryUrl;
				this.$router.push({path: _url})
			},
			 //获取设置的会员名称
            getMemberSet(cab) {
				let vm = this,
					_arr = [],
					_map = {};
				ajax({
						api_name: 'memberLevelList',
					}, (res) => {
                    if(res.data.levelList && res.data.levelList.length) {
                        res.data.levelList.forEach(item => {
						_arr.push(item.name || item.nameSource);
						_map[item.name || item.nameSource] = item.memberLevel;
						})
						vm.$set(vm,'memberMap',_map);
                    }else {
                        _arr = ['注册会员', '一星会员', '二星会员', '三星会员', '四星会员', '五星会员'];
                    }
					vm.$set(vm,'members',_arr);
					vm.$set(vm,'checkedMembers',_arr);
					cab && cab(_arr);
                }, (error) => {
                    this.$message.error(error.message || '获取会员列表失败');
                });
			},
			changeTemp(tmpId){
				this.turntableData.tmpId = tmpId;
			}
		}
	}
</script>

<style lang="less">
.turntable-box {
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
.turntable-box {
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
	.reward-list {
		    background: #f6f6f6;
			padding: 10px 20px;
			min-width: 600px;
			display: inline-block;
			border: 1px solid #ddd;
			.ui-filter-list {
				.ui-filter-item {
					padding: 5px 0;
					.ui-filter-pd {
						width: 130px;
					}
					label {
						width: 40px;
						margin-right: 10px;
					}
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
	.turntable-btn {
		margin: 20px 0 0 200px;
	}
	.ml_5 {
		margin-left: 5px;
	}
	.ml_10 {
		margin-left: 10px;
	}
	.potions-box {
		display: inline-block;
	}
	.error-tip {
		line-height: 14px;
		font-size: 12px;
	}
	.page_temp_show{
		width: 375px;
		display: inline-block;
		height: 670px;
		vertical-align: top;
		margin-right: 50px;
		border-right: 1px solid #ccc;
		padding: 0 90px;
	}
	.page_temp_choose{
		display: inline-block;
		padding-top: 100px;
		padding-left: 100px;
		text-align: center;
		p{
			margin-top: 20px;
		}
		.el-icon-check{
			margin-left: 5px;
			font-size: 10px;
			visibility: hidden;
		}
		.active{
			color: #20a0ff;
			border-color: #20a0ff;
			.el-icon-check{
				visibility: inherit;
			}
		}
	}
}
.ft_orange {
	color: #f90;
}
</style>
