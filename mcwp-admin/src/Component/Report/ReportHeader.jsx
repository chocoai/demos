import React, { Component } from 'react'; // 引入了React
import { Row, Col, Card } from 'antd';

class ReportHeader extends Component {
    render(){
        // const { data } = this.props;
        const bodyStyle = {
        	height: '96px',
        	textAlign: 'center',
            paddingLeft:'4px',
            paddingRight: '4px'
        };
        return (
            <div className='header-container'>
                <Row className="report-header">
                    <Col span={6} style={bodyStyle}>
                        <Card bordered={false}>
                            <p>100</p>
                            <p>总服务时间</p>
                        </Card>                      
                    </Col>
                    <Col span={6} style={bodyStyle}>
                        <Card bordered={false}>
                            <p>200</p>
                            <p>总服务次数</p>
                        </Card>                      
                    </Col>
                    <Col span={6} style={bodyStyle}>
                        <Card bordered={false}>
                            <p>300</p>
                            <p>数据三</p>
                        </Card>                      
                    </Col>
                    <Col span={6} style={bodyStyle}>
                        <Card bordered={false}>
                            <p>400</p>
                            <p>数据四</p>
                        </Card>                      
                    </Col>
                </Row>
            </div>
        )
    }
}

export default ReportHeader;
