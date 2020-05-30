<template>
	<div class="coupon-box" v-loading="createLoading">
		<el-form :label-position="labelPosition" label-width="200px" :model="couponData" v-if="couponData">
			<el-form-item label="选择指定优惠券：">
				<span>{{checkCouponName}}</span>
				<el-button v-if="!giftStatus" class="m_l10" type="text" @click="checkCoupon()">{{couponData.couponId ? '重新选择':'选择优惠券'}}</el-button>
				<p>{{giftMsg}}</p>
				<p class="error-tip red" v-if="!couponData.couponId && isSubmit">请选择优惠券！</p>
			</el-form-item>
			<el-form-item label="活动名称：">
				<el-input class="w300" :disabled="couponData.status == 'invalid'"  auto-complete="off" v-model="couponData.giftName"></el-input>
				<span>{{couponData.giftName.length}}/20</span>
				<p class="error-tip red" v-if="!couponData.giftName && isSubmit">活动名称不能为空！</p>
				<p class="error-tip red" v-if="couponData.giftName.length > 20">活动名称最多20个字符！</p>
			</el-form-item>
            <el-form-item label="活动起止时间：">
				<el-date-picker
				    v-model="couponData.upTime"
					:clearable = false
					:disabled = 'giftStatus'
					type="datetime"
					placeholder="选择日期"
					class="row_date"
					:picker-options="pickerStartTime">
				</el-date-picker> 至
				<el-date-picker
				    v-model="couponData.downTime"
					:clearable = false
					:disabled="couponData.status == 'invalid'"
					type="datetime"
					placeholder="选择日期"
					:picker-options="pickerEndTime">
				</el-date-picker>
				<p class="error-tip red" v-if="new Date(couponData.downTime).getTime() <= new Date(couponData.upTime).getTime()">下架时间不能小于等于上架时间，请重新选择！</p>
				<span class="timeHint">礼品有效期不得超过订购有效期<a href="http://fw.jd.com/657606.html" target="_blank">立即续订</a></span>
			</el-form-item>
            <el-form-item label="参与等级：">
				<el-checkbox-group v-model="checkedMembers"  style="display:inline-block;margin-left:10px;">
					<el-checkbox v-for="member in members" :disabled = 'giftStatus' :label="member" :key="member">{{member}}</el-checkbox>
				</el-checkbox-group>
				<p class="error-tip red" v-if="!checkedMembers.length && isSubmit">请选择兑换需要的等级！</p>
			</el-form-item>
            <el-form-item label="瓜分门槛：">
                 <span>需要</span>
				 <el-input class="w50" :disabled = 'giftStatus'  auto-complete="off" @blur="blurInp('people')" v-model="couponData.people"></el-input>
                 <span>位好友一起参与瓜分，才能领取优惠券（x+1人瓜分领券）</span>
			</el-form-item>
            <el-form-item label="优惠券数量：">
				 <el-input class="w50" :disabled = 'giftStatus'  auto-complete="off" @blur="blurInp('couponNum')" v-model="couponData.couponNum"></el-input>
                 <span class="v-m">优惠券数量必须是（x+1）的整数倍</span>
			</el-form-item>
			<el-form-item label="展示图片：">
				<div class="img_content">
					<span class="loading" v-if="uploadFlg1"  v-loading="uploadFlg1" style="line-height: 0;"></span>
					<el-upload
						class="img_box"
						action="/common/picUpload"
						:disabled = 'giftStatus'
						:show-file-list="false"
						:on-success="(res,file)=>{return uploadSuccess(res, 1)}"
						:before-upload="(res,file)=>{return uploadBefore(res, 1)}">
						<img v-if="couponData.picUrl" :src="couponData.picUrl">
						<span v-if="!uploadFlg1 && !giftStatus">上传图片</span>
					</el-upload>
					<span class="upload-tip">建议尺寸：750*424像素，上传图片大小不能超过 1.5MB！</span>
				</div>
				<p class="error-tip red"></p>
			</el-form-item>
			<el-form-item label="分享链接设置:">
				<div class="inviting-set-content">
					<div class="inviting-set inviting-link-set">
						<span class='lab'>邀请链接标题：</span>
						<textarea :disabled="couponData.status == 'invalid'" v-model="couponData.invitationTitle"></textarea>
						<span class="lab-word">{{couponData.invitationTitle.length}}/24</span>
						<p v-if="!couponData.invitationTitle" ref="errorTip" class="error-tip red">请设置邀请链接标题！</p>
						<p v-if="couponData.invitationTitle.length > 24" ref="errorTip" class="error-tip red">邀请链接标题最多可设置24个字符！</p>
					</div>
					<div class="inviting-set inviting-link-set">
						<span class='lab'>邀请链接介绍：</span>
						<textarea :disabled="couponData.status == 'invalid'" v-model="couponData.invitationDesc"></textarea>
						<span class="lab-word">{{couponData.invitationDesc.length}}/24</span>
						<p v-if="couponData.invitationDesc.length > 24" ref="errorTip" class="error-tip red">邀请链接介绍最多可设置24个字符！</p>
					</div>
					<div class="inviting-set inviting-link-set">
						<span class='lab'>邀请链接封面：</span>
						<div class="img_content2">
							<span class="loading" v-if="uploadFlg2"  v-loading="uploadFlg2" style="line-height: 0;"></span>
							<img v-if="couponData.invitationLogo" :src="couponData.invitationLogo">
							<div class="no-img" v-else></div>
							<el-upload
								class="img_box"
								action="/common/picUpload"
								:show-file-list="false"
								:on-success="(res,file)=>{return uploadSuccess(res, 2)}"
						        :before-upload="(res,file)=>{return uploadBefore(res, 2)}">
								<span v-if="!uploadFlg2 && couponData.status != 'invalid'">上传图片</span>
							</el-upload>
							<span class="upload-tip">建议图片尺寸：100*100像素</span>
						</div>
					</div>
				</div>
				<div class="preview-box">
                   <div class="preview-one" v-if="couponData.invitationDesc">
					   <p class="preview-title">{{couponData.invitationTitle}}</p>
					   <div class="preview-content">
						   <p>{{couponData.invitationDesc}}</p>
					       <img v-if="couponData.invitationLogo" :src="couponData.invitationLogo" alt="">
						   <div class="no-img" v-else></div>
					   </div>
				   </div>
				   <div class="preview-two">
					   <div class="preview-content">
					       <img v-if="couponData.invitationLogo" :src="couponData.invitationLogo" alt="">
						   <div class="no-img" v-else></div>
						   <p class="preview-title">{{couponData.invitationTitle}}</p>
					   </div>
				   </div>
				</div>
		    </el-form-item>
            <el-form-item label="活动规则:">
				<el-button size='small' @click="setRules()" class="queryBtn">自动生成</el-button>
				<span class="ml_5">应平台要求请使用自动生成的活动规则内容，可自定义添加规则内容</span>
			</el-form-item>
			<div class="rules" ref="editArea" contenteditable="true" v-if="couponData.activityDesc" v-html="couponData.activityDesc"></div>
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
				<el-button size='small' class="queryBtn" @click="cancelCreate()">{{couponData.status != 'invalid'?'取消':'返回'}}</el-button>
				<el-button v-if="couponData.status != 'invalid'" type="primary" size='small' @click="createAct()">确定</el-button>
			</div>
		</el-form>
		<coupon-dialog ref="addCoupon" @showCoupon="showCouponMsg" :data="currentAcitveData"></coupon-dialog>
	</div>
</template>

<script>
import couponDialog from '../interaction/coupons.vue';
import dateFormat from 'src/common/dateFormat.js';
import { clone, isWhiteList } from 'src/common/public.js';
import ajax from 'src/api/index.js';
import store from 'src/store.js';
let sTime = '',eTime = '';
	export default{
		data() {
			return{
				labelPosition: 'right',
				isUnified: true,
				isSubmit: false,
				hasSubmit: false,
				hsitoryUrl: '',
				giftId: '',
				giftMsg: '',
				isAdd: false,
				checkCouponType: '',
				checkCouponName: '',
                giftStatus: false,
                today: dateFormat(new Date().setHours(0,0,0,0),'YY-MM-DD HH:MM:SS'),
			    today30: dateFormat(new Date(new Date().getTime() + 2592000000).setHours(23,59,59,59),'YY-MM-DD HH:MM:SS'),
				couponData: {
				   couponId: '',
				   giftName: '',
				   couponCheckType: '',
				   upLimit: 1,
				   price: '',
				   couponJson: '',
				   giftIntro: '',
				   upTime: dateFormat(new Date().setHours(0,0,0,0),'YY-MM-DD HH:MM:SS'),
				   downTime: dateFormat(new Date(new Date().getTime() + 2592000000).setHours(23,59,59,59), 'YY-MM-DD HH:MM:SS'),
				   needLevel: '',
				   people: '1',
				   couponNum: '1',
				   needPoint: '1',
                   invitationTitle: '',
                   invitationDesc: '我找到一张优惠券，大家一起来瓜分！',
                   invitationLogo: '',
				   picUrl: 'http://kmcrmpic1.oss-cn-hangzhou.aliyuncs.com/wechatQrCodeImg/2018051116/2963914609_1526026777492_.png'
				},
				checkedMembers: [],
				members: [],
				createLoading: false,
				uploadFlg1: false,
				uploadFlg2: false,
				currentAcitveData: {
					couponId: ''
				},
				pickerStartTime: {
					disabledDate: (time) => {
						if(isWhiteList()){
							return false;
						}
						return (time.getTime() > new Date(this.couponData.downTime).getTime()) || (time.getTime() < Date.now() - 8.64e7);
					}
				},
				pickerEndTime: {
					disabledDate: (time) => {
						if(isWhiteList()){
							return false;
						}
						return (time.getTime() <  new Date(new Date().setHours(0,0,0,0)).getTime()) || (time.getTime() > new Date(store.state.user.endTime).getTime());
					}
				},
			}
		},
		created(){
		    //判断默认时间与软件到期时间
			if(new Date(store.state.user.endTime).getTime() < new Date().getTime() + 2592000000) {
				this.couponData.downTime = store.state.user.endTime;
			};
			this.giftId = this.$route.query.id;
			this.giftId ? this.couponData = '' : '';
			this.getMemberSet(
			  checkMember => {
				  this.giftId && this.getCouponMsg(this.giftId,checkMember)
			  }
			);
		},
		beforeRouteEnter(to, from, next){
			next(vm => {
				vm.hsitoryUrl = from.path;
			})
		},
		watch: {
			'couponData.upTime'(val){
				if(val){
					this.pickerEndTime = {
						disabledDate(time) {
							if(isWhiteList()){
								return false;
							}
							return (time.getTime() < new Date(val).setHours(0,0,0,0)) || (time.getTime() > new Date(store.state.user.endTime).getTime());
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
			'couponData.downTime'(val){
				if(val){
					this.pickerStartTime = {
						disabledDate: (time) => {
							if(isWhiteList()){
								return false;
							}
							return (time.getTime() > new Date(this.couponData.downTime).getTime()) || (time.getTime() < Date.now() - 8.64e7);
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
		components: {
			couponDialog
		},
		methods: {
			getCouponCheckMsg(id) {
				let vm = this;
                ajax({
					api_name: 'couponQuery',
					vm: this,
					data: {
						bindType: '',
						couponName: ''
					}
				}, (res) => {
                   if( res.data.couponList && res.data.couponList.length) {
					   res.data.couponList.forEach(item => {
						   if(item.couponId == id) {
								vm.checkCouponName = item.name;
								let type = item.bindType == 1 ? '店铺优惠券' : '商品优惠券';
								let _discount =  item.discountType == 1 ? item.discount : item.discount*10;
								vm.checkCouponType = item.discountType;
								vm.couponData.couponJson = JSON.stringify(item);
								vm.giftMsg = type + '，' + '满'+(item.quota || '-')+'元可用，'+'优惠券面值:'+_discount+(item.discountType == 1 ? '元':'折');
						   }
					   })
				   }
				}, (error) => {});
			},
			checkCoupon() {
               this.$refs.addCoupon.addCoupons('',this.couponData.couponId);
			},
			showCouponMsg(data) {
				this.couponData.couponId = data.couponId;
				this.checkCouponName = data.name;
				this.couponData.giftName = data.name;
				this.couponData.invitationTitle = data.name;
				this.couponData.couponCheckType = data.discountType;
				let type = data.bindType == 1 ? '店铺优惠券' : '商品优惠券';
				let _discount =  data.discountType == 1 ? data.discount : data.discount*10;
				this.checkCouponType = data.discountType;
				this.giftMsg = type + '，' + '满'+(data.quota || '-')+'元可用，'+'优惠券面值:'+_discount+(data.discountType == 1 ? '元':'折');
				this.couponData.price = _discount;
				this.couponData.couponJson = JSON.stringify(data);
				this.couponData.giftIntro = this.giftMsg;
			},
			blurInp(item,key) {
				let name = key != undefined ? item+key : item;
				let obj = this['couponData'][name];
				if(!obj) {
					this['couponData'][name] = '1';
					return;
				}else if(isNaN(Number(obj)) || /\./.test(obj) || /\+/.test(obj) || Number(obj <= 0)) {
					this.$message.error('只能输入正整数！');
					this['couponData'][name] = '1';
					return;
				}
			},
			uploadSuccess(file, index) {
				if(file.result == '100') {
					if(index == 1) {
                        this.couponData.picUrl = file.data.picUrl;
					}else {
                        this.couponData.invitationLogo = file.data.picUrl;
					}
				}else {
					this.$message.error(file.message || '图片上传失败！');
				};
				this['uploadFlg'+index] = false;
			},
			uploadBefore(file, index) {
				const isIMAGE = /image\/\w+/.test(file.type);
				const isLt2M = file.size / 1024 / 1024 < 1.5;

				if (!isIMAGE) {
					this.$message.error('上传图片只能是 JPG 格式!');
				}
				if (!isLt2M) {
					this.$message.error('上传图片大小不能超过 1.5MB!');
				}
				if(isIMAGE && isLt2M){
					this['uploadFlg'+index] = true;
				}
				return isIMAGE && isLt2M;
			},
			createAct() {
				let vm = this,
					couponParma = clone(vm.couponData),
					isOk = true,
					needLevelArr = [];
				if(vm.hasSubmit) {
                    return false;
				};
			    vm.isSubmit = true;
				if(vm.checkedMembers.length) {
					vm.checkedMembers.forEach(item => {
						needLevelArr.push(vm.members.indexOf(item) + 1);
					})
				};
				couponParma.needLevel = needLevelArr.sort().join(',');
				delete couponParma.status;
				//参数检测
				console.log(couponParma)
				for(var item in couponParma) {
					if(!couponParma[item] && item != 'giftIntro') {
						isOk = false;
					}else if(item == 'giftIntro' && couponParma[item].length > 60) {
                        isOk = false;
					}else if(item == 'giftName' && couponParma[item].length > 20) {
                        isOk = false;
					}
				};
				//时间检测
				if(new Date(couponParma.downTime).getTime() <= new Date(couponParma.upTime).getTime()) {
                   isOk = false;
				};
				//拦截关键词
				let _activityDesc = couponParma.giftIntro,
					sensitive = ['解释','解释权','商家所有','归商家所有'],
					isHasSensitive = false;
					sensitive.forEach(obj => {
						if(_activityDesc.indexOf(obj) != -1) {
							isHasSensitive = true;
						}
					});
				if(isHasSensitive)  {
					this.$message.error('请输入正确的礼品介绍！');
					return false;
				};
				if(isOk) {
					vm.isSubmit = false;
					vm.hasSubmit = true;
					vm.createLoading = true;
					couponParma.giftIntro = couponParma.giftIntro.replace(/[\n\r]/g,'<br>');
					couponParma.giftType = 'coupon';
					couponParma.upTime = couponParma.upTime ? (dateFormat(couponParma.upTime,'YY-MM-DD HH:MM:SS')) : '';
					couponParma.downTime = couponParma.downTime ? (dateFormat(couponParma.downTime,'YY-MM-DD HH:MM:SS')) : '';

					ajax({
						api_name: 'saveGift',
						vm: this,
						data: couponParma
					}, (res) => {
						vm.createLoading = false;
						this.$message.success(couponParma.id ? '礼品修改保存成功！':'礼品创建成功！');
						setTimeout(() => {
							this.$router.push({path: '/giftList'});
						}, 1300);
					}, (error) => {
						vm.hasSubmit = false;
						vm.createLoading = false;
						console.log(error);
						vm.$message.error(error.message || (couponParma.id ? '礼品修改保存失败！':'礼品创建失败！'));
					});
				}else {
					vm.hasSubmit = false;
					vm.createLoading = false;
                    this.$message.error('信息填写有误，请检查后重新提交！');
				}
			},
			cancelCreate() {
			    let _url = this.hsitoryUrl == '/' ? '/integralCenter' :  this.hsitoryUrl;
				this.$router.push({path: _url})
			},
			getCouponMsg(id,checkMember) {
				let _id = id || '',
				    vm = this;
				vm.createLoading = true;
                ajax({
					api_name: 'giftById',
					data: {
						id: _id
					},
				}, result => {
					vm.createLoading = false;
					vm.$set(vm,'couponData',result.data);
					vm.couponData.giftIntro = vm.couponData.giftIntro.replace(/<br>/g,'\n');
					//获取已选择优惠券信息
					vm.getCouponCheckMsg(result.data.couponId);
					vm.giftStatus = result.data.status == 'valid' || result.data.status == 'invalid' ? true : false;
					let _needLevel = result.data.needLevel.split(',');
					vm.checkedMembers = [];
					_needLevel.forEach(item => {
						vm.checkedMembers.push(checkMember[item - 1]);
					});
					vm.isUnified = result.data.needPoint ? true : false;
				}, error => {
					vm.$message.error(error.message || '获取礼品信息失败！');
				});
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
		}
	}
</script>

<style lang="less">
.coupon-box {
	.el-input{
		height: 30px;
		line-height: 28px;
		&.w300 {
			width: 300px;
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
	.el-textarea {
        &.couponDesc {
			width: 350px;
			height: 90px;
			.el-textarea__inner {
				height: 100%;
				resize: none;
			}
		}
	}
	.el-form-item {
		margin-bottom: 10px;
	}
}
</style>
<style lang="less" scoped>
.coupon-box {
	padding: 20px 0 50px 20px;
    box-sizing: border-box;
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
    .img_content2 {
		position: relative;
		.no-img {
			width: 100px;
			height: 100px;
			background: rgba(0,0,0,0.4);
			display: inline-block;
		}
		img {
			width: 100px;
			height: 100px;
			background: rgba(0,0,0,0.4);
		}
		.loading {
			position: absolute;
			top: 52px;
			left: 31px;
		}
		.img_box {
			position: absolute;
			bottom: 35px;
			left: 113px;
			span {
				color: #3089DE;
			}
		}
		.upload-tip {
			position: absolute;
			bottom: 6px;
			left: 113px;
		}
	}
	.ml_5 {
		margin-left: 5px;
	}
	.ml_10 {
		margin-left: 10px;
	}
	.v-bottom {
		vertical-align: bottom;
	}
	.error-tip {
		line-height: 14px;
		font-size: 12px;
    }
    .v-m {
        vertical-align: middle;
    }
}

.img_content {
	position: relative;
	.upload-tip {
	  position: absolute;
	  bottom: 0;
	  left: 385px;
	  font-size: 12px;
	  color: #999;
	}
	.img_box {
		width: 375px;
		height: 212px;
		border-radius: 4px;
		overflow: hidden;
		position: relative;
		text-align: center;
		display: inline-block;
		img {
			width: 100%;
			height: 100%;
			position: absolute;
			z-index: 2;
			left: 0;
			top: 0;
		}
		span {
			font-size: 14px;
			line-height: 212px;
			color: #fff;
			position: absolute;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
			z-index: 3;
			background: rgba(79,79,79,0.5)
		}
	}
	.loading {
        width: 375px;
		height: 212px;
		position: absolute;
		z-index: 4;
		left: 0;
		top: 0;
	}
}
.timeHint{
	color: #888;
	font-size: 12px;
	margin-left: 10px;
	a{
		margin-left: 20px;
		color: #20a0ff;
	}
}
.inviting-set-content {
        padding: 10px;
        min-width: 600px;
        display: inline-block;
        background: #f6f6f6;
        border: 1px solid #ddd;
        .inviting-set {
            padding: 10px 0 10px 10px;
            border-bottom: 1px solid #ddd;
            position: relative;
            &.inviting-link-set {
                padding-left: 110px;
                border-bottom: 0;
                textarea {
                    width: 400px;
                    height: 54px;
                    resize: none;
                    font-family: inherit;
                }
            }
            &:last-child {
                border-bottom: 0;
            }
            .inline {
                display: inline-block;
            }
            .lab-word {
                position: absolute;
                bottom: 2px;
                margin-left: 10px;
            }
            .lab {
                position: absolute;
                top: 3px;
                left: 10px;
            }
            .inviting-set-item {
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
.preview-box {
	display: inline-block;
	position: relative;
	vertical-align: top;
	word-break: break-all;
    .preview-one {
		width: 300px;
		padding: 10px;
	    border: 1px solid #ddd;
		border-radius: 4px;
		min-height: 120px;
		.preview-title {
			line-height: normal;
		}
		.preview-content {
			p {
			   display: inline-block;
			   max-width: 195px;
			   vertical-align: top;
			   line-height: normal;
			   font-size: 12px;
			   color: #999;
			   margin-top: 10px;
			}
			.no-img {
				width: 100px;
				height: 100px;
				background: rgba(0,0,0,0.4);
				display: inline-block;
				vertical-align: top;
				float: right;
			}
			img {
				width: 100px;
				height: 100px;
				display: inline-block;
				vertical-align: top;
				float: right;
			}
		}
	}
	.preview-two {
		width: 300px;
		padding: 10px;
	    border: 1px solid #ddd;
		border-radius: 4px;
		margin-top: 10px;
		.preview-content {
			padding-left: 110px;
			position: relative;
			min-height: 100px;
			.no-img {
				width: 100px;
				height: 100px;
				background: rgba(0,0,0,0.4);
				position: absolute;
				top: 0px;
				left: 0px;
			}
			img {
				width: 100px;
				height: 100px;
				position: absolute;
				top: 0px;
				left: 0px;
			}
		    .preview-title {
				line-height: normal;
			}
		}
	}
}
</style>
