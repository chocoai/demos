import React, { Component } from 'react'; // 引入了React
import { Link, browserHistory } from 'react-router';
import pureRender from 'pure-render-decorator';
import { Config } from '../../Config/Index';
import moment from 'moment';
import IpiecesService from '../../Services/IpiecesService';

import './style/ipiecesBreadcrumb.less';

import { Breadcrumb, Popover, message, DatePicker, Select, Modal, Button, Radio, Row, Col } from 'antd';
const Option = Select.Option;
const RadioGroup = Radio.Group;

class IpiecesBreadcrumb extends Component {
    constructor(props) {
        super(props)
        this.state = {
            code: props.code,
            taskPerson: [],             // 任务分配人
            createTaskParams: {},      // 创建任务入参
            editTaskParams: {},        // 编辑任务入参
            getTaskDetail: {},         // 获取任务详情
            interveneModal: false,      // 人工干预
            interveneReason: '',
            interveneModalKey: 100,
        }
    }
    componentWillMount() {
        this.getTaskPerson()
    }
    // 获取任务执行人
    getTaskPerson() {
        Config.get('/v1/user/role/select', {}, (res) => {
            if (res.code == Config.errorCode.success) {
                this.setState({
                    taskPerson: res.data,
                });
            } else {
                message.error(res.msg);
            }
        });
    }
    handleChange = (value, label) => {    //修改任务执行人
        let state = this.state;
        let ownerName = '';
        const { taskPerson, createTaskParams, code } = state;
        const { type } = this.props
        taskPerson.map((result) => {
            if (result.userId == value.key) {
                ownerName = result.name;
            }
        })
        if (value) {
            createTaskParams.owner = value.key;
            createTaskParams.ownerName = ownerName;
        } else {
            delete createTaskParams.owner;
            delete createTaskParams.ownerName;
        }
        this.setState({
            createTaskParams: createTaskParams,
            selectPerson: value.key,
            ownerName: ownerName
        });
        // 特殊处理
        if (Config.ipiecesShow.ipiecesBreadcrumb.includes(+type)) {
            let params = {
                code,
                owner: value.key
            }
            Config.put('/v1/assign', params, (res) => {   // 编辑任务
                if (res.code == Config.errorCode.success) {
                    message.success('编辑任务成功！');
                } else {
                    message.error(res.msg);
                }
            });
        } else {
            let params = {
                code: this.state.taskCode,
                owner: value.key,
                ownerName: ownerName
            }
            Config.put('/v1/task', params, (res) => {   // 编辑任务
                if (res.code == Config.errorCode.success) {
                    message.success('编辑任务成功！');
                } else {
                    message.error(res.msg);
                }
            });
        }
    }
    changeTaskInfo = (value, dateString) => {  //时间改变回调函数
        let createTaskParams = this.state.createTaskParams;  // 截止时间
        let expiryDate = value;
        if (expiryDate) {
            createTaskParams.expiryDate = expiryDate;
        } else {
            delete createTaskParams.expiryDate;
        }
        this.setState({
            createTaskParams: createTaskParams,
            selectDate: value
        });
        let StrTime = Config.formatStrTime(dateString);
        let params = {
            code: this.state.taskCode,
            dateString: dateString,
            expiryDate: StrTime
        }
        Config.put('/v1/task', params, (res) => {   // 编辑任务
            if (res.code == Config.errorCode.success) {
                message.success('编辑任务成功！');
            } else {
                message.error(res.msg);
            }
        });
    }

    popVisibleCallback = (visible) => {
        const that = this;
        const { type, code } = this.props
        const { taskPerson } = this.state
        if (visible) {  // 打开气泡卡片
            this.getTaskPerson(); // 获取任务执行人
            if (Config.ipiecesShow.ipiecesBreadcrumb.includes(+type)) {
                Config.get('/v1/assign', { code }, (res) => {   // 获取任务分配信息
                    if (res.code == Config.errorCode.success) {
                        let name = taskPerson.filter(i => i.userId == res.data)[0]
                        that.setState({
                            getTaskDetail: {
                                owner: res.data,
                                ownerName: name && name['name'] || ''
                            },
                            // selectDate: res.data.expiryDate || '',
                            selectPerson: res.data || '',
                            ownerName: name && name['name'] || '',
                            // taskCode: res.data.code,
                            visible: visible
                        });
                    } else {
                        message.error(res.msg);
                    }
                });
            } else {
                Config.get('/v1/taskDetail', { reqCode: code }, (res) => {   // 获取任务分配信息
                    if (res.code == Config.errorCode.success) {
                        that.setState({
                            getTaskDetail: res.data,
                            selectDate: res.data.expiryDate || '',
                            selectPerson: res.data.owner || '',
                            ownerName: res.data.ownerName || '',
                            taskCode: res.data.code,
                            visible: visible
                        });
                    } else {
                        message.error(res.msg);
                    }
                });
            }
        } else {
            that.setState({
                visible: visible
            })
        }
    }
    // 人工干预
    showIntervene = () => {
        this.setState({
            interveneModal: true
        });
    }
    approvalIntervene = () => {
        let that = this
        const { code, interveneReason, interveneModalKey } = that.state
        if (!interveneReason) {
            message.error('请输入人工干预原因');
            return
        }
        let params = {
            code: code,
            reason: interveneReason
        }
        IpiecesService.postIoanIntervene(params, (res) => {
            if (res.code == Config.errorCode.success) {
                message.success('人工干预成功');
                that.setState({
                    interveneModal: false,
                    interveneReason: '',
                    interveneModalKey: interveneModalKey + 1
                });
                that.props.getTopInfo(code)
                // that.updataIpiecesIndex()
            } else {
                message.error(res.msg);
            }
        })
    }
    entryReason = (e) => {
        if (e.target.value.length > 256) {
            e.target.value = e.target.value.slice(0, 256);
        }
        this.setState({
            interveneReason: e.target.value
        });
    }
    closeModal = (name) => {
        const { interveneModalKey } = this.state
        this.setState({
            [name]: false,
            interveneReason: '',
            interveneModalKey: interveneModalKey + 1
        });
    }
    disabledExpiryDate = (current) => {  // 禁用任务截止日期
        return current && current.valueOf() < Date.now();
    }
    //查看授权合同
    download = (e) => {
        const { topInfo } = this.props;
        e.target.href = Config.target + '/comm/contract/down/' + topInfo.contractCode
    }
    downloadReport = (e) => {
        const { code } = this.state
        e.target.href = Config.target + '/comm/export/down/excel?code=' + code
    }
    //添加导出文件
    export = () => {
        const { code } = this.state
        let params = {
            code
        }
        Config.get('/v1/loan/export', params, (res) => {   // 创建任务
            if (res.code == Config.errorCode.success) {
                message.success('进行导出');
            } else {
                message.error(res.msg);
            }
        });
    }
    creditCheck(e, type, code) {
        if (type == '6') {
            browserHistory.push('/ipieces/detail/personal/' + code)
        } else {
            browserHistory.push('/ipieces/details/' + code)
        }
    }
    showMortgage(name) {
        this.setState({
            [name]: true
        });
    }
    doMortgageModal = () => {
        let that = this
        const { code } = that.state
        let params = {
            code: code
        }
        IpiecesService.postDoMortgage(params, (res) => {
            if (res.code == Config.errorCode.success) {
                message.success('办理完成');
                browserHistory.push('/ipieces/operate')
            } else {
                message.error(res.msg);
            }
        })
    }
    finishMortgageModal = () => {
        let that = this
        const { code } = that.state
        let params = {
            code: code
        }
        IpiecesService.postFinishMortgage(params, (res) => {
            if (res.code == Config.errorCode.success) {
                message.success('抵押完成');
                browserHistory.push('/ipieces/operate')
            } else {
                message.error(res.msg);
            }
        })
    }
    changeInput = (inp, e, value) => { // input值变化
        this.setState({
            [inp]: e.target.value
        });
    }
    changeRadio(e) {
        const value = e.target.value,
            ddtext = e.target.ddtext,
            reasonOtherContent = this.reasonOtherContent;
        if (ddtext == '其他') {
            reasonOtherContent.style.display = 'inline-block';
        } else {
            reasonOtherContent.style.display = 'none';
        }
        this.setState({
            rejectReason: value
        });
    }
    approvalReject = () => {
        const { code, rejectReason, rejectReasonOther, type } = this.state;
        if (!rejectReason) return message.error('请选择撤销贷款原因');
        if (rejectReason == 15 && !rejectReasonOther) return message.error('请输入其他原因')
        if (rejectReason == 15 && rejectReasonOther.length > 64) return message.error('其他原因不能超过64个字')
        const params = {
            code: code,
            rejectReason: rejectReason,
            rejectReasonOther: rejectReason == 15 ? rejectReasonOther : ''
        };
        this.setState({
            closeModalLoading: true
        })
        Config.post('/v1/loan/cancel', params, (res) => {
            if (res.code == Config.errorCode.success) {
                message.success(res.msg);
                browserHistory.push('/ipieces/operate');
            } else {
                this.setState({
                    closeModalLoading: false
                })
                message.error(res.msg)
            }
        })
    }
    render() {
        const { bcrumb, topInfo, action, type, spjjyy, closeModalLoading,openUploadImg } = this.props;
        const { finishMortgageModal, doMortgageModal, cancelLoanModal, interveneReason, visible, getTaskDetail, taskPerson, ownerName, selectDate, interveneModal, code } = this.state
        let operateButton = topInfo.operateButton
        const taskContent = (
            <div>
                <p>将任务分配给</p>
                {
                    getTaskDetail && getTaskDetail.ownerName ?
                        <Select
                            showSearch
                            labelInValue
                            style={{ width: '160px' }}
                            placeholder="选择成员"
                            optionFilterProp="children"
                            onChange={this.handleChange}
                            defaultValue={{ key: getTaskDetail.ownerName + '' }}
                            filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            getPopupContainer={trigger => trigger.parentNode}
                        >
                            {
                                taskPerson.map((item) => (
                                    <Option className={item.userName == ownerName ? 'ant-select-dropdown-menu-item-selected' : ''} key={item.userId} value={item.userId + ""}>{item.name}</Option>
                                ))
                            }
                        </Select>
                        : <Select
                            showSearch
                            labelInValue
                            style={{ width: '160px' }}
                            placeholder="选择成员"
                            optionFilterProp="children"
                            onChange={this.handleChange}
                            getPopupContainer={trigger => trigger.parentNode}
                        >
                            {
                                taskPerson.map((item) => (
                                    <Option className={item.userName == ownerName ? 'ant-select-dropdown-menu-item-selected' : ''} key={item.userId} value={item.userId + ""}>{item.name}</Option>
                                ))
                            }
                        </Select>
                }
                {
                    !(Config.ipiecesShow.ipiecesBreadcrumb.includes(+type)) && <p>任务截止日期至</p>
                }
                {
                    !(Config.ipiecesShow.ipiecesBreadcrumb.includes(+type)) && <DatePicker
                        value={selectDate ? moment(selectDate) : null}
                        style={{ width: '160px' }}
                        format="YYYY-MM-DD"
                        disabledDate={this.disabledExpiryDate}
                        onChange={this.changeTaskInfo}
                        getCalendarContainer={trigger => trigger.parentNode}
                    />
                }
            </div>
        );
        const buttonArr = [
            {
                name: 'assign_task',
                content:
                    <Popover key='popver' content={taskContent} placement="leftTop" trigger="click" visible={visible} onVisibleChange={this.popVisibleCallback} getPopupContainer={triggerNode => triggerNode.parentNode}>
                        <span key='assign_task' className="button-ipieces">分配</span>
                    </Popover>
            },
            {
                name: 'manual_intervene',
                content: <span className="button-ipieces" key="manual_intervene" onClick={this.showIntervene}>人工干预</span>
            },
            {
                name: 'download_protocol',
                content: <span className="button-ipieces" key="download_protocol"><Link className="bread-link" onClick={this.download}>下载协议</Link></span>
            },
            {
                name: 'credit_query',
                content: <span className="button-ipieces" key="credit_query"><Link className="bread-link" onClick={(e) => this.creditCheck(e, topInfo.prdType, code)}>征信调查</Link></span>
            },
            {
                name: 'edit',
                content: <span className="button-ipieces" key="edit"><Link className="bread-link" to={`/ipieces/edit/${code}/${topInfo.prdType}`}>编辑</Link></span>
            },
            {
                name: 'examine',
                content: <span className="button-ipieces" key="examine"><Link className="bread-link" to={`/ipieces/operate/${code}/${topInfo.prdType}/check`}>审查</Link></span>
            },
            {
                name: 'audit',
                content: <span className="button-ipieces" key="audit"><Link className="bread-link" to={`/ipieces/operate/${code}/${topInfo.prdType}/approve`}>审批</Link></span>
            },
            {
                name: 'replenish_data',
                content: <span className="button-ipieces" key="replenish_data" onClick={() => openUploadImg(Config.bizType.loanPersonReplenishData)}>补充信息</span>
            },
            {
                name: 'cancel_loan',
                content: <span className="button-ipieces" key="cancel_loan" onClick={() => this.showMortgage('cancelLoanModal')}>撤销贷款</span>
            },
            {
                name: 'do_mortgage',
                content: <span className="button-ipieces" key="do_mortgage" onClick={() => this.showMortgage('doMortgageModal')}>办理抵押</span>
            },
            {
                name: 'finish_mortgage',
                content: <span className="button-ipieces" key="finish_mortgage" onClick={() => this.showMortgage('finishMortgageModal')}>抵押完成</span>
            },
            {
                name: 'export',
                content: <span className="button-ipieces" key="export" onClick={this.export}>导出</span>
            },
            {
                name: 'download_report',
                content: <span className="button-ipieces" key="download_report"><Link className="bread-link" onClick={this.downloadReport}>下载报告</Link></span>
            }
        ]
        return (
            <div className="breadcrumb-container">
                <Breadcrumb className='breadcrumb'>
                    {
                        bcrumb.map((info, index) => (
                            <Breadcrumb.Item key={`Breadcrumb${index}`} className='breadcrumb-item'>{info.link || info.goBack ? info.goBack ? <Link onClick={() => browserHistory.goBack()}>{info.value}</Link> : <Link to={info.link}>{info.value}</Link> : info.value}</Breadcrumb.Item>
                        ))
                    }
                </Breadcrumb>
                <div className="button-wrapper">
                    {
                        operateButton && action != 'approve' && action != 'check' ?
                            buttonArr.filter((item, index) => (operateButton.includes(item.name))).map(item => item.content) : null
                    }
                </div>
                <Modal
                    visible={interveneModal}
                    className='intervene-modal'
                    width={400}
                    onCancel={this.closeModal.bind(this, 'interveneModal')}
                    title="干预原因"
                    key={this.state.interveneModalKey}
                    footer={null}
                >
                    <div className='model-list'>
                        <span className='reback-reason'>干预原因</span>
                        <textarea className="reason-content" placeholder="请输入干预原因" onChange={this.entryReason}></textarea>
                        <span className='reason-content-foot'>{interveneReason.length}/256</span>
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <Button key="ok" type="primary" size="large" onClick={this.approvalIntervene}>确定</Button>
                        <Button key="cancel" size="large" style={{ marginLeft: '20px' }} onClick={this.closeModal.bind(this, 'interveneModal')}>取消</Button>,
                    </div>
                </Modal>
                <Modal
                    visible={doMortgageModal}
                    // className='intervene-modal'
                    width={400}
                    onCancel={this.closeModal.bind(this, 'doMortgageModal')}
                    title="办理抵押"
                    key='doMortgageModal'
                    footer={null}
                >
                    <div className='model-list'>
                        <p style={{ textAlign: 'center' }}>确认房产正在办理抵押吗？</p>
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <Button key="ok" type="primary" size="large" onClick={this.doMortgageModal}>确定</Button>
                        <Button key="cancel" size="large" style={{ marginLeft: '20px' }} onClick={this.closeModal.bind(this, 'doMortgageModal')}>取消</Button>,
                    </div>
                </Modal>
                <Modal
                    visible={finishMortgageModal}
                    // className='intervene-modal'
                    width={400}
                    onCancel={this.closeModal.bind(this, 'finishMortgageModal')}
                    title="抵押完成"
                    key='finishMortgageModal'
                    footer={null}
                >
                    <div className='model-list'>
                        <p style={{ textAlign: 'center' }}>确认房产抵押已经办理成功了吗？</p>
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <Button key="ok" type="primary" size="large" onClick={this.finishMortgageModal}>确定</Button>
                        <Button key="cancel" size="large" style={{ marginLeft: '20px' }} onClick={this.closeModal.bind(this, 'finishMortgageModal')}>取消</Button>,
                    </div>
                </Modal>
                <Modal
                    visible={cancelLoanModal}
                    className='rejects-modal'
                    onCancel={this.closeModal.bind(this, 'cancelLoanModal')}
                    key='cancelLoanModal'
                    confirmLoading={closeModalLoading}
                    title="拒绝原因"
                    footer={[
                        <Button key="cancel" className='reback-button' size="large" onClick={this.closeModal.bind(this, 'cancelLoanModal')}>取消</Button>,
                        <Button key="ok" className='reback-button' type="primary" size="large" onClick={this.approvalReject}>确定</Button>
                    ]}
                >
                    <RadioGroup onChange={(e) => { this.changeRadio(e) }}>
                        <Row>
                            {
                                spjjyy ? spjjyy.map((info, index) => (
                                    info.ddText == '其他' ?
                                        <Col key={index} span={24} style={{ padding: '15px 0' }}>
                                            <Radio ddtext={info.ddText} value={info.ddValue}>{info.ddText}</Radio><input ref={ref => { this.reasonOtherContent = ref }} className="ant-input" onChange={this.changeInput.bind(this, 'rejectReasonOther')} style={{ width: '80%', marginLeft: '20px', display: 'none' }} placeholder="请输入授信拒绝原因" />
                                        </Col> :
                                        <Col key={index} span={12} style={{ padding: '15px 0' }}>
                                            <Radio value={info.ddValue}>{info.ddText}</Radio>
                                        </Col>
                                )) : null
                            }
                        </Row>
                    </RadioGroup>
                </Modal>
            </div>
        )
    }
}

const pureIpiecesBreadcrumb = pureRender(IpiecesBreadcrumb);

export default pureIpiecesBreadcrumb;
