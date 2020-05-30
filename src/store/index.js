/**
 */
import Vue from 'vue';
import Vuex from 'vuex';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import state from './state';

import loyalty from './modules/loyalty';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  	state,
  	getters,
  	actions,
  	mutations,
  	modules: {
    	loyalty
  	}
})
