// import { INCREASE, DECREASE } from '../../Constants/DispatchTypes';

// /**
//  * 任务管理reducer
//  * @return
//  */
// // 初始化state数据
// const initialState = {
//     number: 1, 
//     params: {
//         page: 1,
//         rows: 5,
//         taskType: 1 // 任务类型:1.营销任务,2.调查任务,3.全部任务
//     } 
// };

// const Task = (state = initialState, action) => {
//     switch(action.type) {
//         case INCREASE:
//             return Object.assign({}, state, { number: state.number + action.amount});
//         case DECREASE:
//             return Object.assign({}, state, { number: state.number - action.amount});
//         default:
//             return state;
//     }
// }

// export { Task };