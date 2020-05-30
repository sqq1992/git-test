<template>
    <div class="memberDialog">
        <ul class="conUl">
            <li style="width:100%;">
                <span class="title">会员等级：</span>
                <span class="content">
                    {{grade}}
                </span>
            </li>
            <li v-for="(item,index) in checkDataList" :key="index">
                <span class="title">{{item.name}}：</span>
                <span class="content">{{item.content || '不限'}}</span>
            </li>
        </ul>
    </div>
</template>
<script>
import http from 'src/api'
export default {
    props:{
        crowRule:String
    },
    data() {
        // this.crowRule = JSON.parse(this.crowRule);
        let {grade} = JSON.parse(this.crowRule);
        console.log(grade);
        grade = JSON.parse(grade);
        return {
            grade,
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
    created() {
        this.getMemberGrade();
        this.getContent();

    },
    methods: {
        getMemberGrade() {
            let grade = this.grade.sort((n,p) => n-p);
            let _index = grade.indexOf(0)
            if (_index != -1) {
              grade.splice(_index,1);
            }
            http({
                api_name: 'memberLevelList',
            },({data:{levelList}}) => {
                if(grade.length == levelList.length){
                    this.grade = '不限';
                } else {
                    levelList.forEach(item => {
                        grade.forEach((g,i) => {
                            if(g == item.memberLevel){
                                grade[i] = item.name;
                                return;
                            }
                        });
                    })
                    this.grade = grade.join(',');
                }
            })
        },
        getContent() {
            let crowRule = JSON.parse(this.crowRule);
            this.checkDataList.forEach(item => {
                let {min, max} = item,
                    minVal = crowRule[min],
                    maxVal = crowRule[max];
                switch(item.type) {
                    case 'firstOrderCheck': case 'timeCheck':
                        if(minVal && maxVal) {
                            item.content = maxVal + '-' +minVal;
                        } else if(minVal) {
                            item.content = minVal + '之前';
                        } else if(maxVal) {
                            item.content = maxVal + '至今';
                        }
                    break;
                    case 'countCheck': case 'amountCheck': case 'priceCheck':
                    case 'itemNumCheck': case 'closeTradeCountCheck':
                    case 'closeTradeAmountCheck':
                        let unit = ['countCheck','closeTradeCountCheck'].includes(item.type) ? '次' : item.type == 'itemNumCheck' ? '件' : '元';
                        if(minVal && maxVal) {
                            item.content = '介于'+ maxVal  + '-' + minVal + unit;
                        } else if (minVal) {
                            item.content = '小于等于' + minVal + unit;
                        } else if (maxVal) {
                            item.content = '大于等于' + maxVal + unit;
                        }
                    break;
                }
            })
        }
    },
}
</script>
<style lang="less" scoped>
    .memberDialog{
        .banner{
          font-size:16px;
        }
        .title{

        }
        .conUl{
            li{
                width:50%;
                display: inline-block;
            }
        }
    }
</style>
