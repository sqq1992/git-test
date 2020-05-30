<template>
	<div class="m-content diaWidth create-member-box" v-loading="fullscreenLoading">
		<div class="m-content-main main_height inputSet" id="createMembere" v-loading="loadingPage">
			<div class="row_line m_b10 activeNamediv">
				<span>活动名称：</span>
				<el-input :maxlength="20" @blur="checkName" v-model.trim="name" class="activeName" placeholder="请输入活动名称"></el-input>
				<div class="red" v-if="name.length > 20">
					活动名称最长不超过20个字
				</div>
				<div class="red" v-if="existed">
					当前活动名称已存在，请重新输入
				</div>
				<div class="red" v-if="noName">
					请输入活动名称
				</div>
			</div>
			<div class="row_line m_b10 activeNamediv">
				<span>活动时间：</span>
			    <el-date-picker
			    	:editable="false"
			    	class="row_date"
			    	:disabled="isStartEdit"
			      	v-model="dateOne"
			      	type="datetime"
			      	placeholder="选择日期时间"
			      	align="right"
			      	:picker-options="pickerLeft">
			    </el-date-picker>
			    <span class="">-</span>
			    <el-date-picker
			    	:editable="false"
			    	class="row_date"
			      	v-model="dateTwo"
			      	type="datetime"
			      	placeholder="选择日期时间"
			      	align="right"
			      	:picker-options="pickerRight">
			    </el-date-picker>
			    <div class="red" v-if="setTime">
					请设置活动起止时间
				</div>
			</div>
            <div class="table m_b10 ml70">
                <table width="300" border="0" cellspacing="1" cellpadding="0">
                    <tr>
                        <th>礼物类型</th>
                        <th>奖品面额</th>
                        <th>发放人数</th>
                        <th>有效期天数</th>
                        <th>余额</th>
                        <th>操作</th>
                    </tr>
                    <tr v-for="(item, index) in giftList" :key="index">
                        <td>{{item.giftName}}</td>
                        <td v-if="item.discount">{{item.discount}}</td>
                        <td v-else><el-input v-model="addCurrent.discount" placeholder="请输入每人发放数量" type="number" :min="0"></el-input></td>
                        <td v-if="item.sendCount">{{item.sendCount}}</td>
                        <td v-else><el-input v-model="addCurrent.sendCount" placeholder="请输入发放人数" type="number" :min="0"></el-input></td>
                        <td v-if="item.validateDay">{{item.validateDay}}</td>
                        <td v-else><el-input v-model="addCurrent.validateDay" placeholder="请输入有效期天数" type="number" :min="0"></el-input></td>
                        <td>{{computedBalance(item.balance)}}</td>
                        <td>
                            <el-button type="text" @click="saveCurrent" v-show="!item.sendCount">保存</el-button>
                            <el-button type="text" @click="delCurrent(index)">删除</el-button>
                        </td>
                    </tr>
                </table>
            </div>
            <el-button type="primary" size="medium" class="m_b10 ml70" @click="addGift">+新增奖项</el-button>
            <!-- <div class="row_line m_b10 grayDiv ml70">
                <p>预计总费用：0.01元</p>
                <p>京豆：0.01 元</p>
            </div> -->
			<div class="sureBut">
				<el-button size="small" @click="goHistory">取消</el-button>
				<el-button type="primary" size="small" @click="sureChange">确定</el-button>
			</div>
		</div>
        <el-dialog
            title="新增奖项"
            :visible.sync="dialogVisible"
            :center="center"
            width="30%"
            :before-close="handleClose">
            <span>请选择礼物类型</span>
            <el-radio-group v-model="giftType" label="请选择礼物类型">
                <el-radio :label="0">京券</el-radio>
                <el-radio :label="1">东券</el-radio>
                <el-radio :label="4">京豆</el-radio>
                <el-radio :label="6">积分</el-radio>
                <el-radio :label="8">流量卡</el-radio>
                <el-radio :label="14">红包</el-radio>
            </el-radio-group>
            <div class="m_t30 center" v-show="giftType===1">
                订单满  <el-input-number v-model="quota" :min="1"></el-input-number>  元，
                减  <el-input-number v-model="discount" :min="1"></el-input-number> 元
            </div>
            <div class="m_t30 center" v-show="giftType===0">
                面值：<el-select v-model="discount" placeholder="请选择">
                    <el-option
                        v-for="item in couponOpt"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select> 元
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancle">取 消</el-button>
                <el-button type="primary" @click="addBtn">确 定</el-button>
            </span>
        </el-dialog>
	</div>
</template>

<script>
import dateFormat from './../../common/dateFormat.js';
import ajax from './../../api/index.js';
export default{
    data() {
        return{
            existed: false,
            name: '',
            day: '',
            pickerLeft: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },
            pickerRight: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },
            setTime: false,
            noName: false,
            dateOne: '',
            dateTwo: '',
            dialogVisible: false,
            giftType: '', // 当前选中的礼物类型
            quota: 0,// 满减
            discount: 0, // 优惠数量
            validateDay: '', // 有限天数
            sendCount: 0, // 发放人数
            couponVal: 1, // 券最低额度为1
            couponOpt: [{ value: '1',label: '1元'}, { value: '5',label: '5元'}, { value: '10',label: '10元'}],
            giftList: [], // 添加的礼物列表
            addCurrent: {}, // 当前增加的礼物信息
            giftJson: [],
            balance: '', // 礼物余额
            flag: false // 是否点击保存
        }
    },
    watch: {
        dateOne(val) {
            if(val && this.dateTwo) {
                this.setTime = false;
            }
            if(val) {
                this.pickerRight = {
                    disabledDate(time) {
                        return time.getTime() < new Date(val) - 8.64e7;
                    }
                }
            } else {
                this.pickerRight = {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                }
            }
        },
        dateTwo(val) {
            if(val && this.dateOne) {
                this.setTime = false;
            }
        },
        name(val) {
            this.doFalse(val, 'noName');
        },
        day(val) {
            this.doFalse(val, 'setDay');
        }
    },
    computed: {
        member() {
            return this.$store.state.member;
        }
    
    },
    methods: {
        checkName() {
            if(!this.name) {
                this.existed = false; return
            }
            ajax({
                api_name: 'couponNameCheck',
                vm: this,
                data: {
                    activityName: this.name,
                    id: this.$route.query.id
                }
            }, (res) => {
                this.existed = res.data ? res.data.existed : true;
            }, (error) => {

            })
        },
        computedBalance(balance) {
            return balance !== '' ? balance : '--'
        },
        doFalse(val,item) {
            if(val) {
                this[item] = false;
            }
        },
        goHistory() {		//取消
            this.$router.push({path: '/memberCardList'});
        },
        revertType(type) {
            return type == 0 ? '京券' : type == 1 ? '东券' : 
            type == 4 ? '京豆' : type == 6 ? '积分' : 
            type == 8 ?'流量卡包' : type == 14 ? '红包' : ''
        },
        addGift() {
            // 添加填写无保存
            if (this.addCurrent.sendCount && this.addCurrent.discount && this.addCurrent.validateDay && !this.flag){
                this.$message.error('请保存当前添加');
                return 
            }
            //添加无填写无保存
            if ((!this.addCurrent.sendCount || !this.addCurrent.discount || !this.addCurrent.validateDay) && this.giftType !== '') {
                this.$message.error('请完成当前会员卡的添加');
                return
            }
            this.addCurrent = {}
            this.flag = false
            this.dialogVisible = true
        },
        cancle() {
            this.giftType = ''
            this.addCurrent = {}
            this.dialogVisible = false
        },
        addBtn() { // 弹框增加礼物
            if(this.giftType === '') {
                this.$message.error('请选择!')
                return
            }
            let obj = {
                giftName: this.revertType(this.giftType),
                discount: (this.giftType === 0 || this.giftType === 1) ? this.discount  : '' ,
                prizeType: this.giftType,
                sendCount:  '',
                validateDay: '',
                balance: ''
            }
            if (this.giftType === 0) {
                obj.discount = this.discount
            } else if (this.giftType === 1) {
                if (this.quota <= this.discount) {
                    this.$message.error('面额必须小于满减金额')
                    return
                }
                obj.discount = this.discount
                obj.quota = this.quota
            }
            // 1:流量包, 2:E卡, 3:PLUS会员, 4:爱奇艺会员, 8:红包, 9:短信
            if (this.giftType == '8' || this.giftType == '14') {
                let typeId = this.giftType == '8' ? '1' : '8' // 流量传1，红包传8
                this.getBalance(typeId, obj)
            } else {
                this.giftList.push(obj) // 在数组上添加
                this.dialogVisible = false
            }
           
        },
        saveCurrent() { // 保存当前添加
            let len = this.giftList.length - 1
            let currentObj = this.giftList[len] // 弹窗确定时已添加上了
            if (this.giftType !== 0 || this.giftType !== 1) currentObj.discount = this.addCurrent.discount
            if (this.giftType == 1) { // 东券
                currentObj.discount = this.discount
                currentObj.quota = this.quota
            } else if (this.giftType == 0) {  // 京券
                currentObj.discount = this.discount
            } else {
                currentObj.discount = this.addCurrent.discount // 奖励数量
            }
            if (this.giftType == 8) currentObj.assetItemId = 1 // 流量
            if (this.giftType == 14) {
                currentObj.assetItemId = 15 // 红包
                currentObj.awardType = 2
            }
            currentObj.sendCount = this.addCurrent.sendCount
            currentObj.validateDay = this.addCurrent.validateDay
            this.flag = true
            // 清空置为初始状态
            this.giftType = ''
        },
        delCurrent(index) { // 删除
            this.giftList.splice(index, 1)
            this.addCurrent = {}
            this.giftType = ''
        },
        getBalance(typeId,obj) {
            let data = {}
            data.typeId = typeId
            this.loadingPage = true;
            ajax({
                api_name: 'queryBalance',
                vm: this,
                data: data
            }, (res) => {
                this.loadingPage = false;
                if(res.result == '100') {
                    this.balance = res.data.quantityBalance
                    obj.balance = res.data.quantityBalance
                    this.giftList.push(obj) // 在数组上添加
                    this.dialogVisible = false
                }
            },(err) => {
                this.loadingPage = false;
                this.$message.error('网络错误')
            })
        },
        sureChange() { //确定
            let timeStamp = new Date(this.dateTwo) - new Date(this.dateOne)
            let day = timeStamp / 1000 / 24 / 3600 // 时间戳转化为day
            if(this.existed) {
                this.$message.error('当前活动名称已存在，请重新输入');
                return
            }
            if(!this.name) {
                this.noName = true;
                return
            } else {
                this.noName = false;
            }
            if(!this.dateOne || !this.dateTwo){
                this.setTime = true;
                return
            } else {
                this.setTime = false;
            }
            if(new Date(this.dateOne) > new Date(this.dateTwo)){
                this.$message.error('开始时间不能大于结束时间');
                return
            }
            if (day < 3) {
                this.$message.error('活动时间不能小于3天!');
                return
            }
            if(!this.giftList.length) {
                this.$message.error('至少添加一个奖项');
                return
            }
            
            let data = {};
            let start = this.dateOne ? (dateFormat(this.dateOne,'YY-MM-DD HH:MM:SS')) : '';
            let end = this.dateTwo ? (dateFormat(this.dateTwo,'YY-MM-DD HH:MM:SS')) : '';
            data.name = this.name,
            data.startTime = start,
            data.endTime = end
            data.ruleSetting = JSON.stringify(this.giftList)//传json格式
            this.loadingPage = true;
            ajax({
                api_name: 'memberCreateCard',
                vm: this,
                data: data
            }, (res) => {
                this.loadingPage = false;
                this.$router.push('/memberCardList')
                this.$message.success('创建成功')
            }, (error) => {
                this.loadingPage = false;
            })
        },
    }
}
</script>

<style lang="less">
.m-content-main{
    padding: 23px;
    font-size: 14px;
    color: #333;
    .activeName{
        width: 200px;
    }
    .row_date{
        width: 180px;
    }
    .m_b10{
        margin-bottom: 15px;
    }
    .activeNamediv{
        margin-bottom: 0;
        height: 50px;
        .red{
            margin-left: 74px;
            font-size: 12px;
        }
    }
    .grayDiv{
        background: #fafafa;
        padding: 20px;
        max-width: 600px;
    }
    .sureBut{
        margin-left: 70px;
        button{
            width: 78px;
        }
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
.el-input-number__increase,.el-input-number__decrease {
    border:0;
}
.el-input-number__decrease {
    left: 1px;
    border-radius: 4px 0 0 4px;
    border-right: 1px solid #dcdfe6;
}
.el-input-number__increase {
    right: 1px;
    border-radius: 0 4px 4px 0;
    border-left: 1px solid #dcdfe6;
}
.el-input {
    position: relative;
    font-size: 14px;
    display: inline-block;
    width: 100%;
}
.el-input-number{
    line-height: 34px;
}
.el-input-number .el-input__inner {
    -webkit-appearance: none;
    width: 100% !important;
    height: 34px;
    line-height: 34px;
    padding-left: 50px;
    padding-right: 50px;
    text-align: center;
}
.el-input-number{
    width: 140px;
}
.center{
    text-align: center;
}
.m_t30{
    margin-top: 30px;
}
.el-select .el-input__inner{
    height: 100%;
    width: 100%;
}
.dialog-footer{
    display: flex;
    justify-content: center
}
</style>
