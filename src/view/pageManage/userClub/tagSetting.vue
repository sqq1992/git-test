<template>
    <div>
        <user-club-top></user-club-top>
        <div class="tagBox" v-loading="fullscreenLoading">
            <p style="margin-top: 20px;">
                <el-button type="primary" @click="downloadImage">下载头像徽章示例</el-button>
            </p>
            <el-card class="tagItem" :class="{'active': activeIndex == index}" v-for="(item, index) in tagList" :key="'tagItem_'+index">
                <div @click="activeItem(index)">
                    <div class="tagItemTitle" v-if="!item.editFlg">
                        {{item.title}} <span :class="{green: item.status == 1, red: item.status == 0}">{{item.status == 1 ? '已上架' : '未上架'}}</span>
                        <strong style="float: right;">
                            <el-button type="text" @click="vipTagEdit(item, index)">修改</el-button>
                            <el-button type="text" v-if="!item.defaulted" @click="delTag(item, index)">删除</el-button>
                        </strong>
                    </div>
                    <div class="tagItemTitle" v-if="item.editFlg">
                        <input type="text" v-model.trim="item.title" style="height: 12px;" placeholder="请输入头像徽章名称" :maxlength="6"> {{item.title.length}}/6
                    </div>
                    <div class="tagItemCont">
                        <div class="userAvart" v-if="!item.editFlg">
                            <img :src="defaultAvatar" alt="">
                            <div class="userTag">
                                <img :src="item.data.memberTagImgUrl" alt="">
                            </div>
                        </div>
                        <el-upload
                            action="/common/picUpload"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :on-error="handleAvatarError"
                            :before-upload="beforeAvatarUpload"
                            v-loading="item.data.uploadFlg"
                            v-if="item.editFlg">
                            <div class="userAvart" v-if="item.data.memberTagImgUrl">
                                <img :src="defaultAvatar" alt="">
                                <div class="userTag" v-if="item.data.memberTagImgUrl">
                                    <img :src="item.data.memberTagImgUrl" alt="">
                                </div>
                            </div>
                            <div v-if="!item.data.memberTagImgUrl" class="noImg">
                                <span>+</span>
                                <strong>建议尺寸：240 * 240 px <br> 透明png图片</strong>
                            </div>
                        </el-upload>
                    </div>
                    <div class="tagItemFooter">
                        解锁积分：
                        <el-input v-model="item.unlockPoints" :disabled="!item.editFlg" :maxlength="6"></el-input>
                        <div class="itemEditBtn" v-if="item.editFlg">
                            <el-button class="blueBtn" type="text" @click="vipTagCheckEdit(item)">确定</el-button>
                            <el-button class="grayBtn" type="text" @click="vipTagCloseEdit(item, index)">取消</el-button>
                        </div>
                        <div class="itemEditBtn" v-else>
                            <el-button :class="{'blueBtn': item.status == 0, 'grayBtn': item.status == 1}" type="text" @click="vipTagShelves(item)">{{item.status == 1 ? '下架' : '上架'}}</el-button>
                        </div>
                    </div>
                </div>
            </el-card>
            <el-card class="tagItem" v-if="tagList.length < 10">
                <div class="addTagItem" @click="addTagItem">
                    <i class="el-icon-plus"></i>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
import ajax from 'src/api/index.js';
import { clone, downloadImage } from 'src/common/public.js';
import { isIntNum } from 'src/common/validation.js';
import defaultAvatar from 'src/assets/images/defaultAvatar.jpg';
import userClubTop from 'src/components/user-club-top/user-club-top';
export default {
    data(){
        return {
            fullscreenLoading: true,
            defaultAvatar: defaultAvatar,
            tagList: [],
            activeIndex: -1
        }
    },
    created(){
        this.getVipTagList();
    },
    methods: {
        getVipTagList(){
            ajax({
                api_name: 'getVipTagList',
                data: {
                    memberPrivilegeType: 'AVATAR_BADGE'
                },
                vm: this
            }, result => {
                result.data.resultList.forEach((card) => {
                    this.$set(card, 'editFlg', false);
                });
                this.tagList = result.data.resultList;
                this.fullscreenLoading = false;
            });
        },
        vipTagShelves(item){
            let data = clone(item);
            data.status = data.status == 1 ? 0 : 1;
            data.data = JSON.stringify(data.data);
            ajax({
                api_name: 'changeVipTagShelves',
                vm: this,
                data: data
            }, result => {
                item.status = data.status;
                this.$message({
                    message: data.status ? '上架成功' : '下架成功'
                });
            });
        },
        activeItem(index){
            let flg = false;
            this.tagList.forEach(tag => {
                tag.editFlg == true ? flg = true : '';
            });
            if(flg) return;
            this.activeIndex = index;
        },
        vipTagEdit(data, index){
            let flg = false;
            this.tagList.forEach(tag => {
                tag.editFlg == true ? flg = true : '';
            });
            if(flg){
                this.$message({
                    type: 'error',
                    message: '请先保存当前正在编辑的头像徽章'
                });
                return;
            }
            this.activeIndex = index;
            this.copyCardData = clone(data);
            data.editFlg = true;
        },
        // 修改 会员卡 解锁积分
        vipTagCheckEdit(item){
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
                    message: '头像徽章名称不能为空'
                });
                return;
            }
            if(data.title.length > 6){
                this.$message({
                    type: 'error',
                    message: '头像徽章名称最多只能6个字符'
                });
                return;
            }
            if(!data.data.memberTagImgUrl){
                this.$message({
                    type: 'error',
                    message: '请上传头像徽章图片'
                });
                return;
            }
            item.editFlg = false;
            data.data = JSON.stringify(data.data);
            ajax({
                api_name: 'saveVipTagData',
                vm: this,
                data: data
            }, result => {
                this.$message({
                    message: data.id ? '修改成功' : '创建成功'
                });
                this.getVipTagList();
            }, result => {
                item.editFlg = true;
            });
        },
        vipTagCloseEdit(data, i){
            if(data.id){
                this.$set(this.tagList, i, this.copyCardData);
                this.tagList[i].editFlg = false;
            } else {
                this.tagList.splice(i, 1);
            }
        },
        handleAvatarSuccess(file) {
            if(file.result != 100){
                this.$message.error(file.message);
                return;
            }
            this.tagList[this.activeIndex].data.memberTagImgUrl = file.data.picUrl;
            this.tagList[this.activeIndex].uploadFlg = false;
        },
        handleAvatarError() {
          this.$message.error('图片上传失败，请重新上传');
        },
        beforeAvatarUpload(file) {
            const isIMAGE = /image\/\w+/.test(file.type);
            const isLt2M = file.size / 1024 / 1024 < 1.5;

            if (!isIMAGE) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 1.5MB!');
            }
            if(isIMAGE && isLt2M){
                this.tagList[this.activeIndex].uploadFlg = true;
            }
            return isIMAGE && isLt2M;
        },
        addTagItem(){
            let flg = false;
            this.tagList.forEach(item => {
                if(item.editFlg){
                    flg = true;
                }
            });
            if(flg){
                this.$message({
                    type: 'error',
                    message: '请先保存当前正在编辑的头像徽章'
                });
                return;
            }
            this.activeIndex = this.tagList.length;
            this.tagList.push({
                "data": {
                    memberTagImgUrl: ''
                },
                "defaulted": false,
                "id": '',
                "status": 0,
                "title": "",
                "unlockPoints": 0,
                type: "AVATAR_BADGE",
                uploadFlg: false,
                editFlg: true
            });
        },
        delTag(item, index){
            let data = clone(item);
            this.$confirm('是否删除该头像徽章', '提示', {
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
                    this.tagList.splice(index, 1);
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
        downloadImage(){
            downloadImage('http://img11.360buyimg.com/imgzone/jfs/t21994/4/377884509/37665/ad256e53/5b0bbdc4N84a57c1f.png', '头像徽章示例');
        }
    },
    components: {
        userClubTop
    }
}
</script>

<style lang="less">
    .tagBox .tagItem {
        .el-card__body{
            padding: 0 12px;
        }
        .tagItemFooter input{
            width: 100%;
        }
    }
</style>

<style lang="less" scoped>

    .tagBox{
        padding: 0 30px;
        .tagItem{
            width: 245px;
            color: #666;
            font-size: 12px;
            margin-top: 25px;
            margin-right: 20px;
            cursor: pointer;
            display: inline-block;
            vertical-align: top;
            &.active{
                border-color: #3089dc;
            }
            .tagItemTitle{
                border-bottom: 1px solid #F0F0F0;
                height: 40px;
                line-height: 40px;
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
            .tagItemCont{
                border-bottom: 1px solid #F0F0F0;
                font-size: 0;
                padding: 20px 0;
                text-align: center;
                position: relative;
                .userAvart{
                    width: 106px;
                    height: 106px;
                    display: inline-block;
                    position: relative;
                    border: 1px dashed #ccc;
                    border-radius: 4px;
                    padding: 15px;
                    box-sizing: border-box;
                    img{
                        width: 76px;
                        height: 76px;
                    }
                    .userTag{
                        position: absolute;
                        width: 65px;
                        height: 65px;
                        top: -50%;
                        left: 50%;
                        transform: translate(-50%, 80%);
                        img{
                            width: 100%;
                            height: 100%;
                        }
                    }
                }
                .noImg {
                    width: 100%;
                    height: 106px;
                    text-align: center;
                    color: #fff;
                    border-radius: 5px;
                    font-size: 14px;
                    padding: 15px;
                    box-sizing: border-box;
                    span {
                        display: block;
                        transform: scaleY(0.9);
                        font-size: 22px;
                        width: 80px;
                        height: 40px;
                        line-height: 40px;
                        border-radius: 2px;
                        background: #ccc;
                        margin: 0 auto;
                    }
                    strong{
                        font-size: 12px;
                        color: #999;
                        margin-top: 23px;
                        display: inline-block;
                    }
                }
            }
            .tagItemFooter{
                height: 40px;
                line-height: 40px;
                .el-input{
                    width: 50px;
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
            .addTagItem{
                text-align: center;
                height: 225px;
                line-height: 225px;
                font-size: 70px;
                color: #999;
            }
        }
    }
</style>

