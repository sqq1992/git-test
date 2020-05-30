<template>
  <div class="label-wrapper flex-align-center" :class="{'flex-align-start':isTop}">
    <slot name="left"></slot>
    <span :class="['label',{'label-right':type === 'right'}]" :style="styleObj">
            <slot name="label">
                {{label}}
            </slot>
        </span>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    props:{
      type:String,
      label:{
        type:String
      },
      miximStyle:{
        type:Object,
        default:function() {
          return {}
        }
      },
      size:{
        type:Number,
        default:4
      },
      isTop: {
        type:Boolean,
        default:false
      }
    },
    computed:{
      styleObj() {
        return Object.assign({},{
          minWidth:this.size+"em",
        },this.miximStyle)
      }
    }

  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  .label-wrapper{
    padding-top:10px;
    color: #666;
    letter-spacing: 0;
    line-height: 16px;
    font-size:14px;
  }
  .label{
    display: inline-block;
    padding-left:17px;
  }
  .label-right{
    text-align: right;
  }

  .flex-align-start{
    align-items: flex-start;
  }
</style>
