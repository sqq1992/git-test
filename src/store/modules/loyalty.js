import http from '../../api/index.js';

const state = {
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
	setMemberLevel: {}
}

const getters = {
	member: state => state.member,
	seeItem: state => state.seeItem,
	breadcrumb: state => state.breadcrumb,
	editOrCreate: state => state.editOrCreate
}

const actions = {
	
}

const mutations = {
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
	}
}

export default{
	state,
	getters,
	actions,
	mutations
}