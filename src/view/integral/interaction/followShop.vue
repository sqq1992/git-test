<template>
	<div class="flow-box interaction-box" v-loading="createLoading">
		<div v-if="shopData">
			<el-form :label-position="labelPosition" label-width="200px" :model="shopData">
				<el-form-item label="活动名称：">
					<el-input class="w200" :disabled="activityStatusVal == 'invalid'"  @keyup.native="checkActName(shopData.activityName)" v-model.trim="shopData.activityName" auto-complete="off"></el-input>
					<span>{{shopData .activityName.length}}/20</span>
					<p ref="errorTip" class="error-tip red" v-if="actNameError!=''">{{actNameError}}</p>
				</el-form-item>
				<el-form-item label="活动起止时间：">
					<el-date-picker
						v-model="shopData.startTime"
						:clearable = false
						type="datetime"
						placeholder="选择日期"
						class="ui-filter-pd w200"
						:picker-options="pickerStartTime" :disabled="activityStatusVal != '' && activityStatusVal != 'wait'">
					</el-date-picker> -
					<el-date-picker
						v-model="shopData.endTime"
						:clearable = false
						type="datetime"
						placeholder="选择日期"
						class="ui-filter-pd w200"
						:picker-options="pickerEndTime" :disabled="activityStatusVal == 'invalid' || (shopData.goodsMsg.isCheck && activityStatusVal != '') ">
					</el-date-picker>
					<span class="ml_5 gray ft-14">活动有效期不得超过订购有效期</span>
					<a href="http://fw.jd.com/657606.html" class="renew" target="_blank">立即续订</a>
				</el-form-item>
				<el-form-item label="参与等级：">
					<el-checkbox disabled checked>全体会员</el-checkbox>
				</el-form-item>
				<el-form-item label="关注店铺奖励：">
					<div class="flow-set-conten">
						<div class="flow-set">
							<el-checkbox v-model="shopData.pointsMsg.isCheck" :disabled="activityStatus">积分：</el-checkbox>
							<p class="inline"><el-input @blur="blurInp()" v-model="shopData.pointsMsg.val" class="w50" :disabled="activityStatus || !shopData.pointsMsg.isCheck"  auto-complete="off"></el-input><span class="ml_5">积分</span></p>
							<p ref="errorTip" class="error-tip red mt_10" v-if="shopData.pointsMsg.isCheck && !shopData.pointsMsg.val">请设置积分值！</p>
						</div>
						<div class="flow-set">
							<el-checkbox v-model="shopData.couponMsg.isCheck" :disabled="activityStatus">优惠券：</el-checkbox>
							<span v-if="shopData.couponMsg.giftName">{{shopData.couponMsg.giftName}}</span>
							<a href="javascript:;" @click="checkCoupon(shopData.couponMsg)" v-if="!activityStatus">{{shopData.couponMsg.giftMsg ? '重新选择':'选择优惠券'}}</a>
							<p class="gary" v-if="shopData.couponMsg.giftMsg">{{shopData.couponMsg.giftMsg}}</p>
							<p ref="errorTip" class="error-tip red mt_10" v-if="shopData.couponMsg.isCheck && !shopData.couponMsg.giftMsg">请选择优惠券！</p>
						</div>
						<div class="flow-set" style="border: 0">
						<el-checkbox v-model="shopData.goodsMsg.isCheck" :disabled="activityStatus">商品折扣：</el-checkbox>
						<span v-if="setDiscountData.activityName">{{setDiscountData.activityName}}</span>
						<a href="javascript:;" @click="setDiscount()" v-if="!activityStatus">设置折扣</a>
						<a class="ml_5" href="javascript:;" @click="discountDetail()" v-if="activityStatus && shopData.lottoSetting.indexOf('dynamic_wareDiscount') != -1">查看</a>
						<a class="ml_5" href="javascript:;" @click="promotionAudit()" v-if="activityStatus && shopData.lottoSetting.indexOf('dynamic_wareDiscount') != -1 && activityStatusVal != 'invalid'">促销审核</a>
						<p class="gary" v-if="setDiscountData.activityName">原价：¥{{setDiscountData.price}}，选中sku数量：{{setDiscountData.skuLen}}个，到手价：¥{{setDiscountData.discount}}</p>
						<p ref="errorTip" class="error-tip red mt_10" v-if="shopData.goodsMsg.isCheck && !setDiscountData.activityName">请设置商品折扣！</p>
						</div>
					</div>
					<p ref="errorTip" class="error-tip red mt_10" v-if="!shopData.pointsMsg.isCheck && !shopData.couponMsg.isCheck && !shopData.goodsMsg.isCheck">请选择至少一种关注店铺奖励！</p>
				</el-form-item>
				<el-form-item label="自动展示:">
					<el-checkbox v-model="shopData.everyDayShow" disabled>未关注店铺的会员每次进入“会员中心”页面时自动展示关注店铺活动浮层</el-checkbox>
				</el-form-item>
				<el-form-item label="活动浮层:">
					<div class="img_content">
						<span class="loading" v-if="uploadFlg"  v-loading="uploadFlg" style="line-height: 0;"></span>
						<img :src="shopData.image">
						<el-upload
							class="img_box"
							action="/common/picUpload"
							:show-file-list="false"
							:on-success="uploadSuccess"
							:before-upload="uploadBefore">
							<span v-if="!uploadFlg && activityStatusVal != 'invalid'">上传个性化浮层</span>
						</el-upload>
						<span class="upload-tip">建议尺寸：688*710像素，上传图片大小不能超过 1.5MB！</span>
					</div>
				</el-form-item>
				<el-form-item label="活动规则:">
					<el-button size='small' @click="setRules()" class="queryBtn">自动生成</el-button>
					<span class="ml_5">应平台要求请使用自动生成的活动规则内容，可自定义添加规则内容</span>
				</el-form-item>
				<div class="rules" ref="editArea" contenteditable="true" v-if="shopData.activityDesc" v-html="formatActivityDesc(shopData.activityDesc)"></div>
				<div class="rules" ref="editArea" contenteditable="true" v-else>
					<p>1.活动时间：{{today}} 至 {{today30}}</p>
					<p>2.参与会员：全体会员</p>
					<p>3.每个会员只能领取一次奖励，之前已参与过关注店铺活动的会员无法领取奖励。</p>
					<p>4.奖品数量有限，先到先得</p>
				</div>
				<div class="flow-btn">
					<el-button size='small' class="queryBtn" @click="back">{{activityStatusVal != 'invalid'? '取消':'返回'}}</el-button>
					<!-- <el-button type="primary" v-if="activityStatusVal != 'invalid'" size='small' @click="createAct()">{{activityId ? '保存活动': '保存并创建活动'}}</el-button> -->
					<el-button type="primary" size='small' @click="createAct()">{{activityId ? '保存活动': '保存并创建活动'}}</el-button>
				</div>
			</el-form>
			<coupon-dialog ref="addCoupon" @showCoupon="showCouponMsg" :data="currentAcitveData"></coupon-dialog>
			<discount-dialog @getDisCountData="disCountData" ref="setDiscount"></discount-dialog>
			<discount-tip-dialog :url="jumpUrl" ref="discountTip"></discount-tip-dialog>
		</div>
	</div>
</template>

<script>
import formatActivityDesc from './util';
import dateFormat from 'src/common/dateFormat.js';
import { clone, isWhiteList } from 'src/common/public.js';
import couponDialog from './coupons.vue';
import discountDialog from './discount.vue';
import ajax from 'src/api/index.js';
import store from 'src/store.js';
import discountTipDialog from 'src/components/integral-interaction/discountTip.vue';
	export default{
		data() {
			return{
				uploadFlg: false,
				activityId: '',
				hsitoryUrl: '',
				activityStatusVal: '',
				isSubmit: false,
				isOk: true,
				shopName: '',
				activityStatus: false,
				actNameError: "",
				labelPosition: 'right',
				today: dateFormat(new Date().setHours(0,0,0,0),'YY-MM-DD HH:MM:SS'),
				today30: dateFormat(new Date(new Date().getTime() + 2592000000).setHours(23,59,59,59),'YY-MM-DD HH:MM:SS'),
				currentAcitveData: {},
				setDiscountData: [],
				shopData:{
					 activityName: '关注店铺'+dateFormat(new Date(),'YYMMDDHHMMSS'),
				     startTime: dateFormat(new Date().setHours(0,0,0,0),'YY-MM-DD HH:MM:SS'),
					 endTime: dateFormat(new Date(new Date().getTime() + 2592000000).setHours(23,59,59,59),'YY-MM-DD HH:MM:SS'),
					 activityDesc: '',
					 couponMsg: {},
					 pointsMsg: {},
					 goodsMsg: {},
					 everyDayShow: true,
					 image: 'http://img11.360buyimg.com/imgzone/jfs/t1/86828/37/13249/316651/5e5506e3E18c57390/5a2f6a103aa1f401.png'
				},
				createLoading: false,
				pickerStartTime: {
					disabledDate: (time) => {
						if(isWhiteList()){
							return false;
						}
						return (time.getTime() > new Date(this.shopData.endTime).getTime()) || (time.getTime() < Date.now() - 8.64e7);
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
				skus: [],
				jumpUrl: '/interactionList',
				promoId: ''
			}
		},
	    beforeRouteEnter(to, from, next){
			next(vm => {
				vm.hsitoryUrl = from.path;
			})
		},
		watch: {
			'shopData.startTime'(val){
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
			'shopData.endTime'(val){
				if(val){
					this.pickerStartTime = {
						disabledDate: (time) => {
							if(isWhiteList()){
								return false;
							}
							return (time.getTime() > new Date(this.shopData.endTime).getTime()) || (time.getTime() < Date.now() - 8.64e7);
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
				this.shopData.endTime = store.state.user.endTime;
				this.today30 = store.state.user.endTime;
			};
			this.activityId = this.$route.query.id;
			this.getShopMsg(this.activityId)
		},
		components: {
			couponDialog,
			discountDialog,
			discountTipDialog
		},
		methods: {
      formatActivityDesc(value) {
        return formatActivityDesc(value);
      },
			//促销审核
			promotionAudit() {
				let vm = this;
				ajax({
					api_name: 'approveUnitPromotionWrite',
					data: {
						promoId: vm.promoId
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
			},
			uploadSuccess(file) {
				if(file.result == '100') {
                    this.shopData.image = file.data.picUrl;
				}else {
					this.$message.error(file.message || '图片上传失败！');
				};
				this.uploadFlg = false;
			},
			uploadBefore(file) {
				const isIMAGE = /image\/\w+/.test(file.type);
				const isLt2M = file.size / 1024 / 1024 < 1.5;

				if (!isIMAGE) {
					this.$message.error('上传图片只能是 JPG 格式!');
				}
				if (!isLt2M) {
					this.$message.error('上传图片大小不能超过 1.5MB!');
				}
				if(isIMAGE && isLt2M){
					this.uploadFlg = true;
				}
				return isIMAGE && isLt2M;
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
			setDiscount() {
				this.$set(this.shopData.goodsMsg,'isCheck', true);
        this.$refs.setDiscount.setDiscount();
			},
			checkCoupon(obj) {
			   let custom = '';
			   if(obj.giftMsg && !obj.couponId) {
				   custom = {
					   	bindType: obj.bindType,
						name: obj.giftName,
						discountType: obj.couponCheckType,
						quota: obj.quota,
						discount: obj.price,
						link: obj.link
				   }
			   }
			   this.$set(this.shopData.couponMsg,'isCheck', true);
			   let chheckId = this.shopData.couponMsg.couponId || '';
			   this.$refs.addCoupon.addCoupons('',chheckId,custom);
			},
			showCouponMsg(data,index) {
				let _discount = data.discountType == 1 ? data.discount : data.discount*10,
					type = data.bindType == 1 ? '店铺优惠券' : '商品优惠券',
					_obj = this.shopData.couponMsg,
					_giftMsg = '';
				this.$set(_obj,'giftName',data.name);
				this.$set(_obj,'couponId',data.couponId);
				_obj.rewardTypeValue = data.couponId;
				_obj.price =  data.discountType == 1 ? data.discount : data.discount*10;
				_obj.link = data.link;
				_obj.couponCheckType = data.discountType;
				_obj.bindType = data.bindType;
				_obj.couponValue = _discount;
				_obj.quota = data.quota;
				_giftMsg = type + '，' + '满'+(data.quota || '-')+'元可用，'+'优惠券面值：'+_discount+(data.discountType == 1 ? '元':'折');
				this.$set(_obj,'giftMsg',_giftMsg);
				this.$set(_obj,'couponSource',data.couponSource);
			},
			blurInp(item) {
				let obj = this.shopData.pointsMsg;
				if(!obj.val) {
					this.$set(obj,'val','1');
					return;
				}else if(isNaN(Number(obj.val)) || /\./.test(obj.val) || /\+/.test(obj.val) || Number(obj.val <= 0)) {
					this.$message.error('只能输入正整数！');
					this.$set(obj,'val','1');
					return;
				}
				return;
			},
			setRules() {
			   let list = '',
				   rewardList = [],
				   index = 2,
				   vm = this,
				   reward = '';
			   if(vm.shopData.pointsMsg.isCheck && vm.shopData.pointsMsg.val) {
				   rewardList.push(vm.shopData.pointsMsg.val + '个积分');
			   };
			   if(vm.shopData.couponMsg.isCheck && vm.shopData.couponMsg.price) {
				   let _item = vm.shopData.couponMsg,
					   _type = _item.bindType == 1 ? '店铺优惠券' : '商品优惠券',
					   _unit = _item.couponCheckType == 1 ? '元' : '折';
				   rewardList.push(_item.price+_unit+_type);
			   };
			   if(vm.shopData.goodsMsg.isCheck && vm.setDiscountData.activityName) {
            rewardList.push(vm.setDiscountData.activityName + '专属折扣（加入购物车后生效）');
			   }
			   if(rewardList.length) {
				   index ++;
				   reward = '<p>3.关注店铺后即可获得'+rewardList.join('、')+'</p>';
			   };
			   list += [
                    '<p>1.活动时间：'+dateFormat(this.shopData.startTime,'YY-MM-DD HH:MM:SS')+' 至 '+dateFormat(this.shopData.endTime,'YY-MM-DD HH:MM:SS')+'</p>',
					'<p>2.参与会员：全体会员</p>',
					reward,
					'<p>'+(index + 1)+'.每个会员只能领取一次奖励，之前已参与过关注店铺活动的会员无法领取奖励。</p>',
					'<p>'+(index + 2)+'.奖品数量有限，先到先得</p>',
			   ].join('');
			   this.shopData.activityDesc = list;
			},
			createAct() {
				let vm = this,
					shopParma = clone(vm.shopData),
					_pointsMsg = shopParma.pointsMsg,
					_couponMsg = shopParma.couponMsg,
					_goods = shopParma.goodsMsg;
				//保存折扣
				shopParma.startTime = shopParma.startTime ? (dateFormat(shopParma.startTime,'YY-MM-DD HH:MM:SS')) : '';
        shopParma.endTime = shopParma.endTime ? (dateFormat(shopParma.endTime,'YY-MM-DD HH:MM:SS')) : '';
        if(new Date(shopParma.startTime) > new Date(shopParma.endTime)) {
            vm.$message.error('开始时间不能大于结束时间！');
            return false;
        }
				if(document.getElementsByClassName('error-tip').length) {
					vm.$message.error('信息填写有误，请检查后重新提交！');
					return false;
				};
				if(!vm.isSubmit && vm.activityStatusVal != 'valid') {
					shopParma.lottoSetting = [];
					//奖励
					if(_pointsMsg.isCheck) {
					shopParma.lottoSetting.push({
						"type":"dynamic_point",
						"name":"积分",
						"rewardTypeValue":_pointsMsg.val,
					});
					};
					if(_couponMsg.isCheck) {
						shopParma.lottoSetting.push({
							"type":"dynamic_coupon",
							"name":"优惠券",
							"rewardTypeValue": _couponMsg.rewardTypeValue,
							"giftName": _couponMsg.giftName,
							"couponCheckType": _couponMsg.couponCheckType,
							"bindType": _couponMsg.bindType,
							"quota": _couponMsg.quota,
							"price": _couponMsg.price,
							"link": _couponMsg.link,
							"couponSource": _couponMsg.couponSource
						});
					};
				};
				if(_goods.isCheck && !vm.isSubmit && vm.activityStatusVal != 'valid') {
					let setDiscountParma = clone(vm.setDiscountData),
					    _delArr = ['discount','price','skuLen','wareId','wareLogo','skus'];
					_delArr.forEach(item => {
					   delete setDiscountParma[item];
          });
					setDiscountParma.beginTime = shopParma.startTime;
					setDiscountParma.endTime = shopParma.endTime;
					//保存activityName为当前活动类型
					setDiscountParma.activityName = '关注店铺';
					ajax({
						api_name: 'createUnitPromotionWrite',
						data: setDiscountParma
					}, result => {
						shopParma.lottoSetting.push({
							"type":"dynamic_wareDiscount",
							"name":"商品折扣",
							"shopName": vm.setDiscountData.activityName,
							"discount": vm.setDiscountData.discount,
							"price": vm.setDiscountData.price,
							"skuLen": vm.setDiscountData.skuLen,
							"wareId": vm.setDiscountData.wareId,
							"wareLogo": vm.setDiscountData.wareLogo,
							"rewardTypeValue": result.data.result
						});
						vm.setDiscountData.skus.forEach(item => {
							item.promoId = result.data.result;
						});
						shopParma.skus = vm.setDiscountData.skus;
						vm.saveAct(shopParma, true);
					}, error => {
						vm.$message.error(error.message || '创建商品折扣失败！');
					});
				}else {
					if(!vm.isSubmit) {
					 vm.saveAct(shopParma, false);
					}
				}
			},
			saveAct(shopParma, hasDiscount) {
				   let vm = this,
					   delArr = ['couponMsg','pointsMsg','goodsMsg','shopName','status'];
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
          shopParma.activityDesc = _activityDesc;
          vm.createLoading = true;
          vm.isSubmit = true;
          delArr.forEach(item => {
            delete shopParma[item];
          });
          shopParma.level = '0,1,2,3,4,5';
          shopParma.everyDayShow = shopParma.everyDayShow ? 1 : 0;
          ajax({
            api_name: 'addFollowShopRule',
            data: shopParma
					}, result => {
						vm.createLoading = false;
						if(hasDiscount) {
              this.$refs.discountTip.show();
						}else {
							this.$message.success(vm.activityId ? '活动修改并保存成功！': '活动创建成功！');
							setTimeout(() => {
								this.$router.push({path: '/interactionList'});
							}, 1000);
						}
					}, error => {
						vm.createLoading = false;
						vm.isSubmit = false;
						vm.$message.error(error.message || (vm.activityId ?'活动修改并保存失败！':'活动创建失败！'));
					});
			},
			getShopMsg(id) {
				let vm = this,
				    _id = id || '';
				vm.createLoading = true;
				_id ? vm.shopData = '' : '';
				 ajax({
					api_name: 'getFollowShopRuleById',
					data: {
						id: _id
					},
					vm: this
				}, result => {
					vm.createLoading = false;
					vm.shopName =  result.data.shopName;
					if(_id) {
						let _data = result.data;
						this.skus = _data.skus;
						if(this.skus && this.skus.length) {
							this.promoId = this.skus[0].promoId;
						}
						_data.everyDayShow = _data.everyDayShow == 1 ? true : false;
						vm.activityStatus = true;
						vm.activityStatusVal = result.data.status;
						_data.couponMsg = {};
						_data.pointsMsg = {};
            _data.goodsMsg = {};
						_data.image = _data.image || 'http://img11.360buyimg.com/imgzone/jfs/t1/86828/37/13249/316651/5e5506e3E18c57390/5a2f6a103aa1f401.png';
            /**
             * 因为京东的政治任务 需要在关注店铺的图片上增加店铺信息
             * 此处兼容老的关注店铺默认图片 更换为新的默认图片
             *  */
            if(_data.image == 'http://img11.360buyimg.com/imgzone/jfs/t23326/337/1493403956/439793/28fc051/5b6160d9N3ee9e863.png') {
              _data.image = 'http://img11.360buyimg.com/imgzone/jfs/t1/86828/37/13249/316651/5e5506e3E18c57390/5a2f6a103aa1f401.png'
            }
						JSON.parse(_data.lottoSetting).forEach(item => {
							switch (item.type) {
								case 'dynamic_point':
									_data.pointsMsg = {
										isCheck: true,
										val: item.rewardTypeValue
									};
									break;
								case 'dynamic_coupon':
							     let _giftMsg = '',
								     type = item.bindType == 1 ? '店铺优惠券' : '商品优惠券';
									 _giftMsg = type + '，' + '满'+(item.quota || '-')+'元可用，'+'优惠券面值：'+item.price+(item.couponCheckType == 1 ? '元':'折');
								    _data.couponMsg = {
										isCheck: true,
										rewardTypeValue: item.rewardTypeValue,
										giftName: item.giftName,
										couponCheckType: item.couponCheckType,
										bindType: item.bindType,
										quota: item.quota,
										price: item.price,
										giftMsg: _giftMsg,
										link: item.link,
										couponSource: item.couponSource
									};
									break;
								case 'dynamic_wareDiscount':
									_data.goodsMsg = {
										isCheck: true
									};
									vm.setDiscountData = {
										activityName: item.shopName,
										discount: item.discount,
										price: item.price,
										skuLen: item.skuLen,
										wareId: item.wareId,
										wareLogo: item.wareLogo,
									};
								    break;
								default:
									break;
							}
						});
						vm.$set(vm,'shopData',_data);
					};
				}, error => {
					vm.createLoading = false;
					vm.$message.error(error.message || '获取活动信息失败！');
				});
			},
			back() {
				let _url = this.hsitoryUrl == '/' ? '/interactionCenter' :  this.hsitoryUrl;
				this.$router.push({path: _url})
			},
			disCountData(json) {
				this.$set(this,'setDiscountData',json);
			},
			discountDetail() {
			   this.$refs.setDiscount.setDiscount('detail',this.skus);
			}
		}
	}
</script>
<style lang="less">
.flow-box {
	.el-input{
		height: 30px;
		line-height: 28px;
		.gray {
		  color: #666;
		  font-size: 12px;
		}
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
  .flow-box {
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
	  .flow-set-conten {
		  padding: 10px;
		  min-width: 600px;
		  display: inline-block;
		  background: #f6f6f6;
		  border: 1px solid #ddd;
		  .flow-set {
				padding: 10px 0 10px 10px;
				border-bottom: 1px solid #ddd;
				position: relative;
				.inline {
					display: inline-block;
				}
				.lab {
					position: absolute;
					top: 10px;
					left: 10px;
				}
				.flow-set-item {
					padding: 10px;
					border: 1px solid #ddd;
					position: relative;
				}
				a {
					color: #3089DE;
				}
				.gary {
					color: #666;
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
		.flow-btn {
			margin: 20px 0 0 200px;
		}
		.error-tip {
		   line-height: 14px;
		   font-size: 12px;
	    }
  }
.img_content {
   position: relative;
   img {
	   width: 172px;
	   height: 177px;
	   background: rgba(0,0,0,0.4);
   }
   .loading {
	   position: absolute;
	   top: 88px;
       left: 64px;
   }
   .img_box {
	   position: absolute;
	   bottom: 35px;
	   left: 180px;
	   span {
		   color: #3089DE;
	   }
   }
   .upload-tip {
	   position: absolute;
	   bottom: 6px;
       left: 180px;
   }
}
</style>
