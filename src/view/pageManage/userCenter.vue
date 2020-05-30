<template>
  <div class="m-content" v-loading="fullscreenLoading">
    <div class="m-content-main main_height">
      <div class="phone_page" ref="phonePage">
        <user-mobile
          ref="userMobile"
          @checkActiveData="checkActiveData"
          @moduleDel="moduleDel"
          @moduleUp="moduleUp"
          @moduleDown="moduleDown"
          @addModule="addModule"
          @showModuleAddFn="showModuleAddFn"
          @updatePoint="updatePoint"
          :showOper="true"
          :showModuleAddBtn="showModuleAddBtn"
          :quickList="quickList"
          :privileges="privileges"
          :consultMsg="consultMsg"
          :data="data"
        >
        </user-mobile>
        <!-- <div class="phone_page_btn">
                    <el-button type="primary" class="blueBtn" data-name="showAddModule" @click="addModule('picUrl')">添加图片组件</el-button>
                </div> -->
        <div class="phone_page_box">
          <span class="phone_page_box_label">添加图片组件</span>
          <ul>
            <li @click="addModule('picUrl')">
              <div class="one">
                <span></span>
              </div>
              <label>单列图片</label>
            </li>
            <li @click="addModule('picUrl', 2)">
              <div class="two">
                <span></span>
                <span></span>
              </div>
              <label>双列图片</label>
            </li>
            <li @click="addModule('picUrl', 3)">
              <div class="three">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <label>三列图片</label>
            </li>
            <li @click="addHotPoint()">
              <div class="four">
                <div>
                  <span></span>
                  <span></span>
                </div>
                <span></span>
                <span></span>
              </div>
              <label>自定义切图</label>
            </li>
          </ul>
        </div>
      </div>
      <div class="control_container" ref="controlPage">
        <!-- <page-link :url="`https://wdkj-isv.isvjcloud.com/?href=user/userCenter&shopId=${$store.state.user.shopId}&sellerId=${$store.state.user.venderId}`" title="会员中心预览" name="会员中心"></page-link> -->
        <el-card class="cardItem">
          <div class="cardItemTitle">系统默认会员卡</div>
          <div class="cardItemCont">
            <div class="cardItemContTop">
              <span>会员卡背景图片</span>
            </div>
            <div class="cardItemContVal">
              <div class="center">
                <el-upload
                  action="/common/picUpload"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :on-error="handleAvatarError"
                  :before-upload="beforeAvatarUpload"
                  v-loading="defaultUploadFlg"
                >
                  <div class="upload_box">
                    <img
                      :src="data.memberCenter.backgroundPicUrl"
                      alt=""
                      v-if="data.memberCenter.backgroundPicUrl"
                    />
                    <div v-else class="noImg"><span>+</span>上传图片</div>
                  </div>
                </el-upload>
              </div>
              <span style="font-size: 12px;color: #999;"
                >建议尺寸：670*330px</span
              >
              <span style="font-size: 12px;color: #999;">图片不能超过1.5M</span>
            </div>
          </div>
          <div class="cardItemFooter">系统默认会员卡</div>
        </el-card>
        <el-card class="cardItem" style="margin-top: 20px;">
          <div class="cardItemTitle">快捷入口设置</div>
          <div class="cardItemCont" style="border-bottom: none;">
            <ul>
              <li class="quick_item">
                <span class="quick_label">会员权益</span>
                <el-radio-group
                  v-model="privileges.show"
                  class="quick_item_radio"
                >
                  <el-radio :label="true">展示</el-radio>
                  <el-radio :label="false">不展示</el-radio>
                </el-radio-group>
              </li>
              <li
                class="quick_item"
                v-for="(item, index) in quickList"
                :key="'quickList_' + index"
              >
                <span class="quick_label">{{ quickMap[item.key] }}</span>
                <el-radio-group v-model="item.show" class="quick_item_radio">
                  <el-radio :label="true">展示</el-radio>
                  <el-radio :label="false">不展示</el-radio>
                </el-radio-group>
                <el-button
                  type="text"
                  @click="move('down', index, item, 'quickList')"
                  v-if="index < quickList.length - 1"
                  >下移</el-button
                >
                <el-button
                  type="text"
                  @click="move('up', index, item, 'quickList')"
                  v-if="index > 0"
                  >上移</el-button
                >
              </li>
            </ul>
          </div>
        </el-card>
        <!-- <coupons-temp :data="currentAcitveData"></coupons-temp> -->
        <img-upload-more
          @uploadSet="uploadSet"
          :index="activeIndex"
          :showBottom="false"
          :dataArr="currentAcitveData.picUrls"
          v-if="
            !currentAcitveData.pointArr &&
              currentAcitveData.picUrls &&
              currentAcitveData.picUrls.length > 0
          "
          @checkImgLink="checkImgLink"
        ></img-upload-more>
        <img-hot-point
          @uploadSet="uploadSet"
          :index="activeIndex"
          :showBottom="false"
          :currentData="currentAcitveData"
          v-else-if="
            currentAcitveData.pointArr && currentAcitveData.pointArr.length > 0
          "
          @checkPointData="checkPointData"
        ></img-hot-point>
        <img-upload
          :showBottom="false"
          :data="currentAcitveData.bannerUrls[0]"
          v-if="currentAcitveData.type == 'banner'"
          @checkImgLink="checkImgLink"
        ></img-upload>
      </div>
      <div style="text-align: center;margin-top: 20px;">
        <el-button type="primary" @click="savePage">{{
          userCenterShow ? "保存页面" : "保存页面并发布至店铺首页"
        }}</el-button>
        <!-- <span style="margin-left: 10px;color: #999;">请<a target="_blank" href="https://dd2-web.jd.com/pop/MTAzMTQwMDA" style="color: #20a0ff;">联系客服</a>将页面配置到店铺首页</span> -->
      </div>
    </div>
  </div>
</template>

<script>
// import $ from 'jquery';
import http from "src/api/index.js";
import { clone } from "src/common/public.js";
import defaultAvatar from "src/assets/images/defaultAvatar.jpg";
import userMobile from "src/components/userMobile/userMobile";
import pageLink from "src/components/pageLink/pageLink";
import couponsTemp from "src/components/coupons/coupons";
import imgUpload from "src/components/imgUpload/imgUploadMore";
import imgUploadMore from "src/components/imgUpload/imgUploadMore";
import imgHotPoint from "src/components/imgUpload/imgHotPoint";
import { point } from "src/common/point.js";
export default {
  data() {
    return {
      data: {
        userInfo: {},
        memberCenter: {
          bannerUrls: [{}]
        },
        memberCardInfo: {
          memberCenterColor: "#e0b971"
        }
      },
      dialogTableVisible: false,
      dialogQrcodeVisible: false,
      pageData: {
        pageSize: 5,
        pageTotal: 20,
        pageNo: 1
      },
      couponsList: [],
      couponsIdList: [],
      currentAcitveData: {},
      showModuleAddBtn: false,
      qrcode: "",
      clipboard: {},
      activeIndex: 0,
      fullscreenLoading: true,
      userCenterShow: false,
      defaultBgData: {},
      defaultUploadFlg: false,
      quickMap: {
        hudong: "热门互动",
        integral: "积分兑换",
        welfare: "会员福利",
        promotion: "会员专享价"
      },
      quickList: [
        {
          show: true,
          key: "hudong"
        },
        {
          show: true,
          key: "integral"
        },
        {
          show: true,
          key: "welfare"
        },
        {
          show: true,
          key: "promotion"
        }
      ],
      privileges: {
        show: true,
        key: "privileges"
      },
      consultMsg: {}
    };
  },
  created() {
    point('37977.39409.39480')
  },
  mounted() {
    let vm = this;
    http(
      {
        api_name: "memberCenterQuery",
        vm: this,
        data: {}
      },
      result => {
        vm.data = result.data;
        vm.userCenterShow = vm.data.memberCenter.isPublish;
        this.data.userInfo = {
          userName: "MarkGavin",
          avatar: defaultAvatar,
          integralNumber: "1,234",
          level: "铜牌会员"
        };
        this.data.memberCardInfo = {
          memberCenterColor: "#e0b971"
        };
        try {
          this.changeDataOrder();
          this.getVipCardList();
          this.queryMemberCentersConfig();
          this.$nextTick(() => {
            this.fullscreenLoading = false;
          });
        } catch (e) {
          console.error(e);
        }
      },
      result => {
        console.error(result);
      }
    );
  },
  methods: {
    uploadSet(val) {
      this.fullscreenLoading = val;
    },
    changeDataOrder() {
      //排序
      let data = clone(this.data);
      data.moduleList = [];
      function eachPushData(type) {
        data.memberCenter[type].sort((a, b) => {
          return a.orderNum - b.orderNum;
        });
        //  手动更改  序号
        data.memberCenter[type].forEach((item, index) => {
          item.orderNum = index;
        });
        data.moduleList = data.memberCenter[type];
      }
      eachPushData("picUrlModules");
      this.data = data;
    },
    isValidURL(url) {
      if (url) {
        if (
          !/\.jd\.com/.test(url) &&
          !/\.isvjcloud\.com/.test(url) &&
          !/\.360buyimg\.com/.test(url)
        ) {
          this.$message({
            message: "请输入正确的京东平台链接地址",
            type: "warning"
          });
          return false;
        } else {
          return true;
        }
      }
    },
    handleAvatarSuccess(file) {
      this.defaultUploadFlg = false;
      if (file.result != 100) {
        this.$message.error(file.message);
        return;
      }
      this.defaultBgData.data.memberCardBgUrl = this.data.memberCenter.backgroundPicUrl =
        file.data.picUrl;
      this.vipCardCheckEdit(this.defaultBgData);
    },
    handleAvatarError() {
      this.$message.error("图片上传失败，请重新上传");
      this.defaultUploadFlg = false;
    },
    beforeAvatarUpload(file) {
      const isIMAGE = /image\/\w+/.test(file.type);
      const isLt2M = file.size / 1024 / 1024 < 1.5;

      if (!isIMAGE) {
        this.$message.error("上传图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 1.5MB!");
      }
      if (isIMAGE && isLt2M) {
        this.defaultUploadFlg = true;
      }
      return isIMAGE && isLt2M;
    },
    checkActiveData(data, index) {
      this.currentAcitveData = data;
      this.activeIndex = index;
      this.$refs.userMobile.updateActive(index);
    },
    savePage() {
      let vm = this;
      let data = clone(this.data.memberCenter);
      //图片重新排序
      data["picUrlModules"].forEach((item, index) => {
        item.orderNum = index;
      });
      try {
        this.data.moduleList.forEach((modules, index) => {
          if (modules.picUrls && modules.picUrls.length > 0) {
            modules.picUrls.forEach(picurl => {
              if (!picurl.imgsrc) {
                vm.activeIndex = index;
                vm.currentAcitveData = modules;
                vm.scrollToError(index);
                throw "请上传图片!";
              }
              if (picurl.redirectUrl) {
                if (!this.isValidURL(picurl.redirectUrl)) {
                  throw "图片链接地址错误";
                }
              }
            });
          }
          if (modules.pointArr && modules.pointArr.length > 0) {
            modules.pointArr.forEach(point => {
              if (!point.url) {
                vm.activeIndex = index;
                vm.currentAcitveData = modules;
                vm.scrollToError(index);
                throw "请设置热点链接！";
              }
            });
          }
        });
        for (let i in data) {
          if (Array.isArray(data[i])) {
            data[i] = JSON.stringify(data[i]);
          }
        }
        this.saveMemberCentersConfig(() => {
          http(
            {
              api_name: "memberCenterEdit",
              vm: this,
              data: data
            },
            result => {
              if (!this.userCenterShow) {
                this.pubUserCenter();
              } else {
                vm.$message({
                  message: "保存成功",
                  type: "success"
                });
                setTimeout(() => {
                  this.$router.push({
                    path: "/userPages"
                  });
                }, 1200);
              }
            }
          );
        });
      } catch (e) {
        vm.$message({
          message: e,
          type: "error"
        });
      }
    },
    pubUserCenter() {
      let vm = this;
      http(
        {
          api_name: "changePublishStatus",
          data: {
            isPublish: true,
            check: false
          },
          vm: this
        },
        result => {
          this.userCenterShow = true;
          this.$message({
            message: "保存并发布成功",
            type: "success",
            onClose() {
              vm.$router.push({
                path: "/userPages"
              });
            }
          });
        }
      );
    },
    addModule(type, picNum) {
      let _arr = [{ picUrl: "", redirectUrl: "" }];
      if (type == "picUrl" && picNum && picNum > 1) {
        for (let i = 1; i < picNum; i++) {
          _arr.push({ picUrl: "", redirectUrl: "" });
        }
      }
      this.data.memberCenter[type + "Modules"].push({
        [type + "s"]: type == "picUrl" ? _arr : [],
        orderNum: this.data.moduleList.length,
        type: type
      });
      this.showModuleAddBtn = false;
      this.changeDataOrder();
      this.checkActiveData(
        this.data.moduleList[this.data.moduleList.length - 1],
        this.data.moduleList.length - 1
      );
      setTimeout(() => {
        this.scrollToLocation();
      }, 0);
    },
    addHotPoint() {
      let _arr = [{ picUrl: "" }];
      let pointArr = [
        {
          url: "",
          width: 50,
          height: 50,
          left: 140,
          top: 50
        }
      ];
      this.data.memberCenter.picUrlModules.push({
        picUrls: _arr,
        pointArr: pointArr,
        orderNum: this.data.moduleList.length,
        type: "hotPoint"
      });
      this.showModuleAddBtn = false;
      this.changeDataOrder();
      this.checkActiveData(
        this.data.moduleList[this.data.moduleList.length - 1],
        this.data.moduleList.length - 1
      );
      setTimeout(() => {
        this.scrollToLocation();
      }, 0);
    },
    scrollToLocation() {
      var mainContainer = $("#userCenter .userCenterWarp"),
        scrollToContainer = mainContainer.find(".page_module_list:last");
      mainContainer.animate(
        {
          scrollTop:
            scrollToContainer.offset().top -
            mainContainer.offset().top +
            mainContainer.scrollTop()
        },
        1000
      );
    },
    scrollToError(index) {
      var mainContainer = $("#userCenter .userCenterWarp"),
        scrollToContainer = $(mainContainer.find(".page_module_list")[index]);
      mainContainer.animate(
        {
          scrollTop:
            scrollToContainer.offset().top -
            mainContainer.offset().top +
            mainContainer.scrollTop()
        },
        1000
      );
    },
    moduleUp(index) {
      let data = this.data.memberCenter["picUrlModules"].splice(index, 1)[0];
      this.data.memberCenter["picUrlModules"].splice(index - 1, 0, data);
    },
    moduleDown(index) {
      let data = this.data.memberCenter["picUrlModules"].splice(index, 1)[0];
      this.data.memberCenter["picUrlModules"].splice(index + 1, 0, data);
    },
    moduleDel(index, type) {
      if (type == "module") {
        this.currentAcitveData = {};
        let data = this.data.moduleList.splice(index, 1)[0];
        if (data.newUserCoupons) {
          deleObjectArray.call(this, "newUserCouponModules", data);
        } else if (data.coupons) {
          deleObjectArray.call(this, "couponModules", data);
        } else if (data.picUrls) {
          deleObjectArray.call(this, "picUrlModules", data);
        }
      } else if (type == "banner") {
        this.data.memberCenter.bannerUrls = [];
      }
      function deleObjectArray(type, data) {
        this.data.memberCenter[type].forEach((array, i) => {
          if (array.orderNum == data.orderNum) {
            let oldData = this.data.memberCenter[type].splice(i, 1);
            return;
          }
        });
      }
    },
    showModuleAddFn() {
      this.showModuleAddBtn = true;
      this.$nextTick(() => {
        let h =
          $("#userCenterWarp").height() -
          $("#userCenter .userCenterWarp").height();
        $("#userCenter .userCenterWarp").animate({ scrollTop: h }, 200);
      });
    },
    checkPointData(data, index, isAgain) {
      this.$set(this.currentAcitveData, data);
      let imgData = data.picUrls[0];
      this.consultMsg = imgData.consult ? imgData : this.consultMsg;
      if (isAgain) {
        let consultSize = vm.consultMsg.height / vm.consultMsg.width;
        this.currentAcitveData.picUrls.forEach(item => {
          if (!item.consult) {
            let vmSize = item.height / item.width;
            //判断是双列还是三列
            let _w = 0;
            if (vm.currentAcitveData.picUrls.length == 2) {
              _w = 164;
            } else if (vm.currentAcitveData.picUrls.length == 3) {
              _w = 105;
            }
            //情况B，等高裁宽
            if (consultSize > vmSize) {
              let _h = vm.consultMsg.height;
              vm.$set(item, "width", parseInt((_h / item.height) * item.width));
              vm.$set(item, "height", _h);
              vm.$set(item, "consultHeight", _h);
            } else {
              //情况A，等宽裁高
              vm.$set(
                item,
                "height",
                parseInt((_w / item.width) * item.height)
              );
              vm.$set(
                item,
                "consultHeight",
                parseInt((_w / vm.consultMsg.width) * vm.consultMsg.height)
              );
              vm.$set(item, "width", _w);
            }
          }
        });
      }
    },
    updatePoint(data, index) {
      let _data = this.currentAcitveData;
      //再次编辑时 点击浮层会报错
      if (!_data.pointArr) return;
      let point = _data.pointArr[index];
      point = Object.assign(point, data);
      this.$set(this.currentAcitveData, data);
    },
    checkImgLink(data, index, isAgain) {
      let vm = this;
      if (this.currentAcitveData.type != "banner") {
        // this.currentAcitveData.picUrls[0] = data;
        this.$set(this.currentAcitveData.picUrls, index, data);
        this.consultMsg = data.consult ? data : this.consultMsg;
        //重新按照参照物进行等比计算
        if (isAgain) {
          let consultSize = vm.consultMsg.height / vm.consultMsg.width;
          this.currentAcitveData.picUrls.forEach(item => {
            if (!item.consult) {
              let vmSize = item.height / item.width;
              //判断是双列还是三列
              let _w = 0;
              if (vm.currentAcitveData.picUrls.length == 2) {
                _w = 164;
              } else if (vm.currentAcitveData.picUrls.length == 3) {
                _w = 105;
              }
              //情况B，等高裁宽
              if (consultSize > vmSize) {
                let _h = vm.consultMsg.height;
                vm.$set(
                  item,
                  "width",
                  parseInt((_h / item.height) * item.width)
                );
                vm.$set(item, "height", _h);
                vm.$set(item, "consultHeight", _h);
              } else {
                //情况A，等宽裁高
                vm.$set(
                  item,
                  "height",
                  parseInt((_w / item.width) * item.height)
                );
                vm.$set(
                  item,
                  "consultHeight",
                  parseInt((_w / vm.consultMsg.width) * vm.consultMsg.height)
                );
                vm.$set(item, "width", _w);
              }
            }
          });
        }
      } else {
        // this.currentAcitveData.bannerUrls[0] = data;
        this.$set(this.currentAcitveData.bannerUrls, 0, data);
      }
    },
    /* 获取会员卡列表，只要第一个默认的 */
    getVipCardList() {
      http(
        {
          api_name: "getVipCardList",
          data: {
            memberPrivilegeType: "MEMBER_CARD"
          },
          vm: this
        },
        result => {
          this.data.memberCenter.backgroundPicUrl =
            result.data.resultList[0].data.memberCardBgUrl;
          this.defaultBgData = result.data.resultList[0];
        },
        result => {
          console.error(result);
        }
      );
    },
    /* 保存默认会员卡 */
    vipCardCheckEdit(item) {
      let data = clone(item);
      data.data = JSON.stringify(data.data);
      http(
        {
          api_name: "saveVipCardData",
          vm: this,
          data: data
        },
        result => {
          this.getVipCardList();
        }
      );
    },
    move(type, index, row, key) {
      let data = this[key].splice(index, 1)[0];
      if (type == "down") {
        this[key].splice(index + 1, 0, data);
      } else {
        this[key].splice(index - 1, 0, data);
      }
    },
    queryMemberCentersConfig() {
      let vm = this;
      http(
        {
          api_name: "queryMemberCentersConfig",
          vm: this,
          data: {}
        },
        result => {
          if (result.data.keyboard) {
            if (typeof result.data.keyboard == "string") {
              result.data.keyboard = JSON.parse(result.data.keyboard);
              let privileges = result.data.keyboard.splice(0, 1)[0];
              vm.privileges = privileges;
              if (result.data.keyboard.length) {
                vm.quickList = result.data.keyboard;
                let _hasPromotion = false;
                vm.quickList.forEach(item => {
                  if (item.key == "promotion") {
                    _hasPromotion = true;
                  }
                });
                if (!_hasPromotion) {
                  vm.quickList.push({
                    show: true,
                    key: "promotion"
                  });
                }
              }
            }
          }
        }
      );
    },
    saveMemberCentersConfig(cb) {
      let vm = this;
      let keyboard = [vm.privileges].concat(clone(vm.quickList));
      http(
        {
          api_name: "saveMemberCentersConfig",
          vm: this,
          data: {
            keyboard: JSON.stringify(keyboard)
          }
        },
        result => {
          cb && cb();
        }
      );
    }
  },
  components: {
    userMobile,
    pageLink,
    couponsTemp,
    imgUpload,
    imgUploadMore,
    imgHotPoint
  }
};
</script>

<style lang="less" scoped>
.m-content-main {
  height: 100%;
  background: #fff;
  padding: 20px;
  box-sizing: border-box;
  padding-bottom: 50px;
}
.phone_page {
  display: inline-block;
  width: 375px;
  border-radius: 5px;
  background: #fff;
  vertical-align: top;
  .phone_page_btn {
    text-align: center;
    margin-top: 20px;
    .blueBtn {
      border: 1px solid #3a9af6;
      background: #fff;
      color: #3a9af6;
      span {
        color: #3a9af6;
      }
    }
  }
  .phone_page_box {
    margin-top: 20px;
    // padding: 15px 20px 20px 20px;
    padding: 12px;
    background: #ffffff;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    .phone_page_box_label {
      margin-bottom: 12px;
      display: block;
    }
    ul {
      font-size: 0;
      padding: 0;
      li {
        width: 168px;
        height: 80px;
        display: inline-block;
        background: #e4f0fd;
        border-radius: 4px;
        font-size: 14px;
        vertical-align: middle;
        text-align: center;
        cursor: pointer;
        box-sizing: border-box;
        &:nth-child(odd) {
          margin-right: 12px;
        }
        &:hover {
          color: #219fff;
        }
        label {
          cursor: pointer;
        }
        &:last-child {
          margin-right: 0;
        }
        div {
          text-align: center;
          span {
            display: inline-block;
            background: #c7e7ff;
            border-radius: 2px;
          }
          &.one {
            margin-top: 23px;
            span {
              width: 28px;
              height: 18px;
            }
          }
          &.two {
            margin-top: 25px;
            span {
              width: 20px;
              height: 14px;
            }
          }
          &.three {
            margin-top: 25px;
            span {
              width: 13px;
              height: 13px;
            }
          }
          &.four {
            margin-top: 13px;
            div {
              span {
                &:nth-child(2) {
                  background: transparent;
                }
              }
            }
            span {
              width: 14px;
              height: 14px;
              border: 1px solid #c7e7ff;
            }
          }
        }
      }
    }
  }
}
.control_container {
  display: inline-block;
  width: 600px;
  min-height: 667px;
  vertical-align: top;
  margin-left: 20px;
  .module_control {
    border: 1px solid #e6e6e6;
    padding: 12px;
    border-radius: 4px;
    background: #fafafa;
    color: #666;
    margin-top: 15px;
    .module_title {
      border-bottom: 1px solid #f0f0f0;
      font-size: 12px;
      padding-bottom: 5px;
      overflow: hidden;
      .moduke_title_hint {
        display: inline-block;
      }
    }
    .module_content {
      padding: 10px 0;
      font-size: 0;
      .module_imgs_box {
        width: 125px;
        height: 60px;
        border-radius: 5px;
        overflow: hidden;
        background: #ccc;
        display: inline-block;
        color: #333;
        text-align: center;
        line-height: 80px;
        vertical-align: bottom;
        cursor: pointer;
        position: relative;
        font-size: 14px;
        img {
          width: 100%;
          height: 100%;
        }
        .noImg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          text-align: center;
          line-height: 60px;
          color: #fff;
          padding-left: 20px;
          span {
            display: inline-block;
            transform: scaleY(0.9);
            font-size: 20px;
            margin-right: 5px;
            position: absolute;
            left: 30px;
          }
        }
      }
      .module_imgs_hint {
        display: inline-block;
        vertical-align: bottom;
        margin-left: 5px;
        font-size: 14px;
      }
      .module_imgs_input {
        margin-top: 12px;
        p {
          margin-bottom: 12px;
          color: #666;
          font-size: 12px;
        }
        input {
          width: 379px;
          background: rgba(255, 255, 255, 1);
          border: 1px solid #e6e6e6;
        }
      }
      .module_img_link {
        font-size: 14px;
        p {
          line-height: 2.5;
        }
        input {
          display: inline-block;
          width: 435px;
          height: 30px;
          line-height: 30px;
          padding-left: 12px;
          box-sizing: border-box;
          border: 1px solid #ccc;
          background: #fff;
          border-radius: 4px;
          color: #333;
        }
      }
    }
  }
}
.cardItem {
  color: #666;
  font-size: 12px;
  width: 555px;
  .cardItemTitle {
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 10px;
    color: #666;
  }
  .cardItemCont {
    border-bottom: 1px solid #f0f0f0;
    font-size: 0;
    padding: 10px 0;
    color: #666;
    .cardItemContTop {
      height: 20px;
      line-height: 20px;
      font-size: 0;
      span {
        font-size: 14px;
        display: inline-block;
        height: 20px;
        width: 200px;
        vertical-align: top;
        .colorCard {
          width: 14px;
          height: 14px;
          vertical-align: middle;
          margin-left: 10px;
          padding: 0;
          border: none;
          display: inline-block;
          cursor: pointer;
          .colorCard {
            vertical-align: top;
            margin-left: 0;
          }
        }
      }
    }
    .cardItemContVal {
      margin-top: 10px;
      .center {
        width: 150px;
        height: 62px;
        position: relative;
        display: inline-block;
        vertical-align: bottom;
        margin-right: 10px;
        .upload_box {
          width: 150px;
          height: 62px;
        }
        img {
          width: 150px;
          height: 62px;
          border-radius: 5px;
        }
        .noImg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          text-align: center;
          line-height: 60px;
          color: #fff;
          background: #ccc;
          border-radius: 5px;
          font-size: 14px;
          span {
            display: inline-block;
            transform: scaleY(0.9);
            font-size: 20px;
            margin-right: 5px;
            position: absolute;
            left: 30px;
          }
        }
      }
    }
  }
  .cardItemFooter {
    font-size: 12px;
    margin-top: 10px;
  }
}
.quick_item {
  border: 1px solid #e1e1e1;
  border-radius: 5px;
  margin-top: 10px;
  padding: 0 12px;
  font-size: 14px;
  line-height: 35px;
  span {
    margin-right: 10px;
    &.quick_label {
      width: 70px;
      display: inline-block;
      text-align: right;
    }
  }
  .quick_item_radio {
    margin-right: 10px;
  }
}
</style>
