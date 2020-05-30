<template>
    <div>
        <div class="mask">
            <div class="copynum">
                <div class="upgradetop">
                	<!-- <img src="../assets/images/upgradelogo.png" height="126" width="108"> -->
                	<span v-if="type == '手机海报'" class="remind">亲爱的，试用版“<span class="project">手机关联</span>”功能暂不开放，<br/>请升级高级版再使用！</span>
                </div>
                <div class="upgradebottom">
                	<!-- <a class="upgradebut" href="http://fw.jd.com/231222.html?source=sjglsj" target="_blank"><img class="leaveimg" @click="pointthis('9375.9408.11359.11361')" src="../assets/images/leave.png" height="48" width="450"></a> -->
                </div>
                <div class="disappear" @click="open"></div>
            </div>
        </div>
    </div>
</template>

<script>
import {point} from 'src/common/point.js';
	export default {
		data() {
			return {
				isShow: true,
			}
		},
		props: {
			type: String
		},
		created() {
			console.log(this.type);
			let body = document.getElementsByTagName("body")[0];
			body.style.overflow = "hidden";
		},
		watch: {
			isShow(newVal,oldVal) {
				if(newVal == false) {
					let body = document.getElementsByTagName("body")[0];
					body.style.overflow = "auto";
				}
			}
		},
		destroyed () {
	        let body = document.getElementsByTagName("body")[0];
			body.style.overflow = "auto";
	    },
		methods:{
			open() {
				this.isShow = false;
				this.$emit('message',false);
			},
			pointthis(thispoint) {
				point({point: thispoint});
			}
		}
	}
</script>

<style lang="less" scoped>
.mask {
	user-select: none;
    z-index: 99998;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(0,0,0,0.5);
    .copynum{
    	height: 460px;
    	width: 518px;
    	position:absolute;
		top:0;
		right:0;
		bottom:0;
		left:0;
		margin:auto;
		.project{
			color: yellow;
			font-weight: 700;
		}
		.upgradetop{
			height: 85px;
			// background: url(../assets/images/upgradetop.png) no-repeat;
			color: white;
			font-size: 17px;
			img{
				position: absolute;
				top: -25px;
				left: 10px;
			}
			.remind{
				position: absolute;
				left: 125px;
				top: 20px;
				display: block;
				width: 395px;
			}
		}
		.upgradebottom{
			height: 375px;
			// background: url(../assets/images/upgradebottom.png) no-repeat;
			.upgradebut{
				// background: rgb(230,84,73);
				background: white;
				text-align: center;
				line-height: 50px;
				font-size: 20px;
				display: block;
				width: 450px;
				height: 50px;
				position: absolute;
				bottom: 27px;
				left: 34px;
				.leaveimg{
					cursor: pointer;
					position: absolute;
					left: 0;
					top: 0;
				}
				.leaveimg:hover{
					// box-shadow: 5px 5px 5px #aaaaaa;
					-webkit-box-shadow:0 0 15px 3px #bbb;
					-moz-box-shadow:0 0 15px 3px #bbb;
					box-shadow:0 0 15px 3px #bbb;
					transform: translate3d(0,1px,-2px);
					-ms-transform: translate3d(0,1px,-2px);	/* IE 9 */
					-moz-transform: translate3d(0,1px,-2px);	/* Firefox */
					-webkit-transform: translate3d(0,1px,-2px); /* Safari 和 Chrome */
					-o-transform: translate3d(0,1px,-2px);
				}
			}
		}
		.disappear{
			// background: url(../assets/images/disappear.png) no-repeat;
			width: 24px;
			height: 24px;
			border-radius: 50%;
			position: absolute;
			right: -28px;
			top: 0px;
			cursor: pointer;
		}
    }
}
</style>
