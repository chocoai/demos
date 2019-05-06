import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
// import { Config } from '../../../Config/Index';
import IpiecesService from '../../../Services/IpiecesService'; 

import getContent from '../../../Config/Ipieces'
import './style/pdf.less'

/**
 * 根据code来获取数据
 */
class PDF extends Component {
    constructor (props) {
    	super(props);
        this.state = props
    }
    componentWillMount () {
        if (process.env.NODE_ENV == 'development' && !this.state.topInfo) {
            this.test()               
        }            
    }
    async test () {
        const {code, type} = this.props.params            
        let topInfo = await IpiecesService.getTopInfo({code})
        if (!topInfo || !topInfo.tabShow || !topInfo.tabShow.length) return console.error('无法下载pdf')
        let [baseInfo, businessInfoData, businessOtherData, businessAnalysisData, guaranteeData, logicData, assetsData, softInfo, sigleSoftInfo, mismatch, loanCreditHisData, proInfoData, balance, income, cash, farmBalance, farmIncome, farmCash, farmBase, loanDownStream] = await Promise.all([
            IpiecesService.getBaseInfo({code}),
            IpiecesService.getBusinessInfo({code}),
            IpiecesService.getBusinessOther({code}),
            IpiecesService.getBusinessAnalysis({code}),
            IpiecesService.getGuaranteeData({code}),
            IpiecesService.getLogicData({code}),        
            IpiecesService.getAssetsData({code}),
            IpiecesService.getSoftInfo({code}),
            IpiecesService.getSingleSoft({code}),
            IpiecesService.getMismatch({code}),
            type == 7 || type == 8 ? IpiecesService.getCreditHis({code}): IpiecesService.getCreditHisCustomer({code}),
            type == 8 ? IpiecesService.getProInfoData({code}) : null,
            type == 6 ||  type == 8 ? IpiecesService.getBalance({code}) : null, 
            type == 6 ||  type == 8 ? IpiecesService.getIncome({code}) : null, 
            type == 6 ||  type == 8 ?IpiecesService.getCash({code}) : null, 
            type == 6 ||  type == 8 ? null  : IpiecesService.getFarmBalance({code}), 
            type == 6 ||  type == 8 ? null : IpiecesService.getFarmIncome({code}), 
            type == 6 ||  type == 8 ? null : IpiecesService.getFarmCash({code}), 
            type == 6 ||  type == 8 ? null  : IpiecesService.getFarmBase({code}), 
            type == 6 ||  type == 8 ? null : IpiecesService.getLoanDownStream({code})
        ])
        this.setState({
            topInfo, type, baseInfo, businessInfoData, businessOtherData, businessAnalysisData, guaranteeData, logicData, assetsData, softInfo, sigleSoftInfo, mismatch, loanCreditHisData, proInfoData, balance, income, cash, farmBalance, farmIncome, farmCash, farmBase, loanDownStream
        })
    }
    render () {
        return (
            <div className='ipieces-pdf-container'>
                {getContent(this, 'pdfContent')}
            </div>
        )
    }
}

const purePDF = pureRender(PDF);

export default purePDF;