<template>
	<div class="m-content diaWidth create-member-box" v-loading="fullscreenLoading">
		<div class="m-content-main main_height" v-loading="loadingPage">
			<div class="row_line m_b10">
				<span>活动名称：</span>
				<span>{{this.$route.query.name}}</span>
			</div>
			<div class="row_line m_b10 activeNamediv">
				<span>活动时间：</span>
			    <span>{{this.$route.query.start}}</span>
			    <span class="">-</span>
			    <span>{{this.$route.query.end}}</span>
			</div>
            <div class="table m_b10 ml70">
                <table width="300" border="0" cellspacing="1" cellpadding="0">
                    <tr>
                        <th>礼物类型</th>
                        <th>礼品面额</th>
                        <th>发放人数</th>
                        <th>有效期天数</th>
                    </tr>
                    <tr v-for="(item, index) in list" :key="index">
                        <td>{{revertType(item.prizeType)}}</td>
                        <td>{{item.discount}}</td>
                        <td>{{item.sendCount}}</td>
                        <td>{{item.validateDay}}</td>
                    </tr>
                </table>
            </div>
		</div>
	</div>
</template>

<script>
import dateFormat from './../../common/dateFormat.js';
import ajax from './../../api/index.js';
	export default{
		data() {
			return{
                list: [] // 添加的礼物列表
			}
		},
		created() { 
            this.init()
        },
		methods: {
            revertType(type) {
               return type == 0 ? '京券' : type == 1 ? '东券' : 
               type == 4 ? '京豆' : type == 6 ? '积分' : 
               type == 8 ?'流量卡包' : type == 14 ? '红包' : ''
            },
            init() {
                let data = {}
                let activityId = this.$route.query.id
                data.activityId = activityId
                ajax({
                    api_name: 'queryCardDetail',
                    vm: this,
                    data: data
                }, (res) => {
                    if (res.result == '100') {
                        this.list = JSON.parse(res.data.ruleSetting)
                    }
                    this.loadingPage = false;
                }, (error) => {
                    this.loadingPage = false;
                })
            }
		}
	}
</script>

<style lang="less">
.m-content-main{
    padding: 23px;
    font-size: 14px;
    color: #333;
    .m_b10{
        margin-bottom: 15px;
    }
    .grayDiv{
        background: #fafafa;
        padding: 20px;
        max-width: 600px;
    }
    .ml70{
        margin-left: 70px;
    }
    .table{
        table{
            border-right:1px solid #EBEEF5;
            border-bottom:1px solid #EBEEF5;
        }
        table tr{
            height: 40px;
        }
        th,td{
            border-left:1px solid #EBEEF5;
            border-top:1px solid #EBEEF5;
            text-align: center;
        }
    }
}
</style>
