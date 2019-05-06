import React, { Component } from 'react'; // 引入了React
import { Config } from '../../Config/Index';
import ValuationService from '../../Services/ValuationService';
import BcrumbItem from '../../Component/Breadcrumb/BcrumbItem';
import { Row, Col, Spin, message, Button, Modal, Timeline } from 'antd';
import { browserHistory } from 'react-router';

import './style/valuationDetail.less';
/**
 * 营销管理 -- 营销记录 -- 记录详情
 * @Author: 魏昌华
 * @Date:   2018-03-07
 * @Last Modified by:   魏昌华
 * @Last Modified time: 2018-03-07
 */

class ValuationDetail extends Component {
  constructor(props) {
    super(props);
    const code = props.routeParams.code;
    this.state = {
      wordCount: 0,
      loading: false,
      visible: false,
      valuation: null,
      code: code,
      remarkParmas: {
        code: code,
        remark: null
      }
    }
  }
  componentDidMount() {    
    const that = this;
    that.getValuationDetail()
  }
  async getValuationDetail(params) {
    const that = this;
    const { code } = that.state;
    const res = await ValuationService.getValuationDetail({code: code});
    if (res.code == Config.errorCode.success) {
      that.setState({
        valuation: res.data
      });
    } else {
      message.error(res.msg);
    }
  }
  remarkDescribe(e) { // textarea发生变化
    const that = this;
    const { remarkParmas } = that.state;
    if (e.target.value.length > 256 ) {
      e.target.value = e.target.value.substr(0, 256);
      return;
    }
    remarkParmas.remark = e.target.value;
    that.setState({
      wordCount: e.target.value.length,
      remarkParmas: remarkParmas
    })
  }
  contentSync() {
    //此步为了让删减的时候高度改变
    this.remarkContent.style.height = 100 + 'px';
    this.remarkContent.style.height = this.remarkContent.scrollHeight + 'px';    
  }
  async addValuationRemark(key) { // 新增估值记录备注
    const that = this;
    const { remarkParmas } = that.state;
    if (key === 'cancel') {
      browserHistory.goBack();
    }
    if (key === 'ok') {
      if (Config.trimSides(remarkParmas.remark)) {
        const res = await ValuationService.addValuationRemark(remarkParmas);
        if (res.code == Config.errorCode.success) {
          message.success('新增估值记录备注成功！');
          browserHistory.goBack();
        } else {
          message.error(res.msg);
        }
      } else {
        browserHistory.goBack();
      }
    }
  }
  doRemake(bool) { // 查看备注记录
    const that = this;
    that.setState({
      visible: bool
    });
  }
	render() {
    const that = this;
    const bcrumb = [{
      'link': '/market/valuation',
      'value': '营销记录'
    }, {
      'link': null,
      'value': '记录详情'
    }];
    const { valuation, loading, wordCount, visible } = that.state;
		return (	
		<Spin tip={Config.warnInfo.spinText} spinning={loading}>
      <BcrumbItem bcrumb={bcrumb} />
			<div className="valuation-detail">
        <Row className="valuation-detail-content">
          <Col span={6} className="title">
            <span>客户姓名：{valuation && valuation.name ? valuation.name : '--'}</span>
          </Col>
          <Col span={6} className="title">
            <span>联系方式：{valuation && valuation.telephone ? valuation.telephone : '--'}</span>
          </Col>
          <Col span={6} className="title">
            <span>来源渠道：{valuation && valuation.channelText ? valuation.channelText : '--'}</span>
          </Col>
          <Col span={6} className="title">
            <span>微信号：{valuation && valuation.wechat ? valuation.wechat : '--'}</span>
          </Col>
          <Col span={6} className="title">
            <span>总估值：{valuation && valuation.assetTotal ? valuation.assetTotal + '万元' : '--'}</span>
          </Col>
          <Col span={6} className="title">
            <span>房屋估值：{valuation && valuation.houseTotal ? valuation.houseTotal + '万元' : '--'}</span>
          </Col>
          <Col span={12} className="title">
              <span>房屋地址：{valuation && valuation.houseAddress ? valuation.houseAddress : '--'}</span>
          </Col>
          <Col span={6} className="title">
              <span>车辆估值：{valuation && valuation.carTotal ? valuation.carTotal + '万元' : '--'}</span>
          </Col>
          <Col span={6} className="title">
              <span>流水估值：{valuation && valuation.wageTotal ? valuation.wageTotal + '万元' : '--'}</span>
          </Col>	  
          <Col span={12} className="title">
            <span>时间：{valuation && valuation.createDate ? Config.formatDateTime(valuation.createDate) : '--'}</span>
          </Col>  
          <Col span={12} className="title">
            <div className="remark-item">
              <label htmlFor="remarkName" className="remark-title">备注：</label>
              <textarea  id="remarkName" className="remark-name" placeholder="备注信息" ref={ref=>{this.remarkContent=ref}} onChange={(e)=>{this.remarkDescribe(e);this.contentSync()}}></textarea>
              <p className="remark-count">{wordCount}/256</p>
              {
                valuation && valuation.list.length > 0 ? <p className="remark-history" onClick={() => that.doRemake(true)}>查看备注记录</p> : null
              }
            </div>
          </Col>
        </Row>
        <div style={{textAlign: 'left', marginTop: '20px', paddingLeft: '10px', width: '100%'}}>
          <Button key="ok" type="primary" className="common-btn reset-button" onClick={() => that.addValuationRemark('ok')}>保存</Button>
          <Button key="cancel" className="common-btn reset-button" style={{marginLeft: '20px'}} onClick={() => that.addValuationRemark('cancel')}>取消</Button>
        </div>
        <Modal
          title="备注记录"
          className="remake-modal"
          visible={visible}
          footer=""
          onCancel={() => this.doRemake(false)}
          >
          <Timeline>
            {
              valuation && valuation.list.map((item, index)=>(
                <Timeline.Item key={index}>
                  <p className="time-p">
                    <span>{Config.formatDateTime(item.createDate)}</span>
                  </p>
                  <p className="time-p"><span>操作人：</span><span>{item.createName ? item.createName : '--'}</span></p>
                  <p className="time-p"><span>备注：</span><span>{item.remark ? item.remark : '--'}</span></p>
                </Timeline.Item>
              ))
            }
          </Timeline>
				</Modal>
			</div>
		</Spin>
		);
	}
}

export default ValuationDetail;

