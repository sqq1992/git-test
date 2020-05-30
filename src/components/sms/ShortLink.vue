<template>
    <span >
        <span @click="dialogShortLink = true"><slot></slot></span>
        <el-dialog
            title="短链"
            :visible.sync="dialogShortLink"
            append-to-body
            width="668px">
            <div class="tip-wrap">
                <p class="tip" style="width:8em;">友情提醒：</p>
                <p class="tip" style="padding-right:40px;">默认网址前、后都加空格，可确保手机打开无异常兼容设备识别。另外直接从外部复制粘贴的网址也请务必前后加空格，否则将导致无法正常打开。</p>
            </div>
            <el-form ref="form" label-position="right" :model="form" :rules="rules" size="mini" inline label-width="6em">
                <el-form-item label="长链接" prop="url">
                    <el-input class="link" v-model="form.url"></el-input>
                    <el-button @click="getShortUrl">生成短网址</el-button>
                </el-form-item>
                <Label v-show="link" class="p10" label="短链" type="right" :size="3.3" :mixim-style="{'paddingRight':'12px'}">{{link}}</Label>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogShortLink = false">取 消</el-button>
                <el-button class="J_copy" type="primary" :disabled="!link" @click="handleShortLink">复制</el-button>
            </span>
        </el-dialog>
        <input  ref="clipboard" type="hidden" :data-clipboard-text="link">
    </span>
</template>

<script>
    import Clipboard from 'clipboard'
    import Label from "components/label"
    export default {
        components: {Label},
        data() {
            return {
                dialogShortLink: false,
                shortUrlTypes: [
                    {name:"宝贝",value:0},
                    {name:"店铺",value:1},
                    {name:"活动",value:2}
                ],
                form: {
                    url:"",
                },
                rules: {
                    url: [
                        { required: true, message:"请输入长链接",trigger: 'blur' },
                    ],
                },
                link:""
            }
        },
        mounted() {
            let clipboard = new Clipboard(this.$refs.clipboard);
            clipboard.on('success',() => {
                this.dialogShortLink = false
            })
        },
        methods: {
            handleShortLink() {
                this.$refs.clipboard.click()
            },
            getShortUrl() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$api.getShortUrl({param:{url:this.form.url}}, res => {
                            if(res.shortUrl){
                                this.link = res.shortUrl+" "
                            }else {
                                this.$message({type:"error",message: "生成失败"})
                            }
                        })
                    }
                });
            }
        }
    }
</script>

<style scoped lang="less" rel="stylesheet/less">
    .tip-wrap{
        display: flex;
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
</style>
