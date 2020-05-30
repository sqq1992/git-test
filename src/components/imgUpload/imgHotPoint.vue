<template>
    <div>
        <div class="module_ctrol imgs_ctrol">
            <div class="top_banner">
              自定义切图
            </div>
            <div class="module_ctrol_cont" v-for="(item, index) in currentData.picUrls" :key="index" :class="{'show': index == currIndex}">
                <div class="label">上传图片</div>
                <span class="module_imgs_box" v-loading="item.uploadFlg" style="line-height: 0;">
                <el-upload
                    class="module_imgs_box"
                    action="/common/picUpload"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                     :on-error="handleAvatarError"
                    :before-upload="beforeAvatarUpload"
                    >
                    <img v-if="item.imgsrc" :src="item.imgsrc">
                    <div v-else class="noImg">
                        <span>+</span><br/>
                        <span class="txt">上传图片</span>
                    </div>
                </el-upload>
                </span>
                <div class="module_imgs_hint">建议最大尺寸：750 * 1206像素</div>
                <div class="module_imgs_hint">图片不能超过1.5M</div>
            </div>
            <div class="module_imgs_link_box">
                <ul>
                  <li v-for="(point,index) in currentData.pointArr" :key="index">
                    <span>热点{{index + 1}}:</span>
                    <el-input v-model="point.url" @blur="editAddress(point)"></el-input>
                    <el-button type="text" @click="showImgLinkDialog(index)">链接</el-button>
                    <el-button type="text" v-if="currentData.pointArr.length > 1" @click="delPoint(index)">删除</el-button>
                  </li>
                </ul>
                <el-button type="primary" size="small" v-if="currentData.pointArr.length < 5" @click="addPoint">添加热点</el-button>
              </div>
        </div>
        <div class="_imgLink_choose_dialog">
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
                    <div class="choose_idnex_link" v-if="linkTyep == 2">店铺地址：{{redirectUrl}}</div>
                    <div class="choose_custom_link" v-if="linkTyep == 3">
                        输入链接：<input type="text" @blur="isValidURL(redirectUrl)" v-model="redirectUrl" style="width: 300px;" placeholder="仅支持*.jd.com 、*.360buyimg.com 以及 *.isvjcloud.com 的链接">
                        <!-- 输入链接：<input type="text" @blur="isValidURL(redirectUrl)" v-model="redirectUrl" style="width: 300px;" placeholder="仅支持*.jd.com 、*.360buyimg.com 以及 *.jdfw1.com 的链接"> -->
                    </div>
                </div>
                <span slot="footer" class="dialog-footer" v-if="linkTyep != 1">
                    <el-button @click="closeImgLink()">取 消</el-button>
                    <el-button type="primary" @click="checkPointData()">确 定</el-button>
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
        currentData: {
            type: Object,
            default(){
                return {};
            },
        },
        showBottom: {
            type: Boolean,
            default: true
        },
        index: {
            type: Number,
            default: 0
        }
    },
    data(){
        return {
            linkTyep: "1",
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
            queryType: 0,
            labelMap: ['单', '双', '三'],
            currIndex: 0,
            data: {},
            consultMsg: {},
            currPicMsg: {},
            isAgain: false,
            urlIndex:null,
            redirectUrl:""
        }
    },
    watch: {
        'linkTyep'() {
            if(this.linkTyep == 2){
                this.redirectUrl = this.indexHref;
            } else if(this.linkTyep == 3){
                this.redirectUrl = this.temporaryData.redirectType == '自定义链接' ? this.temporaryData.redirectUrl : '';
            }
        },
        'index'() {
            this.initData();
        },
        'dataArr'() {
            //多张图片需要参照物
            if(this.dataArr.length > 1) {
                this.dataArr.forEach(item => {
                    if(item.consult) {
                       this.consultMsg = {
                          width: item.width,
                          height: item.height
                       }
                    }
                })
            }
        }
    },
    created(){
        this.indexHref = 'https://shop.m.jd.com/?shopId='+this.$store.state.user.shopId;
        this.initData();
    },
    methods: {
        initData() {
            this.currIndex = 0;
            this.data = this.currentData;
            this.isAgain = false;
            this.consultMsg = {};
            this.currPicMsg = {};
        },
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
                        this.redirectUrl = 'https:' + this.redirectUrl;
                    } else if(url.substr(0, 1) == '/'){
                        this.redirectUrl = 'https:/' + this.redirectUrl;
                    } else if(url.substr(0, 1) == ':'){
                        this.redirectUrl = 'https' + this.redirectUrl;
                    } else {
                        this.redirectUrl = 'https://' + this.redirectUrl;
                    }
                }
            }
        },
        beforeAvatarUpload(file) {
            this.indexHref = 'https://shop.m.jd.com/?shopId='+this.$store.state.user.shopId;
            let vm = this;
            const isIMAGE = /image\/\w+/.test(file.type);
            const isLt2M = file.size / 1024 / 1024 < 1.5;

            if (!isIMAGE) {
                this.$message.error('上传图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 1.5MB!');
            }
            if(isIMAGE && isLt2M){
                // this.data.uploadFlg = true;
                this.$set(vm.data.picUrls[0], 'uploadFlg', true);
                this.$emit('uploadSet', true);
            }
            //获取上传图片的宽高
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function(e){
                let img = new Image();
                img.src = e.target.result;
                img.onload = function () {
                    if(!vm.consultMsg.width || vm.data.picUrls[0].consult) {
                        vm.consultMsg = {
                            height: this.height,
                            width: this.width
                        }
                        let _w = 356;
                        if(vm.currentData.picUrls.length == 2) {
                            _w = 164;
                        }else if(vm.currentData.picUrls.length == 3) {
                            _w = 105;
                        }
                        vm.$set(vm.data.picUrls[0], 'width', _w);
                        vm.$set(vm.data.picUrls[0], 'height', parseInt((_w/this.width) * this.height));
                        //参照物的值被修改了，其他图片重新计算宽高
                        if(vm.data.picUrls[0].consult) {
                            vm.isAgain = true;
                        }
                        vm.$set(vm.data.picUrls[0], 'consult', 1);
                    }else {
                        vm.currPicMsg = {
                            height: this.height,
                            width: this.width
                        }
                    }
                }
            }
            return isIMAGE && isLt2M;
        },
        handleAvatarSuccess(file){
            let vm = this;
            if(file.result != 100){
                this.$message.error(file.message);
                this.$set(this.data, 'uploadFlg', false);
                this.$emit('uploadSet', false);
                return;
            }
            //图片参照物
            if(!vm.data.picUrls[0].consult) {
                let consultSize = vm.consultMsg.height / vm.consultMsg.width;
                let vmSize = vm.currPicMsg.height / vm.currPicMsg.width;
                //判断是双列还是三列
                let _w = 0;
                if(vm.currentData.picUrls.length == 2) {
                    _w = 164;
                }else if(vm.currentData.picUrls.length == 3) {
                    _w = 105;
                }
                //情况B，等高裁宽
                if(consultSize >  vmSize) {
                    let _h = parseInt((_w/vm.consultMsg.width) * vm.consultMsg.height);
                    vm.$set(vm.data.picUrls[0], 'width', parseInt((_h/vm.currPicMsg.height) * vm.currPicMsg.width));
                    vm.$set(vm.data.picUrls[0], 'height', _h);
                    vm.$set(vm.data.picUrls[0], 'consultHeight', _h);
                }else {
                    //情况A，等宽裁高
                    vm.$set(vm.data.picUrls[0], 'width', _w);
                    vm.$set(vm.data.picUrls[0], 'height', parseInt((_w/vm.currPicMsg.width) * vm.currPicMsg.height));
                    vm.$set(vm.data.picUrls[0], 'consultHeight', parseInt((_w/vm.consultMsg.width) * vm.consultMsg.height));
                }
            }
            vm.$set(vm.data.picUrls[0], 'imgsrc', file.data.picUrl);
            vm.$set(vm.data.picUrls[0], 'uploadFlg', false);
            this.$emit('uploadSet', false);
            vm.saveDAta();
        },
        handleAvatarError() {
          this.$message.error('图片上传失败，请重新上传');
        },
        againCompute() {

        },
        queryGoodList(){
            this._queryGoodList(1);
        },
        showImgLinkDialog(index){
            this.queryGoodList();
            // if(this.data.redirectType == '店铺首页'){
            //     this.linkTyep = '2';
            //     this.data.redirectUrl = this.indexHref;
            // } else if(this.data.redirectType == '自定义链接'){
            //     this.linkTyep = '3';
            // } else {
            //     this.linkTyep = '1';
            // }
            this.urlIndex = index;
            this.temporaryData = clone(this.data.pointArr[index]);
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

            // this.data.redirectType = good.title;
            this.checkPointData();
        },
        checkPointData(){
            try{
                if(this.linkTyep == 2){
                    // this.data.redirectType = '店铺首页';
                    this.redirectUrl = this.indexHref
                } else if(this.linkTyep == 3){
                    // this.data.redirectType = '自定义链接';
                    // this.data.canFollow = false;
                    if(!/\.jd\.com/.test(this.redirectUrl) && !/\.isvjcloud\.com/.test(this.redirectUrl) && !/\.360buyimg\.com/.test(this.redirectUrl)){
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
            // this.data.redirectType = this.temporaryData.redirectType;
            // this.data.redirectUrl = this.temporaryData.redirectUrl;
            this.dialogTableVisible = false;
            // this.saveDAta();
        },
        editAddress(point) {
          if(!point.url) return;
          if(!/\.jd\.com/.test(point.url) && !/\.isvjcloud\.com/.test(point.url) && !/\.360buyimg\.com/.test(point.url)){
              this.$message({
                  message: '请输入正确的京东平台链接地址',
                  type: 'warning'
              });
            point.url = ""
            return;
          }
        },
        delPoint(index) {
          this.data.pointArr.splice(index,1);
          this.saveDAta();
        },
        addPoint() {
          if(this.data.pointArr.length >= 5)return;
          this.data.pointArr.push({
            url:'',
            width:50,
            height:50,
            left:140,
            top:50,
          })
          this.urlIndex = null;
          this.saveDAta();
        },
        saveDAta(){
          if(this.urlIndex != null) {
            this.data.pointArr[this.urlIndex].url = this.redirectUrl;
          }
          this.$emit('checkPointData', this.data, this.currIndex, this.isAgain);
        }
    }
}
</script>



<style lang="less">
    .module_ctrol{
        width: 555px;
        border: 1px solid #e6e6e6;
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
        .nav_top {
            font-size: 0;
            margin-top: 15px;
            li {
                width: 60px;
                height: 28px;
                display: inline-block;
                border: 1px solid #ccc;
                font-size: 12px;
                color: #666;
                border-right: 0;
                text-align: center;
                line-height: 28px;
                cursor: pointer;
                &:first-child {
                    border-top-left-radius: 4px;
                    border-bottom-left-radius: 4px;
                }
                &:last-child {
                    border-top-right-radius:4px;
                    border-bottom-right-radius:4px;
                    border-right: 1px solid #ccc;
                }
                &.active {
                    color: #fff;
                    background: #666666;
                }
            }
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
        .top_banner {
          font-size: 14px;
          color: #666666;
          padding-top:20px;
          padding-bottom:9px;
          border-bottom:1px solid #F0F0F0;
        }
        .module_ctrol_cont{
            padding-top: 15px;
            display: none;
            padding-bottom:20px;
            border-bottom:1px solid #F0F0F0;
            &.show {
                display: block;
            }
            .label {
                font-size: 14px;
                color: #666666;
                margin-bottom: 12px;
            }
        }
        .module_imgs_box {
            width: 160px;
            height: 90px;
            border-radius: 5px;
            overflow: hidden;
            background: #F8F8F8;
            display: inline-block;
            color: #333;
            text-align: center;
            line-height: 80px;
            vertical-align: bottom;
            cursor: pointer;
            position: relative;
            img {
                width: 160px;
                height: 90px;
            }
            .noImg {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                text-align: center;
                color: #fff;
                line-height: normal;
                span {
                   font-size: 40px;
                   color: #ccc;
                   &.txt {
                       color: #666;
                       font-size: 12px;
                   }
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
            ul {
              li {
                 margin-top: 10px;
                 span {
                   margin-right:10px;
                 }
                 .el-input {
                   width:320px;
                   height:30px;
                   margin-right:20px;
                   .el-input__inner {
                     width:100%;
                     height:100%;
                   }
                 }
              }
            }
            .module_imgs_link_focus{
                margin-top: 13px;
            }
        }
    }
    ._imgLink_choose_dialog{
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

