<template>
  <div class="welfare-box" v-loading="createLoading">
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
      :model="welfareData"
    >
      <el-form-item label="选择指定商品：">
        <span v-if="welfareData.good.title">{{ welfareData.good.title }}</span>
        <el-button
          class="m_l10"
          v-if="!activityStatus"
          type="text"
          @click="dialogVisible = true"
          >{{
            welfareData.good.wareId ? "重新选择" : "选择指定商品"
          }}</el-button
        >
        <p class="shop-msg red" v-if="welfareData.good.wareId">
          ￥ {{ welfareData.good.price }}
          <span style="color: #888;margin-left: 10px;"
            >商品编号: {{ welfareData.good.wareId }}</span
          >
        </p>
        <p class="error-tip red" v-if="isSubmit && !welfareData.good.wareId">
          请选择指定商品！
        </p>
      </el-form-item>
      <el-form-item label="活动名称：">
        <el-input
          class="w300"
          :disabled="activityStatusVal == 'invalid'"
          auto-complete="off"
          v-model="welfareData.activityName"
        ></el-input>
        <span>{{ welfareData.activityName.length }}/20</span>
        <p class="error-tip red" v-if="isSubmit && !welfareData.activityName">
          活动名称不能为空！
        </p>
        <p class="error-tip red" v-if="welfareData.activityName.length > 20">
          活动名称最多20个字符！
        </p>
      </el-form-item>
      <el-form-item label="活动起止时间：">
        <el-date-picker
          v-model="welfareData.startTime"
          :clearable="false"
          :disabled="activityStatusVal != '' && activityStatusVal != 'wait'"
          type="datetime"
          placeholder="选择日期"
          class="row_date"
          :picker-options="pickerStartTime"
        >
        </el-date-picker>
        至
        <el-date-picker
          v-model="welfareData.endTime"
          :clearable="false"
          :disabled="activityStatus"
          type="datetime"
          placeholder="选择日期"
          :picker-options="pickerEndTime"
        >
        </el-date-picker>
        <span class="timeHint"
          >活动有效期不得超过订购有效期<a
            href="http://fw.jd.com/657606.html"
            target="_blank"
            >立即续订</a
          ></span
        >
        <p
          class="error-tip red"
          v-if="
            new Date(welfareData.endTime).getTime() <=
              new Date(welfareData.startTime).getTime()
          "
        >
          下架时间不能小于等于上架时间，请重新选择！
        </p>
      </el-form-item>
      <el-form-item :label="'发起' + labelName + '等级：'">
        <el-checkbox
          :disabled="activityStatus"
          v-model="checkAll"
          @change="handleCheckAllChange"
          >全选</el-checkbox
        >
        <el-checkbox-group
          v-model="checkedMembers"
          @change="handlecheckedMembersChange"
          style="display:inline-block;margin-left:10px;"
        >
          <el-checkbox
            :disabled="activityStatus"
            v-for="member in members"
            :label="member"
            :key="member"
            >{{ member }}</el-checkbox
          >
        </el-checkbox-group>
        <p
          class="error-tip red"
          v-if="!checkedMembers.length && members.length"
        >
          请至少选中一个会员等级！
        </p>
      </el-form-item>
      <el-form-item label="商品折扣设置：">
        <skusTable
          ref="skusTable"
          :skusData="welfareData.discountJson.skuList"
          :goodData="welfareData.good"
          :status="activityStatusVal"
          type="multi"
        />
      </el-form-item>
      <el-form-item label="展示图片设置：">
        <el-radio-group
          v-model="imgType"
          style="vertical-align: text-top;"
          :disabled="activityStatus"
        >
          <el-radio :label="0">
            <span>直接使用商品主图</span>
          </el-radio>
          <el-radio :label="1">
            <span>上传指定图片</span>
            <el-button
              class="m_l10"
              v-if="!activityStatus && imgType == 1"
              type="text"
              @click="imgDialogVisible = true"
              >设置图片</el-button
            >
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="优惠限制：">
        <span>一个会员只能享受一次专享折扣优惠，第二次购买时恢复商品原价</span>
      </el-form-item>
      <el-form-item label="单次购买限制：">
        <span>单次购买1件指定sku商品才能享受专享折扣优惠</span>
      </el-form-item>
      <el-form-item :label="labelName + '人数：'">
        <span>{{ labelName }}人数达到</span>
        <el-input
          v-model="welfareData.people"
          class="w50"
          :disabled="activityStatus"
          @blur="blurInput(welfareData, 'people')"
          auto-complete="off"
        ></el-input>
        <span v-if="welfareParent.welfareType == 1"
          >人后，拼团成员均可享受活动商品折扣</span
        >
        <span v-else-if="welfareParent.welfareType == 2"
          >人后，砍价活动发起者可享受活动商品折扣</span
        >
      </el-form-item>
      <el-form-item :label="'限时' + labelName + '：'">
        <el-radio-group
          v-model="welfareData.timeLimit.switch"
          @change="switchTime()"
          :disabled="activityStatus"
        >
          <el-radio :label="0">不限时</el-radio>
          <el-radio :label="1">
            <span>发起{{ labelName }}后</span>
            <el-input
              @blur="blurInput(welfareData.timeLimit, 'time')"
              v-model="welfareData.timeLimit.time"
              class="w50"
              :disabled="activityStatus"
              auto-complete="off"
            ></el-input>
            <span>小时内有效</span>
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="陌生人拼团：" v-if="welfareParent.welfareType == 1">
        <el-radio-group
          v-model="welfareData.supportStrange"
          style="vertical-align: text-top;"
          :disabled="activityStatus"
        >
          <div class="mb_5">
            <el-radio :label="0">
              <span>不支持陌生人拼团</span>
              <span class="gray ml_5"
                >在拼团详情页面不展示当前已有的拼团任务</span
              >
            </el-radio>
          </div>
          <div class="mb_5">
            <el-radio :label="1">
              <span>支持陌生人拼团</span>
              <span class="gray ml_5"
                >在拼团详情页面展示当前已有的拼团任务，满足拼团条件的会员可参与拼团</span
              >
            </el-radio>
          </div>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="分享链接设置:">
        <div class="inviting-set-content">
          <div class="inviting-set inviting-link-set">
            <span class="lab">邀请链接标题：</span>
            <textarea
              :disabled="activityStatusVal == 'invalid'"
              v-model="welfareData.invitationTitle"
            ></textarea>
            <span class="lab-word"
              >{{ welfareData.invitationTitle.length }}/24</span
            >
            <p
              v-if="!welfareData.invitationTitle"
              ref="errorTip"
              class="error-tip red"
            >
              请设置邀请链接标题！
            </p>
            <p
              v-if="welfareData.invitationTitle.length > 24"
              ref="errorTip"
              class="error-tip red"
            >
              邀请链接标题最多可设置24个字符！
            </p>
          </div>
          <div class="inviting-set inviting-link-set">
            <span class="lab">邀请链接介绍：</span>
            <textarea
              :disabled="activityStatusVal == 'invalid'"
              v-model="welfareData.invitationDesc"
            ></textarea>
            <span class="lab-word"
              >{{ welfareData.invitationDesc.length }}/24</span
            >
            <p
              v-if="welfareData.invitationDesc.length > 24"
              ref="errorTip"
              class="error-tip red"
            >
              邀请链接介绍最多可设置24个字符！
            </p>
          </div>
          <div class="inviting-set inviting-link-set">
            <span class="lab">邀请链接封面：</span>
            <div class="img_content">
              <span
                class="loading"
                v-if="uploadFlg"
                v-loading="uploadFlg"
                style="line-height: 0;"
              ></span>
              <img
                v-if="welfareData.invitationLogo"
                :src="welfareData.invitationLogo"
              />
              <div class="no-img" v-else></div>
              <el-upload
                class="img_box"
                action="/common/picUpload"
                :show-file-list="false"
                :on-success="uploadSuccess"
                :before-upload="uploadBefore"
              >
                <span v-if="!uploadFlg && activityStatusVal != 'invalid'"
                  >上传图片</span
                >
              </el-upload>
              <span class="upload-tip">建议图片尺寸：100*100像素</span>
            </div>
          </div>
        </div>
        <div class="preview-box">
          <div class="preview-one" v-if="welfareData.invitationDesc">
            <p class="preview-title">{{ welfareData.invitationTitle }}</p>
            <div class="preview-content">
              <p>{{ welfareData.invitationDesc }}</p>
              <img
                v-if="welfareData.invitationLogo"
                :src="welfareData.invitationLogo"
                alt=""
              />
              <div class="no-img" v-else></div>
            </div>
          </div>
          <div class="preview-two">
            <div class="preview-content">
              <img
                v-if="welfareData.invitationLogo"
                :src="welfareData.invitationLogo"
                alt=""
              />
              <div class="no-img" v-else></div>
              <p class="preview-title">{{ welfareData.invitationTitle }}</p>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item :label="labelName + '规则:'">
        <el-button size="small" @click="setRules()" class="queryBtn"
          >自动生成</el-button
        >
        <span class="ml_5"
          >应平台要求请使用自动生成的活动规则内容，可自定义添加规则内容</span
        >
      </el-form-item>
      <div
        class="rules"
        ref="editArea"
        contenteditable="true"
        v-if="welfareData.activityDesc"
        v-html="formatActivityDesc(welfareData.activityDesc)"
      ></div>
      <div class="rules" ref="editArea" contenteditable="true" v-else>
        <p>1.活动时间：{{ today }} 至 {{ today30 }}</p>
        <p>2.参与会员：全体会员</p>
        <p>3.一个用户只能享受一次专享折扣优惠，第二次购买时恢复原价</p>
        <p>4.单次购买1件任意指定规格商品才能享受专享折扣优惠</p>
        <p v-if="welfareParent.welfareType == 1">
          5.拼团人数达到{{ welfareData.people }}人后，拼团成员可享受活动商品折扣
        </p>
        <p v-else-if="welfareParent.welfareType == 2">
          5.砍价人数达到{{
            welfareData.people
          }}人后，砍价发起者可享受活动商品折扣
        </p>
        <p>6.{{ labelName }}成功后请及时下单，商品折扣将在活动结束后失效。</p>
      </div>
      <div class="inviting-btn">
        <el-button size="small" class="queryBtn" @click="back()">{{
          activityStatusVal != "invalid" ? "取消" : "返回"
        }}</el-button>
        <el-button
          type="primary"
          v-if="activityStatusVal != 'invalid'"
          size="small"
          @click="validation()"
          >{{ activityId ? "保存活动" : "保存并创建活动" }}</el-button
        >
      </div>
    </el-form>
    <goods-choose
      :selectIdList="[welfareData.good.wareId]"
      type="radio"
      @close="closeDialog"
      @check="checkDialog"
      v-if="dialogVisible"
    ></goods-choose>
    <discount-tip-dialog :url="jumpUrl" ref="discountTip"></discount-tip-dialog>
    <imgDialog
      v-if="imgDialogVisible"
      :imgList="welfareData.mainImg"
      @close="closeDialog"
      @check="checkImgDialog"
    ></imgDialog>
  </div>
</template>

<script>
import formatActivityDesc from "../interaction/util";
import dateFormat from "src/common/dateFormat.js";
import { clone, isWhiteList } from "src/common/public.js";
import ajax from "src/api/index.js";
import goodsChoose from "src/components/goods-choose/goods-choose";
import store from "src/store.js";
// import $ from 'jquery';
import discountTipDialog from "src/components/integral-interaction/discountTip.vue";
import imgDialog from "src/components/img-dialog/img-dialog.vue";
import skusTable from "src/components/skusTable";
export default {
  props: {
    welfareParent: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      labelName: "22",
      activityId: "",
      shopName: "",
      dialogVisible: false,
      labelPosition: "right",
      isSubmit: false,
      activityStatus: false,
      activityStatusVal: "",
      checkAll: true,
      uploadFlg: false,
      createLoading: false,
      checkShopData: {},
      today: dateFormat(new Date().setHours(0, 0, 0, 0), "YY-MM-DD HH:MM:SS"),
      today30: dateFormat(
        new Date(new Date().getTime() + 2592000000).setHours(23, 59, 59, 59),
        "YY-MM-DD HH:MM:SS"
      ),
      welfareData: {
        activityName: "",
        good: {},
        discountJson: {
          checkSkuId: "",
          skuList: [],
          freqBound: 3,
          perMinNum: 1,
          perMaxNum: 1
        },
        startTime: dateFormat(
          new Date().setHours(0, 0, 0, 0),
          "YY-MM-DD HH:MM:SS"
        ),
        endTime: dateFormat(
          new Date(new Date().getTime() + 2592000000).setHours(23, 59, 59, 59),
          "YY-MM-DD HH:MM:SS"
        ),
        people: 2,
        timeLimit: {
          switch: 0,
          time: ""
        },
        supportStrange: 0,
        activityDesc: "",
        invitationTitle: "",
        invitationDesc: "",
        invitationLogo: ""
      },
      pickerStartTime: {
        disabledDate: time => {
          if (isWhiteList()) {
            return false;
          }
          return (
            time.getTime() > new Date(this.welfareData.endTime).getTime() ||
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
      checkedMembers: [],
      members: [],
      memberMap: {
        注册会员: "0",
        一星会员: "1",
        二星会员: "2",
        三星会员: "3",
        四星会员: "4",
        五星会员: "5"
      },
      jumpUrl: "/welfareList",
      imgDialogVisible: false,
      imgType: 0,
      showStockNumNullFlg: false
    };
  },
  watch: {
    "welfareData.startTime"(val) {
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
    "welfareData.endTime"(val) {
      if (val) {
        this.pickerStartTime = {
          disabledDate: time => {
            if (isWhiteList()) {
              return false;
            }
            return (
              time.getTime() > new Date(this.welfareData.endTime).getTime() ||
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
    }
  },
  created() {
    //判断默认时间与软件到期时间
    if (
      new Date(store.state.user.endTime).getTime() <
      new Date().getTime() + 2592000000
    ) {
      this.welfareData.endTime = store.state.user.endTime;
      this.today30 = store.state.user.endTime;
    }
    switch (this.welfareParent.welfareType) {
      case 1:
        this.labelName = "拼团";
        this.welfareData.invitationDesc = "一起来拼团！";
        break;
      case 2:
        this.labelName = "砍价";
        this.welfareData.invitationDesc = "邀请你帮忙砍价~";
        break;
      default:
        break;
    }
    this.activityId = this.$route.query.id;
    this.createLoading = true;
    this.getMemberSet(checkMember => {
      this.getEditMsg(this.activityId, checkMember);
    });
  },
  computed: {},
  methods: {
    formatActivityDesc(value) {
      return formatActivityDesc(value);
    },
    switchTime() {
      if (
        this.welfareData.timeLimit.switch &&
        !this.welfareData.timeLimit.time
      ) {
        this.$set(this.welfareData.timeLimit, "time", 1);
      }
    },
    closeDialog() {
      this.dialogVisible = false;
      this.imgDialogVisible = false;
    },
    checkDialog(data) {
      this.checkShopData = data[0];
      this.dialogVisible = false;
      this.$set(this.welfareData, "invitationLogo", data[0].logo);
      this.$set(this.welfareData, "good", data[0]);
      let name = data[0].title.substr(0, 20);
      this.$set(this.welfareData, "activityName", name);
      this.$set(
        this.welfareData,
        "invitationTitle",
        data[0].title.substr(0, 24)
      );
      // this.getGoodSkuList();
    },
    checkImgDialog(list) {
      this.welfareData.mainImg = list;
      console.log(this.welfareData);
      this.closeDialog();
    },
    // getGoodSkuList(){
    // 	ajax({
    // 		api_name: 'querySkuByWareId',
    // 		data: {
    // 			wareId: this.welfareData.good.wareId
    // 		},
    // 		vm: this
    // 	}, result => {
    // 		result.data.skuList.forEach(item => {
    // 			item.discount = '';
    // 			item.disPrice = '';
    // 			item.finalPrice = '';
    // 		});
    // 		this.welfareData.discountJson.skuList = result.data.skuList;
    // 		this.welfareData.discountJson.checkSkuId = '';
    // 	});
    // },
    handleCheckAllChange(val) {
      if (this.checkAll) {
        this.checkedMembers = this.members;
        this.checkAll = true;
      } else {
        this.checkedMembers = [];
        this.checkAll = false;
      }
    },
    handlecheckedMembersChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.members.length;
    },
    uploadSuccess(file) {
      if (file.result == "100") {
        this.welfareData.invitationLogo = file.data.picUrl;
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
    getEditMsg(id, checkMember) {
      let vm = this,
        _apiName = ["getCollageRuleById", "getBargainRuleById"];
      ajax(
        {
          api_name: _apiName[vm.welfareParent.welfareType - 1],
          data: {
            id: id || ""
          }
        },
        result => {
          let _data = result.data;
          vm.shopName = result.data.shopName;
          vm.createLoading = false;
          if (id) {
            vm.activityStatus = true;
            vm.activityStatusVal = _data.status;

            let _level = [];
            _data.level.split(",").forEach(item => {
              _level.push(checkMember[item - 1]);
            });
            vm.checkedMembers = _level;
            vm.checkAll = _level.length >= 5;

            let _lottoSetting = JSON.parse(_data.lottoSetting)[0];

            _data.good = {
              logo: _lottoSetting.wareLogo,
              price: _lottoSetting.price,
              title: _lottoSetting.shopName.substr(0, 20),
              wareId: _lottoSetting.wareId
            };

            switch (vm.welfareParent.welfareType) {
              case 1:
                _data.skus = JSON.parse(_data.skus);
                _data.people = _data.collagePeopleLimit;
                _data.timeLimit = {
                  switch: _data.collageTimeLimit ? 1 : 0,
                  time: _data.collageTimeLimit || ""
                };
                _data.supportStrange = _data.supportStrange ? 1 : 0;
                break;
              case 2:
                _data.people = _data.numberLowerLimit;
                _data.timeLimit = {
                  switch: _data.timeUpperLimit ? 1 : 0,
                  time: _data.timeUpperLimit || ""
                };
                break;
              default:
                break;
            }
            _data.skus[0].finalPrice = _data.skus[0].promoPrice;
            _data.discountJson = {};
            _data.discountJson.skuList = _data.skus;
            _data.discountJson.checkSkuId = _data.skus[0].skuId;
            _data.mainImg = _data.mainImg || [];
            if (_data.mainImg.length > 0) {
              vm.imgType = 1;
            } else {
              vm.imgType = 0;
            }
            vm.$set(vm, "welfareData", _data);
          }
        },
        error => {
          vm.createLoading = false;
        }
      );
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
            vm.$set(vm, "memberMap", _map);
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
          vm.$set(vm, "members", _arr);
          vm.$set(vm, "checkedMembers", _arr);
          cab && cab(_arr);
        },
        error => {
          this.$message.error(error.message || "获取会员列表失败");
        }
      );
    },
    back() {
      let _url =
        this.welfareParent.hsitoryUrl == "/"
          ? "/interactionCenter"
          : this.welfareParent.hsitoryUrl;
      this.$router.push({ path: _url });
    },
    setRules() {
      let list = "",
        vm = this,
        index = 5,
        rules = [];
      switch (vm.welfareParent.welfareType) {
        case 1:
          rules = [
            "<p>5.拼团人数达到" +
              vm.welfareData.people +
              "人后，拼团成员可享受活动商品折扣<p>"
          ];
          vm.welfareData.timeLimit.switch
            ? rules.push(
                "<p>6.发起拼团后" +
                  vm.welfareData.timeLimit.time +
                  "小时内有效，超时未完成拼团则无效</p>"
              )
            : "";
          break;
        case 2:
          rules = [
            "<p>5.砍价人数达到" +
              vm.welfareData.people +
              "人后，砍价发起者可享受活动商品折扣<p>"
          ];
          vm.welfareData.timeLimit.switch
            ? rules.push(
                "<p>6.发起砍价后" +
                  vm.welfareData.timeLimit.time +
                  "小时内有效，超时未完成砍价则无效</p>"
              )
            : "";
          break;
        default:
          break;
      }
      list += [
        "<p>1.活动时间：" +
          dateFormat(vm.welfareData.startTime, "YY-MM-DD HH:MM:SS") +
          " 至 " +
          dateFormat(vm.welfareData.endTime, "YY-MM-DD HH:MM:SS") +
          "</p>",
        "<p>2.参与会员：" +
          (vm.checkedMembers.length > 5
            ? "全体会员"
            : "仅限" +
              vm.checkedMembers.join("，") +
              "才能发起" +
              vm.labelName +
              "活动") +
          "</p>",
        "<p>3.一个用户只能享受一次专享折扣优惠，第二次购买时恢复原价<p>",
        "<p>4.单次购买1件任意指定规格商品才能享受专享折扣优惠</p>",
        rules.join(""),
        "<p>" +
          (index + rules.length) +
          "." +
          vm.labelName +
          "成功后请及时下单，商品折扣将在活动结束后失效。</p>"
      ].join("");
      vm.$set(vm.welfareData, "activityDesc", list);
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
    createdAct(_param) {
      let vm = this,
        _apiName = ["addCollageRule", "addBargainRule"];
      ajax(
        {
          api_name: _apiName[vm.welfareParent.welfareType - 1],
          data: _param
        },
        result => {
          vm.createLoading = false;
          this.$refs.discountTip.show();
          // vm.$message.success(vm.activityId ? '活动修改并保存成功！': '活动创建成功！');
          // setTimeout(() => {
          // 	vm.$router.push({path: '/welfareList'});
          // }, 1000);
        },
        error => {
          vm.createLoading = false;
          vm.$message.error(
            error.message ||
              (vm.activityId ? "活动修改并保存失败！" : "活动创建失败！")
          );
        }
      );
    },
    validation() {
      let welfareData = clone(this.welfareData),
        skuList = this.$refs.skusTable.getData(),
        errObj = {};
      try {
        if (!welfareData.activityName) {
          errObj.msg = "活动名称不能为空！";
          throw errObj;
        }
        if (welfareData.activityName.length > 20) {
          errObj.msg = "活动名称最多20个字符！";
          throw errObj;
        }
        if (
          new Date(welfareData.endTime).getTime() <=
          new Date(welfareData.startTime).getTime()
        ) {
          errObj.msg = "下架时间不能小于等于上架时间，请重新选择！";
          throw errObj;
        }
        if (!this.checkedMembers.length && this.members.length) {
          errObj.msg = "请至少选中一个会员等级！";
          throw errObj;
        }
        if (!welfareData.invitationTitle) {
          errObj.msg = "请设置邀请链接标题！";
          throw errObj;
        }
        if (welfareData.invitationTitle.length > 24) {
          errObj.msg = "邀请链接标题最多可设置24个字符！";
          throw errObj;
        }
        if (welfareData.invitationDesc.length > 24) {
          errObj.msg = "邀请链接介绍最多可设置24个字符！";
          throw errObj;
        }
        if (this.imgType == 1) {
          if (!welfareData.mainImg || welfareData.mainImg.length == 0) {
            errObj.msg = "至少需要一张指定图片！";
            throw errObj;
          } else {
            welfareData.mainImg = welfareData.mainImg.join(",");
          }
        } else {
          welfareData.mainImg = "";
        }
        //拦截关键词
        let _activityDesc = this.$refs.editArea.innerText,
          sensitive = ["解释", "解释权", "商家所有", "归商家所有"],
          isHasSensitive = false;
        sensitive.forEach(obj => {
          if (_activityDesc.indexOf(obj) != -1) {
            isHasSensitive = true;
          }
        });
        if (isHasSensitive) {
          errObj.msg = "活动规则不合法，请使用系统自动生成规则!";
          throw errObj;
        }
        if (Object.prototype.toString.call(skuList) !== "[object Array]") {
          //如果报错 将错误对象抛出 用于scrollToLocation
          throw skuList;
        }
        welfareData.skuList = skuList;
        welfareData.activityDesc = _activityDesc;
        this.saveAct(welfareData);
      } catch (e) {
        e.msg && this.$message.error(e.msg);
        // if(e.type == 'input') {
        // 	let dom = $('.el-table__body').find('tr').eq(e.index);
        // 	dom.find('._skuInput').addClass('red');
        // 	this.scrollToLocation(dom);
        // }
      }
    },
    saveAct(welfareData) {
      let vm = this,
        param = clone(welfareData);
      vm.isSubmit = true;
      param.startTime = param.startTime
        ? dateFormat(param.startTime, "YY-MM-DD HH:MM:SS")
        : "";
      param.endTime = param.endTime
        ? dateFormat(param.endTime, "YY-MM-DD HH:MM:SS")
        : "";
      //保存商品折扣
      let setDiscountParma = {
        activityName: "拼团",
        beginTime: param.startTime,
        endTime: param.endTime,
        perMaxNum: 1,
        perMinNum: 1,
        freqBound: 3
      };
      //会员等级
      let level = [];
      this.checkedMembers.forEach(item => {
        level.push(vm.memberMap[item]);
      });
      level.length == 6 ? level.unshift("-2") : "";
      let _welfareType = this.welfareParent.welfareType;
      //传参
      let _param = {
        activityDesc: param.activityDesc,
        activityName: param.activityName,
        startTime: param.startTime,
        endTime: param.endTime,
        invitationDesc: param.invitationDesc,
        invitationLogo: param.invitationLogo,
        invitationTitle: param.invitationTitle,
        level: level.join(","),
        lottoSetting: param.lottoSetting,
        skus: param.skus,
        mainImg: param.mainImg
      };
      switch (_welfareType) {
        case 1:
          _param.collagePeopleLimit = param.people;
          _param.collageTimeLimit = param.timeLimit.switch
            ? param.timeLimit.time
            : 0;
          _param.supportStrange = param.supportStrange ? true : false;
          break;
        case 2:
          _param.numberLowerLimit = param.people;
          _param.timeUpperLimit = param.timeLimit.switch
            ? param.timeLimit.time
            : 0;
          break;
        default:
          break;
      }
      if (this.activityId) {
        _param.id = this.activityId;
        this.createdAct(_param);
      } else {
        //奖项设置
        let _skus = [],
          _lottoSetting = [];
        switch (_welfareType) {
          case 1:
          case 2:
            param.skuList.forEach(item => {
              //不知道以前是什么逻辑 为什么要重新生成一个列表
              _skus.push({
                skuId: item.skuId,
                promoPrice: item.finalPrice,
                skuName: item.skuName,
                jdPrice: item.jdPrice,
                wareLogo: vm.welfareData.invitationLogo,
                stockNum:item.stockNum,
                discount:item.discount,
                disPrice:item.disPrice
              });
              _lottoSetting.push({
                type: "dynamic_wareDiscount",
                name: "商品折扣",
                shopName: vm.checkShopData.title,
                discount: item.finalPrice,
                price: item.jdPrice,
                skuLen: vm.welfareData.discountJson.skuList.length - 1,
                wareId: vm.checkShopData.wareId,
                wareLogo: vm.welfareData.invitationLogo,
                rewardTypeValue: ""
              });
              setDiscountParma.promotionSkus = [
                {
                  skuId: item.skuId,
                  promoPrice: item.finalPrice,
                  bindType: 1,
                  jdPrice: item.jdPrice
                }
              ];
            });
            break;
          default:
            break;
        }
        _param.skus = _skus;
        _param.lottoSetting = _lottoSetting;
        ajax(
          {
            api_name: "createUnitPromotionWrite",
            data: setDiscountParma
          },
          result => {
            _param.lottoSetting[0].rewardTypeValue = result.data.result;
            vm.createdAct(_param);
          },
          error => {
            vm.createLoading = false;
            vm.$message.error(error.message || "创建商品折扣失败！");
          }
        );
      }
    },
    blurInput(item, child) {
      let vm = this,
        obj = item[child],
        _default = child == "people" ? "2" : "1";
      if (!obj) {
        this.$set(item, child, _default);
        return;
      } else if (
        isNaN(Number(obj)) ||
        /\./.test(obj) ||
        /\+/.test(obj) ||
        Number(obj) <= 0
      ) {
        this.$message.error("只能输入正整数！");
        this.$set(item, child, _default);
        return;
      }
      if (child == "people") {
        if (Number(obj) > 100) {
          this.$message.error(vm.labelName + "人数最大上限100人！");
          this.$set(item, child, "100");
          return;
        } else if (Number(obj) < 2) {
          this.$message.error(vm.labelName + "人数至少2人！");
          this.$set(item, child, "2");
          return;
        }
      }
    },
    // computedPrice(index, name, json) {
    //         let _obj = this.welfareData.discountJson.skuList[index],
    //            _price = '',_yh = '', condition = '',
    //            _error = '',_discount = '',checkNum = '',
    // 	   _checkZero = '';
    //         if(name == 'discount') {
    //             condition = Number(_obj.discount > 10);
    //             _error = '只能输入正数，且折扣值不能大于10！';
    //             checkNum = _obj.discount;
    //             _checkZero = Number(checkNum < 0);
    //         }else if(name == 'disPrice') {
    //             condition = Number(_obj.disPrice > _obj.jdPrice);
    //             _error = '只能输入正数，且优惠值不能大于原价！';
    //             checkNum = _obj.disPrice;
    //             _checkZero = Number(checkNum < 0);
    //         }
    //         if(!checkNum) {
    //              return false;
    //         }else if(isNaN(Number(checkNum)) || /\+/.test(checkNum) || _checkZero || condition) {
    //              this.$message.error(_error);
    //              this.$set(_obj,'disPrice', '');
    //              this.$set(_obj,'finalPrice', '');
    //              this.$set(_obj,'discount', '');
    //              return false;
    //         };
    //         switch (name) {
    //             case 'discount':
    //                 this.welfareData.discountJson.skuList.forEach((item,_index) => {
    //                     if(index == _index) {
    //                         item.discount = _obj.discount || 10;
    //                         _obj = item;
    //                         _yh = (10 - _obj.discount) * 0.1 * _obj.jdPrice;
    //                         _price = _obj.jdPrice *  (_obj.discount * 0.1);
    //                         _yh = _yh.toFixed(2);
    //                         this.$set(_obj,'disPrice',_yh);
    //                         this.$set(_obj,'finalPrice',_price.toFixed(2));
    //                     }
    //                 });
    //                 break;
    //             case 'disPrice':
    //                 this.welfareData.discountJson.skuList.forEach((item,_index) => {
    //                     if(index == _index) {
    //                         item.disPrice = _obj.disPrice;
    //                         _obj = item;
    //                         _discount = (1 - _obj.disPrice / _obj.jdPrice) * 10;
    //                         _price = _obj.jdPrice - _obj.disPrice;
    //                         _discount =  _discount.toFixed(3).slice(0,-1)
    //                         this.$set(_obj,'discount',_discount);
    //                         this.$set(_obj,'finalPrice',_price.toFixed(2));
    //                     }
    //                 });
    //                 break;
    //             default:
    //                 break;
    // 	};
    // 	this.welfareData.discountJson.checkSkuId = json.skuId;
    // },
    filterStockNumNull(row, index) {
      let className = "";
      //库存>0 || 开关显示sku=0
      if (row.isDefault || row.stockNum > 0 || this.showStockNumNullFlg) {
        className = "";
      } else {
        className = "disNone";
      }
      return className;
    }
  },
  components: {
    goodsChoose,
    discountTipDialog,
    imgDialog,
    skusTable
  }
};
</script>

<style lang="less">
.welfare-box {
  table {
    .el-input {
      line-height: normal;
    }
  }
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
.welfare-box {
  padding: 20px 0 50px 20px;
  box-sizing: border-box;
  .tips {
    border: 1px solid rgb(251, 225, 185);
    padding: 10px 22px;
    background: rgb(254, 249, 241);
    width: 90%;
    a {
      margin-left: 20px;
      color: #20a0ff;
    }
  }
  .ml_5 {
    margin-left: 5px;
  }
  .mb_5 {
    margin-bottom: 5px;
  }
  .ml_10 {
    margin-left: 10px;
  }
  .v-bottom {
    vertical-align: bottom;
  }
  .shop-msg,
  .error-tip {
    line-height: 14px;
    font-size: 12px;
    margin-top: 3px;
  }
  .gray {
    color: #999;
  }
  .inviting-set-content {
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
        color: #3089de;
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
        content: "";
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
  .img_content {
    position: relative;
    .no-img {
      width: 100px;
      height: 100px;
      background: rgba(0, 0, 0, 0.4);
      display: inline-block;
    }
    img {
      width: 100px;
      height: 100px;
      background: rgba(0, 0, 0, 0.4);
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
        color: #3089de;
      }
    }
    .upload-tip {
      position: absolute;
      bottom: 6px;
      left: 113px;
    }
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
      .no-img {
        width: 100px;
        height: 100px;
        background: rgba(0, 0, 0, 0.4);
        display: inline-block;
        vertical-align: top;
        float: right;
      }
      img {
        width: 100px;
        height: 100px;
        display: inline-block;
        vertical-align: top;
        float: right;
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
      .no-img {
        width: 100px;
        height: 100px;
        background: rgba(0, 0, 0, 0.4);
        position: absolute;
        top: 0px;
        left: 0px;
      }
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
.timeHint {
  color: #888;
  font-size: 14px;
  margin-left: 10px;
  a {
    margin-left: 20px;
    color: #20a0ff;
  }
}
</style>
