import React, { Component } from 'react'; // 引入了React
import { Config } from '../../Config/Index';
import './style/dataInformation.less';
//数据信息
class DataInformation extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentDidMount() {
        // console.log( Config.numberWithCommas(100000))
        // Config.numberWithCommas()
    }
    render() {
        const that = this;
        const { TotalDataSum, TotalDataLoan,TotalDataTop,TotalDataCenter, className } = that.props;
        return (
            <div className={className}>
                {TotalDataSum ?
                    <div className='dataInformation-content'>
                        <p className='dataInformation-list'><span className='number'>{TotalDataSum.creditMoneys ? Config.numberWithCommas(TotalDataSum.creditMoneys) : '--'}</span><span className='word'>授信金额（万元）</span></p>
                        <p className='dataInformation-list'><span className='number'>{TotalDataSum.verifys ? Config.numberWithCommas(TotalDataSum.verifys) : '--'}</span><span className='word'>客户总数</span></p>
                        <p className='dataInformation-list'><span className='number'>{TotalDataSum.loanMoneys ? Config.numberWithCommas(TotalDataSum.loanMoneys) : '--'}</span><span className='word'>放款金额（万元）</span></p>
                    </div> : null}
                {TotalDataLoan ? <div className='dataInformation-content'>
                    <p className='dataInformation-list bottomData'><span className='number'>{TotalDataLoan && TotalDataLoan.pieces ? Config.numberWithCommas(TotalDataLoan.pieces) : '--'}</span><span className='word'>进件数量</span></p>
                    <p className='dataInformation-list bottomData'><span className='number'>{TotalDataLoan && TotalDataLoan.passRate ? Config.numberWithCommas(TotalDataLoan.passRate) : '--'}</span><span className='word'>授信通过率</span></p>
                    <p className='dataInformation-list bottomData'><span className='number'>{TotalDataLoan && TotalDataLoan.refuseRate ? Config.numberWithCommas(TotalDataLoan.refuseRate) : '--'}</span><span className='word'>授信拒绝率</span></p>
                    <p className='dataInformation-list bottomData'><span className='number'>{TotalDataLoan && TotalDataLoan.custs ? Config.numberWithCommas(TotalDataLoan.custs) : '--'}</span><span className='word'>平均管户数</span></p>
                </div> : null}
                {TotalDataTop? <div className='dataInformation-content'>
                    <p className='dataInformation-list bottomData'><span className='number'>{TotalDataTop && TotalDataTop.makeLoanNum? Config.numberWithCommas(TotalDataTop.makeLoanNum) : '--'}</span><span className='word'>放款量（笔）</span></p>
                    <p className='dataInformation-list bottomData'><span className='number'>{TotalDataTop && TotalDataTop.makeLoanAmount  ? Config.numberWithCommas(TotalDataTop.makeLoanAmount ) : '--'}</span><span className='word'>放款总额（万元）</span></p>
                    <p className='dataInformation-list bottomData'><span className='number'>{TotalDataTop && TotalDataTop.makeLoanRateText  ? TotalDataTop.makeLoanRateText : '--'}</span><span className='word'>放款率</span></p>
                    <p className='dataInformation-list bottomData'><span className='number'>{TotalDataTop && TotalDataTop.stockAmount ? Config.numberWithCommas(TotalDataTop.stockAmount) : '--'}</span><span className='word'>存量总额（万元）</span></p>
                    <p className='dataInformation-list bottomData'><span className='number'>{TotalDataTop && TotalDataTop.loanReqNum  ? Config.numberWithCommas(TotalDataTop.loanReqNum ) : '--'}</span><span className='word'>进件量（笔）</span></p>
                </div> : null}

                {TotalDataCenter?<div className='dataInformation-content'>
                    <p className='dataInformation-list bottomData'><span className='number'>{TotalDataCenter && TotalDataCenter.serviceCustNum? Config.numberWithCommas(TotalDataCenter.serviceCustNum) : '--'}</span><span className='word'>服务客户数（人）</span></p>
                    <p className='dataInformation-list bottomData'><span className='number'>{TotalDataCenter && TotalDataCenter.stockCustNum ? Config.numberWithCommas(TotalDataCenter.stockCustNum) : '--'}</span><span className='word'>存量客户数（人）</span></p>
                </div> : null}
            </div>
        )
    }
}
export default DataInformation;
