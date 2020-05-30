<template>
	<div class="inviting-box interaction-box" v-loading="createLoading">
		<div v-if="invitingData">
<el-form :label-position="labelPosition" label-width="200px" :model="invitingData">
			<el-form-item label="活动名称：">
				<el-input class="w250" :disabled="activityStatusVal == 'invalid'"  @keyup.native="checkActName(invitingData.activityName)" v-model.trim="invitingData.activityName" auto-complete="off"></el-input>
				<span>{{invitingData .activityName.length}}/20</span>
				<p ref="errorTip" class="error-tip red" v-if="actNameError!=''">{{actNameError}}</p>
			</el-form-item>
			<el-form-item label="活动起止时间：">
				<el-date-picker
					v-model="invitingData.startTime"
					:clearable = false
					type="datetime"
					placeholder="选择日期"
					class="ui-filter-pd w200"
					:picker-options="pickerStartTime" :disabled="activityStatusVal != '' && activityStatusVal != 'wait'">
				</el-date-picker> -
				<el-date-picker
					v-model="invitingData.endTime"
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
			 <el-form-item label="邀请奖励:">
				<p>
					<el-radio :disabled="activityStatus" v-model="invitingData.rewrdType" label="1">固定奖励</el-radio>
			     	<el-radio :disabled="activityStatus" v-model="invitingData.rewrdType" label="2">阶梯奖励</el-radio>
				</p>
				<div class="inviting-set-conten" v-if="invitingData.rewrdType == 1">
					<div class="inviting-set">
						<span>每成功邀请一位好友关注店铺可获得</span>
						<el-input v-model="invitingData.fixed.points" @blur="blurInp('fixed','points')" class="w50" :disabled="activityStatus"  auto-complete="off"></el-input>
						<span class="ml_5">积分</span>
					</div>
					<div class="inviting-set">
						<span>每个会员最多可获得</span>
						<el-input v-model="invitingData.fixed.limit" @blur="blurInp('fixed','limit')" class="w50" :disabled="activityStatus"  auto-complete="off"></el-input>
						<span class="ml_5">次成功邀请奖励</span>
					</div>
			    </div>
				<div class="inviting-set-conten" v-if="invitingData.rewrdType == 2">
                    <div class="inviting-set" v-for="(item,index) in invitingData.ladder">
						<span>{{index+1}}.成功邀请第</span>
						<el-input class="w50 ml_5 mr_5" @blur="blurInp('ladder','num',index)" v-model="invitingData.ladder[index].num" :disabled="activityStatus"  auto-complete="off"></el-input>
						<span>位好友关注店铺可获得</span>
						<el-input class="w50 ml_5 mr_5" @blur="blurInp('ladder','points',index)" v-model="invitingData.ladder[index].points" :disabled="activityStatus"  auto-complete="off"></el-input>
						<span>积分</span>
						<el-button v-if="index > 2" class="m_l20" type="text" @click="deleteLadder(index)">删除</el-button>
					</div>
					<p class="error-tip red" v-if="ladderError">{{ladderError}}</p>
					<el-button v-if="invitingData.ladder.length<5 && !activityStatus" size='small' class="queryBtn mt_10" @click="addLadder()">新增一档</el-button>
				</div>
			</el-form-item>
			<el-form-item label="邀请链接设置:">
				<div class="inviting-set-conten">
					<div class="inviting-set inviting-link-set">
						<span class='lab'>邀请链接标题：</span>
						<textarea :disabled="activityStatusVal == 'invalid'" v-model="invitingData.invitationTitle"></textarea>
						<span class="lab-word">{{invitingData.invitationTitle.length}}/24</span>
						<p v-if="!invitingData.invitationTitle" ref="errorTip" class="error-tip red">请设置邀请链接标题！</p>
						<p v-if="invitingData.invitationTitle.length > 24" ref="errorTip" class="error-tip red">邀请链接标题最多可设置24个字符！</p>
					</div>
					<div class="inviting-set inviting-link-set">
						<span class='lab'>邀请链接介绍：</span>
						<textarea :disabled="activityStatusVal == 'invalid'" v-model="invitingData.invitationDesc"></textarea>
						<span class="lab-word">{{invitingData.invitationDesc.length}}/24</span>
						<p v-if="invitingData.invitationDesc.length > 24" ref="errorTip" class="error-tip red">邀请链接介绍最多可设置24个字符！</p>
					</div>
					<div class="inviting-set inviting-link-set">
						<span class='lab'>邀请链接封面：</span>
						<div class="img_content">
							<span class="loading" v-if="uploadFlg"  v-loading="uploadFlg" style="line-height: 0;"></span>
							<img :src="invitingData.invitationLogo">
							<el-upload
								class="img_box"
								action="/common/picUpload"
								:show-file-list="false"
								:on-success="uploadSuccess"
								:before-upload="uploadBefore">
								<span v-if="!uploadFlg && activityStatusVal != 'invalid'">上传图片</span>
							</el-upload>
							<span class="upload-tip">建议图片尺寸：100*100像素</span>
						</div>
					</div>
				</div>
				<div class="preview-box">
                   <div class="preview-one" v-if="invitingData.invitationDesc">
					   <p class="preview-title">{{invitingData.invitationTitle}}</p>
					   <div class="preview-content">
						   <p>{{invitingData.invitationDesc}}</p>
					       <img :src="invitingData.invitationLogo" alt="">
					   </div>
				   </div>
				   <div class="preview-two">
					   <div class="preview-content">
					       <img :src="invitingData.invitationLogo" alt="">
						   <p class="preview-title">{{invitingData.invitationTitle}}</p>
					   </div>
				   </div>
				</div>
		    </el-form-item>
			<el-form-item label="活动规则:">
				<el-button size='small' @click="setRules()" class="queryBtn">自动生成</el-button>
				<span class="ml_5">应平台要求请使用自动生成的活动规则内容，可自定义添加规则内容</span>
			</el-form-item>
			<div class="rules" ref="editArea" contenteditable="true" v-if="invitingData.activityDesc" v-html="formatActivityDesc(invitingData.activityDesc)"></div>
			<div class="rules" ref="editArea" contenteditable="true" v-else>
				<p>1.活动时间：{{today}} 至 {{today30}}</p>
				<p>2.参与会员：全体会员</p>
				<p>3.每成功邀请一位好友关注店铺即可获得1个积分，受邀的好友必须是之前未关注过店铺的用户。</p>
				<p>4.每个会员最多领取1次奖励</p>
				<p>5.奖品数量有限，先到先得</p>
			</div>
			<div class="inviting-btn">
				<el-button size='small' class="queryBtn" @click="back">{{activityStatusVal != 'invalid'? '取消':'返回'}}</el-button>
				<el-button type="primary" v-if="activityStatusVal != 'invalid'" size='small' @click="createAct()">{{activityId ? '保存活动': '保存并创建活动'}}</el-button>
			</div>
		</el-form>
		</div>
	</div>
</template>

<script>
  import formatActivityDesc from './util';
import dateFormat from 'src/common/dateFormat.js';
import { clone, isWhiteList } from 'src/common/public.js';
import ajax from 'src/api/index.js';
import store from 'src/store.js';
	export default{
		data() {
			return{
				ladderError: '',
				shopName: '',
				uploadFlg: false,
				hsitoryUrl: '',
				activityStatusVal: '',
				isSubmit: false,
				activityStatus: false,
				actNameError: "",
				labelPosition: 'right',
				checkAll: true,
				today: dateFormat(new Date().setHours(0,0,0,0),'YY-MM-DD HH:MM:SS'),
				today30: dateFormat(new Date(new Date().getTime() + 2592000000).setHours(23,59,59,59),'YY-MM-DD HH:MM:SS'),
				invitingData:{
					 activityName: '邀请关注店铺'+dateFormat(new Date(),'YYMMDDHHMMSS'),
				     startTime: dateFormat(new Date().setHours(0,0,0,0),'YY-MM-DD HH:MM:SS'),
					 endTime: dateFormat(new Date(new Date().getTime() + 2592000000).setHours(23,59,59,59),'YY-MM-DD HH:MM:SS'),
					 rewrdType: '1',//邀请奖励类型
					 fixed: {//固定奖励
						 points: 1,
						 limit: 1
					 },
					 invitationLogo: '',
					 ladder: [{},{},{}],
					 activityDesc: '',
					 invitationTitle: '',
					 invitationDesc: '我在京东上发现了一家不错的店铺，赶快来看看吧。',
					 level: ''
				},
				createLoading: false,
				pickerStartTime: {
					disabledDate: (time) => {
						if(isWhiteList()){
							return false;
						}
						return (time.getTime() > new Date(this.invitingData.endTime).getTime()) || (time.getTime() < Date.now() - 8.64e7);
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
			}
		},
	    beforeRouteEnter(to, from, next){
			next(vm => {
				vm.hsitoryUrl = from.path;
			})
		},
		watch: {
			'invitingData.startTime'(val){
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
			'invitingData.endTime'(val){
				if(val){
					this.pickerStartTime = {
						disabledDate: (time) => {
							if(isWhiteList()){
								return false;
							}
							return (time.getTime() > new Date(this.invitingData.endTime).getTime()) || (time.getTime() < Date.now() - 8.64e7);
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
				this.invitingData.endTime = store.state.user.endTime;
				this.today30 = store.state.user.endTime;
			};
			this.activityId = this.$route.query.id;
			this.createLoading = true;
			this.getMemberSet(checkMember => {
			   this.getEditMsg(this.activityId,checkMember);
			});
			if(!this.activityId) {
              this.getBasicMsg();
			}
		},
		components: {

		},
		methods: {
      formatActivityDesc(value) {
        return formatActivityDesc(value);
      },
			getEditMsg(id,checkMember) {
			   let vm = this;
               	ajax({
					api_name: 'getInvitationPeopleRuleById',
					data: {
						id: id || ''
					},
				}, result => {
					let _data = result.data;
					vm.shopName =  result.data.shopName;
					vm.createLoading = false;
					if(id) {
						let _level = [];
						_data.level.split(',').forEach(item => {
							_level.push(checkMember[item - 1])
						});
						vm.activityStatus = true;
						vm.activityStatusVal = _data.status;
						vm.checkedMembers = _level;
						vm.checkAll = _level.length >= 5;
						_data.lottoSetting = JSON.parse(_data.lottoSetting);
						let _lottoSetting = _data.lottoSetting;
						if(_lottoSetting.rewardType == 'fixed') {
							_data.fixed = {
								points: _lottoSetting.ruleDesc[0].pointValue,
								limit: _data.winTimeLimit
							};
							_data.rewrdType = '1';
							_data.ladder = [{},{},{}];
						}else {
							_data.fixed = {
								points: 1,
								limit: 1
							};
							_data.rewrdType = '2';
							_data.ladder = [];
							_lottoSetting.ruleDesc.forEach(item => {
								_data.ladder.push({
									num: item.peopleCount,
									points: item.pointValue,
									type: "points"
								})
							})
						};
						let delArr = ['lottoSetting','shopName','status'];
						delArr.forEach(item => {
							delete _data[item];
						});
						_data.invitationDesc = _data.invitationDesc || '';
						vm.$set(vm,'invitingData', _data);
					}
				}, error => {
					vm.createLoading = false;
				});
			},
			getBasicMsg() {
				let vm = this;
               	ajax({
					api_name: 'getBasicShop',
				}, result => {
					vm.invitingData.invitationTitle = result.data.title;
					vm.invitingData.invitationLogo = result.data.fullLogoUri;
				}, error => {

				});
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
			uploadSuccess(file) {
				if(file.result == '100') {
                    this.invitingData.invitationLogo = file.data.picUrl;
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
			setRules() {
               let list = '',
				   rewardList = [],
				   index = 2,
				   vm = this,
				   reward = '';
			   if(vm.invitingData.rewrdType == 1) {
				   reward += [
					  '<p>3.每成功邀请一位好友关注店铺即可获得'+vm.invitingData.fixed.points+'个积分，受邀的好友必须是之前未关注过店铺的用户。</p>',
					  '<p>4.每个会员最多领取'+vm.invitingData.fixed.limit+'次奖励</p>'
				   ].join('');
				   index = 4;
			   }else {
				   vm.invitingData.ladder.forEach(item => {
					   if(item.num && item.points) {
						    index ++;
							reward += [
								'<p>'+index+'.成功邀请第'+item.num+'位好友关注店铺即可获得'+item.points+'积分</p>'
							].join('')
					   }
				   })
			   }
			   list += [
                    '<p>1.活动时间：'+dateFormat(this.invitingData.startTime,'YY-MM-DD HH:MM:SS')+' 至 '+dateFormat(this.invitingData.endTime,'YY-MM-DD HH:MM:SS')+'</p>',
					'<p>2.参与会员：'+(this.checkedMembers.length >5 ?'全体会员' : this.checkedMembers.join('，'))+'</p>',
					reward,
					'<p>'+(index + 1)+'.奖品数量有限，先到先得</p>',
			   ].join('');
			   this.invitingData.activityDesc = list;
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
			addLadder() {
				this.invitingData.ladder.push({})
			},
			deleteLadder(index) {
				this.invitingData.ladder.splice(index,1)
			},
			back() {
				let _url = this.hsitoryUrl == '/' ? '/interactionCenter' :  this.hsitoryUrl;
				this.$router.push({path: _url})
			},
			blurInp(item,child,index) {
				this.ladderError = '';
				let obj = null;
				switch (item) {
					case 'fixed':
						obj = this.invitingData[item];
						break;
					case 'ladder':
					    obj = this.invitingData[item][index];
					    break;
					default:
						break;
				}
				if(!obj[child]) {
					this.$set(obj,child,'1');
					return;
				}else if(isNaN(Number(obj[child])) || /\./.test(obj[child]) || /\+/.test(obj[child]) || Number(obj[child] <= 0)) {
					this.$message.error('只能输入正整数！');
					this.$set(obj,child,'1');
					return;
				}
				return;
			},
			createAct() {
				let vm = this,
					invitingParma = clone(vm.invitingData);
				vm.ladderError = '';
				let _num = 0;
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
				};
				invitingParma.activityDesc = _activityDesc;
				if(invitingParma.rewrdType == 2) {
					invitingParma.ladder.forEach(item => {
						if(!item.num || !item.points) {
						   vm.ladderError = '请补全邀请奖励设置！';
						   return false;
						}else if(parseInt(item.num) <= parseInt(_num)) {
                           vm.ladderError = '请依照从小到大的顺序设置各档奖励所需的成功邀请好友数量！';
						   return false;
						}else {
							_num = item.num;
						}
					})
				};
				//会员等级
				let level = [];
				vm.checkedMembers.forEach(item => {
                    level.push(vm.memberMap[item])
				});
				level.length == 6 ? level.unshift('-2') : '';
				invitingParma.level = level.join(',');
				if(document.getElementsByClassName('error-tip').length || vm.ladderError) {
					vm.$message.error('信息填写有误，请检查后重新提交！');
				    return false;
				};
				//奖励
				if(invitingParma.rewrdType == 1) {
                    invitingParma.lottoSetting = {
							ruleDesc: [
								{
									pointValue: invitingParma.fixed.points,
									type: "points"
								}
							],
							rewardType:"fixed"
					};
					invitingParma.winTimeLimit = invitingParma.fixed.limit;
				}else {
				   let _ruleDesc = [];
                   invitingParma.ladder.forEach(item => {
                        _ruleDesc.push({
							pointValue: item.points,
							peopleCount: item.num,
							type: "points"
						})
				   });
				   invitingParma.lottoSetting = {
						   ruleDesc: _ruleDesc,
						   rewardType: "continues"
					}
				};
				let _field = ['rewrdType','fixed','ladder'];
				_field.forEach(item => {
                    delete invitingParma[item];
				});
				invitingParma.startTime = invitingParma.startTime ? (dateFormat(invitingParma.startTime,'YY-MM-DD HH:MM:SS')) : '';
        invitingParma.endTime = invitingParma.endTime ? (dateFormat(invitingParma.endTime,'YY-MM-DD HH:MM:SS')) : '';
        if(new Date(invitingParma.startTime) > new Date(invitingParma.endTime)) {
            vm.$message.error('开始时间不能大于结束时间！');
            return false;
        }
				vm.createLoading = true;
				ajax({
					api_name: 'addInvitationPeopleRule',
					data: invitingParma
				}, result => {
					vm.createLoading = false;
					this.$message.success(vm.activityId ? '活动修改并保存成功！': '活动创建成功！');
					setTimeout(() => {
						this.$router.push({path: '/interactionList'});
					}, 1000);
				}, error => {
					vm.createLoading = false;
					vm.$message.error(error.message || (vm.activityId ?'活动修改并保存失败！':'活动创建失败！'));
				});
			}
		}
	}
</script>
<style lang="less">
.inviting-box {
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
		&.w250 {
			width: 250px;
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
  .inviting-box {
	  padding: 20px 0 50px 20px;
	  box-sizing: border-box;
	  .gray {
		  color: #666;
		  font-size: 12px;
	  }
	  .renew {
		  color: #3089DE;
		  font-size: 14px;
		  margin-left: 5px;
	  }
	  .ft-14 {
		  font-size: 14px;
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
	  .inviting-set-conten {
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
	  	.rules {
			margin-left: 200px;
			border: 1px solid #ccc;
			width: 700px;
			padding: 10px;
			min-height: 128px;
		}
		.inviting-btn {
			margin: 20px 0 0 200px;
		}
		.error-tip {
		   line-height: 14px;
		   font-size: 12px;
		   margin-top: 5px;
	    }
  }
.img_content {
   position: relative;
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
			img {
				width: 100px;
				height: 100px;
				display: inline-block;
				vertical-align: top;
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
