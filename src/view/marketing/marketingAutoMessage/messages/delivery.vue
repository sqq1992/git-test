<template>
<!-- 发货提醒 -->
  <div v-loading="loading">
    <div class="btn--box">
      <el-button-group>
        <el-button :type="type == 1 ? 'primary' : 'normal'" @click="type = 1" size="small">发货提醒</el-button>
        <el-button :type="type == 2 ? 'primary' : 'normal'" @click="type = 2" size="small">发送记录</el-button>
      </el-button-group>
    </div>
    <div v-show="type == 1">
      <div class="tips">
        <p> 温馨提示：发货提醒为订单发货时系统自动通知买家购买的商品已发货，提醒关注快递信息，改善服务提升用户好感。</p>
        <p>开启发货提醒前请先设置发货提醒触发条件及短信内容，自定义短信内容提交后需3~5分钟审核时间。</p>
      </div>
      <el-form>
        <!-- :off-text="isAuditIng ? '审核中' : '已关闭'" -->
        <el-form-item label="是否开启：">
          <el-switch
            v-model="paymentData.openOrClose"
            size="small"
            width="74"
            on-text="已开启"
            off-text="已关闭"
            on-color="#13ce66"
            off-color="#ccc"
          ></el-switch>
        </el-form-item>
        <el-form-item label="发送时段：">
          <el-select v-model="paymentData.startTime" class="row_line">
            <el-option
              v-for="item in sendTimeData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          -
          <el-select v-model="paymentData.endTime" class="row_line">
            <el-option
              v-for="item in sendTimeData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <span class="small-tip">未发送自动顺延至次日8：30</span>
        </el-form-item>
        <el-form-item label="实付金额：">
          <el-input v-model="paymentData.startPrice" placeholder="数字金额" size="small" style="width:120px"/>
          -
          <el-input v-model="paymentData.endPrice" placeholder="数字金额" size="small" style="width:120px"/>
          <span class="small-tip">不填不限制</span>
        </el-form-item>
        <el-form-item label="指定商品：">
          <el-select v-model="paymentData.includeItemType" class="row_line">
            <el-option label="包含" :value="1"></el-option>
            <el-option label="不含" :value="0"></el-option>
          </el-select>
          <el-button type="normal" size="small" @click="dialogVisible = true">+新增商品</el-button>
          <span v-if="goodList.length">
            已选中<label class="fc--blue">{{goodList.length}}</label>款商品
          </span>
          <span v-else class="small-tip">默认为全部商品 </span>
        </el-form-item>
        <el-form-item label="过滤设置：">
          <el-checkbox v-model="paymentData.checkBlacklistFilter">过滤发送黑名单</el-checkbox>
          <el-checkbox v-model="filterSms">不发送最近</el-checkbox>
          <el-input size="mini" v-model="paymentData.checkMemberFilter" style="width:50px;" :disabled="!filterSms"/>
          <span>天发送过短信的会员（含今天）</span>
        </el-form-item>
        <Sms ref="sms" @send="saveActivity" @testSend="testSend" customBtn="true" :tags="['买家姓名']" :logistics="true" :tempType="msgType">
          <template slot="custom">
            <div class="custom-box">
              <p class="test-tip">注: 因测试手机号无法获取除#店铺名称#外的变量标签,故以标签名发送,实际发送时会转成具体标签内容</p>
              <div class="custom-btn">
                <el-button type="primary" @click="saveSetting" :disabled="isAuditIng">{{isAuditIng ? '审核中，无法重复提交' : '保存设置'}}</el-button>
                <span v-if="modified">上次修改时间：{{modified}}</span>
              </div>
            </div>
          </template>
        </Sms>
      </el-form>
    </div>
    <SendRecord v-if="type == 2" :msgType="msgType"/>
    <goods-choose :config="{hideHint:true}"  :selectIdList="warIdList" :checkGoodsList="goodList" type="checkbox" @close="closeDialog" @check="checkDialog" v-if="dialogVisible"></goods-choose>
  </div>
</template>
<script>
import http from 'src/api'
import SendRecord from '../sendRecord'
import Sms from 'components/sms'
import dateFormat from '@/common/dateFormat.js'
import goodsChoose from 'src/components/goods-choose/goods-choose'
import commonData from './commonData'
import {point} from 'src/common/point.js'
export default {
  components: {
    SendRecord,
    Sms,
    goodsChoose
  },
  created() {
    point('37977.40528.40666');
    this.querySetting();
  },
  data() {
    const {payTimeData,sendTimeData} = commonData(4);
    return {
      type:1,
      loading:false,
      msgType:1,//发货提醒
      dialogVisible:false,
      modified:'',//上次修改时间
      payTimeData,
      sendTimeData,
      filterSms:false,
      sign:'',
      restMsgCount:this.$store.state.user.restMsgCount,
      goodList:[],//当前已选中商品信息列表
      warIdList:[],//当前选中商品的warId列表
      lastState:'',//上一次的开启/关闭状态
      isAuditIng:false,//是否在审核中
      paymentData:{
        openOrClose:false,//是否开启
        startTime:'8:00:00',//发送时间段-开始
        endTime:'22:00:00',//发送时间段-结束
        startPrice:'',//实付金额-最大
        endPrice:'',//实付金额-最小
        includeItemType:1,//指定商品类型 1包含 0不包含
        includeWareItems:'',//指定商品列表
        checkBlacklistFilter:true,//是否过滤黑名单
        checkMemberFilter:'',//过滤天数 空为不过滤
        message:'',//短信内容
      }
    }
  },
  methods: {
    sendAjax(params,cb) {
      this.loading = true;
      http(params,res => {
        this.loading = false;
        cb && cb(res);
      }, error => {
        this.loading = false;
        this.$message.error(error)
      })
    },
    querySetting() {//查询当前配置
      this.sendAjax({
        api_name:'getMarketingSettingInitData',
        data: {
          msgType:this.msgType
        }
      },res => {
        let {paymentData} = this;
        const {message,modified,includeWareItems,isAuditIng,checkMemberFilter,openOrClose} = res.data;
        let newData = {};
        for(let key in paymentData) {
          newData[key] = res.data[key];
        }
        newData.checkBlacklistFilter = newData.checkBlacklistFilter == 1 ? true : false;
        this.lastState = openOrClose;
        this.isAuditIng = isAuditIng;
        this.modified = modified;
        this.paymentData = newData;
        if(checkMemberFilter) {
          this.filterSms = true;
        }
        if(message) {
          this.$refs.sms.initMessage(message);
        }
        if(includeWareItems) {
          this.getCheckGoodList(includeWareItems);
        }
      })
    },
    getCheckGoodList(includeWareItems) {//获取指定商品信息列表
      this.sendAjax({
        api_name:'activityQueryWare',
        data:{
          wareIdStr:includeWareItems,
          pageSize:100
        }
      }, res => {
        let {wareList} = res.data;
        let wareIdList = [];
        wareList.forEach(item => {
          let hasSame = wareIdList.some(i => {
            return i.wareId == item.wareId
          })
          if(!hasSame) {
            wareIdList.push(item);
          }
        })
        this.goodList = wareIdList;
        this.warIdList = wareIdList.map(item => {
          return item.wareId
        });
      })
    },
    saveActivity({msg,sign}) {
      this.sign = sign;
      this.paymentData.message = msg;
    },
    testSend({msg, phoneNumberStr}) {//测试发送
      this.sendAjax({
        api_name: 'marketingCreate',
        data:{
          messageContent:msg,
          phoneNumberStr,
          activityType:54,
          sendTest:true
        }
      }, res => {
        this.loading = false;
        this.$message.success('发送成功！')
      })
      this.loading = true;
    },
    validation() {
      let {paymentData} = this;
      return new Promise(resolve => {
        if(paymentData.message.length == (this.sign.length + 2)) {
          throw('请输入短信内容！')
        }
        if(!this.sign) {
          throw('短信签名不能为空！')
        }
        if(paymentData.endTime.split(':')[0] < paymentData.startTime.split(':')[0]) {
          throw ('发送结束时间不得小于发送开始时间！');
        }
        if(paymentData.endPrice < paymentData.startPrice) {
          throw ('最大实付金额不得小于最小实付金额！');
        }
        if(this.filterSms && !paymentData.checkMemberFilter > 0) {
          throw ('请输入发送过滤天数！');
        }
        if(this.paymentData.message) {
          if(!this.paymentData.openOrClose) {
            if(this.lastState) {//如果是关闭
              this.$confirm('发货提醒可以提醒客户关注快递信息，改善服务提升用户好感，是否确认关闭？', {
                type:'info'
              }).then(() => {
                resolve();
              })
            } else {
               this.$confirm('您开未开启发货提醒，是否开启？', {
                  type: 'info'
              }).then(() => {
                this.paymentData.openOrClose = true;
                resolve();
              }).catch(() => {
                resolve();
              });
            }
          } else {
            resolve();
          }
        }
      })

    },
    saveSetting() {//保存设置
      if(!this.restMsgCount > 0) {
        return this.$confirm('您当前的短信余额不足，无法开启短信通知', '温馨提示', {
          confirmButtonText: '去充值',
          cancelButtonText: '取消',
        }).then(() => {
          window.open('#/marketingSmsRecharge')
        }).catch(() => {
        });
      }
      this.$refs.sms.getSmsContent();
      this.validation().then(() => {
        let {paymentData} = this;
        paymentData.checkBlacklistFilter = paymentData.checkBlacklistFilter ? 1 : 0;
        if(!this.filterSms) {//未开启发送天数过滤
          paymentData.checkMemberFilter = '';
        }
        this.sendAjax({
          api_name:'saveMarketingSetting',
          data:{
            msgType:this.msgType,
            pay_hour:0,//写死了 后端有个必填验证
            ...paymentData
          }
        }, res => {
          this.$message({
            message: '保存成功！'
          });
          point('37977.40528.40531');
          this.querySetting();
        })
      }).catch(error => {
        this.$message.warning(error);
      })
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    checkDialog(checkList, checkGoodsIdList){//选择商品
      this.dialogVisible = false;
      this.warIdList = checkGoodsIdList;
      this.goodList = checkList;
      this.paymentData.includeWareItems = checkList.map(item => {
        return item.wareId
      }).join(',');
		},
  }
}
</script>
<style lang="less" scoped>
  .btn--box {
    margin-bottom:20px;
  }
  .tips{
		padding: 17px 20px;
		background: #FFF3EB;
    border: 1px solid #FFE1CC;
    color: #666666;
    p {
      &:first-child {
        margin-bottom:10
        px;
      }
      &:last-child {
        margin-left:70px;
      }
    }
  }
  .small-tip {
    margin-left:5px;
    font-size: 14px;
    color: #999999;
  }
  .custom-box {
    margin-left:80px;
    .test-tip {
      color:#999;
      margin-bottom:10px;
    }
  }
</style>



