<template>
    <el-dialog
        title="设置图片"
        :visible.sync="dialogVisible"
        size="tiny"
        @close="handleClose">
        <div class="img-box">
            <div class="img_title">上传指定图片（{{list.length}}/5）<span>建议图片宽度：750像素</span></div>
            <div class="img_cont">
                <div class="img_list" v-for="(data, index) in list" :key="'list_'+index" @click="activeIndex = index">
                    <i class="el-icon-close icon_close" @click="deleteImg(index)"></i>
                    <img-upload :data="data" @success="fileUploadSuccess" style="width: 100%;height: 100%"></img-upload>
                </div>
                <div class="img_list" v-if="list.length < 5" @click="activeIndex = list.length">
                    <img-upload :data="''" @success="fileUploadSuccess" style="width: 100%;height: 100%"></img-upload>
                </div>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose()">取 消</el-button>
            <el-button type="primary" @click="ok()">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import imgUpload from './img-upload.vue'
export default {
    props: {
        imgList: {
            type: Array,
            default(){
                return []
            }
        }
    },
    data(){
        return {
            dialogVisible: true,
            activeIndex: 0,
            list: []
        }
    },
    created() {
        this.list = this.imgList;
    },
    watch: {
        'imgList'(){
            this.list = this.imgList;
        }
    },
    methods: {
        handleClose(){
            this.$emit('close');
        },
        ok(){
            this.$emit('check', this.list);
        },
        fileUploadSuccess(data){
            this.$set(this.list, this.activeIndex, data);
        },
        deleteImg(index){
            this.list = this.list.splice(index, 1);
        }
    },
    components: {
        imgUpload
    }
}
</script>

<style lang="less" scoped>
    .img_title{
        font-size: 12px;
        span{
            color: #999;
        }
    }
    .img_cont{
        margin-top: 10px;
    }
    .img_list{
        display: inline-block;
        width: 90px;
        height: 90px;
        position: relative;
        margin-right: 20px;
        margin-top: 10px;
        .module_imgs_box{
            width: 100%;
            height: 100%;
            background: none;
            border: 1px dashed #999;
            &:hover{
                border-color: #20a0ff;
            }
        }
        .icon_close{
            position: absolute;
            border: 1px solid #999;
            border-radius: 50%;
            padding: 5px;
            font-size: 10px;
            transform: scale(0.7);
            right: -13px;
            top: -10px;
            background: #fff;
            cursor: pointer;
            z-index: 1;
            &:hover{
                color: red;
                border-color: red;
            }
        }
    }
</style>
