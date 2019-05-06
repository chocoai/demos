import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import { Link } from 'react-router';
import { Switch,Modal } from 'antd';

import './style/riskItem.less';

class RiskItem extends Component {
    switchRisk = (srvStatus) => { // 服务开启/关闭
        const { info, switchRisk } = this.props;
        let confirm = Modal.confirm;
        if(info.srvStatus == 2) {
            confirm({
                title: '提示' ,
                content: '确认要关闭此服务吗？',
                okText: '确定',
                cancelText: '取消',
                onOk() {
                   switchRisk({code: info.code, srvStatus: srvStatus});
                }
		    });
        }else{
            switchRisk({code: info.code, srvStatus: srvStatus});
        }
    }
    render(){
        const { info } = this.props;
        return (
            <div className='risk-item'>
                <Link to={`/data/service/${info.code}`} style={{width: '80%', display: 'flex'}}>
                    <img className='risk-img' src={info.srvMLogo} alt={info.srvSupplierName} />
                    <div className='risk-content'>
                        <h3 className='risk-title'>{info.srvSupplierName}</h3>
                        <p className='risk-profit'>{info.srvNickName}</p>
                    </div>
                </Link>
                { info.srvStatus == 3 ? null : <Switch onChange={this.switchRisk} className="switch-risk" checked={info.srvStatus == 1 ? false : true } /> }
            </div>
        )
    }
}

const pureRiskItem = pureRender(RiskItem);

export default pureRiskItem;