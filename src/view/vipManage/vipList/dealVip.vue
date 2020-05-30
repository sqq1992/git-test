<template>
  <div class="m-content inputSet" v-loading="loadingPage">
    <!-- <div class="m-content-main main_height inputSet"> -->
    <div class="clearfix m_b20">
      <div class="f-fl headLeft hidden">
        <div class="row_line inline_block">
          <span class="row-item__inline">会员账号：</span>
          <el-input @keyup.native.enter="memberList(true)" v-model.trim="userName" class="userName"></el-input>
        </div>
        <div class="row_line inline_block m_l10">
          <span class="row-item__inline">会员昵称：</span>
          <el-input @keyup.native.enter="memberList(true)" v-model.trim="userNick" class="userName"></el-input>
        </div>
        <div class="row_line inline_block m_l10">
          <span class="row_name inline_block">会员手机号：</span>
          <el-input @keyup.native.enter="memberList(true)" v-model.trim="userPhone" class="userName"></el-input>
        </div>
        <el-collapse-transition>
          <div v-show="level" class="m_t20">
            <div class="row_line inline_block">
              <span class="row-item__inline">成交金额：</span>
              <el-input @blur="blurInp('moneyOne', 'moneyTwo', true)" v-model.trim="moneyOne" class="moneyOne"></el-input>
              <span>-</span>
              <el-input @blur="blurInp('moneyTwo', 'moneyOne', false)" v-model.trim="moneyTwo" class="moneyOne"></el-input>
            </div>
            <div class="row_line inline_block m_l10">
              <span class="row-item__inline">成交次数：</span>
              <el-input @blur="blurInp('dealOne', 'dealTwo', true)" v-model.trim="dealOne" class="moneyOne"></el-input>
              <span>-</span>
              <el-input @blur="blurInp('dealTwo', 'dealOne', false)" v-model.trim="dealTwo" class="moneyOne"></el-input>
            </div>
            <div class="row_line inline_block m_l10">
              <span class="row-item__inline">会员状态：</span>
              <el-select class="userName" v-model="customerStatus" placeholder="">
                <el-option value="" label="不限"></el-option>
                <el-option value="1" label="正式会员"></el-option>
                <el-option value="2" label="预会员"></el-option>
                <el-option value="3" label="流失会员"></el-option>
              </el-select>
            </div>
            <div class="row_line inline_block m_t20">
              <span class="row-item__inline">首次成交时间：</span>
              <el-date-picker
                :editable="false"
                :picker-options="pickerLeft"
                class="dateWidth"
                v-model="leftFirstOrderDate"
                type="date"
                placeholder="">
              </el-date-picker>
              <span>-</span>
              <el-date-picker
                :editable="false"
                :picker-options="pickerRight"
                class="dateWidth"
                v-model="rightFirstOrderDate"
                type="date"
                placeholder="">
              </el-date-picker>
            </div>

            <div class="row_line inline_block m_t20">
              <span class="row-item__inline">最后交易时间：</span>
              <el-date-picker
                :editable="false"
                :picker-options="pickerLeft"
                class="dateWidth"
                v-model="dateOne"
                type="date"
                placeholder="">
              </el-date-picker>
              <span>-</span>
              <el-date-picker
                :editable="false"
                :picker-options="pickerRight"
                class="dateWidth"
                v-model="dateTwo"
                type="date"
                placeholder="">
              </el-date-picker>
            </div>
            <div class="row_line inline_block m_t20">
              <span class="row-item__inline">会员等级：</span>
              <el-select @change="levelValChange" class="userName" v-model="levelVal" placeholder="">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="row_line inline_block m_l10 m_t20">
              <span class="row-item__inline">平均客单价：</span>
              <el-input @blur="blurInp('priceOne', 'priceTwo', true)" v-model.trim="priceOne" class="moneyOne"></el-input>
              <span>-</span>
              <el-input @blur="blurInp('priceTwo', 'priceOne', false)" v-model.trim="priceTwo" class="moneyOne"></el-input>
            </div>
            <div class="row_line inline_block m_l10">
              <span class="row-item__inline">会员年龄：</span>
              <el-input @blur="blurInp('ageLess', 'ageGreat', true)" v-model.trim="ageLess" class="moneyOne"></el-input>
              <span>-</span>
              <el-input @blur="blurInp('ageGreat', 'ageLess', false)" v-model.trim="ageGreat" class="moneyOne"></el-input>
            </div>
            <div class="row_line inline_block m_t20">
              <span class="row-item__inline">会员职业：</span>
              <el-select class="userName" v-model="profession" placeholder="">
                <el-option :value="''" label="不限"></el-option>
                <el-option :value="'学生'" label="学生"></el-option>
                <el-option :value="'白领'" label="白领"></el-option>
                <el-option :value="'教师'" label="教师"></el-option>
                <el-option :value="'军人'" label="军人"></el-option>
                <el-option :value="'警察'" label="警察"></el-option>
                <el-option :value="'记者'" label="记者"></el-option>
                <el-option :value="'医生'" label="医生"></el-option>
                <el-option :value="'其他'" label="其他"></el-option>
              </el-select>
            </div>
            <div class="row_line inline_block m_l10">
              <span class="row-item__inline">会员生日：</span>
              <el-select @change="birthdayChange" class="date" v-model="birthdayMonthOne" placeholder="">
                <el-option :value="''" label="不限"></el-option>
                <el-option v-for="m in month" :value="m" :label="m+'月'"></el-option>
              </el-select>
              <span>-</span>
              <el-select @change="birthdayChange" :disabled="!checkMonth1" class="date" v-model="birthdayDayOne" placeholder="">
                <el-option v-for="m in day" :value="m" :label="m+'日'"></el-option>
              </el-select>
              <span>至</span>
              <el-select @change="birthdayChange" class="date" v-model="birthdayMonthTwo" placeholder="">
                <el-option :value="''" label="不限"></el-option>
                <el-option v-for="m in month2" :value="m" :label="m+'月'"></el-option>
              </el-select>
              <span>-</span>
              <el-select @change="birthdayChange" :disabled="!checkMonth2" class="date" v-model="birthdayDayTwo" placeholder="">
                <el-option v-for="m in day2" :value="m" :label="m+'日'"></el-option>
              </el-select>
            </div>

            <!-- <div class="row_line inline_block m_l10 m_t20">
              <span class="row-item__inline">最近营销时间：</span>
              <el-date-picker
                :editable="false"
                :picker-options="pickerLeft"
                class="dateWidth"
                v-model="leftLastMarketingDate"
                type="date"
                placeholder="">
              </el-date-picker>
              <span>-</span>
              <el-date-picker
                :editable="false"
                :picker-options="pickerRight"
                class="dateWidth"
                v-model="rightLastMarketingDate"
                type="date"
                placeholder="">
              </el-date-picker>
            </div> -->
          </div>
        </el-collapse-transition>
      </div>
      <div class="f-fl hidden">
        <el-button type="primary" class="m_r10" size='small' @click="memberList(true)">查 询</el-button>
        <span class="cursor" @click="screen">{{level ? '普通筛选' : '高级筛选'}}<i :class="{'el-icon-arrow-down': !level, 'el-icon-arrow-up': level}"></i></span>
      </div>
    </div>
    <dealVipTable :tableData="tableData"></dealVipTable>
    <div class="text-right" v-if="pageInfo.total">
      <el-pagination
        :current-page="pageInfo.pageNo"
        @current-change="handleCurrentChange"
        :page-size="pageInfo.pageSize"
        layout="total, prev, pager, next"
        :total="pageInfo.total">
      </el-pagination>
    </div>
    <!-- </div> -->
  </div>
</template>

<script>
  import http from './../../../api/index.js';
  import dealVipTable from './dealVipTable';
  import dateFormat from '../../../common/dateFormat.js';
  import {formatDate} from 'src/common/utils';
  export default{
    data() {
      return {
        loadingPage: false,
        level: false,
        userName: '',
        userNick: '',
        userPhone: '',
        moneyOne: '',
        moneyTwo: '',
        dealOne: '',
        dealTwo: '',
        dateOne: '',
        dateTwo: '',
        leftFirstOrderDate: '',
        rightFirstOrderDate: '',
        leftLastMarketingDate: '',
        rightLastMarketingDate: '',
        priceOne: '',
        priceTwo: '',
        levelVal: '',
        ageLess: '',
        ageGreat: '',
        profession: '',
        customerStatus: '',
        month: 12,
        day: 31,
        month2: 12,
        day2: 31,
        birthdayMonthOne: '',
        birthdayDayOne: '',
        birthdayMonthTwo: '',
        birthdayDayTwo: '',
        checkMonth1: false,
        checkMonth2: false,
        options: [{
          label: '不限',
          value: ''
        }],
        pageInfo: {
          pageNo: 1,
          pageSize: 10,
          total: 0
        },
        tableData: [],
        pickerLeft: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        pickerRight: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        hashObj: {},
        grades: ''
      }
    },
    created() {
      this.memberLevelList();
    },
    mounted() {
      if(location.hash.split('?')[1]) {
        let hashArr = location.hash.split('?')[1].split('&');
        this.hashObj = this.$route.query;
        this.level = true;
        /* 累计成交次数 */
        this.dealOne = this.hashObj.dealType == 0 ? '' : this.hashObj.dealOne;
        this.dealTwo = this.hashObj.dealType == 2 ? '' : this.hashObj.dealTwo;
        let dateNow = new Date().getTime();
        let dateOne = this.hashObj.dateOne;
        let dateTwo = this.hashObj.dateTwo;
        /* 最后交易时间 */
        if(this.hashObj.dateType || this.hashObj.dateType == 0){
          switch(this.hashObj.dateType){
            case 2:
            case '2':
              this.dateOne = '';
              this.dateTwo = dateNow - (Number(dateTwo) * 24 * 3600 * 1000);
              break;
            case 0:
            case '0':
              this.dateOne = dateNow - (Number(dateTwo) * 24 * 3600 * 1000);
              this.dateTwo = '';
              break;
            case 1:
            case '1':
              this.dateOne = dateNow - (Number(dateTwo) * 24 * 3600 * 1000);
              this.dateTwo = dateNow - (Number(dateOne) * 24 * 3600 * 1000);
              break;
            default:
              this.dateOne = '';
              this.dateTwo = '';
              break;
          }
        }
        /* 会员等级 */
        this.grades = this.hashObj.grades ? JSON.parse(this.hashObj.grades).join(',') : '';
        /* 平均客单价 */
        if(this.hashObj.pType || this.hashObj.pType == 0){
          switch(this.hashObj.pType){
            case 2:
            case '2':
              this.priceOne = this.hashObj.priceOne;
              this.priceTwo = '';
              break;
            case 0:
            case '0':
              this.priceOne = '';
              this.priceTwo = this.hashObj.priceTwo;
              break;
            case 1:
            case '1':
              this.priceOne = this.hashObj.priceOne;
              this.priceTwo = this.hashObj.priceTwo;
              break;
          }
        }
        /* 累计成交金额 */
        if(this.hashObj.xType || this.hashObj.xType == 0){
          switch(this.hashObj.xType){
            case 2:
            case '2':
              this.moneyOne = this.hashObj.mOne;
              this.moneyTwo = '';
              break;
            case 0:
            case '0':
              this.moneyOne = '';
              this.moneyTwo = this.hashObj.mTwo;
              break;
            case 1:
            case '1':
              this.moneyOne = this.hashObj.mOne;
              this.moneyTwo = this.hashObj.mTwo;
              break;
          }
        }
        this.memberList(true);
      } else {
        this.memberList(true);
      }
    },
    methods: {
      //生日选择
      birthdayChange: function() {
        let vm = this;
        if(vm.birthdayMonthOne) {
          vm.checkMonth1 = true;
          vm.birthdayDayOne = vm.birthdayDayOne || 1;
          vm.month2 = [];
          for(let num = vm.birthdayMonthOne; num < 13; num ++) {
            vm.month2.push(num);
          };
          let odd = [1,3,5,7,8,10,12],
            even = [4,6,9,11];
          switch (true) {
            case odd.indexOf(vm.birthdayMonthOne) != -1:
              vm.day = 31;
              break;
            case even.indexOf(vm.birthdayMonthOne) != -1:
              vm.day = 30;
              break;
            case vm.birthdayMonthOne == 2:
              vm.day = 29;
              break;
            default:
              break;
          }
        }else {
          vm.checkMonth1 = false;
          vm.birthdayDayOne = '';
          vm.month2 = 12;
        }
        if(vm.birthdayMonthTwo) {
          vm.checkMonth2 = true;
          vm.birthdayDayTwo = vm.birthdayDayTwo || 1;
          vm.month = [];
          for(let num = 1; num < vm.birthdayMonthTwo + 1; num ++) {
            vm.month.push(num);
          };
          let odd = [1,3,5,7,8,10,12],
            even = [4,6,9,11];
          switch (true) {
            case odd.indexOf(vm.birthdayMonthTwo) != -1:
              vm.day2 = 31;
              break;
            case even.indexOf(vm.birthdayMonthTwo) != -1:
              vm.day2 = 30;
              break;
            case vm.birthdayMonthTwo == 2:
              vm.day2 = 29;
              break;
            default:
              break;
          }
        }else {
          vm.checkMonth2 = false;
          vm.birthdayDayTwo = '';
          vm.month = 12;
        }
      },
      getNumber(num) {
        if(num < 10) {
          num = '0'+num;
        };
        return num;
      },
      memberList(init) {
        this.loadingPage = true;
        if(init) {
          this.pageInfo.pageNo = 1;
        };
        http({
          api_name: 'memberList',
          vm: this,
          data: {
            customerType: 0,
            leftTradeAmount: this.moneyOne,
            rightTradeAmount: this.moneyTwo,
            leftAvgPrice: this.priceOne,
            rightAvgPrice: this.priceTwo,
            leftLastOrderDateString: formatDate('yyyy-MM-dd 00:00:00',this.dateOne),
            rightLastOrderDateString: formatDate('yyyy-MM-dd 23:59:59',this.dateTwo),
            leftTradeCount: this.dealOne,
            rightTradeCount: this.dealTwo,
            mobile: this.userPhone,
            pin: this.userName,
            userNick: this.userNick,
            pageNo: this.pageInfo.pageNo,
            pageSize: this.pageInfo.pageSize,
            grade: this.levelVal,
            grades: this.grades,
            ageLess: this.ageLess,
            ageGreat: this.ageGreat,
            birthdayLess: this.birthdayMonthOne ? this.getNumber(this.birthdayMonthOne) + '-' + this.getNumber(this.birthdayDayOne) : '',
            birthdayGreat: this.birthdayMonthTwo ? this.getNumber(this.birthdayMonthTwo) + '-' + this.getNumber(this.birthdayDayTwo) : '',
            profession: this.profession,
            customerStatus: this.customerStatus,
            leftFirstOrderDate: formatDate('yyyy-MM-dd 00:00:00',this.leftFirstOrderDate),
            rightFirstOrderDate: formatDate('yyyy-MM-dd 23:59:59',this.rightFirstOrderDate),
            leftLastMarketingDate: formatDate('yyyy-MM-dd 00:00:00',this.leftLastMarketingDate),
            rightLastMarketingDate: formatDate('yyyy-MM-dd 23:59:59',this.rightLastMarketingDate),
            isMember:true
          }
        }, (res) => {
          this.loadingPage = false;
          this.tableData = res.data ? (res.data.crmCustomerList ? res.data.crmCustomerList : []) : [];
          this.pageInfo.total = res.data ? (res.data.total ? res.data.total : (res.data.crmCustomerList ? res.data.crmCustomerList.length : 0)) : 0;
        }, (error) => {
          this.loadingPage = false;
        });
      },
      screen() {			//高级筛选
        this.level = !this.level;
      },
      // 如果会员等级发生手动修改，则会员等级列表置空
      levelValChange(){
        this.grades = '';
        this.memberList(true);
      },
      handleCurrentChange(e) {
        this.pageInfo.pageNo = Number(e);
        this.memberList();
      },
      memberLevelList() {			//会员等级规则
        let _self = this;
        http({
          api_name: 'memberLevelList',
          vm: this,
          data: {}
        }, (res) => {
          let arr = res.data ? (res.data.levelList ? res.data.levelList : []) : [];
          arr.forEach(item => {
            let name = item.name ? item.name : item.nameSource;
            this.options.push({
              label: name,
              value: item.memberLevel
            });
          });
        }, (error) => {
        })
      },
      blurInp(item, other, flag) {
        if(this[item]) {
          if(isNaN(Number(this[item])) || /\./.test(this[item]) || /\+/.test(this[item])) {
            this.$message.error('只能输入正整数！');
            this[item] = '';
            return
          }
          if(Number(this[item] < 0)) {
            this.$message.error('只能输入正整数！');
            this[item] = '';
            return
          }
          if(isNaN(Number(this[item]))) {
            this.$message.error('值必须为数字！');
            this[item] = '';
            return
          } else {
            if(this[other]) {
              if(flag) {
                if(Number(this[other]) < Number(this[item])) {
                  this.$message.error('左侧值必须小于等于右侧值！');
                  this[item] = '';
                  return
                }
              } else {
                if(Number(this[other]) > Number(this[item])) {
                  this.$message.error('右侧值必须大于等于左侧值！');
                  this[item] = '';
                  return
                }
              }
            }

          }
        }
      }
    },
    watch: {
      dateOne(val) {
        if(val) {
          this.pickerRight = {
            disabledDate(time) {
              return time.getTime() < val;
            }
          }
        } else {
          this.pickerRight = {
            disabledDate(time) {
              return time.getTime() > Date.now();
            }
          }
        }
      },
      dateTwo(val) {
        if(val) {
          this.pickerLeft = {
            disabledDate(time) {
              return time.getTime() > val;
            }
          }
        } else {
          this.pickerLeft = {
            disabledDate(time) {
              return time.getTime() > Date.now();
            }
          }
        }
      }
    },
    components: {
      dealVipTable
    }
  }
</script>

<style lang="less" scoped>
  .headLeft{
    width: 865px;
    .row_line{
      .row_name{

      }
      .center_name{
        width: 85px;
      }
      .userName{
        width: 150px;
      }
      .date {
        width: 80px;
      }

      .moneyOne{
        width: 68.5px;
      }
      .dateWidth{
        width: 115px;
      }
    }

    .row-item__inline {
      width: 7em;
      text-align: right;
      height: 28px;
      line-height: 28px;
      display: inline-block;
    }
    .m_l15{
      margin-left: 15px;
    }
  }
  .hidden{
    button{
      width: 70px;
    }
  }
</style>
