<template>
    <div class="recharge_content">
      <div class="agreementContent" v-if="!agreeDate">
          温馨提示：请您阅读<a href="javascript:;" @click="showAgreement">《旺店会员短信服务订购协议》</a>，建议订购套餐享受更多优惠。
      </div>
      <div class="agreementContent" v-else>
          温馨提示：您已于{{agreeDate}}同意<el-button href="javascript:;" type="text" @click="showAgreement">《旺店会员短信服务订购协议》</el-button>。
      </div>
      <div class="yh_banner" v-if="yhData.hasYh">
        <span class="yh_title">专属特权</span>
        属于您的短信包：<span class="red">{{yhData.yhcount}}</span>条短信
        优惠价<span class="red">{{yhData.yhdiscost}}</span>元 约 <span class="red">{{yhData.yhdisprice}}</span>分/条
        <el-button type="primary" size="small" style="margin-left:50px;" @click="yhRecharge">立即充值</el-button>
      </div>
      <recharge-card @showAgreement="showAgreement" :agreeDate="agreeDate" :isFristPay="isFristPay" :rechargeCardData="rechargeCardData"></recharge-card>
      <recharge-table class="rechargeTable" @showAgreement="showAgreement" :agreeDate="agreeDate" :tableData="tableData" :loading="loading"></recharge-table>
      <div class="custom_recharge">
          自定义
          <el-input class="custom_input" v-model="customCount" @blur="custom_input_blur"></el-input>
          条短信
          <span class="grayColor m_l10 m_r10">(必须为100的倍数)</span>
          <span class="m_r10 orange" style="text-decoration:line-through;" v-if="customPrice">市场价￥{{customPrice}}元</span>
          <span class="m_r10 orange" v-if="customPreferentialPrice">优惠价￥{{customPreferentialPrice}}元</span>
          <span class="m_r10 orange" v-if="customUnit">约{{customUnit}}分/条</span>
          <el-button type="primary" size='small' @click="getSmsPackagePrice">立即充值</el-button>
          <el-popover
            ref="showRule"
            placement="top"
            trigger="hover"
          >
            <el-table
                :data="ruleData"
                :stripe="true"
                :border="true"
              >
               <el-table-column
                  prop="name"
                  label="条数"
                  width="150"
                  >
                </el-table-column>
                <el-table-column
                  prop="price"
                  label="价格"
                  width="130"
                  >
                </el-table-column>
            </el-table>
          </el-popover>
          <i class="el-icon-information ruleBtn"  v-popover:showRule></i>
      </div>
      <el-dialog
      title="短息服务订购协议"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="dialogVisible">
          <subscription-agreement :agreeDate="agreeDate" @setAgeement="setAgeement" @closeDialog="closeDialog"></subscription-agreement>
      </el-dialog>
    </div>
</template>
<script>
    import {point} from 'src/common/point.js';
    import rechargeTable from './rechargeTable.vue';
    import rechargeCard from './rechargeCard.vue';
    import subscriptionAgreement from './subscriptionAgreement.vue';
    import http from './../../../api/index.js';
    import md5 from 'js-md5';
    import { getCookie } from '@/common/utils';
    import { mapState } from "vuex";
    let customPriceList = [
        {
            number:2000,
            price:5.0
        },
        {
            number:9900,
            price:4.9
        },
        {
            number:19900,
            price:4.7
        },
        {
            number:49900,
            price:4.6
        },
        {
            number:99000,
            price:4.4
        },
        {
            number:299900,
            price:4.2
        },
        {
            number:499900,
            price:3.8
        },
        {
            number:500000,
            price:3.6
        }
    ]
export default {
    name:'recharge',
    components:{
        rechargeTable,
        subscriptionAgreement,
        rechargeCard
    },
    data() {
        return{
            customCount:'',//自定义短信数量
            customPrice:'',//自定义短信原价
            customPreferentialPrice:'',//自定义短信优惠价
            customUnit:'',//自定义短信单价
            customPriceList,//自定义短信计算规则
            // agreeDate:'2018-12-12 11:11:11',
            agreeDate:'',
            dialogVisible:false,
            loading:true,
            tableData:[],
            rechargeCardData:[],
            yhData:{},
            isFristPay:false,
            ruleData:[
              {name:"0-2000",price:'5分/条'},
              {name:"2000-9900",price:'4.9分/条'},
              {name:"10000—19900",price:'4.7分/条'},
              {name:"20000—49900",price:'4.6分/条'},
              {name:"50000—99900",price:'4.4分/条'},
              {name:"100000—299900",price:'4.2分/条'},
              {name:"300000—499900",price:'3.8分/条'},
              {name:"≥500000",price:'3.6分/条'},
            ]
        }
    },
    created() {
        this.getAgreement();
        this.getRechageList();
        this.getYhMsg();
    },
    watch:{
        customCount(count) {
            if(count && Number(count)) {
                this.customPrice = (count * 0.06).toFixed(2);
                for(let i = 0 , len = customPriceList.length; i < len ; i++) {
                    let item = customPriceList[i];
                    if(count <= item.number) {
                        this.customPreferentialPrice = (count * item.price / 100).toFixed(2);
                        this.customUnit = item.price;
                        return;
                    } else if (i == len - 1 && count >= item.number) {
                        this.customPreferentialPrice = (count * item.price / 100).toFixed(2);
                        this.customUnit = item.price;
                    }
                }
            } else {
                this.customPrice = '';
                this.customPreferentialPrice = '';
                this.customUnit = '';
            }

        }
    },
    computed: {
        ...mapState({
            user: state => state.user
        }),
    },
    methods:{
      getYhMsg() {
        http({
          api_name:'getYhMsg',
          data:{
            taobaoId:this.user.venderId,
            taobaoNick:this.user.pin || this.user.shopName,
            appName:'JDWD',
            token_JDWD:getCookie('token_JD_WD')
          }
        },res => {
          this.yhData = res.data;
        })
      },
      getRechageList() {
        this.loading = true;
        http({
          api_name:'getRechargeList',
          data:{
            taobaoId:this.user.venderId,
            appName:'JDWD',
            taobaoNick:this.user.shopName,
            token_JDWD:getCookie('token_JD_WD')
          },
        },res => {
          let {list, isFristPay, creditLevel, activityList} = res.data;
          this.isFristPay = isFristPay;
          this.rechargeCardData = list.splice(-2,2);
          this.tableData = list;
          if(isFristPay) {
            this.rechargeCardData = activityList;
          }
          this.loading = false;
        },error => {
          this.loading = false;
        })
      },
        //获取协议同意状态
        getAgreement() {
            http({
                api_name:'getAgreement',
            },res => {
                let {data} = res;
                if(data.isAgree == 1) {
                    this.agreeDate = data.agreeDate;
                }
            })
        },
        //设置协议同意状态
        setAgeement() {
            http({
                api_name:'setAgreement',
                data:{status:1}
            },res => {
                this.getAgreement();
                this.closeDialog();
            })
        },
        //计算出100的倍数
        custom_input_blur() {
            if(this.customCount >= 100) {
                let overflow = this.customCount % 100;
                this.customCount  -= overflow;
            } else {
                this.customCount = '';
            }
        },
        showAgreement() {
            this.dialogVisible = true;
        },
        closeDialog() {
            this.dialogVisible = false;
        },
        customRecharge() {
            http({
                api_name:'getRechargeList',
                data:{
                    taobaoId:2978430740,
                    appName:'JDWD',
                    taobaoNick:'jann简定制',
                    wangwang:'小二'
                }
            },res => {

            },res => {

            })
        },
        yhRecharge() {
          point('37977.39402.39431');
          if(!this.agreeDate) {
            this.showAgreement();
            return;
          }
          let {yhcount,yhdisprice,yhdiscost,yhprice} = this.yhData;
          let paySign = "raycloudrecharge" + this.user.venderId + "raycloud" + 'JDWD' + yhcount + "recharge";
          let href = "//crmad.superboss.cc/recharge/goToAlipay3?smsType=111&appName="+ 'JDWD' +"&indexId=-1&paySign=" + md5(paySign) + "&rechargeCount=" + yhcount + "&taobaoId=" + this.user.venderId + "&taobaoNick=" + (this.user.pin || this.user.shopName) + "&unitPrice=" + yhdisprice + "&discountPrice=" + yhdiscost;
          window.open(href);
          this.$confirm(`若已充值成功，请点击“充值成功”按钮`,
              {
                  title:'短信充值确认结果',
                  confirmButtonText:'充值成功'
              }
          ).then(() => {
              window.location.reload();
          }).catch(() => {})
        },
        getSmsPackagePrice() {
            if(!this.agreeDate) {
                this.showAgreement();
                return;
            }
            point('37977.39402.39434');
            http({
                api_name:'getSmsPackagePrice',
                data:{
                    appName: 'JDWD',
                    buyCount: this.customCount,
                    taobaoId: this.user.venderId,
                    taobaoNick: this.user.shopName,
                    token_JDWD:getCookie('token_JD_WD')
                }
            },res => {
                let paySign = "raycloudrecharge" + this.user.venderId + "raycloud" + 'JDWD' + this.customCount + "recharge",
                    data = res.data;
                let href = "//crmad.superboss.cc/recharge/goToAlipay3?appName="+ 'JDWD' +"&indexId=-1&paySign=" + md5(paySign) + "&rechargeCount=" + this.customCount + "&taobaoId=" + this.user.venderId + "&taobaoNick=" + this.user.shopName + "&unitPrice=" + data.unitPrice + "&discountPrice=" + data.discountPrice;
                window.open(href);
                point('37977.37978.37987')
                this.$confirm(`若已充值成功，请点击“充值成功”按钮`,
                    {
                        title:'短信充值确认结果',
                        confirmButtonText:'充值成功'
                    }
                ).then(() => {
                    window.location.reload();
                }).catch(() => {})
            },error => {

            })
        }
    }
}
</script>
<style lang="less" scoped>
    .yh_banner {
      margin-top:10px;
      height:50px;
      line-height: 50px;
      font-size:14px;
      background:#f0f0f0;
      position:relative;
      .yh_title {
        display:inline-block;
        box-sizing: border-box;
        padding:10px;
        line-height: 15px;
        color:#fff;
        width:50px;
        height:50px;
        background:linear-gradient(to right,rgb(253,174,54),rgb(251,134,49));
        float:left;
        margin-right:20px;
      }
    }
    .custom_recharge{
        .custom_input{
            width:150px;
            input{
                height:28px;
                padding:3px 10px;
            }
        }
        margin-bottom:15px;
    }
    .rechargeTable{
        margin-bottom:15px;
    }
    .ruleBtn {
      margin-left:10px;
      font-size:16px;
      &:hover {
        color:#20a0ff
      }
    }
</style>


