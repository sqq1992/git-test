<template>
    <span>
        <span @click="handleOpen"><slot></slot></span>
        <el-dialog
            class="el-dialog__modify"
            title="我的自定义签名"
            append-to-body
            :visible.sync="showDialog"
            size="small"
            @close="handleClose"
        >
            <ul class="editUl" v-loading="loading">
              <li>
                <label for="">当前签名：</label>
                <template v-if="hasPendingAuditSign">
                  <span class="fc--red">有签名正在审核中，无法重复提交！</span>
                </template>
                <template v-else>
                    <el-input
                    size="mini"
                    :disabled="status == 'edit'"
                    :minlength="2"
                    :maxlength="18"
                    v-model="sign"
                    style="width:150px"
                    placeholder="请输入签名"
                  />
                  <el-button type="text" v-if="status == 'edit'" @click="status = 'editing'">修改签名</el-button>
                  <el-button type="text" v-if="status == 'editing'" @click="editSign">提交</el-button>
                  <el-button type="text" v-if="status == 'editing'" @click="status = 'edit'">取消</el-button>
                  <div class="prompt_box">
                    <div class="fc--red">温馨提示：</div>
                    <ul>
                      <li>1、申请的签名审核时间为1-2个工作日，为了方便过审，请不要使用含有政治、暴力、淫秽、赌博等违法或和店铺无关的内容。</li>
                      <li>2、每个商家只能创建 1 个签名，如需更换，请修改。签名最多18个字节，支持中英文，中文2个字节，英文1个字节。</li>
                      <li>3、签名内容不能包含京东，不能有空格或特殊符号。。</li>
                    </ul>
                  </div>
                </template>
              </li>
              <li v-if="!hasPendingAuditSign">
                <label for="">测试手机号：</label>
                <el-input
                  size="mini"
                  style="width:150px"
                  :disabled="status != 'add'"
                  v-model="phone"
                  placeholder="请输入测试手机号"
                />
                <!-- <el-button type="text" v-if="!hasPendingAuditSign && !!sign && !isEditPhone" @click="isEditPhone = true">修改手机号</el-button>
                <el-button type="text" v-if="isEditPhone" @click="editPhone">提交</el-button>
                <el-button type="text" v-if="isEditPhone" @click="isEditPhone = false">取消</el-button> -->
              </li>
            </ul>
            <span slot="footer" class="dialog-footer">
              <!-- 首次提交签名 -->
              <template v-if="status == 'add'">
                <el-button type="primary" size="small"  @click="addSign" >提交</el-button>
                <el-button type="normal" size="small"  @click="showDialog = false;">取消</el-button>
              </template>
              <template v-else>
                <el-button type="primary" size="small" @click="showDialog = false;">确定</el-button>
              </template>
              <!-- 已经存在签名 -->
            </span>
        </el-dialog>
    </span>
</template>

<script>
    import Clipboard from 'clipboard'
    import Label from "components/label"
    import {deepCopy} from '@/common/utils'
    import http from 'src/api'
    export default {
        components: {Label},
        data() {
            return {
                showDialog: false,
                hasPendingAuditSign:false,//是否存在审核中的签名
                isEditSign:false,//编辑签名标识
                isEditPhone:false,//编辑手机号标识
                status:'add',//add 新增 edit 编辑 editing正在修改中
                isNew:false,//是否是新增签名
                sign:'',//签名
                phone:'',//手机号
                loading:false,
            }
        },
        methods: {
            handleOpen() {
                this.showDialog = true
                this.getAllMarkNames()
            },
            handleClose() {
                this.$emit("updateSign")
            },
            //新增自定义签名
            addSign() {
              let sign = this.sign.trim(),
                  phone = this.phone;
              if(!/^1\d{10}$/.test(this.phone)) {
                  this.$message({type:"warning",message:"请输入正确的手机号！"});
                  return false;
              }
              if(!this.prodContent(sign)) return false;
              this.sendAjax('jdMarketing_addSign',{sign,telephone:phone}).then(res => {
                this.$message.success('新增签名已提交审核');
                this.getAllMarkNames();
              })
            },
            editSign() {//修改签名
              let sign = this.sign.trim()
              if(!this.prodContent(sign)) return false;
              this.$confirm('是否确认修改签名？', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
              }).then(() => {
                this.sendAjax('jdMarketing_modifySign',{sign}).then(res => {
                  this.$message.success('签名已提交审核');
                  this.editSign = false;
                  this.getAllMarkNames();
                })
              })
            },
            editPhone() {//修改手机号
              let {phone,sign} = this;
              // if(!/^1\d{10}$/.test(phone)) {
              //   this.$message({type:"warning",message:"请输入正确的手机号！"});
              //   return false;
              // }
              this.$confirm('是否确认修改手机号？', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
              }).then(() => {
                //修改手机号要传签名 修改签名不需要传手机号  京东的奇葩逻辑
                this.sendAjax('jdMarketing_modifySign',{sign,telephone:phone}).then(res => {
                  this.editPhone = false;
                  this.$message.success('手机号已提交审核');
                  this.getAllMarkNames();
                })
              })
            },
            prodContent(content) {
                if(!content || content.length < 2) {
                  this.$message({type:"warning",message:"请输入签名2~12个字"})
                }
                // else if(content.indexOf('京东') != -1) {
                //   this.$message({type:"warning",message:"签名内容不能包含京东"})
                // }
                // else if(!/[\u4e00-\u9fa5]/g.test(content)) {
                //     this.$message({type:"warning",message:"签名内容至少含有一个中文字!"})
                // }
                else if(/[ !@#$%^&*~]/g.test(content)) {
                    this.$message({type:"warning",message:"签名不能有空格或特殊符号!"})
                } else {
                    return true
                }
                return false
            },
            //获取签名
            getAllMarkNames() {
              this.loading = true;
              this.isEditSign = false;
              this.sendAjax('jdMarketing_getSigns').then(({data:{hasPendingAuditSign,sign,phone}}) => {
                console.log(!hasPendingAuditSign && !sign && !phone);
                if(!hasPendingAuditSign && !sign && !phone) {//新增状态
                  this.status = 'add';
                } else if(sign && phone) {//编辑状态
                  this.status = 'edit';
                } else if(hasPendingAuditSign) {
                  this.status = 'edit';
                }
                this.hasPendingAuditSign = hasPendingAuditSign;
                this.sign = sign ? sign.replace(/[【|】]/g,'') : '';
                this.phone = phone;
              })
            },
            sendAjax(url,data) {
                this.loading = true;
                return new Promise((resolve,reject) => {
                    http({
                        api_name: url,
                        data
                    },res => {
                        this.loading = false;
                        resolve(res);
                    },error => {
                      this.$message.error(error);
                      this.loading = false;
                    })
                })
            }
        }
    }
</script>

<style scoped lang="less" rel="stylesheet/less">
    // .tip-wrap{
    //     margin-bottom:10px;
    //     padding:10px;
    //     border-radius:4px;
    //     background:#fff1e8;
    //     .tip{
    //         font-size:12px;
    //     }
    // }
    // .link-name{width:173px;}
    // .link{width:350px;}
    // .el-form-item:last-of-type{
    //     margin-bottom:0;
    // }
    // .el-button--mini{font-size: 12px ;border-radius: 2px;padding:7px 12px;}
    // .el-button--text{
    //     padding:0 5px 0 0;
    //     margin:7px 1px 7px 0;
    //     border-right:1px solid #3089dc;
    //     color:#3089dc;
    //     &:last-of-type{
    //         border-right:none;
    //     }
    //     &:hover{
    //         color:#f60;
    //         text-decoration:underline;
    //     }
    // }
    // .pl60{
    //     padding-left:60px;
    // }
    .prompt_box {
      line-height:16px;
      font-size:12px;
    }
</style>
