<template>
    <div id="userCenter">
        <div class="userCenterWarp">
            <div id="userCenterWarp">
                <div class="page_title" data-name="BgImgs" @click="checkActiveData({backgroundPicUrl: data.memberCenter.backgroundPicUrl, type: 'bgImg', uploadFlg: false}, '')">
                <!-- <div class="page_title" data-name="BgImgs"> -->
                    <img class="page_bg" :src="data.memberCenter.backgroundPicUrl">
                    <div class="title">
                        <div class="userAvatar">
                            <img :src="data.userInfo.avatar" alt="">
                            <div class="userAvatarTag">
                                <img :src="data.userInfo.avatarBadge" alt="" v-if="data.userInfo.avatarBadge">
                            </div>
                        </div>
                        <div class="userInfo">
                            <p>{{data.userInfo.userName}}</p>
                            <p class="integralNumber">{{data.userInfo.integralNumber}}<span>积分</span></p>
                        </div>
                        <div class="userTag">{{data.userInfo.level}}</div>
                    </div>
                </div>
                <!-- <div class="page_banner" v-if="showOper" @click="checkActiveData({bannerUrls: data.memberCenter.bannerUrls, type: 'banner'}, '')">
                    <a href="javascript:void(0);">
                        <img :src="data.memberCenter.bannerUrls.length > 0 ? data.memberCenter.bannerUrls[0].imgsrc : ''" width="100%" v-if="data.memberCenter.bannerUrls[0].imgsrc">
                        <div v-if="!data.memberCenter.bannerUrls[0].imgsrc" class="noImg"><span>+</span>上传图片</div>
                    </a> -->
                    <!-- <div class="operation" v-if="showOper">
                        <div class="operation_item del el-icon-delete" data-type="del" @click.stop="moduleDel(0, 'banner')"></div>
                    </div> -->
                <!-- </div> -->
                <div class="user_privilege" v-if="privileges.show">
                    <div class="privilege_title">会员权益</div>
                    <div class="privilege_item_box">
                        <div class="privilege_item">
                            <div class="item_icon">
                                <img :src="iconList[0].src" alt="">
                            </div>
                            <span>购物1.0倍积分</span>
                        </div>
                        <div class="privilege_item">
                            <div class="item_icon">
                                <img :src="iconList[1].src" alt="">
                            </div>
                            <span>9.8折</span>
                        </div>
                        <div class="privilege_item">
                            <div class="item_icon">
                                <img :src="iconList[2].src" alt="">
                            </div>
                            <span>专属优惠券</span>
                        </div>
                        <div class="privilege_item">
                            <div class="item_icon">
                                <img :src="iconList[3].src" alt="">
                            </div>
                            <span>福利社</span>
                        </div>
                    </div>
                </div>
                <div v-for="(item, index) in quickList" :key="'quickList_'+index">
                    <div class="user_hd" v-if="item.key == 'hudong' && item.show">
                        <div class="user_hd_title">热门互动</div>
                        <div class="user_hd_item_box">
                            <div class="user_hd_item">
                                <div class="item_icon">
                                    <img src="../../assets/svg/sign.svg" alt="">
                                </div>
                                <div class="item_name">今日未签到</div>
                                <div class="item_hint">今日已有100人签到</div>
                            </div>
                            <div class="user_hd_item">
                                <div class="item_icon">
                                    <img src="../../assets/svg/lucky.svg" alt="">
                                </div>
                                <div class="item_name">抽奖活动名称</div>
                                <div class="item_hint">已有xx人次参与抽奖</div>
                            </div>
                            <div class="user_hd_item">
                                <div class="item_icon">
                                    <img src="../../assets/svg/sign.svg" alt="">
                                </div>
                                <div class="item_name">今日未签到</div>
                                <div class="item_hint">今日已有100人签到</div>
                            </div>
                        </div>
                    </div>
                    <intergal-list :list="intergalListData" v-if="item.key == 'integral' && item.show"></intergal-list>
                    <welfare-list :list="welfareListData" v-if="item.key == 'welfare' && item.show"></welfare-list>
                </div>
                <div class="page_content">
                    <div class="page_module_list" :class="{'active': activeIndex === index}" v-for="(modules, index) in data.moduleList" :key="index" @click="checkActiveData(modules, index)">
                        <!-- 会员专享券 -->
                        <!-- <div v-if="modules.coupons">
                            <div class="page_module_text"><span>会员专享</span></div>
                            <div class="page_module_list_item coupons_item" v-for="(coupons) in modules.coupons" :key="coupons.id">
                                <div class="coupons_item_img" :style="{'background': data.memberCardInfo.memberCenterColor}">
                                    <p class="coupons_item_number" v-if="coupons.discountType == 1">￥<span>{{coupons.discount}}</span></p>
                                    <p class="coupons_item_number" v-if="coupons.discountType == 2"><span>{{coupons.discount}}</span>折</p>
                                    <p>店铺优惠券</p>
                                </div>
                                <div class="coupons_item_cont">
                                    <p class="coupons_item_title">{{coupons.activityName}}</p>
                                    <p class="coupons_item_desc">{{coupons.quotaStr}}</p>
                                    <p class="coupons_item_hint">{{coupons.restrictionStr}}</p>
                                </div>
                                <a class="coupons_item_btn" href="javascript:void(0);" :style="{'background': data.memberCardInfo.memberCenterColor}">立即领取</a>
                            </div>
                        </div> -->
                        <!-- 新会员专享券 -->
                        <!-- <div v-if="modules.newUserCoupons">
                            <div class="page_module_text"><span>新会员专享</span></div>
                            <div class="page_module_list_item coupons_item" v-for="(newUserCoupon) in modules.newUserCoupons" :key="newUserCoupon.id">
                                <div class="coupons_item_img" :style="{'background': data.memberCardInfo.memberCenterColor}">
                                    <p class="coupons_item_number" v-if="newUserCoupon.discountType == 1">￥<span>{{newUserCoupon.discount}}</span></p>
                                    <p class="coupons_item_number" v-if="newUserCoupon.discountType == 2"><span>{{newUserCoupon.discount}}</span>折</p>
                                    <p>店铺优惠券</p>
                                </div>
                                <div class="coupons_item_cont">
                                    <p class="coupons_item_title">{{newUserCoupon.activityName}}</p>
                                    <p class="coupons_item_desc">{{newUserCoupon.quotaStr}}</p>
                                    <p class="coupons_item_hint">{{newUserCoupon.restrictionStr}}</p>
                                </div>
                                <a class="coupons_item_btn" href="javascript:void(0);" :style="{'background': data.memberCardInfo.memberCenterColor}">立即领取</a>
                            </div>
                        </div> -->
                        <!-- 图片 -->
                        <!-- <div v-if="modules.picUrls">
                            <div :class="{'has2': modules.picUrls.length == 2, 'has3': modules.picUrls.length == 3}" class="page_module_list_item imgs_item" v-for="(pic) in modules.picUrls" :key="pic.imgsrc">
                                <a class="img_a" href="javascript:void(0);" v-if="pic.imgsrc" :style="!pic.consult && pic.height ? {'height': pic.consultHeight + 'px'}: {}"><img :style="!pic.consult && pic.height ? {'height': pic.height + 'px', 'width': pic.width + 'px'} : {}" :class="!pic.consult && pic.height ? 'self_adaption':''"  :src="pic.imgsrc" alt=""></a>
                                <div v-if="!pic.imgsrc" class="noImg">
                                    <img class="default" src="~assets/images/uploadIcon.png" alt="">
                                </div>
                            </div>
                        </div> -->
                         <ul v-if="modules.picUrls" class="imgBox" >
                            <li class="page_module_list_item imgs_item" v-for="(pic) in modules.picUrls" :key="pic.imgsrc">
                                <a class="img_a" href="javascript:void(0);" v-if="pic.imgsrc" :style="{'height': parseInt(pic.consultHeight || pic.height) + 'px'}">
                                  <img  :src="pic.imgsrc" alt="">
                                </a>
                                <div v-if="!pic.imgsrc" class="noImg" style="height:200px;">
                                    <img class="default" src="~assets/images/uploadIcon.png" alt="">
                                </div>
                                <vdr
                                  v-for="(point,index) in modules.pointArr"
                                  :key="index"
                                  :min-width="50"
                                  :min-height="50"
                                  :w="point.width"
                                  :h="point.height"
                                  :x="point.left"
                                  :y="point.top"
                                  @activated="onActivated(index)"
                                  @dragstop="onDrag"
                                  @resizestop="onResize"
                                  :parent="true"
                                >
                                  <div class="hotPointInner">热点{{index + 1}}</div>
                                </vdr>
                            </li>
                        </ul>
                        <div class="operation" v-if="showOper">
                            <div v-if="index > 0" class="operation_item up el-icon-arrow-up" data-type="up" @click.stop="moduleUp(index)"></div>
                            <div v-if="index < data.moduleList.length - 1" class="operation_item down el-icon-arrow-down" data-type="down" @click.stop="moduleDown(index)"></div>
                            <div class="operation_item del el-icon-delete" data-type="del" @click.stop="moduleDel(index, 'module')"></div>
                        </div>
                    </div>
                </div>
                <!-- <div class="addModule" v-if="showOper">
                    <p data-name="showAddModule" @click="addModule('picUrl')">添加图片</p>
                    <div class="moduleList" v-if="showModuleAddBtn">
                        <div class="moduleItem" data-name="addModule" @click="addModule('newUserCoupon')">新会员<br/>专享券</div>
                        <div class="moduleItem" data-name="addModule" @click="addModule('coupon')">会员<br/>专享券</div>
                        <div class="moduleItem" data-name="addModule" @click="addModule('picUrl')">图片</div>
                    </div>
                </div> -->
                <div class="footer_warp">
                    <a href="javascript:void(0);" class="footer_item" :style="'color: '+data.memberCardInfo.memberCenterColor"><i class="iconfont icon-huiyuanzhongxin"></i> 会员中心</a>
                    <a href="javascript:void(0);" class="footer_item"><i class="iconfont icon-pinpaigushi"></i> 品牌故事</a>
                    <a href="javascript:void(0);" class="footer_item"><i class="iconfont icon-hudong"></i> 互动</a>
                    <a href="javascript:void(0);" class="footer_item"><i class="iconfont icon-shangchang"></i> 商城</a>
                    <a href="javascript:void(0);" class="footer_item"><i class="iconfont icon-dianpushouye"></i> 店铺首页</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import mall from 'src/assets/svg/mall.svg';
import integral from 'src/assets/svg/integral.svg';
import coupons from 'src/assets/svg/coupons.svg';
import welfare from 'src/assets/svg/welfare.png';
import intergalList from 'src/components/intergal-list/intergal-list';
import welfareList from 'src/components/welfare-list/welfare-list';
//https://github.com/gorkys/vue-draggable-resizable-gorkys/blob/master/README_ZH.md#styling vdr文档
import vdr from 'vue-draggable-resizable-gorkys';
import 'vue-draggable-resizable-gorkys/dist/VueDraggableResizable.css';
export default {
    props: {
        showOper: {
            type: Boolean,
            default: false
        },
        showModuleAddBtn: {
            type: Boolean,
            default: false
        },
        iconList: {
            type: Array,
            default(){
                return [
                    {
                        name: '',
                        src: mall
                    },
                    {
                        name: '',
                        src: integral
                    },
                    {
                        name: '',
                        src: coupons
                    },
                    {
                        name: '',
                        src: welfare
                    }
                ]
            }
        },
        consultMsg: {
            type: Object,
            default() {
               return {}
            }
        },
        data: {
            type: Object,
            default(){
                return {
                    userInfo: {},
                    memberCenter: {
                        bannerUrls: [{}]
                    }
                }
            }
        },
        quickList: {
            type: Array,
            default(){
                return [
                    {
                        show: true,
                        key: 'hudong'
                    },
                    {
                        show: false,
                        key: 'integral'
                    },
                    {
                        show: false,
                        key: 'welfare'
                    },
                ]
            }
        },
        privileges: {
            type: Object,
            default(){
                return {
                    show: true,
                    key: 'privileges'
                }
            }
        }
    },
    created() {
    },
    data(){
        return {
            activeIndex: '',
            intergalListData: [{
                type: 'coupon',
                faceType: 1,
                faceValue: 10,
                coupon: {
                    bindType: 1
                },
                picUrl: '',
                giftName: '示例礼品',
                needPoint: 10,
                endTime: '2099-12-30',
                rate: 100,
                haveCount: 100
            }],
            welfareListData: [{
                type: 'dynamic_bargain',
                activityName: '示例活动',
                discount: 90,
                price: 100,
                wareLogo: welfare,
                status: 0,
                endTime: '2099-12-30',
                numberLowerLimit: 2
            }],
            currentIndex:''
        }
    },
    methods: {
        updateActive(index) {
            this.activeIndex = index;
        },
        checkActiveData(modules, index){
            if(!this.showOper){ return; }
            this.activeIndex = index;
            this.$emit('checkActiveData', modules, index);
        },
        moduleUp(index) {
            this.$emit('moduleUp', index);
        },
        moduleDown(index) {
            this.$emit('moduleDown', index);
        },
        moduleDel(index, type){
            this.$emit('moduleDel', index, type);
            console.log(type)
        },
        addModule(type){
            this.$emit('addModule', type);
        },
        showModuleAddFn(){
            this.$emit('showModuleAddFn');
        },
        calcStyle(point) {
          return {
            width:point.width + 'px',
            height:point.height + 'px',
            left:point.left + 'px',
            top:point.top + 'px'
          }
        },
        onActivated(index) {
          this.currentIndex = index;
        },
        onResize(left,top,width,height) {
          // updatePoint()
          this.$emit("updatePoint",{
            left,
            top,
            width,
            height
          },this.currentIndex)
        },

        onDrag(left,top) {
          this.$emit("updatePoint",{
            left,
            top
          },this.currentIndex);
        }
        // movePoint1(ev) {
        //   console.log(ev.target);
        // },
    },
    components: {
        intergalList,
        welfareList,
        vdr
    }
}
</script>

<style lang="less" scoped>
    #userCenter {
        padding-bottom: 50px;
        position: relative;
        height: 100%;
        overflow: auto;
        background: #f4f4f4;
        height: 601px;
        border: 1px solid #E9E9E9;
        box-sizing: border-box;
        .userCenterWarp {
            height: 100%;
            overflow: auto;
            overflow-x:hidden;
        }
        .footer_warp{
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 50px;
            background: #fff;
            display: flex;
            // justify-content:center;
            // align-items:center;
            .footer_item{
                display: inline-block;
                flex: 1;
                font-size: 10px;
                color: #888;
                position: relative;
                height: 100%;
                text-align: center;
                &:before {
                    content: "";
                    display: inline-block;
                    height: 100%;
                    width: 1px;
                    border-left: 1px solid #eeeeee;
                    top: 0;
                    right: 0;
                    position: absolute;
                    display: none;
                }
                &:last-child {
                    &:before {
                        display: none;
                    }
                }
                .iconfont{
                    font-size: 16px;
                    display: block;
                    line-height: 0;
                    height: 20px;
                    margin-top: 8px;
                    &::before{
                        line-height: 1;
                    }
                }
                &:hover{
                    text-decoration: none;
                }
            }
        }
        .page_title {
            height: 180px;
            width: 100%;
            position: relative;
            background: #fff;
            cursor: pointer;
            &:after{
                // content: '';
                // background-image: url('../../assets/img/vip.png');
                // background-size: 100% 100%;
                // position: absolute;
                // display: inline-block;
                // width: 148px;
                // height: 60px;
                // bottom: 20px;
                // right: 20px;
                // z-index: 1;
                // opacity: 0.8;
                // transform: skew(-15deg);
            }
            &:before{
                content: '';
                position: absolute;
                display: inline-block;
                width: 335px;
                height: 165px;
                top: 6px;
                left: 20px;
                z-index: 0;
                background:linear-gradient(133.7deg,rgba(76,71,68,0.92),rgba(38,32,28,1));
                border-radius: 5px;
                box-shadow: 1px 2px 5px rgba(0,0,0,0.6);
            }
            .page_bg {
                // background:linear-gradient(133.7deg,rgba(76,71,68,0.92),rgba(38,32,28,1));
                border-radius: 5px;
                position: absolute;
                display: inline-block;
                width: 335px;
                height: 165px;
                top: 6px;
                left: 20px;
                z-index: 1;
            }
            .title {
                position: absolute;
                width: 335px;
                height: 165px;
                top: 5px;
                left: 20px;
                box-sizing: border-box;
                padding: 52px 15px;
                z-index: 2;
            }
            .userAvatar {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                display: inline-block;
                vertical-align: top;
                background: #fff;
                position: relative;
                img{
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                }
                .userAvatarTag{
                    position: absolute;
                    width: 100px;
                    height: 100px;
                    top: -35px;
                    left: 9px;
                    img{
                        width: 100%;
                        height: 100%;
                        border-radius: 0;
                    }
                }
            }
            .userInfo {
                margin-top: 10px;
                display: inline-block;
                margin-left: 15px;
                vertical-align: top;
                max-width: 180px;
                overflow: hidden;
                p {
                    font-size: 17px;
                    color: #fff;
                    line-height: 24px;
                    &.integralNumber {
                        color: #fee0a6;
                        vertical-align: bottom;
                        font-size: 15px;
                        margin-top: 5px;
                        span {
                            font-size: 12px;
                            vertical-align: bottom;
                            margin-left: 3px;
                            color: #dad4d1;
                        }
                    }
                }
            }
            .userTag {
                position: absolute;
                display: inline-block;
                padding: 0 6px 0 7px;
                border-radius: 20px 0px 0px 20px;
                font-size: 12px;
                color: #fff;
                background:linear-gradient(159.4deg,rgba(230,167,68,1),rgba(199,124,79,1));
                right: 0;
                top: 17px;
                height: 20px;
                line-height: 20px;
                min-width: 35px;
                text-align: center;
            }
        }
        .page_banner {
            min-height: 50px;
            background: #fff;
            cursor: pointer;
            position: relative;
            .noImg{
                // position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                text-align: center;
                line-height: 50px;
                color: #fff;
                padding-left: 20px;
                font-size: 16px;
                background: #ccc;
                span{
                    display: inline-block;
                    transform: scaleY(0.9);
                    font-size: 24px;
                    margin-right: 5px;
                    position: absolute;
                    left: 140px;
                }
            }
        }
        .operation{
            position: absolute;
            position: absolute;
            height: 20px;
            line-height: 20px;
            display: flex;
            background: rgba(0, 0, 0, 0.5);
            top: 5px;
            right: 5px;
            border: 1px solid rgba(0, 0, 0, 0.5);
            .operation_item{
                text-align: center;
                position: relative;
                height: 100%;
                cursor: pointer;
                width: 20px;
                line-height: 20px;
                color: rgba(255, 255, 255, 0.5);
                font-size: 12px;
            }
        }
        .page_content {
            padding-top: 7px;
            background: #f4f4f4;
            .imgBox{
              display: flex;
              justify-content: center;
              align-items: center;
              padding:0;
              li{
                position: relative;
                // margin-right:10px;
                width:100%;
                margin:0;
                img{
                  width:100%;
                  height:100%;
                }
                .vdr{
                  background:rgba(0,173,255,.2);
                }
              }
            }
            .page_module_list {
                margin-top: 7px;
                background: #fff;
                cursor: pointer;
                position: relative;
                // padding:0 10px;
                border: 1px solid transparent;
                box-sizing: border-box;
                &:last-child {
                    margin-bottom: 1px;
                }
                &.Coupons {
                    padding: 0 10px;
                }
                &:first-child {
                    margin-top: 0;
                }
                &.active{
                    border: 1px solid #00adff;
                }
                // .imgs_item{
                //     min-height: 168px;
                // }
                .noImg{
                    // position: absolute;
                    top: 10px;
                    left: 10px;
                    right:10px;
                    bottom: 10px;
                    text-align: center;
                    line-height: 168px;
                    color: #fff;
                    // padding-left: 20px;
                    font-size: 16px;
                    background: #F8F8F8;
                    span{
                        display: inline-block;
                        transform: scaleY(0.9);
                        font-size: 24px;
                        margin-right: 5px;
                        position: absolute;
                        left: 140px;
                    }
                }
            }
            .page_module_text {
                text-align: center;
                font-size: 15px;
                color: #333;
                padding: 15px 0;
                position: relative;
                span {
                    position: relative;
                    &::after {
                        left: -90px;
                        background: linear-gradient(90deg,rgba(254,228,161,0),rgba(221,182,115,0.8));
                    }
                    &::before {
                        right: -90px;
                        background: linear-gradient(90deg,rgba(221,182,115,0.8),rgba(254,228,161,0));
                    }
                }
            }
            .coupons_item {
                border-bottom: 1px solid #f0f0f0;
                padding: 10px 12px;
                position: relative;
                .coupons_item_img {
                    display: inline-block;
                    width: 83px;
                    vertical-align: bottom;
                    height: 55px;
                    background: #e0b971;
                    border-radius: 4px;
                    color: rgba(255,255,255,0.7);
                    text-align: center;
                    padding: 0 5px;
                    box-sizing: border-box;
                    overflow: hidden;
                    p {
                        font-size: 11px;
                    }
                    .coupons_item_number {
                        font-size: 10px;
                        vertical-align: bottom;
                        border-bottom: 1px dashed #d1a149;
                        font-weight: 900;
                        color: #fff;
                        span {
                            font-size: 20px;
                        }
                    }
                }
                .coupons_item_cont {
                    display: inline-block;
                    width: 168px;
                    margin-left: 10px;
                    vertical-align: top;
                    font-size: 12px;
                    overflow: hidden;
                    position: relative;
                    .coupons_item_title {
                        color: #666;
                        height: 18px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                    .coupons_item_desc {
                        color: #999;
                        height: 18px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                    .coupons_item_hint {
                        color: red;
                        height: 18px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                }
                .coupons_item_btn {
                    display: inline-block;
                    width: 78px;
                    height: 30px;
                    line-height: 30px;
                    background: #ebc37d;
                    color: #fff;
                    text-align: center;
                    cursor: pointer;
                    vertical-align: top;
                    top: 15px;
                    font-size: 13px;
                    border-radius: 30px;
                    position: absolute;
                    right: 12px;
                }
            }
            .imgs_item {
                background: #fff;
                position: relative;
                .img_a {
                    display: block;
                    width: 100%;
                    overflow: hidden;
                    position: relative;
                    font-size: 0;
                }
                &.has2 {
                    width: 164px;
                    display: inline-block;
                    min-height: auto;
                    overflow: hidden;
                    vertical-align: middle;
                    margin-left: 10px;
                    padding: 5px 0 5px 0;
                    .noImg {
                        padding-left: 0;
                        right: 0px;
                        left: 10px;
                        height: 90px;
                        position: relative;
                        top: 0;
                        bottom: 0;
                    }
                    img {
                        &.self_adaption {
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            width: 100%;
                            transform: translate(-50%,-50%);
                            text-align: center;
                        }
                        &.default {
                            width: 48px;
                            height: 38px;
                            min-height: 38px;
                            position: absolute;
                            margin-top: 0;
                            top: 24px;
                            left: 56px;
                        }
                    }
                }
                &.has3 {
                    width: 105px;
                    display: inline-block;
                    min-height: auto;
                    overflow: hidden;
                    vertical-align: middle;
                    margin-left: 10px;
                    padding: 5px 0 5px 0;
                    .noImg {
                        padding-left: 0;
                        position: relative;
                        height: 95px;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                    }
                    img {
                        width: 105px;
                        min-height: auto;
                        &.default {
                            width: 42px;
                            height: 33px;
                            min-height: 33px;
                            position: absolute;
                            margin-top: 0;
                            top: 28px;
                            left: 35px;
                        }
                    }
                    img {
                        &.self_adaption {
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            width: 100%;
                            transform: translate(-50%,-50%);
                            text-align: center;
                        }
                    }
                }
                img {
                    width: 100%;
                    min-height: 70px;
                    &.default {
                        width: 76px;
                        height: 60px;
                        margin-top: 38px;
                    }
                }
            }
            .video_item {
                margin-top: 5px;
                background: #fff;
                img {
                    width: 100%;
                    min-height: 70px;
                }
            }
        }
        .page_content .page_module_text span::after, .page_content .page_module_text span::before {
            content: "";
            position: absolute;
            width: 80px;
            height: 2px;
            border-radius: 10px 2px 2px 10px;
            top: 10px;
        }
        .addModule {
            text-align: center;
            p {
                color: #3089de;
                height: 40px;
                line-height: 40px;
                font-size: 14px;
                cursor: pointer;
            }
            .moduleList {
                display: flex;
                background: #fff;
                width: 100%;
                font-size: 12px;
                .moduleItem {
                    flex: 1;
                    text-align: center;
                    position: relative;
                    height: 55px;
                    justify-content: center;
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    &:before {
                        content: "";
                        position: absolute;
                        height: 55px;
                        border-right: 1px solid #eeeeee;
                        top: 0;
                        right: 0;
                        width: 1px;
                        display: inline-block;
                    }
                    &:last-child {
                        &:before {
                            display: none;
                        }
                    }
                }
            }
        }
        .user_privilege{
            background: #fff;
            padding: 0 12px;
            padding-bottom: 20px;
            .privilege_title{
                font-size: 14px;
                color: #3d4134;
                height: 48px;
                line-height: 48px;
            }
            .privilege_item_box{
                overflow: hidden;
                width: 100%;
                height: 75px;
                white-space: nowrap;
            }
            .privilege_item{
                display: inline-block;
                width: 77px;
                text-align: center;
                position: relative;
                margin-right: 7px;
                .item_icon{
                    width: 44px;
                    height: 44px;
                    margin: 0 auto;
                    img{
                        width: 100%;
                        height: 100%;
                    }
                }
                span{
                    display: inline-block;
                    margin-top: 12px;
                    color: #3d4134;
                    font-size: 12px;
                }
                a{
                    display: inline-block;
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                }
            }
        }
        .user_hd{
            background: #fff;
            padding: 0 12px 15px;
            margin-top: 10px;
            .user_hd_title{
                font-size: 14px;
                color: #3d4134;
                height: 48px;
                line-height: 48px;
            }
            .user_hd_item_box{
                font-size: 0;
                .user_hd_item{
                    width: 33.3%;
                    display: inline-block;
                    text-align: center;
                    position: relative;
                    .item_icon{
                        display: inline-block;
                        width: 44px;
                        height: 44px;
                        img{
                            width: 100%;
                            height: 100%;
                        }
                    }
                    .item_name{
                        color: #3d4145;
                        font-size: 12px;
                        margin-top: 8px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                    .item_hint{
                        margin-top: 5px;
                        color: #888;
                        font-size: 10px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                    a{
                        display: inline-block;
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                    }
                }
            }
        }
    }
    .hotPointInner {
      width:100%;
      height:100%;
      display: flex;
      justify-content: center;
      align-items: center;
      color:#fff;
      font-size:12px;
    }
    .vdr {
          background: rgba(0, 173, 255, 0.6) !important;
    }
</style>

