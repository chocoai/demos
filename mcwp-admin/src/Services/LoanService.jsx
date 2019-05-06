import Xhr from './Xhr/Index';
class LoanService {
    getRepaymentPlan(params) {
        return Xhr.promiseGet('/v1/loan/repaymentPlan/lc',params);
    }
    getbonusMoney(params){
        return Xhr.promiseGet('/v1/loan/audit/deduction/money',params);
    }
    getbonusRate(params){
        return Xhr.promiseGet('/v1/loan/audit/deduction/result',params);
    }
    putFinishMortgage(params){
        return Xhr.promisePut('/v1/loan/borrowInfo/mortgage',params);
    }
}

export default new LoanService();
