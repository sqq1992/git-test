<template>
  <div>
    <el-form label-position="right" label-width="200px" :model="configData">
      <el-form-item label="活动名称：">
				<el-input
          class="w200 activityName"
          @keyup.native="checkActName(configData.activityName)"
          v-model.trim="configData.activityName"
          auto-complete="off"
          :maxlength="20"
          :disabled="!!status"
        ></el-input>
				<span>{{configData .activityName.length}}/20</span>
				<p class="error-tip red" v-if="actNameError!=''">{{actNameError}}</p>
			</el-form-item>
      <el-form-item label="活动起止时间：">
        <!-- :disabled="activityStatus" -->
				<el-date-picker
					v-model="configData.startTime"
					:clearable = false
					type="datetime"
					placeholder="选择日期"
					class="ui-filter-pd w200 startTime"
					:picker-options="pickerStartTime"
          :disabled="!!status"
        >
				</el-date-picker> -
        <!-- :disabled="activityStatusVal == 'invalid'" -->
				<el-date-picker
					v-model="configData.endTime"
					:clearable = false
					type="datetime"
					placeholder="选择日期"
					class="ui-filter-pd w200 endTime"
					:picker-options="pickerEndTime"
          :disabled="!!status"
        >
				</el-date-picker>
				<span class="ml_5 gray ft-14">活动有效期不得超过订购有效期</span>
				<a href="http://fw.jd.com/657606.html" class="renew fc--blue" target="_blank">立即续订</a>
			</el-form-item>
      <el-form-item label="参与等级：">
        <el-checkbox v-model="checkAll" @change="handleCheckAllChange" class="level" :disabled="!!status">全选</el-checkbox>
        <el-checkbox-group v-model="checkedMembers" @change="handlecheckedMembersChange" style="display:inline-block;margin-left:10px;">
          <el-checkbox  v-for="member in members" :label="member" :key="member" :disabled="!!status">{{member}}</el-checkbox>
        </el-checkbox-group>
        <p class="error-tip red" v-if="!checkedMembers.length && members.length">请至少选中一个会员等级！</p>
      </el-form-item>
      <el-form-item label="游戏时长：">
        <el-input class="w50 mr_5 timeUpperLimit" v-model="configData.timeUpperLimit" :disabled="!!status"/>秒
      </el-form-item>
      <el-form-item label="参与次数：">
        每人每天最多参与
        <el-input class="w50 mr_5 limitLottoTime" v-model="configData.limitLottoTime" :disabled="!!status"/>
        次
        <span class="ml_5 fc-999">(不填表示不限)</span>
      </el-form-item>
      <el-form-item label="参与所需积分：">
         <el-input class="w50 mr_5 usePointPer" v-model="configData.usePointPer" :disabled="!!status"/>积分
      </el-form-item>
      <el-form-item label="参与奖励：">
        <el-table :data="configData.lottoSetting" style="width: 835px;">
          <el-table-column label="奖励名称">
              <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.rewardName" class="w150 rewardName"
                    @focus="removeErrorClass"
                    :maxlength="5"
                    :disabled="!!status"
                  />
              </template>
          </el-table-column>
          <el-table-column :label="type == '1' ? '获奖需抢红包数' : '获奖需打地鼠数' ">
              <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.rewardMinCount"
                    :disabled="scope.$index != 0 || !!status"
                    class="w50 mr_5 rewardMinCount"
                    @focus="removeErrorClass"
                  />
                  至
                  <el-input
                    v-if="scope.$index < configData.lottoSetting.length - 1"
                    v-model="scope.row.rewardMaxCount"
                    class="w50 ml_5 rewardMaxCount"
                    @focus="removeErrorClass"
                    @blur="calcMinCount(scope.row.rewardMaxCount,scope.$index)"
                    :disabled="!!status"
                  />
                  <span v-else>以上</span>
              </template>
          </el-table-column>
          <el-table-column label="奖励内容">
              <template slot-scope="scope">
                  <div style="padding-top:5px;">
                    <div>
                      <el-checkbox v-model="scope.row.usePoint" class="usePoint" @change="removeErrorClass" :disabled="!!status"/>
                      积分：<el-input :disabled="!!status || !scope.row.usePoint" class="w75 mr_5 pointVal" v-model="scope.row.pointVal" @focus="removeErrorClass" />积分
                    </div>
                    <div>
                      <el-checkbox v-model="scope.row.useCoupon" class="useCoupon" @change="removeErrorClass" :disabled="!!status"/>
                      优惠券： <el-button type="text" :disabled="!!status || !scope.row.useCoupon" @click="checkCoupon(scope.row)">{{(scope.row.coupon && scope.row.coupon.name) ? scope.row.coupon.name : '选择优惠券'}}</el-button>
                    </div>
                  </div>
              </template>
          </el-table-column>
          <el-table-column label="管理">
            <template slot-scope="scope">
              <el-button type="text" :disabled="configData.lottoSetting.length <= 2 || !!status" @click="removeLotto(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" class="ml_20 mt_10" @click="addLottoSetting" :disabled="configData.lottoSetting.length >= 5 || !!status">增加奖项</el-button>
        <span class="ml_5">{{configData.lottoSetting.length}} / 5</span>
      </el-form-item>
      <el-form-item label="活动规则:">
        <el-button size='small' @click="setRules()" class="queryBtn">自动生成</el-button>
        <span class="ml_5">应平台要求请使用自动生成的活动规则内容，可自定义添加规则内容</span>
      </el-form-item>
      <div class="rules" ref="editArea" :contenteditable="!status" v-if="configData.activityDesc" v-html="formatActivityDesc(configData.activityDesc)"></div>
      <div class="rules" ref="editArea" :contenteditable="!status" v-else>
          <p>1.活动时间：{{today}} 至 {{today30}}</p>
          <p>2.参与会员：全体用户</p>
          <p>3.每次参与需要消耗1积分</p>
          <p>4.每人每天最多能参与1次</p>
          <p>5.是否中奖以活动发布者后台统计结果为准</p>
      </div>
      <div class="btn-box">
        <el-button size='small' class="queryBtn" @click="() => {this.$emit('back')}">上一步</el-button>
        <!-- v-if="activityStatusVal != 'invalid'" -->
        <el-button type="primary"  size='small' @click="createAct()" :disabled="!!status">{{activityId ? '保存活动': '保存并创建活动'}}</el-button>
      </div>
    </el-form>
    <coupon-dialog ref="addCoupon" @showCoupon="showCouponMsg" :data="currentAcitveData"></coupon-dialog>
  </div>
</template>
<script>
import formatActivityDesc from './util';
import dateFormat from 'src/common/dateFormat.js';
import { clone, isWhiteList } from 'src/common/public.js';
import $ from 'jquery';
import ajax from 'src/api/index.js';
import store from 'src/store.js';
import couponDialog from './coupons.vue';
export default {
  props:{
    type:{
      type:[Number,String],
      default:1
    },
    activityId:[String,Number]
  },
  components:{
    couponDialog
  },
  data() {
    let normalName = this.type == 1 ? '抢红包' : '打地鼠';
    return {
      isOk:true,
      isSubmit:false,
      today: dateFormat(new Date().setHours(0,0,0,0),'YY-MM-DD HH:MM:SS'),
      today30: dateFormat(new Date(new Date().getTime() + 2592000000).setHours(23,59,59,59),'YY-MM-DD HH:MM:SS'),
      actNameError:'',
      activityType: this.type == 1 ? 'dynamic_openRedEnvelope' : 'dynamic_whackDiglett',
      status:'',//活动状态
      checkAll:true,//是否全选
      checkedMembers:[],//已选中等级
      members:[],//等级列表
      memberMap: {
        '注册会员': '0',
        '一星会员': '1',
        '二星会员': '2',
        '三星会员': '3',
        '四星会员': '4',
        '五星会员': '5'
      },
      currentAcitveData:{},//当前选中的优惠券信息
      configData:{
        activityName:normalName + dateFormat(new Date(),'YYMMDDHHMMSS'),
        startTime: dateFormat(new Date().setHours(0,0,0,0),'YY-MM-DD HH:MM:SS'),
        endTime: dateFormat(new Date(new Date().getTime() + 2592000000).setHours(23,59,59,59),'YY-MM-DD HH:MM:SS'),
        timeUpperLimit:30,//游戏时长
        limitLottoTime:1,//每日参与次数
        usePointPer:1,//活动消耗积分
        activityDesc:'',//活动规则
        lottoSetting:[//活动奖励
          {
            index:0,
            rewardDesc: [],//最终设置的奖励信息列表
            usePoint:false,//是否使用积分奖励
            useCoupon:false,//是否设置优惠券奖励
            pointVal:'',//积分值
            coupon:{},//优惠券信息
            rewardMinCount: '',
            rewardMaxCount: '',
            rewardName: "鼓励奖"
          },
          {
            index:1,
            rewardDesc: [],//最终设置的奖励信息列表
            usePoint:false,//是否使用积分奖励
            useCoupon:false,//是否设置优惠券奖励
            pointVal:'',//积分值
            coupon:{},//优惠券信息
            rewardMinCount: '',
            rewardMaxCount: '',
            rewardName: "一等奖"
          },
        ]
      },
      pickerStartTime: {
        disabledDate: (time) => {
          if(isWhiteList()){
            return false;
          }
          return (time.getTime() > new Date(this.configData.endTime).getTime()) || (time.getTime() < Date.now() - 8.64e7);
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
  watch: {
    'signData.startTime'(val){
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
    'signData.endTime'(val){
      if(val){
        this.pickerStartTime = {
          disabledDate: (time) => {
            if(isWhiteList()){
              return false;
            }
            return (time.getTime() > new Date(this.signData.endTime).getTime()) || (time.getTime() < Date.now() - 8.64e7);
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
  created() {
    this.getMemberSet(checkMember => {
      if(this.activityId) {
        this.getActivityData()
      }
    });
  },
  methods:{
    formatActivityDesc(value) {
        return formatActivityDesc(value);
    },
    getActivityData() {
      let {activityId} = this;
      ajax({
        api_name:'getLittleGameRuleById',
        data:{
          id:this.activityId
        }
      },({data}) => {
        let {memberMap} = this;
        let configData = {
          activityName:data.activityName,
          startTime:data.startTime,
          endTime:data.endTime,
          timeUpperLimit:data.timeUpperLimit / 60,//游戏时长
          limitLottoTime:data.limit,//每日参与次数
          usePointPer:data.usePointPer,//活动消耗积分
          activityDesc:data.activityDesc
        }
        this.activityType = data.activityType;
        this.status = data.status;
        let levelList = data.level.split(','),
            checkedMembers = [];
        for(let key in this.memberMap) {
          if(levelList.indexOf(memberMap[key])) {
            checkedMembers.push(key);
          }

        }
        this.checkedMembers = checkedMembers;
        let lottoSetting = JSON.parse(data.lottoSetting);
        lottoSetting.forEach(lotto => {
          lotto.rewardDesc.forEach(reward => {
            if(reward.rewardType == 'dynamic_point') {
              lotto.usePoint = true;
              lotto.pointVal = reward.rewardValue
            }
            if(reward.rewardType == 'dynamic_coupon') {
              lotto.useCoupon = true;
              lotto.coupon = reward;
            }
          })
        })
        configData.lottoSetting = lottoSetting;
        this.configData = configData;

      })
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
    getMemberSet(cab) {//获取会员等级
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
    handleCheckAllChange() {//全选
      if(this.checkAll) {
        this.checkedMembers = this.members;
        this.checkAll = true;
      }else {
        this.checkedMembers = [];
        this.checkAll = false;
      }
    },
    handlecheckedMembersChange(value) {//单选
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.members.length;
    },
    removeLotto(index) {//删除一档奖励
      let {lottoSetting} = this.configData;
      lottoSetting.splice(index,1);
    },
    addLottoSetting() {//新增一档奖励
      let {lottoSetting} = this.configData;
      if(lottoSetting.length >= 5) return;
      lottoSetting.push({
        index:lottoSetting.length,
        rewardDesc: [],//最终设置的奖励信息列表
        usePoint:false,//是否使用积分奖励
        useCoupon:false,//是否设置优惠券奖励
        pointVal:'',//积分值
        coupon:{},//优惠券信息
        rewardMinCount: '',
        rewardMaxCount: '',
        rewardName: ''
      })
    },
    checkCoupon(lottoData) {//点击选择优惠券按钮
      let coupon = lottoData.coupon,
          custom = '';
      if(coupon.couponSource == 2) {//如果是手动添加
        custom = {
          bindType: coupon.bindType,// 优惠券绑定类型,1:全店铺,2:部分商品使用,3:部分商品不可使用
          name: coupon.name,//优惠券名称
          discountType: coupon.couponCheckType,//面值类型 2 折扣券   1 满减券
          quota: coupon.quota,//优惠券门槛
          discount: coupon.price,//优惠券面值
          link: coupon.link//优惠券链接
        }
      }
      //传入奖励下标 优惠券id 自定义优惠券
      this.$refs.addCoupon.addCoupons(lottoData.index,coupon.rewardValue,custom);
    },
    showCouponMsg(data, index) {//选中优惠券回调
      let coupon = {
        link:data.link,//优惠券链接
        couponCheckType: data.discountType,//面值类型 2 折扣券   1 满减券
        bindType: data.bindType,// 优惠券绑定类型,1:全店铺,2:部分商品使用,3:部分商品不可使用
        quota: data.quota,//优惠券门槛
        couponSource: data.couponSource,// 优惠券来源 1:选择现有优惠券2:手动添加
        price: data.discount,//优惠券面值
        name: data.name,//优惠券名称
        rewardValue:data.couponId,//优惠券id
        rewardType: "dynamic_coupon"
      }
      this.configData.lottoSetting[index].coupon = coupon;
    },
    calcMinCount(max,index) {//计算下一档的最小条件
      let nextFileData = this.configData.lottoSetting[index + 1];
      nextFileData.rewardMinCount = +max + 1;
    },
    setRules() {//设置规则
      let list = '';
        list += [
          '<p>1.活动时间：'+dateFormat(this.configData.startTime,'YY-MM-DD HH:MM:SS')+' 至 '+dateFormat(this.configData.endTime,'YY-MM-DD HH:MM:SS')+'</p>',
					'<p>2.参与会员：'+ (this.checkedMembers.length == this.members.length ? '全体用户' : this.checkedMembers.join(',')) +'</p>',
          '<p>3.每次参与需要消耗'+ this.configData.usePointPer +'积分</p>',
          '<p>4.每人每天最多能参与'+ this.configData.limitLottoTime +'次</p>',
					'<p>5.是否中奖以活动发布者后台统计结果为准</p>',
			   ].join('');
			   this.configData.activityDesc = list;
    },
    createAct() {//创建活动
      if(this.isSubmit) return;
      this.isSubmit = true;
      this.validation().then(() => {
        return this.createData()
      }).then(data => {
        return ajax({
          api_name: 'addLittleGameRule',
          data
        }, result => {
          this.$message.success('创建成功！');
          // this.isSubmit = false;
          this.$router.push({name:'interactionList'})
        }, error => {
          this.$message.error(error.message)
        });
      }).catch(error => {
        this.isSubmit = false;
        this.$message.error(error)
      })
    },
    createData() {
      const {configData,checkedMembers,memberMap} = this;
      return new Promise((resolve) => {
        let levelList = [];
        checkedMembers.forEach(item => {
          levelList.push(memberMap[item])
        })
        const data = {
          activityName:configData.activityName,//活动名称
          startTime:configData.startTime ? dateFormat(configData.startTime,'YY-MM-DD HH:MM:SS') : '',//开始时间
          endTime:configData.endTime ? dateFormat(configData.endTime,'YY-MM-DD HH:MM:SS') : '',//结束时间
          level:levelList.join(','),//会员等级
          limitLottoTime:configData.limitLottoTime,//每日参与次数
          activityType:this.activityType,//活动类型：dynamic_openRedEnvelope -抢红包  dynamic_whackDiglett -打地鼠
          timeUpperLimit:configData.timeUpperLimit,//游戏时长
          usePointPer:configData.usePointPer,//消耗积分
          activityDesc:this.$refs.editArea.innerText,//规则描述
          lottoSetting:[],//活动规则
        }
        configData.lottoSetting.forEach(lotto => {
          let reward = {
            index:lotto.index,
            rewardName:lotto.rewardName,//奖励名称
            rewardMinCount:lotto.rewardMinCount,//最小条件
            rewardMaxCount:lotto.rewardMaxCount,//最大条件
            rewardDesc:[]
          }
          if(lotto.usePoint) {//设置积分奖励规则
            reward.rewardDesc.push({
              rewardValue:lotto.pointVal,//积分值
              name:'积分',
              rewardType:"dynamic_point"
            })
          }
          if(lotto.useCoupon) {
            reward.rewardDesc.push(lotto.coupon)
          }
          data.lottoSetting.push(reward);
        })
        resolve(data);
      })

    },
    validation() {//检测活动配置
      const {configData} = this;
      return new Promise((resolve) => {
        if(!configData.activityName) {
          this.scrollToLocation('activityName');
          throw('请设置活动名称！')
        } else if(new Date(configData.startTime) > new Date(configData.endTime)) {
          this.scrollToLocation('startTime');
          throw('活动结束时间不得大于活动开始时间')
        } else if(!this.checkedMembers.length){
          this.scrollToLocation('level');
          throw('至少选择一个参与等级！')
        } else if(!configData.timeUpperLimit) {
          this.scrollToLocation('timeUpperLimit');
          throw('请设置游戏时长！')
        } else if(!configData.usePointPer) {
          this.scrollToLocation('usePointPer');
          throw('请设置活动消耗积分！')
        }
        //拦截关键词
        let _activityDesc = this.$refs.editArea.innerText,
          sensitive = ['解释','解释权','商家所有','归商家所有'],
          isHasSensitive = false;
          sensitive.forEach(obj => {
            if(_activityDesc.indexOf(obj) != -1) {
              isHasSensitive = true;
            }
          });
        if(isHasSensitive)  {
          throw('活动规则不合法，请使用系统自动生成规则！');
        }
        configData.lottoSetting.forEach((lotto,index) => {
          if(!lotto.rewardName) {
            this.addErrorClass('rewardName',index);
            throw('请设置奖励名称！');
            this.rewardName
          } else if((index < configData.lottoSetting.length - 1) && !lotto.rewardMaxCount) {
            this.addErrorClass('rewardMaxCount',index);
            throw('请设置最大得奖条件！')
          } else if(!lotto.usePoint && !lotto.useCoupon) {
            this.addErrorClass('usePoint',index);
            throw('请设置奖励内容！')
          } else if(lotto.usePoint && !lotto.pointVal) {
            this.addErrorClass('pointVal',index);
            throw('请设置积分奖励！')
          } else if(lotto.useCoupon && !lotto.coupon.name) {
            throw('请选择优惠券!')
          }
          configData.lottoSetting.forEach((_lotto,_index) => {
            if(_index != index && _lotto.rewardName == lotto.rewardName) {
              this.addErrorClass('usePoint',index);
              throw('奖励名称不能重复！')
            }
          })
          if(index > 0) {
            let prev = configData.lottoSetting[index - 1];
            if(!lotto.rewardMinCount) {
              this.addErrorClass('rewardMinCount',index);
                throw('请设置最小得奖条件！')
            } else if(lotto.rewardMinCount != +prev.rewardMaxCount + 1) {
              this.addErrorClass('rewardMinCount',index);
              throw('当前奖励的最小得奖条件必须等于上一档奖励的最大得奖条件+1！');
            } else if((index < configData.lottoSetting.length - 1) && lotto.rewardMinCount > lotto.rewardMaxCount) {
              this.addErrorClass('rewardMinCount',index);
              throw('当前奖励的最小得奖条件不得大于最大得奖条件');
            }
          }
        })
        resolve()
      })
    },
    scrollToLocation(className,index){//错误滚动
      let dom = $('.' + className).eq(index || 0);
      // dom.addClass('red');
      let mainContainer = $('#container');
      mainContainer.animate({
          scrollTop: dom.offset().top - dom.offset().top + dom.scrollTop() - 200
      }, 1000);
    },
    addErrorClass(className,index) {
      let dom = $('.' + className).eq(index || 0);
      dom.addClass('error')
    },
    removeErrorClass(e) {
			$(e.target).closest('.el-input,.el-checkbox').removeClass('error');
		},
  }
}
</script>
<style lang="less" scoped>
  .el-input.error {
    input {
      border-color:red !important;
    }
  }
  .el-checkbox.error {
    .el-checkbox__inner {
      border-color:red !important;
    }
  }
  .rules {
		margin-left: 200px;
		border: 1px solid #ccc;
		width: 700px;
		padding: 10px;
		min-height: 128px;
	}
	.btn-box {
		margin: 20px 0 0 200px;
  }

</style>
