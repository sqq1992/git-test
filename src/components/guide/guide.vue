<template>
    <div>
        <div class="guide-dialog-box" :class="className">
			<el-dialog
				title=""
				:visible.sync="dialogVisible" :show-close="showClose" :close-on-click-modal="false" :close-on-press-escape="false">
				<div class="guide-box">
                    <div>
                        <img :src="imgUrl" alt="">
                        <img class="btn" :class="btnName" :src="imgBtn" @click="jump()" alt="">
                    </div>
                </div>
			</el-dialog>
		</div>
    </div>
</template>

<script>
export default {
    data(){
        return {
          dialogVisible: false,
          imgUrl: '',
          imgBtn: '',
          showClose: false,
          className: '',
          btnName: '',
          step: 1,
          urlMap: ['/interactionCenter', '/integralCenter', '/welfare', '/pageManage', '/pageManage', '/userPages', '/userPages']
        }
    },
    methods: {
        show(step, btn) {
            this.step = step;
            this.dialogVisible = true;
            if(step == 1) {
                this.showClose = true
            };
            let imgUrl = require('src/assets/img/guide/guide'+step+'.png'),
                imgBtn = require('src/assets/img/guide/guide-btn'+btn+'.png');
            this.className = 'guide' + step;
            this.btnName = 'btn' + step;
            this.imgUrl = imgUrl;
            this.imgBtn = imgBtn;
        },
        jump() {
            //流程完毕
            if(this.step == 8) {
                this.dialogVisible = false;
                this.$router.push({
                    path: '/userPages'
                });
            }else {
                this.$router.push({
                    path: this.urlMap[this.step-1],
                    query: {
                        guide: Number(this.step) + 1,
                    }
                });
            }
        }
    }
}
</script>
<style lang="less">
.guide-dialog-box {
    .el-dialog {
        background: none;
        box-shadow: none;
        width: auto;
    }
    .el-dialog__body {
        padding: 0;
    }
    &.guide2, &.guide3, &.guide4 {
        .el-dialog {
            top: 45px !important;
            left: 0;
            transform: none;
        }
    }
    &.guide5 {
        .el-dialog {
            top: 362px !important;
            left: 0;
            transform: none;
        }
    }
    &.guide6 {
        .el-dialog {
            top: 352px !important;
            left: 0;
            transform: none;
        }
    }
    &.guide7 {
        .el-dialog {
            width: auto;
            top: 182px !important;
            left: 813px;
            transform: none;
        }
    }
    &.guide8 {
        .el-dialog {
            width: auto;
            top: 227px !important;
            left: 786px;
            transform: none;
        }
    }
}
</style>
<style lang="less" scoped>
.guide-dialog-box {
    .guide-box {
        position: relative;
        div {
            .btn {
                position: absolute;
                cursor: pointer;
                &.btn1 {
                    top: 474px;
                    left: 304px;
                }
                &.btn2, &.btn3 , &.btn4 {
                    top: 70px;
                    left: 198px;
                }
                &.btn5 {
                    top: 91px;
                    left: 252px;
                }
                &.btn6 {
                    top: 347px;
                    left: 201px;
                }
                &.btn7 {
                    bottom: -50px;
                    left: 0px;
                }
                &.btn8 {
                    top: 111px;
                    left: 29px;
                }
            }
        }
    }
}
</style>

