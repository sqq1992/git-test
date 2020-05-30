<template>
    <div>
        <div class="center-dialog-box">
			<el-dialog
				title="温馨提示"
				:visible.sync="dialogVisible">
				<span>请先在商家后台开启店铺积分和会员等级</span>
				<span slot="footer" class="dialog-footer">
					<el-button type="primary" @click="openLink(1)">开启店铺积分</el-button>
					<el-button type="primary" @click="openLink(2)">开启会员等级</el-button>
				</span>
			</el-dialog>
            <el-dialog
				title="温馨提示"
				:visible.sync="actVisible" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
				<p>建议“邀请好友关注店铺”活动与“关注店铺”活动同时进行</p>
                <p>*在“关注店铺”活动中设置一定奖励可有效维护新关注店铺粉丝*</p>
				<span slot="footer" class="dialog-footer">
					<el-button type="primary" @click="okActTip()">好的</el-button>
				</span>
			</el-dialog>
		</div>
    </div>
</template>

<script>
import http from 'src/api/index.js';
import store from 'src/store.js'
export default {
    props: {
        linkArr: {
            type: Array,
            default: []
        },
    },
    data(){
        return {
          dialogVisible: false,
          actVisible: false
        }
    },
    methods: {
        openLink(type) {
            if(type == 1) {
                window.open('https://crm.shop.jd.com/crm/points/points_pointsSetting.action');
            }else {
                window.open('https://crm.shop.jd.com/crm/shopLevel/customerLevelAtShop.action');
            }
        },
        checkPower(type) {
            if(store.state.user.gradeIsOn && store.state.user.pointsIsOn) {
                var _url = '',
                    _urlArr = this.linkArr;
                    _url = _urlArr[type];
                if(type == 5) {
                    this.actVisible = true;
                }else {
                    this.$router.push({path: _url})
                }
            }else {
                this.dialogVisible = true;
            }
        },
        okActTip() {
            this.$router.push({path: '/inviting'})
        }
    }
}
</script>

