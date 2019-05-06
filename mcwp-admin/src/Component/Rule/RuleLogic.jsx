import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import { Link } from 'react-router';
import { Table, Button} from 'antd';
import './style/rule.less';

/**
 * 规则库权益逻辑校验
 * @Author: 赵俊
 * @Date:   2017-07-07 
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-07-08
 */
class RuleLogic extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        const {code,type,rulePagination,ruleList,addNewRule,changeRuleTable,deleteRule}=this.props;
        const columns = [{
            title: '行业名称',
            dataIndex: 'industryText',
            key: 'industryText',
            width: 100,
        }, {
            title: '操作',
            key: 'status',
            width: 100,
            render: (text, record) => (
                <span>
                    <Link className="J_no_detail customer-handle" to={"/rule/detail/" + record.code+"?code="+code+"&type="+type}>查看</Link>
                    <span className="J_no_detail ant-divider" />
                    <Link className="J_no_detail customer-handle" to={"/rule/add/" + record.code+"?code="+code+"&type="+type}>编辑</Link>
                    <span className="J_no_detail ant-divider" />
                    <a className="J_no_detail customer-handle" onClick={deleteRule.bind(this, record)} style={{ 'color': '#f00' }}>删除</a>
                </span>
            )
        }];
        return (
            <div className="common-tab-content rule-tab-content">
                <div className="common-action-section">
                    <Button className="common-btn" onClick={addNewRule} icon="plus" type="primary">新规则</Button>
                </div>
                <Table
                    rowKey={record => record.code}
                    columns={columns}
                    dataSource={ruleList}
                    pagination={rulePagination}
                    onChange={changeRuleTable}
                    className="common-content-container"
                />
            </div>
        )
    }
}

const pureRuleLogic = pureRender(RuleLogic);

export default pureRuleLogic;