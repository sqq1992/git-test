<template>
  <div class="discount-box" v-loading="createLoading">
    <div class="tips">
      1. 商品折扣和店铺满减活动、优惠券同时生效，请谨慎使用。2.
      设置的商品折扣不得低于店铺最低折扣<a
        href="https://prom.shop.jd.com/promotion/limit/mainPromoLimit.action"
        target="_blank"
        >查看店铺最低折扣</a
      >
    </div>
    <el-form
      :label-position="labelPosition"
      label-width="200px"
      :model="discountData"
    >
      <el-form-item label="选择指定商品：">
        <span v-if="discountData.good.title">{{
          discountData.good.title
        }}</span>
        <el-button
          class="m_l10"
          type="text"
          @click="dialogVisible = true"
          v-if="!discountData.discountJson.promoId"
          >{{
            discountData.good.wareId ? "重新选择" : "选择指定商品"
          }}</el-button
        >
        <p class="error-tip red" v-if="discountData.good.wareId">
          <span v-if="discountData.good.price" style="margin-right: 10px;"
            >￥ {{ discountData.good.price }}</span
          >
          <span style="color: #888;"
            >{{ isZiying ? "SKU" : "商品" }}编号:
            {{ discountData.good.wareId }}</span
          >
        </p>
        <p class="error-tip red" v-if="isSubmit && !discountData.good.wareId">
          请选择指定商品！
        </p>
      </el-form-item>
      <el-form-item label="礼品名称：">
        <el-input
          class="w300"
          :disabled="discountData.status == 'invalid'"
          auto-complete="off"
          v-model="discountData.giftName"
        ></el-input>
        <span>{{ discountData.giftName.length }}/20</span>
        <p class="error-tip red" v-if="isSubmit && !discountData.giftName">
          礼品名称不能为空！
        </p>
        <p class="error-tip red" v-if="discountData.giftName.length > 20">
          礼品名称最多20个字符！
        </p>
      </el-form-item>
      <el-form-item label="礼品图片：">
        <div class="img_content">
          <span
            class="loading"
            v-if="uploadFlg"
            v-loading="uploadFlg"
            style="line-height: 0;"
          ></span>
          <el-upload
            class="img_box"
            action="/common/picUpload"
            :disabled="imgNotUpload"
            :show-file-list="false"
            :on-success="uploadSuccess"
            :before-upload="uploadBefore"
          >
            <img v-if="discountData.picUrl" :src="discountData.picUrl" />
            <span v-if="!uploadFlg && !imgNotUpload">上传图片</span>
          </el-upload>
          <span class="upload-tip"
            >建议尺寸：750*424像素，上传图片大小不能超过 1.5MB！</span
          >
        </div>
        <p class="error-tip red"></p>
      </el-form-item>
      <el-form-item label="专享折扣：">
        <skusTable
          ref="skusTable"
          :skusData="discountData.discountJson.skuList"
          :goodData="discountData.good"
          :status="discountData.status"
          type="multi"
        />
      </el-form-item>
      <el-form-item label="优惠限制：">
        <el-radio-group
          v-model="discountData.discountJson.freqBound"
          :disabled="discountData.status ? true : false"
        >
          <el-radio :label="3"
            >一个会员只能享受一次专享折扣优惠，第二次购买时恢复商品原价</el-radio
          >
          <el-radio :label="0">不限优惠次数，礼品下架后恢复商品原价</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="单次购买限制：">
        <el-radio-group
          v-model="buyFlg"
          :disabled="discountData.status ? true : false"
        >
          <el-radio :label="1"
            >单次购买
            <el-input
              class="w50"
              v-model="discountData.discountJson.perMinNum"
              @blur="blurInp('perMinNum')"
              :disabled="discountData.status ? true : false"
            ></el-input>
            -
            <el-input
              class="w50"
              v-model="discountData.discountJson.perMaxNum"
              @blur="blurInp('perMaxNum')"
              :disabled="discountData.status ? true : false"
            ></el-input>
            件任意指定sku商品才能享受专享折扣优惠</el-radio
          >
          <el-radio :label="0">不限单次购买数量</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="促销编码：" v-if="isZiying">
        <el-input
          class="w300"
          :disabled="discountData.status == 'invalid'"
          auto-complete="off"
          v-model="discountData.promotionCode"
        ></el-input>
        <span class="timeHint">请使用已通过平台审核的商品促销编码</span>
        <p class="error-tip red" v-if="isSubmit && !discountData.promotionCode">
          促销编码不能为空！
        </p>
      </el-form-item>
      <el-form-item label="礼品介绍：">
        <div>
          <el-button type="text" @click="generate()">自动生成</el-button>
        </div>
        <el-input
          :disabled="discountData.status == 'invalid'"
          type="textarea"
          class="discountDesc"
          v-model="discountData.giftIntro"
        ></el-input>
        <span class="v-bottom"
          >{{ discountData.giftIntro.length }}/120（非必填）</span
        >
        <p class="error-tip red" v-if="discountData.giftIntro.length > 120">
          礼品介绍最多120个字符！
        </p>
      </el-form-item>
      <el-form-item label="活动有效期：">
        <el-date-picker
          v-model="discountData.upTime"
          :clearable="false"
          :disabled="discountData.status ? true : false"
          type="datetime"
          placeholder="选择日期"
          class="row_date"
          :picker-options="pickerStartTime"
        >
        </el-date-picker>
        至
        <el-date-picker
          v-model="discountData.downTime"
          :clearable="false"
          :disabled="discountData.status ? true : false"
          type="datetime"
          placeholder="选择日期"
          :picker-options="pickerEndTime"
        >
        </el-date-picker>
        <span class="timeHint"
          >活动有效期不得超过商品促销有效期和插件订购有效期<a
            href="http://fw.jd.com/657606.html"
            target="_blank"
            >立即续订</a
          ></span
        >
        <p
          class="error-tip red"
          v-if="
            new Date(discountData.downTime).getTime() <=
              new Date(discountData.upTime).getTime()
          "
        >
          下架时间不能小于等于上架时间，请重新选择！
        </p>
      </el-form-item>
      <el-form-item label="总库存总量：">
        <el-input
          :maxlength="9"
          class="w150"
          :disabled="discountData.status ? true : false"
          auto-complete="off"
          @blur="blurInp('allCount')"
          v-model="discountData.allCount"
        ></el-input>
        <el-input
          v-if="isAdd"
          class="w50"
          auto-complete="off"
          @blur="blurInp('addCountNum')"
          v-model="discountData.addCountNum"
        ></el-input>
        <el-button
          v-if="discountData.status == 'valid'"
          class="m_l10"
          type="text"
          @click="addCount()"
          >{{ isAdd ? "确定追加" : "追加库存量" }}</el-button
        >
      </el-form-item>
      <el-form-item label="兑换要求：">
        <el-radio-group
          v-model="discountData.exchangeRequired"
          :disabled="discountData.status ? true : false"
        >
          <el-radio :label="1">兑换时自动关注店铺</el-radio>
          <el-radio :label="0">无要求</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="兑换需要等级：">
        <el-checkbox-group
          v-model="discountData.checkedMembers"
          style="display:inline-block;"
        >
          <el-checkbox
            v-for="member in members"
            :disabled="discountData.status ? true : false"
            :label="member"
            :key="member"
            >{{ member }}</el-checkbox
          >
        </el-checkbox-group>
        <p class="error-tip red" v-if="!discountData.checkedMembers.length">
          请选择兑换需要的等级！
        </p>
      </el-form-item>
      <limit-member
        :giftStatus="giftStatus"
        @getUploadFile="getUploadFile"
        :limitMembers="discountData.limitMembers"
        @updateMsg="updateMsg"
      ></limit-member>
      <el-form-item label="兑换所需积分：">
        <el-input
          :maxlength="9"
          v-if="isUnified"
          class="w150"
          :disabled="discountData.status ? true : false"
          auto-complete="off"
          @blur="blurInp('needPoint')"
          v-model="discountData.needPoint"
        ></el-input>
        <div v-else class="distribution-box">
          <ul v-if="discountData.checkedMembers.length">
            <li
              v-for="(item, index) in sortMember"
              :key="'sortMember_' + index"
            >
              <span>{{ item.name }}：</span>
              <el-input
                :maxlength="9"
                class="w100"
                :disabled="discountData.status ? true : false"
                auto-complete="off"
                @blur="blurInp('needPointLevel', item.index)"
                v-model="discountData['needPointLevel' + item.index]"
              ></el-input>
              <span class="ml_5">积分</span>
            </li>
          </ul>
          <div v-else class="no-data">请选择兑换需要的等级！</div>
          <el-button
            v-if="!isUnified"
            class="m_l10 unified-set"
            type="text"
            @click="distribution()"
            >统一设置</el-button
          >
        </div>
        <el-button
          v-if="isUnified"
          class="m_l10"
          type="text"
          @click="distribution()"
          >按会员等级设置</el-button
        >
      </el-form-item>
      <el-form-item label="积分商城展示：">
        <el-radio-group
          v-model="discountData.isShow"
        >
          <el-radio :label="1"  checked>在积分商城中展示该礼品</el-radio>
          <el-radio :label="0">
            只能通过链接访问<span class="fc--gray">(勾选该项后，礼品将不展示在会员页积分商城中)</span>
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="每人兑换上限：">
        <el-select
          class="ui-filter-pd"
          size="5"
          v-model="discountData.upLimit"
          disabled
        >
          <el-option
            v-for="num in 1"
            :key="num"
            :label="num"
            :value="num"
          ></el-option>
        </el-select>
      </el-form-item>
      <div class="turntable-btn">
        <el-button size="small" class="queryBtn" @click="cancelCreate()">{{
          discountData.status != "invalid" ? "取消" : "返回"
        }}</el-button>
        <el-button
          v-if="discountData.status != 'invalid'"
          type="primary"
          size="small"
          @click="validation()"
          >确定</el-button
        >
      </div>
    </el-form>
    <goods-choose
      :selectIdList="[discountData.good.wareId]"
      type="radio"
      @close="closeDialog"
      @check="checkDialog"
      v-if="dialogVisible"
    ></goods-choose>
    <discount-tip-dialog :url="jumpUrl" ref="discountTip"></discount-tip-dialog>
  </div>
</template>

<script>
import dateFormat from "src/common/dateFormat.js";
import limitMember from "../interaction/limitMember.vue";
import { clone, isWhiteList } from "src/common/public.js";
import validation from "src/common/validation.js";
import ajax from "src/api/index.js";
import goodsChoose from "src/components/goods-choose/goods-choose";
// import $ from 'jquery';
import store from "src/store.js";
import discountTipDialog from "src/components/integral-interaction/discountTip.vue";
import skusTable from "src/components/skusTable/index";
export default {
  data() {
    return {
      isZiying: store.state.ziying.isZiying,
      dialogVisible: false,
      createLoading: false,
      labelPosition: "right",
      hsitoryUrl: "",
      checkSkuId: "",
      giftStatus: false,
      discountData: {
        limitMembers: 0,
        good: {},
        giftName: "",
        promotionCode: "",
        giftIntro: "",
        upLimit: 1,
        isShow:1,
        discountJson: {
          skuList: [],
          freqBound: 3,
          perMinNum: 1,
          perMaxNum: 1
        },
        checkedMembers: [],
        exchangeRequired: 1,
        upTime: dateFormat(
          new Date().setHours(0, 0, 0, 0),
          "YY-MM-DD HH:MM:SS"
        ),
        downTime: dateFormat(
          new Date(new Date().getTime() + 2592000000).setHours(23, 59, 59, 59),
          "YY-MM-DD HH:MM:SS"
        )
      },
      uploadFlg: false,
      pickerStartTime: {
        // disabledDate: (time) => {
        // 	if(isWhiteList()){
        // 		return false;
        // 	}
        //     return (time.getTime() > new Date(this.discountData.downTime).getTime()) || (time.getTime() < Date.now() - 8.64e7);
        // }
      },
      pickerEndTime: {
        // disabledDate: (time) => {
        // 	if(isWhiteList()){
        // 		return false;
        // 	}
        //     return (time.getTime() <  new Date(new Date().setHours(0,0,0,0)).getTime()) || (time.getTime() > new Date(store.state.user.endTime).getTime());
        // }
      },
      isAdd: false,
      members: [],
      isUnified: true,
      isSubmit: false,
      buyFlg: 1,
      jumpUrl: "/giftList",
      imgNotUpload: false,
      showStockNumNullFlg: false,
      uploadFile: ""
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.hsitoryUrl = from.path;
    });
  },
  watch: {
    // 'couponData.upTime'(val){
    // 	let vm = this;
    // 	if(val){
    // 		this.pickerEndTime = {
    // 			disabledDate(time) {
    // 				if(isWhiteList()){
    // 					return false;
    // 				}
    // 				return (time.getTime() < new Date(val).setHours(0,0,0,0)) || (time.getTime() > new Date(store.state.user.endTime).getTime());
    // 			}
    // 		}
    // 	} else {
    // 		this.pickerEndTime = {
    // 			disabledDate(time){
    // 				return false;
    // 			}
    // 		};
    // 	}
    // },
    // 'couponData.downTime'(val){
    // 	if(val){
    // 		this.pickerStartTime = {
    // 			disabledDate: (time) => {
    // 				if(isWhiteList()){
    // 					return false;
    // 				}
    // 				return (time.getTime() > new Date(this.couponData.downTime).getTime()) || (time.getTime() < Date.now() - 8.64e7);
    // 			}
    // 		}
    // 	} else {
    // 		this.pickerStartTime = {
    // 			disabledDate(time){
    // 				return false;
    // 			}
    // 		};
    // 	}
    // },
  },
  created() {
    //判断默认时间与软件到期时间
    if (
      new Date(store.state.user.endTime).getTime() <
      new Date().getTime() + 2592000000
    ) {
      this.discountData.downTime = store.state.user.endTime;
    }
    this.giftId = this.$route.query.id;
    this.getMemberSet(checkMember => {
      this.generate();
      this.giftId && this.getCouponMsg(this.giftId, checkMember);
    });
  },
  computed: {
    sortMember() {
      let _map = [],
        vm = this;
      this.discountData.checkedMembers.forEach(item => {
        _map.push({
          name: item,
          index: vm.members.indexOf(item)
        });
      });
      return _map;
    }
  },
  methods: {
    getUploadFile(file) {
      this.uploadFile = file;
    },
    updateMsg({ child, val }) {
      this.discountData[child] = val;
    },
    uploadSuccess(file) {
      if (file.result == "100") {
        this.discountData.picUrl = file.data.picUrl;
      } else {
        this.$message.error(file.message || "图片上传失败！");
      }
      this.uploadFlg = false;
    },
    uploadBefore(file) {
      const isIMAGE = /image\/\w+/.test(file.type);
      const isLt2M = file.size / 1024 / 1024 < 1.5;

      if (!isIMAGE) {
        this.$message.error("上传图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 1.5MB!");
      }
      if (isIMAGE && isLt2M) {
        this.uploadFlg = true;
      }
      return isIMAGE && isLt2M;
    },
    getCouponMsg(id, checkMember) {
      let _id = id || "",
        vm = this;
      vm.createLoading = true;
      ajax(
        {
          api_name: "giftById",
          data: {
            id: _id
          }
        },
        result => {
          vm.createLoading = false;
          result.data.good = {
            title: "",
            wareId: result.data.itemId
          };
          result.data.checkedMembers = [];
          result.data.isShow = result.data.isShow == undefined ?  1 :  result.data.isShow;
          vm.$set(vm, "discountData", result.data);
          vm.discountData.discountJson = vm.discountData.discountJson
            ? JSON.parse(vm.discountData.discountJson)
            : {
                skuList: [],
                freqBound: 3,
                perMinNum: 1,
                perMaxNum: 1,
                isShow:1,
                good: {
                  title: "",
                  wareId: result.data.itemId
                }
              };
          if (vm.discountData.discountJson.skuList.length) {
            vm.checkSkuId = vm.discountData.discountJson.skuList[0].skuId;
          }

          if (vm.$route.query.type && vm.$route.query.type === "copy") {
            vm.discountData.status = "";
            delete vm.discountData.discountJson.promoId;
            delete vm.discountData.id;

            result.data.upTime = dateFormat(
              new Date().setHours(0, 0, 0, 0),
              "YY-MM-DD HH:MM:SS"
            );
            if (
              new Date(store.state.user.endTime).getTime() <
              new Date().getTime() + 2592000000
            ) {
              result.data.downTime = store.state.user.endTime;
            }
          }
          vm.discountData.good =
            vm.discountData.discountJson.good || vm.discountData.good;
          vm.buyFlg =
            vm.discountData.discountJson.perMinNum >= 1 &&
            vm.discountData.discountJson.perMaxNum >= 1
              ? 1
              : 0;
          vm.discountData.giftIntro = vm.discountData.giftIntro.replace(
            /<br>/g,
            "\n"
          );
          vm.giftStatus =
            result.data.status == "valid" || result.data.status == "invalid"
              ? true
              : false;
          vm.imgNotUpload = result.data.status == "invalid" ? true : false;
          let _needLevel = result.data.needLevel.split(",");
          vm.discountData.addCountNum = "1";
          _needLevel.forEach(item => {
            vm.discountData.checkedMembers.push(checkMember[item - 1]);
          });
          vm.isUnified = result.data.needPoint ? true : false;
        },
        error => {
          vm.$message.error(error.message || "获取礼品信息失败！");
        }
      );
    },
    //  库存过滤器
    blurInp(item, key) {
      let name = key != undefined ? item + key : item;
      let obj = this["discountData"][name];
      if (!obj) {
        this["discountData"][name] = "1";
        return;
      } else if (
        isNaN(Number(obj)) ||
        /\./.test(obj) ||
        /\+/.test(obj) ||
        Number(obj <= 0)
      ) {
        this.$message.error("只能输入正整数！");
        this["discountData"][name] = "1";
        return;
      }
    },
    addCount() {
      this.isAdd = !this.isAdd;
      if (!this.isAdd) {
        this.discountData.allCount =
          Number(this.discountData.addCountNum) +
          Number(this.discountData.allCount);
        this.discountData.addCountNuma = "1";
      }
    },
    distribution() {
      this.isUnified = !this.isUnified;
    },
    //获取设置的会员名称
    getMemberSet(cab) {
      let vm = this,
        _arr = [],
        _map = {};
      ajax(
        {
          api_name: "memberLevelList"
        },
        res => {
          if (res.data.levelList && res.data.levelList.length) {
            res.data.levelList.forEach(item => {
              _arr.push(item.name || item.nameSource);
              _map[item.name || item.nameSource] = item.memberLevel;
            });
          } else {
            _arr = [
              "注册会员",
              "一星会员",
              "二星会员",
              "三星会员",
              "四星会员",
              "五星会员"
            ];
          }
          vm.members = _arr;
          vm.discountData.checkedMembers = _arr;
          cab && cab(_arr);
        },
        error => {
          this.$message.error(error.message || "获取会员列表失败");
        }
      );
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    checkDialog(data) {
      this.dialogVisible = false;
      this.$set(this.discountData, "picUrl", data[0].logo);
      this.$set(this.discountData, "good", data[0]);
      let name = data[0].title.substr(0, 20);
      this.$set(this.discountData, "giftName", name);
      // this.getGoodSkuList();
    },
    validation() {
      let vm = this,
        discountData = clone(vm.discountData),
        isOk = true,
        needLevelArr = [],
        checkLevel = [];
      vm.isSubmit = true;
      let errObj = {};
      let skuList = this.$refs.skusTable.getData();
      try {
        if (!discountData.good.wareId) {
          errObj.msg = "请选择指定商品！";
          throw errObj;
        } else if (!discountData.giftName) {
          errObj.msg = "礼品名称不能为空！";
          throw errObj;
        } else if (discountData.giftName.length > 20) {
          errObj.msg = "礼品名称最多20个字符！";
          throw errObj;
        } else {
          if (Object.prototype.toString.call(skuList) !== "[object Array]") {
            //如果报错 将错误对象抛出 用于scrollToLocation
            throw skuList;
          }
          if (vm.buyFlg) {
            if (!discountData.discountJson.perMinNum) {
              errObj.msg = "单次购买最小数量不能为空";
              throw errObj;
            } else if (
              !validation.isIntNum(discountData.discountJson.perMinNum)
            ) {
              errObj.msg = "单次购买最小数量必须为数字";
              throw errObj;
            } else if (discountData.discountJson.perMinNum > 10) {
              errObj.msg = "单次购买最小数量不能大于10";
              throw errObj;
            } else if (!discountData.discountJson.perMaxNum) {
              errObj.msg = "单次购买最大数量不能为空";
              throw errObj;
            } else if (
              !validation.isIntNum(discountData.discountJson.perMaxNum)
            ) {
              errObj.msg = "单次购买最大数量必须为数字";
              throw errObj;
            } else if (discountData.discountJson.perMaxNum > 10) {
              errObj.msg = "单次购买最大数量不能大于10";
              throw errObj;
            } else if (
              Number(discountData.discountJson.perMinNum) >
              Number(discountData.discountJson.perMaxNum)
            ) {
              errObj.msg = "单次购买最小数量不能大于单次购买最大数量";
              throw errObj;
            }
            // else if(!this.checkSkuId) {
            //   errObj.msg = '请选择折扣商品';
            // 	throw errObj;
            // }
          } else {
            discountData.discountJson.perMinNum = 0;
            discountData.discountJson.perMaxNum = 0;
          }
          if (vm.isUnified) {
            // 删除按会员等级设置的积分
            for (var i = 0; i < 6; i++) {
              delete discountData["needPointLevel" + i];
            }
          } else {
            // 删除统一积分
            delete discountData.needPoint;
            vm.discountData.checkedMembers.forEach(item => {
              checkLevel.push(vm.members.indexOf(item));
            });
            for (var i = 0; i < 6; i++) {
              if (checkLevel.indexOf(i) == -1) {
                delete discountData["needPointLevel" + i];
              }
            }
          }
          if (discountData.checkedMembers.length) {
            discountData.checkedMembers.forEach(item => {
              needLevelArr.push(vm.members.indexOf(item) + 1);
            });
          }
          if (!discountData.promotionCode && this.isZiying) {
            errObj.msg = "促销编码不能为空！";
            throw errObj;
          }
          if (discountData.giftIntro.length > 120) {
            errObj.msg = "礼品介绍不能超过120个字";
            throw errObj;
          }
          //时间检测
          if (
            new Date(discountData.downTime).getTime() <=
            new Date(discountData.upTime).getTime()
          ) {
            errObj.msg = "下架时间不能小于等于上架时间";
            throw errObj;
          } else if (
            new Date(discountData.downTime).getTime() < new Date().getTime()
          ) {
            errObj.msg = "下架时间不能小于当前时间";
            throw errObj;
          } else if (!discountData.allCount) {
            errObj.msg = "库存总量不能为空";
            throw errObj;
          } else if (!validation.isIntNum(discountData.allCount)) {
            errObj.msg = "库存总量必须是数字";
            throw errObj;
          } else if (discountData.checkedMembers.length == 0) {
            errObj.msg = "兑换等级至少要有一个";
            throw errObj;
          } else if (vm.isUnified && !discountData.needPoint) {
            errObj.msg = "兑换所需积分不能为空";
            throw errObj;
          } else if (!vm.isUnified) {
            checkLevel.forEach((item, index) => {
              if (!discountData["needPointLevel" + item]) {
                errObj.msg =
                  discountData.checkedMembers[index] + "兑换所需积分不能为空";
                throw errObj;
              }
            });
          }
          discountData.discountJson.skuList = skuList;
          discountData.needLevel = needLevelArr.sort().join(",");
          delete discountData.status;
          delete discountData.addCountNum;
          discountData.upTime = discountData.upTime
            ? dateFormat(discountData.upTime, "YY-MM-DD HH:MM:SS")
            : "";
          discountData.downTime = discountData.downTime
            ? dateFormat(discountData.downTime, "YY-MM-DD HH:MM:SS")
            : "";
          // 验证完成，进入保存报错
          this.saveShopDisc(discountData);
        }
      } catch (e) {
        e.msg && this.$message.error(e.msg);
        // if(e.type == 'input'){
        // 	let dom = $('.el-table__body').find('tr').eq(e.index);
        // 	dom.find('._skuInput').addClass('red');
        // 	this.scrollToLocation(dom);
        // }
      }
    },
    saveShopDisc(discountData) {
      if (discountData.id) {
        this.saveGift(discountData);
        return;
      }
      let arr = [];
      discountData.discountJson.skuList.forEach((item, index) => {
        arr.push({
          promoPrice: item.finalPrice,
          skuId: item.skuId,
          bindType: 1,
          jdPrice: item.jdPrice
        });
        discountData.price = item.disPrice;
      });
      let data = {
        // 促销开始时间
        beginTime: discountData.upTime,
        // 促销结束时间
        endTime: discountData.downTime,
        // 单次购买限制
        freqBound: discountData.discountJson.freqBound,
        // 单次最大购买数量
        perMaxNum: discountData.discountJson.perMaxNum,
        // 单次最小购买数量
        perMinNum: discountData.discountJson.perMinNum,
        // sku促销信息
        promotionSkus: JSON.stringify(arr),
        // 促销名称
        activityName: "积分商城商品折扣"
        //
      };
      discountData.giftIntro = discountData.giftIntro.replace(
        /[\n\r]/g,
        "<br>"
      );
      //拦截关键词
      let _activityDesc = discountData.giftIntro,
        sensitive = ["解释", "解释权", "商家所有", "归商家所有"],
        isHasSensitive = false;
      sensitive.forEach(obj => {
        if (_activityDesc.indexOf(obj) != -1) {
          isHasSensitive = true;
        }
      });
      if (isHasSensitive) {
        this.$message.error("活动规则不合法，请使用系统自动生成规则！");
        return false;
      }
      discountData.giftType = "gift_wareDiscount";
      discountData.discountJson.good = discountData.good;
      if (this.isZiying) {
        this.saveGift(discountData);
      } else {
        ajax(
          {
            api_name: "createUnitPromotionWrite",
            data,
            vm: this
          },
          result => {
            discountData.discountJson.promoId = result.data.result;
            this.saveGift(discountData);
          }
        );
      }
    },
    saveGift(discountData) {
      this.createLoading = true;
      this.isSubmit = false;

      if (this.$route.query.type && this.$route.query.type === "copy") {
        delete discountData.id;
      }
      let formData = new FormData();
      for (let item in discountData) {
        let _data = discountData[item];
        if (typeof _data == "object") {
          _data = JSON.stringify(_data);
        }
        formData.append(item, _data);
      }
      formData.append("file", this.uploadFile);
      ajax(
        {
          api_name: "saveGift",
          vm: this,
          data: formData
        },
        res => {
          this.createLoading = false;
          this.$refs.discountTip.show();
          // this.$message.success(discountData.id ? '礼品修改保存成功！':'礼品创建成功！');
          // setTimeout(() => {
          // 	this.$router.push({path: '/giftList'});
          // }, 1300);
        },
        error => {
          this.hasSubmit = false;
          this.createLoading = false;
          this.$message.error(
            error.message ||
              (discountData.id ? "礼品修改保存失败！" : "礼品创建失败！")
          );
        }
      );
    },
    scrollToLocation(scrollToContainer) {
      let mainContainer = $("#container");
      mainContainer.animate(
        {
          scrollTop:
            scrollToContainer.offset().top -
            mainContainer.offset().top +
            mainContainer.scrollTop() -
            200
        },
        1000
      );
    },
    generate() {
      let buyNum =
        this.discountData.discountJson.perMinNum ==
        this.discountData.discountJson.perMaxNum
          ? this.discountData.discountJson.perMaxNum
          : this.discountData.discountJson.perMinNum +
            " - " +
            this.discountData.discountJson.perMaxNum;
      this.discountData.giftIntro = `1、优惠限制：${
        this.discountData.discountJson.freqBound == 3
          ? "一个会员只能享受一次专享折扣优惠，第二次购买时恢复原价"
          : "不限优惠次数，礼品下架后商品恢复原价"
      }\n2、单次购买上限：${
        this.buyFlg
          ? `单次购买 ${buyNum} 件任意指定sku商品才能享受专享折扣优惠`
          : "不限单次购买数量"
      }\n3、商品折扣在加入购物车后生效`;
    },
    cancelCreate() {
      let _url = this.hsitoryUrl == "/" ? "/integralCenter" : this.hsitoryUrl;
      this.$router.push({ path: _url });
    }
  },
  components: {
    goodsChoose,
    discountTipDialog,
    limitMember,
    skusTable
  }
};
</script>

<style lang="less">
.discount-box {
  .el-input {
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
    &.w100 {
      width: 100px;
    }
    &.w50 {
      width: 50px;
    }
    .el-input__inner {
      width: 100%;
      height: 100%;
    }
    &._skuInput.red {
      input {
        border-color: red;
      }
    }
  }
  .el-textarea {
    &.discountDesc {
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
.discount-box {
  padding: 20px 0 50px 20px;
  box-sizing: border-box;
  .tips {
    border: 1px solid rgb(251, 225, 185);
    padding: 10px 22px;
    background: rgb(254, 249, 241);
    width: 90%;
    font-size: 12px;
    a {
      margin-left: 20px;
      color: #20a0ff;
      font-size: 12px;
    }
  }
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
      background: rgba(79, 79, 79, 0.5);
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
}
.goodName {
  width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  .el-checkbox__label {
    font-size: 10px;
  }
}
.el_input {
  line-height: 26px;
}
.timeHint {
  color: #888;
  font-size: 12px;
  margin-left: 10px;
  a {
    margin-left: 20px;
    color: #20a0ff;
  }
}
</style>
