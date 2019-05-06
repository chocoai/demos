import React, { Component } from 'react'; // 引入了React
import { Config } from '../../Config/Index';
import moment from 'moment';

import BaseService from '../../Services/BaseService';
import ValuationService from '../../Services/ValuationService';
import MarChannelService from '../../Services/MarChannelService'; // services层 营销管理 —— 渠道管理
import { Link } from 'react-router';

import ResetSearch from './../../Component/Common/ResetSearch';
import qrImg from './../../Assets/Images/img-qr.png';
import './style/valuation.less';

import { TreeSelect, Table, Input, Button, message, DatePicker, Modal, Checkbox, Select, Popover } from 'antd';
const Search = Input.Search;
const Option = Select.Option;

/**
 * 估值管理
 * @Author:
 * @Date:   2017-12-29
 * @Last Modified by:   钟观发
 * @Last Modified time: 2017-12-29
 */
class ValuationIndex extends Component {
    constructor(props) {
    	super(props);
    	this.state = {
        valuatioList: [],
        pagination: {
          showSizeChanger: true, // 是否可以改变 pageSize
          showQuickJumper: true, // 是否可以快速跳转至某页
          pageSizeOptions: ['5', '10','15'],// 指定每页可以显示多少条
          total: 0,
          showTotal: (total, range) => `共  ${total}  条`,
          visible: false //模态款控制
        },
        params: {
          page: 1,
          rows: 10
        },
        addParams: {
          hasHourseValuation: 0,
          hasCarValuation: 0,
          hasIncomeValuation: 0,
          jumpType: '1',
          prdCode: '',
          coefficient: 0
        },
        startValue: null,          // 搜索开始时间
        endValue: null,            // 搜索结束时间
        prodList: [],
        jumpType: '1',
        visible: false,
        valuatioDepl: ['1'],
        defaultValue: ['1']
		};
	}
	componentDidMount() {
        let that = this;
        let params = that.state.params
        const enterprCode = Config.localItem('ENTERP_CODE');  // 当前用户企业
        that.getValuationInfo(params);
        this.getProdList(enterprCode);
        this.getValuationDepl();
        that.getSysDictItems({code: 'yxqdlb'});
        that.getChannelType()
    }
    async getChannelType() {
        const that = this;
        const res = await MarChannelService.getChannelType();
        if (res.code == Config.errorCode.success) {
            // todo 以后数据量过大优化，对yxqdlb做处理
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
            that.setState({
                channelTypeData: tmpArr,
                channelType: res.data
            })
            // that.getSysDictItems({ code: 'yxqdlb,yxqd,yxqdtj' }, res.data);
        } else {
            message.error(res.msg);
        }
    }
    getSysDictItems(params) { // 根据字典代码获取字典列表
        const that = this;
        BaseService.getSysDictItems(params, (res) => {
        if(res.code == Config.errorCode.success) {
            that.setState({
            dictItems: res.data
            });
        } else {
            message.error(res.msg);
        }
        })
    }
    getProdList (enterprCode) { // 行业规则详情
		const that = this
		let params = {
			enterprCode: enterprCode
		}
        Config.get('/comm/prod/list/' + enterprCode, params, (res) => {
            if(res.code == Config.errorCode.success) {
				let data = res.data
				if (data && data.length > 0) {
					let newArr = [];
					for(let i = 0; i<data.length; i++) {
						newArr.push({
							ddItem: 'cplb',
							ddText: data[i].prdName,
							ddValue: data[i].code,
							dictDTOS: [],
							index: i+10,
							parentValue: '0'
						})
					}
					that.setState({
						prodList: that.state.prodList.concat(newArr)
					})
				}

         	} else {
                message.error(res.msg);
         	}
        });
    }
    getValuationDepl = () => {
        ValuationService.getValuationDepl({}, (res) => {
            if (res.code == Config.errorCode.success) {
                const data = res.data || {};
                let defaultValue = [];
                if (data.hasHourseValuation) {
                    defaultValue.push('1')
                }
                if (data.hasCarValuation) {
                    defaultValue.push('2')
                }
                if (data.hasIncomeValuation) {
                    defaultValue.push('3')
                }
                this.setState({
                  valuatioDepl:  data,
                  defaultValue: defaultValue,
                  oldValue: defaultValue,
                  addParams: {
                    hasHourseValuation: data.hasHourseValuation ? 1 : 0,
                    hasCarValuation: data.hasCarValuation ? 1 : 0,
                    hasIncomeValuation: data.hasIncomeValuation ? 1 : 0,
                    jumpType: data.jumpType || 1,
                    prdCode: data.jumpPrdCode,
                    coefficient: data.coefficient
                  },
                  defaultParams: {
                    hasHourseValuation: data.hasHourseValuation ? 1 : 0,
                    hasCarValuation: data.hasCarValuation ? 1 : 0,
                    hasIncomeValuation: data.hasIncomeValuation ? 1 : 0,
                    jumpType: data.jumpType || 1,
                    prdCode: data.jumpPrdCode,
                    coefficient: data.coefficient
                  },
                  jumpType: data.jumpType || 1,
                  oldType: data.jumpType
                });
            } else {
                message.error(res.msg);
            }
        })
    }
    getValuationInfo = (params) => { // 获取估值工具列表
        let that = this;
        let pagination = that.state.pagination;
        ValuationService.getValuationInfo(params, (res) => {
          if (res.code == Config.errorCode.success) {
            const data = res.data;
            pagination.total = res.recordsTotal
            if (data) {
              that.setState({
                valuatioList:  data,
                pagination: pagination
              });
            }
          } else {
              message.error(res.msg);
          }
        })
    }
       // 根据时间筛选 重置页码
       onStartTimeChange = (value) => {
        this.onChange('startValue',value)
        let params = this.state.params;
        let dateKey = this.state.dateKey;
        if(dateKey) {
            delete params.endTime;
            delete params.startTime;
        }
        if(value) {
            params.startTime = value.format('YYYY-MM-DD');
        } else {
            delete params.startTime;
        }
        this.setState({
			dateKey: 0,
			params: params
		});
        params.page = 1;
        this.getValuationInfo(params);
    }
    onEndTimeChange = (value) => {
        this.onChange('endValue',value)
        let params = this.state.params;
        let dateKey = this.state.dateKey;
        if(dateKey) {
            delete params.endTime;
            delete params.startTime;
        }
        if(value) {
            params.endTime = value.format('YYYY-MM-DD');
        } else {
            delete params.endTime;
        }
        this.setState({
			dateKey: 0,
			params: params
		});
        params.page = 1;
        this.getValuationInfo(params);
    }
    // 禁用开始时间
    disabledStartDate = (startValue) => {
        const endValue = this.state.endValue;
        if (!startValue || !endValue) {
          return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    }
    //  禁用结束时间
    disabledEndDate = (endValue) => {
        const startValue = this.state.startValue;
        if (!endValue || !startValue) {
          return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    }
    // 根据开始和禁用时间来设置this.state.startValue  OR  endValue
    onChange = (field, value) => {
        this.setState({
          [field]: value,
        });
    }
    searchDateKey = (dateKey) => { // 本周、本月、近三个月
		let params = this.state.params;
		params.startTime = moment().subtract(dateKey, 'days').format('YYYY-MM-DD');
		params.endTime = moment().format('YYYY-MM-DD');
		this.setState({
			dateKey: dateKey,
			params: params,
			endValue: null,
			startValue: null
		});
		params.page = 1; //重置页码
        this.getValuationInfo(params);
    }
    searchData = (value) => { // 根据银行名称或姓名搜索 重置页码
        let keyWord = value;
        let params = this.state.params;
        if(Config.isNull(keyWord)){
            delete params.keyWord;
        } else {
            params.keyWord = keyWord;
        }
        params.page = 1;
        this.getValuationInfo(params);
    }
    showModal = () => {
      this.setState({
        visible: true
      });
    }
    changeValue = (checkedValues) => {
      let that = this
      let addParams = that.state.addParams
      // addParams.hasHourseValuation = checkedValues && checkedValues.length > 0 && checkedValues.indexOf('1') > -1 ? 1 : 0,
      // addParams.hasCarValuation = checkedValues && checkedValues.length > 0 && checkedValues.indexOf('2') > -1 ? 1 : 0,
      // addParams.hasIncomeValuation = checkedValues && checkedValues.length > 0 && checkedValues.indexOf('3') > -1 ? 1 : 0,
      if(checkedValues && checkedValues.length > 0 && checkedValues.indexOf('1') > -1) {
          addParams.hasHourseValuation = 1
      } else {
          addParams.hasHourseValuation = 0
      }
      if(checkedValues && checkedValues.length > 0 && checkedValues.indexOf('2') > -1) {
          addParams.hasCarValuation = 1
      } else {
          addParams.hasCarValuation = 0
      }
      if(checkedValues && checkedValues.length > 0 && checkedValues.indexOf('3') > -1) {
          addParams.hasIncomeValuation = 1
      } else {
          addParams.hasIncomeValuation = 0
      }
      that.setState({
        addParams: addParams,
        defaultValue: checkedValues || []
      });
    }
    linKChange = (value) => {
        let that = this
        let jumpType = ''
        let addParams = that.state.addParams
        if (value) {
            addParams.jumpType = value.key
            jumpType = value.key
        } else {
            delete addParams.jumpType
        }
		this.setState({
            addParams: addParams,
            jumpType: jumpType
		})
    }
    selectProd = (value) => {
      let that = this
      let addParams = that.state.addParams
      if (value) {
          addParams.prdCode = value.key
      } else {
          delete addParams.prdCode
      }
      this.setState({
        addParams: addParams
      })
    }

    heightCoef = (e) => {
        let that = this
        let addParams = that.state.addParams
        if(e) {
            addParams.coefficient = e.target.value
        }
        this.setState({
            addParams: addParams
        })
    }
    handleCancel = (e) => {
        const {oldValue, defaultParams, oldType, } = this.state;
        this.setState({
          visible: false,
          addParams: Object.assign({}, defaultParams),
          defaultValue: oldValue,
          jumpType: oldType
        });
      }
    // 修改估值工具
    handleOk = () => {
        let that = this
        let { addParams } = that.state;
        if (addParams.jumpType != 3) delete addParams.prdCode;
        ValuationService.putValuationDepl(addParams, (res) => {
            if (res.code == Config.errorCode.success) {
                message.success('修改成功');
                let defaultValue = [];
                if (addParams.hasHourseValuation) {
                    defaultValue.push('1')
                }
                if (addParams.hasCarValuation) {
                    defaultValue.push('2')
                }
                if (addParams.hasIncomeValuation) {
                    defaultValue.push('3')
                }
                that.setState({
                    visible: false,
                    oldType: addParams.jumpType,
                    oldValue: defaultValue,
                    defaultParams: Object.assign({}, addParams)
                });
            } else {
                message.error(res.msg);
            }
        });
    }
    changeTable = (page, pageSize) => {
      let that = this
      let params = that.state.params;
      params.page = page.current;
      params.rows = page.pageSize;
      that.getValuationInfo(params);
    }
    getQRImg = () => {
      Config.get('/v1/valuation/QRCode', {} , (res) => {
        if(res.code == Config.errorCode.success) {
            this.setState({
                QRImg:res.data
            })
        } else {
            message.error(res.msg);
        }
      });
    }
    CopyAll = () => {//点击复制文本框内容
      let ele =this.refs.url;
       ele.focus();
       ele.select();
       document.execCommand('Copy');
       message.success('已复制！');
    }
    changeSelect(value, dateString, key) { // 下来框改变
      const that = this;
      let { params } = that.state;
      if (key === 'channel') { // 渠道名称
        if(value) {
          params.channel = value;
        } else {
          delete params.channel;
        }
        params.page = 1;
        that.getValuationInfo(params);
      }
    }
	  render() {
      const that = this;
      const { jumpType, startValue, channelTypeData, endValue, prodList, valuatioList, pagination, defaultValue, QRImg, addParams, dictItems } = that.state;
      const columns = [{
        title: '客户姓名',
        dataIndex: 'name',
        key: 'name',
        width: 100,
        render: (text, record) => (
          <span className="reason-text">
            { text ?<span>{text}</span> : '--' }
          </span>
        )
      }, {
        title: '联系方式',
        dataIndex: 'telephone',
        key: 'telephone',
        width: 100,
        render: (text, record) => (
          <span className="reason-text">
            { text ?<span>{text}</span> : '--' }
          </span>
        )
      }, {
        title: '来源渠道',
        dataIndex: 'channelText',
        key: 'channelText',
        width: 100,
        render: (text, record) => (
          <span className="reason-text">
            { text ?<span>{text}</span> : '--' }
          </span>
        )
      }, {
        title: '微信号',
        dataIndex: 'wechat',
        key: 'wechat',
        width: 100,
        render: (text, record) => (
          <span className="reason-text">
            { text ?<span>{text}</span> : '--' }
          </span>
        )
      }, {
        title: '总估值（万元）',
        dataIndex: 'assetTotal',
        key: 'assetTotal',
        width: 100,
        render: (text, record) => (
          <span className="reason-text">
            { text ? <span>{text}</span> : '--' }
          </span>
        )
      }, {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        width: 100,
        render: (text, record) => (
          <span className="remark-text">
            { text ? <span>{text}</span> : '--' }
          </span>
        )
      }, {
        title: '时间',
        dataIndex: 'createDate',
        key: 'createDate',
        width: 150,
        render: (text, record) => (
          <span>
            {Config.formatDateTime(text)}
          </span>
        )
      }, {
        title: '操作',
        key: 'action',
        width: 100,
        render: (text, record) => (
          <Link to={'/market/valuation/detail/' + record.code}>
            <span style={{cursor: 'pointer', 'color': '#5292fc'}}>查看</span>
          </Link>
        )
      }];

      const options = [
        { label: '房屋评估', value: '1' },
        { label: '车辆评估', value: '2' },
        { label: '月收入评估', value: '3' },
      ];
      const content = (
        <div>
          { QRImg ?
            <div>
              <input type="text" readOnly="readonly" className="url-input"  defaultValue={QRImg.prdUrl} ref='url'/><Button style={{display:'inline-block'}} onClick={() =>this.CopyAll()}>复制</Button><br/>
              <img className='QR-img' style={{width:'180px', height:'180px'}} src={`data:image/png;base64,${QRImg.picture}`} alt='product-qrc-img' />
            </div>
            : <p className='product-word'>二维码获取失败</p>
          }
        </div>
      );
    let jumpObj = [{'key': '1'}, {'key': '1'}, {'key': '2'}, {'key': '3'}];
    let jumpValue = jumpType ? jumpObj[jumpType] : {'key': '1'};
		return (
			<div className="common-console-container valuation-container">
				<div className="common-search-section">
                    <div className="date-search-container">
                        <div className='search-item' data-flex="dir:left">
                            <DatePicker
                                ref='startTime'
                                placeholder="开始时间"
                                style={{ width: 150 }}
                                onChange={this.onStartTimeChange}
                                format='YYYY-MM-DD'
                                value={startValue}
                                disabledDate={this.disabledStartDate}
                                getCalendarContainer={trigger => trigger.parentNode}
                            />
                            <DatePicker
                                placeholder="结束时间"
                                style={{ width: 150 }}
                                onChange={this.onEndTimeChange}
                                format='YYYY-MM-DD'
                                value={endValue}
                                disabledDate={this.disabledEndDate}
                                getCalendarContainer={trigger => trigger.parentNode}
                            />
                        </div>
                        {/* <Select
                        className="search-item"
                        style={{ width: 150 }}
                        placeholder="来源渠道"
                        optionFilterProp="children"
                        onChange={(value, options) => that.changeSelect(value, options, 'channel')}
                        getPopupContainer={trigger => trigger.parentNode}
                        >
                        {
                            dictItems && dictItems.yxqdlb && dictItems.yxqdlb.map((item, index)=>(
                            item.dictDTOS.length > 0 && item.dictDTOS.map((cItem, cIndex) => (
                                <Option value={ cItem.ddValue + '' } key={cIndex}>{ cItem.ddText }</Option>
                            ))
                            ))
                        }
                        </Select> */}
                        <TreeSelect
                            showSearch
                            style={{ width: 150 }}
                            size={'large'}
                            dropdownStyle={{ width: '150px', maxHeight: 400, overflow: 'auto' }}
                            placeholder="渠道"
                            treeData={channelTypeData}
                            allowClear
                            treeDefaultExpandAll
                            treeNodeFilterProp={'label'}
                            onChange={(value, options) => that.changeSelect(value, options, 'channel')}
                            className="common-search-treeSelect"
                        />
                        <Search className='search-item' style={{width:'150px'}} placeholder="客户姓名/联系方式" onSearch={this.searchData} />
                        <div className='search-item'>
                            <span className={`time-item ${this.state.dateKey == 6 ? "time-selected" : ""}`} onClick={this.searchDateKey.bind(this, 6)}>近一周</span>
                            <span className={`time-item ${this.state.dateKey == 29 ? "time-selected" : ""}`} onClick={this.searchDateKey.bind(this, 29)}>近一月</span>
                            <span className={`time-item ${this.state.dateKey == 89 ? "time-selected" : ""}`} onClick={this.searchDateKey.bind(this, 89)}>近三个月</span>
                        </div>
                        <ResetSearch />
                    </div>
                </div>
                <div className="common-action-section">
                    <Button className="common-btn valuation-btn" onClick={()=>this.showModal()}  type="primary">设置估值工具</Button>
                    <div className='valuation-info'>
                        <Popover placement="rightTop" content={content} trigger="hover">
                          <img className='preivew-delete' src={qrImg} onMouseOver={() => this.getQRImg()}  alt='product-qr-info' />
                        </Popover>
                    </div>
                </div>
                <div className="common-content-container">
                    <Table
                        rowKey={record => record.code}
                        columns={columns}
                        dataSource={valuatioList}
                        pagination={pagination}
                        onChange={this.changeTable}
                    />
                </div>
                <Modal
                    title="设置估值工具"
                    className="valuation-modal"
                    key={this.state.mainModalKey}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    footer={null}
                >
                    <div className="addtask-first-item row-title">
                        <p className="addtask-title">估值工具配置</p>
                        <Checkbox.Group onChange={(e)=>this.changeValue(e)} options={options} value={defaultValue}>
                        </Checkbox.Group>
                    </div>
                    <div className="addtask-first-item row-title">
                        <p className="addtask-title">跳转至</p>
                        <Select
                            labelInValue
                            placeholder="链接地址"
                            optionFilterProp="children"
                            style={{ width: 120,height:32 }}
                            className="valuation-select"
                            onChange={this.linKChange}
                            value={jumpValue}
                            filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            getPopupContainer={trigger => trigger.parentNode}
                            >
                            <Option key={1} value='1'>无链接</Option>
                            <Option key={2} value='2'>产品列表页</Option>
                            <Option key={3} value='3'>产品页面</Option>
                        </Select>
                        {
                            jumpType == 3 ?
                            <Select
                                labelInValue
                                placeholder="选择产品"
                                optionFilterProp="children"
                                style={{ width: 120,height:32 }}
                                onChange={this.selectProd}
                                value={{key: addParams.prdCode}}
                                filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                getPopupContainer={trigger => trigger.parentNode}
                                >
                                {
                                    prodList.map((item,index)=>(
                                        <Option key={index} value={item.ddValue}>{item.ddText}</Option>
                                    ))
                                }
                            </Select> : null
                        }
                    </div>
                    <div className="addtask-first-item row-title">
                        <p className="addtask-title">最高可贷额度为身价的</p>
                        <Input onChange={this.heightCoef} value={addParams.coefficient} style={{ width: 120,height:36 }} placeholder="请输入"/>&nbsp;&nbsp;&nbsp;%
                    </div>
                    <div style={{textAlign: 'center',marginTop: '20px',width: '100%'}}>
                        <Button key="ok" type="primary" className="common-small-btn" onClick={this.handleOk}>确定</Button>
                        <Button key="cancel" className="common-small-btn" style={{marginLeft: '20px'}} onClick={this.handleCancel}>取消</Button>
                    </div>
                {/* <div className="select-valuation">
                    <div className='valuation-list' onClick={()=>this.selectValuation(1)}>房屋评估</div>
                    <div className='valuation-list' onClick={()=>this.selectValuation(2)}>车辆评估</div>
                    <div className='valuation-list' onClick={()=>this.selectValuation(3)}>月收入评估</div>
                </div> */}
                </Modal>
		    </div>
		);
	}
}

export default ValuationIndex;
