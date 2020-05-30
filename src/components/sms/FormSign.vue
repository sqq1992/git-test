<template>
    <span>
        <span @click="handleOpen"><slot></slot></span>
        <el-dialog
            class="el-dialog__modify"
            title="我的自定义签名"
            append-to-body
            :visible.sync="dialog"
            @close="handleClose"
        >
            <p>
                请输入与店铺名称相近的短信签名，提交审核后客服将在2个工作日内进行审核
            </p>
            <el-table class="el-table__modify" :data="signTable" size="mini" v-loading="loading">
                <el-table-column label="序号" width="90">
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{ scope.$index + 1 }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="签名" :render-header="handleUnknown">
                    <template slot-scope="scope">
                        <span v-if="!scope.row.isEdit && (scope.row.status === 0 || scope.row.status  === 1 || signList[scope.$index].sign)">{{signList[scope.$index].sign}}</span>
                        <el-input size="mini" :maxlength="12" :minlength="2" v-else v-model="scope.row.sign" placeholder="请输入2~12个字，支持中英文"></el-input>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="更改时间" width="170" >
                    <template slot-scope="scope">
                        <span style="margin-left: 10px"><i v-show="scope.row.modified" class="el-icon-time"></i>{{ scope.row.modified }}</span>
                    </template>
                </el-table-column> -->
                <el-table-column label="状态" width="90">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status === 0" class="fc--gray">审核中</span>
                        <span v-if="scope.row.status === 1" class="wt-cursor fc--green">成功</span>
                        <span v-if="scope.row.status === 2 && signList[scope.$index].sign" class="wt-cursor fc--red">失败</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status === 0">
                            <!--<el-button type="text" size="mini" disabled>修改</el-button>-->
                            <el-button type="text" size="mini"  @click="deleteMarkName(scope.row.sign)">删除</el-button>
                        </span>
                        <span v-if="scope.row.status === 1 || (scope.row.status === 2 && signList[scope.$index].sign)" class="wt-cursor fc--red">
                            <template v-if="scope.row.isEdit">
                                <el-button type="text" size="mini" @click="handleEdit(scope.row,scope.$index)">确定</el-button>
                                <el-button type="text" size="mini" @click="scope.row.isEdit = false;scope.row.sign = signList[scope.$index].sign">取消</el-button>
                            </template>
                            <template v-else>
                                <el-button type="text" size="mini" @click="scope.row.isEdit = true">修改</el-button>
                                <el-button type="text" size="mini" @click="deleteMarkName(scope.row.sign)">删除</el-button>
                            </template>
                        </span>
                        <span v-if="scope.row.status === undefined && !signList[scope.$index].sign" @click="addMarkName(scope.row.sign)" class="wt-cursor fc--blue">提交</span>
                    </template>
                </el-table-column>
            </el-table>
            <div>
                <p class="fz12 pt5"><span class="fc--red" style="font-weight:bold;">温馨提示：</span>1、申请的签名审核时间为1-2个工作日，如果比较急使用，可联系客服快速处理。 </p>
                <p class="fz12 pl60">2、签名要求2~12个字，不能全英文或全数字，不能有空格或特殊符号。</p>
                <p class="fz12 pl60">3、自定义签名最多为2个，如需更换，请先删除再重新申请。</p>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" size="mini" @click="dialog = false;">确 定</el-button>
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
                dialog: false,
                form:{},
                signList:[],
                loading:false
            }
        },
        computed: {
            signTable() {
                let list = this.signList,len = list.length;
                for(var i=len; i < 2 ; i++){
                    this.signList.push({sign:"",isEdit:false})
                }
                return deepCopy(this.signList)
            }
        },
        methods: {
            handleOpen() {
                this.dialog = true;
                this.getAllMarkNames()
            },
            handleClose() {
                this.$emit("updateSign")
            },

            handleEdit(row,index) {
                let content = row.sign.trim(),markName = this.signList[index].sign
                if(markName == content){
                    return row.isEdit = false
                }
                if(!this.prodContent(content)){
                    return false
                }
                if(!/[\u4e00-\u9fa5]/g.test(content)) {
                    return this.$message({type:"warning",message:"签名内容至少含有一个中文字!"})
                }
                if(!/^[\u4e00-\u9fa5a-zA-Z-z0-9]+$/g.test(content)) {
                    return this.$message({type:"warning",message:"签名只能包含中文、数字、字母!"})
                }
                this.$confirm('此操作不可撤回, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.sendAjax('delete',markName).then(() => {
                        this.sendAjax('add',content).then(() => {
                            this.getAllMarkNames();
                        })
                    })
                }).catch(() => {
                    row.isEdit = false
                    row.sign = markName
                });
            },

            prodContent(content) {
                if(!content || content.length < 2) {
                    this.$message({type:"warning",message:"请输入签名2~12个字"})
                }else if(!/[\u4e00-\u9fa5]/g.test(content)) {
                    this.$message({type:"warning",message:"签名内容至少含有一个中文字!"})
                }else if(!/^[\u4e00-\u9fa5a-zA-Z-z0-9]+$/g.test(content)) {
                    this.$message({type:"warning",message:"签名只能包含中文、数字、字母!"})
                }else {
                    return true
                }
                return false
            },

            handleUnknown(h) {
                return h('el-tooltip',{
                    props: {
                        placement:"top",
                        effect:"light"
                    }
                },[
                    h('span',{slot: 'content'},[
                        h('p',{class:['lh18']},"1）签名需2个及以上，（数字、字母、汉字均算一个字符）"),
                        h('p',{class:['lh18']},"2）签名必须含有汉字，且不能含有特殊字符（如*，~等）"),
                        h('p',{class:['lh18']},"3）签名内容不能含有非法文字（如黄赌毒等）"),
                        h('p',{class:['lh18'],style:{width:'25em'}},"4）签名需能明确体现使用者信息，如产品名称、企业名称等，像【身份验证】、【到期提醒】等则不符合规范"),
                        h('p',{class:['lh18']},"5）签名不能是个人姓名、个人昵称等"),
                        h('p',{class:['lh18']},"6）若审核失败，请删除后重新提交。"),
                    ]),
                    h('span',{style:{cursor: 'pointer'}},[
                        "签名",
                        h('i',{
                            class:['el-icon-question']
                        })
                    ])

                ])
            },

            //删除自定义签名
            deleteMarkName(sign) {
                this.$confirm('此操作不可撤回, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                   this.sendAjax('delete',sign).then(() => {
                       this.getAllMarkNames();
                   })
                }).catch(() => {});

            },
            //自定义签名
            getAllMarkNames() {
                this.loading = true;
                http({
                    api_name:'marketingGetSignList',
                    data:{
                    status
                    }
                },({data:{list}}) => {
                    this.signList = list.map(item => {
                        item.isEdit = false;
                        return item;
                    });
                    this.loading = false;
                },error => {
                    this.loading = false;
                })
            },

            //新增自定义签名
            addMarkName(sign) {
                if(!this.prodContent(sign.trim())){
                    return false
                }
                this.sendAjax('add',sign).then(() => {
                    this.getAllMarkNames();
                })
            },
            sendAjax(type,sign) {
                this.loading = true;
                return new Promise((resolve,reject) => {
                    http({
                        api_name: type == 'add' ? 'marketingAddSign' : 'marketingDeleteSign',
                        data:{sign}
                    },res => {
                        this.loading = false;
                        this.$message.success(type == 'add' ? '新增签名成功！' : '删除签名成功！');
                        resolve();
                    },error => {
                        this.loading = false;
                    })
                })
            },
            onClose() {
                this.$emit('close',1);
            }
        }
    }
</script>

<style scoped lang="less" rel="stylesheet/less">
    .tip-wrap{
        margin-bottom:10px;
        padding:10px;
        border-radius:4px;
        background:#fff1e8;
        .tip{
            font-size:12px;
        }
    }
    .link-name{width:173px;}
    .link{width:350px;}
    .el-form-item:last-of-type{
        margin-bottom:0;
    }
    .el-button--mini{font-size: 12px ;border-radius: 2px;padding:7px 12px;}
    .el-button--text{
        padding:0 5px 0 0;
        margin:7px 1px 7px 0;
        border-right:1px solid #3089dc;
        color:#3089dc;
        &:last-of-type{
            border-right:none;
        }
        &:hover{
            color:#f60;
            text-decoration:underline;
        }
    }
    .pl60{
        padding-left:60px;
    }
</style>
