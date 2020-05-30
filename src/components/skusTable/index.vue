<template>
  <div class="skusTable">
    <!-- <div v-if="!isZiying"><el-checkbox v-model="showStockNumNullFlg">当前已{{showStockNumNullFlg ? '展示' : '隐藏'}}库存为0的sku数据</el-checkbox></div> -->
    <!-- 编辑 查看状态下使用skus -->
     <el-table
        :data="skuList"
        style="width: 840px;"
        :row-class-name="filterStockNumNull"
      >
        <el-table-column label="" align="left" min-width="50" v-if="type == 'radio'">
          <template slot-scope="scope">
              <el-radio v-model="checkSkuId"  :label="scope.row.skuId">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column label="" width="50" v-else>
          <template scope="scope">
              <el-checkbox v-if="!scope.row.isDefault" v-model="multiChecked" :label="scope.row.skuId"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="商品信息" width="230">
          <template scope="scope">
            <el-tooltip class="goodName" effect="dark" :content="scope.row.skuName" placement="top-start">
              <div>
                {{scope.row.skuName}}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column width="90" label="原价">
          <template scope="scope">
            <span v-if="!scope.row.isDefault">
              <span v-if="scope.row.jdPrice && !isZiying">{{scope.row.jdPrice}}</span>
              <el-input v-else v-model="scope.row.jdPrice" class="el_input _skuInput" @blur="changeFinalPrice(scope.row, 'jdPrice')" @focus="removeRedClass()" :disabled='status ? true : false'></el-input>
            </span>
          </template>
        </el-table-column>
        <el-table-column width="90" label="折扣">
          <template scope="scope">
            <el-input v-model="scope.row.discount" class="el_input _skuInput" @blur="changeFinalPrice(scope.row, 'discount')" @focus="removeRedClass()" :disabled='status ? true : false'></el-input>
          </template>
        </el-table-column>
        <el-table-column width="130" label="优惠金额">
          <template scope="scope">
            <el-input v-model="scope.row.disPrice" class="el_input _skuInput" @blur="changeFinalPrice(scope.row, 'disPrice')" @focus="removeRedClass()" :disabled='status ? true : false'></el-input>
          </template>
        </el-table-column>
        <el-table-column width="100" label="到手价">
          <template scope="scope">
            <span v-if="!scope.row.isDefault">{{scope.row.finalPrice}}</span>
          </template>
        </el-table-column>
        <el-table-column label="库存">
          <template scope="scope">
            <span :class="{'fc--red':scope.row.stockNum <= 0}">{{scope.row.stockNum}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="管理" align="left" v-if="type == 'multi'">
          <template scope="scope">
            <el-button type="text" :disabled="skuList.length <= 2" @click="delSkuList(scope.row, scope.$index)" v-if="!scope.row.isDefault && (status ? false : true)">删除</el-button>
            <span v-if="status">--</span>
          </template>
        </el-table-column> -->
      </el-table>
  </div>
</template>
<script>
import { clone, isWhiteList } from 'src/common/public.js';
import validation from 'src/common/validation.js'
import ajax from 'src/api/index.js';
import $ from 'jquery';
export default {
  props:{
    goodData:{
      type:Object,
      default:{}
    },
    status:[String,Boolean],
    /**
     * radio 单选
     * multi 多选
     */
    type: {
      type:String,
      default:'multi'
    },
    skusData:{//回显时使用
      type:[String,Object],
      default:{}
    }
  },
  created() {
    if(this.goodData && this.goodData.wareId) {
      this.getGoodSkuList();
    } else if (this.skusData) {
      this.setGoodSkuList(this.skusData);
    }
  },
  data() {
   return {
     isZiying:this.$store.state.ziying.isZiying,
     skuList:[],
    //  showStockNumNullFlg:false,
     showStockNumNullFlg:true,//默认显示库存为0的商品
     checkSkuId:'',
     multiChecked:[],
   }
 },
 watch:{
   goodData() {
    if(!this.status) {
    this.getGoodSkuList();
    }
   },
   skusData(val) {
    this.setGoodSkuList(val);
   },
   multiChecked(newVal, oldVal) {
     if(newVal.length > 2) {
       this.multiChecked = oldVal;
       return this.$message.error('京东目前只支持选择2个sku！')
     }
   }
 },
 methods: {
   setGoodSkuList(val) {//回显的数据
    let {skuList} = this,
        _list = [];
    try {
      if(typeof val == 'string') {
        _list = JSON.parse(val);
        // this.skuList = JSON.parse(val);
      } else if(Object.prototype.toString.call(val) == '[object Array]') {
        _list = val;
        // this.$set(this,'skuList',val);
      }
      if(this.type == 'radio') {
        this.checkSkuId = _list[0].skuId;
      } else {
        _list.forEach(item => {
          item.disPrice = (item.jdPrice - item.finalPrice).toFixed(2);
        })
        this.$set(this,'skuList',_list);
      }
    } catch(e) {
      console.error(e);
    }
   },
   getGoodSkuList(){//获取skuList列表数据
      let url = this.type == 'multi' ? this.isZiying ? 'queryProductWrapById':'querySkuByWareId' : 'querySkuByWareId';
			ajax({
				api_name: url,
				data: {
					wareId: this.goodData.wareId
				},
				vm: this
			}, result => {
        if(this.type == 'multi') {//多选时 添加统一修改
          result.data.skuList.unshift({
            discount: '',
            disPrice: '',
            finalPrice: '',
            jdPrice: this.goodData.price,
            skuId: '',
            skuName: '批量修改',
            isDefault: true
          });
        }
				result.data.skuList.forEach(item => {
					item.discount = '';
					item.disPrice = '';
					item.finalPrice = '';
				});
				this.skuList = result.data.skuList;
			});
    },
    changeFinalPrice(item, type){
			// 为空不检验
			if(!item[type]) return;
			var reg = /^\d{0,8}\.{0,1}(\d{1,2})?$/;
			if(type == 'discount'){
				if(!validation.isNum(item.discount)){
					this.$message.error('只能输入正数，且优惠值不能大于原价！');
					return;
				} else if(item.discount >= 10 || item.discount <= 0){
					this.$message.error('只能输入正数，且优惠值不能大于原价！');
					return;
				} else if(!reg.test(item.discount)){
					this.$message.error('商品折扣不能超过2位小数');
					return;
				}
				item.disPrice = ((10 - item.discount) * 0.1 * item.jdPrice).toFixed(2);
        item.finalPrice = (item.jdPrice *  (item.discount * 0.1)).toFixed(2);
			} else if(type == 'jdPrice') {
				if(!validation.isNum(item.jdPrice)) {
          this.$message.error('只能输入正数，且优惠值不能大于原价！');
					return;
				}else if(Number(item.disPrice) >= Number(item.jdPrice)){
					this.$message.error('只能输入正数，且优惠值不能大于原价！');
					return;
				} else if(!reg.test(item.jdPrice)){
					this.$message.error('原价金额不能超过2位小数');
					return;
				}
        item.discount = ((1 - item.disPrice / item.jdPrice) * 10).toFixed(3).slice(0,-1);
				item.finalPrice = (item.jdPrice - item.disPrice).toFixed(2);
			} else {
				if(!validation.isNum(item.disPrice)){
					this.$message.error('只能输入正数，且优惠值不能大于原价！');
					return;
				} else if(Number(item.disPrice) >= Number(item.jdPrice) || item.disPrice <= 0){
					this.$message.error('只能输入正数，且优惠值不能大于原价！');
					return;
				} else if(!reg.test(item.disPrice)){
					this.$message.error('优惠金额不能超过2位小数');
					return;
				}
				item.discount = ((1 - item.disPrice / item.jdPrice) * 10).toFixed(3).slice(0,-1);
				item.finalPrice = (item.jdPrice - item.disPrice).toFixed(2);
			}
			if(item.isDefault){
				this.skuList.forEach(sku => {
					if(type == 'discount'){
						sku.discount = item.discount;
						sku.disPrice = ((10 - sku.discount) * 0.1 * sku.jdPrice).toFixed(2);
						sku.finalPrice = (sku.jdPrice *  (sku.discount * 0.1)).toFixed(2);
					}else if(type == 'jdPrice') {
						sku.jdPrice = item.jdPrice;
						if(sku.discount) {
							sku.disPrice = ((10 - sku.discount) * 0.1 * sku.jdPrice).toFixed(2);
						    sku.finalPrice = (sku.jdPrice *  (sku.discount * 0.1)).toFixed(2);
						}else if(sku.disPrice) {
							sku.discount = ((1 - sku.disPrice / sku.jdPrice) * 10).toFixed(3).slice(0,-1);
							sku.finalPrice = (sku.jdPrice - sku.disPrice).toFixed(2);
						}
					} else {
						sku.disPrice = item.disPrice;
						sku.discount = ((1 - sku.disPrice / sku.jdPrice) * 10).toFixed(3).slice(0,-1);
						sku.finalPrice = (sku.jdPrice - sku.disPrice).toFixed(2);
					}
				});
      }
      if(this.type == 'radio') {
        this.checkSkuId = item.skuId;
      }
    },
    validation() {//验证数据
      let {skuList, checkSkuId, type, multiChecked} = this,
          reg = /^\d{0,8}\.{0,1}(\d{1,2})?$/,
          errObj = {},
          checkArr = [];//单选使用
      try {
	      if(skuList.length <= 0){
          errObj.msg = '专享折扣列表不能为空！';
          throw errObj;
        }
        if(this.type == 'radio' && !this.checkSkuId) {
          errObj.msg = '请选择 折扣商品！';
          throw errObj;
        }
        if(this.type == 'multi' && !this.multiChecked.length > 0) {
           errObj.msg = '请选择 折扣商品！';
          throw errObj;
        }
        // 商品sku列表循环
        skuList.forEach((item, index) => {
          if(item.isDefault){ return }
          //如果为单选则进行checkSkuId判断 否则直接跳过
          if(this.type == 'radio' ? checkSkuId == item.skuId : multiChecked.includes(item.skuId)) {
            if(!item.jdPrice) {
              errObj.msg = '商品原价不能为空';
              errObj.type = 'input';
              errObj.index = index;
              throw errObj;
            } else if(!item.discount){
              errObj.msg = '商品折扣不能为空';
              errObj.type = 'input';
              errObj.index = index;
              throw errObj;
            } else if(!validation.isNum(item.discount)){
              errObj.msg = '只能输入正数，且优惠值不能大于原价！';
              errObj.type = 'input';
              errObj.index = index;
              throw errObj;
            } else if(!reg.test(item.discount)){
              errObj.msg = '商品折扣不能超过2位小数';
              errObj.type = 'input';
              errObj.index = index;
              throw errObj;
            } else if(!item.disPrice){
              errObj.msg = '优惠金额不能为空';
              errObj.type = 'input';
              errObj.index = index;
              throw errObj;
            } else if(!validation.isNum(item.disPrice)){
              errObj.msg = '只能输入正数，且优惠值不能大于原价！';
              errObj.type = 'input';
              errObj.index = index;
              throw errObj;
            } else if(Number(item.disPrice) >= Number(item.jdPrice) || item.discount <= 0){
              errObj.msg = '只能输入正数，且优惠值不能大于原价！';
              errObj.type = 'input';
              errObj.index = index;
              throw errObj;
            } else if(!reg.test(item.disPrice)){
              errObj.msg = '优惠金额不能超过2位小数';
              errObj.type = 'input';
              errObj.index = index;
              throw errObj;
            }
            if(type == 'radio') {
              checkArr = [item];
            }
          }
        });
      } catch(e) {
        if(e.type == 'input') {
          let dom = $('.el-table__body').find('tr').eq(e.index);
          dom.find('._skuInput').addClass('red');
          this.scrollToLocation(dom);
        }
        return e;
      }
      return type == 'radio' ? checkArr : skuList;
    },
    getData() {
      let result = this.validation();
      if(Object.prototype.toString.call(result) == '[object Array]') {//判断是否为数组 不为数组则是errorObj
        let skuList = clone(result);
        if(this.type == 'multi') {
          let finalResult = [];
          skuList.forEach((list,index) => {//多选情况下 去除统一修改
            // if(list.isDefault) {
            //   skuList.splice(index,1);
            // }
            if(this.multiChecked.includes(list.skuId)) {
              finalResult.push(list);
            }
          })
          skuList = finalResult;
        }
        return skuList;
      } else {
        return result;
      }
    },
    scrollToLocation(scrollToContainer){
			let mainContainer = $('#container');
			mainContainer.animate({
				scrollTop: scrollToContainer.offset().top - mainContainer.offset().top + mainContainer.scrollTop() - 200
			}, 1000);
		},
    filterStockNumNull(row, index){
			let className = '';
			if(row.isDefault || row.stockNum > 0 || this.showStockNumNullFlg){
				className = '';
			} else {
				className = 'disNone';
			}
			return className
		},
    removeRedClass(){
			$('._skuInput').removeClass('red');
		},
    delSkuList(item, index){//删除
      console.log(this.skuList);
			this.skuList.splice(index, 1);
		},
 }
}
</script>
<style lang="less">
.skusTable {
  .el-input__inner {
    height:99% !important;
  }
  .el-checkbox__label {
    // display: none;
    visibility: hidden;
  }
}
</style>
