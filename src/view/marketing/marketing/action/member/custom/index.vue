<template>
  <el-form label-position="right" label-width="8em">
    <section>
      <h4>会员信息</h4>
      <div class="flex">
        <div class="m_r10">会员等级：</div>
        <el-checkbox :disabled="memberTypeCheckList.length === levelList.length" class="mr_15" v-model="allCheckout">不限</el-checkbox>
        <el-checkbox-group  v-model="memberTypeCheckList">
          <el-checkbox v-for="({memberLevel,name, nameSource}) in levelList" :label="memberLevel">{{name || nameSource}}</el-checkbox>
        </el-checkbox-group>
      </div>
    </section>
    <section>
      <h4>交易信息</h4>
      <infoItem v-for="(item,index) in checkDataList" :itemData="item" :label="item.name" @saveData="saveData" @delData="delData"/>
    </section>
  </el-form>
</template>

<script>
  import InfoItem from './infoItem.vue'
  import http from 'src/api';
  import { clone } from 'src/common/public.js';
  export default {
    name: '',
    components: {
      InfoItem
    },
    data() {
      return {
        allCheckout: true,
        memberTypeCheckList: '',
        checkALlList:'',
        levelList: [],
        checkDataList:[
          {
            name:'首次成交时间',
            type:'firstOrderCheck',
            min:'rightFirstOrderDate',
            max:'leftFirstOrderDate',
          },
          {
            name:'最近成交时间',
            type:'timeCheck',
            min:'maxLastTradeTime',
            max:'minLastTradeTime'
          },
          {
            name:'成功交易次数',
            type:'countCheck',
            min:'maxTradeCount',
            max:'minTradeCount'
          },
          {
            name:'成功交易金额',
            type:'amountCheck',
            min:'maxTradeAmount',
            max:'minTradeAmount'
          },
          {
            name:'平均客单价',
            type:'priceCheck',
            min:'maxAvgPrice',
            max:'minAvgPrice'
          },
          {
            name:'购买商品件数',
            type:'itemNumCheck',
            min:'rightItemNum',
            max:'leftItemNum'
          },
          {
            name:'关闭交易次数',
            type:'closeTradeCountCheck',
            min:'rightCloseTradeCount',
            max:'leftCloseTradeCount'
          },
          {
            name:'关闭交易金额',
            type:'closeTradeAmountCheck',
            min:'rightCloseTradeAmount',
            max:'leftCloseTradeAmount'
          },
        ]
      }
    },

    watch: {
      memberTypeCheckList(list,oldList) {
        this.allCheckout = list.length === this.levelList.length
        if(!list.length) {
          this.memberTypeCheckList = oldList
          this.$message.warning('请至少选择一种会员等级')
        }
        this.$emit('changeRule',{grade:JSON.stringify(this.memberTypeCheckList)});
      },
      allCheckout(val) {
        val && (this.memberTypeCheckList = this.checkALlList);
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      initPage(crowRules) {
        crowRules = JSON.parse(crowRules);
        let checkDataList = clone(this.checkDataList)
        checkDataList.map(item => {
          let {min, max} = item;
          crowRules[max] && (item.minVal = crowRules[max]);
          crowRules[min] && (item.maxVal = crowRules[min]);
        })
        this.checkDataList = checkDataList;
      },
      getList() {
        if(this.levelList && this.levelList.length) {
          return
        }
        http({
          api_name: 'memberLevelList',
          vm: this,
          data: {}
        }, ({data:{levelList}}) => {
          this.levelList = levelList;
          let list = levelList.map(item => item.memberLevel);
          this.memberTypeCheckList = list.slice(0);
          this.checkALlList = list.slice(0);
        }, (error) => {
        })
      },
      saveData(val,type,mode) {
        this.checkDataList.forEach(item => {
          if(item.type == type) {
            let minName = item.min,
                maxName = item.max,
                data;
            mode == 2 ? (data = {[minName] : val}) : mode == 3 ? (data = {[maxName] : val}) : (data = {
              [maxName]:val[0],
              [minName]:val[1]
            })
            switch(type) {
              case 'countCheck':
                data.fType = mode == 2 ? 0 : mode == 3 ? 2 : 3;
              break;
              case 'amountCheck':
                data.xType = mode == 2 ? 0 : mode == 3 ? 2 : 3;
              break;
              case 'priceCheck':
                data.yType = mode == 2 ? 0 : mode == 3 ? 2 : 3;
              break;
            }
            this.$emit('changeRule',data);
            return;
          }
        });
      },
      delData(type) {
        this.checkDataList.forEach(item => {
          if(item.type == type) {
            let minName = item.min,
                maxName = item.max;
            this.$emit('delRule',minName,maxName);
            // mode == 2 ? (this.$emit('delRule',maxName)) : mode == 3 ? (this.$emit('delRule',minName)) : mode == 4 ? (this.$emit('delRule',minName,maxName)) : '';
            return;
          }
        })
        switch(type) {
          case 'countCheck':
            this.$emit('delRule','fType');
          break;
          case 'amountCheck':
            this.$emit('delRule','xType');
          break;
          case 'priceCheck':
            this.$emit('delRule','yType');
          break;
        }
      }

    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">

</style>
