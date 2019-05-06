import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import { connect } from 'react-redux';
import { Config } from '../../Config/Index';
import { bindActionCreators } from 'redux';
import { loading, emptyCityInd } from '../../Redux/Action/Index';
import './style/productAttr.less';
import BaseService from '../../Services/BaseService';
import ProductService from '../../Services/ProductService';
import { browserHistory } from 'react-router';
import SliderImg from '../Common/SliderImg';
// Modal对话框(数据联动) 省市区、受众行业
import DataPicker from '../Modal/DataPicker';
import ExplainImg from './../../Assets/Images/icon_explain.png';
import { message, Input, Button, Form, Row, Col, Cascader, Select, AutoComplete, Icon, Switch, Modal, Popover } from 'antd';
const Option = Select.Option;
// const { TextArea } = Input;
const FormItem = Form.Item;


class ProductAttr extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ageLimit: '',                // 年龄限制最小值
            ageMax: '',                  // 年龄限制最大值
            editCode: props.code,        // 编辑code
            productInfo: '',             // 编辑回显数据
            ageErrorInfo: '',            // 年龄限制错误提示信息
            reqCondErrorInfo: '',        // 申请资质错误提示信息
            approveNum: '',              // 产品审批人数:正整数
            mFrame: '',                   // 数据联动(受众行业、省市区)
            customerIndustry: '',        //行业id
            citiesId: '',
            loanTypeLength: 0,            //放款方式文本框
            reqConditionLength: 0,        //申请资质文本框
            audienceLength: 0,            //适用人群文本框
            coverTpls: null,              //获取封面模板列表
            tplCode: null,
            tplUrl: null,
            visible: false,
            creditOn: false,
            isCredit: false,
            onLoanTypeFocus: false,
            onReqConditionFocus: false,
            onAudienceFocus: false,
            fixedRate: false,       // 固定利率
            prdStatus: null
        };
    }
    componentDidMount() {
        const that = this;
        const { editCode } = that.state;
        that.setState({
            mFrame: null
        });
        if (editCode) {
            that.getEditProInfo(editCode);
        }
        that.getCoverTpls()//获取模板选择数据
    }
    getCoverTpls = () => {
        const { editCode } = this.state;
        let params = {
            page: 1,
            rows: 20,
            type: 1
        }
        Config.get('/v1/prod/coverTpls', params, (res) => {
            let defTplInfo = ''
            if (res.code == 0) {
                res.data.filter(function (item, index) {
                    if (item.isdefault == true) {
                        defTplInfo = item;
                        return item;
                    }
                })
                if (!editCode) {
                    this.setState({
                        tplUrl: defTplInfo.tplViewUrl,
                        tplCode: defTplInfo.tplType
                    })
                    this.props.form.setFieldsValue({
                        'tplCode': defTplInfo.tplType
                    });
                }
                this.setState({
                    coverTpls: res.data.filter(function (item) { return !item.isdel }),
                })
            } else {
                message.error(res.msg);
            }
        });
    }
    componentWillUnmount() {
        // 清空Redux里支持城市和受众行业的数据
        const { actions } = this.props;
        actions.emptyCityInd();
    }
    // 表单验证
    validatorForm = (rule, value, callback) => {
        if (rule.field == 'prdName') { // 产品名称
            if (Config.isNull(value)) {
                callback(Config.warnInfo.prdNameNull);
            } else if (value.length > 64) {
                callback(Config.warnInfo.prdNameRule);
            } else {
                callback();
            }
        }
        if (rule.field == 'prdType') { // 产品类型
            if (Config.isNull(value)) {
                callback(Config.warnInfo.prdTypeNull);
            } else {
                callback();
            }
        }
        if (rule.field == 'loanLimit') {
            if (Config.isNull(value)) { // 最高额度
                callback(Config.warnInfo.loanLimitNull);
            } else if (value <= 0 || value >= 10000) {
                callback(Config.warnInfo.LoanLimitMax);
            } else if (!Config.checkNumberThree(value)) {
                callback(Config.warnInfo.dataTypeError);
            } else {
                callback();
            }
        }
        if (rule.field == 'loanAuthDays') { // 最长授信周期
            if (Config.isNull(value)) {
                callback(Config.warnInfo.loanAuthDaysNull);
            } else if (value <= 0 || value > 360) {
                callback(Config.warnInfo.LoanAuthDaysRule);
            } else if (!Config.checkNumber(value)) {
                callback(Config.warnInfo.dataTypeError);
            } else {
                callback();
            }
        }
        if (rule.field == 'loanMonths') { //
            if (Config.isNull(value)) {
                // callback(Config.warnInfo.LoanMonthsNull);
                callback();
            } else if (value <= 0 || value > 360) {
                callback(Config.warnInfo.LoanMonthsRule);
            } else if (!Config.checkNumber(value)) {
                callback(Config.warnInfo.dataTypeError);
            } else {
                callback();
            }
        }
        if (rule.field == 'loanRate') { // 日利率
            if (Config.isNull(value)) {
                callback(Config.warnInfo.loanRateNull);
            } else if (value <= 0 || value >= 1.0000) {
                callback(Config.warnInfo.loanRateRule);
            } else if (!Config.checkNumberFour(value)) {
                callback(Config.warnInfo.loanRateRuleLength);
            } else {
                callback();
            }
        }
        if (rule.field == 'authType') { // 授信类型
            if (Config.isNull(value)) {
                callback(Config.warnInfo.authTypeNull);
            } else {
                callback();
            }
        }
        if (rule.field == 'repaymentKind') { // 还款方式
            if (Config.isNull(value)) {
                callback(Config.warnInfo.repaymentKindNull);
            } else {
                callback();
            }
        }
        if (rule.field == 'interestType') { // 计息方式
            if (Config.isNull(value)) {
                callback(Config.warnInfo.interestTypeNull);
            } else {
                callback();
            }
        }
        if (rule.field == 'citiesText') { // 开放城市
            if (Config.isNull(value)) {
                callback(Config.warnInfo.citiesTextNull);
            } else {
                callback();
            }
        }
        if (rule.field == 'ageLimit') { // 最小年龄
            let ageMax = this.state.ageMax ? parseInt(this.state.ageMax) : '';
            if (Config.isNull(value)) {
                callback(Config.warnInfo.ageMaxNull);
            } else if (!Config.checkAgeLimit(value)) {
                callback(Config.warnInfo.ageLimitRule);
            } else if (ageMax && value > ageMax) {
                callback(Config.warnInfo.ageOrderRule);
            } else {
                callback();
            }
        }
        if (rule.field == 'ageMax') { // 最大年龄
            let ageLimit = this.state.ageLimit ? parseInt(this.state.ageLimit) : '';
            if (Config.isNull(value)) {
                callback(Config.warnInfo.ageMaxNull);
            } else if (!Config.checkAgeLimit(value)) {
                callback(Config.warnInfo.ageLimitRule);
            } else if (ageLimit && value < ageLimit) {
                callback(Config.warnInfo.ageOrderRule);
            } else {
                callback();
            }
        }
        if (rule.field == 'industryText') { // 受众行业
            if (Config.isNull(value)) {
                callback(Config.warnInfo.industryTextNull);
            } else {
                callback();
            }
        }
        if (rule.field == 'approveNum') { // 审批人数
            if (Config.isNull(value)) {
                callback('请输入审批人数');
            } else if (!Config.checkNumber(value)) {
                callback(Config.warnInfo.dataTypeError);
            } else {
                callback();
            }
        }
        if (rule.field == 'examineNum') { // 审查人数
            if (Config.isNull(value)) {
                callback();
            } else if (!Config.checkNumber(value) && parseInt(value) != 0) {
                callback(Config.warnInfo.dataTypeError);
            } else {
                callback();
            }
        }
        // if(rule.field == 'tplCode') { // 模板选择
        //     if (Config.isNull(value)) {
        //         callback(Config.warnInfo.coverTpl);
        //      } else {
        //         callback();
        //     }
        // }
        if (rule.field == 'prdAd') { // 宣传语
            if (Config.isNull(value)) {
                callback(Config.warnInfo.productAd);
            } else if (value.length > 10) {
                callback(Config.warnInfo.preAdword);
            } else {
                callback();
            }
        }
        if (rule.field == 'loanType') { // 放款方式
            if (Config.isNull(value)) {
                callback('请输入放款方式');
            } else if (value.length > 256) {
                callback('放款方式不超过256个字');
            } else {
                callback();
            }
        }
        if (rule.field == 'reqCondition') { // 申请资质
            if (Config.isNull(value)) {
                callback('请输入申请资质');
            } else if (value.length > 256) {
                callback('申请资质不超过256个字');
            } else {
                callback();
            }
        }
        if (rule.field == 'audience') { // 适用人群
            if (Config.isNull(value)) {
                callback('请输入适用人群');
            } else if (value.length > 256) {
                callback('适用人群不超过256个字');
            } else {
                callback();
            }
        }
        if (rule.field == 'creditOn') { // 适用人群
            if (Config.isNull(value)) {
                callback();
            } else {
                callback();
            }
        }
    }
    //  获取最小年龄
    getAgeLimit = (e) => {
        this.setState({ ageErrorInfo: '' });
        let value = e.target.value ? parseInt(e.target.value) : '';
        let ageMax = this.state.ageMax ? parseInt(this.state.ageMax) : '';
        if (Config.isNull(value)) {
            // this.setState({
            //     ageErrorInfo: Config.warnInfo.ageLimitNull
            // });
        } else if (!Config.checkAgeLimit(value)) {
            // this.setState({
            //     ageErrorInfo: Config.warnInfo.ageLimitRule
            // });
        } else if (ageMax && value > ageMax) {
            // this.setState({
            //     ageErrorInfo: Config.warnInfo.ageOrderRule
            // });
        } else {
            this.setState({
                ageLimit: value
            }, () => {
                console.log(value)
            });
        }

    }
    //  获取最大年龄
    getAgeMax = (e) => {
        this.setState({ ageErrorInfo: '' });
        let ageLimit = this.state.ageLimit ? parseInt(this.state.ageLimit) : '';
        let value = e.target.value ? parseInt(e.target.value) : '';
        if (Config.isNull(value)) {
            this.setState({
                ageErrorInfo: Config.warnInfo.ageLimitNull
            });
        } else if (!Config.checkAgeLimit(value)) {
            this.setState({
                ageErrorInfo: Config.warnInfo.ageLimitRule
            });
        } else if (ageLimit && value < ageLimit) {
            this.setState({
                ageErrorInfo: Config.warnInfo.ageOrderRule
            });
        } else {
            this.setState({
                ageMax: value
            });
        }
    }
    getEditProInfo = (code) => {  // 获取编辑产品数据回显
        Config.get('/v1/prod/info', { code: code }, (res) => {
            if (res.code == 0) {
                this.setState({
                    tplCode:res.data.tplCode,
                    productInfo: res.data,
                    tplUrl: res.data.viewUrl,
                    creditOn: res.data.creditOn,
                    audienceLength: res.data.audience ? res.data.audience.length : 0,
                    reqConditionLength: res.data.reqCondition ? res.data.reqCondition.length : 0,
                    isCredit: res.data.creditOn,
                    loanTypeLength: res.data.loanType ? res.data.loanType.length : 0,
                    ageLimit: res.data.ageLimit,
                    ageMax: res.data.ageMax,
                    customerIndustry: res.data.customerIndustry || '',
                    citiesId: res.data.citiesId || '',
                    fixedRate: res.data.isfixedRate || false,
                    prdStatus: res.data.prdStatus
                });
            } else {
                message.error(res.msg);
            }
        });
    }
    // 发布
    pubProOption = () => {
        let that = this;
        Promise.all([
            this.addProOption('publish')
        ]).then(result => {
            if (result[0]) {
                let isCredit = that.state.isCredit;
                if (isCredit) {
                    let params = {
                        code: that.state.editCode,
                        pubOp: 2,
                        coverFlag: true,
                    }
                    if (that.state.prdStatus == 3) params.pubOp = 4
                    Config.put('/v1/prod/prodPub', params, (res) => {   // 添加
                        if (res.code == 0) {
                            message.success('发布成功！');
                            // browserHistory.push('/product/all' );
                            browserHistory.push('/product/share/' + params.code);
                        } else {
                            message.error(res.msg);
                        }
                    });
                    // that.getCreditOn((res) => {
                    //     if (!res) {

                    //         // let params = {
                    //         //     code: this.state.editCode,
                    //         //     pubOp: 2,
                    //         //     coverFlag: true,
                    //         // }
                    //         // Config.put('/v1/prod/prodPub', params, (res) => {   // 添加
                    //         //     if(res.code == 0) {
                    //         //         message.success('发布成功！');
                    //         //         browserHistory.push('/product/all' );
                    //         //     } else {
                    //         //         message.error(res.msg);
                    //         //     }
                    //         // });
                    //     } else {
                    //         const confirm = Modal.confirm;
                    //         confirm({
                    //             title: '覆盖确认',
                    //             content: res.prdName + '产品已经开启预授信模式，发布将替换原有预授信模式产品，是否发布该产品？',
                    //             okText: '确定',
                    //             cancelText: '取消',
                    //             onOk() {
                    //                 let params = {
                    //                     code: that.state.editCode,
                    //                     pubOp: 2,
                    //                     coverFlag: true,
                    //                 }
                    //                 if (that.state.prdStatus == 3) params.pubOp = 4
                    //                 Config.put('/v1/prod/prodPub', params, (res) => {   // 添加
                    //                     if (res.code == 0) {
                    //                         message.success('发布成功！');
                    //                         // browserHistory.push('/product/all' );
                    //                         browserHistory.push('/product/share/' + params.code);
                    //                     } else {
                    //                         message.error(res.msg);
                    //                     }
                    //                 });
                    //             }
                    //         });
                    //     }
                    // })
                } else {
                    let params = {
                        code: this.state.editCode,
                        pubOp: 2,
                        coverFlag: false,
                    }
                    if (that.state.prdStatus == 3) params.pubOp = 4
                    Config.put('/v1/prod/prodPub', params, (res) => {   // 添加
                        if (res.code == 0) {
                            message.success('发布成功！');
                            // browserHistory.push('/product/all' );
                            browserHistory.push('/product/share/' + params.code);
                        } else {
                            message.error(res.msg);
                        }
                    });
                }
            }
        });
    }
    addProOption = (type) => {    //发布或保存
        return new Promise(resolve => {
            const that = this;
            const state = that.state;
            // const props = that.props;
            this.props.form.validateFieldsAndScroll((err, values) => {
                if (!err) {
                    // const current = props.current + 1;
                    let editCode = state.editCode;
                    let prdType = values.prdType;
                    if (prdType && prdType.length > 1) {
                        prdType = prdType["1"] ? prdType["1"] : prdType["0"];
                    }
                    let custInChild = values.customerIndustry;
                    if (custInChild && custInChild.length > 1) {
                        custInChild = custInChild["1"];
                    }
                    var prdName = values.prdName,
                        loanLimit = values.loanLimit,
                        loanAuthDays = values.loanAuthDays,
                        loanMonths = values.loanMonths || '',
                        loanRate = values.loanRate,
                        authType = values.authType,
                        repaymentKind = values.repaymentKind,
                        interestType = values.interestType,
                        ageLimit = values.ageLimit,
                        ageMax = values.ageMax,
                        // approveNum = values.approveNum,
                        // examineNum = values.examineNum,
                        tplCode = values.tplCode || 'templet1',
                        loanType = values.loanType,
                        prdAd = values.prdAd,
                        reqCondition = values.reqCondition,
                        audience = values.audience,
                        isfixedRate = that.state.fixedRate,
                        creditOn = values.creditOn;
                    let addPrdParams = {
                        tplId: 1,       // 默认模版id
                        prdName: prdName,
                        prdType: prdType,
                        loanLimit: loanLimit,
                        loanAuthDays: loanAuthDays,
                        loanMonths: loanMonths || '',
                        loanRate: loanRate,
                        authType: authType,
                        repaymentKind: repaymentKind,
                        interestType: interestType,
                        ageLimit: ageLimit,
                        ageMax: ageMax,
                        citiesId: state.citiesId,
                        customerIndustry: state.customerIndustry,
                        // approveNum: approveNum,
                        // examineNum: examineNum,
                        tplCode: tplCode,
                        prdAd: prdAd,
                        loanType: loanType,
                        reqCondition: reqCondition,
                        audience: audience,
                        isfixedRate: isfixedRate,
                        creditOn: creditOn
                    };

                    if (editCode) {  // 编辑
                        addPrdParams.code = editCode;
                        Config.put('/v1/prod/edit', addPrdParams, (res) => {   // 添加
                            if (res.code == 0) {
                                if (type != 'publish') {
                                    message.success('编辑成功！');
                                    browserHistory.push('/product/all');
                                }
                                if (type == 'publish') {
                                    resolve(true)
                                }
                                // message.success('编辑成功！');
                                // browserHistory.push('/product/all' );
                                // if(type=='save'){
                                //     browserHistory.push('/product/all' );
                                // }else{
                                //     browserHistory.push('/product/all' );
                                // }
                                // if (type=='nextStep') {
                                //     Config.localItem('PRODUCT_STEP', current);
                                //     this.props.router.push({
                                //         pathname: '/product/add/' + current + '/' + editCode
                                //     });
                                // }
                            } else {
                                message.error(res.msg);
                            }
                        });
                    } else {
                        Config.post('/v1/prod/add', addPrdParams, (res) => {   // 添加
                            // let newCode = res.data ? res.data.code : '';
                            if (res.code == 0) {
                                // 跳转用户管理页面
                                if (type != 'publish') {
                                    message.success('增加成功！');
                                    browserHistory.push('/product/all');
                                }
                                if (type == 'publish') {
                                    resolve(true)
                                }
                                this.setState({
                                    editCode: res.data.code
                                });
                            } else {
                                message.error(res.msg);
                            }
                        });
                    }
                } else {
                    resolve(false)
                }
            });
        })

    }
    setDataPicker = (bool, code) => {
        const that = this;
        if (bool) {
            const { actions } = that.props;
            const { productInfo } = that.state;
            actions.loading(true);
            BaseService.getSysDictItems({ code: code }, (res) => {
                actions.loading(false);
                if (res.code == Config.errorCode.success) {
                    if (code == 'ssq') {
                        if (res.data && res.data.ssq) {
                            const modalData = {
                                title: '支持城市',
                                code: code,
                                level: 3,
                                col: 6,
                                visible: bool
                            };
                            const selectData = {
                                tag: productInfo && productInfo.citiesId || '',
                                text: productInfo && productInfo.citiesText || '',
                            };
                            that.setState({
                                mFrame: <DataPicker sData={selectData} pData={res.data.ssq} mData={modalData} cbModalVisible={that.setDataPicker} changeValue={that.changeValue} />
                            });
                        }
                    }
                    if (code == 'szhy') {
                        const modalData = {
                            title: '受众行业',
                            code: code,
                            level: 2,
                            col: 3,
                            visible: bool
                        };
                        const selectData = {
                            tag: productInfo && productInfo.customerIndustry || '',
                            text: productInfo && productInfo.industryText || ''
                        };
                        this.setState({
                            mFrame: <DataPicker sData={selectData} pData={res.data.szhy} mData={modalData} cbModalVisible={that.setDataPicker} changeValue={that.changeValue} />
                        });
                    }
                } else {
                    message.error(res.msg);
                }
            });
        } else {
            this.setState({
                mFrame: null
            });
        }
    }

    changeValue = (type, value) => {
        if (type == 'saveIndustry') {
            let industryTexts = [], customerIndustry = []; // 受众行业文本内容
            value.length > 0 && value.map((item, index) => {
                industryTexts.push(item.ddText);
                customerIndustry.push(item.ddValue);
            });
            this.props.form.setFieldsValue({
                'industryText': industryTexts.length > 0 && industryTexts.join('+') || '',
            });
            this.setState({
                customerIndustry: customerIndustry.join(','),
            })
        }
        if (type == 'saveCitiesId') {
            let citiesText = [], citiesId = []; // 支持城市文本内容
            value.length > 0 && value.map((item, index) => {
                citiesText.push(item.ddText);
                citiesId.push(item.ddValue);
            });
            this.props.form.setFieldsValue({
                'citiesText': citiesText.length > 0 && citiesText.join('+') || '',
            });
            this.setState({
                citiesId: citiesId.join(','),
            })
        }
    }
    handleCancel = (e) => {     //关闭弹框
        this.setState({
            visible: false,
        });
    }
    contentChange(e, type) {           //文本框字数限制
        if (type == 'loanType') {
            // let valueLength = e.target.value.length;
            if (e.target.value.length > 256) {
                e.target.value = e.target.value.substr(0, 256);
                this.setState({
                    loanTypeLength: e.target.value.length
                })
                return;
            }
            this.setState({
                loanTypeLength: e.target.value.length
            })
        } else if (type == 'reqCondition') {
            // let valueLength = e.target.value.length;
            if (e.target.value.length > 256) {
                e.target.value = e.target.value.substr(0, 256);
                this.setState({
                    reqConditionLength: e.target.value.length
                })
                return;
            }
            this.setState({
                reqConditionLength: e.target.value.length
            })
        } else if (type == 'audience') {
            // let valueLength = e.target.value.length;
            if (e.target.value.length > 256) {
                e.target.value = e.target.value.substr(0, 256);
                this.setState({
                    audienceLength: e.target.value.length
                })
                return;
            }
            this.setState({
                audienceLength: e.target.value.length
            })
        }
    }
    contentFocus(e, type) {//textarea获取焦点
        if (type == 'loanType') {
            this.setState({
                onLoanTypeFocus: true,
            })
        } else if (type == 'reqCondition') {
            this.setState({
                onReqConditionFocus: true,
            })
        } else if (type == 'audience') {
            this.setState({
                onAudienceFocus: true,
            })
        }
    }
    contentLostFocus(e, type) {//textarea失去焦点
        if (type == 'loanType') {
            this.setState({
                onLoanTypeFocus: false,
            })
        } else if (type == 'reqCondition') {
            this.setState({
                onReqConditionFocus: false,
            })
        } else if (type == 'audience') {
            this.setState({
                onAudienceFocus: false,
            })
        }
    }
    sliderShow = () => {
        if (!this.refs.sliderImg) message.error('暂无模版')
        this.refs.sliderImg.previewShow()
    }
    getSliderImg = (tplCode, tplViewUrl) => {
        this.props.form.setFieldsValue({
            'tplCode': tplCode
        });
        this.setState({
            tplUrl: tplViewUrl,
            tplCode: tplCode,
        });
    }
    openCredit = (checked, type) => {
        if (type == 'rate') {
        } else {
            this.setState({
                isCredit: checked,
            });
        }
    }
    // getCreditOn = (cb) => {
    //     ProductService.getCreditOn({}, (res) => {
    //         if (res.code == Config.errorCode.success) {
    //             cb(res.data);
    //         }
    //     })
    // }
    changeFixedRate = () => {
        const { fixedRate } = this.state
        this.setState({
            fixedRate: !fixedRate
        })
    }
    render() {
        const that = this;
        const state = that.state;
        const props = that.props;
        const { fixedRate, tplUrl, coverTpls, loanTypeLength, reqConditionLength, audienceLength, onLoanTypeFocus, onReqConditionFocus, onAudienceFocus } = that.state;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
        };
        const formItemLayoutMore = {
            labelCol: { span: 6 },
            wrapperCol: { span: 12 }
        };
        const proContent = (
            <div>
                <p>点击矩形区域选择模板操作</p>
            </div>
        );
        const creContent = (
            <div>
                <p>预授信结合公众号使用</p>
                {/* <p>预授信产品有且只有一种</p> */}
            </div>
        );
        const { mFrame } = state;
        const { getFieldDecorator } = props.form;

        const prdTypeOption = Config.sysDictFormat(props.enterDictItems.cplx); // 产品类型

        // let ageErrorInfo = state.ageErrorInfo;                 // 年龄错误提示信息
        // let reqCondErrorInfo = state.reqCondErrorInfo;         // 申请资质错误提示信息
        let product = state.productInfo;                           // 编辑产品信息
        let repayWay = product && product.repaymentKind ? product.repaymentKind : '';  //还款方式
        if (repayWay && repayWay.length > 1) {
            repayWay = repayWay.split(',');
        }

        let interestTypeObj = {};
        if (product.interestType) {
            interestTypeObj = {
                initialValue: product.interestType.toString()
            }
        }
        let loanMonthsObj = {};
        if (product.loanMonths) {
            loanMonthsObj = {
                initialValue: product.loanMonths.toString()
            }
        }
        let getcplx = product ? Config.backfillData(props.enterDictItems.cplx, '' + product.prdType) : [];  // 产品类型
        let disabledShow = product && product.prdStatus != '1' ? true : false
        return (
            <div className='product-attr-container common-console-container'>
                <Form>
                    <Row>
                        <Col span={12} >
                            <FormItem label="产品名称" {...formItemLayout}>
                                {getFieldDecorator('prdName', {
                                    initialValue: product.prdName || '',
                                    rules: [{ validator: this.validatorForm }]
                                })(
                                    <Input autoComplete="off" placeholder="请输入" maxLength="64" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="产品类型" {...formItemLayout} >
                                {getFieldDecorator('prdType', {
                                    initialValue: getcplx || '',
                                    rules: [{ validator: this.validatorForm }]
                                })(
                                    <Cascader style={{ width: "100%" }} options={prdTypeOption} placeholder="请选择" getPopupContainer={trigger => trigger.parentNode} disabled={disabledShow} />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="最高额度" {...formItemLayout} >
                                {getFieldDecorator('loanLimit', {
                                    initialValue: product.loanLimit || '',
                                    rules: [{ validator: this.validatorForm }]
                                })(
                                    <Input autoComplete="off" placeholder="请输入" addonAfter="万元" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="最长授信周期" {...formItemLayout} >
                                {getFieldDecorator('loanAuthDays', {
                                    initialValue: product.loanAuthDays || '',
                                    rules: [{ validator: this.validatorForm }]
                                })(
                                    <Input autoComplete="off" placeholder="请输入" addonAfter="个月" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="最长用信周期" {...formItemLayout} >
                                {getFieldDecorator('loanMonths', {
                                    ...loanMonthsObj,
                                    rules: [{ validator: this.validatorForm }]
                                })(
                                    <Input autoComplete="off" placeholder="请输入" addonAfter="个月" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12} className="button-add">
                            {/* <div className='button-add'> */}
                            <FormItem label="日利率" {...formItemLayout} >
                                {
                                    getFieldDecorator('loanRate', {
                                        initialValue: product.loanRate || '',
                                        rules: [{ validator: this.validatorForm }]
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" addonAfter="%" />
                                    )}
                            </FormItem>
                            <span className={fixedRate ? 'button-isfixedRate' : 'button-fixedRate'} onClick={this.changeFixedRate}>固定利率</span>
                            {/* </div> */}
                        </Col>
                        <Col span={12}>
                            <FormItem label="授信类型" {...formItemLayout} >
                                {getFieldDecorator('authType', {
                                    initialValue: product.authType && (product.authType.length > 1) ? product.authType.split(',') : product.authType,
                                    rules: [{ validator: this.validatorForm }]
                                })(
                                    <Select
                                        placeholder="请选择"
                                        style={{ width: '100%' }}
                                        mode="multiple"
                                        getPopupContainer={trigger => trigger.parentNode}
                                    >
                                        {
                                            props.sysDictItems.sxlx.map((item, index) => (
                                                <Option key={index} value={item.ddValue}>{item.ddText}</Option>
                                            ))
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="还款方式" {...formItemLayout} >
                                {
                                    getFieldDecorator('repaymentKind', {
                                        initialValue: product.repaymentKind && (product.repaymentKind.length > 1) ? product.repaymentKind.split(',') : product.repaymentKind,
                                        rules: [{ validator: this.validatorForm }]
                                    })(
                                        <Select
                                            placeholder="请选择"
                                            style={{ width: '100%' }}
                                            mode="multiple"
                                            getPopupContainer={trigger => trigger.parentNode}
                                        >
                                            {
                                                props.sysDictItems.hkfs.map((item, index) => (
                                                    <Option key={index} value={item.ddValue}>{item.ddText}</Option>
                                                ))
                                            }
                                        </Select>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="计息方式" {...formItemLayout} >
                                {getFieldDecorator('interestType', {
                                    ...interestTypeObj,
                                    rules: [{ validator: this.validatorForm }]
                                })(
                                    <Select
                                        placeholder="请选择"
                                        style={{ width: '100%' }}
                                        getPopupContainer={trigger => trigger.parentNode}
                                    >
                                        {
                                            props.sysDictItems.jxfs.map((item, index) => (
                                                <Option key={index} value={item.ddValue}>{item.ddText}</Option>
                                            ))
                                        }
                                    </Select>
                                )
                                }
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                label="支持城市"
                                {...formItemLayout}
                            >
                                <div onClick={() => this.setDataPicker(true, 'ssq')}>
                                    {getFieldDecorator('citiesText', {
                                        initialValue: product.citiesText && product.citiesText.split(' ').join('+') || '',
                                        rules: [{ validator: this.validatorForm }]
                                    })(
                                        <AutoComplete
                                            className="global-search"
                                            size="large"
                                            style={{ width: '100%' }}
                                            placeholder="请添加"
                                            optionLabelProp="text">
                                            <Input
                                                suffix={(
                                                    <Button className="search-btn" size="large" type="primary" onClick={() => this.setDataPicker(true, 'ssq')}>
                                                        <Icon type="plus" />
                                                    </Button>
                                                )}
                                            />
                                        </AutoComplete>
                                    )}
                                </div>
                            </FormItem>
                        </Col>
                        <Col span={12} data-flex="dir:left">
                            <FormItem label="年龄限制" labelCol={{ span: 4 }}
                                wrapperCol={{ span: 11 }} >
                                {getFieldDecorator('ageLimit', {
                                    initialValue: product.ageLimit,
                                    rules: [{ validator: this.validatorForm }]
                                })(
                                    <Input style={{ 'width': '100%' }} autoComplete="off" placeholder="请输入" onChange={this.getAgeLimit} />
                                )}
                            </FormItem>
                            <Col span={2} pull={1}>
                                <span className='ageLimit-line'>—</span>
                            </Col>
                            <FormItem className='ageLimit' wrapperCol={{ span: 24, pull: 5 }}>
                                {getFieldDecorator('ageMax', {
                                    initialValue: product.ageMax,
                                    rules: [{ validator: this.validatorForm }]
                                })(
                                    <Input style={{ 'width': '75%' }} autoComplete="off" placeholder="请输入" onChange={this.getAgeMax} />
                                )}
                                <span>&nbsp;岁</span>
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="受众行业" {...formItemLayout}>
                                <div onClick={() => this.setDataPicker(true, 'szhy')}>
                                    {getFieldDecorator('industryText', {
                                        initialValue: product.industryText && product.industryText.split(' ').join('+') || '',
                                        rules: [{ validator: this.validatorForm }]
                                    })(
                                        <AutoComplete
                                            className="global-search"
                                            size="large"
                                            style={{ width: '100%' }}
                                            placeholder="请添加"
                                            optionLabelProp="text">
                                            <Input
                                                suffix={(
                                                    <Button className="search-btn" size="large" type="primary" onClick={() => this.setDataPicker(true, 'szhy')}>
                                                        <Icon type="plus" />
                                                    </Button>
                                                )}
                                            />
                                        </AutoComplete>
                                    )}
                                </div>
                            </FormItem>
                        </Col>
                        {/* <Col span={12}>
                            <FormItem label="审批人数" {...formItemLayout} >
                                {
                                    getFieldDecorator('approveNum', {
                                        initialValue: product.approveNum || '',
                                        rules: [{ validator: this.validatorForm }]
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" addonAfter="人" />
                                        )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="审查人数" {...formItemLayout} >
                                {
                                    getFieldDecorator('examineNum', {
                                        initialValue: product.examineNum || '',
                                        rules: [{ validator: this.validatorForm }]
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" addonAfter="人" />
                                        )}
                            </FormItem>
                        </Col> */}
                        <Col span={12} className='textarea-wrap'>
                            <FormItem label="宣传语" {...formItemLayout} >
                                {getFieldDecorator('prdAd', {
                                    initialValue: product.prdAd || '',
                                    rules: [{ validator: this.validatorForm }]
                                })(
                                    <Input placeholder="请输入宣传语" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12} className='textarea-wrap'>
                            <FormItem label="放款方式" {...formItemLayout} >
                                <div className={onLoanTypeFocus ? 'textarea-text-input  box-shadow' : 'textarea-text-input'}>
                                    {getFieldDecorator('loanType', {
                                        initialValue: product.loanType || '',
                                        rules: [{ validator: this.validatorForm }]
                                    })(
                                        <textarea placeholder="请输入放款方式描述"
                                            className="textarea-pro" rows="3" cols="45"
                                            onChange={(e) => this.contentChange(e, 'loanType')}
                                            onFocus={(e) => this.contentFocus(e, 'loanType')}
                                            onBlur={(e) => this.contentLostFocus(e, 'loanType')}
                                        >
                                        </textarea>
                                    )}
                                    <p className="des-count">{loanTypeLength}/256</p>
                                </div>
                            </FormItem>
                        </Col>
                        <Col span={12} className='textarea-wrap'>
                            <FormItem label="申请资质" {...formItemLayout} >
                                <div className={onReqConditionFocus ? 'textarea-text-input box-shadow' : 'textarea-text-input '}>
                                    {getFieldDecorator('reqCondition', {
                                        initialValue: product.reqCondition || '',
                                        rules: [{ validator: this.validatorForm }]
                                    })(
                                        <textarea placeholder="请输入申请资质描述"
                                            className="textarea-pro" rows="3" cols="45"
                                            onChange={(e) => this.contentChange(e, 'reqCondition')}
                                            onFocus={(e) => this.contentFocus(e, 'reqCondition')}
                                            onBlur={(e) => this.contentLostFocus(e, 'reqCondition')}
                                        >
                                        </textarea>
                                    )}
                                    <p className="des-count">{reqConditionLength}/256</p>
                                </div>
                            </FormItem>

                        </Col>
                        <Col span={12} className='textarea-wrap'>
                            <FormItem label="适用人群" {...formItemLayout} >
                                <div className={onAudienceFocus ? 'textarea-text-input box-shadow' : 'textarea-text-input '}>
                                    {getFieldDecorator('audience', {
                                        initialValue: product.audience || '',
                                        rules: [{ validator: this.validatorForm }]
                                    })(
                                        <textarea placeholder="请输入适用人群描述"
                                            className="textarea-pro" rows="3" cols="45"
                                            onChange={(e) => this.contentChange(e, 'audience')}
                                            onFocus={(e) => this.contentFocus(e, 'audience')}
                                            onBlur={(e) => this.contentLostFocus(e, 'audience')}
                                        ></textarea>
                                    )}
                                    <p className="des-count">{audienceLength}/256</p>
                                </div>
                            </FormItem>
                        </Col>
                        <Col span={12} style={{ position: 'relative' }} >
                            <FormItem label="产品模板" {...formItemLayout} >
                                <div className="tpl-container">
                                    <div className='product-preview-tpl'>
                                        {tplUrl ?
                                            <img className='product-img' style={{ width: '100%', height: '100%' }} src={`${tplUrl}`} alt='product-img' /> : null
                                        }
                                        {getFieldDecorator('tplCode', {
                                            initialValue: product.tplCode || '',

                                        })(
                                            <span className='select-tpl' onClick={this.sliderShow}>选择模版</span>
                                        )}
                                    </div>
                                </div>
                                <Popover placement="rightTop" overlayClassName="explain-popover" content={proContent} trigger="hover">
                                    <img className='explain-tpl-img' src={ExplainImg} alt='expTplImg' />
                                </Popover>
                            </FormItem>
                        </Col>
                        <Col span={12} style={{ position: 'relative' }}>
                            <FormItem label="是否开启预授信模式" {...formItemLayoutMore} >
                                {
                                    getFieldDecorator('creditOn', {
                                        valuePropName: 'checked',
                                        initialValue: this.state.creditOn,
                                        rules: [{ validator: this.validatorForm }]
                                    })(
                                        <Switch checkedChildren={'是'} unCheckedChildren={'否'} onChange={(checked) => this.openCredit(checked, 'credit')} disabled={disabledShow} />
                                    )}
                                <Popover placement="rightTop" overlayClassName="explain-popover" content={creContent} trigger="hover">
                                    <img className='credit-on-img' src={ExplainImg} alt='creditOnImg' />
                                </Popover>
                            </FormItem>
                        </Col>
                        {/*<Col span={12}>
                            <FormItem label="审批人数" {...formItemLayout} >
                                <Input type="text" value={state.approveNum} onChange={this.handleApproveNum} />
                            </FormItem>
                        </Col>*/}
                        {/* <Col span={24} className="attr-buttons"> */}

                        {/* </Col> */}
                    </Row>
                </Form>
                <div className="add-btns">
                    <Button className="common-small-btn" type="primary" onClick={this.pubProOption.bind(this)}>发布</Button>
                    <Button className="common-small-btn" onClick={this.addProOption.bind(this)}>保存</Button>
                </div>
                {mFrame}
                {
                    coverTpls ? <div className='slider-img'><SliderImg coverTpls={coverTpls} onChange={this.getSliderImg} ref='sliderImg' /></div> : null
                }
            </div>

        )
    }
}

const PureProductAttr = pureRender(ProductAttr);

const FormProductAttr = Form.create()(PureProductAttr);

// 将 store 中的数据作为 props 绑定到 FormProductAttr 上
const mapStateToProps = (state, ownProps) => {
    let { Common } = state;
    return {
        loading: Common.loading
    }
}

// 将 action 作为 props 绑定到 FormProductAttr 上。
const mapDispatchToProps = (dispatch, ownProps) => ({
    actions: bindActionCreators({ loading, emptyCityInd }, dispatch)
});

const ReduxProductAttr = connect(mapStateToProps, mapDispatchToProps)(FormProductAttr); // 连接redux

export default ReduxProductAttr;
