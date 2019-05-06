import React, { Component } from 'react'; // 引入了React
import { Modal } from 'antd';
import pureRender from 'pure-render-decorator';
import { Config } from '../../Config/Index';

import loanImg from '../../Assets/Images/icon_approval-record.png'
// import ExplainImg from './../../Assets/Images/icon_explain.png';
import { Timeline  } from 'antd';
import './style/detailLoanApproval.less';

/**
 * 借款详情审批信息
 * @Author: 钟观发
 * @Date:   2018-01-24
 * @Last Modified by:   钟观发
 * @Last Modified time: 2018-01-24
 */
class DetailLoanApproval extends Component {
    constructor(props) {
        super(props);
        this.state = {
          visible: false
        }
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    handleOk = () => {
        this.setState({
            visible: false,
        });
    }
    handleCancel = () => {
        this.setState({
            visible: false,
        });
    }
    render() {
        const { loanAuditVOList } = this.props;
        return (
            <div className="detail-loanAudit-container">
                <p><span onClick={this.showModal}><img className='list-img' src={loanImg} alt='list' /><span className='show-list'>审批记录</span></span></p>
                <Modal
                    title="审批记录"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    wrapClassName = 'loanAudit-container'
                    width = {580}
                    >
                    <Timeline className='audit-container'>
                        {
                          loanAuditVOList.length > 0 ?
                            loanAuditVOList.map((item, index) => (
                              <Timeline.Item key={index}>
                                <div className="audit-list">
                                    <span className='audit-time'>{Config.formatDateTime(item.operateDate)}</span>
                                </div>
                                <div className="audit-list">
                                    <span className="audit-left">{item.event}：{item.operatePeople}</span>
                                    <span className="audit-right">结果：{item.eventResult}</span>
                                </div>
                                {
                                    item.descr ?
                                    <div className="audit-list">
                                        <span className="audit-p">{item.descr}</span>
                                    </div> : null
                                }
                              </Timeline.Item> 
                            ))
                          : null
                        }
                    </Timeline>
                </Modal>
            </div>
        )
    }
}

const pureDetailLoanApproval = pureRender(DetailLoanApproval);

export default pureDetailLoanApproval;