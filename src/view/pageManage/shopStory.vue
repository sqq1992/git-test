<template>
    <div class="m-content" v-loading="fullscreenLoading">
		<div class="m-content-main main_height">
			<div class="page_group">
                <div class="phone_page" ref="phonePage">
                    <div id="shopStory">
                        <div class="phone_page_group" v-for="(page, index) in data.page" :key="index" :style="whiteList.indexOf($store.state.user.venderId) != -1 ? 'height: 100%;overflow: hidden;border-bottom: 2px dashed #666;' : ''">
                            <div class="phone_page_item" :class="{'videoItem': modules.type == 'vedio', 'active': checkPoint[0] == index && checkPoint[1] == i}" v-for="(modules, i) in page.modules" :key="index+'_'+i" @click="checkAcitveData(modules, index, i)">
                                {{modules}}
                                <div v-if="modules.type == 'vedio' && modules.shopVideoUrl">
                                    <img :src="modules.imgsrc" alt="">
                                </div>
                                <div v-if="modules.type == 'vedio' && !modules.shopVideoUrl && modules.imgsrc" style="line-height: 210px;font-size: 14px;color: #fff;text-align: center;background: #ccc;">未填写视频地址</div>
                                <div v-if="modules.type == 'vedio' && !modules.shopVideoUrl && !modules.imgsrc" style="line-height: 210px;font-size: 14px;color: #fff;text-align: center;background: #ccc;">视频区域</div>
                                <div v-if="modules.type == 'img'">
                                    <img :src="modules.imgsrc" alt="" v-if="modules.imgsrc">{{modules.redirectRefId}},
                                    <div class="operation">
                                        <div v-if="(index > 0 && i > 0) || (index == 0 && i > 1)" class="operation_item up el-icon-arrow-up" data-type="up" @click.stop="moduleUp(page.modules, i)"></div>
                                        <div v-if="i < page.modules.length - 1" class="operation_item down el-icon-arrow-down" data-type="down" @click.stop="moduleDown(page.modules, i)"></div>
                                        <div class="operation_item del el-icon-delete" data-type="del" @click.stop="moduleDel(page.modules, i, index)"></div>
                                    </div>
                                    <a :href="modules.redirectUrl"></a>
                                    <div v-if="!modules.imgsrc" class="noImg"><span>+</span>上传图片</div>
                                </div>
                            </div>
                            <div class="addPageItem" @click="addPageItem(page.modules, index)"><el-button type="text">添加图片模块</el-button></div>
                        </div>
                    </div>
                    <p style="margin-top: 10px;color: #666;">以iPhone 6/7/8尺寸为例</p>
                    <div class="addPageGroup" v-if="whiteList.indexOf($store.state.user.venderId) != -1"><el-button type="text" @click="addPageGroup" style="margin-left: 5px;">添加新一屏</el-button></div>
                </div>
                <div class="control_container" ref="controlPage">
                    <page-link :url="`https://wdkj-isv.isvjcloud.com/?href=user/shopStory&shopId=${$store.state.user.shopId}&sellerId=${$store.state.user.venderId}&id=${$route.query.id}`" title="品牌故事预览" name="品牌故事"></page-link>
                    <!-- <page-link :url="`https://wdkj-isv.jdfw1.com/?href=user/shopStory&shopId=${$store.state.user.shopId}&sellerId=${$store.state.user.venderId}&id=${$route.query.id}`" title="品牌故事预览" name="品牌故事"></page-link> -->
                    <div class="page_ctrol">
                        <div class="module_ctrol imgs_ctrol">
                            <div class="module_ctrol_title">故事封面<span style="color: #999;margin-left: 20px;font-size: 12px;">将作为品牌故事的预加载页和背景图片，建议与品牌故事的主题色调一致</span></div>
                            <div class="module_ctrol_cont">
                                <span class="module_imgs_box" v-loading="data.shopStory.uploadFlg" style="line-height: 0;">
                                <el-upload
                                    class="module_imgs_box"
                                    action="/common/picUpload"
                                    :show-file-list="false"
                                    :on-success="handleBgSuccess"
                                    :on-error="handleAvatarError"
                                    :before-upload="handleBgUpload"
                                    >
                                    <img v-if="data.shopStory.storyCoverUrl" :src="data.shopStory.storyCoverUrl">
                                    <div v-else class="noImg"><span>+</span>上传图片</div>
                                </el-upload>
                                </span>
                                <div class="module_imgs_hint">建议最大尺寸：750 * 1206像素</div>
                                <div class="module_imgs_hint">图片不能超过1.5M</div>
                            </div>
                        </div>
                        <img-upload :showBottom="true" :data="currentAcitveData" v-if="currentAcitveData.type == 'img'"></img-upload>
                        <div class="module_ctrol vedio_ctrol" v-if="currentAcitveData.type == 'vedio'">
                            <div class="module_ctrol_title">上传店铺视频（若未上传则不显示视频播放区域）</div>
                            <div class="module_ctrol_cont">
                                <div class="module_ctrol_input">
                                    <p>输入视频地址：建议画面比例16：9，文件最大不能超过20M</p>
                                    <input type="text" placeholder="请输入视频地址" @blur="isValidURL(currentAcitveData.shopVideoUrl)" v-model="currentAcitveData.shopVideoUrl">
                                    <router-link :to="{name: 'promotionVedio'}" target="_blank">如何获取视频链接？</router-link>
                                </div>
                                <span class="module_imgs_box" v-loading="currentAcitveData.uploadFlg" style="line-height: 0;margin-top:15px;">
                                <el-upload
                                    class="module_imgs_box"
                                    action="/common/picUpload"
                                    :show-file-list="false"
                                    :on-success="handleAvatarSuccess"
                                    :before-upload="beforeAvatarUpload">
                                    <img v-if="currentAcitveData.imgsrc" :src="currentAcitveData.imgsrc">
                                    <div v-else class="noImg"><span>+</span>上传图片</div>
                                </el-upload>
                                </span>
                                <div class="module_imgs_hint">建议尺寸：750 * 420像素</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div style="text-align: center;">
                <el-button type="primary" @click="savePage">保存页面</el-button>
            </div>
		</div>
	</div>
</template>

<script>
    // import $ from 'jquery';
    import http from 'src/api/index.js';
    import { clone } from 'src/common/public.js';
    import pageLink from 'src/components/pageLink/pageLink';
    import imgUpload from 'src/components/imgUpload/imgUpload';
    /* 白名单显示 多屏 */
    const whiteList = [
        154183
    ];
	export default{
		data() {
			return{
                type: 'online',
                data: {
                    shopStory: {}
                },
                currentAcitveData: {},
                goodList: [],
                checkPoint: [],
                fullscreenLoading: true,
                whiteList
			}
        },
		created(){
        },
        mounted(){
            let id = this.$route.query.id;
            this.id = id;
            if(!id){
                this.$router.push({name: 'shopList'});
            }
            http({
                api_name: 'shopStoryQuery',
                vm: this,
                data: {id: id}
            }, result => {
                let array = [];
                result.data.page.forEach((page) => {
                    page.modules.forEach((modules) => {
                        modules.uploadFlg = false;
                    });
                    array = array.concat(page.modules);
                });
                if(whiteList.indexOf(this.$store.state.user.venderId) == -1){
                    result.data.page = array.length == 0 ? [] : [
                        {
                            modules: array
                        }
                    ];
                }
                result.data.shopStory.uploadFlg = false;
                this.data = result.data;
                if(this.data.page.length == 0){
                    this.data.page.push({
                        "modules": [
                            {
                                "canFollow": false,
                                "imgsrc": "",
                                "redirectRefId": "",
                                "redirectType": "",
                                "redirectUrl": "",
                                "shopVideoUrl": "",
                                "type": "vedio",
                                "uploadFlg": false
                            }
                        ]
                    });
                }
                console.log(this.data.page);
                this.$nextTick(() => {
                    this.fullscreenLoading = false;
                });
            });
        },
        methods: {
            isValidURL(url){
                if(url){
                    let urlRegExp=/^((https|http|ftp|rtsp|mms)?:\/\/)+[A-Za-z0-9\/=\?%\-&_~`@[\]\':+!]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/;
                    if(urlRegExp.test(url)){
                        return true;
                    }else{
                        this.$message({
                            message: '请输入正确url地址',
                            type: 'warning'
                        });
                        return false;
                    }
                }
            },
            addPageGroup(){
                this.data.page.push({
                    modules: [{
                        "canFollow": false,
                        "imgsrc": "",
                        "redirectRefId": "",
                        "redirectType": "",
                        "redirectUrl": "",
                        "shopVideoUrl": "",
                        "type": "img"
                    }]
                });
            },
            savePage(){
                let data = clone(this.data);
                try{
                    data.page.forEach((page) => {
                        page.modules.forEach((modules) => {
                            if(modules.type == 'vedio' && modules.shopVideoUrl){
                                if(!/\.300hu\.com/.test(modules.shopVideoUrl) && !/\.vod2\.myqcloud\.com/.test(modules.shopVideoUrl) && !/\.jcloudcache\.com/.test(modules.shopVideoUrl)){
                                    this.$message({
                                        message: '请填写已上传至京东后台的视频链接',
                                        type: 'warning'
                                    });
                                    throw '视频链接地址错误';
                                }
                            } else if(modules.type == 'img' && modules.redirectUrl){
                                if(!this.isValidURL(modules.redirectUrl)){
                                    throw '图片链接地址错误';
                                }
                            }
                        });
                    });
                    http({
                        api_name: 'shopStoryEdit',
                        data: {
                            id: this.id,
                            modules: JSON.stringify(data)
                        }
                    }, result => {
                        this.$message({
                            message: '保存成功',
                            type: 'success'
                        });
                        setTimeout(() => {
                            this.$router.push({name: 'shopList'});
                        }, 1000);
                    });
                } catch(e){
                    console.error(e);
                }
                // console.log(data);
                // for(let i in data){
                //     if(Array.isArray(data[i])){
                //         data[i] = JSON.stringify(data[i]);
                //     }
                // }
            },
            handleBgSuccess(file){
                if(file.result != 100){
                    this.$message.error(file.message);
                    this.data.shopStory.uploadFlg = false;
                    return;
                }
                this.data.shopStory.storyCoverUrl = file.data.picUrl;
                this.data.shopStory.uploadFlg = false;
            },
            handleAvatarError() {
              this.$message.error('图片上传失败，请重新上传');
            },
            handleBgUpload(file){
                const isIMAGE = /image\/\w+/.test(file.type);
                const isLt2M = file.size / 1024 / 1024 < 1.5;

                if (!isIMAGE) {
                    this.$message.error('上传图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传图片大小不能超过 1.5MB!');
                }
                if(isIMAGE && isLt2M){
                    this.data.shopStory.uploadFlg = true;
                }
                return isIMAGE && isLt2M;
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
                    this.currentAcitveData.uploadFlg = true;
                }
                return isIMAGE && isLt2M;
            },
            handleAvatarSuccess(file){
                if(file.result != 100){
                    this.$message.error(file.message);
                    this.currentAcitveData.uploadFlg = false;
                    return;
                }
                this.currentAcitveData.imgsrc = file.data.picUrl;
                this.currentAcitveData.uploadFlg = false;
            },
            checkAcitveData(data, x, y){
                this.currentAcitveData = data;
                this.checkPoint = [x, y];
            },
            moduleUp(modules, index){
                let data = modules.splice(index, 1)[0];
                modules.splice(index-1, 0, data);
            },
            moduleDown(modules, index){
                let data = modules.splice(index, 1)[0];
                modules.splice(index+1, 0, data);
            },
            moduleDel(modules, index, pageNo){
                this.currentAcitveData = {};
                modules.splice(index, 1);
                if(modules.length == 0){
                    this.data.page.splice(pageNo, 1);
                }
            },
            addPageItem(modules, index){
                modules.push({
                    "canFollow": false,
                    "imgsrc": "",
                    "redirectRefId": "",
                    "redirectType": "",
                    "redirectUrl": "",
                    "shopVideoUrl": "",
                    "type": "img"
                });
                this.checkAcitveData(modules[modules.length - 1], index, modules.length - 1);
            }
        },
		components: {
            pageLink,
            imgUpload
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
        .addPageGroup{
            text-align: center;
        }
        #shopStory {
            background: #f4f4f4;
            height: 100%;
            overflow: auto;
        }
        .phone_page_group {
            // height: 100%;
            // overflow: hidden;
            // border-bottom: 2px dashed #666;
        }
        .phone_page_item {
            width: 100%;
            min-height: 100px;
            font-size: 0;
            background: #fff;
            position: relative;
            border: 1px solid transparent;
            cursor: pointer;
            box-sizing: border-box;
            &.videoItem {
                height: 210px;
                overflow: hidden;
            }
            img {
                width: 100%;
            }
            &:first-child {
                margin-top: 0;
            }
            &.active{
                border: 1px solid #00adff;
            }
            .noImg{
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                text-align: center;
                line-height: 100px;
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
        .focus_component {
            position: absolute;
            display: inline-block;
            width: 50px;
            height: 20px;
            line-height: 20px;
            font-size: 12px;
            text-align: center;
            border-radius: 20px;
            right: 15px;
            top: 15px;
            overflow: hidden;
            div {
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
            }
            .focus_defalute {
                color: #fff;
                background: #3089de;
            }
            .foucs_active {
                background: #ebebeb;
                color: #666;
                display: none;
            }
        }
        .operation {
            position: absolute;
            height: 20px;
            line-height: 20px;
            display: flex;
            background: rgba(0,0,0,.5);
            top: 5px;
            right: 5px;
            border: 1px solid rgba(0,0,0,.5);
            z-index: 1;
            .operation_item {
                text-align: center;
                position: relative;
                height: 100%;
                cursor: pointer;
                width: 20px;
                line-height: 20px;
                color: rgba(255, 255, 255, 0.5);
                font-size: 12px;
                &:after {
                    content: "";
                    display: inline-block;
                    width: 1px;
                    height: 100%;
                    border-left: 1px solid #fff;
                    position: absolute;
                    right: 0;
                    top: 0;
                }
                &:last-child {
                    &:after {
                        display: none;
                    }
                }
                &:hover{
                    color: rgba(255, 255, 255, 1);
                    transition: color ease .5s;
                }
            }
        }
        .addPageItem {
            text-align: center;
            height: 30px;
            line-height: 30px;
        }

    }
    .control_container{
        display: inline-block;
        width: 600px;
        min-height: 667px;
        vertical-align: top;
        margin-left: 20px;
        .page_link{
            height: 35px;
            line-height: 35px;
            border: 1px solid #e6e6e6;
            background: #fafafa;
            padding-left: 20px;
            font-size: 12px;
            position: relative;
            span{
                display: inline-block;
                max-width: 460px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                vertical-align: top;
            }
            &:after{
                position: absolute;
                content: '';
                border: 7px solid transparent;
                border-right: 7px solid #fafafa;
                top: 9px;
                left: -14px;
            }
            &:before{
                position: absolute;
                content: '';
                border: 8px solid transparent;
                border-right: 8px solid #e6e6e6;
                top: 8px;
                left: -16px;
            }
            .el-button, .el-textarea__inner{
                font-size: 12px;
            }
        }
        .module_ctrol{
            width: 555px;
            border: 1px solid #e6e6e6;
            background: #fafafa;
            border-radius: 2px;
            padding: 0 20px 12px;
            box-sizing: border-box;
            margin-top: 20px;
            .module_ctrol_title{
                height: 33px;
                line-height: 33px;
                border-bottom: 1px solid #E6E6E6;
                counter-reset: #666;
                font-size: 12px;
            }
            .module_ctrol_input{
                p{
                    height: 40px;
                    line-height: 40px;
                    color: #666;
                    font-size: 12px;
                }
                input{
                    width: 360px;
                }
                a{
                    color: #3089DE;
                    font-size: 12px;
                    margin-left: 10px;
                }
            }
            .module_ctrol_cont{
                padding-top: 15px;
            }
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
                img {
                    width: 125px;
                    height: 60px;
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
            .module_imgs_hint{
                display: inline-block;
                vertical-align: bottom;
                margin-left: 5px;
                color: #999;;
                margin-top: 15px;
                font-size: 12px;
            }
            .module_imgs_link_box{
                margin-top: 12px;
                .module_imgs_link_hint{
                    color: #666;
                    font-size: 12px;
                }
                .module_imgs_link_choose{
                    margin-top: 10px;
                    a{
                        margin-left: 5px;
                        color: #3089DE;
                    }
                }
                .module_imgs_link_focus{
                    margin-top: 13px;
                }
            }
        }
    }
    .imgLink_choose_dialog{
        .choose_good_link_title{
            input{
                width: 200px;
            }
        }
        .choose_good_link_body{
            margin-top: 20px;
            .choose_good_link_body_top{
                height: 40px;
                line-height: 40px;
                background: #e6e6e6;
                font-size: 12px;
            }
            .choose_good_link_body_name{
                width: ~'calc(100% - 75px)';
                display: inline-block;
                padding-left: 12px;
                box-sizing: border-box;
                vertical-align: top;
            }
            .choose_good_link_body_otps{
                width: 70px;
                text-align: center;
                display: inline-block;
                vertical-align: top;
            }
            .choose_good_link_body_item{
                height: 70px;
                padding: 12px 0;
                box-sizing: border-box;
                .choose_good_link_body_item_img{
                    width: 48px;
                    height: 48px;
                    display: inline-block;
                    vertical-align: top;
                    border-radius: 4px;
                    overflow: hidden;
                }
                .choose_good_link_body_item_text{
                    display: inline-block;
                    color: #333;
                    font-size: 14px;
                    width: ~'calc(100% - 65px)';
                    margin-left: 10px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    vertical-align: top;
                }
                .choose_good_link_body_otps{
                    margin-top: 5px;
                }
                &:nth-child(odd){
                    background: #fff;
                }
                &:nth-child(even){
                    background: #fafafa;
                }
            }
        }
        .choose_good_link_body_footer{
            text-align: right;
        }
    }
</style>
