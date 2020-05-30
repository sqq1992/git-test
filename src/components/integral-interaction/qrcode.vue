<template>
    <div>
        <div class="qr-dialog qr-code-dialog">
            <el-dialog :title="'预览'" :visible.sync="dialogTableVisible">
              <ul>
                  <li class="clearfix" ref="test">
                      <div id="qrcode">
                          <img :src="qrcode" alt="">
                      </div>
                      <p class="url-msg">{{setUrl}}</p>
                  </li>
                  <li class="send-btn">
                      <el-button size='small' @click="cancel" class="queryBtn">关闭</el-button>
                  </li>
              </ul>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import QRCode from 'qrcode'
export default {
    data(){
        return {
            dialogTableVisible: false,
            qrcode: '',
            setUrl: ''
        }
    },
    created() {
    },
    mounted() {
    },
    methods: {
        showMsg(data,type) {
            let url = '',
                sellerId = this.$store.state.user.venderId,
                shopId = this.$store.state.user.shopId;
            console.log(data.activityType);
            switch (type) {
                case 'interaction':
                    switch (data.activityType) {
                        case 'sign_turntable':
                            url = 'https://wdkj-isv.isvjcloud.com/?href=hd/sign&shopId='+shopId+'&sellerId='+sellerId+'&activityId='+data.id;
                            break;
                        case 'dynamic_turntable':
                            url = 'https://wdkj-isv.isvjcloud.com/?href=hd/draw&shopId='+shopId+'&sellerId='+sellerId+'&activityId='+data.id;
                            break;
                        case 'dynamic_followShop':
                            url = 'https://wdkj-isv.isvjcloud.com/?href=hd/attentionShop&shopId='+shopId+'&sellerId='+sellerId+'&activityId='+data.id;
                            break;
                        case 'newcomer_activity':
                            url = 'https://wdkj-isv.isvjcloud.com/?href=hd/memberShip&shopId='+shopId+'&sellerId='+sellerId+'&activityId='+data.id;
                            break;
                        case 'dynamic_invitationPeople':
                            url = 'https://wdkj-isv.isvjcloud.com/?href=hd/invite&shopId='+shopId+'&sellerId='+sellerId+'&id='+data.id+'#/hd/invite?id='+data.id;
                            break;
                        case 'dynamic_bargain':
                            url = 'https://wdkj-isv.isvjcloud.com/?href=welfare/bargaining&shopId='+shopId+'&sellerId='+sellerId+'&activityId='+data.id;
                            break;
                        case 'collage':
                            url = 'https://wdkj-isv.isvjcloud.com/?href=welfare/spell&shopId='+shopId+'&sellerId='+sellerId+'&activityId='+data.id;
                            break;
                        case 'jd_complete':
                            url = 'https://wdkj-isv.isvjcloud.com/?href=hd/perfect&shopId='+shopId+'&sellerId='+sellerId+'&activityId='+data.id;
                            break;
                        case 'promotion':
                            url = 'https://wdkj-isv.isvjcloud.com/?href=exclusive/membersExclusive&shopId='+shopId+'&sellerId='+sellerId+'&activityId='+data.id;
                            break;
                        case 'newcomerActivity':
                            url = 'https://wdkj-isv.isvjcloud.com/?href=exclusive/membersExclusive&shopId='+shopId+'&sellerId='+sellerId+'&activityId='+data.id;
                            break;
                        default:
                            break;
                        case 'dynamic_openRedEnvelope':
                            url = 'https://wdkj-isv.isvjcloud.com/?href=h5Game/openRedEnvelope&shopId='+shopId+'&sellerId='+sellerId+'&activityId='+data.id;
                            break;
                        case 'dynamic_whackDiglett':
                            url = 'https://wdkj-isv.isvjcloud.com/?href=h5Game/whackDiglett&shopId='+shopId+'&sellerId='+sellerId+'&activityId='+data.id;
                            break;
                        case 'dynamic_wareFollow':
                            url = 'https://wdkj-isv.isvjcloud.com/?href=hd/purchase&shopId='+shopId+'&sellerId='+sellerId+'&activityId='+data.id;
                            break;
                        case 'dynamic_invitationWareFollow':
                            url = 'https://wdkj-isv.isvjcloud.com/?href=hd/invitePurchase&shopId='+shopId+'&sellerId='+sellerId+'&activityId='+data.id;
                            break;
                        // case 'sign_turntable':
                        //     url = 'https://wdkj-isv.jdfw1.com/?href=hd/sign&shopId='+shopId+'&sellerId='+sellerId+'&activityId='+data.id;
                        //     break;
                        // case 'dynamic_turntable':
                        //     url = 'https://wdkj-isv.jdfw1.com/?href=hd/draw&shopId='+shopId+'&sellerId='+sellerId+'&activityId='+data.id;
                        //     break;
                        // case 'dynamic_invitationPeople':
                        //     url = 'https://wdkj-isv.jdfw1.com/?href=hd/invite&shopId='+shopId+'&sellerId='+sellerId+'&id='+data.id+'#/hd/invite?id='+data.id;
                        //     break;
                        // case 'dynamic_bargain':
                        //     url = 'https://wdkj-isv.jdfw1.com/?href=welfare/bargaining&shopId='+shopId+'&sellerId='+sellerId+'&activityId='+data.id;
                        //     break;
                        // case 'collage':
                        //     url = 'https://wdkj-isv.jdfw1.com?href=welfare/spell&shopId='+shopId+'&sellerId='+sellerId+'&activityId='+data.id;
                        //     break;
                        // case 'jd_complete':
                        //     url = 'https://wdkj-isv.jdfw1.com/?href=hd/perfect&shopId='+shopId+'&sellerId='+sellerId+'&activityId='+data.id;
                        //     break;
                        // case 'promotion':
                        //     url = 'https://wdkj-isv.jdfw1.com/?href=exclusive/membersExclusive&shopId='+shopId+'&sellerId='+sellerId+'&activityId='+data.id;
                        //     break;
                        // case 'newcomerActivity':
                        //     url = 'https://wdkj-isv.jdfw1.com/?href=exclusive/membersExclusive&shopId='+shopId+'&sellerId='+sellerId+'&activityId='+data.id;
                        //     break;
                        // case 'dynamic_openRedEnvelope':
                        //     url = 'https://wdkj-isv.isvjcloud.com/?href=h5Game/openRedEnvelope&shopId='+shopId+'&sellerId='+sellerId+'&activityId='+data.id;
                        //   break;
                        // case 'dynamic_whackDiglett':
                        //     url = 'https://wdkj-isv.isvjcloud.com/?href=h5Game/whackDiglett&shopId='+shopId+'&sellerId='+sellerId+'&activityId='+data.id;
                        //   break;
                        // default:
                        //     break;
                    };
                    break;
                case 'gift':
                    url = 'https://wdkj-isv.isvjcloud.com/?href=integral/detail&shopId='+shopId+'&sellerId='+sellerId+'&giftId='+data.id+'&type='+data.giftType;
                    //  url = 'https://wdkj-isv.jdfw1.com/?href=integral/detail&shopId='+shopId+'&sellerId='+sellerId+'&giftId='+data.id+'&type='+data.giftType;
                    break;
                default:
                    break;
            }
            this.setUrl = url;
            this.dialogTableVisible  = true;
            QRCode.toDataURL(url, {errorCorrectionLevel: 'H'}, (err, url) => {
                this.qrcode = url;
            });
        },
        cancel() {
             this.dialogTableVisible  = false;
        }
    }
}
</script>

<style lang="less">
.qr-dialog.qr-code-dialog {
    .el-dialog {
        width: 350px;
    }
}
</style>
<style lang="less" scoped>
ul {
    li {
        width: 100%;
        margin-bottom: 10px;
        text-align: center;
        .gift-item {
            width: 50%;
            float: left;
        }
        #qrcode {
            display: inline-block
        }
        .url-msg {
            word-break: break-all;
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

