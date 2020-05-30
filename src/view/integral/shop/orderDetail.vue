<template>
	<div>
		<div class="diaVipDetail">
            <div class="row_table">
                <div class="row_title">订单编号：{{orderData.orderId}}</div>
                <div class="row_line mt_10 mb_10">
                    <span>订单创建时间：{{orderData.startTime | nullFormat}}</span>
                    <span>订单状态：{{orderData.statusName | nullFormat}}</span>
                </div>
                <div class="row_line mb_10">
                    <span>订单结束时间：{{orderData.endTime | nullFormat}}</span>
                    <span>会员账号：{{orderData.pin | nullFormat}}</span>
                </div>
                <div class="row_line mb_10">
                    <span>货款金额：￥ {{orderData.sellerPrice | nullFormat | numFormat}}</span>
                    <span>订单金额：￥ {{orderData.totalPrice | nullFormat | numFormat}}</span>
                </div>
            </div>
            <div class="row_table mt_20">
                <div class="row_title">购买的商品</div>
                <div class="row_line mt_10 mb_10" v-for="(list, index) in orderData.skuList" :key="'skuList_'+index">
                    <a :href="`https://item.jd.com/${list.skuId}.html`" target="_blank">{{list.skuName}}</a>
                    <span>京东价：￥ {{list.jdPrice | nullFormat | numFormat}}</span>
                    <span>数量：{{list.itemTotal | nullFormat | numFormat}}</span>
                </div>
            </div>
		</div>
		<p class="m_t10 text-right">
			<el-button type="primary" size="small" @click="close">确 定</el-button>
		</p>
	</div>
</template>

<script>
	export default{
		data() {
			return{
				vipStatus: {
					1: '正式会员',
					2: '预会员',
					3: '流失会员'
				},
				statusObj: {
					'0': '未激活',
					'1': '已激活'
				}
			}
		},
		props: {
			orderData: Object
		},
		methods: {
			close() {
				this.$emit("closeDia", false)
			}
		}
	}
</script>

<style lang="less" scoped>
	.diaVipDetail{
        .row_table{
            border: 1px solid #ccc;
            border-radius: 2px;
            overflow: hidden;
        }
        .row_title{
            border-bottom: 1px solid #ccc;
            background: #f2f2f2;
            height: 35px;
            line-height: 35px;
            padding: 0 12px;
        }
		.row_line{
			height: 28px;
            line-height: 28px;
            padding: 0 12px;
            display: flex;
			a, span{
				display: inline-block;
				// width: 210px;
				overflow: hidden;
			    text-overflow:ellipsis;
			    white-space: nowrap;
                height: 28px;
                flex: 1;
            }
            a{
                color: #3089DE;
            }
		}
		.last_row{
			padding-bottom: 20px;
			border-bottom: 1px solid #ddd; 
		}
	}
	.text-right{
		button{
			width: 80px;
		}
    }
    .mt_20{
        margin-top: 30px;
    }
    .mb_10{
        margin-bottom: 10px;
    }
    .mt_10{
        margin-top: 10px;
    }
</style>