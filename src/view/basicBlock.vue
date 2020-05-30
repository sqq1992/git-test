<template>
    <div class="mainError">
        <img :src="imgsrc" alt="" width="890">
        <p>您目前是免费体验版，无法使用该功能，订购一个月及以上版本后即可使用(暂不支持自营店铺)</p>
        <div class="btns">
            <a href="http://fw.jd.com/657606.html" target="_blank">立即订购</a>
        </div>
    </div>  
</template>

<script>
import integral from "src/assets/img/integral.png";
import intePeople from "src/assets/img/intePeople.png";
import userSetting from "src/assets/img/userSetting.png";
export default {
    data(){
        return {
            imgsrc: ''
        }
    },
    watch: {
        '$route'(){
            this.imgChange();
        }
    },
    created(){
        this.imgChange();
    },
    methods: {
        imgChange(){
            switch(this.$route.name){
                case 'intePeople':
                case 'manageGroup':
                    this.imgsrc = intePeople;
                    break;
                case 'cardSetting':
                case 'tagSetting':
                case 'lockRecord':
                    this.imgsrc = userSetting;
                    break;
                case 'integral':
                    this.imgsrc = integral;
                    break;
                default:
                    break;
            }
        }
    }
}
</script>

<style lang="less" scoped>
    .mainError{
        text-align: center;
        box-sizing: border-box;
        padding: 50px;
        font-size: 14px;
        .btns{
            margin-top: 30px;
            a{
                color: #fff;
                font-size: 14px;
                display: inline-block;
                padding: 7px 20px;
                border-radius: 20px;
                background: #20a0ff;
                &:hover{
                    background: #4db3ff;
                }
            }
        }
    }
</style>
