<template>
    <div>
        <div class="qr-dialog">
            <el-dialog :title="'追加会员'" :visible.sync="dialogTableVisible">
              <ul>
                  <li class="clearfix" ref="test">
                        <p class="tip">输入需要追加专属折扣的会员pin：（每行一个pin，一次最多20个）</p>
                        <textarea rows="5" name="" id="" v-model="queryData.pins"></textarea>
                  </li>
                  <li class="send-btn">
                      <el-button type="primary" size='small' @click="sureAdd" class="queryBtn">确定</el-button>
                      <el-button size='small' @click="cancel" class="queryBtn">取消</el-button>
                  </li>
              </ul>
            </el-dialog>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            dialogTableVisible: false,
            queryData: {
                pins: '',
                activityId: ''
            }
        }
    },
    created() {   
    },
    mounted() {
    },
    methods: {
        cancel() {
            this.dialogTableVisible  = false;
        },
        showDialog(data) {
            this.queryData.pins = '';
            this.queryData.activityId = data.id;
            this.dialogTableVisible  = true;
        },
        sureAdd() {
            let _len = this.queryData.pins.split(('\n')).length;
            if(_len > 20) {
              this.$message.error('追加会员一次最多20个会员pin！');
            }else {
              this.$emit('appendFn', this.queryData);
            }
        }
    }
}
</script>

<style lang="less">
.qr-dialog {
    .el-dialog {
        width: 600px;
    }
}
</style>
<style lang="less" scoped>
ul {
    li {
        width: 100%;
        margin-bottom: 10px;
        text-align: center;
        &.send-btn {
            text-align: center;
            margin-top: 30px;
            button {
               width: 100px;
            }
        }
        textarea {
			border: 1px solid #ccc;
			width: 500px;
			padding: 10px;
            min-height: 128px;
            resize: none;
            font-family: yes;
        }
        .tip {
            text-align: left;
            text-indent: 20px;
            margin-bottom: 10px;
        }
    }
}
</style>

