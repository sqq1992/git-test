<template>
  <div class="game-box">
    <el-steps space="40%" :active="step" :align-center="true" :center="true">
      <el-step title="选择游戏"></el-step>
      <el-step title="设置活动规则"></el-step>
      <el-step title="设置完成"></el-step>
    </el-steps>
    <div class="content-box">
      <div class="step1-box" v-if="step == 1">
        <!-- 抢红包 -->
        <div class="game-card">
          <img :src="qhb" alt="">
          <div class="layer">
            <span class="title">请使用京东App扫码试玩</span>
            <img :src="qhbUrl"/>
            <span class="choose" @click="choose(1)">选择游戏</span>
          </div>
        </div>
        <!-- 打地鼠 -->
        <div class="game-card">
          <img :src="dds" alt="">
           <div class="layer">
            <span class="title">请使用京东App扫码试玩</span>
            <img :src="ddsUrl"/>
            <span class="choose" @click="choose(2)">选择游戏</span>
           </div>
        </div>
      </div>
      <div class="step2-box" v-if="step == 2">
        <GameConfig :activityId="activityId" :type="type" @back="backStep"/>
      </div>
    </div>
  </div>
</template>
<script>
import GameConfig from './h5GameConfig';
import ajax from 'src/api/index.js';
import dds from 'src/assets/images/dadishu.png';
import qhb from 'src/assets/images/qianghongbao.png';
import QRCode from 'qrcode';
export default {
  components:{
    GameConfig,
  },
  data() {
    return {
      step:1,
      type:'',
      activityId:'',
      dds,
      qhb,
      qhbUrl:'',
      ddsUrl:''
    }
  },
  created() {
    this.activityId = this.$route.query.id;
    if(this.activityId) {
      this.step = 2;
    }
    [
      'https://wdkj-isv.isvjcloud.com/?href=standAloneGame/openRedEnvelope&shopId' + this.$store.state.user.shopId + '&sellerId=' + this.$store.state.user.venderId,
      'https://wdkj-isv.isvjcloud.com/?href=standAloneGame/whackDiglett&shopId' + this.$store.state.user.shopId + '&sellerId=' + this.$store.state.user.venderId
    ].forEach((url,index) => {
      QRCode.toDataURL(url, {errorCorrectionLevel: 'H'}, (err, url) => {
        if(index == 0) {
          this.qhbUrl = url;
        } else {
          this.ddsUrl = url;
        }
      });
    })
  },
  methods:{
    choose(type) {
      this.step = 2;
      this.type = type;
    },
    backStep() {
      this.step = 1;
    }
  }
}
</script>
<style lang="less">
  // .el-step__title {
  //   margin-left:-15px;
  // }
  .game-box {
    padding: 20px 0 50px 20px;
    .ml_5 {
		  margin-left: 5px;
    }
    .ml_20 {
      margin-left:20px;
    }
	  .mr_5 {
          margin-right: 5px;
	  }
	  .mt_10 {
		  margin-top: 10px;
	  }
	  .mb_10 {
		  margin-bottom: 10px;
    }
    .fc-999 {
      color:#999;
    }
    .el-input{
      height: 30px;
      line-height: 28px;
      &.w200 {
        width: 200px;
      }
      &.w150 {
        width: 150px;
      }
      &.w100 {
        width:100px;
      }
      &.w75 {
        width: 75px;
      }
      &.w50 {
        width: 50px;
      }
      .el-input__inner{
        width: 100%;
        height: 100%;
      }
    }
    .content-box {
      margin-top:15px;
      .step1-box {
        padding:0 70px;
      }
      .game-card {
        width:230px;
        height:300px;
        display:inline-block;
        margin-right:50px;
        cursor: pointer;
        position: relative;
        img {
          width:100%;
        }
        .layer {
          position: absolute;
          top:0;
          left:0;
          width:100%;
          height:100%;
          text-align: center;
          padding-top:20px;
          box-sizing: border-box;
          // display: flex;
          // align-items: center;
          // justify-content: center;
          .title {
            color:#fff;
            display: none;
          }
          img {
            width:150px;
            display: none;
            margin:0 auto;
            margin-top:20px;
            margin-bottom:30px;
          }
          .choose {
            display: none;
            // display:block;
            padding:10px 20px;
            background:#20a0ff;
            border-radius: 5px;
            color:#fff;
          }
          &:hover {
            background:rgba(0,0,0,.5);
            .choose {
              display: inline;
            }
            img {
              display:block;
            }
            .title {
              display:inline;
            }
          }
        }
      }
    }
  }
</style>
