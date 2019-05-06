// import * as types from "../mutation-types";
// import HomeService from "../../service/home";

// 初始化 state
const state = {
  adsList: "",
  menuList: ""
};

// getters
const getters = {
  adsList: state => state.adsList,
  menuList: state => state.menuList
};

// actions
const actions = {
  // async getAdsList({ commit }) {
  //   // 获取广告图
  //   // let res = await HomeService.getAdsList();
  //   let res = null;
  //   commit(types.GET_ADSLIST, res);
  // },
  // async getMenuList({ commit }) {
  //   // 获取菜单
  //   // let res = await HomeService.getMenuList();
  //   let res = null;
  //   commit(types.GET_MENULIST, res);
  // }
};

// mutations
const mutations = {
  // [types.GET_ADSLIST](state, adsList) {
  //   state.adsList = adsList;
  // },
  // [types.GET_MENULIST](state, menuList) {
  //   state.menuList = menuList;
  // }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
