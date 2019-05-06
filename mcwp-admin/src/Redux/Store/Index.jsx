/**
 * 创建store
 * 
 * @param {any} reducer:用来修改state
 * @param {any} 默认的state值,如果不传, 则为undefined
 * @returns  Redux store 来以存放应用中所有的 state，应用中应有且仅有一个 store。
 */

import {createStore, combineReducers, applyMiddleware} from 'redux';
import * as reducer from '../Reducer/Index';
import thunk from 'redux-thunk'; // 中间件，有了这个就可以支持异步action

//创建一个 Redux store 来以存放应用中所有的 state，应用中应有且仅有一个 store。

var store = createStore(
	combineReducers(reducer),
	applyMiddleware(thunk)
);

export default store;