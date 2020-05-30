<template>
    <div>
        <div class="activity-dialog-box">
			<el-dialog
				title=""
                @close='close'
				:visible.sync="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="false">
				<div class="activity-box">
                    <div>
                        <img :src="imgUrl" alt="">
                        <a class="btn" href="https://fw.jd.com/657606.html" target="_blank"></a>
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
          imgUrl: require('src/assets/img/activity/gq_act.png')
        }
    },
    methods: {
        show() {
            this.dialogVisible = true;
        },
        close() {
            this.$emit('closeAct');
        }
    }
}
</script>
<style lang="less">
.dialog_cla .activity-dialog-box .el-dialog.el-dialog--small {
    width: auto;
}
.activity-dialog-box {
    width: auto;
    background: none;
    box-shadow: none;
    .el-dialog {
        background: none;
        box-shadow: none;
        width: auto;
    }
    .el-dialog__body {
        padding: 0;
    }
}
</style>
<style lang="less" scoped>
.activity-box {
    position: relative;
    .btn {
        position: absolute;
        bottom: 3px;
        left: 135px;
        width: 126px;
        height: 30px;
    }
}
</style>

