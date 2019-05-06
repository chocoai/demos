import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import { Row, Col, Card } from 'antd';

import './style/situationItem.less';

/**
 * 获取任务执行情况
 * @props {taskSituation} 任务执行情况
 */
class SituationItem extends Component {
    render(){
        const { taskSituation } = this.props;
        const bodyStyle = {
        	height: '96px',
        	textAlign: 'center',
            paddingLeft:'4px',
            paddingRight: '4px'
        };
        return (
            <Row className="task-situation">
                <Col span={6} style={bodyStyle}>
                    <Card bordered={false}>
                        <p>{taskSituation.unCompletedTaskNum}</p>
                        <p>待完成任务</p>
                    </Card>                      
                </Col>
                <Col span={6} style={bodyStyle}>
                    <Card bordered={false}>
                        <p className={`${taskSituation.delayTaskNum > 0 ? 'remind' : ''}`}>{taskSituation.delayTaskNum}</p>
                        <p>延期任务</p>
                    </Card>                      
                </Col>
                <Col span={6} style={bodyStyle}>
                    <Card bordered={false}>
                        <p>{taskSituation.completedTaskNum}</p>
                        <p>已完成任务</p>
                    </Card>                      
                </Col>
                <Col span={6} style={bodyStyle}>
                    <Card bordered={false}>
                        <p>{taskSituation.taskNum}</p>
                        <p>任务总数</p>
                    </Card>                      
                </Col>
            </Row>
        )
    }
}

const Main = pureRender(SituationItem);

export default Main;