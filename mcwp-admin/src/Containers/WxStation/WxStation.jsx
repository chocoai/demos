import React, { Component } from 'react'; // 引入了React
import { Config } from '../../Config/Index';
import { Spin, message, Input, Button, Form, Select, Row, Col } from 'antd';
import WxBanner from '../../Component/WxStation/WxBanner';
import WxCenter from '../../Component/WxStation/WxCenter';
import WxActivity from '../../Component/WxStation/WxActivity';
import WxStationService from '../../Services/WxStationService';
import ProductService from '../../Services/ProductService'; // services层 产品管理
import CommonService from '../../Services/CommonService';
import './style/wxStation.less';
import { browserHistory } from 'react-router';
const WxBannerForm = Form.create()(WxBanner);
const WxCenterForm = Form.create()(WxCenter);
const WxActivityForm = Form.create()(WxActivity);
const flatten = arr => {
    return arr.reduce((acc, value) => {
        const newFields = Object.assign({}, acc.fields, value.fields)
        const newErrs = Object.assign({}, acc.errs, value.errs)
        return Object.assign(acc, { fields: newFields }, { errs: newErrs })
    })
}
class WxStation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: null,
            selectList: null,
            selectChildList: null,
            centerData: [],
            yxqdtj: null
        }
    }
    componentDidMount() {
        this.getSelectList()
        this.getWxStationConfig();
        this.getDictItems({ code: 'wxmk,yxqdtj' });
    }
    async getCommId() {
        const res = await CommonService.getCommId();
        this.setState({
            thatData: [{ code: res.data }],
        })
    }
    async getWxStationConfig() {
        let res = await WxStationService.getWxStationConfig();
        if (res.data.bannerList.length > 0) {
            res.data.bannerList = res.data.bannerList.map(item => {
                if (item.activityType == 'prod') {
                    item.tzz = 'prod'
                } else {
                    item.tzz = 'yxhd'
                }
                return item;
            })
        } 
        if (res.data.wxmk) {
            res.data.wxmk = res.data.wxmk.split(',')
        }
        this.setState({
            data: res.data
        })
    }
    getSelectList = async (params) => {
        let res = await WxStationService.getSelectListAll();
        this.setState({
            selectList: res.data
        })
    }
    async getDictItems(params) {
        let { centerData } = this.state;
        let res = await CommonService.getDictItems(params);
        res.data.wxmk.map((item, index) => {
            centerData.push({
                label: item.ddText,
                value: item.ddValue
            })
            return centerData
        })
        this.setState({
            centerData: centerData,
            yxqdtj: res.data.yxqdtj
        })
    }
    goBack = () => {
        window.location.href = '/market/wxstation'
    }
    save = () => {
        const that = this;
        Promise.all([
            this.getSubFormValue('wxBanner'),
            this.getSubFormValue('wxActivity'),
            this.getSubFormValue('wxCenter'),
        ]).then(result => {
            let arr = [];
            arr[0] = flatten([result[0]]);
            arr[1] = flatten([result[1]]);
            arr[2] = flatten([result[2]]);
            if (arr[0].fields) {
                arr[0].fields.bannerList = arr[0].fields.bannerList.map(item => {
                    if(item.proType&&(!item.activityType)){
                        item.activityType='prod'
                    }
                    item.place = 3;
                    delete item.img;
                    delete item.tzz;
                    return item
                })
            }
            if (arr[1].fields) {
                arr[1].fields.activityList = arr[1].fields.activityList.map(item => {
                    item.place = 1;
                    delete item.img;
                    return item
                })
            }
            if (arr[2].fields.wxmk) {
                arr[2].fields.wxmk = arr[2].fields.wxmk.join(',')
            }
            arr[0].fields.bannerList=arr[0].fields.bannerList.filter(item=>item!='')
            arr[1].fields.activityList=arr[1].fields.activityList.filter(item=>item!='')
            let params = Object.assign(Config.serializeObjects(arr[0].fields), Config.serializeObjects(arr[1].fields));
            params.wxmk = arr[2].fields.wxmk;
            // console.log(arr)
            this.putWxStationConfig(params)
        })
    }
    async putWxStationConfig(params) {
        let res = await WxStationService.putWxStationConfig(params);
        if (res.code == Config.errorCode.success) {
            message.success('修改成功')
        }
    }
    getSubFormValue(formName) {
        return new Promise(resolve => {
            if (this[formName]) {
                this[formName].validateFields((errs, fields) => {
                    if (errs) {
                        message.error('存在不符合要求项，请及时修改')
                        // resolve({ errs, fields })
                    } else {
                        resolve({ errs, fields })
                    }
                })
            } else {
                resolve({})
            }
        })
    }
    render() {
        let { loading, centerData, data, yxqdtj, selectList, selectChildList } = this.state
        return (
            <Spin tip={Config.warnInfo.spinText} spinning={loading}>
                <div className="common-console-container wxStation-container">
                    <div className="wxstation-content">
                        <div className="wxstation-title">
                            <p className="wxstation-p">首页banner配置</p>
                        </div>
                        {data && data.bannerList &&selectList&& <WxBannerForm ref={form => this.wxBanner = form} bannerList={data.bannerList} len={data.bannerList.length} getSelectList={this.getSelectList} yxqdtj={yxqdtj} selectList={selectList} selectChildList={selectChildList} />}
                    </div>
                    <div className="wxstation-content">
                        <div className="wxstation-title">
                            <p className="wxstation-p">热门活动配置</p>
                        </div>
                        {data && data.activityList &&selectList&& <WxActivityForm ref={form => this.wxActivity = form} activityList={data.activityList} len={data.activityList.length} getSelectList={this.getSelectList} yxqdtj={yxqdtj} selectList={selectList} selectChildList={selectChildList} />}
                    </div>
                    <div className="wxstation-content">
                        <div className="wxstation-title">
                            <p className="wxstation-p">个人中心模块配置</p>
                        </div>
                        <WxCenterForm ref={form => this.wxCenter = form} wxmk={data && data.wxmk} centerData={centerData} />
                    </div>

                    <div className="wxstation-button">
                        <Button className="wxstation-submit" type="primary" onClick={this.save}>保存</Button>
                    </div>
                </div>
            </Spin>
        )
    }
}
export default WxStation;