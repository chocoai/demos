import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import './style/DataHeader.less';

import { Card } from 'antd';

/**
 * 数据分析-数据概况
 * @props {taskSituation} 用户的数据情况
 */
class DataHeader extends Component {
    render(){
        const { data} = this.props;
        return (
            <div className="DAHeader-container">
                <Card>
                    <p className='header-item'>总授信笔数</p>
                    <p className='header-money'>{data && data.creditCounts ? data.creditCounts : 0}</p>
                </Card>                      
                <Card>
                    <p className='header-item'>总授信金额（万元）</p>
                    <p className='header-money'>{data && data.creditMoneys ? data.creditMoneys : 0}</p>
                </Card>                      
                <Card>
                    <p className='header-item'>总放款笔数</p>
                    <p className='header-money'>{data && data.loanCounts ? data.loanCounts : 0}</p>
                </Card>                      
                <Card>
                    <p className='header-item'>总放款金额（万元）</p>
                    <p className='header-money'>{data && data.loanMoneys ? data.loanMoneys : 0}</p>
                </Card>                      
                <Card>
                    <p className='header-item'>预计总利息（万元）</p>
                    <p className='header-money'>{data && data.interests ? data.interests : 0}</p>
                </Card>     
            </div>                 
        )
    }
}
const Main = pureRender(DataHeader);

export default Main;