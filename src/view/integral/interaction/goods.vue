<template>
	<div class="sign-box interaction-box" v-loading="createLoading">
		<div v-if="goodsData">
        <el-form :label-position="labelPosition" label-width="200px" :model="goodsData">
			<el-form-item label="活动名称：">
				<el-input class="w200" :disabled="activityStatusVal == 'invalid'"  @keyup.native="checkActName(goodsData.activityName)" v-model.trim="goodsData.activityName" auto-complete="off"></el-input>
				<span>{{goodsData.activityName.length}}/20</span>
				<p class="error-tip red" v-if="actNameError!=''">{{actNameError}}</p>
			</el-form-item>
			<el-form-item label="活动起止时间：">
				<el-date-picker
					v-model="goodsData.startTime"
					:clearable = false
					type="datetime"
					placeholder="选择日期"
					class="ui-filter-pd w200"
					:picker-options="pickerStartTime" :disabled="activityStatus">
				</el-date-picker> - 
				<el-date-picker
					v-model="goodsData.endTime"
					:clearable = false
					type="datetime"
					placeholder="选择日期"
					class="ui-filter-pd w200"
					:picker-options="pickerEndTime" :disabled="activityStatusVal == 'invalid'">
				</el-date-picker>
				<span class="ml_5 gray">活动有效期不得超过订购有效期</span>
				<a href="http://fw.jd.com/657606.html" class="renew" target="_blank">立即续订</a>
			</el-form-item>
			<el-form-item label="参与等级：">
				<el-checkbox disabled checked>全体会员</el-checkbox>
			</el-form-item>
			<el-form-item label="设置活动商品：">
				<p class="inline-block">已选中<span>10</span>件商品，还可选择<span>0</span>件商品</p>
				<a href="javascript:;" class="renew" target="_blank">选择商品</a>
			</el-form-item>
			<el-form-item label="设置活动奖励：">
				<div class="sign-set-conten">
					<div class="sign-set" style="border: 0">
					   <div class="sign-set-item mb_10" v-for="(obj,index) in goodsData.accumulatedSignSetting.signRuleDesc">
							<div>
								<p>{{grade[index]}}档</p>
								<span>{{labelName}}活动商品数量：</span>
								<el-select :disabled="activityStatus" size="3" v-model="obj.shopNum" class="ui-filter-pd">
									<el-option v-for="num in 10" :value="num" :label="num"></el-option>
								</el-select>
								<span class="ml_5">件</span>
								<div>
									<span>{{labelName}}奖励：</span>
									<el-select :disabled="activityStatus" size="5" v-model="obj.type" class="ui-filter-pd">
										<el-option :value="'dynamic_coupon'" label="优惠券"></el-option>
										<el-option :value="'dynamic_point'" label="积分"></el-option>
										<el-option :value="'dynamic_wareDiscount'" label="商品折扣"></el-option>
									</el-select>
									<div class="inline-block ml_5" v-if="obj.type == 'dynamic_coupon'">
                                        <span>{{obj.giftName}}</span>
										<el-button v-if="!activityStatus" class="ml_10" type="text" @click="checkCoupon(index,obj)">{{obj.giftName ? '重新选择':'选择优惠券'}}</el-button>
									</div>
									<p  v-if="obj.type == 'dynamic_coupon'">{{obj.giftMsg}}</p>
									<div class="inline-block ml_5" v-if="obj.type == 'dynamic_point'">
                                        <span>积分值：</span>
										<el-input :disabled="activityStatus" v-model.trim="obj.rewardTypeValue" class="w50" auto-complete="off"></el-input>
									</div>
									<div class="inline-block ml_5" v-if="obj.type == 'dynamic_wareDiscount'">
                                        <span></span>
										<el-button v-if="!activityStatus" class="ml_10" type="text" @click="setDiscount(index)">{{obj.giftName ? '重新设置':'设置折扣'}}</el-button>
									</div>
								</div>
							</div>
							<p class="error-tip red" v-if="obj.errorTip">{{obj.errorTip}}</p>
							<a v-if="index != 0 && !activityStatus" class="del" @click="del(index)" href="javascript:;"></a>
					   </div>
					   <el-button v-if="goodsData.accumulatedSignSetting.signRuleDesc.length<5 && !activityStatus" size='small' @click="add()" class="queryBtn">新增一档</el-button>
					</div>
				</div>
			</el-form-item>
			<el-form-item label="活动banner：">
				<div class="img_content">
					<span class="loading" v-if="uploadFlg"  v-loading="uploadFlg" style="line-height: 0;"></span>
					<img src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=415293130,2419074865&fm=27&gp=0.jpg">
					<el-upload
						class="img_box"
						action="/common/picUpload"
						:show-file-list="false"
						:on-success="uploadSuccess"
						:before-upload="uploadBefore">
						<span v-if="!uploadFlg">上传个性化浮层</span>
					</el-upload>
					<span class="upload-tip">建议尺寸：750*424像素，上传图片大小不能超过 1.5MB！</span>
				</div>
			</el-form-item>
			<el-form-item label="活动规则:">
				<el-button size='small' @click="setRules()" class="queryBtn">自动生成</el-button>
				<span class="ml_5">应平台要求请使用自动生成的活动规则内容，可自定义添加规则内容</span>
			</el-form-item>
			<div class="rules" ref="editArea" contenteditable="true" v-if="goodsData.activityDesc" v-html="goodsData.activityDesc"></div>
			<div class="rules" ref="editArea" contenteditable="true" v-else>
				<p>1.活动时间：{{today}} 至 {{today30}}</p>
				<p>2.参与会员：全体会员</p>
				<p>3.每日签到可获得1积分</p>
			</div>
			<div class="sign-btn">
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
import { clone, isWhiteList } from 'src/common/public.js';
import couponDialog from './coupons.vue';
import ajax from 'src/api/index.js';
import store from 'src/store.js';
import discountDialog from './discount.vue';
	export default{
		props: {
			goodsType: {
				type: Number,
				default: 1
			}
		},
		data() {
			return{
				rewardIndex: '',
				labelName: '',
				createLoading: false,
				activityId: '',
				currentAcitveData: {},
				uploadFlg: false,
				shopName: '',
				today: dateFormat(new Date().setHours(0,0,0,0),'YY-MM-DD HH:MM:SS'),
				today30: dateFormat(new Date(new Date().getTime() + 2592000000).setHours(23,59,59,59),'YY-MM-DD HH:MM:SS'),
				goodsData: {
				   activityName: '',
				   startTime: dateFormat(new Date().setHours(0,0,0,0),'YY-MM-DD HH:MM:SS'),
				   endTime: dateFormat(new Date(new Date().getTime() + 2592000000).setHours(23,59,59,59),'YY-MM-DD HH:MM:SS'),
				   accumulatedSignSetting: {//累计签到
					"signType": "total",
					"signRuleDesc": [
						{
							
						}
					]
					},
					activityDesc: ''
				},
				grade: ['一','二','三','四','五'],
				actNameError: '',
				labelPosition: 'right',
				activityStatusVal: '',
				activityStatus: false,
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
			}
		},
	    beforeRouteEnter(to, from, next){
			next(vm => {
				vm.hsitoryUrl = from.path;
			})
		},
		watch: {
			'goodsData.startTime'(val){
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
			'goodsData.endTime'(val){
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
			switch (this.goodsType) {
				case 1:
					this.labelName = '收藏';
					this.goodsData.activityName = '收藏有礼'+dateFormat(new Date(),'YYMMDDHHMMSS');
					break;
			    case 2:
					this.labelName = '加购';
					this.goodsData.activityName = '宝贝加购'+dateFormat(new Date(),'YYMMDDHHMMSS');
				    break;
				default:
					break;
			}
		},
		components: {
			couponDialog,
			discountDialog
		},
		methods: {
			checkCoupon(index,obj) {
               this.$refs.addCoupon.addCoupons(index,obj.rewardTypeValue);
			},
			showCouponMsg(data,index) {
				let vm = this,
					_obj = vm.goodsData.accumulatedSignSetting.signRuleDesc[index],
					_discount = data.discountType == 1 ? data.discount : data.discount*10,
					type = data.bindType == 1 ? '店铺优惠券' : '商品优惠券',
					_giftMsg = '';
				vm.$set(_obj,'giftName',data.name);
				_obj.rewardTypeValue = data.couponId;
				_obj.price =  data.discountType == 1 ? data.discount : data.discount*10;
				_obj.link = data.link;
				_obj.couponCheckType = data.discountType;
				_obj.bindType = data.bindType;
				_obj.couponValue = _discount;
				_obj.quota = data.quota;
				_giftMsg = type + '，' + '满'+(data.quota || '-')+'元可用，'+'优惠券面值：'+_discount+(data.discountType == 1 ? '元':'折');
				this.$set(_obj,'giftMsg',_giftMsg);				
			},
			del(index) {
               this.goodsData.accumulatedSignSetting.signRuleDesc.splice(index,1);
			},
			add() {
				var vm = this;
				this.goodsData.accumulatedSignSetting.signRuleDesc.push({
					
				})
			},
			uploadSuccess(file) {
				if(file.result == '100') {
                    this.couponData.picUrl = file.data.picUrl;
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
			back() {
				let _url = this.hsitoryUrl == '/' ? '/interactionCenter' :  this.hsitoryUrl;
				this.$router.push({path: _url})
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
			disCountData(json) {
				console.log(json);
				return false;
				this.$set(this,'setDiscountData',json);

				let vm = this,
					obj = vm.goodsData.accumulatedSignSetting.signRuleDesc[index];
					obj.shopName = json.activityName;
					obj.discount = json.discount;
					obj.price = json.price;
					obj.skuLen = json.skuLen;
					obj.wareId = json.wareId;
					obj.wareLogo = json.wareLogo;
			},
			setDiscount(index) {
				this.rewardIndex = index;
                this.$refs.setDiscount.setDiscount();
			},
			setRules() {
				
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
	  .inline-block {
		  display: inline-block;
	  }
	  .gray {
		  color: #666;
	  }
	  .renew {
		  color: #3089DE;
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
				padding: 10px 0 10px 10px;
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
  .img_content {
   position: relative;
   img {
	   width: 150px;
	   height: 200px;
   }
   .loading {
	   position: absolute;
	   top: 100px;
       left: 55px;
   }
   .img_box {
	   position: absolute;
	   bottom: 35px;
	   left: 160px;
	   span {
		   color: #3089DE;
	   }
   }
   .upload-tip {
	   position: absolute;
	   bottom: 6px;
       left: 160px;
   }
}
</style>