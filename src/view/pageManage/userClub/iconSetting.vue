<template>
    <div>
        <user-club-top></user-club-top>
        <div class="m-content" v-loading="fullscreenLoading">
            <div class="m-content-main main_height">
                <div class="phone_page" ref="phonePage">
                    <user-mobile
                        :showOper="false"
                        :data="data"
                        :iconList="iconList">
                    </user-mobile>
                </div>
                <div class="icon_cont">
                    <ul class="icon_list_box">
                        <li class="icon_list" v-for="(item, index) in iconList" :key="'iconList_'+index">
                            <div class="icon_list_title clearfix">
                                {{item.title}}
                                <span v-if="item.isEdit == false">
                                    <el-button type="text" @click="itemEdit(item, index)" v-if="checkIndex < 0">修改</el-button>
                                </span>
                                <span v-else>
                                    <el-button type="text" @click="itemEditOk">保存</el-button>
                                    <el-button type="text" class="closeBtn" @click="itemEditClose">取消</el-button>
                                </span>
                            </div>
                            <div class="icon_list_cont">
                                <div class="icon_list_left">
                                    图标
                                    <div class="icon_list_left_cont" v-if="!item.isEdit">
                                        <div class="icon_list_icon">
                                            <img :src="item.src" alt="">
                                        </div>
                                    </div>
                                    <div class="icon_list_left_cont" v-else>
                                        <el-upload
                                            action="/common/picUpload"
                                            :show-file-list="false"
                                            :on-success="handleAvatarSuccess"
                                            :before-upload="beforeAvatarUpload"
                                            v-loading="item.uploadFlg"
                                            >
                                            <div class="icon_list_icon">
                                                <img :src="item.src" alt="">
                                            </div>
                                            <div class="icon_list_icon_hint">
                                                <div style="color: #3089dc;">上传图片</div>
                                                <p>建议176*176像素</p>
                                            </div>
                                        </el-upload>
                                    </div>
                                </div>
                                <div class="icon_list_right">
                                    <p>跳转页面：{{item.link}}</p>
                                    <p>{{item.hint}}</p>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ajax from 'src/api/index.js';
import { clone } from 'src/common/public.js';
import { isIntNum } from 'src/common/validation.js';
import defaultAvatar from 'src/assets/images/defaultAvatar.jpg';
import userMobile from 'src/components/userMobile/userMobile';
import userClubTop from 'src/components/user-club-top/user-club-top';
// 图标
import mall from 'src/assets/svg/mall.svg';
import integral from 'src/assets/svg/integral.svg';
import coupons from 'src/assets/svg/coupons.svg';
import welfare from 'src/assets/svg/welfare.png';
import gift from 'src/assets/svg/gift.svg';
import privilege from 'src/assets/svg/privilege.svg';
import promotionIcon from 'src/assets/svg/promotionIcon.png';

export default {
    data(){
        return {
            data: {
                userInfo: {},
                memberCenter: {
                    backgroundPicUrl: 'http://img11.360buyimg.com/imgzone/jfs/t20251/276/73955747/3197/affbbf57/5af93be4Nb878f48e.png'
                },
                memberCardInfo: {
                    memberCenterColor: ''
                }
            },
            fullscreenLoading: true,
            vipCardList: [],
            copyCardData: {},
            activeIndex: -1,
            checkIndex: 0,
            iconList: [
                {
                    name: 'shopping',
                    src: mall,
                    title: '购物积分',
                    link: '会员规则页面',
                    prompt: '展示会员当前所属会员等级可获得的购物积分倍数',
                    isEdit: false,
                    isUpload: false,
                    isDefault: true
                },
                {
                    name: 'discount',
                    src: integral,
                    title: '会员折扣',
                    link: '会员规则页面',
                    hint: '展示会员当前所属会员等级可享受的商品折扣',
                    isEdit: false,
                    isUpload: false,
                    isDefault: true
                },
                {
                    name: 'coupon',
                    src: coupons,
                    title: '专属优惠券',
                    link: '会员专享券',
                    hint: '展示会员专属优惠券领取入口，若当前没有生效中的会员专属优惠券则不显示',
                    isEdit: false,
                    isUpload: false,
                    isDefault: true
                },
                {
                    name: 'welfare',
                    src: welfare,
                    title: '福利社',
                    link: '会员福利社',
                    hint: '展示会员福利社入口',
                    isEdit: false,
                    isUpload: false,
                    isDefault: true
                },
                {
                    name: 'exchange',
                    src: promotionIcon,
                    title: '会员专享价',
                    link: '会员专享价',
                    hint: '展示会员专享价入口',
                    isEdit: false,
                    isUpload: false,
                    isDefault: true
                },
                {
                    name: 'memberCard',
                    src: privilege,
                    title: '个性会员卡',
                    link: '个性会员卡',
                    hint: '展示个性化会员卡入口',
                    isEdit: false,
                    isUpload: false,
                    isDefault: true
                }
            ],
            checkObj: {},
            checkIndex: -1
        }
    },
    created() {
        this.fullscreenLoading = false;
    },
    mounted(){
        this.changeDataOrder();
        this.queryMemberCentersConfig();
    },
    methods: {
        changeDataOrder(){
            this.data.userInfo = {
                userName: 'MarkGavin',
                avatar: defaultAvatar,
                integralNumber: '1,234',
                level: '铜牌会员',
            };
            this.data.moduleList = [
            ];
        },
        handleAvatarSuccess(file) {
            if(file.result != 100){
                this.$message.error(file.message);
                return;
            }
            this.iconList[this.checkIndex].src = file.data.picUrl;
            this.iconList[this.checkIndex].isUpload = false;
        },
        beforeAvatarUpload(file) {
            const isIMAGE = /image\/\w+/.test(file.type);
            const isLt2M = file.size / 1024 / 1024 < 1.5;

            if (!isIMAGE) {
                this.$message.error('上传图片只能是 JPG、PNG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 1.5MB!');
            }
            if(isIMAGE && isLt2M){
                this.iconList[this.checkIndex].isUpload = true;
                this.iconList[this.checkIndex].isDefault = false;
            }
            return isIMAGE && isLt2M;
        },
        itemEdit(item, index){
            if(this.checkIndex >= 0){
                return;
            }
            this.checkObj = clone(item);
            this.checkIndex = index;
            item.isEdit = true;
        },
        itemEditOk(){
            this.saveMemberCentersConfig(() => {
                this.checkObjEmpty();
            });
        },
        itemEditClose(){
            this.iconList[this.checkIndex].src = this.checkObj.src;
            this.iconList[this.checkIndex].isDefault = this.checkObj.isDefault;
            this.checkObjEmpty();
        },
        checkObjEmpty(){
            this.iconList[this.checkIndex].isEdit = false;
            this.checkObj = {};
            this.checkIndex = -1;
        },
        queryMemberCentersConfig(){
            let vm = this;
            ajax({
                api_name: 'queryMemberCentersConfig',
                vm: this,
                data: {}
            }, result => {
                console.log(result);
                this.fullscreenLoading = false;
                if(result.data.iconConfig){
                    result.data.iconConfig = JSON.parse(result.data.iconConfig);
                    for(let key in result.data.iconConfig){
                        vm.iconList.forEach((item, index) => {
                            if(item.name == key && result.data.iconConfig[key]){
                                item.src = result.data.iconConfig[key];
                                item.isDefault = false;
                            }
                        });
                    }
                }
            })
        },
        saveMemberCentersConfig(cb){
            let vm = this;
            let iconConfig = vm.iconList.reduce((a, b) => {
                a[b.name] = b.isDefault ? '' : b.src;
                return a;
            }, {});
            console.log(vm.iconList);
            console.log(iconConfig);
            ajax({
                api_name: 'saveMemberCentersConfig',
                vm: this,
                data: {
                    iconConfig
                }
            }, result => {
                this.$message({
                    message: '修改成功',
                    type: 'success'
                });
                cb && cb();
            })
        }
    },
    components: {
        userMobile,
        userClubTop
    }
}
</script>

<style lang="less" scoped>
    .m-content-main{
        height: 100%;
        background: #fff;
        padding: 20px;
        box-sizing: border-box;
    }
    .phone_page{
        display: inline-block;
        width: 375px;
        height: 601px;
        border: 1px solid #E9E9E9;
        border-radius: 5px;
        background: #fff;
        vertical-align: top;
    }
    .icon_cont{
        width: 550px;
        margin-left: 20px;
        display: inline-block;
    }
    .icon_list{
        border: 1px solid #e1e1e1;
        margin-top: 20px;
        padding: 0 12px;
        &:first-child{
            margin-top: 0;
        }
        .icon_list_title{
            border-bottom: 1px solid #e1e1e1;
            line-height: 35px;
            span{
                float: right;
            }
            .closeBtn{
                color: #999;
            }
        }
        .icon_list_cont{
            margin:  10px 0;
            display: flex;
        }
        .icon_list_left{
            display: inline-block;
            width: 220px;
            vertical-align: top;
            .icon_list_left_cont{
                display: inline-block;
                width: 180px;
                vertical-align: top;
            }
            .icon_list_icon{
                display: inline-block;
                width: 65px;
                height: 65px;
                vertical-align: top;
                box-sizing: border-box;
                padding: 10px;
                img{
                    width: 100%;
                    height: 100%;
                }
            }
            .icon_list_icon_hint{
                color: #999;
                display: inline-block;
                font-size: 10px;
                vertical-align: bottom;
                margin-bottom: 10px;
                text-align: left;
            }
        }
        .icon_list_right{
            height: 65px;
            display: inline-block;
            width: 300px;
            border-left: 1px solid #e1e1e1;
            vertical-align: top;
            box-sizing: border-box;
            padding-left: 10px;
        }
    }
</style>
