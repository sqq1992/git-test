<template>
	<div class="flow-box interaction-box" v-loading="createLoading">
		<div v-if="memberData">
			<el-form :label-position="labelPosition" label-width="200px" :model="memberData">
				<el-form-item label="活动名称：">
					<el-input class="w200"  @keyup.native="checkActName(memberData.name)" v-model.trim="memberData.name" auto-complete="off"></el-input>
					<span>{{memberData.name.length}}/20</span>
					<p ref="errorTip" class="error-tip red" v-if="actNameError!=''">{{actNameError}}</p>
				</el-form-item>
				<el-form-item label="活动起止时间：">
					<el-date-picker
						v-model="memberData.startTime"
						:clearable = false
						type="datetime"
						placeholder="选择日期"
						class="ui-filter-pd w200"
						:picker-options="pickerStartTime">
					</el-date-picker> -
					<el-date-picker
						v-model="memberData.endTime"
						:clearable = false
						type="datetime"
						placeholder="选择日期"
						class="ui-filter-pd w200"
						:picker-options="pickerEndTime">
					</el-date-picker>
					<span class="ml_5 gray ft-14">活动有效期不得超过订购有效期</span>
					<a href="http://fw.jd.com/657606.html" class="renew" target="_blank">立即续订</a>
				</el-form-item>
        <!-- 品牌会员隐藏 -->
				<el-form-item label="参与等级：" v-if="!inBrand">
          <el-radio v-model="memberData.mode" :label="3">全部</el-radio>
          <el-radio v-model="memberData.mode" :label="1">领卡入会</el-radio>
          <el-radio v-model="memberData.mode" :label="2">消费入会</el-radio>
				</el-form-item>
				<el-form-item label="关注店铺奖励：">
					<div class="flow-set-conten">
						<div class="flow-set">
							<el-checkbox v-model="memberData.pointsMsg.isCheck">积分：</el-checkbox>
							<p class="inline">
                <el-input @blur="blurInp()" v-model="memberData.pointsMsg.points" class="w50" :disabled="!memberData.pointsMsg.isCheck"  auto-complete="off"></el-input>
                <span class="ml_5">积分</span>
              </p>
							<p ref="errorTip" class="error-tip red mt_10" v-if="memberData.pointsMsg.isCheck && !memberData.pointsMsg.points">请设置积分值！</p>
						</div>
						<div class="flow-set">
							<el-checkbox v-model="memberData.coupon.isCheck">优惠券：</el-checkbox>
							<span v-if="memberData.coupon.giftName">
                {{memberData.coupon.giftName}}
              </span>
							<a href="javascript:;" @click="checkCoupon(memberData.coupon)">
                {{memberData.coupon.giftMsg ? '重新选择':'选择优惠券'}}
              </a>
							<p class="gary" v-if="memberData.coupon.giftMsg">
                {{memberData.coupon.giftMsg}}
              </p>
							<p ref="errorTip" class="error-tip red mt_10" v-if="memberData.coupon.isCheck && !memberData.coupon.giftMsg">请选择优惠券！</p>
						</div>
					</div>
				</el-form-item>
				<div class="flow-btn">
					<el-button size='small' class="queryBtn" @click="back">取消</el-button>
					<el-button type="primary" size='small' @click="createAct()">{{activityId ? '保存活动': '保存并创建活动'}}</el-button>
				</div>
			</el-form>
			<coupon-dialog ref="addCoupon" @showCoupon="showCouponMsg" :data="currentAcitveData"></coupon-dialog>
		</div>
	</div>
</template>

<script>
import dateFormat from 'src/common/dateFormat.js';
import { clone, isWhiteList } from 'src/common/public.js';
import couponDialog from './coupons.vue';
import ajax from 'src/api/index.js';
import store from 'src/store.js';
	export default{
		data() {
      let inBrand = this.$store.state.user.inBrand;
			return{
				activityId: '',
				historyUrl: '',
				isSubmit: false,
				shopName: '',
				actNameError: "",
				labelPosition: 'right',
				today: dateFormat(new Date().setHours(0,0,0,0),'YY-MM-DD HH:MM:SS'),
				today30: dateFormat(new Date(new Date().getTime() + 2592000000).setHours(23,59,59,59),'YY-MM-DD HH:MM:SS'),
				currentAcitveData: {},
				memberData:{
					 name: (inBrand ? '开卡奖励' :'新人入会礼' )+ dateFormat(new Date(),'YYMMDDHHMMSS'),
				     startTime: dateFormat(new Date().setHours(0,0,0,0),'YY-MM-DD HH:MM:SS'),
					 endTime: dateFormat(new Date(new Date().getTime() + 2592000000).setHours(23,59,59,59),'YY-MM-DD HH:MM:SS'),
					 activityDesc: '',
					 coupon: {},
           pointsMsg: {},
           mode:3,
				},
				createLoading: false,
				pickerStartTime: {
					disabledDate: (time) => {
						if(isWhiteList()){
							return false;
						}
						return (time.getTime() > new Date(this.memberData.endTime).getTime()) || (time.getTime() < Date.now() - 8.64e7);
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
        inBrand:this.$store.state.user.inBrand
			}
		},
    beforeRouteEnter(to, from, next){
			next(vm => {
				vm.historyUrl = from.path;
			})
		},
		watch: {
			'memberData.startTime'(val){
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
			'memberData.endTime'(val){
				if(val){
					this.pickerStartTime = {
						disabledDate: (time) => {
							if(isWhiteList()){
								return false;
							}
							return (time.getTime() > new Date(this.memberData.endTime).getTime()) || (time.getTime() < Date.now() - 8.64e7);
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
				this.memberData.endTime = store.state.user.endTime;
				this.today30 = store.state.user.endTime;
			};
			this.activityId = this.$route.query.id;
			this.getShopMsg(this.activityId)
		},
		components: {
			couponDialog
		},
		methods: {
			checkActName(_val) {
               if(!_val || _val == '') {
				  this.actNameError = '活动名称不能为空！';
			   }else if(_val.length>20) {
				   this.actNameError = '活动名称最多20个字！';
			   }else {
				   this.actNameError = '';
			   }
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
			   this.$set(this.memberData.coupon,'isCheck', true);
			   let chheckId = this.memberData.coupon.couponId || '';
			   this.$refs.addCoupon.addCoupons('',chheckId,custom);
			},
			showCouponMsg(data,index) {
				let _discount = data.discountType == 1 ? data.discount : data.discount*10,
					type = data.bindType == 1 ? '店铺优惠券' : '商品优惠券',
					_obj = this.memberData.coupon,
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
				let obj = this.memberData.pointsMsg;
				if(!obj.points) {
					this.$set(obj,'points','1');
					return;
				}else if(isNaN(Number(obj.points)) || /\./.test(obj.points) || /\+/.test(obj.points) || Number(obj.points <= 0)) {
					this.$message.error('只能输入正整数！');
					this.$set(obj,'points','1');
					return;
				}
				return;
			},
			createAct() {
				let vm = this,
					params = clone(vm.memberData),
					_pointsMsg = params.pointsMsg,
					_couponMsg = params.coupon;
				//保存折扣
				params.startTime = params.startTime ? (dateFormat(params.startTime,'YY-MM-DD HH:MM:SS')) : '';
        params.endTime = params.endTime ? (dateFormat(params.endTime,'YY-MM-DD HH:MM:SS')) : '';
        if(this.inBrand) {  //品牌会员只有领卡入会一种方式
            params.mode = 1;
        }
        if(!_pointsMsg.isCheck && !_couponMsg.isCheck){
          vm.$message.error('至少选择一个奖励类型！')
          return;
        }
				if(document.getElementsByClassName('error-tip').length) {
					vm.$message.error('信息填写有误，请检查后重新提交！');
					return false;
        };
         if(new Date(params.startTime) > new Date(params.endTime)) {
          vm.$message.error('开始时间不能大于结束时间！');
					return false;
        }
				if(vm.isSubmit) return;
        //积分奖励
        if(_pointsMsg.isCheck) {
          params.points = _pointsMsg.points;
        } else {
          delete params.points;
        }
        //优惠券奖励
        if(_couponMsg.isCheck) {
          params.coupon = {
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
          };
        }else {
          delete params.coupon;
        }
        delete params.pointsMsg;
        // params.coupon = JSON.stringify(params.coupon);
        vm.saveAct(params);
			},
			saveAct(params) {
          let vm = this;
          this.createLoading = true;
          this.isSubmit = true;
          ajax({
						api_name: 'newcomerActivity',
						data: params
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
				_id ? vm.memberData = '' : '';
				 ajax({
					api_name: 'getActivity',
					data: {
						id: _id
					},
					vm: this
				}, result => {
					vm.createLoading = false;
					vm.shopName =  result.data.shopName;
					if(_id) {
						let _data = result.data.activity;
            if(_data.points) {
              _data.pointsMsg = {
                points:_data.points,
                isCheck:true
              };
            } else {
              _data.pointsMsg = {};
            }
            if(_data.coupon) {
              let _coupon = _data.coupon;
              let type = _coupon.bindType == 1 ? '店铺优惠券' : '商品优惠券';
              _data.coupon.giftMsg = type + '，' + '满'+(_coupon.quota || '-')+'元可用，'+'优惠券面值：'+_coupon.price+(_coupon.couponCheckType == 1 ? '元':'折');
              _data.coupon.isCheck = true;
            } else {
              _data.coupon = {}
            }
						vm.$set(vm,'memberData',_data);
					};
				}, error => {
					vm.createLoading = false;
					vm.$message.error(error.message || '获取活动信息失败！');
				});
			},
			back() {
				let _url = this.historyUrl == '/' ? '/interactionCenter' :  this.historyUrl;
				this.$router.push({path: _url})
			},
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
