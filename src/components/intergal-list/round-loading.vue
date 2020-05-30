<template>
    <div class="round-loading">
        <div class="stock" v-if="stock > 0">
            <div class="finished"><span style="color: #333;">可兑换</span></div>
        </div>
        <div class="stock" v-else>
            <div class="finished"><span>已兑完</span></div>
        </div>
        <canvas ref="canvas" width="100" height="100"></canvas>
    </div>
</template>

<script>
export default {
    data() {
      return {
          
      }
    },
    props: {
        percentage: {
            type: [String, Number],
            default(){
                return 0
            }
        },
        stock: {
            type: [String, Number],
            default(){
                return 0
            }
        }
    },
    created(){
        this.$nextTick(() => {
            this.draw(this.percentage, 0.75 * Math.PI);
        });  
    },
    methods: {
        /**
         * [顺时针方向画图，起始点在左侧]
         * @param  {[number]} percent [所占的进度百分比，比如66%，则传66即可，0 <= percent <= 100]
         * @param  {[number]} sR      [圆弧起始角度，可不传，默认是π/2，Math.PI/2 <= sR < 3/2 * Math.PI]
         */
        draw(percent, sR, id) {
            if (percent < 0 || percent > 100) {
                return;
            }
            if (sR < Math.PI/2 || sR >= 3/2 * Math.PI) {
                return;
            }

            let canvas = this.$refs.canvas,
                cxt = canvas.getContext('2d'),
                cWidth = canvas.width,
                cHeight = canvas.height,
                baseColor = '#EFEFEF',
                coverColor = percent == 0 ? '#efefef' : '#FF893A',
                PI = Math.PI;
            sR = sR || 1/2 * PI; // 默认圆弧的起始点弧度为π/2

            let finalRadian = sR + ((PI + (PI - sR) * 2) * percent / 100); // 红圈的终点弧度
            let step = (PI + (PI - sR) * 2)/100; // 一个1%对应的弧度大小
            let text = 0; // 显示的数字
            let timer = setInterval(function() {
                cxt.clearRect(0, 0, cWidth, cHeight);
                let endRadian =  sR + text * step;
                // 画灰色圆弧
                drawCanvas(cWidth/2, cHeight/2, 45, sR, sR + (PI + (PI - sR) * 2), baseColor, 5);
                // 画红色圆弧
                drawCanvas(cWidth/2, cHeight/2, 45, sR, endRadian, coverColor, 5);
                text++;

                if (endRadian.toFixed(2) >= finalRadian.toFixed(2)) {
                    clearInterval(timer);
                }
            }, 30);

            function drawCanvas(x,y,r,sRadian,eRadian,color,lineWidth) {
                cxt.beginPath();
                cxt.lineCap = "round";
                cxt.strokeStyle = color;
                cxt.lineWidth = lineWidth;
                cxt.arc(x, y, r, sRadian, eRadian, false);
                cxt.stroke();
                cxt.save();
            }
        }
    }
}
</script>

<style lang="less" scoped>
    .round-loading{
        width: 50px;
        height: 50px;
        position: relative;
        margin: 0 auto;
        canvas{
            width: 100%;
            height: 100%;
            display: block;
        }
        .stock{
            // position: absolute;
            width: 100%;
            height: 100%;
            // top: 0;
            // left: 0;
            padding: 10px;
            box-sizing: border-box;
            text-align: center;
            z-index: 22;
            margin-bottom: -50px;
            .title{
                color: #333;
                font-size: 10px;
            }
            .text{
                // overflow: hidden;
                // text-overflow: ellipsis;
                white-space: nowrap;
                margin-top: 2px;
                font-size: 11px;
            }
            .finished{
                width: 31px;
                height: 31px;
                border-radius: 50%;
                background: #efefef;
                position: relative;
                padding-top: 7px;
                box-sizing: border-box;
                span {
                    width: 40px;
                    height: 15px;
                    line-height: 15px;
                    font-size: 10px;
                    color: #888;
                    background: #fff;
                    display: block;
                    transform: scale(0.8);
                    margin-left: -4px;
                }
            }
        }
    }
</style>

