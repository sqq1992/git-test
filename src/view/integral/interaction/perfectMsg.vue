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
				<span>创建后立即生效，永久有效</span>	
			</el-form-item>
			<el-form-item label="参与等级：">
				<span>全体用户</span>
			</el-form-item>
	        <el-form-item label="收集会员信息：">
				<el-checkbox-group @change="memberMsgChange" v-model="memberMsg" style="display:inline-block;margin-left:10px;">
					<el-checkbox :disabled="activityStatus" v-for="member in memberMsgArr" :label="member" :key="member">{{memberMsgMap[member]}}</el-checkbox>
				</el-checkbox-group>
				<p ref="errorTip" class="error-tip red" v-if="!memberMsg.length">请选择至少一种收集会员信息！</p>
			</el-form-item>
			<el-form-item :label="'提交'+memberMsgMap[num]+'奖励：'" v-for="(num) in memberMsg">
				<div class="flow-set-conten">
					<div class="flow-set">
						<el-checkbox v-model="shopData.pointsMsg[num].isCheck" :disabled="activityStatus">积分：</el-checkbox>
						<p class="inline"><el-input @blur="blurInp(shopData.pointsMsg[num])" v-model="shopData.pointsMsg[num].val" class="w50" :disabled="activityStatus || !shopData.pointsMsg[num].isCheck"  auto-complete="off"></el-input><span class="ml_5">积分</span></p>
						<p ref="errorTip" class="error-tip red mt_10" v-if="shopData.pointsMsg[num].isCheck && !shopData.pointsMsg[num].val">请设置积分值！</p>
					</div>
					<div class="flow-set" style="border: 0">
						<el-checkbox v-model="shopData.couponMsg[num].isCheck" :disabled="activityStatus">优惠券：</el-checkbox>
						<span v-if="shopData.couponMsg[num].giftName">{{shopData.couponMsg[num].giftName}}</span>
						<a href="javascript:;" @click="checkCoupon(num)" v-if="!activityStatus">{{shopData.couponMsg[num].giftMsg ? '重新选择':'选择优惠券'}}</a>
						<p class="gary" v-if="shopData.couponMsg[num].giftMsg">{{shopData.couponMsg[num].giftMsg}}</p>
						<p ref="errorTip" class="error-tip red mt_10" v-if="shopData.couponMsg[num].isCheck && !shopData.couponMsg[num].giftMsg">请选择优惠券！</p>
					</div>
					<!-- <div class="flow-set" style="border: 0">
                       <el-checkbox v-model="shopData.goodsMsg[num].isCheck" :disabled="activityStatus">商品折扣：</el-checkbox>
					   <span v-if="setDiscountData.activityName">{{setDiscountData.activityName}}</span>
					   <a href="javascript:;" @click="setDiscount()" v-if="!activityStatus">设置折扣</a>
					   <a href="javascript:;" @click="discountDetail()" v-if="activityStatus && shopData.lottoSetting.indexOf('dynamic_wareDiscount') != -1">查看</a>
					   <p class="gary" v-if="setDiscountData.activityName">原价：¥{{setDiscountData.price}}，选中sku数量：{{setDiscountData.skuLen}}个，到手价：¥{{setDiscountData.discount}}</p>
					   <p ref="errorTip" class="error-tip red mt_10" v-if="shopData.goodsMsg[num].isCheck && !setDiscountData.activityName">请设置商品折扣！</p>
					</div> -->
				</div>
				<p ref="errorTip" class="error-tip red mt_10" v-if="!shopData.pointsMsg[num].isCheck && !shopData.couponMsg[num].isCheck">请选择至少一种提交{{memberMsgMap[num]}}奖励！</p>
			</el-form-item>
			<div class="flow-btn">
				<el-button size='small' class="queryBtn" @click="back">{{activityStatusVal != 'invalid'? '取消':'返回'}}</el-button>
				<el-button type="primary" v-if="activityStatusVal != 'invalid'" size='small' @click="createAct()">{{activityId ? '保存活动': '保存并创建活动'}}</el-button>
			</div>
		</el-form>
		<coupon-dialog ref="addCoupon" @showCoupon="showCouponMsg" :data="currentAcitveData"></coupon-dialog>
		<discount-dialog @getDisCountData="disCountData" ref="setDiscount"></discount-dialog>
		</div>
	</div>
</template>

<script>
import dateFormat from 'src/common/dateFormat.js';
import { clone } from 'src/common/public.js';
import couponDialog from './coupons.vue';
import discountDialog from './discount.vue';
import ajax from 'src/api/index.js';
import store from 'src/store.js';
	export default{
		data() {
			return{
				checkObjNum: '',
				activityId: '',
				hsitoryUrl: '',
				activityStatusVal: '',
				isSubmit: false,
				isOk: true,
				shopName: '',
				activityStatus: false,
				actNameError: "",
				labelPosition: 'right',
				currentAcitveData: {},
				setDiscountData: {},
				memberMsg: ['telephone','birthday','profession'],
				memberMsgArr: ['telephone','birthday','profession'],
				memberMsgMap: {
                     'telephone' : '手机号',
					 'birthday' : '生日',
					 'profession' : '职业',
					 'sex' : '性别', 
					 'email' : '邮箱'
				},	
				jsonMap: {
					'telephone': 'telephoneReward',
					'birthday': 'birthdayReward',
					'profession': 'professionReward'
				},		
				shopData:{
					 activityName: '完善会员信息'+dateFormat(new Date(),'YYMMDDHHMMSS'),
					 couponMsg: {
						 'telephone': {},
						 'birthday': {},
						 'profession': {}
					 },
					 pointsMsg: {
						 'telephone': {},
						 'birthday': {},
						 'profession': {}
					 },
					 goodsMsg: {}
				},
				createLoading: false,
				skus: []
			}
		},
	    beforeRouteEnter(to, from, next){
			next(vm => {
				vm.hsitoryUrl = from.path;
			})
		},
		created(){
			this.activityId = this.$route.query.id;
			if(this.activityId) {
			   this.getShopMsg(this.activityId);
			}
		},
		components: {
			couponDialog,
			discountDialog
		},
		methods: {
			memberMsgChange() {
				//this.memberMsg = this.memberMsg.sort();
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
			checkCoupon(num) {
			   this.checkObjNum = num;
			   this.$set(this.shopData.couponMsg[num],'isCheck', true);
			   let chheckId = this.shopData.couponMsg[num].couponId || '';
			   this.$refs.addCoupon.addCoupons('',chheckId);
			},
			showCouponMsg(data,index) {
				let _discount = data.discountType == 1 ? data.discount : data.discount*10,
					type = data.bindType == 1 ? '店铺优惠券' : '商品优惠券',
					_obj = this.shopData.couponMsg[this.checkObjNum],
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
							   console.log(data)
			},
			blurInp(obj) {
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
			createAct() {
				let vm = this,
					shopParma = clone(vm.shopData),
					_pointsMsg = shopParma.pointsMsg,
					_couponMsg = shopParma.couponMsg,
					_goods = shopParma.goodsMsg;
					console.log(_couponMsg)
				//保存折扣
				if(document.getElementsByClassName('error-tip').length) {
					vm.$message.error('信息填写有误，请检查后重新提交！');
					return false;
				};
				if(!vm.isSubmit && vm.activityStatusVal != 'valid') {
					vm.memberMsg.forEach(item => {
						let _json = {
							awardCoupon: _couponMsg[item].isCheck || false,
							awardCouponConfig: {
								name: _couponMsg[item].giftName,
								faceValue: _couponMsg[item].price,
								couponId: _couponMsg[item].rewardTypeValue,
								link: _couponMsg[item].link,
								quota: _couponMsg[item].quota,
								couponCheckType: _couponMsg[item].bindType,
								faceType: _couponMsg[item].couponCheckType
							},
							awardPoint: _pointsMsg[item].isCheck,
							awardPointConfig: {
								min: _pointsMsg[item].val
							}
						};
						shopParma[vm.jsonMap[item]] = _json;
					});
				};
				if(!vm.isSubmit) {
					vm.saveAct(shopParma);
				}
			},
			saveAct(shopParma) {
				   let vm = this,
					   delArr = ['couponMsg','pointsMsg','goodsMsg','shopName','status','startTime'];					   
				   vm.createLoading = true;
				   vm.isSubmit = true;
				   delArr.forEach(item => {
					   delete shopParma[item];
				   });
				   //收集会员信息
				   let collectType = [];
				   vm.memberMsg.forEach(item => {
                      collectType.push(item);
				   });
				   shopParma.collectType = collectType.join(',');
				   shopParma.level = '0,1,2,3,4,5';
				   ajax({
						api_name: 'addMemberCompleteRule',
						data: shopParma
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
			},
			getShopMsg(id) {
				let vm = this,
				    _id = id || '';
				vm.createLoading = true;
				_id ? vm.shopData = '' : '';
				 ajax({
					api_name: 'getMemberRuleById',
					data: {
						id: _id
					},
					vm: this
				}, result => {
					vm.createLoading = false;
					vm.shopName =  result.data.shopName;
					if(_id) {
						let _data = result.data;
						vm.activityStatus = true;
						vm.activityStatusVal = result.data.status;
						_data.couponMsg = {};
						_data.pointsMsg = {};
						_data.goodsMsg = {};

						_data.memberMsgArr = _data.collectType.split(',');	
						vm.memberMsg = 	_data.memberMsgArr;							
						_data.memberMsgArr.forEach(item => {
							let _obj = _data[vm.jsonMap[item]];
							if(_obj.awardCoupon) {
								_data.couponMsg[item] = {
									isCheck: true,
									giftName: _obj.awardCouponConfig.name,
									price: _obj.awardCouponConfig.faceValue,
									rewardTypeValue: _obj.awardCouponConfig.couponId,
									link: _obj.awardCouponConfig.link,
									quota: _obj.awardCouponConfig.quota,
									bindType: _obj.awardCouponConfig.couponCheckType,
									couponCheckType: _obj.awardCouponConfig.faceType,
									giftMsg: (_obj.awardCouponConfig.couponCheckType == 1 ? '店铺优惠券' : '商品优惠券') + '，' + '满'+(_obj.awardCouponConfig.quota || '-')+'元可用，'+'优惠券面值：'+_obj.awardCouponConfig.faceValue+(_obj.awardCouponConfig.faceType == 1 ? '元':'折')
								};
							}else {
								_data.couponMsg[item] = {
									isCheck: false
								}
							};
							if(_obj.awardPoint) {
								_data.pointsMsg[item] = {
									isCheck: true,
									val: _obj.awardPointConfig.min
								};
							}else {
								_data.pointsMsg[item] = {
									isCheck: false
								};
							};
						})
						console.log(_data)
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