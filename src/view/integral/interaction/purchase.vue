<template>
  <div class="purchase interaction-box" v-loading="loading">
    <!-- <div v-if="actData"> -->
      <el-form label-position="right"  label-width="200px" :model="actData">
        <Preview :data="actData" :skus="skus"/>
        <el-form-item label="活动名称：" class="clearfix">
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
        <el-form-item label="活动时间：" class="clearfix">
          <el-date-picker
            v-model="actData.startTime"
            :clearable="false"
            type="datetime"
            placeholder="选择日期"
            class="ui-filter-pd w200"
            :picker-options="pickerStartTime"
            :disabled="activityStatus"
          ></el-date-picker>
          -
          <el-date-picker
            v-model="actData.endTime"
            :clearable="false"
            type="datetime"
            placeholder="选择日期"
            class="ui-filter-pd w200"
            :picker-options="pickerEndTime"
            :disabled="activityStatus"
          ></el-date-picker>
          <span class="ml_5 gray ft-14">活动有效期不得超过订购有效期</span>
          <a href="http://fw.jd.com/657606.html" class="renew" target="_blank">立即续订</a>
        </el-form-item>
        <el-form-item label="投屏海报：" class="clearfix">
          <!-- 此处默认海报的话要显示活动类型和活动时间 -->
          <div :class="['posters_content',{hasCustom:this.customImg}]" :style="{backgroundImage:'url('+ actData.image +')'}">
            <span class="loading" v-if="uploadFlg"  v-loading="uploadFlg" style="line-height: 0;"></span>
            <div class="act_name" v-if="!customImg">
              {{actData.activityType == 3 ? '关注有礼' : actData.activityType == 2 ? '加购有礼' : '加购关注有礼'}}
            </div>
            <div class="act_time"  v-if="!customImg">活动时间：{{actData.startTime.slice(0,10)}} 至 {{actData.endTime.slice(0,10)}}</div>
            <!-- 恢复默认海报 -->
            <i class="el-icon-close close_btn" @click="reductionImg"></i>
						<el-upload
							class="img_box"
							action="/common/picUpload"
							:show-file-list="false"
							:on-success="uploadSuccess"
              :disabled="activityStatus"
							:before-upload="uploadBefore">
							<span v-if="!uploadFlg" ></span>
						</el-upload>
            <div class="tip">
              <p>点击上传图片</p>
              <p>建议尺寸750*250，图片不能超过1MB</p>
            </div>
						<!-- <span class="upload-tip">建议尺寸：688*710像素，上传图片大小不能超过 1.5MB！</span> -->
					</div>
        </el-form-item>
        <el-form-item label="活动参与等级：" class="clearfix">
          	<el-checkbox :disabled="activityStatus" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
					  <el-checkbox-group v-model="checkedMembers" @change="handlecheckedMembersChange" style="display:inline-block;margin-left:10px;">
						  <el-checkbox :disabled="activityStatus" v-for="member in members" :label="member" :key="member">{{member}}</el-checkbox>
					  </el-checkbox-group>
					<p class="error-tip red" v-if="!checkedMembers.length && members.length">请至少选中一个会员等级！</p>
        </el-form-item>
        <el-form-item label="选择商品：" class="clearfix">
           <el-button class="m_l10" type="text" :disabled="activityStatus" @click="dialogVisible = true;">选择指定商品</el-button>
           <span class="ml_5">{{skus.length}}/10</span>
           <el-table :data="skus" style="width:670px;" class="clearfix">
             <el-table-column label="商品主图" width="200">
               <template scope="scope">
                 <img :src="scope.row.logo" style="margin:10px 0;"/>
               </template>
             </el-table-column>
             <el-table-column label="商品名称" width="300" prop="title"></el-table-column>
             <el-table-column label="操作">
               <template scope="scope">
                 <span :class="['ml_5', activityStatus ? 'fc--333' : 'fc--blue']" @click="deleteGood(scope.$index)">删除</span>
                 <span :class="['ml_5', activityStatus ? 'fc--333' : 'fc--blue']" v-if="scope.$index > 0" @click="moveUp(scope.$index)">上移</span>
                 <span :class="['ml_5', activityStatus ? 'fc--333' : 'fc--blue']" v-if="scope.$index < (skus.length -1)" @click="moveDown(scope.$index)">下移</span>
               </template>
             </el-table-column>
           </el-table>
        </el-form-item>
        <el-form-item label="选择奖励：" class="clearfix">
          <div class="reward_content">
            <div>
              <el-checkbox v-model="actData.pointsMsg.isCheck" :disabled="activityStatus"/> 积分：
              <el-input style="width:100px;" class="mr_5" v-model="actData.pointsMsg.val" :disabled="!actData.pointsMsg.isCheck || activityStatus"/>积分
              <!-- <span class="ml_10">如添加积分奖励，该活动仅会员可以参加      开卡 0 元入会</span>
              <span :class="['ml_10',{'fc--red' : !isOpenCard}, {'fc--green':isOpenCard}]">{{isOpenCard ? '已开启' : '未开启'}}</span> -->
            </div>
            <div>
              <!-- {{obj.giftName || '暂无'}} -->
              <el-checkbox v-model="actData.couponMsg.isCheck" :disabled="activityStatus"/>
              <span>优惠券：</span>
              <a href="javascript:;" @click="checkCoupon(actData.couponMsg)" v-if="!activityStatus">{{actData.couponMsg.giftMsg ? '重新选择':'选择优惠券'}}</a>
              <p class="gary" v-if="actData.couponMsg.giftMsg">{{actData.couponMsg.giftMsg}}</p>
              <!-- <el-button class="ml_5" type="text" :disabled="!useCoupon" @click="checkCoupon()">选择优惠券</el-button> -->
            </div>
          </div>
        </el-form-item>
        <el-form-item label="最大参与人数：" class="clearfix">
          <el-input style="width:100px;" v-model="actData.articipationLimit" :disabled="activityStatus"/>
          <span class="ml_5">不填表示不限制</span>
        </el-form-item>
        <el-form-item label="领取奖励条件：" class="clearfix">
          <el-select class="mr_5" v-model="actData.activityType" :disabled="activityStatus">
            <el-option value="1" label="加购关注"></el-option>
            <el-option value="2" label="仅加购"></el-option>
            <el-option value="3" label="仅关注"></el-option>
          </el-select>
          <el-radio v-model="actData.mode" label="one" :disabled="activityStatus">任一商品</el-radio>
          <el-radio v-model="actData.mode" label="more" :disabled="activityStatus">&nbsp;</el-radio>
          <el-input v-model="actData.matchNum" style="width:100px;" class="mr_5" :disabled="activityStatus"/>件商品
        </el-form-item>
        <el-form-item label="活动规则：" class="clearfix">
          <el-button size="small" @click="setRules()" class="queryBtn">自动生成</el-button>
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
          <p>1.活动时间：{{today}} 至 {{today30}}</p>
          <p>2.参与会员：全体会员</p>
          <p>3.加购任一商品即可领取奖励</p>
          <p>4.最多100人参与，先到先得</p>
        </div>
        <!-- {{activityStatusVal != 'invalid'? '取消':'返回'}} -->
        <div class="purchase-btn">
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
      <goods-choose
        :selectBySkuId="true"
        :selectIdList="wares"
        :checkGoodsList="skus"
        @close="closeDialog"
        @check="checkDialog"
        v-if="dialogVisible">
      </goods-choose>
      <coupon-dialog ref="addCoupon" @showCoupon="showCouponMsg" :data="currentCouponData">
      </coupon-dialog>
    <!-- </div> -->
  </div>
</template>

<script>
import formatActivityDesc from "./util";
import dateFormat from "src/common/dateFormat.js";
import { clone, isWhiteList } from "src/common/public.js";
import couponDialog from "./coupons.vue";
import ajax from "src/api/index.js";
import store from "src/store.js";
import goodsChoose from 'src/components/goods-choose/goods-choose';
import Preview from './purchasePreview';
export default {
  components: {
    couponDialog,
    goodsChoose,
    Preview
  },
  data() {
    let originImage = 'http://img11.360buyimg.com/imgzone/jfs/t1/48640/21/15219/104530/5dc229beE4d500fc3/ee5cce7b62d9c772.png';
    return {
      activityId: "",//活动Id
      checkAll: true,
      isOpenCard:this.$store.state.user.collarCardMode == 1,//是否开启0元入会
      historyUrl: "",
      activityStatus: false,//活动状态
      actNameError: "",
      dialogVisible:false,//选择商品弹窗
      uploadFlg:false,//上传图片标识
      customImg:false,//自定义图片
      today: dateFormat(new Date().setHours(0, 0, 0, 0), "YY-MM-DD HH:MM:SS"),
      today30: dateFormat(
        new Date(new Date().getTime() + 2592000000).setHours(23, 59, 59, 59),
        "YY-MM-DD HH:MM:SS"
      ),
      currentCouponData: {},//优惠券信息
      checkCouponName: "",
      members: [],//等级列表
      checkedMembers: [],//选中等级
      memberMap: {//默认等级
        "注册会员": "0",
        "一星会员": "1",
        "二星会员": "2",
        "三星会员": "3",
        "四星会员": "4",
        "五星会员": "5"
      },
      originImage,
      skus:[],//选择商品信息
      wares:[],//选择商品wareId列表 用于弹窗显示已选择商品
      actData: {//活动数据
        activityName: "加购关注有礼" + dateFormat(new Date(), "YYMMDDHHMMSS"), //活动名称
        activityType:'1',//1: 加购+关注;2: 仅加购;3: 仅关注
        mode:'one',//任一商品/多个商品
        matchNum:'',//匹配商品个数
        articipationLimit:'',//最大参与人数
        startTime: dateFormat(
          new Date().setHours(0, 0, 0, 0),
          "YY-MM-DD HH:MM:SS"
        ), //开始时间
        endTime: dateFormat(
          new Date(new Date().getTime() + 2592000000).setHours(23, 59, 59, 59),
          "YY-MM-DD HH:MM:SS"
        ), //结束时间
        activityDesc: "", //规则
        couponMsg: {},
        pointsMsg: {},
        goodsMsg: {},
        image:originImage,//投屏图片
      },
      loading: false,
      pickerStartTime: {//
        disabledDate: time => {
          if (isWhiteList()) {
            return false;
          }
          return (
            time.getTime() > new Date(this.actData.endTime).getTime() || time.getTime() < Date.now() - 8.64e7
          );
        }
      },
      pickerEndTime: {
        disabledDate: time => {
          if (isWhiteList()) {
            return false;
          }
          return (
            time.getTime() < new Date(new Date().setHours(0, 0, 0, 0)).getTime() || time.getTime() > new Date(store.state.user.endTime).getTime()
          );
        }
      }
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.historyUrl = from.path;
    });
  },
  watch: {
    "actData.startTime"(val) {//开始时间
      val = dateFormat(
          new Date(val).setHours(0, 0, 0, 0),
          "YY-MM-DD HH:MM:SS"
      )
      if (val) {
        this.pickerEndTime = {
          disabledDate(time) {
            if (isWhiteList()) {
              return false;
            }
            return (
              time.getTime() < new Date(val).setHours(0, 0, 0, 0) || time.getTime() > new Date(store.state.user.endTime).getTime()
            );
          }
        };
      } else {
        this.pickerEndTime = {
          disabledDate(time) {
            return false;
          }
        };
      }
     this.actData.startTime = val;
    },
    "actData.endTime"(val) {//结束时间
      val = dateFormat(
          new Date(val).setHours(23, 59, 59, 59),
          "YY-MM-DD HH:MM:SS"
      )
      if (val) {
        this.pickerStartTime = {
          disabledDate: time => {
            if (isWhiteList()) {
              return false;
            }
            return (
              time.getTime() > new Date(this.actData.endTime).getTime() || time.getTime() < Date.now() - 8.64e7
            );
          }
        };
      } else {
        this.pickerStartTime = {
          disabledDate(time) {
            return false;
          }
        };
      }
      this.actData.endTime = val;
    },
  },
  created() {
    //判断默认时间与软件到期时间
    if (new Date(store.state.user.endTime).getTime() < new Date().getTime() + 2592000000) {
      this.actData.endTime = store.state.user.endTime;
      this.today30 = store.state.user.endTime;
    }
    this.activityId = this.$route.query.id;
    this.getMemberSet(checkMember => {
       this.getActData(this.activityId, checkMember)
    });
  },
  methods: {
    getActData(id, checkMember) {
      if(!id) return;
      let vm = this;
      ajax({
        api_name:'getWareFollow',
        data:{
          id
        }
      }, result => {
        let _data = result.data.activity;
        // _data.skus = _data.skus || [];
          this.activityStatus = true;
          _data.couponMsg = {};
          _data.pointsMsg = {};
          _data.image = _data.image || 'http://img11.360buyimg.com/imgzone/jfs/t1/48640/21/15219/104530/5dc229beE4d500fc3/ee5cce7b62d9c772.png';
          _data.mode = _data.matchNum == 1 ? 'one' : 'more';
          let _level = [];
          _data.level.split(',').forEach(item => {
            _level.push(checkMember[item - 1])
          });
          this.checkedMembers = _level;
          this.checkAll = _level.length >= 5;
          console.log(_level);
          this.skus = JSON.parse(_data.wares);
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
              // case 'dynamic_wareDiscount':
              //   _data.goodsMsg = {
              //     isCheck: true
              //   };
              //   vm.setDiscountData = {
              //     activityName: item.shopName,
              //     discount: item.discount,
              //     price: item.price,
              //     skuLen: item.skuLen,
              //     wareId: item.wareId,
              //     wareLogo: item.wareLogo,
              //   };
              //     break;
              default:
                break;
							}
            });
						this.$set(this,'actData',_data);
      }, error => {

      })
    },
    formatActivityDesc(value) {
      return formatActivityDesc(value);
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
      this.$set(this.actData.couponMsg,'isCheck', true);
      let chheckId = this.actData.couponMsg.couponId || '';
      this.$refs.addCoupon.addCoupons('',chheckId,custom);
    },
    showCouponMsg(data, index) {//优惠券
      	let _discount = data.discountType == 1 ? data.discount : data.discount*10,
					type = data.bindType == 1 ? '店铺优惠券' : '商品优惠券',
					_obj = this.actData.couponMsg,
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
    getMemberSet(cab) {//获取设置的会员名称
      let vm = this,
        _arr = ['非会员'],
        _map = {"非会员": 0};
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
          cab && cab(_arr);
        },error => {
          this.$message.error(error.message || "获取会员列表失败");
        }
      );
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
    uploadSuccess(file) {
				if(file.result == '100') {
          this.customImg = true;
          this.actData.image = file.data.picUrl;
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
    checkDialog(checkList, checkGoodsIdList){//选择商品回调
      console.log(checkList);
      console.log(checkGoodsIdList);
      this.dialogVisible = false;
      let {skus,wares} = this;
      skus = checkList;
      wares = checkGoodsIdList;
      this.skus = skus;
      this.wares = wares;
    },
    reductionImg() {
      this.customImg = false;
      this.actData.image = this.originImage;
    },
    closeDialog(){//关闭选择商品弹窗
			this.dialogVisible = false;
    },
    deleteGood(index) {//删除选中商品
      if(this.activityStatus) return;
      let {skus,wares} = this;
      skus.splice(index,1);
      wares.splice(index,1);
    },
    moveUp(index) {//上移
      if(this.activityStatus) return;
      let {skus,wares} = this;
      skus[index - 1] = skus.splice(index, 1, skus[index - 1])[0];
    },
    moveDown(index) {//下移
      if(this.activityStatus) return;
      let {skus,wares} = this;
      skus[index] = skus.splice(index+1, 1, skus[index])[0];
    },
    setRules() {//设置活动规则
      let list = '',
				   rewardList = [],
				   index = 2,
				   vm = this,
           reward = '';
			   if(vm.actData.pointsMsg.isCheck && vm.actData.pointsMsg.val) {
				   rewardList.push(vm.actData.pointsMsg.val + '个积分');
			   };
			   if(vm.actData.couponMsg.isCheck && vm.actData.couponMsg.price) {
				   let _item = vm.actData.couponMsg,
					   _type = _item.bindType == 1 ? '店铺优惠券' : '商品优惠券',
					   _unit = _item.couponCheckType == 1 ? '元' : '折';
				   rewardList.push(_item.price+_unit+_type);
			   };
			   if(rewardList.length) {
           index ++;
           let _index = 1;
				   reward = '<p>'+ index + '活动奖励：'+ rewardList.map(item => {
             return `(${_index++}) ${item}`
           }).join(',') + '</p>';
         };
			   list += [
          '<p>1.活动时间：'+dateFormat(this.actData.startTime,'YY-MM-DD HH:MM:SS')+' 至 '+dateFormat(this.actData.endTime,'YY-MM-DD HH:MM:SS')+'</p>',
          '<p>2.参与会员：'+(this.checkedMembers.length >5 ? '全体用户' : this.checkedMembers.join('，'))+'</p>',
          reward,
          `<p>${index + 1}.${this.actData.activityType == '1' ? '加购并关注' : this.actData.activityType == '2' ? '加购' : '关注'}${this.actData.mode == 'one' ? '任一' : this.actData.matchNum + '件'}商品即可领取奖励</p>`,
			   ].join('');
				this.actData.activityDesc = list;
    },
    createAct() {//创建活动
        if(!this.skus.length) {
          this.$message.error('请选择指定商品！');
          return false;
        }
    	  let vm = this,
        shopParma = clone(vm.actData),
        _pointsMsg = shopParma.pointsMsg,
        _couponMsg = shopParma.couponMsg,
        _goods = shopParma.goodsMsg;
        shopParma.id = this.activityId;
        //保存折扣
        shopParma.startTime = shopParma.startTime ? (dateFormat(shopParma.startTime,'YY-MM-DD HH:MM:SS')) : '';
        shopParma.endTime = shopParma.endTime ? (dateFormat(shopParma.endTime,'YY-MM-DD HH:MM:SS')) : '';
        if(new Date(shopParma.startTime) > new Date(shopParma.endTime)) {
          vm.$message.error('开始时间不能大于结束时间！');
          return false;
        }
        if(!_pointsMsg.isCheck && !_couponMsg.isCheck) {
          vm.$message.error('请至少选择一项奖励！');
          return false;
        }
        if(_pointsMsg.isCheck && !_pointsMsg.val) {
          vm.$message.error('请填写奖励积分！');
          return false;
        }
        shopParma.lottoSetting = [];
        if(_pointsMsg.isCheck) {
          shopParma.lottoSetting.push({
            "type":"dynamic_point",
            "name":"积分",
            "rewardTypeValue":_pointsMsg.val,
          });
        };
        if(_couponMsg.isCheck && !_couponMsg.link) {
          vm.$message.error('请选择优惠券！');
          return false;
        }
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
        shopParma.wares = vm.skus;
        if(shopParma.mode == 'more') {
          if(!shopParma.matchNum) {
            vm.$message.error('请填写领取奖励条件！');
            return false;
          } else if(shopParma.matchNum > this.skus.length) {
            vm.$message.error('奖励商品件数不能超过指定商品数！');
            return false;
          }

        }
        shopParma.matchNum = shopParma.mode == 'one' ? 1 : shopParma.matchNum;
        let delArr = ['goodsMsg', 'couponMsg', 'pointsMsg', 'mode']
        delArr.forEach(item => {
          delete shopParma[item];
        });
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
        //会员等级
        let level = [];
        vm.checkedMembers.forEach(item => {
          level.push(vm.memberMap[item])
        });
        level.length == 7 ? level.unshift('-2') : '';
        shopParma.level = level.join(',');
      // let data = {
      //   activityName:activityName,//活动名称,
      //   startTime:startTime,//开始时间
      //   endTime:endTime,//结束时间
      //   image:image,//头屏海报
      //   level:this.checkedMembers,//参与等级
      //   wares:wares.join(','),//商品
      //   // lottoSetting:lottoSetting,//奖励
      //   activityType:activityType,//活动类型:1: 加购+关注;2: 仅加购;3: 仅关注
      //   matchNum:mode == 'one' ? 1 : matchNum,//匹配次数
      //   // activityDesc:activityDesc,//活动说明
      // }
      this.saveAct(shopParma);
    },
    saveAct(data) {
      this.loading = true;
      ajax({
          api_name: 'saveWareFollow',
          data
      }, result => {
        this.loading = false;
        this.$message.success('保存成功！')
        setTimeout(() => {
          this.$router.push({path: '/interactionList'});
        }, 1000);
        // if(hasDiscount) {
        //   this.$refs.discountTip.show();
        // }else {
        //   this.$message.success(vm.activityId ? '活动修改并保存成功！': '活动创建成功！');
        //   setTimeout(() => {
        //     this.$router.push({path: '/interactionList'});
        //   }, 1000);
        // }
      }, error => {
        this.loading = false;
        this.$message.error(error.message || (this.activityId ?'活动修改并保存失败！':'活动创建失败！'));
      });
    },
    back() {//返回 | 取消
      let _url = this.historyUrl == "/" ? "/interactionCenter" : this.historyUrl;
      this.$router.push({ path: _url });
    }
  }
};
</script>
<style lang="less">
.purchase {
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
<style lang="less" scoped>
.fc--blue {
  cursor: pointer;
}
.purchase {
  padding: 20px 0 50px 20px;
  box-sizing: border-box;
  .gray {
    color: #666;
  }
  .renew {
    color: #3089de;
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
  // .sign-set-conten {
  //   padding: 10px;
  //   min-width: 600px;
  //   display: inline-block;
  //   background: #f6f6f6;
  //   border: 1px solid #ddd;
  //   .sign-set {
  //     padding: 10px 0 10px 110px;
  //     border-bottom: 1px solid #ddd;
  //     position: relative;
  //     .lab {
  //       position: absolute;
  //       top: 10px;
  //       left: 10px;
  //     }
  //     .sign-set-item {
  //       padding: 10px;
  //       border: 1px solid #ddd;
  //       position: relative;
  //     }
  //   }
  //   .del {
  //     width: 33px;
  //     height: 33px;
  //     display: block;
  //     background: #d8d8d8;
  //     position: absolute;
  //     top: -1px;
  //     right: 0;
  //     &::before {
  //       width: 14px;
  //       height: 16px;
  //       content: "";
  //       display: block;
  //       background: url(../../../assets/images/del.svg) no-repeat center;
  //       position: absolute;
  //       top: 50%;
  //       left: 50%;
  //       margin: -8px 0 0 -7px;
  //       background-size: 100%;
  //     }
  //   }
  // }
  .rules {
    margin-left: 200px;
    border: 1px solid #ccc;
    width: 700px;
    padding: 10px;
    min-height: 128px;
  }
  .purchase-btn {
    margin: 20px 0 0 200px;
  }
  .error-tip {
    line-height: 14px;
    font-size: 12px;
  }
  .posters_content {
   position: relative;
   width:348px;
   height:116px;
   background-size:100% 100%;
   overflow: hidden;
   &:hover {
     .tip {
      bottom:0px;
     }
   }
   &.hasCustom {
     &:hover {
       .close_btn {
         display: block;
       }
     }
   }
   &.hasBg {
     background: rgba(0,0,0,0.4);
   }
   .act_name {
     position: absolute;
     font-weight: bold;
     width:100%;
     height:40px;
     text-align: center;
     top:15px;
     font-size:35px;
     font-family: 微软雅黑;
     color:#fff;
   }
   .close_btn {
    display: none;
    position:absolute;
    z-index:9999;
    //  font-size:18px;
    font-size:12px;
    top:4px;
    right:4px;
    cursor: pointer;
   }
   .act_time {
      position: absolute;
      bottom: 9px;
      left: 60px;
      width: 226px;
      font-size: 12px;
      transform: rotate(-1.7deg);
      text-align: center;
      color:#E40F10;
   }
   .loading {
    position: absolute;
    top:0;
    left:0;
    right:0;
    bottom:0
   }
   .img_box {
	   span {
       position: absolute;
       top:0;
       left:0;
       right:0;
       bottom:0
	   }
   }
   .tip {
    width: 100%;
    height: 45px;
    transition: all linear .3s;
    text-align: center;
    background: rgba(0, 0, 0, 0.4);
    color: #fff;
    line-height: 20px;
    padding-top: 5px;
    position:absolute;
    bottom:-50px;
   }
  }
  .reward_content {
    padding: 10px;
    min-width: 600px;
    display: inline-block;
    background: #f6f6f6;
    border: 1px solid #ddd;
    &>div {
      padding: 10px 0 10px 10px;
      border-bottom: 1px solid #ddd;
      position: relative;
    }
  }
}
</style>
