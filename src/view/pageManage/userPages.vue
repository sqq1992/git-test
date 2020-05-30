<template>
    <div class="userPages">
        <ul class="page_link_box">
            <li class="page_link" :class="{'active': active == index}" v-for="(link, index) in pageLinks" :key="'pageLinks_'+index" @click="changeActive(index)">{{link.name}}</li>
        </ul>
        <div class="page_show">
            <img :src="pageLinks[active].imgsrc" alt="">
        </div>
        <div class="page_link_right">
            <div class="page_link_text">
                <div class="p_name">页面链接：</div>
                <div class="p_value" id="htmlBtn" :data-clipboard-text='pageLinks[active].link'>{{pageLinks[active].link}} <el-button type="text" style="margin-left: 10px;">复制</el-button></div>
            </div>
            <div class="page_link_ercode">
                <div class="p_name">二维码：</div>
                <div class="p_value">
                    <img :src="qrcode" alt="">
                </div>
                <div v-if="active == 0">
                    <div class="p_name">装修素材：<span>可下载至电脑并装修到店铺首页</span></div>
                    <div class="p_value">
                        <div class="material_box">
                            <div class="img_box">
                                <img :src="materialList[showIndex].link" alt="">
                            </div>
                            <div class="img_ctrl">
                                <span class="prevBtn" v-if="showIndex > 0" @click="prevImg()">上一张</span>
                                <span class="nextBtn" v-if="showIndex < materialList.length - 1" @click="nextImg()">下一张</span>
                            </div>
                        </div>
                        <p>{{materialList[showIndex].size + ' ' + materialList[showIndex].name}}</p>
                        <div class="btn_ctrl">
                            <a class="btn" :href="materialList[showIndex].link" download target="_blank">下载png</a>
                            <a class="btn" :href="materialList[showIndex].psd" download target="_blank">下载psd</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <guide-dialog ref="guideDialog"></guide-dialog>
    </div>
</template>

<script>
import Clipboard from 'clipboard';
import QRCode from 'qrcode';
import mall from 'src/assets/img/mall.png'
import shopstory from 'src/assets/img/shopstory.png'
import userCenter from 'src/assets/img/userCenter.png'
import welfare from 'src/assets/img/welfare.png'
import store from 'src/store.js'
import guideDialog from 'src/components/guide/guide.vue';
export default {
    data(){
        return {
            active: 0,
            pageLinks: [
                {
                    name: '会员中心',
                    link: `https://wdkj-isv.isvjcloud.com/?href=user/userCenter&shopId=${store.state.user.shopId}&sellerId=${store.state.user.venderId}`,
                    imgsrc: userCenter
                },
                {
                    name: '品牌故事',
                    link: `https://wdkj-isv.isvjcloud.com/?href=user/shopStory&shopId=${store.state.user.shopId}&sellerId=${store.state.user.venderId}`,
                    imgsrc: shopstory
                },
                {
                    name: '积分商城',
                    link: `https://wdkj-isv.isvjcloud.com/?href=integral/mall&shopId=${store.state.user.shopId}&sellerId=${store.state.user.venderId}`,
                    imgsrc: mall
                },
                 {
                    name: '会员福利社',
                    link: `https://wdkj-isv.isvjcloud.com/?href=welfare/list&shopId=${store.state.user.shopId}&sellerId=${store.state.user.venderId}`,
                    imgsrc: welfare
                }
                //  {
                //     name: '会员中心',
                //     link: `https://wdkj-isv.jdfw1.com/?href=user/userCenter&shopId=${store.state.user.shopId}&sellerId=${store.state.user.venderId}`,
                //     imgsrc: userCenter
                // },
                // {
                //     name: '品牌故事',
                //     link: `https://wdkj-isv.jdfw1.com/?href=user/shopStory&shopId=${store.state.user.shopId}&sellerId=${store.state.user.venderId}`,
                //     imgsrc: shopstory
                // },
                // {
                //     name: '积分商城',
                //     link: `https://wdkj-isv.jdfw1.com/?href=integral/mall&shopId=${store.state.user.shopId}&sellerId=${store.state.user.venderId}`,
                //     imgsrc: mall
                // },
                //  {
                //     name: '会员福利社',
                //     link: `https://wdkj-isv.jdfw1.com/?href=welfare/list&shopId=${store.state.user.shopId}&sellerId=${store.state.user.venderId}`,
                //     imgsrc: welfare
                // }
            ],
            materialList: [
                {
                    name: '光晕',
                    link: 'http://kmcrmpic1.oss-cn-hangzhou.aliyuncs.com/wechatQrCodeImg/2018090417/2963914609_1536051637346_.png',
                    psd: '//crmad.superboss.cc/resources/750-250-光晕.psd.zip',
                    size: '750*250'
                },
                {
                    name: 'VIP-粉',
                    link: 'http://kmcrmpic1.oss-cn-hangzhou.aliyuncs.com/wechatQrCodeImg/2018090417/2963914609_1536051964220_.png',
                    psd: '//crmad.superboss.cc/resources/750-250-VIP.psd.zip',
                    size: '750*250'
                },
                {
                    name: 'VIP-黑',
                    link: 'http://kmcrmpic1.oss-cn-hangzhou.aliyuncs.com/wechatQrCodeImg/2018090417/2963914609_1536051987220_.png',
                    psd: '//crmad.superboss.cc/resources/750-250-VIP.psd.zip',
                    size: '750*250'
                },
                {
                    name: 'VIP-蓝',
                    link: 'http://kmcrmpic1.oss-cn-hangzhou.aliyuncs.com/wechatQrCodeImg/2018090417/2963914609_1536051995763_.png',
                    psd: '//crmad.superboss.cc/resources/750-250-VIP.psd.zip',
                    size: '750*250'
                },
                {
                    name: '会员中心',
                    link: 'http://kmcrmpic1.oss-cn-hangzhou.aliyuncs.com/wechatQrCodeImg/2018090417/2963914609_1536052002110_.png',
                    psd: '//crmad.superboss.cc/resources/750-250-会员中心.psd.zip',
                    size: '750*350'
                },
                {
                    name: '绿1',
                    link: 'http://kmcrmpic1.oss-cn-hangzhou.aliyuncs.com/wechatQrCodeImg/2018090417/2963914609_1536052009298_.png',
                    psd: '//crmad.superboss.cc/resources/750-230-绿.psd.zip',
                    size: '750*230'
                },
                {
                    name: '绿2',
                    link: 'http://kmcrmpic1.oss-cn-hangzhou.aliyuncs.com/wechatQrCodeImg/2018090417/2963914609_1536052012486_.png',
                    psd: '//crmad.superboss.cc/resources/750-350-绿.psd.zip',
                    size: '750*350'
                },
            ],
            qrcode: '',
            clipboard: '',
            showIndex: 0,
            guide: ''
        }
    },
    watch: {
       $route() {
            this.guide = this.$route.query.guide
        },
        guide() {
            this.guideShow();
        }
    },
    mounted(){
        this.getErcode();
        this.initClip();
        //引导
        this.guide = this.$route.query.guide;
    },
    components: {
       guideDialog
    },
    methods: {
        guideShow() {
            if(this.guide) {
                this.$refs.guideDialog.show(this.guide, Number(this.guide) - 5);
            }
        },
        changeActive(index){
            this.active = index;
            this.getErcode();
        },
        initClip() {
            this.clipboard = new Clipboard('#htmlBtn');
            let vm = this;

            this.clipboard.off('success').on('success', function(e) {
                e.clearSelection();
                vm.$message("复制成功!");
            });

            this.clipboard.off('error').on('error', function(e) {
                console.error('Action:', e.action);
                console.error('Trigger:', e.trigger);
            });
        },
        getErcode(){
            let link = this.pageLinks[this.active].link;
            try{
                QRCode.toDataURL(link, {errorCorrectionLevel: 'H'}, (err, url) => {
                    this.qrcode = url;
                });
            } catch(e){
                this.qrcode = '';
            }
        },
        prevImg(){
            if(this.showIndex > 0){
                this.showIndex--;
            } else {
                this.showIndex = 0;
            }
        },
        nextImg(){
            if(this.showIndex < this.materialList.length - 1){
                this.showIndex++;
            } else {
                this.showIndex = this.materialList.length - 1;
            }
        }
    }
}
</script>

<style lang="less" scoped>
    .userPages{
        padding: 20px 0;
        display: flex;
        .page_link_box{
            display: inline-block;
            width: 180px;
            text-align: center;
            height: 100%;
            vertical-align: top;
            .page_link{
                height: 40px;
                line-height: 40px;
                cursor: pointer;
                font-size: 14px;
                color: #888;
                transition: color .5s ease;
                &:hover{
                    color: #666;
                    transition: color .5s ease;
                }
                &.active{
                    background: #e5f2ff;
                }
            }
        }
        .page_show{
            display: inline-block;
            width: 375px;
            vertical-align: top;
            margin-left: 20px;
            padding-right: 20px;
            img{
                width: 100%;
                border-right: 1px solid #ccc;
                padding-right: 20px;
            }
        }
        .page_link_right{
            display: inline-block;
            vertical-align: top;
            width: 350px;
            margin-left: 20px;
            flex: 1;
            .p_name{
                font-size: 14px;
                font-weight: 700;
                span{
                    color: #888;
                    font-weight: 4000;
                    font-size: 12px;
                }
            }
            .p_value{
                font-size: 12px;
                color: #666;
                font-weight: 400;
            }
            .material_box{
                display: inline-block;
                margin-top: 10px;
                position: relative;
                margin-bottom: 5px;
                .img_box{
                    display: inline-block;
                    img{
                        width: 300px;
                    }
                }
                .img_ctrl{
                    display: inline-block;
                    position: absolute;
                    height: 100%;
                    left: 310px;
                    top: 0;
                    span{
                        position: absolute;
                        display: inline-block;
                        width: 50px;
                        text-align: center;
                        cursor: pointer;
                        color: #3089dc;
                    }
                    .prevBtn{
                        top: 0;
                    }
                    .nextBtn{
                        bottom: 0;
                    }
                }
            }
            .btn_ctrl{
                margin-top: 10px;
                a{
                    border: 1px solid #3089dc;
                    color: #3089dc;
                    font-size: 14px;
                    text-align: center;
                    display: inline-block;
                    padding: 4px 12px;
                    vertical-align: middle;
                    background: #fff;
                    border-radius: 4px;
                    margin-right: 10px;
                }
            }
        }
        .page_link_ercode{
            margin-top: 10px;
        }
    }
</style>
