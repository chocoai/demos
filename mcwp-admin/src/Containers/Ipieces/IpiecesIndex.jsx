/**
 * 进件产品列表页
 * @Author: 朱亚珍
 * @Date:   2017-05-27
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-06-29
 */
import React, { Component } from 'react'; // 引入了React
// import ReactDOM from 'react-dom';
import { Config } from '../../Config/Index';
import { is, fromJS } from 'immutable';
import './style/ipiecesIndex.less';
import ResetSearch from './../../Component/Common/ResetSearch';
import BaseService from '../../Services/BaseService';
import moment from 'moment';
import { Link } from 'react-router';
// import PDF from '../../Component/Ipieces/PDF/PDF';
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
import loanCancelImg from '../../Assets/Images/img_loan_cancel.png';
import { Form, Table, Button, Input, Spin, message, DatePicker, Select, TreeSelect } from 'antd';
const Search = Input.Search;
const Option = Select.Option;

/* 以类的方式创建一个组件 */
class Ipieces extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,            // 分配任务弹框是否可见
            loading: false,
            pagination: {
                showSizeChanger: true, // 是否可以改变 pageSize
                showQuickJumper: true, // 是否可以快速跳转至某页
                total: 0,
                showTotal: (total, range) => `共  ${total}  条`,
                pageSizeOptions: ['5', '10', '15'] // 指定每页可以显示多少条
            },
            params: {
                page: 1,
                rows: 10
            },
            ipiecesInfo: [],           // 进件列表信息
            startValue: null,          // 搜索开始时间
            endValue: null,            // 搜索结束时间
            dictCode: "spzt,dczt,yxqdlb",   // 要获取的字典值
            dateKey: null,
            yxqdlbValue: null,
            zhwdList:null,//网点字典
        };
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
    }
    componentWillMount() {
        const { params } = this.state
        this.getIpiecesList(params);  // 获取进件列表
    }
    componentDidMount() {
        // 获取字典值
        this.getDictItem()
        this.getProductDict({ddItem:'cplx'})
        // 获取产品名称
        this.getProName()
        // 获取渠道
        this.getChannelList()
        // 获取任务执行人
        this.getTaskPerson()
        // 获取小组
        this.getTeamList()
        // 获取支行网点
        this.getBranchItems()
    }
    // 获取支行网点
    getBranchItems(){
        Config.get('/comm/bw/v1/branch/list', {enterpriseCode: Config.localItem('ENTERP_CODE')}, (res) => {
            if (res.code == Config.errorCode.success) {
                let tmpArr = []
                res.data.map(i => {
                    i.label = i.bankName
                    i.value = i.code
                    i.key = i.code
                    tmpArr.push(i)
                })
                this.setState({
                    zhwdList: tmpArr
                });
            } else {
                message.error(res.msg);
            }
        });
    }
    // 获取渠道
    getChannelList() {
        Config.get('/v1/channelType/channelType', {}, (res) => {
            this.setState({ loading: false });
            if (res.code == Config.errorCode.success) {
                let tmpArr = []
                res.data.sort((i1, i2) => i1.index - i2.index).map(i => {
                    if (i.dictDTOS && i.dictDTOS.length) {
                        i.dictDTOS.map(i => {
                            i.label = i.ddText
                            i.value = i.ddValue
                            i.key = i.ddValue
                            tmpArr.push(i)
                        })
                    }
                })
                tmpArr.push({
                    label: '公共进件',
                    value: '-1',
                    key: '-1'
                },{
                    label: '自主营销',
                    value: '-2',
                    key: '-2'
                })
                this.setState({
                    yxqdlb: tmpArr
                });
            } else {
                message.error(res.msg);
            }
        })
    }
    // 获取有权限的客户经理
    getTaskPerson() {
        Config.get('/v1/user/role/select', {hasNull: true}, (res) => {
            if (res.code == Config.errorCode.success) {
                let tmpArr = []
                res.data.map(i => {
                    i.label = i.name
                    i.value = i.code
                    i.key = i.name
                    tmpArr.push(i)
                })
                this.setState({
                    taskPerson: tmpArr
                });
            } else {
                message.error(res.msg);
            }
        });
    }
    // 获取小组列表
    getTeamList() {
        Config.get('/v1/team/team/list', {}, (res) => {
            if (res.code == Config.errorCode.success) {
                let tmpArr = []
                res.data.map(i => {
                    i.label = i.teamName
                    i.value = i.code
                    i.key = i.code
                    tmpArr.push(i)
                })
                this.setState({
                    teamList: tmpArr
                });
            } else {
                message.error(res.msg);
            }
        });
    }
    getIpiecesList = (params) => {   // 获取进件列表
        this.setState({ loading: true });
        //进件管理，获取状态
        Config.get('/v1/loan/reqs', params, (res) => {
            this.setState({ loading: false });
            if (res.code == Config.errorCode.success) {
                const pagination = { ...this.state.pagination };
                pagination.total = res.recordsTotal; // 总页数
                pagination.current = params.page; // 当前页数
                let ipiecesInfo = res.data;
                this.setState({
                    ipiecesInfo: ipiecesInfo, //存数据
                    pagination
                });
            } else {
                message.error(res.msg);
            }
        });
    }
    changeTable = (pagination) => { // 分页、排序、筛选变化时触发
        let params = this.state.params;
        params.page = pagination.current;
        params.rows = pagination.pageSize;
        this.getIpiecesList(params);
    }
    getProductDict(params) { // 根据字典代码,企业编码获取字典列表
        const that = this;
        BaseService.getProductDict(params, (res) => {
            if (res.code == Config.errorCode.success) {
                that.setState({
                    cplx: res.data.cplx
                });
            } else {
                message.error(res.msg);
            }
        })
    }
    // 获取字典值
    getDictItem = () => {
        const that = this
        const { dictCode: code } = this.state
        Config.get('/comm/sys/dict/items', { code }, (res) => {
            if (res.code == Config.errorCode.success) {
                // todo 以后数据量过大优化，对yxqdlb做处理
                // res.data.yxqdlb = res.data.yxqdlb.map(i => {
                //     i.label = i.ddText
                //     i.value = i.ddValue
                //     i.key = i.index
                //     if (i.dictDTOS && i.dictDTOS.length) {
                //         i.children = i.dictDTOS.map(i => {
                //             i.label = i.ddText
                //             i.value = i.ddValue
                //             i.key = i.index
                //             return i
                //         })
                //     }
                //     return i
                // })
                that.setState({
                    spzt: res.data.spzt,
                    dczt: res.data.dczt,
                    // yxqdlb: res.data.yxqdlb
                })
            } else {
                message.error(res.msg);
            }
        });
    }
    getProName = () => {
        const that = this
        Config.get('/v1/prod/name', {}, (res) => {
            if (res.code == Config.errorCode.success) {
                if (Array.isArray(res.data)) res.data = [...new Set(res.data)]
                that.setState({
                    prdName: res.data || []
                })
            } else {
                message.error(res.msg);
            }
        });
    }
    disabledStartDate = (startValue) => {  // 禁用开始时间
        const endValue = this.state.endValue;
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    }
    disabledEndDate = (endValue) => {  // 禁用结束时间
        const startValue = this.state.startValue;
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    }
    onStartTimeChange = (value) => {  // 按开始时间查询
        this.onChange('startValue', value);
        let params = this.state.params;
        if (value) {
            params.startTime = value.format('YYYY-MM-DD');
        } else {
            delete params.startTime;
        }
        this.setState({
            dateKey: 0,
            params: params
        });
        params.page = 1
        this.getIpiecesList(params);
    }
    onEndTimeChange = (value) => {  // 按结束时间查询
        this.onChange('endValue', value);
        let params = this.state.params;
        if (value) {
            params.endTime = value.format('YYYY-MM-DD');
        } else {
            delete params.endTime;
        }
        this.setState({
            dateKey: 0,
            params: params
        });
        params.page = 1
        this.getIpiecesList(params);
    }
    auditStatusChange = (value) => {
        let params = this.state.params;
        if (value) {
            params.auditStatus = value
        } else {
            delete params.auditStatus;
        }
        params.page = 1
        this.getIpiecesList(params);
    }
    surveyStatusChange = (value) => {
        let params = this.state.params;
        if (value) {
            params.surveyStatus = value
        } else {
            delete params.surveyStatus;
        }
        params.page = 1; // 查询数据重置页码
        this.getIpiecesList(params);
    }
    prdTypeChange = (value) => {
        let params = this.state.params;
        if (value) {
            params.prdType = value
        } else {
            delete params.prdType;
        }
        params.page = 1; // 查询数据重置页码
        this.getIpiecesList(params);
    }
    loanCancelChange = (value) => {
        let params = this.state.params;
        if (value) {
            params.isCancel = value
        } else {
            delete params.isCancel;
        }
        params.page = 1; // 查询数据重置页码
        this.getIpiecesList(params);
    }
    proNameChange = (value) => {
        let params = this.state.params;
        if (value) {
            params.prdName = value
        } else {
            delete params.prdName;
        }
        params.page = 1; // 查询数据重置页码
        this.getIpiecesList(params);
    }
    searchDateKey = (key) => { // 本周、本月、近三个月
        let params = this.state.params;
        let { dateKey } = this.state
        if (dateKey == key) {
            dateKey = null
            delete params.startTime
            delete params.endTime
        } else {
            dateKey = key
            params.startTime = moment().subtract(dateKey, 'days').format('YYYY-MM-DD');
            params.endTime = moment().format('YYYY-MM-DD');
        }
        this.setState({
            dateKey: dateKey,
            params: params,
            endValue: null,
            startValue: null
        });
        params.page = 1; //重置页码
        this.getIpiecesList(params);
    }
    // searchIpieces(value, dateString, key) {
    // const that = this;
    // const { params } = that.state;
    // if (key === 'channel') { // 来源渠道
    //     if (value) {
    //         params.channel = value;
    //     } else {
    //         delete params.channel;
    //     }
    // }
    // this.getIpiecesList(params);
    // }
    changeTreeSelect = (value, type) => {
        const { params } = this.state;
        if (value) {
            params[type] = value;
        } else {
            delete params[type];
        }
        params.page = 1; // 查询数据重置页码
        this.getIpiecesList(params);
    }
    changeRoleTreeSelect = (value, node, extra) => {
        const { params } = this.state;
        if (value) {
            params.cmCode = value;
        } else {
            delete params.cmCode;
        }
        params.page = 1; // 查询数据重置页码
        this.getIpiecesList(params);
    }
    onChange = (field, value) => {
        this.setState({
            [field]: value,
        });
    }
    searchData = (value) => {  // 模糊搜索关键字
        let keyWord = value;
        let params = this.state.params;
        if (Config.isNull(keyWord)) {
            delete params.keyWord;
        } else {
            params.keyWord = keyWord;
        }
        params.page = 1; // 查询数据重置页码
        this.setState({
            params: params
        });
        this.getIpiecesList(params);
    }
    searchType = (value) => {
        let prdType = value;
        let params = this.state.params;
        if (Config.isNull(prdType)) {
            delete params.prdType;
        } else {
            params.prdType = prdType;
        }
        params.page = 1; // 查询数据重置页码
        this.setState({
            params: params
        });
        this.getIpiecesList(params);
    }


    // 下载pdf
    // async downloadPDF (code, type) {
    //     let topInfo = await IpiecesService.getTopInfo({code})
    //     if (!topInfo || !topInfo.tabShow || !topInfo.tabShow.length) return message.error('无法下载pdf')
    //     let [baseInfo, businessInfoData, businessOtherData, businessAnalysisData, guaranteeData, logicData, assetsData, softInfo, sigleSoftInfo, mismatch, loanCreditHisData, proInfoData, balance, income, cash, farmBalance, farmIncome, farmCash, farmBase, loanDownStream] = await Promise.all([
    //         IpiecesService.getBaseInfo({code}),
    //         IpiecesService.getBusinessInfo({code}),
    //         IpiecesService.getBusinessOther({code}),
    //         IpiecesService.getBusinessAnalysis({code}),
    //         IpiecesService.getGuaranteeData({code}),
    //         IpiecesService.getLogicData({code}),
    //         IpiecesService.getAssetsData({code}),
    //         IpiecesService.getSoftInfo({code}),
    //         IpiecesService.getSingleSoft({code}),
    //         IpiecesService.getMismatch({code}),
    //         type == 7 || type == 8 ? IpiecesService.getCreditHis({code}): IpiecesService.getCreditHisCustomer({code}),
    //         type == 8 ? IpiecesService.getProInfoData({code}) : null,
    //         type == 6 ||  type == 8 ? IpiecesService.getBalance({code}) : null,
    //         type == 6 ||  type == 8 ? IpiecesService.getIncome({code}) : null,
    //         type == 6 ||  type == 8 ?IpiecesService.getCash({code}) : null,
    //         type == 6 ||  type == 8 ? null  : IpiecesService.getFarmBalance({code}),
    //         type == 6 ||  type == 8 ? null : IpiecesService.getFarmIncome({code}),
    //         type == 6 ||  type == 8 ? null : IpiecesService.getFarmCash({code}),
    //         type == 6 ||  type == 8 ? null  : IpiecesService.getFarmBase({code}),
    //         type == 6 ||  type == 8 ? null : IpiecesService.getLoanDownStream({code})
    //     ])
    //     this.setState({ loading: true }, () => {
    //         ReactDOM.render(
    //             <PDF {...{topInfo, type, baseInfo, businessInfoData, businessOtherData, businessAnalysisData, guaranteeData, logicData, assetsData, softInfo, sigleSoftInfo, mismatch, loanCreditHisData, proInfoData, balance, income, cash, farmBalance, farmIncome, farmCash, farmBase, loanDownStream}} />,
    //             this.targetPDF
    //         )
    //         html2canvas(this.targetPDF, {
    //             useCORS: true,
    //             logging: false,
    //             allowTaint: false,
    //             taintTest: true
    //         }).then(
    //             (canvas) => {
    //                 document.body.appendChild(canvas)
    //                 this.targetPDF.innerHTML = ''
    //                 let contentWidth = canvas.width;
    //                 let contentHeight = canvas.height;
    //                 //一页pdf显示html页面生成的canvas高度;
    //                 let pageHeight = contentWidth / 595.28 * 841.89;
    //                 //未生成pdf的html页面高度
    //                 let leftHeight = contentHeight;
    //                 //pdf页面偏移
    //                 let position = 0;
    //                 //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
    //                 let imgWidth = 595.28;
    //                 let imgHeight = 595.28/contentWidth * contentHeight;
    //                 let pageData = canvas.toDataURL('image/jpeg', 1.0);
    //                 let pdf = new jsPDF('', 'pt', 'a4');
    //                 //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
    //                 //当内容未超过pdf一页显示的范围，无需分页
    //                 if (leftHeight < pageHeight) {
    //                     pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight );
    //                 } else {
    //                     while(leftHeight > 0) {
    //                         pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
    //                         leftHeight -= pageHeight;
    //                         position -= 841.89;
    //                         //避免添加空白页
    //                         if(leftHeight > 0) {
    //                             pdf.addPage();
    //                         }
    //                     }
    //                 }
    //         })
    //     });
    // }
    viewDetails(url) {
        window.open(url, '_blank')
    }
    render() {
        const state = this.state;
        const { teamList, prdName, cplx, spzt, dczt, yxqdlb, taskPerson, startValue, endValue, ipiecesInfo,zhwdList } = state;
        const dateFormat = 'YYYY-MM-DD';
        const columns = [{
            title: '客户姓名',
            dataIndex: 'customerName',
            key: 'customerName'
        }, {
            title: '来源渠道',
            dataIndex: 'channelText',
            key: 'channelText',
            render: (text) => (
                text ?
                    <span> {text.length>10?text.substring(0,10)+'...':text} </span>
                    :
                    <span>--</span>
            )
        }, {
            title: '归属客户经理',
            dataIndex: 'cmName',
            key: 'cmName',
            render: (text) => (
                text ?
                    <span> {text} </span>
                    :
                    <span>--</span>
            )
        }, {
            title: '产品名称',
            dataIndex: 'prdName',
            key: 'prdName',
            render: (text) => (
                <span className="ipieces-prdName">
                    {text}
                </span>
            )
        }, {
            title: '产品类型',
            dataIndex: 'prdTypeStr',
            key: 'prdTypeStr'
        }, {
            title: '申请时间',
            dataIndex: 'reqTime',
            key: 'reqTime',
            render: (res) => (
                <span>
                    {Config.formatDateTime(res)}
                </span>
            )
        }, {
            title: '调查状态',
            dataIndex: 'surveyStatusStr',
            key: 'surveyStatusStr',
            render: (text) => (
                <span>
                    {text || '————'}
                </span>
            )
        }, {
            title: '审批状态',
            dataIndex: 'auditStatusStr',
            key: 'auditStatusStr',
            render: (text, record) => (
                record.isCancel ?
                    <span>
                        {text} <img src={loanCancelImg} alt='loan-cancel' />
                    </span> :
                    <span>
                        {text}
                    </span>
            )
        }, {
            title: '操作',
            key: 'action',
            render: (text, record, index) => (
                <span>
                    <span className="cursor-pointer" onClick={(e) => this.viewDetails(`/ipieces/operate/${record.code}/${record.prdType}`)}>查看</span>
                    {/* {<span><span className="ant-divider" /><Link onClick={this.downloadPDF.bind(this, record.code, record.prdType)}>下载pdf</Link></span>} */}
                </span>
            )
        }];

        return (
            <Spin tip={Config.warnInfo.spinText} spinning={this.state.loading}>
                <div className="common-console-container ipieces-container" id="area">
                    <div className="common-search-section">
                        <div className="date-search-container">
                            <div className='search-item' data-flex="dir:left">
                                <DatePicker
                                    style={{ width: 160, height: 36 }}
                                    disabledDate={this.disabledStartDate}
                                    format={dateFormat}
                                    placeholder="开始时间"
                                    value={startValue}
                                    onChange={this.onStartTimeChange}
                                    getCalendarContainer={trigger => trigger.parentNode}
                                />
                                <DatePicker
                                    style={{ width: 160, height: 36 }}
                                    disabledDate={this.disabledEndDate}
                                    format={dateFormat}
                                    placeholder="结束时间"
                                    value={endValue}
                                    onChange={this.onEndTimeChange}
                                    getCalendarContainer={trigger => trigger.parentNode}
                                />
                            </div>
                            {/* <Select
                                className="search-item"
                                style={{ width: 200 }}
                                size={'large'}
                                placeholder="渠道"
                                optionFilterProp="children"
                                allowClear
                                onChange={(value, options) => this.searchIpieces(value, options, 'channel')}
                                getPopupContainer={trigger => trigger.parentNode}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                {
                                    yxqdlb && yxqdlb.map((item, index) => (
                                        item.dictDTOS.length > 0 && item.dictDTOS.map((cItem, cIndex) => (
                                            <Option value={cItem.ddValue + ''} key={cIndex}>{cItem.ddText}</Option>
                                        ))
                                    ))
                                }
                            </Select> */}
                            <TreeSelect
                                showSearch
                                style={{ width: 180 }}
                                size={'large'}
                                // value={this.state.yxqdlbValue}
                                dropdownStyle={{ width: '180px', maxHeight: 400, overflow: 'auto' }}
                                placeholder="归属客户经理"
                                treeData={taskPerson}
                                allowClear
                                // multiple
                                treeDefaultExpandAll
                                treeNodeFilterProp={'label'}
                                onChange={this.changeRoleTreeSelect}
                                // onSelect={this.selectTreeSelect}
                                className="common-search-treeSelect"
                            />
                            <TreeSelect
                                showSearch
                                style={{ width: 180 }}
                                size={'large'}
                                // value={this.state.yxqdlbValue}
                                dropdownStyle={{ width: '180px', maxHeight: 400, overflow: 'auto' }}
                                placeholder="小组"
                                treeData={teamList}
                                allowClear
                                // multiple
                                treeDefaultExpandAll
                                treeNodeFilterProp={'label'}
                                onChange={(value) => this.changeTreeSelect(value, 'teamCode')}
                                // onSelect={this.selectTreeSelect}
                                className="common-search-treeSelect"
                            />
                            <TreeSelect
                                showSearch
                                style={{ width: 180 }}
                                size={'large'}
                                // value={this.state.yxqdlbValue}
                                dropdownStyle={{ width: '180px', maxHeight: 400, overflow: 'auto' }}
                                placeholder="渠道"
                                treeData={yxqdlb}
                                allowClear
                                // multiple
                                treeDefaultExpandAll
                                treeNodeFilterProp={'label'}
                                onChange={(value) => this.changeTreeSelect(value, 'channel')}
                                // onSelect={this.selectTreeSelect}
                                className="common-search-treeSelect"
                            />
                            <TreeSelect
                                showSearch
                                style={{ width: 180,marginLeft:0 }}
                                size={'large'}
                                // value={this.state.yxqdlbValue}
                                dropdownStyle={{ width: '180px', maxHeight: 400, overflow: 'auto' }}
                                placeholder="支行网点"
                                treeData={zhwdList}
                                allowClear
                                // multiple
                                treeDefaultExpandAll
                                treeNodeFilterProp={'label'}
                                onChange={(value) => this.changeTreeSelect(value, 'branchCode')}
                                // onSelect={this.selectTreeSelect}
                                className="common-search-treeSelect"
                            />
                            <Select
                                className='search-item'
                                style={{ width: 160, height: 36 }}
                                placeholder="调查状态"
                                allowClear
                                optionFilterProp="children"
                                onChange={this.surveyStatusChange}
                                getPopupContainer={trigger => trigger.parentNode}
                            >
                                {
                                    dczt && dczt.map((item, index) => (
                                        <Option value={item.ddValue} key={index}>{item.ddText}</Option>
                                    ))
                                }
                            </Select>
                            <Select
                                className='search-item'
                                style={{ width: 160, height: 36 }}
                                placeholder="审批状态"
                                allowClear
                                optionFilterProp="children"
                                onChange={this.auditStatusChange}
                                getPopupContainer={trigger => trigger.parentNode}
                            >
                                {
                                    spzt && spzt.map((item, index) => (
                                        <Option value={item.ddValue} key={index}>{item.ddText}</Option>
                                    ))
                                }
                            </Select>
                            <Select
                                className='search-item'
                                style={{ width: 160, height: 36 }}
                                placeholder="撤销状态"
                                allowClear
                                optionFilterProp="children"
                                onChange={this.loanCancelChange}
                                getPopupContainer={trigger => trigger.parentNode}
                            >
                                <Option value='0'>未撤销</Option>
                                <Option value='1'>已撤销</Option>

                            </Select>
                            <Select
                                className='search-item'
                                style={{ width: 160, height: 36 }}
                                placeholder="产品类型"
                                allowClear
                                optionFilterProp="children"
                                onChange={this.prdTypeChange}
                                getPopupContainer={trigger => trigger.parentNode}
                            >
                                {
                                    cplx && cplx.map((item, index) => (
                                        <Option value={item.ddValue} key={item.ddValue}>{item.ddText}</Option>
                                    ))
                                }
                            </Select>
                            <Select
                                className='search-item'
                                style={{ width: 160, height: 36 }}
                                placeholder="产品名称"
                                allowClear
                                optionFilterProp="children"
                                onChange={this.proNameChange}
                                getPopupContainer={trigger => trigger.parentNode}
                            >
                                {
                                    prdName && prdName.map((item, index) =>
                                        <Option value={item} key={index}>{item}</Option>
                                    )
                                }
                            </Select>
                            <Search className='search-item' style={{ width: '160px' }} placeholder="搜索" onSearch={this.searchData} />
                            {/* <div className="search-item">
                                <span className={`time-item ${this.state.dateKey == 6 ? "time-selected" : ""}`} onClick={this.searchDateKey.bind(this, 6)}>近一周</span>
                                <span className={`time-item ${this.state.dateKey == 29 ? "time-selected" : ""}`} onClick={this.searchDateKey.bind(this, 29)}>近一月</span>
                                <span className={`time-item ${this.state.dateKey == 89 ? "time-selected" : ""}`} onClick={this.searchDateKey.bind(this, 89)}>近三个月</span>
                            </div> */}
                            <ResetSearch />
                        </div>
                    </div>
                    <div className="common-action-section">
                        <Link to={"/ipieces/export"}><Button className="common-btn" type="primary">下载导出文件</Button></Link>
                    </div>
                    <Table
                        rowKey={record => record.code}
                        pagination={this.state.pagination}
                        columns={columns}
                        dataSource={ipiecesInfo}
                        className="common-content-container"
                        onChange={this.changeTable}
                    />
                </div>
                <div id="target" ref={targetPDF => { this.targetPDF = targetPDF }}></div>
            </Spin>
        );
    }
}

Ipieces.contextTypes = {
    router: React.PropTypes.object.isRequired
}

const Main = Form.create()(Ipieces);

export default Main;

