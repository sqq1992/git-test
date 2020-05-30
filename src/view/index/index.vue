<template>
	<div class="index_main">
        <el-row>
        <el-col :span="18">
                <div class="left-box">
                   <div class="index_item">
                      <div class="pd_6">
                          <div class="item_label">
                            <h2>会员数据</h2>
                            <span class="time">数据更新时间：2018-09-21 22:03:29</span>
                          </div>
                          <div class="item_data">
                                <el-row>
                                <el-col :span="6" v-for="item in memberData">
                                    <b>{{item.num | numFormat}}</b>
                                    <p>
                                        <span class="label">{{item.name}}</span>
                                        <el-tooltip class="item" effect="dark" :content="item.tip" placement="top-end">
                                        <img class="tip" width="12" src="../../assets/images/tip.png" alt="">
                                        </el-tooltip>
                                    </p>
                                </el-col>
                                </el-row>
                          </div>
                      </div>
                   </div>
                   <div class="index_item">
                       <el-row>
                       <el-col :span="12">
                           <div class="visit-data">
                                <div class="item_label">
                                    <h2>会员中心访问数据</h2>
                                    <span class="visit-status">未发布</span>
                                    <a href="">发布至店铺首页</a>
                                </div>
                                <div class="item_data">
                                    <el-row>
                                    <el-col :span="12">
                                            <b>{{123000 | numFormat}}</b>
                                            <p>
                                                <span class="label">累计访问人次</span>
                                            </p>
                                    </el-col>
                                    <el-col :span="12">
                                            <b>{{111000 | numFormat}}</b>
                                            <p>
                                                <span class="label">累计访问人数</span>
                                            </p>
                                    </el-col>
                                    </el-row>
                                </div>
                           </div>
                       </el-col>
                       <el-col :span="12">
                           <div class="matter-data">
                                <div class="item_label">
                                    <h2>待发放实物奖品</h2>
                                </div>
                                <div class="item_data">
                                    <el-row>
                                    <el-col :span="12">
                                            <b>{{394 | numFormat}}</b>
                                            <p>
                                                <span class="label">大转盘实物奖品</span>
                                            </p>
                                    </el-col>
                                    <el-col :span="12">
                                            <b>{{134 | numFormat}}</b>
                                            <p>
                                                <span class="label">积分商城实物礼品</span>
                                            </p>
                                    </el-col>
                                    </el-row>
                                </div>
                           </div>
                       </el-col>
                       </el-row>
                   </div>
                   <div class="index_item">
                        <div class="pd_6">
                            <div class="item_label">
                                <h2>积分互动数据</h2>
                            </div>
                            <div class="item_data">
                                <el-row>
                                <el-col :span="6" v-for="item in integralData">
                                        <b>{{item.num | numFormat}}</b>
                                        <p>
                                            <span class="label">{{item.name}}</span>
                                        </p>
                                </el-col>
                                </el-row>
                            </div>
                        </div>
                   </div>
                   <div class="data-echarts">
                        <div class="pd_6">
                            <div class="item_label">
                                <h2>上周转化数据</h2>
                                <span class="time">数据统计周期：2018-09-21 22</span>
                                <span class="time ml_10">数据更新时间：2018-04-10 12:00:00</span>
                            </div>
                            <div class="echarts-tab">
                                <el-row>
                                <el-col :span="12">
                                    <div class="echarts-box">
                                        <p class="title">新老客户访问比例</p>
                                        <div id="charts" class="charts"></div>
                                    </div>
                                </el-col>
                                <el-col :span="12">
                                    <div class="data-tabel">
                                        <p class="title">会员访问会员中心后订单转化数据</p>
                                        <el-table
                                            class="fontClass"
                                            :data="tableData"
                                            :border="false"
                                            style="width: 100%">
                                            <el-table-column label="下单人数" align="left" min-width="120">
                                                <template scope="scope">
                                                    <el-row>
                                                        <el-col>
                                                            {{123124 | numFormat}}
                                                        </el-col>
                                                    </el-row>
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="创建订单数" align="left" min-width="120">
                                                <template scope="scope">
                                                    <el-row>
                                                        <el-col>
                                                            {{scope.row.num1}}
                                                        </el-col>
                                                    </el-row>
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="订单金额" align="left" min-width="120">
                                                <template scope="scope">
                                                    <el-row>
                                                        <el-col>
                                                            {{scope.row.num1}}
                                                        </el-col>
                                                    </el-row>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                        <el-table
                                            class="fontClass"
                                            :data="tableData"
                                            :border="false"
                                            style="width: 100%">
                                            <el-table-column label="付款人数" align="left" min-width="120">
                                                <template scope="scope">
                                                    <el-row>
                                                        <el-col>
                                                            {{123124 | numFormat}}
                                                        </el-col>
                                                    </el-row>
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="付款订单数" align="left" min-width="120">
                                                <template scope="scope">
                                                    <el-row>
                                                        <el-col>
                                                            {{scope.row.num1}}
                                                        </el-col>
                                                    </el-row>
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="订单金额" align="left" min-width="120">
                                                <template scope="scope">
                                                    <el-row>
                                                        <el-col>
                                                            {{scope.row.num1}}
                                                        </el-col>
                                                    </el-row>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                    </div>
                                </el-col>
                                </el-row>
                            </div>
                            <div class="conversion">
                                <p class="title">会员访问会员中心页面后订单转化率</p>
                                <div class="conversion-data">
                                    <el-row>
                                        <el-col :span="6">
                                           <div class="conversion-num">
                                               <p>{{123124 | numFormat}}</p>
                                               <p>访问人数</p>
                                           </div>
                                        </el-col>
                                        <el-col :span="3">
                                            <div class="conversion-line">
                                            <p>70.00%</p>
                                            <span></span>
                                            <p>下单转化率</p>
                                            </div>
                                        </el-col>
                                        <el-col :span="6">
                                           <div class="conversion-num num2">
                                               <p>{{123124 | numFormat}}</p>
                                               <p>访问人数</p>
                                           </div>
                                        </el-col>
                                        <el-col :span="3">
                                            <div class="conversion-line">
                                            <p>70.00%</p>
                                            <span></span>
                                            <p>下单转化率</p>
                                            </div>
                                        </el-col>
                                        <el-col :span="6">
                                           <div class="conversion-num num3">
                                               <p>{{123124 | numFormat}}</p>
                                               <p>访问人数</p>
                                           </div>
                                        </el-col>
                                    </el-row>
                                    <el-row class="percent_conversion">
                                        <el-col :span="6">
                                           <span class="half fr lt"></span>
                                        </el-col>
                                        <el-col :span="12" class="percent_data">
                                           <p class="num">78.13%</p>
                                           <span></span>
                                           <p class="txt">转化率</p>
                                        </el-col>
                                        <el-col :span="6">
                                           <span class="half rt"></span>
                                        </el-col>
                                    </el-row>
                                </div>
                            </div>
                        </div>
                   </div>
                </div>
            </el-col>
        <el-col :span="6">
                <div class="adv-banner">
                    <div class="block">
                        <el-carousel trigger="click" height="150px">
                        <el-carousel-item v-for="item in 4" :key="item">
                            <div>
                                <img src="http://crm9.superboss.cc/resources/img/right_baner2.png" alt="">
                            </div>
                        </el-carousel-item>
                        </el-carousel>
                    </div>
                </div>
                <div class="notice pd_6">
                    <div class="item_label">
                        <h2>活动公告</h2>
                        <a class="fl" href="">下载帮助说明</a>
                    </div>
                    <ul>
                        <li><router-link :to="{name: 'interactionCenter'}">【产品更新】只能营销上线！会员营销不再愁</router-link></li>
                        <li><router-link :to="{name: 'interactionCenter'}">【产品更新】只能营销上线！会员营销不再愁</router-link></li>
                        <li><router-link :to="{name: 'interactionCenter'}">【产品更新】只能营销上线！会员营销不再愁</router-link></li>
                    </ul>
                </div>
                <div class="function pd_6">
                    <div class="item_label">
                        <h2>常用功能</h2>
                    </div>
                    <ul>
                        <li>
                            <router-link :to="{name: 'interactionCenter'}">
                                <i class="hdzx"></i><span>互动中心</span>
                                <p>管理会员互动，通过互动提升店铺访问量</p>
                            </router-link>
                        </li>
                        <li>
                            <router-link :to="{name: 'integralCenter'}">
                            <i class="lpzx"></i><span>礼品中心</span>
                            <p>管理店铺积分商城，提升会员忠诚度</p>
                            </router-link>
                        </li>
                        <li>
                            <router-link :to="{name: 'welfare'}">
                            <i class="ptkj"></i><span>拼团砍价</span>
                            <p>店铺会员老拉新，提升店铺购买转化</p>
                            </router-link>
                        </li>
                        <li>
                            <router-link :to="{name: 'userCardSetting'}">
                            <i class="ymgl"></i><span>页面管理</span>
                            <p>装修会员中心页面，打造店铺个性化页面</p>
                            </router-link>
                        </li>
                        <li>
                            <router-link :to="{name: 'integral', query: {name: '3'}}">
                            <i class="gwjl"></i><span>购物奖励积分</span>
                            <p>在购物送积分的基础上额外发放奖励积分</p>
                            </router-link>
                        </li>
                    </ul>
                </div>
        </el-col>
        </el-row>
    </div>
</template>

<script>
import echarts from 'echarts';
	export default{
		data() {
			return{
                //会员数据
                memberData: [
                   {
                       name: '会员总数',
                       num: 123000,
                       tip: '1111111'
                   },
                   {
                       name: '成交会员数',
                       num: 123000,
                       tip: '1111111'
                   },
                   {
                       name: '未成交会员数&粉丝数',
                       num: 121000,
                       tip: '1111111'
                   },
                   {
                       name: '访问过会员中心会员数',
                       num: 1234,
                       tip: '1111111'
                   }
                ],
                //积分互动数据
                integralData: [
                   {
                       name: '当前“进行中”活动数量',
                       num: 12
                   },
                   {
                       name: '近七天活动参与人次',
                       num: 1234
                   },
                   {
                       name: '当前“已上架”礼品数量',
                       num: 12
                   },
                   {
                       name: '近七天礼品兑换数量',
                       num: 1345
                   }
                ],
                tableData: [
                    {
                        num1: 878,
                        num2: 878,
                        num3: 878,
                    }
                ]
			}
		},
		created() {
			
		},
		computed: {
		},
		mounted() {
            this.initCharts();
		},
		watch: {
		},
		components: {
			
		},
		methods: {
            initCharts(data) {
				const myChart = echarts.init(document.getElementById('charts'));
				let option = {
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    series : [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius : '55%',
                            center: ['50%', '60%'],
                            data:[
                                {value:335, name:'直接访问'},
                                {value:310, name:'邮件营销'},
                                {value:234, name:'联盟广告'},
                                {value:135, name:'视频广告'},
                                {value:1548, name:'搜索引擎'}
                            ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                };

                myChart.setOption(option);
                window.onresize = myChart.resize;
			},
		}
	}
</script>
<style lang="less" scoped>
@color: #edf2f8;
.index_main {
    background: @color !important;
    .pd_6 {
        padding: 6px;
    }
    .fl {
        float: right;
    }
    .fr {
        float: right;
    }
    .ml_10 {
        margin-left: 10px;
    }
    .left-box {
        border-right: 10px solid @color;
        .index_item {
            min-height: 140px;
            border-bottom: 10px solid @color;
            background: #fff;
            .visit-data {
                height: 128px;
                padding: 6px;
                border-right: 6px solid @color;
            }
            .matter-data {
                height: 128px;
                padding: 6px;
                border-left: 6px solid @color;
            }
        }
        .item_data {
            text-align: center;
            margin-top: 20px;
            b {
                font-size: 36px;
                color: #2987DF;
            }
            .label {
                font-size: 14px;
                color: #333;
            }
            .tip {
                margin-top: 2px;
            }
        }
        .data-echarts {
            background: #fff;
            min-height: 400px;
            .echarts-tab {
                height: 350px;
            }
            .echarts-box {
                position: relative;
                margin-top: 34px;
                .title {
                    text-align: center;
                    padding-right: 40px;
                    color: #333;
                }
                .charts {
                    width: 100%;
                    position: absolute;
                    height: 400px;
                    top: -80px;
                    left: -20px;
                }
            }
            .data-tabel {
                padding-right: 10px;
                margin-top: 30px;
                .title {
                    color: #333;
                    text-align: center;
                    margin-bottom: 20px;
                }
            }
        }
    }
    .item_label {
        h2 {
            font-size: 14px;
            font-weight: normal;
            margin-right: 10px;
            display: inline-block;
            &::before {
                width: 2px;
                height: 14px;
                content: '';
                background: #3089DC;
                display: inline-block;
                margin-right: 4px;
                vertical-align: middle;
                margin-top: -2px;
            }
        }
        span {
            &.time {
                font-size: 12px;
                color: #999999;
            }
            &.visit-status {
                padding: 2px 10px;
                background: #ccc;
                color: #fff;
                font-size: 12px;
                border-radius: 8px;
            }
        }
        a {
            font-size: 12px;
            color: #3089DE;
            margin-left: 10px;
        }
    }
    .notice {
        border-top: 10px solid @color;
        background: #fff;
        ul {
            li {
                font-size: 12px;
                line-height: 32px;
                padding-left: 8px;
                border-bottom: 1px solid #ddd;
                overflow:hidden;
                text-overflow:ellipsis;
                white-space:nowrap;
                color: #666;
                &:hover {
                    a {
                         color: #2987DF;
                    }
                }
                &:last-child {
                    border-bottom: none;
                }
            }
        }
    }
    .conversion {
        padding: 0 20px;
        .title {
            text-align: center;
            margin-bottom: 20px;
            font-size: 14px;
        }
        .conversion-data {
            overflow: hidden;
            position: relative;
            min-height: 170px;
            .conversion-num {
                font-size: 20px;
                padding: 20px 0;
                text-align: center;
                background: #60BBCD;
                color: #fff;
                border-radius: 4px;
                &.num2 {
                    background: #71AFAF;
                }
                &.num3 {
                    background: #3B8EB7;
                }
            }
            .conversion-line {
                color: #60BBCD;
                font-size:16px;
                text-align: center;
                padding: 24px 0px;
                span {
                    height: 2px;
                    background: #60BBCD;
                    display: block;
                    position: relative;
                    &::after {
                        content: '';
                        width:0;
                        height:0;
                        border-width:8px 0 8px 8px;
                        border-style:solid;
                        border-color:transparent transparent transparent #60BBCD;
                        position: absolute;
                        right: 0;
                        top: -7px;
                    }
                }
            }
        }
        .percent_conversion {
            padding-top: 26px;
            span {
                height: 2px;
                width: 100%;
                display: block;
                background: #60BBCD;
                &.half {
                    width: 50%;
                    position: relative;
                    &::before {
                        content: '';
                        height: 26px;
                        width: 2px;
                        background: #60BBCD;
                        display: block;
                        position: absolute;
                        top: -26px;
                        left: 0;
                    }
                    &.rt {
                        &::before {
                            left: auto;
                            right: 0;
                        }
                        &::after {
                            content: '';
                            width:0;
                            height:0;
                            border-width:0 8px 8px;
                            border-style:solid;
                            border-color:transparent transparent #60BBCD;
                            position: absolute;
                            right: -7px;
                            top: -26px;
                        }
                    }
                }
            }
            .percent_data {
                position: relative;
                p {
                    position: absolute;
                    top: -20px;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    text-align: center;
                    color: #60BBCD;
                    font-size:16px;
                    &.txt {
                        top: 0;
                    }
                }
                
            }
        }
    }
    .function {
        border-top: 10px solid @color;
        background: #fff;
        ul {
            li {
                font-size: 12px;
                padding: 8px 0 8px 8px;
                border-bottom: 1px solid #ddd;
                &:hover {
                   a {
                        color: #2987DF;
                   }
                }
                &:last-child {
                    border-bottom: none;
                }
                i {
                    width: 18px;
                    height: 18px;
                    display: inline-block;
                    vertical-align: middle;
                    color: #666;
                    margin-right: 5px;
                    &.hdzx {
                       background: url('../../assets/images/hdzx.png')
                    }
                    &.ptkj {
                       background: url('../../assets/images/ptkj.png')
                    }
                    &.lpzx {
                       background: url('../../assets/images/lpzx.png')
                    }
                    &.ymgl {
                       background: url('../../assets/images/ymgl.png')
                    }
                    &.gwjl {
                       background: url('../../assets/images/gwjl.png')
                    }
                }
                span {
                    vertical-align: middle;
                }
                p {
                    overflow:hidden;
                    text-overflow:ellipsis;
                    white-space:nowrap;
                }
            }
        }
    }
}
</style>