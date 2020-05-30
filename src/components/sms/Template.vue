<template>
    <span>
        <span @click="handleOpen"><slot></slot></span>
        <el-dialog
            class="el-dialog__modify"
            title="系统模板"
            :visible.sync="dialog"
            append-to-body
            width="590px">
            <!-- :span-method="spanMethod" -->
            <!-- :row-class-name="tableRowClassName" -->
            <el-table
                class="el-table__modify"
                :data="tableData"
                size="mini"
                v-loading="loading"
            >
                <el-table-column label="模板内容">
                    <div slot-scope="scope">
                      <!-- v-if="!scope.row.isEdit" -->
                        <p class="pl10 fc--333" >{{ scope.row.content }}</p>
                        <!-- <div class="textarea-warp textarea__template-wrap" v-else>
                            <el-input
                                type="textarea"
                                resize="none"
                                autosize
                                autofocus
                                v-model="scope.row.edit"
                            ></el-input>
                            <span class="edit__btn-wrap">
                                <el-button class="el-button__edit" type="primary" size="mini" @click="handleEdit(scope.row)">确定</el-button>
                                <el-button class="el-button__edit" type="info" plain size="mini" @click="toggleEdit(scope.row)">取消</el-button>
                            </span>
                        </div> -->
                    </div>
                </el-table-column>
                <el-table-column label="操作" width="140">
                    <template slot-scope="scope">
                        <el-button type="text" size="mini" @click="handleUse(scope.row.content)">使用</el-button>
                        <!-- <el-button type="text" size="mini" :disabled="scope.row.isEdit" @click="toggleEdit(scope.row)">修改</el-button>
                        <el-button type="text" size="mini" v-loading="scope.row.loading" @click="handleDelete(scope.$index,scope.row)">删除</el-button> -->
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                background
                v-show="total"
                :current-page.sync="pageNo"
                @current-change="handleCurrentChange"
                :page-size="5"
                prev-text="上一页"
                next-text="下一页"
                layout="total, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-dialog>
    </span>
</template>
<script>
    import ajax from 'src/api/index.js';
    export default {
        props:{
          tempType:{
            type:[Number,String],
            default:''
          }
        },
        data() {
            return {
                dialog: false,
                tableData:[],
                pageNo:1,
                total:0,
                loading:false
            }
        },
        methods: {
            handleOpen() {
                this.dialog = true
                this.lookTemplate()
            },
            handleCurrentChange() {
                this.lookTemplate()
            },
            lookTemplate() {
              this.loading = true;
               ajax({
                  api_name: 'getSysTemplate',
                  data:{
                    msgType:this.tempType
                  },
                  vm: this
                },
                res => {
                  this.tableData = res.data.templates || []
                  // console.log(result.data.templates);
                  this.loading = false;
                },
                error => {
                  this.loading = false;
                  this.$message({
                      message: error || '未知错误！',
                      type: 'error'
                  });
                })
                // this.$api.lookTemplate({param:{pageNo:this.pageNo,pageSize:5}},res => {
                //     res.list && res.list.forEach(item => { // 必须初始化 否则需要手动监听
                //         item.isEdit = false
                //         item.edit = item.content
                //         item.loading = false
                //     })
                //     this.tableData = res.list || []
                //     this.total = res.allCount
                // },false,loading => {
                //     this.loading = loading
                // })
            },
            toggleEdit(row) {
                row.edit = row.content
                row.isEdit = !row.isEdit
            },
            handleEdit(row) {
                var edit = row.edit.trim()
                if(row.content !== edit){
                    if(!edit) return this.$message({type:"warning",message:"请输入修改内容！"})
                    this.$api.modifyTemplate({param:{content:edit,templateId:row.id}},() => {
                        row.content = row.edit
                        this.$message({type:"success",message:"修改成功！"})
                    })
                }
                row.isEdit = !row.isEdit
            },
            handleDelete(index,row) {
                this.$confirm('此操作将永久删除模板, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$api.deleteTemplate({param:{templateId:row.id}},() => {
                        this.tableData.splice(index, 1);
                        this.$message({type:"success",message:"删除成功！"})
                        this.$nextTick(() => {
                            this.lookTemplate()
                        })
                    },false,loading => {
                        row.loading = loading
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            },

            handleUse(content) {
                this.$emit('use',content)
                this.dialog = false
            },

            spanMethod({ row, column, rowIndex, columnIndex }) {
                if (row.isEdit) {
                    if (columnIndex === 0) {
                        return [1, 2];
                    } else if (columnIndex === 1) {
                        return [0, 0];
                    }
                }
            },
            tableRowClassName({row, rowIndex}){
                if (row.isEdit) {
                    return 'edit-row';
                }
                return '';
            }

        }
    }
</script>
<style scoped lang="less" rel="stylesheet/less">
.textarea-warp{
    position:relative;
    .edit__btn-wrap{
        position:absolute;
        right:15px;
        bottom:6px;
    }

    .el-button__edit{
        padding:4px 6px;
    }
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
</style>
