<template>
    <el-form>
      <ul class="flex" v-if="cusArr.length">
        <li v-for="(item,index) in cusArr" :key="'cusArr_'+index" class="member-group" :class="{current:currentIndex == index}" @click="changeCurrent(index)">
          <h3 class="member-group-name">
            {{item.crowdName}}
          </h3>
          <div class="member-group-desc-wrap">
            <el-tooltip effect="dark"  placement="top-start">
              <div class="member-group-desc__tooltip" slot="content">{{item.crowdDesc}}</div>
              <div class="member-group-desc">
                {{item.crowdDesc}}
              </div>
            </el-tooltip>
          </div>
          <div  class="member-count">
            <!-- {{1000..toLocaleString()}} -->
            {{item.customerCount | numFormat}}人
          </div>
        </li>
      </ul>
      <div class="noData" v-else>
        当前尚无星标人群，请选择其他智能人群
      </div>
    </el-form>
</template>

<script>
    import Vue from 'vue'
    import http from 'src/api'
    export default {
        name: '',
        components: {},
        props:{
          crowId:[String,Number],
          otherCrowd:[String,Object]
        },
        data() {
            return {
              loadingPage: false,
              cusArr: [],
              currentIndex:0,
              hasOther:false
            }
        },
        created() {
          this.starPeople();
        },
        watch:{
          crowId() {
            this.cusArr.map((item,index) => {
               if(item.id == this.crowId) {
                 this.currentIndex = index;
               }
            })
          },
          otherCrowd() {
            let index = 0;
            this.cusArr.forEach((item) => {
              if(item.id == this.otherCrowd.id){
                this.currentIndex = index;
                this.changeCurrent(index);
                return false;
              }
              index++;
            })
            if(index >= this.cusArr.length) {
              if(this.hasOther) {
                let arr = this.cusArr.slice(0);
                arr[arr.length - 1] = this.otherCrowd;
                this.cusArr = arr;
              } else {
                this.hasOther = true;
                this.cusArr.push(this.otherCrowd);
              }
              this.changeCurrent(this.cusArr.length - 1);
            }
          }
        },
        methods: {
          starPeople() {
            http({
              api_name: 'crmCrowdSign',
              data: {
                type: 0
              }
            }, (res) => {
              this.loadingPage = false;
              this.cusArr = res.data ? (res.data.signList ? res.data.signList : []) : [];
              if(this.cusArr.length && !this.crowId) {
                this.$emit('changeCrowId',this.cusArr[0].id,true);
              }
              if(this.crowId) {
                let len = 0;
                this.cusArr.forEach((item,index) => {
                  if(item.id == this.crowId){
                    this.currentIndex = index;
                    return false;
                  }
                  len++;
                })
                if(len >= this.cusArr.length) {
                  this.$emit('getOtherCrowd',this.crowId);
                }
              }
              this.cusArr.forEach(item => {
                this.queryGroupNumber(item);
              });
            }, (error) => {
              this.loadingPage = false;
            });
          },
          queryGroupNumber(item, cb){
            http({
              api_name: 'queryCrowdCount',
              data: {
                dealSet: item.dealSet
              },
              vm: this,
            }, result => {
              this.$set(item, 'customerCount', result.data.count);
              /* 如果当前查询的是 星标人群，则将  人群列表中的 星标人群进行更改 */
              // if(item.signFlag){
              /* 低效率大循环体，因为异步的原因 暂时没有想到该如何进行同步 双向数据 */
              this.cusArr.forEach((ele, index) => {
                this.tableData.some((data, i) => {
                  if(ele.id == data.id){
                    this.$set(data, 'customerCount', ele.customerCount);
                    return true;
                  }
                });
              });
              // }
              cb && cb(result.data.count);
            });
          },
          changeCurrent(index) {
            this.currentIndex = index;
            let crowId = this.cusArr[this.currentIndex].id;
            this.$emit('changeCrowId',crowId);
          }
        }
    }
</script>

<style scoped lang="less" rel="stylesheet/less">
  .noData{
    color:#999;
  }
  .member-group {
    width: 182px;
    height: 152px;
    margin-right: 20px;
    margin-bottom: 20px;
    border: 1px solid rgba(211, 214, 216, 0.36);
    box-sizing: border-box;
    padding: 10px;
    position: relative;
    box-shadow: 0px 3px 12px 0px rgba(211, 214, 216, 0.36);
    border-radius: 4px;
    cursor: pointer;
    &.current{
      border-color:#20a0ff;
    }
  }


  .member-group-name {
    padding: 0;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap
  }
  .member-group-desc {
    float: right;
    margin-left: -5px;
    width: 100%;
    word-break: break-all;


  }

  .member-group-desc__tooltip {
    width:200px;
    line-height:1.5
  }


  .member-group-desc-wrap {
    height: 54px;
    font-size: 12px;
    color: #666;
    line-height: 1.5;
    text-indent: 24px;
    overflow: hidden;
    &::before {
      float: left;
      width: 5px;
      content: '';
      height: 54px;
    }

    &::after {
      float: right;
      content: "...";
      height: 20px;
      line-height: 20px;
      /* 为三个省略号的宽度 */
      width: 3em;
      /* 使盒子不占位置 */
      margin-left: -3em;
      /* 移动省略号位置 */
      position: relative;
      left: 100%;
      top: -20px;
      padding-right: 5px;
      background: linear-gradient(to right, transparent, #fff 55%);
    }
  }
</style>
