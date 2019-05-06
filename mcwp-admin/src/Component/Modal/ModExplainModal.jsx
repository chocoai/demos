import React, { Component } from 'react';
import { Modal } from 'antd';
import './style/modExplainModal.less';
/**
 * Modal对话框(评分说明)
 *
 * @export
 * @class ModExplainModal
 * @extends {Component}
 */
class ModExplainModal extends Component {
	constructor(props) {
		super(props); //后才能用this获取实例化对象
		this.state = {
		};
    }
    componentWillMount () {
    }
    setModalVisible () {
        this.props.closeExplainModal()
    }
	render() {
        const {mVisible, topInfo} = this.props
		return (
			<Modal
	          title="评分说明"
	          visible={mVisible}
	          footer={null}
	          onCancel={()=>this.setModalVisible()}
			  width = {560}
	          wrapClassName="modExplain-modal"
	        >
            {
                topInfo.auditStatusText == '征信审核通过' &&
                <div className='result-show'>
                    <p className='result-reason'>
                        <span>评分: {topInfo.pbocScore}</span><span>({topInfo.pbocScore < 490 ? '征信较差' : 490 <= topInfo.pbocScore && topInfo.pbocScore < 510 ? '征信一般' : 510 <= topInfo.pbocScore && topInfo.pbocScore < 530 ? '征信良好' : '征信优秀'})</span>
                    </p>
                    <p className="explain-title">央行征信评分解释</p>
                    <p className="explain-p">{topInfo.pbocScoreRsn}</p>
                    <p></p>
                </div>
            }
            {
                topInfo.auditStatusText == '初审审核通过' &&
                <div className='result-show'>
                    <p className='result-reason'>
                        <span>评分: {topInfo.orgCreditScore }</span><span>({topInfo.orgCreditScore < 450 ? '极高风险' : 450 <= topInfo.orgCreditScore && topInfo.orgCreditScore < 550 ? '较高风险' : 550 <= topInfo.orgCreditScore && topInfo.orgCreditScore < 650 ? '一般风险' : 650 <= topInfo.orgCreditScore && topInfo.orgCreditScore < 750 ? '较低风险' : '极低风险'})</span>
                    </p>
                    <p className="explain-title">初审评分解释</p>
                    <p className="explain-p">{topInfo.orgCreditScoreRsn}</p>
                </div>
            }
            {
                topInfo.auditStatusText == '综合授信审核通过' &&
                <div className='result-show'>
                    <p className='result-reason'>
                    <span>评分: {topInfo.fnlStore }</span><span>({topInfo.fnlStore < 350 ? '风险极高' : 350 <= topInfo.fnlStore && topInfo.fnlStore < 500 ? '风险较高' : 500 <= topInfo.fnlStore && topInfo.fnlStore < 650 ? '风险一般' : 650 <= topInfo.fnlStore && topInfo.fnlStore < 800 ? '风险较低' : '风险极低'})</span>
                    </p>
                    <p className="explain-title">个人综合评分解释</p>
                    <p className="explain-p">{topInfo.personZhScoreRsn}</p>
                </div>
            }
	        </Modal>
		)
	}
}

export default ModExplainModal;
