<template>
    <div>
        <div class="qr-dialog">
            <el-dialog :title="'扣减库存'" :visible.sync="dialogTableVisible">
              <ul class="stock_box">
                  <li class="clearfix" ref="test">
                        <el-form label-position="right" label-width="150px" :model="info">
                            <el-form-item label="总库存:">
                                <span>{{info.allCount}}</span>
                            </el-form-item>
                            <el-form-item label="当前剩余库存:">
                                <span>{{info.balanceCount}}</span>
                            </el-form-item>
                            <el-form-item label="扣减库存:">
                                <el-input @blur="blurNum" class="w100"  auto-complete="off" v-model="deductionVal"></el-input>
                            </el-form-item>
                            <el-form-item label="扣减后剩余库存:">
                                <span>{{surplusCount || info.balanceCount}}</span>
                            </el-form-item>
                        </el-form>
                  </li>
                  <li class="send-btn">
                      <el-button type="primary" size='small' @click="toDeduction" class="queryBtn">确定</el-button>
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
            info: {},
            surplusCount: 0,
            deductionVal: null
        }
    },
    created() {   
    },
    mounted() {
    },
    watch: {
        'deductionVal'(val){
            this.surplusCount = this.info.balanceCount - val;
        }
    },
    methods: {
        showStock(data) {
            this.surplusCount = 0;
            this.deductionVal = null;
            this.info = data;
            this.dialogTableVisible  = true;
        },
        cancel() {
            this.dialogTableVisible  = false;
        },
        blurNum(cab) {
            let val = this.deductionVal,
                balance = this.info.balanceCount;
            let defaultVal = balance > 0 ? 1 : '';
            if(!val) {
                this.$set(this,'deductionVal',defaultVal);
                return false;
            }else if(isNaN(Number(val)) || /\./.test(val) || /\+/.test(val) || Number(val <= 0)) {
                this.$message.error('只能输入正整数！');
                this.$set(this,'deductionVal', defaultVal);
                return false;
            }else if(Number(val) > Number(balance)) {
                this.$message.error('扣减库存不能大于当前剩余库存！');
                this.$set(this,'deductionVal', defaultVal);
                return false;
            };
            cab && cab();
        },
        toDeduction() {
            let vm = this;
            vm.blurNum(() => {
                if(vm.deductionVal) {
                    vm.$ajax({
                        api_name: 'getActivityList',
                        vm: this,
                        data: {
                           
                        }
                    }).then(result => {
                        
                    });
                }else {
                    this.dialogTableVisible  = false;
                }

            })
        }
    }
}
</script>

<style lang="less">
.qr-dialog {
    .el-dialog {
        width: 500px;
    }
    .stock_box {
        .el-input{
            height: 30px;
            line-height: 28px;
            &.w100 {
                width: 100px;
            }
            .el-input__inner{
                width: 100%;
                height: 100%;
            }
            &._skuInput.red{
                input{
                    border-color: red;
                }
            }
        }
    }
}
</style>
<style lang="less" scoped>
ul {
    li {
        width: 100%;
        margin-bottom: 10px;
        &.send-btn {
            text-align: right;
            margin-top: 30px;
            button {
               width: 100px;
            }
        }
    }
}
</style>

