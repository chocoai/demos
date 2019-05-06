import { fromJS } from 'immutable';
import { REQ_CUST_SUCCESS, REQ_CUST_LIST_SUCCESS, SAVE_CUST, MANAGER_LIST, REQ_CUST_LOAN_SUCCESS, CUST_TASK_SUCCESS, EMPTY_CUST_TASK, REQ_CUST_BORROW_SUCCESS,PUT_ITEM_ARR,CLEAR_DATA } from '../../Constants/CustomerTypes';

// 初始化state数据
const initialState = {
    customerInfo: '',
    itemArr: [],
    max:0,
    customerTask: '',
    customerList: [],
    managerList: [],
    customerLoanList: [],
    customerBorrowList:[],
    pagination: {
        showSizeChanger: true, 
        showQuickJumper: true,
        total: 0,
        showTotal: (total, range) => `共  ${total}  条`,
        pageSizeOptions: ['5', '10', '15'] // 指定每页可以显示多少条
    },
    params: {
        page: 1,
        rows: 10
    },
    loanPagination: {
        showSizeChanger: true, 
        showQuickJumper: true,
        total: 0,
        showTotal: (total, range) => `共  ${total}  条`,
        pageSizeOptions: ['5', '10', '15'] // 指定每页可以显示多少条
    },
    loanParams: {
        page: 1,
        rows: 10
    },
    borrowPagination: {
        showSizeChanger: true, 
        showQuickJumper: true,
        total: 0,
        showTotal: (total, range) => `共  ${total}  条`,
        pageSizeOptions: ['5', '10', '15'] // 指定每页可以显示多少条
    },
    borrowParams: {
        page: 1,
        rows: 10
    }
};

/**
 * 客户管理reducer
 * @return
 */
const Customer = (state = initialState, action) => {
    switch(action.type) {
        case SAVE_CUST:
            return fromJS(state).merge({customerInfo: action.info}).toJS();
        case CLEAR_DATA:
            return fromJS(state).merge({itemArr:[],max:0}).toJS();
        case CUST_TASK_SUCCESS: 
            return fromJS(state).merge({customerTask: action.res.data}).toJS();
        case PUT_ITEM_ARR: 
            return fromJS(state).merge({itemArr: action.info,max:state.max+1}).toJS();
        case EMPTY_CUST_TASK:
            return fromJS(state).merge({customerTask: ''}).toJS();
        case REQ_CUST_SUCCESS:
            return fromJS(state).merge({customerInfo: action.res.data,itemArr: [...Array(action.res.data&&action.res.data.guaranteeInfos.length)].map((_, i)=> i),max:action.res.data&&action.res.data.guaranteeInfos.length}).toJS();
        case REQ_CUST_LIST_SUCCESS:
            const pagination = state.pagination;
            pagination.total = action.res.recordsTotal; // 总页数
            pagination.current = action.params.page; // 当前页数
            return fromJS(state).merge({params: action.params, customerList: action.res.data, pagination: pagination}).toJS();
        case REQ_CUST_LOAN_SUCCESS:
            const loanPagination = state.loanPagination;
            loanPagination.total = action.res.recordsTotal; // 总页数
            loanPagination.current = action.params.page; // 当前页数
            return fromJS(state).merge({loanParams: action.params, customerLoanList: action.res.data, loanPagination: loanPagination}).toJS();
        case MANAGER_LIST:
            return fromJS(state).merge({managerList: action.info}).toJS();
        case REQ_CUST_BORROW_SUCCESS:
            const borrowPagination = state.borrowPagination;
            borrowPagination.total = action.res.recordsTotal; // 总页数
            borrowPagination.current = action.params.page; // 当前页数
            return fromJS(state).merge({borrowParams: action.params,customerBorrowList: action.res.data, borrowPagination: borrowPagination}).toJS();
        default:
            return state;
    }
}

export default Customer;