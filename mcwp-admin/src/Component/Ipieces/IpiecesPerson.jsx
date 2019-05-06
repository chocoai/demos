import React, { Component } from 'react'; // 引入了React
import { Modal } from 'antd';
import pureRender from 'pure-render-decorator';
// import { Config } from '../../Config/Index';

import loanImg from '../../Assets/Images/icon_person_info.png';
import './style/ipiecesPerson.less';

/**
 * 进件详情人员信息
 * @Author: 赵俊
 * @Date:   2017-07-27
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-07-27
 */
class IpiecesPerson extends Component {
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
        const { loanOperatorVO } = this.props;
        return (
            <div className="ipieces-person-container">
                <p className='list-p' onClick={this.showModal}><img className='list-img' src={loanImg} alt='list' /><span className='show-list'>人员信息</span></p>
                <Modal
                    title="人员信息"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    wrapClassName = 'ipieces-person-detail'
                    width = {580}
                    >
                    {
                        loanOperatorVO.mainCustomer ?
                        <p className='person-item'>主调客户经理：{loanOperatorVO.mainCustomer}</p>
                        : null                        
                    }
                    {
                        loanOperatorVO.escortCustomer ?
                        <p className='person-item'>陪调客户经理：{loanOperatorVO.escortCustomer}</p>
                        : null                        
                    }
                    {
                        loanOperatorVO.examintor  ?
                        <p className='person-item'>审查员：{loanOperatorVO.examintor}</p>
                        : null                        
                    }
                    {
                        loanOperatorVO.creditReviewer?
                        <p className='person-item'>贷审员：{loanOperatorVO.creditReviewer}</p>
                        : null                        
                    }            
                </Modal>
            </div>
        )
    }
}

const pureIpiecesPerson = pureRender(IpiecesPerson);

export default pureIpiecesPerson;