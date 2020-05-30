<template>
    <el-dialog
        :title="config.title || '选择活动商品'"
        :visible.sync="dialogVisible"
        :size="type == 'radio' ? 'tiny' : 'small' "
        class="goodChoose"
        :class="type == 'detail' ? 'goodsDetail':''"
        :show-close="config.close"
        @close="handleClose">
        <div class="choose-box">
            <div class="choose-hint" v-if="!config.hideHint">
                <p>1. 商品折扣和店铺满减活动、优惠券同时生效，请谨慎使用。</p>
                <p>2. 设置的商品折扣不得低于店铺最低折扣<a href="https://prom.shop.jd.com/promotion/limit/mainPromoLimit.action" target="_blank">查看店铺最低折扣</a></p>
                <p>3. 请勿选择近期参加平台秒杀的商品，否则促销将无法生效。<a href="https://jdprice.shop.jd.com/discount/query" target="_blank">查看店铺优惠监控</a></p>
            </div>
            <div class="choose-title" v-if="!config.hideSearch">
                <el-select v-model="queryType" placeholder="请选择" style="width: 110px;">
                    <el-option label="商品名称" :value="0"></el-option>
                    <el-option label="商品编号" :value="1"></el-option>
                </el-select>
                <el-input style="width: 260px;margin-right: 15px;" v-model="queryTitle"></el-input><el-button type="text" @click="queryGoodList(1)">查询</el-button>
            </div>
            <span class="detail-msg" v-if="config.appointType && config.appointType == '1'">每个订单只需包含任意一个指定商品即可：</span>
            <span class="detail-msg" v-if="config.appointType && config.appointType == '2'">每个订单必须包含所有指定商品：</span>
            <div class="choose-body">
                <!-- 选择区 -->
                <ul class="choose-left choose-item-box" :style="type == 'checkbox' ? 'width: 390px;' : ''">
                    <good :item="item" v-for="(item, index) in goodsList" :key="'goodsList_'+index">
                        <a v-if="type != 'detail'" href="javascript:void(0)" class="btns" :class="{'selected': isSelected(item)}" @click="selectGood(item)">{{isSelected(item) ? '已选择' : '选择'}}</a>
                    </good>
                </ul>
                <!-- 已选择区 -->
                <ul class="choose-right choose-item-box" v-if="type == 'checkbox'" :style="type == 'checkbox' ? 'width: 380px;margin-left: 15px;' : ''">
                    <good :item="item" v-for="(item, index) in checkList" :key="'goodsList_'+index">
                        <a href="javascript: void(0)" class="btns" @click="removeSelected(item)">移除</a>
                    </good>
                </ul>
            </div>
            <div class="choose-footer" v-if="type != 'detail'">
                <el-pagination
                    :current-page="queryData.pageNo"
                    @current-change="queryGoodList"
                    :page-size="queryData.pageSize"
                    layout="total, prev, pager, next"
                    :total="queryData.total">
                </el-pagination>
                <div class="checkHint" v-if="type == 'checkbox'">已选择 <span>{{checkList.length}}</span>/{{limit || 10}} 个商品</div>
            </div>
        </div>
        <span slot="footer" class="dialog-footer" v-if="type == 'checkbox'">
            <el-button @click="handleClose()">取 消</el-button>
            <el-button type="primary" @click="selecteGoodCheck()">确 定</el-button>
        </span>
        <span slot="footer" class="dialog-footer" v-if="type == 'detail'">
            <el-button @click="handleClose()">关 闭</el-button>
        </span>
    </el-dialog>
</template>

<script>
import good from './good-item.vue';
import ajax from 'src/api/index.js';
import { clone } from 'src/common/public.js';
/**
 * 接收 type、title  参数
 * 返回 close、check 函数
*/
export default {
    name: 'goodsChoose',
    props: {
        /* radio 单选   checkbox 多选 */
        type: {
            type: String,
            default: 'checkbox',
            required: false
        },
        title: {
            type: String,
            default: '',
            required: false
        },
        config: {
            type: Object,
            default() {
                return {};
            },
            required: false
        },
        limit: {
          type:Number,
          default:10
        },
        selectIdList: {
            type: Array,
            default(){
                return [];
            },
            required: false
        },
        checkGoodsList: {
            type: Array,
            default(){
                return [];
            },
            required: false
        },
        // 选择商品是否根据skuId选择，而不是商品id(wareId)
        selectBySkuId: {
          type: Boolean,
          default: false
        }
    },
    data(){
        return {
            dialogVisible: true,
            goodsList: [],
            checkList: [],
            checkGoodsIdList: [],
            queryData: {
                title: '',
                pageNo: 0,
                pageSize: 5,
                total: 100
            },
            queryType: 0,
            queryTitle: ''
        }
    },
    created() {
        this.checkList = clone(this.checkGoodsList) || [];
        this.checkGoodsIdList = (clone(this.selectIdList) || []).map(wareId => {//支持数组中的wareId是字符串
          return Number(wareId)
        });
    },
    watch: {
        title(){
            this.queryTitle = this.title;
        }
    },
    mounted() {
        this.queryTitle = this.title;
        console.log(this.type, this.type == 'detail', typeof(this.type))
        if(this.type == 'detail') {
            this.goodsList = this.config.goodsList || [];
        }else {
            this.queryGoodList(1);
        }
    },
    methods: {
        handleClose(){
            this.$emit('close');
        },
        queryGoodList(page){
            this.queryData.pageNo = page;
            if(this.queryType == 0){
                this.queryData.title = this.queryTitle;
                this.queryData.wareIdStr = '';
            } else {
                this.queryData.wareIdStr = this.queryTitle;
                this.queryData.title = '';
            }
            ajax({
                api_name: this.$store.state.ziying.isZiying ? 'queryProductWrap':'activityQueryWare',
                data: this.queryData,
                vm: this
            }, result => {
                this.queryData.total = result.data.totalItem;
                this.goodsList = result.data.wareList;
            });
        },
        selectGood(item){
            const id = this.getId(item);
            let index = this.checkGoodsIdList.indexOf(id);
            if(this.checkList.length >= this.limit) {
              this.$message.error(`已选中了${this.limit}件商品`)
              return;
            }
            if(index == -1){
                this.checkList.push(item);
                this.checkGoodsIdList.push(id);
                if(this.type == 'radio'){
                    this.selecteGoodCheck();
                }
            } else {
                if(this.type == 'checkbox') {
                   this.removeSelected(item);
                }
            }
        },
        removeSelected(item){
            const that = this;
            const id = this.getId(item);
            let index = this.checkGoodsIdList.indexOf(id);
            this.checkGoodsIdList.splice(index, 1);
            this.checkList.forEach((ele, i) => {
                if(that.getId(ele) == id){
                    this.checkList.splice(i, 1);
                    return;
                }
            });
        },
        selecteGoodCheck(){
            this.$emit('check', this.checkList, this.checkGoodsIdList);
        },
        // 商品选择状态
        isSelected(item = {}) {
          const id = this.getId(item);
          return this.checkGoodsIdList.indexOf(id) !== -1;
        },
        getId(item = {}) {
          return this.selectBySkuId
            ? item.skuId || item.firstSkuId
            : item.wareId;
        }
    },
    components: {
        good
    }
}
</script>

<style lang="less">
    .goodChoose{
        .el-dialog--tiny{
            width: 500px;
        }
        .el-dialog--small{
            width: 850px;
        }
        .el-input{
            height: 30px;
            line-height: 28px;
        }
        .el-input .el-input__inner {
            width: 100%;
            height: 100%;
        }
    }
    .choose-footer .el-pagination{
        display: inline-block;
    }
</style>


<style lang="less" scoped>
    .choose-body{
        margin-top: 20px;
    }
    .choose-item-box{
        width: 460px;
        display: inline-block;
        border: 1px solid #eaeaea;
        height: 400px;
        overflow-y: scroll;
        box-sizing: border-box;
    }
    .btns{
        display: block;
        width: 68px;
        height: 28px;
        border: 1px solid #eaeaea;
        border-radius: 4px;
        display: block;
        font-size: 14px;
        text-align: center;
        line-height: 28px;
        color: #3089dc;
        &.selected{
            color: #999;
        }
    }
    .checkHint{
        display: inline-block;
        float: right;
        vertical-align: middle;
        margin-top: 20px;
        span{
            color: red;
        }
    }
    .choose-hint{
        color: red;
        font-size: 12px;
        line-height: 20px;
        margin-bottom: 10px;
        a{
            color: #20a0ff;
            margin-left: 20px;
        }
    }
    .detail-msg {
        color: #FF6600;
        font-size: 12px;
    }
</style>
