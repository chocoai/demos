import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import moment from 'moment';
import { message } from 'antd';
import { Config } from '../../Config/Index';
import { Validate } from '../../Config/Validate';
import CarouselImg from './CarouselImg';
import './style/editAssetMachine.less';
import ipiecesAdd from './../../Assets/Images/entrymanagement_icon_add.png';
import ipiecesDelete from './../../Assets/Images/icon_remove.png';

import { DatePicker, Form, Input, Row, Col } from 'antd';
const FormItem = Form.Item;

/**
 * 进件编辑资产信息机器设备信息
 * @Author: 钟观发
 * @Date:   2017-10-26 
 * @Last Modified by:   钟观发
 * @Last Modified time: 2017-10-26 
 */
class EditAssetMachine extends Component {
        constructor(props) {
        super(props);
        this.state = {
            pictureInfo:'',
            preview:false,
            itemArr:[...Array(props.len || 1)].map((_, i)=> i),
            max: props.len || 1
        }
    }

    componentWillMount() {
    }

    //增加
    ipiecesItemAdd = () => {
        let max = this.state.max;
        this.setState({ 
            'itemArr': [...this.state.itemArr, max],
            max: max + 1                
        })
    }
    //删除
    ipiecesItemDelete = (itemDelete) => {
        this.setState({ 'itemArr': [...this.state.itemArr.filter((item,index)=>item != itemDelete)]})
    }
    previewHide = () => {
        this.setState({
            preview: false,
            pictureInfo: ''
        })
    }
    getPictureCars = () => {  // 车辆照片信息
    	let code = this.props.code; 
    	Config.get('/v1/oss/'+ code + '/LOAN_MACHINE_INFO/*', {}, (res) => {
            if(res.code == Config.errorCode.success) {  
            	if(res.data && res.data.LOAN_MACHINE_INFO && res.data.LOAN_MACHINE_INFO.length){   
            		this.setState({
                        pictureInfo: res.data.LOAN_MACHINE_INFO, 
                        preview: true
                    });
            	}else{
            		message.error(Config.warnInfo.uploadImg);                     
            	}
            } else {
                message.error(res.msg);
            }
        });
    }

    priceChange = () => {
        const {itemArr} = this.state
        this.props.loanAssetInfoCost('machinePrice', itemArr.reduce((sum, i) => sum += +this[`price${i}`].refs.input.value, 0))
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
        };
        const formTextareaLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 }
        };
        const { loanAssetMachines, openUploadImg } = this.props;
        let dateGet = [];
        if(loanAssetMachines && loanAssetMachines[0] && loanAssetMachines[0].buyDate){
            loanAssetMachines.map((item,index)=>{
                if (item.buyDate) {
                    dateGet[index] = moment(item.buyDate)
                } else {
                    dateGet[index] = null;
                }
            })
        }
        const {pictureInfo} = this.state
        return (
            <div className='editAssetMachine-container'>
                <Form>
                <p className='ipieces-subtitle'>机器设备
                    <span className='ipieces-subtitle-attachment' onClick={this.getPictureCars}>查看文件</span>
                    <span className='ipieces-subtitle-attachment' onClick={()=>openUploadImg(Config.bizType.loanMachine)}>添加文件</span>
                </p>                
                {
                    this.state.itemArr.map((item,index)=>(
                        item == 0 ?
                        <div className='asset-cars' key={item}>
                            <Row>  
                                <Col span={12}>
                                    <FormItem label="名称" {...formTextareaLayout}>
                                        {getFieldDecorator('loanAssetMachines['+ item +'].name', {
                                            initialValue: loanAssetMachines && loanAssetMachines[item] && loanAssetMachines[item].name ,
                                            rules: [{ required: true, message: Validate.warnInfo.wordLen25, validator: Validate.checkWordLen25 }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" />
                                        )}
                                    </FormItem>    
                                </Col> 
                                <Col span={12}>
                                    <FormItem label="购买时间" {...formTextareaLayout}>
                                        {getFieldDecorator('loanAssetMachines['+ item +'].buyDate', {
                                            initialValue: dateGet[item],
                                            rules: [{ required: false, message: '' }],
                                        })(
                                            <DatePicker
                                                getCalendarContainer={trigger => trigger.parentNode}
                                            />
                                        )}
                                    </FormItem>    
                                </Col>      
                                <Col span={8}>
                                    <FormItem label="金额" {...formItemLayout}>
                                        {getFieldDecorator('loanAssetMachines['+ item +'].balance', {
                                            initialValue: loanAssetMachines && loanAssetMachines[item] && loanAssetMachines[item].balance ,
                                            rules: [{ required: true, message: Validate.warnInfo.numberLenFtwo, validator: Validate.checkNumLenFtwo }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" addonAfter="万元" ref={price => {this[`price${item}`] = price}} onBlur = {this.priceChange} />
                                        )}
                                    </FormItem>    
                                </Col>      
                            </Row>
                        </div>
                         :
                        <div className='asset-cars' key={item}>
                            <Row>  
                                <Col span={12}>
                                    <FormItem label="名称" {...formTextareaLayout}>
                                        {getFieldDecorator('loanAssetMachines['+ item +'].name', {
                                            initialValue: loanAssetMachines && loanAssetMachines[item] && loanAssetMachines[item].name ,
                                            rules: [{ required: true, message: Validate.warnInfo.wordLen25, validator: Validate.checkWordLen25 }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" />
                                        )}
                                    </FormItem>    
                                </Col> 
                                <Col span={12}>
                                    <FormItem label="购买时间" {...formTextareaLayout}>
                                        {getFieldDecorator('loanAssetMachines['+ item +'].buyDate', {
                                            initialValue: dateGet[item],
                                            rules: [{ required: false, message: '' }],
                                        })(
                                            <DatePicker
                                                getCalendarContainer={trigger => trigger.parentNode}
                                            />
                                        )}
                                    </FormItem>    
                                </Col>      
                                <Col span={8}>
                                    <FormItem label="金额" {...formItemLayout}>
                                        {getFieldDecorator('loanAssetMachines['+ item +'].balance', {
                                            initialValue: loanAssetMachines && loanAssetMachines[item] && loanAssetMachines[item].balance ,
                                            rules: [{ required: true, message: Validate.warnInfo.numberLenFtwo, validator: Validate.checkNumLenFtwo }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" addonAfter="万元" ref={price => {this[`price${item}`] = price}} onBlur = {this.priceChange} />
                                        )}
                                    </FormItem>    
                                </Col>
                            </Row>
                            <img className='ipieces-delete' src={ipiecesDelete} alt='delete' onClick={()=>this.ipiecesItemDelete(item)} />
                        </div>    
                    ))
                }
                    <div className='ipieces-add' onClick={this.ipiecesItemAdd}>
                        <img className='ipieces-add-img' src={ipiecesAdd} alt='add' />
                        <span className='ipieces-add-detail'>添加机器设备</span>
                    </div>
                </Form>
                <CarouselImg pictureInfo={pictureInfo} previewPic={this.state.preview} previewHide={this.previewHide} />                                                                                                   
            </div>
        )
    }
}

const pureEditAssetMachine = pureRender(EditAssetMachine);

export default pureEditAssetMachine;