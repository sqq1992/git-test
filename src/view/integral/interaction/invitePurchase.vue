<template>
  <div class="invite_purchase" v-loading="loading">
    <div class="tips">邀请非会员参与活动时，非会员需要开卡入会后，才能参与活动，请前往<a href="#/member" style="margin:0px">等级规则</a>开启开卡即会员功能，保证活动正常展开</div>
    <el-form label-position="right"  label-width="200px" :model="actData" style="margin-top:20px;">
       <el-form-item label="活动名称：">
          <el-input
            class="w200"
            @keyup.native="checkActName(actData.activityName)"
            v-model.trim="actData.activityName"
            :disabled="activityStatus"
            auto-complete="off"
          />
          <span>{{actData.activityName.length}}/20</span>
          <p class="error-tip red" v-if="actNameError!=''">{{actNameError}}</p>
        </el-form-item>
        <el-form-item label="加购关注商品页：">
          <el-radio class="radio"  :disabled="activityStatus" v-model="actType" label="1">邀请参与已有加购／关注商品活动</el-radio>
          <el-radio class="radio"  :disabled="activityStatus" v-model="actType" label="2">创建独立邀请活动</el-radio>
          <p v-if="actType == '1'" class="ml_15">
            <el-button type="text" @click="activitySel"  :disabled="activityStatus">{{actInfo.id ? '重新选择' : '选择活动'}}</el-button>
            <span v-if="actInfo.activityName">{{actInfo.activityName}}</span>
          </p>
        </el-form-item>
        <el-form-item label="活动参与等级：" class="clearfix">
          <el-checkbox :disabled="activityStatus" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <el-checkbox-group v-model="checkedMembers" @change="handlecheckedMembersChange" style="display:inline-block;margin-left:10px;">
            <el-checkbox :disabled="activityStatus" v-for="member in members" :label="member" :key="member">{{member}}</el-checkbox>
          </el-checkbox-group>
					<p class="error-tip red" v-if="!checkedMembers.length && members.length">请至少选中一个会员等级！</p>
        </el-form-item>
        <el-form-item label="邀请奖励：">
          <div>
            <el-radio class="radio" v-model="actData.rewardType" label="1"  :disabled="activityStatus">固定奖励</el-radio>
            <el-radio class="radio" v-model="actData.rewardType" label="2"  :disabled="activityStatus">阶梯奖励</el-radio>
          </div>
          <div class="inviting-set-conten" v-if="actData.rewardType == '1'">
            <div class="inviting-set">
              <p>
                <span>每成功邀请1位好友，可获得奖励</span>
                <span class="fc--gray ml10" style="float:right;">被邀请的好友，满足邀请活动领取奖励条件，即计为一个成功邀请</span>
              </p>
             <p>
                <el-checkbox v-model="fixed.usePointFixed"  :disabled="activityStatus">积分</el-checkbox>
                <el-input  class="w50" v-model="fixed.points" @blur="blurInp('fixed','points')" :disabled="!fixed.usePointFixed || activityStatus"></el-input>
                <span class="ml_5">积分</span>
                <span class="ml_20">
                  每个会员最多可获取
                  <el-input class="w50 ml_5 mr_5" v-model="fixed.limit" :disabled="activityStatus"></el-input>
                  次成功邀请奖励
                </span>
             </p>
            </div>
            <div class="inviting-set">
              <p>
                累计成功邀请
                <el-input class="w50" v-model="fixed.extraRewardTime" :disabled="activityStatus"></el-input>
                位好友，额外获得奖励
              </p>
              <p>
                <el-checkbox v-model="fixed.usePoint" :disabled="activityStatus">积分：</el-checkbox>
                <el-input class="w50 ml_5 mr_5" v-model="fixed.extraPoint" @blur="blurInp('fixed','extraPoint')" :disabled="!fixed.usePoint || activityStatus"></el-input>积分
                <el-checkbox class="ml_20" v-model="fixed.useCoupon" :disabled="activityStatus">优惠券：</el-checkbox>
                <el-button type="text" @click="checkCoupon()" :disabled="!fixed.useCoupon">{{fixed.couponMsg.giftMsg ? '重新选择':'选择优惠券'}}</el-button>
                <p class="gary" v-if="fixed.couponMsg.giftMsg">{{fixed.couponMsg.giftMsg}}</p>
              </p>
              <p  class="error-tip red" v-if="fixedError">{{fixedError}}</p>
            </div>
			    </div>
				  <div class="inviting-set-conten" v-if="actData.rewardType == '2'">
            <div class="inviting-set" v-for="(item,index) in ladder">
              <p>
                <span>{{index+1}}.成功邀请第</span>
                <el-input class="w50 ml_5 mr_5" @blur="blurInp('ladder','num',index)" v-model="ladder[index].num" :disabled="activityStatus"></el-input>
                <span>位好友，获得奖励</span>
                <el-button v-if="index >= 2" class="m_l20" type="text" @click="deleteLadder(index)" :disabled="activityStatus">删除</el-button>
              </p>
              <p>
                <el-checkbox v-model="ladder[index].usePoint" :disabled="activityStatus">积分：</el-checkbox>
                <el-input class="w50 ml_5 mr_5" :disabled="!ladder[index].usePoint || activityStatus" @blur="blurInp('ladder','points',index)" v-model="ladder[index].points"></el-input>积分
                <el-checkbox v-model="ladder[index].useCoupon" :disabled="activityStatus">优惠券：</el-checkbox>
                <el-button type="text" @click="checkCoupon(index)" :disabled="!ladder[index].useCoupon || activityStatus">{{ladder[index].couponMsg.giftMsg ? '重新选择':'选择优惠券'}}</el-button>
                <p class="gary" v-if="ladder[index].couponMsg.giftMsg"  :disabled="!ladder[index].useCoupon">{{ladder[index].couponMsg.giftMsg}}</p>
              </p>
				  	</div>
            <p class="error-tip red" v-if="ladderError">{{ladderError}}</p>
            <el-button v-if="ladder.length <5 && !activityStatus" size='small' class="queryBtn mt_10" @click="addLadder()">新增一档</el-button>
				  </div>
        </el-form-item>
        <el-form-item label="邀请链接设置:">
				<div class="inviting-set-conten">
					<div class="inviting-set inviting-link-set">
						<span class='lab'>邀请链接标题：</span>
						<textarea :disabled="activityStatus" v-model="actData.invitationTitle"></textarea>
						<span class="lab-word">{{actData.invitationTitle.length}}/24</span>
						<p v-if="!actData.invitationTitle" ref="errorTip" class="error-tip red">请设置邀请链接标题！</p>
						<p v-if="actData.invitationTitle.length > 24" ref="errorTip" class="error-tip red">邀请链接标题最多可设置24个字符！</p>
					</div>
					<div class="inviting-set inviting-link-set">
						<span class='lab'>邀请链接介绍：</span>
						<textarea :disabled="activityStatus" v-model="actData.invitationDesc"></textarea>
						<span class="lab-word">{{actData.invitationDesc.length}}/24</span>
						<p v-if="actData.invitationDesc.length > 24" ref="errorTip" class="error-tip red">邀请链接介绍最多可设置24个字符！</p>
					</div>
					<div class="inviting-set inviting-link-set">
						<span class='lab'>邀请链接封面：</span>
						<div class="img_content">
							<span class="loading" v-if="uploadFlg"  v-loading="uploadFlg" style="line-height: 0;"></span>
							<img :src="actData.invitationLogo">
							<el-upload
								class="img_box"
								action="/common/picUpload"
								:show-file-list="false"
								:on-success="uploadSuccess"
								:before-upload="uploadBefore">
								<span v-if="!uploadFlg && !activityStatus">上传图片</span>
							</el-upload>
							<span class="upload-tip">建议图片尺寸：100*100像素</span>
						</div>
					</div>
				</div>
				<div class="preview-box">
            <div class="preview-one" v-if="actData.invitationDesc">
            <p class="preview-title">{{actData.invitationTitle}}</p>
            <div class="preview-content">
              <p>{{actData.invitationDesc}}</p>
              <img :src="actData.invitationLogo" alt="">
            </div>
				   </div>
				   <div class="preview-two">
					   <div class="preview-content">
					       <img :src="actData.invitationLogo" alt="">
						   <p class="preview-title">{{actData.invitationTitle}}</p>
					   </div>
				   </div>
				</div>
      </el-form-item>
      <el-form-item label="活动规则：" class="clearfix">
        <el-button size="small" @click="setRules()" class="queryBtn" :disabled="activityStatus">自动生成</el-button>
        <span class="ml_5">应平台要求请使用自动生成的活动规则内容，可自定义添加规则内容</span>
      </el-form-item>
      <div
        class="rules"
        ref="editArea"
        contenteditable="true"
        v-if="actData.activityDesc"
        v-html="formatActivityDesc(actData.activityDesc)"
      ></div>
      <div class="rules" ref="editArea" contenteditable="true" v-else>
          <p>1.参与会员：全体会员</p>
          <p>2.每成功邀请1位好友，获得1积分</p>
          <p>3.奖品数量有限，先到先得</p>
      </div>
        <!-- {{activityStatusVal != 'invalid'? '取消':'返回'}} -->
      <div class="sign-btn">
        <el-button
          size="small"
          class="queryBtn"
          @click="back"
        >取消</el-button>
        <!-- v-if="activityStatusVal != 'invalid'" -->
        <el-button
          type="primary"
          size="small"
          @click="createAct()"
        >{{activityId ? '保存活动': '保存并创建活动'}}</el-button>
      </div>
    </el-form>
    <coupon-dialog ref="addCoupon" @showCoupon="showCouponMsg" :data="currentCouponData"></coupon-dialog>
    <activity-dialog ref="selActivity" :current="actInfo" @selAct="saveActInfo"></activity-dialog>
  </div>
</template>
<script>
import formatActivityDesc from "./util";
import dateFormat from "src/common/dateFormat.js";
import ajax from "src/api/index.js";
import couponDialog from "./coupons.vue";
import store from "src/store.js";
import activityDialog from './activityDialog';
import { clone, isWhiteList } from "src/common/public.js";
export default {
  components: {
    couponDialog,
    activityDialog
  },
  data() {
    return {
      activityId:'',
      loading: false,
      actNameError: '',
      activityStatus:false,
      actType:'1',//活动类型
      checkAll:true,
      couponIndex:'fixed',
      members: [],//等级列表
      checkedMembers: [],//选中等级
      usePoint:false,
      ladder:[{couponMsg:{}},{couponMsg:{}}],//奖励梯档
      actInfo:{},
      fixed: {//固定奖励
        points: 1,
        limit: 1,//最大成功邀请奖励次数
        extraPoint:1,
        couponMsg:{},
        extraRewardTime:1,
        usePoint:true,
        usePointFixed:true
      },
      fixedError:'',
      ladderError:'',
      memberMap: {//默认等级
        "注册会员": "0",
        "一星会员": "1",
        "二星会员": "2",
        "三星会员": "3",
        "四星会员": "4",
        "五星会员": "5"
      },
      actData: {
        activityName: "邀请加购关注" + dateFormat(new Date(), "YYMMDDHHMMSS"), //活动名称
        rewardType:'1',//奖励类型
        invitationTitle:'',//邀请链接标题
        invitationDesc: '我在京东上发现了一家不错的店铺，赶快来看看吧。',//邀请链接介绍
        invitationLogo:'',
        activityDesc:''
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.historyUrl = from.path;
    });
  },
  created() {
    this.activityId = this.$route.query.id;
    this.getMemberSet(checkMember => {
       this.getActData(this.activityId, checkMember)
    });
    if(!this.activityId) {
      this.getBasicMsg();
    }
  },
  watch:{
    actType(newVal,oldVal) {
      if(newVal == '2') {
        this.actType = '1';
        return this.$message({
          message:'暂不支持创建独立邀请活动，尽请期待。'
        })
      }
    }
  },
  methods: {
    getActData(id, checkMember) {
      if(!id) return;
      //getInvitationWareFollow
       ajax({
        api_name:'getInvitationWareFollow',
        data:{
          id
        }
      }, result => {
        let _data = result.data.activity;
        this.activityStatus = true;
        let _level = [];
        _data.level.split(',').forEach(item => {
          _level.push(checkMember[item - 1])
        });
        this.actData.activityName = _data.activityName;
        this.checkedMembers = _level;
        this.checkAll = _level.length >= 5;
        this.actData.invitationTitle = _data.invitationTitle;
        this.actData.invitationDesc = _data.invitationDesc;
        this.actData.invitationLogo = _data.invitationLogo;
        this.actData.activityDesc = _data.activityDesc;
        let lottoSetting = JSON.parse(_data.lottoSetting);
        this.actInfo = {
          id:_data.wareFollowId,
          activityName:_data.wareFollowActivityName
        }
        this.actData.rewardType = lottoSetting.rewardType == 'fixed' ? '1' : '2';
        if(lottoSetting.rewardType == 'fixed') {
          let fixed = {
            usePointFixed:true,
            points:lottoSetting.ruleDesc[0].pointValue,
            limit:_data.winTimeLimit,
            couponMsg:{}
          }
          if(lottoSetting.extraReward) {
            fixed.extraRewardTime = lottoSetting.extraRewardTime;
            lottoSetting.extraReward.forEach(item => {
              if(item.type == 'points') {
                fixed.usePoint = true;
                fixed.extraPoint = item.pointValue;
              }
              if(item.type == 'coupon') {
                fixed.useCoupon = true;
                 let type = item.bindType == 1 ? '店铺优惠券' : '商品优惠券';
                item.giftMsg = `${type}，${item.quota || '-'}元可用，优惠券面值：${item.price}${item.couponCheckType == 1 ? '元' : '折'}`
                fixed.couponMsg = item;
              }
            })
          }
          this.fixed = fixed;
        } else {
          let ladder = [];
          lottoSetting.ruleDesc.forEach(item => {
            let reward = item.reward,
                _obj = {
                  num:item.peopleCount,
                  couponMsg:{}
                };
            reward.forEach(_item => {
              if(_item.type == 'points') {
                _obj.usePoint = true;
                _obj.points = _item.pointValue;
              }
              if(_item.type == 'coupon') {
                _obj.useCoupon = true;
                let type = _item.bindType == 1 ? '店铺优惠券' : '商品优惠券';
                _item.giftMsg = `${type}，${_item.quota || '-'}元可用，优惠券面值：${_item.price}${_item.couponCheckType == 1 ? '元' : '折'}`
                _obj.couponMsg = _item;
              }
            })
            ladder.push(_obj)
          })
          this.ladder = ladder;
        }
      }, error => {

      })
    },
    activitySel() {
      this.$refs.selActivity.showDialog();
    },
    checkActName(_val) {//验证活动名称
      //活动名称验证
      if (!_val || _val == "") {
        this.actNameError = "活动名称不能为空！";
      } else if (_val.length > 20) {
        this.actNameError = "活动名称最多20个字！";
      } else {
        this.actNameError = "";
      }
    },
    getMemberSet(cab) {//获取设置的会员名称
      let vm = this,
        _arr = [],
        _map = {};
      ajax({
          api_name: "memberLevelList"
        },res => {
          if (res.data.levelList && res.data.levelList.length) {
            res.data.levelList.forEach(item => {
              _arr.push(item.name || item.nameSource);
              _map[item.name || item.nameSource] = item.memberLevel;
            });
            vm.$set(vm, "memberMap", _map);
          } else {
            _arr = ["注册会员", "一星会员", "二星会员", "三星会员", "四星会员","五星会员"];
          }
          vm.$set(vm, "members", _arr);
          vm.$set(vm, "checkedMembers", _arr);
          cab && cab(_arr)
        },error => {
          this.$message.error(error.message || "获取会员列表失败");
        }
      );
    },
    uploadSuccess(file) {
				if(file.result == '100') {
          this.customImg = true;
          this.actData.invitationLogo = file.data.picUrl;
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
    getBasicMsg() {//邀请链接基础配置
      ajax({
        api_name: 'getBasicShop',
      }, result => {
        this.actData.invitationTitle = result.data.title;
        this.actData.invitationLogo = result.data.fullLogoUri;
      }, error => {

      });
    },
    saveActInfo(data) {
      this.actInfo = data;
    },
    formatActivityDesc(value) {
      return formatActivityDesc(value);
    },
    checkCoupon(index) {
      let custom = '';
      let wrapper = index ? this.ladder[index] : this.fixed,
          obj = wrapper.couponMsg || {}
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
      let chheckId =  '';
      this.$refs.addCoupon.addCoupons('',chheckId,custom);
      this.couponIndex = index === undefined?  'fixed' : index;
    },
    showCouponMsg(data, index) {
      	let _discount = data.discountType == 1 ? data.discount : data.discount*10,
					type = data.bindType == 1 ? '店铺优惠券' : '商品优惠券',
          _giftMsg = '';
        _obj = _obj || {};
        let _obj = {};
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
        if(this.couponIndex !== 'fixed') {
          let hasSame = false
          this.ladder.forEach(item => {
            if(item.couponMsg.link === _obj.link) {
              hasSame = true;
            }
          })
          if(hasSame) {
            this.$message.error('优惠券领取链接不能相同！')
            return false;
          }
        }
        if(this.couponIndex == 'fixed') {
          this.fixed.couponMsg = _obj;
        } else {
          this.ladder[this.couponIndex].couponMsg = _obj;
        }
        this.fixedError = '';
        this.ladderError = '';
    },
    handleCheckAllChange(val) {//参与等级全选
      if (this.checkAll) {
        this.checkedMembers = this.members;
        this.checkAll = true;
      } else {
        this.checkedMembers = [];
        this.checkAll = false;
      }
    },
    handlecheckedMembersChange(value) {//参与等级单选
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.members.length;
    },
    setRules() {
      let list = '',
        index = 1,
        vm = this,
        reward = '';
      if(vm.actData.rewardType == 1) {
        let _rewardList = [];
        if(vm.fixed.usePoint && vm.fixed.extraPoint) {
          _rewardList.push(`${vm.fixed.extraPoint}积分`);
        }
        if(vm.fixed.useCoupon && vm.fixed.couponMsg.link) {
          let {couponMsg} = vm.fixed;
          let _discount = couponMsg.price,
              type = couponMsg.bindType == 1 ? '店铺优惠券' : '商品优惠券',
              unit = couponMsg.couponCheckType == 1 ? '元':'折';
              _rewardList.push(`${_discount}${unit}${type}`);
        }
        reward += [
          `<p>2.每成功邀请一位好友关注可获得${vm.fixed.points}个积分,累计成功邀请${vm.fixed.extraRewardTime}位好友,可额外获得${_rewardList.join(',')}</p>`,
          '<p>3.每个会员最多领取'+vm.fixed.limit+'次奖励</p>'
        ].join('');
        index = 3;
      }else {
        vm.ladder.forEach(item => {
          if(item.num) {
            let _rewardList = [];
            index ++;
            if(item.points) {
              _rewardList.push(`${item.points}积分`)
            }
            if(item.couponMsg.link) {
              let {couponMsg} = item;
              let _discount = couponMsg.price,
              type = couponMsg.bindType == 1 ? '店铺优惠券' : '商品优惠券',
              unit = couponMsg.couponCheckType == 1 ? '元':'折';
              _rewardList.push(`${_discount}${unit}${type}`);
            }

            reward += [
              `<p>${index}.成功邀请第${item.num}位好友关注店铺即可获得${_rewardList.join(',')}</p>`
            ].join('')
          }
        })
      }
      list += [
      '<p>1.参与会员：'+(this.checkedMembers.length >5 ?'全体会员' : this.checkedMembers.join('，'))+'</p>',
      reward,
      '<p>'+(index + 1)+'.奖品数量有限，先到先得</p>',
      ].join('');
      this.actData.activityDesc = list;
    },
    blurInp(item,child,index) {
      this.fixedError = '';
      this.ladderError = '';
      let obj = null;
      switch (item) {
        case 'fixed':
          obj = this[item];
          break;
        case 'ladder':
          obj = this[item][index];
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
    addLadder() {//新增一档
      this.ladder.push({couponMsg:{}})
    },
    deleteLadder(index) {//删除一档
      this.ladder.splice(index,1)
    },
    checkSetting() {
      let vm = this,
          invitingParma = clone(vm.actData),
          _num = 0;
      return new Promise((resolve,reject) => {
        if(!this.actInfo.id) {
          throw ('请先选择活动！')
        }
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
					throw('活动规则不合法，请使用系统自动生成规则！')
        };
        if(invitingParma.rewardType == 1) {
          let {fixed} = this;
          if(fixed.usePointFixed && !fixed.points) {
            this.fixedError = '请填写奖励积分';
          }
          if (fixed.usePoint && !fixed.extraPoint) {
            this.fixedError = '请填写额外奖励积分';
          }
          if(fixed.useCoupon && !fixed.couponMsg.link) {
            this.fixedError = '请选择优惠券';
          }
          // if(!fixed.usePoint && !fixed.useCoupon) {
          //   this.fixedError = '至少设置一种奖励';
          // }
        } else if (invitingParma.rewardType == 2) {
					vm.ladder.forEach(item => {
						if(!item.num || (item.usePoint && !item.points) || (item.useCoupon && !item.couponMsg.link)) {
						   vm.ladderError = '请补全邀请奖励设置！';
						   return false;
						} else if(!item.points && !item.couponMsg.link) {
              vm.ladderError = '请补全邀请奖励设置！';
              return false;
            } else if(parseInt(item.num) <= parseInt(_num)) {
              vm.ladderError = '请依照从小到大的顺序设置各档奖励所需的成功邀请好友数量！';
              return false;
						}else {
							_num = item.num;
						}
					})
        };
        if(document.getElementsByClassName('error-tip').length || vm.ladderError || vm.fixedError) {
					throw('信息填写有误，请检查后重新提交！');
        };
        resolve();
      })
    },
    createAct() {
        let vm = this;
        this.checkSetting().then(() => {
          let invitingParma = clone(vm.actData);
          invitingParma.id = this.activityId;
          vm.fixedError = '';
          vm.ladderError = '';
          invitingParma.activityDesc = vm.$refs.editArea.innerText;
          invitingParma.wareFollowId = this.actInfo.id;
          //会员等级
          let level = [];
          vm.checkedMembers.forEach(item => {
            level.push(vm.memberMap[item])
          });
          level.length == 6 ? level.unshift('-2') : '';
          invitingParma.level = level.join(',');
          //奖励
          if(invitingParma.rewardType == 1) {
            let couponMsg = vm.fixed;
            let _obj = {
              rewardType:"fixed"
            };
            if(vm.fixed.usePointFixed) {
              _obj.ruleDesc = []
              if(vm.fixed.points) {
                _obj.ruleDesc.push({
                  pointValue: vm.fixed.points,
                  type: "points"
                })
              }
            }
            if(vm.fixed.extraRewardTime) {
              _obj.extraReward = [];
              _obj.extraRewardTime = vm.fixed.extraRewardTime;
              if(vm.fixed.usePoint) {
                _obj.extraReward.push({
                  pointValue:vm.fixed.extraPoint,
                  type:"points"
                })
              }
              if(vm.fixed.useCoupon) {
                let {couponMsg} = vm.fixed;
                _obj.extraReward.push({
                  type: "coupon",
                  name:'优惠券',
                  giftName:couponMsg.giftName,
                  rewardTypeValue:couponMsg.rewardTypeValue,
                  couponCheckType:couponMsg.couponCheckType,
                  bindType:couponMsg.bindType,
                  quota:couponMsg.quota,
                  price:couponMsg.price,
                  link:couponMsg.link,
                  couponSource:couponMsg.couponSource
                })
              }
            }
            invitingParma.winTimeLimit = vm.fixed.limit;
            invitingParma.lottoSetting = _obj;
          } else {
            let _ruleDesc = [];
            vm.ladder.forEach(item => {
              let couponMsg = item.couponMsg;
              let _obj = {
                peopleCount: item.num,
                reward:[]
              }
              if(item.usePoint) {
                _obj.reward.push({
                  pointValue: item.points,
                  type: "points"
                })
              }
              if(item.useCoupon) {
                _obj.reward.push({
                  type: "coupon",
                  name:'优惠券',
                  giftName:couponMsg.giftName,
                  rewardTypeValue:couponMsg.rewardTypeValue,
                  couponCheckType:couponMsg.couponCheckType,
                  bindType:couponMsg.bindType,
                  quota:couponMsg.quota,
                  price:couponMsg.price,
                  link:couponMsg.link,
                  couponSource:couponMsg.couponSource
                })
              }
              _ruleDesc.push(_obj);
            });
            invitingParma.lottoSetting = {
              ruleDesc: _ruleDesc,
              rewardType: "continues"
            }
          };
          let _field = ['rewardType','fixed','ladder'];
          _field.forEach(item => {
            delete invitingParma[item];
          });
          vm.loading = true;
          ajax({
            api_name:'saveInvitationWareFollow',
            data:invitingParma
          },result => {
            vm.loading = false;
            vm.$message.success('保存成功！')
            setTimeout(() => {
							vm.$router.push({path: '/interactionList'});
						}, 1000);
          },error => {
            vm.loading = false;
            vm.$message.error(error || '未知错误！')
          })
        }).catch(error => {
          this.$message.error(error);
        })
    },
    back() {
      let _url = this.historyUrl == '/' ? '/interactionCenter' :  this.historyUrl;
      this.$router.push({path: _url})
    },
  }
}
</script>
<style lang="less">
.invite_purchase {
  .el-input {
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
    .el-input__inner {
      width: 100%;
      height: 100%;
    }
  }
  .el-form-item {
    margin-bottom: 10px;
  }
}
</style>
<style lang="less"scoped>
  .invite_purchase {
    padding: 20px 20px 50px 20px;
    .ml_5 {
      margin-left:5px;
    }
    .ml_20 {
      margin-left:20px;
    }
    .mr_5 {
      margin-right: 5px;
    }
      .inviting-set-conten {
        padding: 10px;
        min-width: 600px;
        display: inline-block;
        background: #f6f6f6;
        border: 1px solid #ddd;
        box-sizing: border-box;
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
  .rules {
    margin-left: 200px;
    border: 1px solid #ccc;
    width: 700px;
    padding: 10px;
    min-height: 128px;
  }
  .sign-btn {
    margin:20px 0 0 200px;
  }
</style>
