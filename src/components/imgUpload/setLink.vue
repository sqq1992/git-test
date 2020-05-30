<template>
    <el-dialog title="设置跳转链接" :visible.sync="dialogTableVisible" size="tiny">
        <div class="link_title_box">
            <el-select v-model="oneType" style="width: 120px;" @change="changeOneType">
                <el-option v-for="(item, index) in oneChild" :key="index" :label="item.name" :value="item.value"></el-option>
            </el-select>
            <!-- 商品标题搜索 -->
            <el-input
                class="searchInput"
                placeholder="请输入商品标题"
                icon="search"
                v-model="pageData.searchKey"
                :on-icon-click="_queryGoodList"
                @keyup.native.enter="_queryGoodList"
                v-if="oneType == 'good'">
            </el-input>
            <el-select v-model="twoType" style="width: 120px;" v-if="twoChild.length > 0" @change="changeTwoType">
                <el-option v-for="(item, index) in twoChild" :key="index" :label="item.name" :value="item.value"></el-option>
            </el-select>
            <el-select v-model="threeType" style="width: 120px;" v-if="threeChild.length > 0">
                <el-option v-for="(item, index) in threeChild" :key="index" :label="item.name" :value="item.value"></el-option>
            </el-select>
        </div>
        <div class="choose_link_box" style="margin-top: 20px;">
            <div class="choose_good_link" v-if="oneType == 'good'">
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
            <div class="choose_idnex_link" v-else-if="oneType == 'shopindex'">店铺地址：{{data.redirectUrl}}</div>
            <div class="choose_custom_link" v-else-if="oneType == 'customlink'">
                输入链接：<input type="text" @blur="isValidURL(data.redirectUrl)" v-model="data.redirectUrl" style="width: 300px;" placeholder="仅支持*.jd.com 以及 *.isvjcloud.com 的链接">
                <!-- 输入链接：<input type="text" @blur="isValidURL(data.redirectUrl)" v-model="data.redirectUrl" style="width: 300px;" placeholder="仅支持*.jd.com 以及 *.jdfw1.com 的链接"> -->
            </div>
            <div class="choose_idnex_link" v-else>页面地址：{{data.redirectUrl}}</div>
        </div>
        <span slot="footer" class="dialog-footer" v-if="oneType != 'good'">
            <el-button @click="closeImgLink()">取 消</el-button>
            <el-button type="primary" @click="checkImgLink()">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import http from 'src/api/index.js';
import { clone } from 'src/common/public.js';
import { menu } from './config.js';
export default {
    props: {
        data: {
            type: Object,
            default(){
                return {};
            }
        }
    },
    data(){
        return {
            dialogTableVisible: true,
            goodList: [],
            temporaryData: {},
            pageData: {
                pageNo: 1,
                pageSize: 5,
                searchKey: '',
                total: 0
            },
            indexHref: '',
            /* 一级菜单 */
            oneType: 1,
            oneChild: menu,
            /* 二级菜单 */
            twoType: '',
            twoChild: [],
            /* 三级菜单 */
            threeType: '',
            threeChild: [],
            queryType: 0
        }
    },
    created() {
        this._queryGoodList();
        if(this.data.redirectType == '店铺首页'){
            this.oneType = 'shopindex';
            this.data.redirectUrl = this.indexHref;
        } else if(this.data.redirectType == '自定义链接'){
            this.oneType = 'customlink';
        } else {
            this.oneType = 'good';
        }
        this.temporaryData = clone(this.data);
    },
    methods: {
        /* 一级菜单改变 */
        changeOneType(){
            let data = this._returnArrayData(this.oneChild, this.oneType, 'value');
            if(data.children){
                this.twoChild = data.children;
                this.twoType = this.twoChild[0].value;
                this.changeTwoType();
            } else {
                this.twoChild = [];
                if(data.value === 'shopindex'){
                    this.data.redirectUrl = this.indexHref;
                } else if(data.value === 'customlink'){
                    /* 如果之前选择的是自定义链接，则显示，否则清空 */
                    this.data.redirectUrl = this.temporaryData.redirectType == '自定义链接' ? this.temporaryData.redirectUrl : '';
                }
            }
        },
        /* 二级菜单改变 */
        changeTwoType(){
            let data = this._returnArrayData(this.twoChild, this.twoType, 'value');
            if(data.haveChild){
                /* ajax 请求 */

            } else {
                this.threeChild = [];
                let link = `${data.link}&shopId=${this.$store.state.user.shopId}&sellerId=${this.$store.state.user.venderId}`;
                this.setRedirectUrl(link);
            }
        },
        /* 三级菜单改变 */
        changeThreeType(){},
        setRedirectUrl(url){
            this.data.redirectUrl = url;
        },
        _returnArrayData(array, value, type){
            let data = {};
            array.forEach(element => {
                if(element[type] === value){
                    data = element;
                }
            });
            return data;
        },
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
        _queryGoodList(pageNo = 1){
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
            this.data.redirectType = '商品链接';
            this.checkImgLink();
        },
        checkImgLink(){
            try{
                if(this.oneType == 'shopindex'){
                    this.data.redirectType = '店铺首页';
                    this.data.redirectUrl = this.indexHref;
                } else if(this.oneType == 'customlink'){
                    this.data.redirectType = '自定义链接';
                    this.data.canFollow = false;
                    if(!/\.jd\.com/.test(this.data.redirectUrl) && !/\.isvjcloud\.com/.test(this.data.redirectUrl)){
                        this.$message({
                            message: '请输入正确的京东平台链接地址',
                            type: 'warning'
                        });
                        throw '自定义链接错误';
                    }
                } else if(this.oneType == 'page'){
                    this.data.redirectType = '常用页面';
                }
                this.saveDAta();
            } catch(e){
                console.error(e);
            }
        },
        closeImgLink(){
            this.data.redirectType = this.temporaryData.redirectType;
            this.data.redirectUrl = this.temporaryData.redirectUrl;
            this.saveDAta();
        },
        saveDAta(){
            this.$emit('checkImgLink', this.data);
        }
    }
}
</script>

<style lang="less">
    .link_title_box .el-input__icon+.el-input__inner{
        height: 36px;
        line-height: 36px;
        width: 100%;
    }
</style>


<style lang="less" scoped>
    .searchInput{
        width: 315px;
        margin-left: 15px;
    }
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
</style>
