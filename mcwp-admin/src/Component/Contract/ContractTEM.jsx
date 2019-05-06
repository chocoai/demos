import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import { Config } from '../../Config/Index';
import { Link } from 'react-router';
import './style/contractTem.less';

import { Pagination, Modal, Card, Col, Row, message, Switch } from 'antd';
const confirm = Modal.confirm;
/**
 * 消息模版
 * @Author: 赵俊
 * @Date:   2017-08-07
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-08-07
 */
class ContractTEM extends Component {
    constructor(props) {
        super(props);
        this.state = {
            codes: '',
            key: 0,
            ContractTEMList: [],
            noHovering: '',
            pagination: {
                showSizeChanger: true, // 是否可以改变 pageSize
                showQuickJumper: true, // 是否可以快速跳转至某页
                pageSizeOptions: ['5', '10', '15'],// 指定每页可以显示多少条
                total: 0,
                showTotal: (total, range) => `共  ${total}  条`,
                visible: false //模态款控制
            },
            params: {
                page: 1,
                rows: 10
            },
        };
    }
    componentDidMount() {
    }
    // onChangePage = (page, pageSize) => {
    //     let curPage = page;
    //     // params.startTime = this.props.startTime ? this.props.startTime.format('YYYY-MM-DD') : '';
    //     // params.endTime = this.props.endTimethis.props.endTime.format('YYYY-MM-DD');
    //     const { getContractTEMList } = this.props;
    //     if (this.state.key == 0) {
    //         getContractTEMList('', "ContractTEMList", curPage, '')
    //     } else if (this.state.key == 1) {
    //         getContractTEMList(this.state.key, "allCredit", curPage, '')
    //     } else {
    //         getContractTEMList(this.state.key, "allLoad", curPage, '')
    //     }
    // }
    // onChangeSize = (current, size) => {
    //     let curRows = size;
    //     const { getContractTEMList } = this.props;
    //     let { online, underline } = this.state;
    //     if (this.state.key == 0) {
    //         getContractTEMList(this.state.key, "ContractTEMList", '', curRows)
    //     } else if (this.state.key == 1) {
    //         getContractTEMList(this.state.key, "allCredit", '', curRows)
    //     } else {
    //         getContractTEMList(this.state.key, "allLoad", '', curRows)
    //     }
    // }
    //切换tab切换分页
    // paginationItems = (data) => {
    //     if (data) {
    //         return (
    //             <Pagination total={data.length} showTotal={(total, range) => `共  ${total}  条`}
    //                 style={{ float: 'none', display: 'table', margin: '16px auto' }} onChange={this.onChangePage} onShowSizeChange={this.onChangeSize} showSizeChanger showQuickJumper />
    //         )
    //     } else {
    //         return (
    //             <p className="nodata"><span className="anticon anticon-frown-o"></span>暂无数据</p>
    //         )
    //     }
    // }
    enable = (id, status) => { //合同模板、禁用、启用
        let that = this;
        if (!status) {
            let params = {
                tplCode: id,
                op: 0
            }
            confirm({
                title: '提示',
                content: '禁用后合同模板将失效，确认要禁用吗',
                okText: '确定',
                cancelText: '取消',
                onCancel() {
                },
                onOk() {
                    that.closeSwitch(params)
                },
            });
        } else {
            let params = {
                tplCode: id,
                op: 1
            }
            that.closeSwitch(params)
        }
    }
    closeSwitch = (params) => {
        let that = this;
        const { getTplIsOpen } = that.props;
        Config.put('/v1/contract/tpl/operate', params, (res) => {
            if (res.code == Config.errorCode.success) {
                getTplIsOpen()
            } else {
                message.error(res.msg);
            }
        });
    }
    // 合同关闭开启
    selectChange(checked, type) {
        let that = this;
        let { online, underline } = this.props;
        let name = type == 'online' ? '电子合同' : '线下合同';
        let tpl = type == 'online' ? 1 : 2;
        if ((!online) && (!underline)) {
            confirm({
                title: '提示',
                content: `确认要开启${name}服务吗？`,
                okText: '确定',
                cancelText: '取消',
                onCancel() {
                },
                onOk() {
                    that.props.postTplIsOpen({ type: tpl, isopen: true })
                },
            });
        } else {
            if (!checked) {
                confirm({
                    title: '提示',
                    content: `确认要关闭${name}服务吗？`,
                    okText: '确定',
                    cancelText: '取消',
                    onCancel() {
                    },
                    onOk() {
                        that.props.postTplIsOpen({ type: tpl, isopen: false })
                    },
                });
            } else {
                confirm({
                    title: '提示',
                    content: `确认要同时开启${name}服务吗？`,
                    okText: '确定',
                    cancelText: '取消',
                    onCancel() {
                    },
                    onOk() {
                        that.props.postTplIsOpen({ type: tpl, isopen: true })
                    },
                });
            }
        }
    }
    // 预览
    preview(e, path) {
        if (path.lastIndexOf('.docm') >= 0) {
            path = path.substr(0, path.length - 1);
        }
        e.target.href = 'https://view.officeapps.live.com/op/view.aspx?src=' + path
    }
    render() {
        let { online, underline } = this.props;
        let { ContractTEMListOn, ContractTEMListUnder } = this.props
        return (
            <div className="common-content-container contractTEM-container">
                <Row className='contractTEM-content'>
                    <Col span={6}>
                        开启电子合同服务
                        <Switch checked={online} onChange={(checked) => this.selectChange(checked, 'online')} />
                    </Col>
                </Row>
                <div>
                    {ContractTEMListOn && ContractTEMListOn.length > 0 ? <Row gutter={16}>
                        {ContractTEMListOn.map((item, index) => (
                            <Col key={index} span={6} className="card-col">
                                <Card bordered={false}>
                                    <div className="card-content">
                                        {(!online)? <div className="card-action">
                                            <Link className="card-a card-unable">编辑</Link>
                                            {item.status == 1 ?
                                                <Link className="card-a card-stop card-unable">禁用</Link> :
                                                <Link className="card-a card-unable">启用</Link>
                                            }
                                        </div> : <div className="card-action">
                                                <Link className="card-a" to={"/contract/edit/" + item.code}>编辑</Link>
                                                {item.status == 1 ?
                                                    <Link className="card-a card-stop" onClick={() => this.enable(item.code, 0)}>禁用</Link> :
                                                    <Link className="card-a" onClick={() => this.enable(item.code, 1)}>启用</Link>
                                                }
                                            </div>}
                                    </div>
                                    <p className="card-title">{item.tplName}</p>
                                </Card>
                            </Col>
                        ))}
                    </Row> : null}
                </div>
                <Row className='contractTEM-content'>
                    <Col span={6}>
                        开启线下合同服务
                        <Switch checked={underline} onChange={(checked) => this.selectChange(checked, 'underline')} />
                    </Col>
                </Row>
                <div>
                    {ContractTEMListUnder && ContractTEMListUnder.length > 0 ? <Row gutter={16}>
                        {ContractTEMListUnder.map((item, index) => (
                            <Col key={index} span={6} className="card-col">
                                <Card bordered={false}>
                                    <div className="card-content">
                                        <div className="card-action">
                                            <Link className="card-a" target='_blank' onClick={(e) => this.preview(e, item.tplContent)}>预览</Link>
                                            <Link className="card-a" href={item.tplContent}>下载</Link>
                                        </div>
                                    </div>
                                    <p className="card-title">{item.tplName}</p>
                                </Card>
                            </Col>
                        ))}
                    </Row> : null}
                </div>
            </div>
        );
    }
}

const pureContractTEM = pureRender(ContractTEM);

export default pureContractTEM;
