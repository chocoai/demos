import { fromJS } from 'immutable';
import { CHANGE_RULE } from '../../Constants/RuleTypes';

const RuleData = (state = [], action) => {
    switch (action.type) {
        case CHANGE_RULE:
            return fromJS(state).merge(action.data).toJS();
        default:
            return state
    }
};

export default RuleData;