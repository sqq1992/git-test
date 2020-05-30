import Vuex from 'vuex'
import Vue from 'vue'
import createLogger from 'vuex/dist/logger'
const debug = process.env.NODE_ENV != 'production'
// const debug = false
Vue.use(Vuex)
export default new Vuex.Store({
    state: {
        user: debug ? {
            "beginTime": "测试内容828n",
            "endTime": "2018-09-17 15:41:40",
            "id": 32368,
            "shopId": 37173,
            "shopName": "",
            "venderId": 154183,
            "pointsIsOn": true,
            "gradeIsOn": true,
            "useMsgCount":0,
            "restMsgCount":0
        } : {},
        member: 0,
        seeItem: {},
        breadcrumb: '',
        editOrCreate: 'edit',
        memberList: {
            '0': '注册会员',
            '1': '一星会员',
            '2': '二星会员',
            '3': '三星会员',
            '4': '四星会员',
            '5': '五星会员'
        },
        memberAjax: {},
        setMemberLevel: {},
        ziying: {
            isZiying: false,
            update: false
        },
        sendLog: {
            templateId:'',
            sendFlag: false
        },
        whiteList:[//京东短信白名单
          // '斑布京东自营官方旗舰店',
          // '罗马仕京东自营旗舰店',
          // '蕉下京东自营旗舰店',
          '快麦旗舰店'
        ]
    },
    mutations: {
        update(state, {user}) {
            state.user = Object.assign({}, state.user, user)
        },
        user(state, user) {
            state.user = Object.assign({}, state.user, user)
        },
        SET_MEMBER_LEBEL(state, options) {
            state.setMemberLevel = options;
        },
        SET_MEMBER_AJAX(state, options) {
            state.memberAjax = options;
        },
        EDIT_OR_CREATE(state, options) {
            state.editOrCreate = options;
        },
        SET_MEMBER(state, options) {
            state.member = options;
        },
        SET_SEE_ITEM(state, options) {
            state.seeItem = {};
            for(let i in options) {
                state.seeItem[i] = options[i]
            }
        },
        SET_BREAD(state, options) {
            state.breadcrumb = options;
        },
        updateIsZiying(state, flg){
            state.ziying.isZiying = flg;
            state.ziying.update = true;
        },
        updateSendLog(state,data){
            state.sendLog.templateId = data.id;
            state.sendLog.sendFlag = data.flg;
        }
    },
    actions: {
        update({commit}, data) {
            return commit('update', data)
        },
        user({commit}, data){
            return commit('user', data)
        },
        updateIsZiying({commit}, flg){
            return commit('updateIsZiying', flg);
        },
        updateSendLog({commit},data) {
            return commit('updateSendLog', data);
        }
    },
    strict: debug,
    plugins: debug ? [createLogger()] : []
})
