<template>
    <div class="maketingDialog" v-if="isShow">
        <div class="maketingDialogImg">
            <a href="#/marketing" class="jumpBtn" @click="closeDialog"></a>
            <span class="closeBtn" @click="closeDialog"></span>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return{
            isShow:false
        }
    },
    methods:{
        show() {
            this.isShow = !localStorage.show_20190506_dialog;
        },
        closeDialog() {
            localStorage.show_20190506_dialog = true;
            this.isShow = false;
        }
    }
}
</script>
<style lang="less" scoped>
    .maketingDialog{
         z-index: 99998;
        position: fixed;
        top:0;
        bottom:0;
        left:0;
        right:0;
        background:rgba(0,0,0,.5);
        display: flex;
        justify-content: center;
        align-items: center;
        .maketingDialogImg{
            width: 343px;
            height: 337px;
            background:url("~assets/img/marketingDialog.png") no-repeat;
            position: relative;
            .jumpBtn{
                position: absolute;
                bottom: 25px;
                cursor: pointer;
                left: 96px;
                width: 167px;
                height: 40px;
            }
            .closeBtn{
                width:20px;
                height:20px;
                position: absolute;
                cursor: pointer;
                top:44px;
                right:10px;
            }
        }
    }
</style>
