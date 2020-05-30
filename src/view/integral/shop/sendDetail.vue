<template>
    <div>
        <div class="send-dialog">
            <el-dialog :title="'发放礼品'" :visible.sync="dialogTableVisible" v-if="giftMsg">
              <ul style="margin-top:10px;">
                  <li class="clearfix">
                      <div class="gift-item">
                          <span>会员账号：</span>
                          <span :title="giftMsg.pin || giftMsg.customerPin">{{giftMsg.pin || (giftMsg.customerPin.slice(0,15) + '...') || '-'}}</span>
                      </div>
                      <!-- <div class="gift-item">
                          <span>会员昵称：</span>
                          <span>{{giftMsg.nick || '-'}}</span>
                      </div> -->
                  </li>
                  <li class="clearfix">
                      <div class="gift-item" v-if="giftMsg.giftType == 'commodity' || giftMsg.giftType == 'dynamic_commodity'">
                          <span>收件人姓名：</span>
                          <span>{{giftMsg.phone.name || '-'}}</span>
                      </div>
                      <div class="gift-item">
                          <span>联系方式：</span>
                          <span>{{giftMsg.phone.tel || '-'}}</span>
                      </div>
                  </li>
                  <li v-if="giftMsg.giftType == 'commodity' || giftMsg.giftType == 'dynamic_commodity'">收件地址：{{giftMsg.phone.address || '-'}}</li>
                  <li>
                      <span>礼品：</span>
                      <span v-if="giftMsg.giftType == 'dynamic_commodity'">{{giftMsg.failCase || '-'}}</span>
                      <el-button type="text" @click="gift()" v-else>{{giftMsg.giftName || '-'}}</el-button>
                  </li>
                  <li>数量：1</li>
                  <li v-if="data.type=='send'">
                      <span>填写物流单号完成发货：</span>
                      <input type="text" name="" v-model="trackCode" id="" autocomplete="false">
                  </li>
                  <li v-if="data.type=='detail' && (giftMsg.giftType == 'commodity' || giftMsg.giftType == 'dynamic_commodity')">
                      <span>物流单号：</span>
                      <span v-if="!edit">
                        {{giftMsg.trackCode || '-'}} <el-button type="text" @click="edit = true" style="margin-left: 10px;">修改</el-button>
                      </span>
                      <span v-else>
                        <input type="text" name="" v-model="trackCode" id="" autocomplete="false">
                        <el-button type="primary" size='small' @click="send" style="margin-left: 10px;">确定</el-button>
                      </span>
                  </li>
                  <li v-if="data.type=='detail'">发放时间：{{giftMsg.giveTime || '-'}}</li>
                  <li class="send-btn" v-if="data.type=='send'">
                      <el-button size='small' @click="cancel" class="queryBtn">取消</el-button>
                      <el-button type="primary" size='small' @click="send">确定</el-button>
                  </li>
              </ul>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import ajax from 'src/api/index.js';
export default {
    props: {
        data: {
            type: Object,
            default: {},
        }
    },
    data(){
        return {
            trackCode: '',
            giftMsg: '',
            pageData: {
                pageSize: 5,
                pageTotal: 20,
                pageNo: 1
            },
            couponsList: [],
            couponsIdList: [],
            dialogTableVisible: false,
            edit: false
        }
    },
    created() {
    },
    methods: {
        showMsg(result,id,type) {
            this.dialogTableVisible  = true;
            this.giftMsg = result.data;
            this.giftMsg.giftId = id;
            this.giftMsg.giftType = type;
            this.giftMsg.phone = JSON.parse(this.giftMsg.phone);
            if(this.data.type == 'detail'){
                this.trackCode = this.giftMsg.trackCode;
            }
        },
        cancel() {
             this.dialogTableVisible  = false;
        },
        gift() {
            sessionStorage.setItem('sendGiftMsgName',this.giftMsg.giftName);
            window.open("#/giftList");
        },
        send() {
            let vm = this;
            if(!vm.trackCode){
                this.$message.error('物流单号不能为空！');
                return;
            }
            ajax({
                api_name: 'giveGift',
                data: {
                    id: vm.giftMsg.giftId,
                    trackCode: vm.trackCode
                },
            }, result => {
                vm.trackCode = '';
                vm.edit = false;
                this.$message.success(this.data.type == 'detail' ? '物流单号修改成功！' : '礼品发放成功！');
                this.dialogTableVisible  = false;
                this.$emit('getList')
            });
        }
    }
}
</script>

<style lang="less" scoped>
.send-dialog {
    width: 700px;
}
ul {
    li {
        width: 100%;
        margin-bottom: 10px;
        .gift-item {
            width: 50%;
            float: left;
        }
        a {
            color: #1d90e6;
        }
        input {
            width: 500px;
           &:focus {
              outline: none;
              border-color: #1d90e6;
           }
        }
        &.send-btn {
            text-align: center;
            margin-top: 30px;
            button {
               width: 100px;
            }
        }
    }
}
</style>

