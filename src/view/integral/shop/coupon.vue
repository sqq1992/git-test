<template>
	<div class="coupon-box" v-loading="createLoading">
		<el-form :label-position="labelPosition" label-width="200px" :model="couponData" v-if="couponData">
			<el-form-item label="选择优惠券：">
				<span>{{checkCouponName}}</span>
				<el-button v-if="!giftStatus" class="m_l10" type="text" @click="checkCoupon()">{{couponData.giftName ? '重新选择':'选择优惠券'}}</el-button>
				<p>{{giftMsg}}</p>
				<p class="error-tip red" v-if="!checkCouponName && isSubmit">请选择优惠券！</p>
			</el-form-item>
			<el-form-item label="礼品名称：">
				<el-input class="w300" :disabled="couponData.status == 'invalid'"  auto-complete="off" v-model="couponData.giftName"></el-input>
				<span>{{couponData.giftName.length}}/20</span>
				<p class="error-tip red" v-if="!couponData.giftName && isSubmit">礼品名称不能为空！</p>
				<p class="error-tip red" v-if="couponData.giftName.length > 20">礼品名称最多20个字符！</p>
			</el-form-item>
			<el-form-item label="礼品面值：">
				<span v-if="couponData.price">{{couponData.price + (checkCouponType == 1 ? '元':'折')}}</span>
				<span v-else>暂无</span>
				<span></span>
			</el-form-item>
			<el-form-item label="礼品图片：">
				<div class="img_content">
					<span class="loading" v-if="uploadFlg"  v-loading="uploadFlg" style="line-height: 0;"></span>
					<el-upload
						class="img_box"
						action="/common/picUpload"
						:disabled = 'imgNotUpload'
						:show-file-list="false"
						:on-success="uploadSuccess"
						:before-upload="uploadBefore">
						<img v-if="couponData.picUrl" :src="couponData.picUrl">
						<span v-if="!uploadFlg && !imgNotUpload">上传图片</span>
					</el-upload>
					<span class="upload-tip">建议尺寸：750*424像素，上传图片大小不能超过 1.5MB！</span>
				</div>
				<p class="error-tip red"></p>
			</el-form-item>
			<el-form-item label="礼品介绍：">
				 <el-input :disabled="couponData.status == 'invalid'" type="textarea" class="couponDesc" v-model="couponData.giftIntro"></el-input>
				 <span class="v-bottom">{{couponData.giftIntro.length}}/60（非必填）</span>
				 <p  class="error-tip red" v-if="couponData.giftIntro.length > 60">礼品介绍最多60个字符！</p>
			</el-form-item>
			<el-form-item label="上下架时间：">
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
			<el-form-item label="总库存总量：">
				 <el-input class="w150" :disabled = 'giftStatus'  auto-complete="off" @blur="blurInp('allCount')" v-model="couponData.allCount"></el-input>
				 <el-input v-if="isAdd" class="w50"  auto-complete="off" @blur="blurInp('addCountNum')" v-model="couponData.addCountNum"></el-input>
				 <el-button v-if="couponData.status == 'valid'"  class="m_l10" type="text" @click="addCount()">{{isAdd ? '确定追加':'追加库存量'}}</el-button>
			</el-form-item>
			<el-form-item label="兑换需要等级：">
				<el-checkbox-group v-model="checkedMembers"  style="display:inline-block;margin-left:10px;">
					<el-checkbox v-for="member in members" :disabled = 'giftStatus' :label="member" :key="member">{{member}}</el-checkbox>
				</el-checkbox-group>
				<p class="error-tip red" v-if="!checkedMembers.length && isSubmit">请选择兑换需要的等级！</p>
			</el-form-item>
      <el-form-item label="积分商城展示：">
        <el-radio-group
          v-model="couponData.isShow"
        >
          <el-radio :label="1" checked>在积分商城中展示该礼品</el-radio>
          <el-radio :label="0">
            只能通过链接访问<span class="fc--gray">(勾选该项后，礼品将不展示在会员页积分商城中)</span>
          </el-radio>
        </el-radio-group>
      </el-form-item>
			<limit-member :giftStatus="giftStatus" @getUploadFile="getUploadFile" :limitMembers="couponData.limitMembers" @updateMsg="updateMsg"></limit-member>
			<el-form-item label="兑换所需积分：">
				<el-input v-if="isUnified" class="w150"  :disabled = 'giftStatus' auto-complete="off" @blur="blurInp('needPoint')"  v-model="couponData.needPoint"></el-input>
				<div v-else class="distribution-box">
					<ul v-if="checkedMembers.length">
						<li v-for="(item, index) in sortMember" :key="index">
							<span>{{item.name}}：</span>
							<el-input class="w50" :disabled = 'giftStatus'  auto-complete="off" @blur="blurInp('needPointLevel',item.index)" v-model="couponData['needPointLevel'+(item.index + 1)]"></el-input>
							<span class="ml_5">积分</span>
						</li>
					</ul>
					<div v-else class="no-data">请选择兑换需要的等级！</div>
					<el-button v-if="!isUnified && !giftStatus" class="m_l10 unified-set" type="text" @click="distribution()">统一设置</el-button>
				</div>
				<el-button v-if="isUnified && !giftStatus" class="m_l10" type="text" @click="distribution()">按会员等级设置</el-button>
			</el-form-item>
			<el-form-item label="每人兑换上限：">
				<el-select  class="ui-filter-pd" size="5" v-model="couponData.upLimit" :disabled = 'giftStatus'>
					<el-option v-for="(num, index) in 10" :key="index" :label="num" :value="num"></el-option>
				</el-select>
				<span class="ml_10 red">同一张未使用的优惠券只能成功领取1张，建议优惠券兑换上限设置为1</span>
			</el-form-item>
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
import limitMember from '../interaction/limitMember.vue';
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
				uploadFile: '',
				couponData: {
					limitMembers: 0,
					couponId: '',
					giftName: '',
					couponCheckType: '',
					upLimit: 1,
					price: '',
					isShow:1,
					couponJson: '',
					addCountNum: '1',
					giftIntro: '',
					upTime: dateFormat(new Date().setHours(0,0,0,0),'YY-MM-DD HH:MM:SS'),
					downTime: dateFormat(new Date(new Date().getTime() + 2592000000).setHours(23,59,59,59), 'YY-MM-DD HH:MM:SS'),
					needLevel: '',
					allCount: '1',
					needPoint: '1',
					needPointLevel1: '1',
					needPointLevel2: '1',
					needPointLevel3: '1',
					needPointLevel4: '1',
					needPointLevel5: '1',
					needPointLevel6: '1',
					picUrl: 'http://kmcrmpic1.oss-cn-hangzhou.aliyuncs.com/wechatQrCodeImg/2018051116/2963914609_1526026777492_.png'
				},
				checkedMembers: [],
				members: [],
				createLoading: false,
				uploadFlg: false,
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
				imgNotUpload: false
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
		computed: {
          sortMember() {
			  let _map = [],
			      vm = this;
			  this.checkedMembers.forEach(item => {
				  _map.push({
					  name: item,
					  index:  vm.members.indexOf(item)
				  })
			  });
			  return _map;
		  }
		},
		components: {
			couponDialog,
			limitMember
		},
		methods: {
			updateMsg({child, val}) {
				this.couponData[child] = val;
			},
			getUploadFile(file) {
                this.uploadFile = file;
			},
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
							    vm.getCouponItem(item);
						   }
					   })
				   }
				}, (error) => {});
			},
			getCouponItem(item) {
				let vm = this;
                vm.checkCouponName = item.name;
				let type = item.bindType == 1 ? '店铺优惠券' : '商品优惠券';
				let _discount =  item.discountType == 1 ? item.discount : item.discount*10;
				vm.checkCouponType = item.discountType;
				vm.couponData.couponJson = JSON.stringify(item);
				vm.giftMsg = type + '，' + '满'+(item.quota || '-')+'元可用，'+'优惠券面值:'+_discount+(item.discountType == 1 ? '元':'折');
			},
			checkCoupon() {
				let custom = '',
					obj = this.couponData;
				if(obj.giftIntro && !obj.couponId ) {
					try{
						custom =  JSON.parse(obj.couponJson)
					} catch(e){
						custom = '';
					}
				};
				this.$refs.addCoupon.addCoupons('',this.couponData.couponId, custom);
			},
			showCouponMsg(data) {
				this.couponData.couponId = data.couponId || '';
				this.checkCouponName = data.name;
				this.couponData.giftName = data.name;
				this.couponData.couponCheckType = data.discountType;
				let type = data.bindType == 1 ? '店铺优惠券' : '商品优惠券';
				let _discount =  data.discountType == 1 ? data.discount : data.discount*10;
				this.checkCouponType = data.discountType;
				this.giftMsg = type + '，' + '满'+(data.quota || '-')+'元可用，'+'优惠券面值:'+_discount+(data.discountType == 1 ? '元':'折');
				this.couponData.price = _discount;
				this.couponData.couponJson = JSON.stringify(data);
				this.couponData.giftIntro = this.giftMsg;
				this.couponData.couponSource = data.couponSource;
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
			addCount() {
				this.isAdd = !this.isAdd;
				if(!this.isAdd) {
				   this.couponData.allCount = Number(this.couponData.addCountNum) + Number(this.couponData.allCount);
				   this.couponData.addCountNuma = '1';
				}
			},
			distribution() {
               this.isUnified = !this.isUnified;
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
				if(vm.isUnified) {
					for(var i = 1;i <= 6; i++) {
                        delete couponParma['needPointLevel'+i];
					}
				}else {
					delete couponParma.needPoint;
					let checkLevel = [];
					vm.checkedMembers.forEach(item => {
						checkLevel.push(vm.members.indexOf(item) + 1);
					});
					for(var i = 1;i <= 6; i++) {
						if(checkLevel.indexOf(i) == -1) {
                          delete couponParma['needPointLevel'+i];
						}
					}
				};
				if(vm.checkedMembers.length) {
					vm.checkedMembers.forEach(item => {
						needLevelArr.push(vm.members.indexOf(item) + 1);
					})
				};
				couponParma.needLevel = needLevelArr.sort().join(',');
				delete couponParma.status;
				delete couponParma.addCountNum;
				//参数检测
				console.log(couponParma)
				for(var item in couponParma) {
					if(couponParma[item] == undefined && item != 'giftIntro') {
						if(item == 'couponId' || couponParma.couponSource == 2 || item == 'limitMembers') {

						}else {
							isOk = false;
						}
					}else if(item == 'giftIntro' && couponParma[item].length > 60) {
                        isOk = false;
					}else if(item == 'giftName' && couponParma[item].length > 20) {
                        isOk = false;
					} else if (!this.checkCouponName) {
						isOk = false
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
					//判断默认时间与软件到期时间
					if(vm.$route.query.type && vm.$route.query.type === 'copy'){
						delete couponParma.id;
					}
					let formData = new FormData();
					for(let item in couponParma) {
						let _data = couponParma[item];
						if(typeof _data == 'object'){
							_data = JSON.stringify(_data);
						}
						formData.append(item, _data)
					};
					formData.append('file', vm.uploadFile);
					ajax({
						api_name: 'saveGift',
						vm: this,
						data: formData
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
					if(vm.$route.query.type && vm.$route.query.type === 'copy'){
						result.data.status = '';
						delete result.data.couponId;
            result.data.isShow = result.data.isShow == undefined ?  1 :  result.data.isShow;
						result.data.upTime = dateFormat(new Date().setHours(0,0,0,0),'YY-MM-DD HH:MM:SS');
						if(new Date(store.state.user.endTime).getTime() < new Date().getTime() + 2592000000) {
							result.data.downTime = store.state.user.endTime;
						};
						result.data.price = '';
						result.data.giftName = '';
					}
					vm.$set(vm,'couponData',result.data);
					vm.couponData.giftIntro = vm.couponData.giftIntro.replace(/<br>/g,'\n');
					//获取已选择优惠券信息
					if(result.data.couponId) {
					   vm.getCouponCheckMsg(result.data.couponId);
					}else {
					   	let _price =  result.data.discountType == 1 ? result.data.price : result.data.price/10;
					   	if(!vm.$route.query.type || vm.$route.query.type !== 'copy'){
							vm.getCouponItem({
								bindType: result.data.bindType,
								name: result.data.giftName,
								discountType: result.data.couponCheckType,
								quota: result.data.quota,
								discount: result.data.price,
								link: result.data.link
							});
					   	}
					}
					vm.giftStatus = result.data.status == 'valid' || result.data.status == 'invalid' ? true : false;
					vm.imgNotUpload = result.data.status == 'invalid' ? true : false;
					let _needLevel = result.data.needLevel.split(',');
					vm.couponData.addCountNum = '1';
					vm.checkedMembers = [];
					_needLevel.forEach(item => {
						vm.checkedMembers.push(checkMember[item - 1]);
          });
          console.log(vm.checkedMembers);
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
	.turntable-btn {
		margin: 20px 0 0 200px;
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
.distribution-box {
	display: inline-block;
	border-radius: 4px;
	background: #f6f6f6;
	padding: 10px 90px 10px 20px;
	position: relative;
	text-align: right;
	.unified-set {
		position: absolute;
		top: 12px;
		right: 20px;
	}
	.no-data {

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
</style>
