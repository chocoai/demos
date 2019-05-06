import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import { Link } from 'react-router';
import { Switch, Row } from 'antd';

import './style/validateItem.less';

class ValidateItem extends Component {
    switchRisk = (srvStatus) => { // 服务开启/关闭
        const { info, switchRisk } = this.props;
        switchRisk({code: info.code, srvStatus: srvStatus});
    }
    render(){
        const { info } = this.props;
        return (
            <Row className='validate-item'>
                <Link to={`/data/service/${info.code}`} style={{width: '80%', display: 'block'}}>
                    <div className="validate-title">{info.srvNickName}</div>
                    <div className="validate-main"><span className="intro-title">服务介绍：</span>{info.srvContent}</div>
                </Link>
                { info.srvStatus == 3 ? null : <Switch onChange={this.switchRisk} className="switch-risk" checked={info.srvStatus == 1 ? false : true } /> }
            </Row>
        )
    }
}

const pureValidateItem = pureRender(ValidateItem);

export default pureValidateItem;