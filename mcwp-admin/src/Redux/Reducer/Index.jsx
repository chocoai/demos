import { fromJS } from 'immutable';
import { LOADING, MODAL, REQ_SYS_DICT_SUCCESS, REQ_ENTER_DICT_SUCCESS,CLEAR_ENTER_DICT_SUCCESS,OSS_CLIENT_SUCCESS, OSS_UPLOAD_SUCCESS, FILE_LIST_SUCCESS, SAVA_CITIESID, SAVA_INDUSTRY, INSERT_CUST_SUCCESS, EMPTY_CITY_IND } from '../Constants/DispatchTypes';

import { Task } from './Task/TaskReducer'; // 任务管理
import Product from './Product/ProductReducer'; // 产品管理
import Ipieces from './Ipieces/IpiecesReducer'; // 进件管理
import DataServ from './Data/ServiceReducer'; // 数据服务管理
import Customer from './Customer/CustomerReducer'; // 客户管理
import Rule from './Rule/RuleReducer';   //规则管理
import RuleStatus from './Rule/RuleStatus'; //规则编辑保存状态管理

// 初始化state数据
const initialState = {
    loading: false,
    modalVisible: false,
    sysDictItems: '',
    enterDictItems: '',
    ossClient: '',
    ossUploadReq: '',
    fileLists: '',
    customerDown: '', // 客户信息excel模板获取成功
    insertCustomer: '', // 客户信息批量导入成功
    selectedCitiesId: '', // 多级联动多选支持城市
    selectedIndustry: '' // 多级联动多选受众行业
};

/**
 * 公共reducer
 * @return
 */
const Common = (state = initialState, action) => {
    switch(action.type) {
        case LOADING: // 用于页面和区块的加载中状态
            return fromJS(state).merge({loading: action.loading}).toJS();
        case MODAL: // 设置对话框是否可见
            return fromJS(state).merge({modalVisible: action.status}).toJS();
        case REQ_SYS_DICT_SUCCESS: // 根据字典代码获取字典列表
            // 此处有待更新
            return fromJS(state).mergeDeep({sysDictItems: action.res.data}).toJS();
        case REQ_ENTER_DICT_SUCCESS: // 根据字典代码,企业编码获取字典列表
            return fromJS(state).mergeDeep({enterDictItems: action.res.data}).toJS();
        case CLEAR_ENTER_DICT_SUCCESS: // 清空字典值
            return fromJS(state).mergeDeep({enterDictItems: ''}).toJS();
        case OSS_CLIENT_SUCCESS: //  获取OSS client
            return fromJS(state).merge({ossClient: action.client}).toJS();
        case OSS_UPLOAD_SUCCESS: // OSS文件上传成功
            return fromJS(state).merge({ossUploadReq: action.res}).toJS();
        case FILE_LIST_SUCCESS: // 已上传文件列表
            return fromJS(state).merge({fileLists: action.res.data}).toJS();
        case SAVA_CITIESID: // 保存多级联动多选支持城市
            return fromJS(state).merge({selectedCitiesId: action.data}).toJS();
        case SAVA_INDUSTRY: // 保存多级联动多选受众行业
            return fromJS(state).merge({selectedIndustry: action.data}).toJS();
        case INSERT_CUST_SUCCESS: // 客户信息批量导入成功
            return fromJS(state).merge({insertCustomer: action.res}).toJS();
        case EMPTY_CITY_IND: // 清空支持城市、受众行业
            return fromJS(state).merge({selectedCitiesId: '', selectedIndustry: ''}).toJS();
        default:
            return state;
    }
}

export { Common, Product, Ipieces, Task, DataServ, Customer, Rule, RuleStatus };

