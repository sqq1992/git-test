<template>
    <div>
        <div class="module_ctrol imgs_ctrol">
            <div class="module_ctrol_title">上传图片</div>
            <div class="module_ctrol_cont">
                <span class="module_imgs_box" v-loading="data.uploadFlg" style="line-height: 0;">
                <el-upload
                    class="module_imgs_box"
                    action="/common/picUpload"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                    >
                    <img v-if="data.imgsrc" :src="data.imgsrc">
                    <div v-else class="noImg"><span>+</span>上传图片</div>
                </el-upload>
                </span>
                <div class="module_imgs_hint">建议最大尺寸：750 * 1206像素</div>
                <div class="module_imgs_hint">图片不能超过1.5M</div>
                <div class="module_imgs_link_box">
                    <div class="module_imgs_link_hint">设置跳转链接：（不设置则点击图片后不跳转）</div>
                    <div class="module_imgs_link_choose">
                        <span>{{data.redirectType}}</span>
                        <el-button type="text" @click="showImgLinkDialog">{{data.redirectType ? '重新' : ''}}设置</el-button>
                    </div>
                    <div class="module_imgs_link_focus" v-if="showBottom"><el-checkbox v-model="data.canFollow" :disabled="data.redirectType == '自定义链接' || !data.redirectType ">{{data.redirectType == '店铺首页' ? '支持用户快速关注' : '显示“查看商品”按钮'}}</el-checkbox></div>
                </div>
            </div>
        </div>
        <div class="imgLink_choose_dialog">
            <el-dialog title="设置跳转链接" :visible.sync="dialogTableVisible" size="tiny">
                <div class="link_title_box">
                    <el-radio class="radio" v-model="linkTyep" label="1">商品链接</el-radio>
                    <el-radio class="radio" v-model="linkTyep" label="2">店铺首页</el-radio>
                    <el-radio class="radio" v-model="linkTyep" label="3">自定义链接</el-radio>
                </div>
                <div class="choose_link_box" style="margin-top: 20px;">
                    <div class="choose_good_link" v-if="linkTyep == 1">
                        <div class="choose_good_link_title">
                            <el-select v-model="queryType" placeholder="请选择" style="width: 110px;">
                                <el-option label="商品名称" :value="0"></el-option>
                                <el-option label="商品编号" :value="1"></el-option>
                            </el-select>
                            <input type="text" v-model="pageData.searchKey"><el-button type="text" style="margin-left: 10px;" @click="queryGoodList">搜索</el-button>
                        </div>
                        <div class="choose_good_link_body">
                            <div class="choose_good_link_body_top">
                                <div class="choose_good_link_body_name">商品信息</div>
                                <div class="choose_good_link_body_otps">操作</div>
                            </div>
                            <div class="choose_good_link_body_cont">
                                <div class="choose_good_link_body_item" v-for="(good, index) in goodList" :key="'goodLink_'+index">
                                    <div class="choose_good_link_body_name">
                                        <div class="choose_good_link_body_item_img">
                                            <img :src="good.logo" alt="" width="100%" height="100%">
                                        </div>
                                        <div class="choose_good_link_body_item_text">{{good.title}}</div>
                                    </div>
                                    <div class="choose_good_link_body_otps">
                                        <el-button type="text" @click="checkGoodLink(good)">{{data.redirectType == good.title ? '已' : ''}}选取</el-button>
                                    </div>
                                </div>
                            </div>
                            <div class="choose_good_link_body_footer">
                                <el-pagination
                                    layout="prev, pager, next"
                                    :current-page="pageData.pageNo"
                                    @current-change="_queryGoodList"
                                    :total="pageData.total">
                                </el-pagination>
                            </div>
                        </div>
                    </div>
                    <div class="choose_idnex_link" v-if="linkTyep == 2">店铺地址：{{data.redirectUrl}}</div>
                    <div class="choose_custom_link" v-if="linkTyep == 3">
                        输入链接：<input type="text" @blur="isValidURL(data.redirectUrl)" v-model="data.redirectUrl" style="width: 300px;" placeholder="仅支持*.jd.com 、*.360buyimg.com 以及 *.isvjcloud.com 的链接">
                        <!-- 输入链接：<input type="text" @blur="isValidURL(data.redirectUrl)" v-model="data.redirectUrl" style="width: 300px;" placeholder="仅支持*.jd.com 、*.360buyimg.com 以及 *.jdfw1.com 的链接"> -->
                    </div>
                </div>
                <span slot="footer" class="dialog-footer" v-if="linkTyep != 1">
                    <el-button @click="closeImgLink()">取 消</el-button>
                    <el-button type="primary" @click="checkImgLink()">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import http from 'src/api/index.js';
import { clone } from 'src/common/public.js';
export default {
    props: {
        data: {
            type: Object,
            default: {}
        },
        showBottom: {
            type: Boolean,
            default: true
        }
    },
    data(){
        return {
            linkTyep: 0,
            pageData: {
                pageNo: 1,
                pageSize: 5,
                searchKey: '',
                total: 0
            },
            goodList: [],
            temporaryData: {},
            dialogTableVisible: false,
            indexHref: '',
            queryType: 0
        }
    },
    watch: {
        'linkTyep'() {
            if(this.linkTyep == 2){
                this.data.redirectUrl = this.indexHref;
            } else if(this.linkTyep == 3){
                this.data.redirectUrl = this.temporaryData.redirectType == '自定义链接' ? this.temporaryData.redirectUrl : '';
            }
        }
    },
    created(){
        this.indexHref = 'https://shop.m.jd.com/?shopId='+this.$store.state.user.shopId;
    },
    methods: {
        isValidURL(url){
            if(url){
                let urlRegExp=/^((https|http|ftp|rtsp|mms)?:\/\/)+[A-Za-z0-9\/=\?%\-&_~`@[\]\':+!]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/;
                if(urlRegExp.test(url)){
                    let reg = /^((ftp|rtsp|mms)?:\/\/)+[A-Za-z0-9\/=\?%\-&_~`@[\]\':+!]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/;
                    if(reg.test(url)){
                        this.$message({
                            message: '请输入正确url地址',
                            type: 'warning'
                        });
                        return false;
                    }
                }else{
                    if(url.substr(0, 2) == '//'){
                        this.data.redirectUrl = 'https:' + this.data.redirectUrl;
                    } else if(url.substr(0, 1) == '/'){
                        this.data.redirectUrl = 'https:/' + this.data.redirectUrl;
                    } else if(url.substr(0, 1) == ':'){
                        this.data.redirectUrl = 'https' + this.data.redirectUrl;
                    } else {
                        this.data.redirectUrl = 'https://' + this.data.redirectUrl;
                    }
                }
            }
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
                this.data.uploadFlg = true;
            }
            return isIMAGE && isLt2M;
        },
        handleAvatarSuccess(file){
            if(file.result != 100){
                this.$message.error(file.message);
                this.data.uploadFlg = false;
                return;
            }
            this.$set(this.data, 'imgsrc', file.data.picUrl);
            // this.data.imgsrc = file.data.picUrl;
            this.data.uploadFlg = false;
            this.saveDAta();
        },
        queryGoodList(){
            this._queryGoodList(1);
        },
        showImgLinkDialog(){
            this.queryGoodList();
            if(this.data.redirectType == '店铺首页'){
                this.linkTyep = '2';
                this.data.redirectUrl = this.indexHref;
            } else if(this.data.redirectType == '自定义链接'){
                this.linkTyep = '3';
            } else {
                this.linkTyep = '1';
            }
            this.temporaryData = clone(this.data);
            this.dialogTableVisible = true;
        },
        _queryGoodList(pageNo){
            this.pageData.pageNo = pageNo;
            let data = clone(this.pageData);
            if(this.queryType == 0){
                data.title = data.searchKey;
                data.wareIdStr = '';
            } else {
                data.wareIdStr = data.searchKey;
                data.title = '';
            }
            delete data.searchKey;
            http({
                api_name: 'activityQueryWare',
                data: data,
                vm: this
            }, (result) => {
                this.goodList = result.data.wareList;
                this.pageData.total = result.data.totalCount;
            });
        },
        checkGoodLink(good){
             // this.redirectUrl = 'http://m.jd.com?shopId='+this.$store.state.user.shopId+'&skuId='+good.firstSkuId;
            this.redirectUrl = 'https://item.m.jd.com/product/'+good.firstSkuId+'.html';
            this.data.redirectType = good.title;
            this.checkImgLink();
        },
        checkImgLink(){
            try{
                if(this.linkTyep == 2){
                    this.data.redirectType = '店铺首页';
                    this.data.redirectUrl = this.indexHref;
                } else if(this.linkTyep == 3){
                    this.data.redirectType = '自定义链接';
                    this.data.canFollow = false;
                    if(!/\.jd\.com/.test(this.data.redirectUrl) && !/\.isvjcloud\.com/.test(this.data.redirectUrl) && !/\.360buyimg\.com/.test(this.data.redirectUrl)){
                        this.$message({
                            message: '请输入正确的京东平台链接地址',
                            type: 'warning'
                        });
                        throw '自定义链接错误';
                    }
                }
                this.dialogTableVisible = false;
                this.saveDAta();
            } catch(e){
                console.error(e);
            }
        },
        closeImgLink(){
            this.data.redirectType = this.temporaryData.redirectType;
            this.data.redirectUrl = this.temporaryData.redirectUrl;
            this.dialogTableVisible = false;
            this.saveDAta();
        },
        saveDAta(){
            this.$emit('checkImgLink', this.data);
        }
    }
}
</script>

<style lang="less">
    .choose_good_link_title{
        .el-input .el-input__inner{
            width: 100%;
            height: 100%;
        }
    }
</style>


<style lang="less" scoped>
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
                width: 380px;
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

