<template>
  <div class="goodDialog">
    <el-tooltip popper-class="my_poper" placement="top" content="短信内容只能包含一个链接，请先删除已插入短链" v-if="redirectUrl">
      <el-button @click="showDialog" size="small">插入短链</el-button>
    </el-tooltip>
    <el-button @click="showDialog" size="small" v-else>插入短链</el-button>
    <div class="_imgLink_choose_dialog">
      <el-dialog title="设置跳转链接" :visible.sync="dialogTableVisible" size="small">
          <div class="link_title_box">
              <el-radio class="radio" v-model="linkType" label="1">商品链接</el-radio>
              <el-radio class="radio" v-model="linkType" label="2">店铺首页</el-radio>
              <el-radio class="radio" v-model="linkType" label="3">自定义链接</el-radio>
              <el-radio class="radio" v-model="linkType" label="4">店铺优惠券</el-radio>
          </div>
          <div class="choose_link_box" style="margin-top: 20px;" v-loading="loading">
              <div class="choose_good_link" v-if="linkType == 1">
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
                                  <el-button type="text" @click="checkGoodLink(good)">选取</el-button>
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
              <div class="choose_idnex_link" v-if="linkType == 2">店铺地址：{{indexHref}}</div>
              <div class="choose_custom_link" v-if="linkType == 3">
                  输入链接：<input type="text" @blur="isValidURL(customHref)" v-model="customHref" style="width: 300px;" placeholder="仅支持*m.jd.com 、*.360buyimg.com 以及 *.jdfw1.com 的链接">
              </div>
              <div v-if="linkType == 4" class="m-content">
                 <div class="row_line">
                      <a class="blueColor" href="https://prom.shop.jd.com/coupon/init.action" target="_blank">新建优惠券</a>
                      <el-button style="margin-left:10px;" type="text" @click="getCouponsList">刷新</el-button>
                      <span style="font-size: 12px;color: #666;">请创建【当前有效】【免费领取】【不公开】【全平台】优惠券</span>
                  </div>
                  <div class="row_line">
                      <el-form :inline="true" :model="formInline" class="demo-form-inline">
                          <el-form-item label="优惠券名称：">
                              <el-input @keyup.native.enter="getCouponsList" class="inpWidth" v-model="formInline.user" placeholder=""></el-input>
                          </el-form-item>
                          <el-form-item label="使用范围：">
                              <el-select @change="getCouponsList" class="inpWidth" v-model="formInline.region" placeholder="">
                                  <el-option label="不限" value=""></el-option>
                                  <el-option label="全店铺" value="1"></el-option>
                                  <el-option label="限定商品" value="2"></el-option>
                                  <el-option label="限定某些商品不参加" value="3"></el-option>
                              </el-select>
                          </el-form-item>
                          <el-form-item class="f-fr">
                              <el-button size="small" type="text" @click="getCouponsList">查询</el-button>
                          </el-form-item>
                      </el-form>
                  </div>
                  <ul class="coupon">
                      <li v-if="coupons.length > 0" v-for="item in coupons" class="clearfix">
                          <div class="couponIcon f-fl">
                              <img src="../../assets/images/u2181.png" height="64" width="64">
                              <p >
                                  <span v-if="item.discountType == 2">{{item.discount*10}}折</span>
                                  <span  v-if="item.discountType == 1">¥{{item.discount}}</span>
                              </p>
                              <p>{{item.bindType == 1 ? '店铺优惠券' : '商品优惠券'}}</p>
                          </div>
                          <div class="couponMess f-fl">
                              <span>{{item.name}}</span><br />
                              <span class="leftSpan oneLine">满{{item.quota}}元可用</span>
                              <span class="rightSpan f-fr">{{item.bindType == 1 ? '全店可用' : '部分可用'}}</span><br />
                              <span class="leftSpan oneLine m_r10">总数量：{{item.num}}</span>
                              <span class="rightSpan f-fr m_l10">已发放：{{item.takeNum}}</span>
                          </div>
                          <!-- v-if="item.couponId != checkedId" -->
                          <div  class="couponBut blueColor cursor f-fr" @click="chooseItem(item)">选取</div>
                          <!-- <div v-else class="couponBut cursor f-fr">已选取</div> -->
                      </li>
                      <li v-if="!coupons.length" class="no-data">暂无数据</li>
                  </ul>
                  <div class="text-center" v-if="pageInfo.total">
                      <el-pagination
                          :current-page="pageInfo.pageNo"
                          @current-change="handleCurrentChange"
                          :page-size="pageInfo.pageSize"
                          layout="prev, pager, next"
                          :total="pageInfo.total">
                      </el-pagination>
                  </div>
              </div>
          </div>
          <span slot="footer" class="dialog-footer" v-if="linkType != 1">
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
  data() {
    return {
      loading:false,
      dialogTableVisible:false,
      redirectUrl:'',
      linkType:'1',
      queryType:0,
      indexHref:'',//首页链接
      customHref:'',//自定义链接
      goodList:[],
      coupons:[],
      allData:[],
      pageData: {//商品使用
        pageNo: 1,
        pageSize: 5,
        searchKey: '',
        total: 0
      },
      formInline: {
          user: '',
          region: ''
      },
      pageInfo: {//优惠券使用
          pageNo: 1,
          pageSize: 5,
          total: 0
      },
    }
  },
  created() {
    this.indexHref = 'https://shop.m.jd.com/?shopId='+this.$store.state.user.shopId;
  },
  watch: {
    linkType() {
      // if(this.linkType == 2){
      //   this.redirectUrl = this.indexHref;
      // }
      // else if(this.linkType == 3){
      //   this.redirectUrl = this.temporaryData.redirectType == '自定义链接' ? this.temporaryData.redirectUrl : '';
      // }
    }
  },
  methods:{
    showDialog() {
      if(this.redirectUrl) return;
      this.dialogTableVisible = true;
      this.initDialog();
    },
    initDialog() {
      this._queryGoodList(1);
      this.getCouponsList();
    },
    removeShortUrl() {
      this.redirectUrl = '';
    },
    insertShortUrl(redirectUrl) {
      this.redirectUrl = redirectUrl;
    },
    queryGoodList(){
        this._queryGoodList(1);
    },
    _queryGoodList(pageNo) {//获取商品列表
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
      this.loading = true;
      http({
          api_name: 'activityQueryWare',
          data: data,
          vm: this
      }, (result) => {
        this.loading = false;
        this.goodList = result.data.wareList;
        this.pageData.total = result.data.totalItem;
      }, err => {
        this.loading = false;
      });
    },
    getCouponsList() {//获取优惠券列表
      this.loading = true;
      http({
        api_name: 'couponQuery',
        vm: this,
        data: {
          bindType: this.formInline.region,
          couponName: this.formInline.user
        }
      }, (res) => {
        this.loading = false;
        this.dialogVisible = true;
        this.allData = res.data ? (res.data.couponList ? res.data.couponList : []) : [];
        this.pageInfo.total = this.allData.length;
        this.coupons = this.allData.slice(0, 5);
      }, (error) => {
        this.loading = false;
      });
    },
    handleCurrentChange(e) {
        this.pageInfo.pageNo = Number(e);
        let startIndex = (this.pageInfo.pageNo - 1) * this.pageInfo.pageSize;
        let endIndex = (startIndex + this.pageInfo.pageSize) > this.pageInfo.total ? this.pageInfo.total : (startIndex + this.pageInfo.pageSize);
        this.coupons = this.allData.slice(startIndex, endIndex);
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
    checkGoodLink(good) {//选择商品
       this.redirectUrl = 'https://item.m.jd.com/product/'+good.firstSkuId+'.html';
       this.checkPointData();
    },
    chooseItem(item) {//选择优惠券
      let url = item.link.split('?')[1];
      url = 'http://coupon.m.jd.com/coupons/show.action?' + url;
      this.redirectUrl = url;
      this.saveDAta();
    },
    checkPointData(){
        try{
            if(this.linkType == 2){
                // this.data.redirectType = '店铺首页';
                this.redirectUrl = this.indexHref
            } else if(this.linkType == 3){
                // this.data.redirectType = '自定义链接';
                // this.data.canFollow = false;
                if(!/m\.jd\.com/.test(this.customHref) && !/\.isvjcloud\.com/.test(this.customHref) && !/\.360buyimg\.com/.test(this.customHref)){
                    this.$message({
                        message: '请输入正确的京东平台链接地址',
                        type: 'warning'
                    });
                    throw '自定义链接错误';
                } else {
                  this.redirectUrl = this.customHref;
                }
            }
            this.saveDAta();
        } catch(e){
            console.error(e);
        }
    },
    closeImgLink(){
      this.dialogTableVisible = false;
    },
    saveDAta() {
      // this.loading = true;
      this.dialogTableVisible = false;
      this.$emit('getShortUrl', this.redirectUrl);
      // http({
      //     api_name: 'jdMarketing_shortUrl',
      //     data: {
      //       url:this.redirectUrl
      //     },
      //     vm: this
      // }, ({data:{shortUrl}}) => {
      //   this.loading = false;
      //   this.shortUrl = shortUrl;
      //   this.dialogTableVisible = false;
      //   this.$emit('getShortUrl', shortUrl);
      // }, err => {
      //   this.loading = false;
      // });
    }
  }
}
</script>
<style lang="less">
  .goodDialog {
    display:inline-block;
    margin-left:10px;
  }
  ._imgLink_choose_dialog{
       .el-input {
          // width:320px;
          // height:30px;
          // margin-right:20px;
          .el-input__inner {
            width:100%;
            height:100%;
          }
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
    }
    .m-content{
      line-height: 20px;
		  .inpWidth{
			  width: 110px;
      }
      .w50 {
          width: 50px;
      }
      .w75 {
          width: 75px;
      }
      .mr_10 {
          margin-right: 10px;
      }
      .w200 {
          width: 200px;
      }
      .w300 {
          width: 300px;
      }
      .w320 {
          width: 320px;
      }
      .fc_blue {
          color: #3089dc;
      }
      .ml_5 {
          margin-left: 5px;
      }
		.coupon{
      width: 100%;
      margin-top:10px;
			li{
				width: 100%;
				box-sizing: border-box;
				height: 94px;
				border: 1px solid #ddd;
				border-bottom: none;
				padding: 12px;
        overflow: hidden;
        &.no-data {
            text-align: center;
            line-height: 69px;
        }
				.couponIcon{
					position: relative;
					overflow: hidden;
					height: 100%;
					width: 64px;
					img{
						position: absolute;
						z-index: -1;
						top: 0;
					    display: block;
					    transform-origin:center center; //旋转中心要是正中间 才行
					    transform: rotate(90deg);
					    -webkit-transform: rotate(90deg);
					    -moz-transform: rotate(90deg);
					    -ms-transform: rotate(90deg);
					    -o-transform: rotate(90deg);
					}
					p{
						margin-top: 10px;
						color: white;
						text-align: center;
						font-size: 12px;
						font-weight: 700;
						span{
							font-size: 16px;
						}
					}
					p:last-child{
						margin-top: 5px;
					}
				}
				.couponMess{
					//max-width: 360px;
					margin-left: 50px;
					overflow: hidden;
					span{
						display: inline-block;
						height: 21px;
						line-height: 21px;
					}
					.leftSpan{
						// min-width: 100px;
						max-width: 230px;
						// overflow: hidden;
					}
					.rightSpan{
						width: 98px;
						overflow: hidden;
					}
				}
				.couponBut{
					line-height: 68px;
				}
			}
			li:last-child{
				border-bottom: 1px solid #ddd;
			}
        }
      .error-tip {
		   line-height: 14px;
		   font-size: 12px;
	    }
	}
</style>
