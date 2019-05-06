import { fromJS } from 'immutable';
import { REQ_SRV_LIST_SUCCESS, REQ_SRV_DETAIL_SUCCESS, OP_SERV_SUCCESS } from '../../Constants/DataServiceTypes';

// 初始化state数据
const initialState = {
    serviceInfo: [],
    serviceDetail: '',
    pagination: {
        pageSizeOptions: ['3', '6', '9', '12'] // 指定每页可以显示多少条
    },
    params: {
        page: 1,
        rows: 3
    }
};

/**
 * 数据服务管理reducer
 * @return
 */
const Data = (state = initialState, action) => {
    switch(action.type) {
        case REQ_SRV_LIST_SUCCESS:
            const pagination = state.pagination;
            pagination.total = action.res.recordsTotal; // 总页数
            pagination.current = action.params.page; // 当前页数
            return fromJS(state).merge({params: action.params, serviceInfo: action.res.data, pagination: pagination}).toJS();
        case REQ_SRV_DETAIL_SUCCESS:
            return fromJS(state).merge({serviceDetail: action.res.data}).toJS();
        case OP_SERV_SUCCESS:
            let serviceList = [];
            const opParams = action.params;
            state.serviceInfo.map((item, index) => {
                if(item.code == opParams.code) {
                    if(opParams.srvStatus) item.srvStatus = 2;
                    if(!opParams.srvStatus) item.srvStatus = 1;
                }
                serviceList.push(item);
            });
            return fromJS(state).merge({serviceInfo: serviceList}).toJS();
        default:
            return state;
    }
}

export default Data;