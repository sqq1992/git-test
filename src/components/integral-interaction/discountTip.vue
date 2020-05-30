<template>
    <div class="discount-tip-dialog">
        <el-dialog :title="setData.title || '温馨提示'" :visible.sync="dialogTableVisible">
            <ul>
                <li class="clearfix" ref="test">
                    <div v-if="!setData.content">
                        创建成功，为确保商品折扣能正常生效，请致<a href="https://prom.shop.jd.com/promotion/info/info_queryPromotions.action" target="_blank">商家后台-促销列表</a>查看对应商品促销是否已生效。
                    </div>
                    <div v-else v-html="setData.content"></div>
                </li>
                <li class="send-btn">
                    <el-button type="primary" size='small' @click="ok" class="queryBtn">{{setData.okVal || '好的'}}</el-button>
                </li>
            </ul>
        </el-dialog>
    </div>
</template>

<script>
import http from 'src/api/index.js';
export default {
    props: {
        url: String
    },
    data(){
        return {
           dialogTableVisible: false,
           okType: '',
           setData: {}
        }
    },
    methods: {
        show(type, json) {
            json ? this.setData = json : '';
            this.okType = type || '';
            this.dialogTableVisible = true;
        },
        ok() {
            if(this.okType == 'close') {
                this.dialogTableVisible = false;
            }else {
                this.$router.push({path: this.url});
            }
        }
    }
}
</script>

<style lang="less">
.discount-tip-dialog {
    .el-dialog {
        width: 300px;
        ul {
            li {
                a {
                    color: #3089DE;
                }
            }
        }
    }
}
</style>
<style lang="less" scoped>
	.discount-tip-dialog {
        ul {
            li {
                &.send-btn {
                    text-align: center;
                    margin-top: 20px;
                    .queryBtn {
                        width: 100px;
                    }
                }
                a {
                    color: #3089DE;
                }
            }
        }
    }
</style>

