import React, { Component } from 'react'; // 引入了React
import { Link, browserHistory } from 'react-router';
import pureRender from 'pure-render-decorator';
import './style/bcrumbItem.less';

import { Breadcrumb } from 'antd';

class BcrumbItem extends Component {
    render() {
        const { bcrumb } = this.props;
        return (
            <Breadcrumb className='breadcrumb'>
                {
                    bcrumb.map((info, index)=> (
                        <Breadcrumb.Item key={index} className='breadcrumb-item'>{ info.link || info.goBack ? info.goBack? <Link onClick={()=>browserHistory.goBack()}>{info.value}</Link> : <Link to={info.link}>{info.value}</Link> : info.value }</Breadcrumb.Item>
                    ))
                }
            </Breadcrumb>
        )
    }
}

const pureBcrumbItem = pureRender(BcrumbItem);

export default pureBcrumbItem;
