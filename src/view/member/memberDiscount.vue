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
          <span v-if="discountData.good.price"
            >￥ {{ discountData.good.price }}</span
          >
          <span style="color: #888;margin-left: 10px;"
            >{{ isZiying ? "SKU" : "商品" }}编号:
            {{ discountData.good.wareId }}</span
          >
        </p>
        <p class="error-tip red" v-if="isSubmit && !discountData.good.wareId">
          请选择指定商品！
        </p>
      </el-form-item>
      <el-form-item label="活动名称：">
        <el-input
          class="w300"
          :disabled="discountData.status == 'invalid'"
          auto-complete="off"
          v-model="discountData.activityName"
        ></el-input>
        <span>{{ discountData.activityName.length }}/20</span>
        <p class="error-tip red" v-if="isSubmit && !discountData.activityName">
          活动名称不能为空！
        </p>
        <p class="error-tip red" v-if="discountData.activityName.length > 20">
          活动名称最多20个字符！
        </p>
      </el-form-item>
      <el-form-item label="展示图片设置：">
        <el-radio-group
          v-model="imgType"
          :disabled="discountData.status == 'invalid'"
        >
          <el-radio :label="0">
            <span>直接使用商品主图</span>
          </el-radio>
          <el-radio :label="1">
            <span>上传指定图片</span>
            <el-button
              class="m_l10"
              v-if="discountData.status != 'invalid' && imgType == 1"
              type="text"
              @click="imgDialogVisible = true"
              >设置图片</el-button
            >
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="专享折扣：">
        <skusTable
          ref="skusTable"
          :skusData="discountData.skus"
          :goodData="discountData.good"
          :status="discountData.status"
          type="multi"
        />
        <!-- <div v-if="!isZiying"><el-checkbox v-model="showStockNumNullFlg">当前已{{showStockNumNullFlg ? '展示' : '隐藏'}}库存为0的sku数据</el-checkbox></div>
                <el-table
					:data="discountData.skus"
					style="width: 835px;"
					:row-class-name="filterStockNumNull"
				>
            <el-table-column label="" align="left" min-width="50">
              <template slot-scope="scope">
                  <el-radio v-model="checkSkuId"  :label="scope.row.skuId">&nbsp;</el-radio>
              </template>
            </el-table-column>
                    <el-table-column
                        label="商品信息"
						width="260">
						<template scope="scope">
							<el-tooltip class="goodName" effect="dark" :content="scope.row.skuName" placement="top-start">
								<div>
									{{scope.row.skuName}}
								</div>
							</el-tooltip>
						</template>
                    </el-table-column>
                    <el-table-column
                        width="90"
                        label="原价">
						<template scope="scope">
							<span v-if="!scope.row.isDefaul">
								<span v-if="scope.row.jdPrice && !isZiying">{{scope.row.jdPrice}}</span>
								<el-input v-else v-model="scope.row.jdPrice" class="el_input _skuInput" @blur="changeFinalPrice(scope.row, 'jdPrice')" @focus="removeRedClass()" :disabled='discountData.status ? true : false'></el-input>
							</span>
						</template>
                    </el-table-column>
                    <el-table-column
                        width="90"
                        label="折扣">
						<template scope="scope">
							<el-input v-model="scope.row.discount" class="el_input _skuInput" @blur="changeFinalPrice(scope.row, 'discount')" @focus="removeRedClass()" :disabled='discountData.status ? true : false'></el-input>
						</template>
                    </el-table-column>
                    <el-table-column
                        width="140"
                        label="优惠金额">
						<template scope="scope">
							<el-input v-model="scope.row.disPrice" class="el_input _skuInput" @blur="changeFinalPrice(scope.row, 'disPrice')" @focus="removeRedClass()" :disabled='discountData.status ? true : false'></el-input>
						</template>
                    </el-table-column>
                    <el-table-column
                        width="110"
                        label="到手价">
						<template scope="scope">
							<span v-if="!scope.row.isDefault">{{scope.row.finalPrice}}</span>
						</template>
                    </el-table-column>
                    <el-table-column label="管理" align="left" width="64">
                        <template scope="scope">
                            <el-button type="text" @click="delSkuList(scope.row, scope.$index)" v-if="!scope.row.isDefault && (discountData.status ? false : true)">删除</el-button>
							<span v-if="discountData.status">--</span>
                        </template>
                    </el-table-column>
                </el-table> -->
      </el-form-item>
      <el-form-item label="优惠限制：">
        <el-radio-group
          v-model="discountData.discountJson.freqBound"
          :disabled="discountData.status ? true : false"
        >
          <el-radio :label="3"
            >一个会员只能享受一次专享折扣优惠，第二次购买时恢复商品原价</el-radio
          >
          <el-radio :label="0">不限优惠次数，活动结束后恢复商品原价</el-radio>
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
          v-model="discountData.discountJson.promoId"
        ></el-input>
        <span class="timeHint">请使用已通过平台审核的商品促销编码</span>
        <p
          class="error-tip red"
          v-if="isSubmit && !discountData.discountJson.promoId"
        >
          促销编码不能为空！
        </p>
      </el-form-item>
      <el-form-item label="活动介绍：">
        <div>
          <el-button type="text" @click="generate()">自动生成</el-button>
        </div>
        <el-input
          :disabled="discountData.status == 'invalid'"
          type="textarea"
          class="discountDesc"
          v-model="discountData.activityDesc"
        ></el-input>
        <span class="v-bottom"
          >{{ discountData.activityDesc.length }}/120（非必填）</span
        >
        <p class="error-tip red" v-if="discountData.activityDesc.length > 120">
          活动介绍最多120个字符！
        </p>
      </el-form-item>
      <el-form-item label="活动有效期：">
        <el-date-picker
          v-model="discountData.startTime"
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
          v-model="discountData.endTime"
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
            new Date(discountData.endTime).getTime() <=
              new Date(discountData.startTime).getTime()
          "
        >
          结束时间不能小于等于上架时间，请重新选择！
        </p>
      </el-form-item>
      <el-form-item label="总库存总量：">
        <el-input
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
      <el-form-item label="活动要求：">
        <el-radio-group
          v-model="discountData.triggerActive"
          :disabled="discountData.status ? true : false"
        >
          <el-radio :label="false">无要求</el-radio>
          <el-radio :label="true">领取活动折扣时自动关注店铺</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="参与所需等级：">
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
      <el-form-item label="每人参与上限：">
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
          @click="validation"
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
    <imgDialog
      v-if="imgDialogVisible"
      :imgList="discountData.mainImg"
      @close="closeDialog"
      @check="checkImgDialog"
    ></imgDialog>
  </div>
</template>

<script>
import dateFormat from "src/common/dateFormat.js";
import { clone, isWhiteList } from "src/common/public.js";
import validation from "src/common/validation.js";
import ajax from "src/api/index.js";
import goodsChoose from "src/components/goods-choose/goods-choose";
import imgDialog from 'src/components/img-dialog/img-dialog.vue';
// import $ from 'jquery';
import store from 'src/store.js';
import {point} from 'src/common/point.js';
import skusTable from "src/components/skusTable";
export default {
  data() {
    return {
      isZiying: store.state.ziying.isZiying,
      dialogVisible: false,
      createLoading: false,
      labelPosition: "right",
      hsitoryUrl: "",
      discountData: {
        good: {},
        activityName: "",
        activityDesc: "",
        upLimit: 1,
        skus: [],
        discountJson: {
          freqBound: 3,
          perMinNum: 1,
          perMaxNum: 1
        },
        checkedMembers: [],
        triggerActive: true,
        startTime: dateFormat(
          new Date().setHours(0, 0, 0, 0),
          "YY-MM-DD HH:MM:SS"
        ),
        endTime: dateFormat(
          new Date(new Date().getTime() + 2592000000).setHours(23, 59, 59, 59),
          "YY-MM-DD HH:MM:SS"
        )
      },
      uploadFlg: false,
      pickerStartTime: {
        disabledDate: time => {
          if (isWhiteList()) {
            return false;
          }
          return (
            time.getTime() > new Date(this.discountData.endTime).getTime() ||
            time.getTime() < Date.now() - 8.64e7
          );
        }
      },
      pickerEndTime: {
        disabledDate: time => {
          if (isWhiteList()) {
            return false;
          }
          return (
            time.getTime() <
              new Date(new Date().setHours(0, 0, 0, 0)).getTime() ||
            time.getTime() > new Date(store.state.user.endTime).getTime()
          );
        }
      },
      isAdd: false,
      members: [],
      isSubmit: false,
      buyFlg: 1,
      jumpUrl: "/giftList",
      imgNotUpload: false,
      imgType: 0,
      imgDialogVisible: false,
      showStockNumNullFlg: false,
      checkSkuId: ""
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.hsitoryUrl = from.path;
    });
  },
  watch: {
    "couponData.startTime"(val) {
      let vm = this;
      if (val) {
        this.pickerEndTime = {
          disabledDate(time) {
            if (isWhiteList()) {
              return false;
            }
            return (
              time.getTime() < new Date(val).setHours(0, 0, 0, 0) ||
              time.getTime() > new Date(store.state.user.endTime).getTime()
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
    },
    "couponData.endTime"(val) {
      if (val) {
        this.pickerStartTime = {
          disabledDate: time => {
            if (isWhiteList()) {
              return false;
            }
            return (
              time.getTime() > new Date(this.couponData.endTime).getTime() ||
              time.getTime() < Date.now() - 8.64e7
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
    },
    showStockNumNullFlg() {
      if (this.showStockNumNullFlg) {
      }
    }
  },
  created() {
    //判断默认时间与软件到期时间
    if (
      new Date(store.state.user.endTime).getTime() <
      new Date().getTime() + 2592000000
    ) {
      this.discountData.endTime = store.state.user.endTime;
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
    checkImgDialog(list) {
      this.discountData.mainImg = list;
      this.closeDialog();
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
          api_name: "getMembershipDiscountRuleById",
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
          vm.$set(vm, "discountData", result.data);
          vm.discountData.discountJson = vm.discountData.discountJson
            ? JSON.parse(vm.discountData.discountJson)
            : {
                freqBound: 3,
                perMinNum: 1,
                perMaxNum: 1,
                good: {
                  title: "",
                  wareId: result.data.itemId
                }
              };
          vm.discountData.skus = JSON.parse(vm.discountData.skus);
          vm.discountData.good =
            vm.discountData.discountJson.good || vm.discountData.good;
          vm.buyFlg =
            vm.discountData.discountJson.perMinNum >= 1 &&
            vm.discountData.discountJson.perMaxNum >= 1
              ? 1
              : 0;
          vm.discountData.activityDesc = vm.discountData.activityDesc.replace(
            /<br>/g,
            "\n"
          );
          vm.giftStatus =
            result.data.status == "valid" || result.data.status == "invalid"
              ? true
              : false;
          vm.imgNotUpload = result.data.status == "invalid" ? true : false;
          vm.discountData.mainImg = vm.discountData.mainImg
            ? vm.discountData.mainImg.split(",")
            : [];
          if (vm.discountData.mainImg.length > 0) {
            vm.imgType = 1;
          } else {
            vm.imgType = 0;
            vm.discountData.picUrl = vm.discountData.mainImg;
          }
          let _level = result.data.level.split(",");
          vm.discountData.addCountNum = "1";
          _level.forEach(item => {
            vm.discountData.checkedMembers.push(checkMember[item]);
          });
        },
        error => {
          vm.$message.error(error.message || "获取活动信息失败！");
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
      this.imgDialogVisible = false;
    },
    checkDialog(data) {
      this.dialogVisible = false;
      this.$set(this.discountData, "picUrl", data[0].logo);
      this.$set(this.discountData, "good", data[0]);
      let name = data[0].title.substr(0, 20);
      this.$set(this.discountData, "activityName", name);
      // this.getGoodSkuList();
    },
    validation() {
      let vm = this,
        discountData = clone(vm.discountData),
        isOk = true,
        levelArr = [],
        checkLevel = [],
        skuList = this.$refs.skusTable.getData();
      vm.isSubmit = true;
      let errObj = {};
      try {
        if (!discountData.good.wareId) {
          errObj.msg = "请选择指定商品！";
          throw errObj;
        } else if (!discountData.activityName) {
          errObj.msg = "活动名称不能为空！";
          throw errObj;
        } else if (discountData.activityName.length > 20) {
          errObj.msg = "活动名称最多20个字符！";
          throw errObj;
        } else if (!discountData.discountJson.promoId && this.isZiying) {
          errObj.msg = "促销编码不能为空！";
          throw errObj;
        } else {
          if (vm.imgType == 1) {
            if (!discountData.mainImg || discountData.mainImg.length == 0) {
              this.$message.error("至少需要一张指定图片！");
              return false;
            } else {
              discountData.mainImg = discountData.mainImg.join(",");
            }
          } else {
            discountData.mainImg = discountData.picUrl;
          }
          delete discountData.picUrl;
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
            // else if (!this.checkSkuId) {
            //   errObj.msg = "请选择折扣商品";
            //   throw errObj;
            // }
          } else {
            discountData.discountJson.perMinNum = 0;
            discountData.discountJson.perMaxNum = 0;
          }
          if (discountData.checkedMembers.length) {
            discountData.checkedMembers.forEach(item => {
              levelArr.push(vm.members.indexOf(item));
            });
          }
          if (discountData.activityDesc.length > 120) {
            errObj.msg = "活动介绍不能超过120个字";
            throw errObj;
          }
          //时间检测
          if (
            new Date(discountData.endTime).getTime() <=
            new Date(discountData.startTime).getTime()
          ) {
            errObj.msg = "结束时间不能小于等于上架时间";
            throw errObj;
          } else if (
            new Date(discountData.endTime).getTime() < new Date().getTime()
          ) {
            errObj.msg = "结束时间不能小于当前时间";
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
          }
          discountData.skus = skuList;
          discountData.level = levelArr.sort().join(",");
          delete discountData.status;
          delete discountData.addCountNum;
          discountData.startTime = discountData.startTime
            ? dateFormat(discountData.startTime, "YY-MM-DD HH:MM:SS")
            : "";
          discountData.endTime = discountData.endTime
            ? dateFormat(discountData.endTime, "YY-MM-DD HH:MM:SS")
            : "";
          // 验证完成，进入保存
          this.saveShopDisc(discountData);
        }
      } catch (e) {
        e.msg && this.$message.error(e.msg);
        // if (e.type == "input") {
        //   let dom = $(".el-table__body")
        //     .find("tr")
        //     .eq(e.index);
        //   dom.find("._skuInput").addClass("red");
        //   this.scrollToLocation(dom);
        // }
      }
    },
    saveShopDisc(discountData) {
      if (discountData.id) {
        this.saveGift(discountData);
        return;
      }
      let arr = [],
        _index;
      discountData.skus.forEach((item, index) => {
        // if (this.checkSkuId == item.skuId) {
          discountData.price = item.disPrice;
          arr.push({
            promoPrice: item.finalPrice,
            skuId: item.skuId,
            bindType: 1
          });
        // }
      });
      // discountData.skus = [discountData.skus[_index]];
      let data = {
        // 促销开始时间
        beginTime: discountData.startTime,
        // 促销结束时间
        endTime: discountData.endTime,
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
      };
      discountData.activityDesc = discountData.activityDesc.replace(
        /[\n\r]/g,
        "<br>"
      );
      //拦截关键词
      let _activityDesc = discountData.activityDesc,
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
			ajax({
				api_name: 'addMembershipDiscountRule',
				vm: this,
				data: discountData
			}, (res) => {
				this.createLoading = false;
        this.$message.success(discountData.id ? '活动修改保存成功！':'活动创建成功！');
        if(!discountData.id) {
          point('37977.39408.39475.39478');
        }
				this.$router.push({path: 'promotion'});
			}, (error) => {
				this.hasSubmit = false;
				this.createLoading = false;
				this.$message.error(error.message || (discountData.id ? '活动修改保存失败！':'活动创建失败！'));
			});
		},
    removeRedClass() {
      $("._skuInput").removeClass("red");
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
      this.discountData.activityDesc = `1、优惠限制：${
        this.discountData.discountJson.freqBound == 3
          ? "一个会员只能享受一次专享折扣优惠，第二次购买时恢复原价"
          : "不限优惠次数，活动结束后商品恢复原价"
      }\n2、单次购买上限：${
        this.buyFlg
          ? `单次购买 ${buyNum} 件任意指定sku商品才能享受专享折扣优惠`
          : "不限单次购买数量"
      }\n3、商品折扣在加入购物车后生效`;
    },
    cancelCreate() {
      let _url = this.hsitoryUrl == "/" ? "/integralCenter" : this.hsitoryUrl;
      this.$router.push({ path: _url });
    },
    filterStockNumNull(row, index) {
      let className = "";
      if (row.isDefault || row.stockNum > 0 || this.showStockNumNullFlg) {
        className = "";
      } else {
        className = "disNone";
      }
      return className;
    },
    setConfig() {}
  },
  components: {
    goodsChoose,
    imgDialog,
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
