import * as types from "../mutation-types";
import { getWxMe, getWxMeInfo } from "../../service/user";
import Store from "store";
import { Config } from "../../utils";

// 初始化 state
const state = {
  wxMe: "",
  wxMeInfo: ""
};

// getters
const getters = {
  wxMe: state => state.wxMe,
  wxMeInfo: state => state.wxMeInfo
};

// actions
const actions = {
  async getWxMe({ commit }) {
    const res = await getWxMe();
    let cookies = Store.get(Config.constants.cookies);
    cookies = Object.assign(cookies, res.data);
    Store.set(Config.constants.cookies, cookies);
    commit(types.GET_WX_ME, res);
  },
  async getWxMeInfo({ commit }) {
    // 个人中心个人信息
    const res = await getWxMeInfo();
    commit(types.GET_WX_ME_INFO, res);
  }
};

// mutations
const mutations = {
  [types.GET_WX_ME](state, res) {
    state.wxMe = res.data;
  },
  [types.GET_WX_ME_INFO](state, res) {
    state.wxMeInfo = res.data;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
