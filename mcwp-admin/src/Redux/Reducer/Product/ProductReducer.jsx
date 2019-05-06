import { fromJS } from 'immutable';
import { REQ_PRO_SUCCESS, PROD_PUB, PROD_SHARE_SUCCESS } from '../../Constants/ProductTypes';

// 初始化state数据
const initialState = {
    pubStep: 1,
    productInfo: [],
    pagination: {
        pageSizeOptions: ['3', '6', '9', '12'] // 指定每页可以显示多少条
    },
    params: {
        page: 1,
        rows: 3,
        prdType: ''
    },
    productShare: ''
};

/**
 * 产品管理reducer
 * @return
 */
const Product = (state = initialState, action) => {
    switch(action.type) {
        case REQ_PRO_SUCCESS:
            const pagination = state.pagination;
            pagination.total = action.res.recordsTotal; // 总页数
            pagination.current = action.params.page; // 当前页数
            return fromJS(state).merge({params: action.params, productInfo: action.res.data, pagination: pagination}).toJS();
        case PROD_PUB:
            let productList = [];
            state.productInfo.map((item, index) => {
                if(item.code == action.code) {
                    if(action.pubOp == 4) item.prdStatus = 2;
                    if(action.pubOp == 3) item.prdStatus = 3;
                }
                productList.push(item);
            });
            return fromJS(state).merge({productInfo: productList}).toJS();
        case PROD_SHARE_SUCCESS: // 发布成功后生成分享内容成功
            return fromJS(state).merge({productShare: action.res.data}).toJS();
        default:
            return state;
    }
}

export default Product;