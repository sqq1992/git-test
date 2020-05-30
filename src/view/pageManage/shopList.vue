<template>
    <div class="shopList" v-loading="fullscreenLoading">
        <div class="shoplist_top">
            <div class="shoplist_top_text">
                <span>支持向指定人群展示不同的品牌故事</span>
                <page-link :url="`https://wdkj-isv.isvjcloud.com/?href=user/shopStory&shopId=${$store.state.user.shopId}&sellerId=${$store.state.user.venderId}`" title="品牌故事预览" name=""></page-link>
                <!-- <page-link :url="`https://wdkj-isv.jdfw1.com/?href=user/shopStory&shopId=${$store.state.user.shopId}&sellerId=${$store.state.user.venderId}`" title="品牌故事预览" name=""></page-link> -->
            </div>
            <div class="shoplist_top_btn">
                <span>当前已创建{{(data.pageList.length - 1) > 0 ? data.pageList.length - 1 : 0}}个智能页面，还可创建{{(maxShopListLimt - data.pageList.length + 1) > maxShopListLimt ? maxShopListLimt : (maxShopListLimt - data.pageList.length + 1)}}个智能页面</span>
                <!-- <el-button type="primary" size="small" @click="addShopList()" v-if="(maxShopListLimt - data.pageList.length + 1) > 0">{{ data.pageList.length > 0 ? '新建智能页面' : '新建默认展示页'}}</el-button> -->
            </div>
        </div>
        <div class="shoplist_cont">
            <div class="shoplist_item" v-for="(item, index) in data.pageList" :key="'shoplist_item_'+index" v-if="data.pageList.length > 0" v-loading="item.loadingFlg">
                <div class="item_title">{{item.defaulted ? '默认展示页' : '智能页面: '+item.crowdName}}
                    <div class="item_tongji">
                        <span class="item_tongji_item">pv: {{item.visitCount}}</span>
                        <span class="item_tongji_item">uv: {{item.customerCount}}</span>
                    </div>
                </div>
                <div class="recode">
                    <img :src="item.qrcode" alt="">
                </div>
                <div class="item_btns">
                    <div class="item_btns_item" @click="editShopListCrow(item)" v-if="!item.defaulted">人群</div>
                    <div class="item_btns_item" @click="editShopList(item)">编辑</div>
                    <div class="item_btns_item" @click="addShopList(item)">克隆</div>
                    <div class="item_btns_item" v-if="index != 0" @click="delShoplist(item, index)">删除</div>
                </div>
            </div>
            <div class="shoplist_item addShopListItem" v-if="(maxShopListLimt - data.pageList.length + 1) > 0" @click="addShopList()">
                <div class="item_title">{{ data.pageList.length > 0 ? '新建智能页面' : '新建默认展示页'}}
                    <div class="item_tongji"></div>
                </div>
                <div class="recode"><span class="el-icon-plus"></span></div>
                <div class="item_btns"></div>
            </div>
        </div>
        <crowd-dialog :data="shopListData" ref="crowdDialog" @save="updateData"></crowd-dialog>
    </div>
</template>

<script>
import pageLink from 'src/components/pageLink/pageLink';
import crowdDialog from 'src/components/crowdDialog/crowdDialog';
import QRCode from 'qrcode';
import ajax from 'src/api/index.js';
import { clone } from 'src/common/public.js';
import {point} from 'src/common/point.js';
export default {
    data(){
        return{
            maxShopListLimt: 5,
            data: {
                pageList: []
            },
            fullscreenLoading: true,
            shopListData: {}
        }
    },
    created(){
        point('37977.39409.39481');
        this.getShoplist();
    },
    methods: {
        getShoplist(){
            ajax({
                api_name: 'getShopList',
                vm: this,
                data: {}
            }, result => {
                result.data.shopStoryList.forEach((list) => {
                    list.loadingFlg = false;
                    QRCode.toDataURL(`https://wdkj-isv.isvjcloud.com/?href=user/shopStory&shopId=${this.$store.state.user.shopId}&sellerId=${this.$store.state.user.venderId}&test=true&id=${list.id}`, {errorCorrectionLevel: 'H'}, (err, url) => {
                    // QRCode.toDataURL(`https://wdkj-isv.jdfw1.com/?href=user/shopStory&shopId=${this.$store.state.user.shopId}&sellerId=${this.$store.state.user.venderId}&test=true&id=${list.id}`, {errorCorrectionLevel: 'H'}, (err, url) => {
                        list.qrcode = url;
                    });
                });
                this.data.pageList = result.data.shopStoryList;
                this.data.shopStoryUrl = result.data.shopStoryUrl;
                this.$nextTick(() => {
                    this.fullscreenLoading = false;
                });
            });
        },
        addShopList(data){
            if(this.data.pageList.length > 0){
                if(data){
                    this.shopListData = clone(data);
                    this.shopListData.defaulted = false;
                    delete this.shopListData.id;
                } else {
                    this.shopListData = {loadingFlg: false, defaulted: false};
                }
                this.$refs.crowdDialog.showCrowdDialog();
            } else {
                this.updateData({
                    defaulted: true
                }, true);
            }
        },
        editShopList(data){
            this.$router.push({name: 'shopStory', query: {id: data.id}});
        },
        delShoplist(data,index){
            data.loadingFlg = true;
            ajax({
                api_name: 'delShopListItem',
                vm: this,
                data: data
            }, result => {
                data.loadingFlg = false;
                this.data.pageList.splice(index, 1);
                this.$message({
                    message: '删除成功'
                });
            });
        },
        editShopListCrow(data){
            this.shopListData = data;
            this.$refs.crowdDialog.showCrowdDialog();
        },
        updateData(data, isEdit){
            this.shopListData = data;
            if(isEdit){
                this.shopListData.loadingFlg = true;
                ajax({
                    api_name: 'shopStoryEdit',
                    data: this.shopListData,
                    vm: this
                }, result => {
                    this.shopListData.loadingFlg = false;
                    if(data.id){
                        this.$message({
                            message: '修改成功'
                        });
                    } else {
                        this.$message({
                            message: '创建成功'
                        });
                        setTimeout(() => {
                            this.$router.push({name: 'shopStory', query: {id: result.data.id}});
                        }, 1000);
                    }
                });
            }
        }
    },
    components: {
        pageLink,
        crowdDialog
    }
}
</script>

<style lang="less">
.shoplist_top_text > .page_link{
    display: inline-block;
    background: none!important;
    border: none!important;
    position: absolute!important;
    right: 12px;
    top: 6px;
}
</style>


<style lang="less" scoped>
.shopList{
    padding: 20px;
    .shoplist_top_text{
        background-color: #E6F7FF;
        padding: 12px;
        border: 1px solid #91D5FF;
        color: rgba(0, 0, 0, 0.65);
        position: relative;
    }
    .shoplist_top_btn{
        margin-top: 15px;
        color: #666;
    }
    .shoplist_cont{
        margin-top: 30px;
        border-top: 1px solid #ccc;
        .noData{
            text-align: center;
        }
        .shoplist_item{
            width: 220px;
            display: inline-block;
            margin-top: 20px;
            margin-right: 15px;
            border: 1px solid #e6e6e6;
            border-radius: 2px;
            padding: 10px 12px;
            box-sizing: border-box;
            vertical-align: top;
            .item_tongji{
                color: #999;
                margin-top: 5px;
                height: 20px;
                line-height: 20px;
                .item_tongji_item{
                    margin-right: 15px;
                }
            }
            .recode{
                text-align: center;
                width: 170px;
                height: 170px;
                margin: 0 auto;
                border-radius: 2px;
                overflow: hidden;
                background: #D8D8D8;
                line-height: 170px;
                color: #fff;
                font-size: 60px;
                img{
                    width: 100%;
                    height: 100%;
                }
            }
            .item_btns{
                text-align: center;
                height: 15px;
                line-height: 15px;
                font-size: 12px;
                color: #3089DE;
                .item_btns_item{
                    display: inline-block;
                    width: 43px;
                    text-align: center;
                    position: relative;
                    cursor: pointer;
                    &:after{
                        content: '';
                        height: 15px;
                        width: 1px;
                        background: #E6E6E6;
                        position: absolute;
                        top: 1px;
                        right: 0;
                    }
                    &:last-child:after{
                        display: none;
                    }
                }
            }
            &.addShopListItem{
                cursor: pointer;
            }
        }
    }
}
</style>
