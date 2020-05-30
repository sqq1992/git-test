<template>
  <div class="purchase_priview">
    <div class="img_box" :style="{backgroundImage:'url('+ data.image +')'}">
      <div class="act_name">
        {{data.activityType == 3 ? '关注有礼' : data.activityType == 2 ? '加购有礼' : '加购关注有礼'}}
      </div>
      <div class="act_time"  v-if="!customImg">
        <svg>
          <text font-family="microsoft yahei" font-size="7.6" x="11" y="12" fill="red">
            活动时间：{{data.startTime.slice(0,10)}} 至 {{data.endTime.slice(0,10)}}
          </text>
        </svg>
      </div>
    </div>
    <div class="prize">
      <div class="point" v-if="data.pointsMsg.isCheck">
        <img :src="point_img" alt="">
        <div class="prize-value">
          <svg>
            <text font-family="microsoft yahei" font-size="10" x="0" y="18" fill="white">
              {{data.pointsMsg.val || '-'}}
            </text>
            <text font-family="microsoft yahei" font-size="10" x="0" y="30" fill="white">
              积分
            </text>
          </svg>
        </div>
        <div class="prize-state">
            <span class="receive-btn cant">领取</span>
        </div>
      </div>
      <div class="coupon" v-if="data.couponMsg.isCheck">
        <img :src="coupon_img" alt="">
          <div class="prize-value">
            <svg>
              <text font-family="microsoft yahei" font-size="10" x="0" y="18" fill="white">
                {{data.couponMsg.price}}{{data.couponMsg.couponCheckType == 1 ? '元' : '折'}}
              </text>
              <text font-family="microsoft yahei" font-size="10" x="0" y="30" fill="white">
                优惠券
              </text>
            </svg>
          </div>
          <div class="prize-state">
              <span class="receive-btn cant">领取</span>
          </div>
      </div>
    </div>
    <ul class="clearfix good_list" v-if="skus.length > 0">
      <li v-for="item in skus" :key="item.skuId">
        <dl class="good_detail">
          <dt>
            <img style="width:50px;" :src="item.logo"/>
          </dt>
          <dd>
            <p class="good_name" :title="item.title">
              {{item.title}}
              <!-- {{item.title.length > 23 ? item.title.slice(0,23) + '...' : item.title}} -->
            </p>
            <p>
              <span class="price">￥{{item.price}}</span>
              <span class="btn">加入购物车</span>
            </p>
          </dd>
        </dl>
      </li>
    </ul>
    <div v-else class="noData">请选择商品...</div>
    <div class="bottom_cont clearfix">访问店铺</div>
  </div>
</template>
<script>
import coupon_img from 'src/assets/svg/coupon.svg';
import point_img from 'src/assets/svg/point.svg';
export default {
  props:{
    data:{
      type:Object,
      default:{}
    },
    skus: {
      type:Array,
      default:[]
    }
  },
  data() {
    return {
      coupon_img,
      point_img
    }
  }
}
</script>
<style lang="less" scoped>
  @red:#e50e10;
  .purchase_priview {
    border:1px solid #aaa;
    background:#ddd;
    float:right;
    margin-right:50px;
    width:240px;
    margin-right:50px;
    border:1px solid #ddd;
    .prize {
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fff;
        padding:10px;
        margin-bottom:5px;
        .coupon,.point {
            height:50px;
            // line-height:120px;
            width:45%;
            padding:5px;
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            align-items: center;
            color:#fff;
            font-size:12px;
            img {
                margin-right:5px;
                // float:left;
                width:25%;
                flex:1;
            }
            .prize-value {
                // width:35%;
                flex:2;
                // float:left;
                line-height: 10px;
                height: 100%;
                // padding-top: 10px;
                font-size:12px;
                .num {
                    margin-right:5px;
                }
                svg {
                  width:100%;
                  height:100%;
                }
            }
            .prize-state {
                // float:left;
                // width:10%;
                flex:2;
                text-align: center;
                .receive-btn {
                    display: inline-block;
                    width:30px;
                    height:20px;
                    line-height: 20px;
                    text-align: center;
                    font-size:16px;
                    background:#fff;
                    border-radius: 25px;
                    color:@red;
                    font-size: 12px;
                    &.cant {
                        color:#eee;
                        background:rgba(99,99,99,.3)
                    }
                }
            }
        }
        .coupon {
            background:linear-gradient(to right, #fff6e6, #ff8d54);
            // margin-right:10px;
        }
        .point {
            background:linear-gradient(to right, #64e9ff, #4279f9);
            margin-right:10px;
        }
    }
    .img_box {
      height:100px;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      position:relative;
      .act_name {
        color:#fff;
        font-size:26px;
        font-weight: bold;
        text-align: center;
        height:60px;
        line-height: 60px;
      }
      .act_time {
        position: absolute;
        width: 160px;
        height: 20px;
        left: 40px;
        top: 67px;
        color: @red;
        transform: rotate(-2.5deg);
        svg {
          width:100%;
          height: 100%;
        }
      }
    }
    .bottom_cont {
      width:100%;
      text-align: center;
      height:35px;
      line-height: 35px;
      color:#fff;
      background:@red;
    }
    .good_list {
      margin-top:10px;
      .good_detail {
        display: flex;
        align-items: center;
        justify-content: center;
        padding:5px 0;
        margin-bottom:10px;
        background: #fff;
        dt {
          width:30%;
          text-align: center;
        }
        dd {
          width:70%;
          padding:0 5px;
          font-size:12px;
          .good_name {
              // width: 100px;
              height: 24px;
              line-height: 12px;
              display: -webkit-box;
              width:100%;
              overflow: hidden;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              word-break: break-all;
              margin-bottom:5px;
          }
          .price {
            font-size:14px;
            color:@red;
            float:left;
          }
          .btn {
            float:right;
            padding:5px 10px;
            border-radius:15px;
            background:@red;
            color:#fff;
          }
        }
      }
    }
    .noData {
      height:100px;
      line-height:100px;
      text-align: center;
      color:#fff;
    }
  }
</style>
