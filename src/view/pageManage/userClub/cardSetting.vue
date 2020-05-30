<template>
    <div>
        <user-club-top></user-club-top>
        <div class="m-content" v-loading="fullscreenLoading">
            <div class="m-content-main main_height">
                <div class="phone_page" ref="phonePage">
                    <user-mobile
                        :showOper="false"
                        :data="data">
                    </user-mobile>
                </div>
                <div class="cardBox">
                    <el-card class="cardItem" :class="{'active': activeIndex == index}" v-for="(item, index) in vipCardList" :key="'cardItem_'+index">
                        <div @click="previewCard(item, index)">
                            <div class="cardItemTitle" v-if="!item.editFlg">{{item.title}}
                                <span :class="{green: item.status == 1, red: item.status == 0}">{{item.default ? '' : item.status == 1 ? '已上架' : '未上架'}}</span>
                                <strong style="float: right;">
                                    <el-button type="text" @click="vipCardEdit(item, index)">修改</el-button>
                                    <el-button type="text" v-if="!item.defaulted" @click="delCard(item, index)">删除</el-button>
                                </strong>
                            </div>
                            <div class="cardItemTitle" v-if="item.editFlg">
                                <input type="text" v-model.trim="item.title" style="height: 12px;" placeholder="请输入会员卡名称" :maxlength="6"> {{item.title.length}}/6
                            </div>
                            <div class="cardItemCont">
                                <div class="cardItemContTop">
                                    <span>会员卡背景图片</span>
                                    <span>会员卡主题色
                                        <span class="colorCard" :style="{'background': item.data.memberCenterColor}">
                                            <input class="colorCard" type="color" v-model="item.data.memberCenterColor" v-if="item.editFlg" style="opacity: 0;" @change="changeColor1(item)">
                                        </span>
                                        <span v-if="!item.editFlg" style="width: auto;">{{item.data.memberCenterColor}}</span>
                                        <input type="text" v-model="item.colorText" v-if="item.editFlg" maxlength="7" style="width: 65px;" @change="changeColor(item)">
                                    </span>
                                </div>
                                <div class="cardItemContVal">
                                    <div class="center">
                                        <img :src="item.data.memberCardBgUrl" alt="" v-if="!item.editFlg">
                                        <el-upload
                                            action="/common/picUpload"
                                            :show-file-list="false"
                                            :on-success="handleAvatarSuccess"
                                            :on-error="handleAvatarError"
                                            :before-upload="beforeAvatarUpload"
                                            v-loading="item.data.uploadFlg"
                                            v-if="item.editFlg">
                                            <div class="upload_box">
                                                <img :src="item.data.memberCardBgUrl" alt="" v-if="item.data.memberCardBgUrl">
                                                <div v-else class="noImg"><span>+</span>上传图片</div>
                                            </div>
                                        </el-upload>
                                    </div>
                                    <span style="font-size: 12px;color: #999;" v-if="item.editFlg">建议尺寸：670*330px</span>
                                    <span style="font-size: 12px;color: #999;" v-if="item.editFlg">图片不能超过1.5M</span>
                                </div>
                            </div>
                            <div class="cardItemFooter" v-if="item.defaulted">
                                系统默认会员卡
                                <div class="itemEditBtn" v-if="item.editFlg">
                                    <el-button class="blueBtn" type="text" @click="vipCardCheckEdit(item, index)">确定</el-button>
                                    <el-button class="grayBtn" type="text" @click="vipCardCloseEdit(item, index)">取消</el-button>
                                </div>
                            </div>
                            <div class="cardItemFooter" v-else>
                                解锁该卡面所需积分：
                                <el-input v-model="item.unlockPoints" :disabled="!item.editFlg" :maxlength="6"></el-input>
                                <div class="itemEditBtn" v-if="item.editFlg">
                                    <el-button class="blueBtn" type="text" @click="vipCardCheckEdit(item, index)">确定</el-button>
                                    <el-button class="grayBtn" type="text" @click="vipCardCloseEdit(item, index)">取消</el-button>
                                </div>
                                <div class="itemEditBtn" v-else>
                                    <el-button :class="{'blueBtn': item.status == 0, 'grayBtn': item.status == 1}" type="text" @click="vipCardShelves(item)">{{item.status == 1 ? '下架' : '上架'}}</el-button>
                                </div>
                            </div>
                        </div>
                    </el-card>
                    <el-button type="primary" class="blueBtn" style="margin-top: 20px" @click="addVipCard" v-if="vipCardList.length < 6">新增会员卡</el-button>
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
            checkIndex: 0
        }
    },
    mounted(){
        this.changeDataOrder();
        this.getVipCardList();
    },
    methods: {
        getVipCardList(){
            ajax({
                api_name: 'getVipCardList',
                data: {
                    memberPrivilegeType: 'MEMBER_CARD'
                },
                vm: this
            }, result => {
                result.data.resultList.forEach((card) => {
                    this.$set(card, 'editFlg', false);
                    this.$set(card, 'colorText', card.data.memberCenterColor.split('#')[1]);
                    this.$set(card, 'uploadFlg', false);
                });
                this.vipCardList = result.data.resultList;
                this.data.memberCenter.backgroundPicUrl = this.vipCardList[this.checkIndex].data.memberCardBgUrl;
                this.data.memberCardInfo.memberCenterColor = this.vipCardList[this.checkIndex].data.memberCenterColor;
                this.fullscreenLoading = false;
            }, result => {
                console.error(result);
            });
        },
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
        vipCardShelves(item){
            let data = clone(item);
            data.status = data.status == 1 ? 0 : 1;
            data.data = JSON.stringify(data.data);
            ajax({
                api_name: 'changeVipCardShelves',
                vm: this,
                data: data
            }, result => {
                item.status = data.status;
                this.$message({
                    message: data.status ? '上架成功' : '下架成功'
                });
            });
        },
        vipCardEdit(data, index){
            let flg = false;
            this.vipCardList.forEach(card => {
                card.editFlg == true ? flg = true : '';
            });
            if(flg){
                this.$message({
                    type: 'error',
                    message: '请先保存当前正在编辑的会员卡'
                });
                return;
            }
            this.activeIndex = index;
            this.copyCardData = clone(data);
            data.editFlg = true;
        },
        // 修改 会员卡 解锁积分
        vipCardCheckEdit(item, index){
            let data = clone(item);
            if(data.unlockPoints == 0){
                data.unlockPoints = 0;
            }
            if(data.unlockPoints != 0 && !isIntNum(data.unlockPoints)){
                this.$message({
                    type: 'error',
                    message: '请输入自然数'
                });
                return;
            }
            if(!data.title){
                this.$message({
                    type: 'error',
                    message: '会员卡名称不能为空'
                });
                return;
            }
            if(data.title.length > 6){
                this.$message({
                    type: 'error',
                    message: '会员卡名称最多只能6个字符'
                });
                return;
            }
            if(!data.data.memberCardBgUrl){
                this.$message({
                    type: 'error',
                    message: '请上传会员卡背景图片'
                });
                return;
            }
            if(!data.colorText || data.colorText.length < 3 || (data.colorText.length > 3 && data.colorText.length < 6)){
                this.$message({
                    type: 'error',
                    message: '请填写正确的会员卡主题色'
                });
                return;
            }
            item.editFlg = false;
            data.data = JSON.stringify(data.data);
            ajax({
                api_name: 'saveVipCardData',
                vm: this,
                data: data
            }, result => {
                this.checkIndex = index;
                this.$message({
                    message: data.id ? '修改成功' : '创建成功'
                });
                this.getVipCardList();
            }, result => {
                item.editFlg = true;
            });
        },
        vipCardCloseEdit(data, i){
            if(data.id){
                this.$set(this.vipCardList, i, this.copyCardData);
                this.vipCardList[i].editFlg = false;
            } else {
                this.vipCardList.splice(i, 1);
            }
        },
        previewCard(data, index){
            let flg = false;
            this.vipCardList.forEach(card => {
                card.editFlg == true ? flg = true : '';
            });
            if(flg){
                return;
            }
            this.activeIndex = index;
            this.data.memberCardInfo.memberCenterColor = data.data.memberCenterColor;
            this.data.memberCenter.backgroundPicUrl = data.data.memberCardBgUrl;
        },
        handleAvatarSuccess(file) {
            if(file.result != 100){
                this.$message.error(file.message);
                return;
            }
            this.vipCardList[this.activeIndex].data.memberCardBgUrl = file.data.picUrl;
            this.vipCardList[this.activeIndex].uploadFlg = false;
        },
        handleAvatarError() {
          this.$message.error('图片上传失败，请重新上传');
        },
        beforeAvatarUpload(file) {
            const isIMAGE = /image\/\w+/.test(file.type);
            const isLt2M = file.size / 1024 / 1024 < 1.5;

            if (!isIMAGE) {
                this.$message.error('上传图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 1.5MB!');
            }
            if(isIMAGE && isLt2M){
                this.vipCardList[this.activeIndex].uploadFlg = true;
            }
            return isIMAGE && isLt2M;
        },
        addVipCard(){
            let flg = false;
            this.vipCardList.forEach(item => {
                if(item.editFlg){
                    flg = true;
                }
            });
            if(flg){
                this.$message({
                    type: 'error',
                    message: '请先保存当前正在编辑的会员卡'
                });
                return;
            }
            this.activeIndex = this.vipCardList.length;
            this.vipCardList.push({
                "data": {
                    memberCardBgUrl: '',
                    memberCenterColor: '#666'
                },
                "defaulted": false,
                "id": '',
                "status": 0,
                "title": "",
                "unlockPoints": 0,
                uploadFlg: false,
                editFlg: true
            });
        },
        delCard(item, index){
            let data = clone(item);
            this.$confirm('是否删除该会员卡', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                data.status = -1;
                data.data = JSON.stringify(data.data);
                ajax({
                    api_name: 'changeVipCardShelves',
                    vm: this,
                    data: data
                }, result => {
                    this.vipCardList.splice(index, 1);
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        changeColor(item){
            item.data.memberCenterColor = '#'+item.colorText;
        },
        changeColor1(item){
            item.colorText = item.data.memberCenterColor.split('#')[1];
        }
    },
    components: {
        userMobile,
        userClubTop
    }
}
</script>

<style lang="less">
    .cardBox .cardItem {
        .el-card__body{
            padding: 0 20px;
        }
        .cardItemFooter input{
            width: 100%;
            height: 20px;
            line-height: 20px;
        }
    }
</style>


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
    .cardBox{
        width: 550px;
        margin-left: 20px;
        display: inline-block;
        .cardItem{
            color: #666;
            font-size: 12px;
            margin-top: 25px;
            cursor: pointer;
            &:first-child{
                margin-top: 0;
            }
            &.active{
                border-color: #3089dc;
            }
            .cardItemTitle{
                border-bottom: 1px solid #F0F0F0;
                height: 33px;
                line-height: 33px;
                color: #666;
                span{
                    display: inline-block;
                    padding: 0 7px;
                    border: 1px solid #000;
                    border-radius: 4px;
                    height: 18px;
                    line-height: 18px;
                    margin-left: 10px;
                }
                .green{
                    color: #52C41A;
                    border-color: #B7EB8F;
                    background: #F6FFED;
                }
                .red{
                    color: #F5222D;
                    border-color: #FFA39E;
                    background: #FFF1F0;
                }
            }
            .cardItemCont{
                border-bottom: 1px solid #F0F0F0;
                font-size: 0;
                padding: 10px 0;
                color: #666;
                .cardItemContTop{
                    height: 20px;
                    line-height: 20px;
                    font-size: 0;
                    span{
                        font-size: 14px;
                        display: inline-block;
                        height: 20px;
                        width: 200px;
                        vertical-align: top;
                        .colorCard{
                            width: 14px;
                            height: 14px;
                            vertical-align: middle;
                            margin-left: 10px;
                            padding: 0;
                            border: none;
                            display: inline-block;
                            cursor: pointer;
                            .colorCard{
                                vertical-align: top;
                                margin-left: 0;
                            }
                        }
                    }
                }
                .cardItemContVal{
                    margin-top: 10px;
                    .center{
                        width: 150px;
                        height: 62px;
                        position: relative;
                        display: inline-block;
                        vertical-align: bottom;
                        margin-right: 10px;
                        .upload_box{
                            width: 150px;
                            height: 62px;
                        }
                        img{
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
            .cardItemFooter{
                height: 40px;
                line-height: 40px;
                font-size: 14px;
                .el-input{
                    width: 80px;
                }
                .itemEditBtn{
                    display: inline-block;
                    margin-left: 5px;
                    .blueBtn{
                        height: 20px;
                        line-height: 20px;
                        padding: 0px 8px;
                        border-radius: 3px;
                        border: 1px solid #3A9AF6;
                        font-size: 12px;
                        span{
                            color: #3A9AF6;
                        }
                    }
                    .grayBtn{
                        height: 20px;
                        line-height: 20px;
                        padding: 0px 8px;
                        border-radius: 3px;
                        border: 1px solid #ccc;
                        color: #666;
                        font-size: 12px;
                    }
                }
            }
        }
    }
    .blueBtn{
        border: 1px solid #3A9AF6;
        color: #3A9AF6;
        background: #fff;
    }
    .grayBtn{
        border: 1px solid #ccc;
        color: #666;
    }
</style>
