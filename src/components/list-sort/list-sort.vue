<template>
    <div class="sort_btn">
        <el-button type="text" @click="showDialog">调整{{type == 'activity' || type == 'promotion' ? '活动' : '礼品'}}展示排序</el-button>
        <el-dialog :title="`调整${type == 'activity' || type == 'promotion' ? '活动' : '礼品'}展示排序`" :visible.sync="dialogTableVisible">
            <div class="sort_hint">支持手动调整{{type == 'activity' ? '活动' : '礼品'}}排序，调整后的{{type == 'activity' || type == 'promotion' ? '活动' : '礼品'}}排序将在会员中心页面中立即生效</div>
            <div>快速排序：
                <el-button type="text" @click="sortList1()">优先展示最近{{type == 'activity' || type == 'promotion' ? '开始的活动' : '上架'}}</el-button>
                <el-button type="text" @click="sortList2()">优先展示{{type == 'activity' ? '最早开始的活动' : type == 'promotion' ? '剩余数量最多': '剩余库存最多'}}</el-button>
                <!-- TODO -->
                <el-button type="text" @click="sortList3()" v-if="type == 'gift'">所需积分最大</el-button>
                <el-button type="text" @click="sortList4()" v-if="type == 'gift'">所需积分最小</el-button>
            </div>
            <el-table :data="dataList" height="250" border>
                <el-table-column class-name="ellipsis" :label="item.text" :width="item.width || 'auto'" v-for="(item, index) in header" :key="'header_'+index">
                    <template scope="scope">
                        <el-tooltip class="item" effect="dark" :content="(scope.row[item.key] || scope.row[item.key] == 0) && scope.row[item.key].toString  && scope.row[item.key].toString()" placement="top">
                            <div class="ellipsis">{{scope.row[item.key]}}</div>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button type="text" @click="move('down', scope.$index, scope.row)" v-if="scope.$index < data.length - 1">下移</el-button>
                        <el-button type="text" @click="move('up', scope.$index, scope.row)" v-if="scope.$index > 0">上移</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <p class="sort_table_hint">当前共有{{dataList.length}}个有效的{{type == 'activity' ? '活动' : '礼品'}}</p>
            <div class="sort_btn_box">
                <el-button @click="dialogTableVisible = false;">取消</el-button>
                <el-button type="primary" @click="checkSortList()">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { clone } from 'src/common/public.js';
export default {
    props: {
        type: {
            type: String,
            default: 'activity'
        },
        data: {
            type: [Object,Array],
            default(){
                return []
            }
        },
        header: {
            type: Array,
            default(){
                return []
            }
        },
        sort1: {
            type: Function,
            default(){
                return () => {}
            }
        },
        sort2: {
            type: Function,
            default(){
                return () => {}
            }
        },
        sort3: {
            type: Function,
            default(){
                return () => {}
            }
        },
        sort4: {
            type: Function,
            default(){
                return () => {}
            }
        },
        getList: {
            type: Function,
            default(){
                return () => {}
            }
        }
    },
    data(){
        return {
            dialogTableVisible: false,
            dataList: []
        }
    },
    created() {
        this.dataList = clone(this.data);
    },
    watch: {
        'data'(){
            this.dataList = clone(this.data);
        }
    },
    methods: {
        showDialog(){
            this.dialogTableVisible = true;
            this.getList();
        },
        move(type, index, row){
            let data = this.dataList.splice(index, 1)[0];
            if(type == 'down'){
                this.dataList.splice(index+1, 0, data);
            } else {
                this.dataList.splice(index-1, 0, data);
            }
        },
        sortList1(){
            let vm = this;
            this.dataList.sort((a, b) => {
                if(vm.sort1){
                    return vm.sort1(a, b);
                } else {
                    return a - b;
                }
            });
        },
        sortList2(){
            let vm = this;
            this.dataList.sort((a, b) => {
                if(vm.sort2){
                    return vm.sort2(a, b);
                } else {
                    return a - b;
                }
            });
        },
        sortList3(){
            let vm = this;
            this.dataList.sort((a, b) => {
                if(vm.sort3){
                    return vm.sort3(a, b);
                } else {
                    return a - b;
                }
            });
        },
        sortList4(){
            let vm = this;
            this.dataList.sort((a, b) => {
                if(vm.sort4){
                    return vm.sort4(a, b);
                } else {
                    return a - b;
                }
            });
        },
        checkSortList(){
            let data = clone(this.dataList);
            this.$emit('checkSortList', data);
            this.dialogTableVisible = false;
        }
    }
}
</script>

<style lang="less">
    .sort_btn{
        margin-top: 10px;
        .sort_hint{
            border: 1px solid #ffddaf;
            background: #fbf3e1;
            padding: 10px;
            border-radius: 2px;
            color: #333;
            font-size: 14px;
        }
        .ellipsis{
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            .cell{
                white-space: nowrap;
            }
        }
        .sort_table_hint{
            font-size: 12px;
            margin-top: 10px;
        }
        .sort_btn_box{
            text-align: right;
            margin-top: 10px;
        }
    }
</style>
