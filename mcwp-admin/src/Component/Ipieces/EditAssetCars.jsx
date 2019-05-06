import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import moment from 'moment';
import { message } from 'antd';
import { Config } from '../../Config/Index';
import { Validate } from '../../Config/Validate';
import './style/editAssetCars.less';
import CarouselImg from './CarouselImg';
import ipiecesAdd from './../../Assets/Images/entrymanagement_icon_add.png';
import ipiecesDelete from './../../Assets/Images/icon_remove.png';

import { Switch, DatePicker, Form, Input, Row, Col } from 'antd';
const FormItem = Form.Item;

/**
 * 进件编辑资产信息车辆信息
 * @Author: 赵俊
 * @Date:   2017-05-31 
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-07-25
 */
class EditAssetCars extends Component {
        constructor(props) {
        super(props);
        this.state = {
            pictureInfo:'',
            preview:false,
            itemArr:[...Array(props.len || 1)].map((_, i)=> i),
            max: props.len || 1
        }
    }

    // componentWillMount() {
    //     this.getPictureCars()
    // }

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

    switchBtn = (checked, item, type) => {
        if (!checked) {
            this.props.form.setFieldsValue({
                ['loanAssetCarDtoList['+ item +'].mortgageTotal']: '',
            });
        }
        this.setState({
            ['' + type + item]: !checked
        })
    }
    previewHide = () => {
        this.setState({
            preview: false,
            pictureInfo: ''
        })
    }
    getPictureCars = () => {  // 车辆照片信息
    	let code = this.props.code; 
    	Config.get('/v1/oss/'+ code + '/LOAN_CAR/*', {}, (res) => {
            if(res.code == Config.errorCode.success) {  
            	if(res.data && res.data.LOAN_CAR && res.data.LOAN_CAR.length){   
            		this.setState({
                        pictureInfo: res.data.LOAN_CAR, 
                        preview: true
                    });
            	} else {
            		message.error(Config.warnInfo.uploadImg);                     
                }
            } else {
                message.error(res.msg);
            }
        });
    }
    // showPic = () => {
    //     this.setState({
    //         preview: true
    //     });
    // }
    priceChange = () => {
        const {itemArr} = this.state
        this.props.loanAssetInfoCost('carPrice', itemArr.reduce((sum, i) => sum += +this[`price${i}`].refs.input.value, 0))
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };
        const formItemLayoutMore = {
            labelCol: { span: 10 },
            wrapperCol: { span: 14 }
        };
        const formTextareaLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 }
        };
        const { loanAssetCars, openUploadImg } = this.props;
        let dateGet = [];
        if(loanAssetCars && loanAssetCars[0] && loanAssetCars[0].buyDate){
            loanAssetCars.map((item,index)=>{
                if (item.buyDate) {
                    dateGet[index] = moment(item.buyDate)
                } else {
                    dateGet[index] = null;
                }
            })
        }
        const {pictureInfo} = this.state
        return (
            <div className='editAssetCars-container'>
                <Form>
                <p className='ipieces-subtitle'>车辆信息
                    {/* {
                        pictureInfo && pictureInfo.length > 0 ? */}
                    <span className='ipieces-subtitle-attachment' onClick={this.getPictureCars}>查看文件</span>
                        {/* : null
                    } */}
                    <span className='ipieces-subtitle-attachment' onClick={()=>openUploadImg(Config.bizType.loanCar)}>添加文件</span>
                    {/* <span className='ipieces-subtitle-attachment' onClick={this.getPictureCars}>照片信息</span> */}
                </p>
                {
                    this.state.itemArr.map((item,index)=>(
                        item == 0 ?
                        <div className='asset-cars' key={item}>
                            <Row>  
                                <Col span={8}>
                                    <FormItem label="购买时间" {...formItemLayout}>
                                        {getFieldDecorator('loanAssetCarDtoList['+ item +'].buyDate', {
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
                                    <FormItem label="价格" {...formItemLayout}>
                                        {getFieldDecorator('loanAssetCarDtoList['+ item +'].carTotal', {
                                            initialValue: loanAssetCars && loanAssetCars[item] && loanAssetCars[item].carTotal ,
                                            rules: [{ required: true, message: Validate.warnInfo.numberLenFtwo, validator: Validate.checkNumLenFtwo }],                                            
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" addonAfter="万元" ref={price => {this[`price${item}`] = price}} onBlur = {this.priceChange} />
                                        )}
                                    </FormItem>    
                                </Col>      
                                <Col span={8}>
                                    <FormItem label="车辆状况" {...formItemLayout}>
                                        {getFieldDecorator('loanAssetCarDtoList['+ item +'].vehicleCondition', {
                                            initialValue: loanAssetCars && loanAssetCars[item] && loanAssetCars[item].vehicleCondition ,
                                            rules: [{ required: true, message: Validate.warnInfo.wordLen25, validator: Validate.checkWordLen25 }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" />
                                        )}
                                    </FormItem>    
                                </Col>      
                            </Row>
                            <Row>  
                                <Col span={6}>
                                    <FormItem label="品牌" {...formItemLayout}>
                                        {getFieldDecorator('loanAssetCarDtoList['+ item +'].brand', {
                                            initialValue: loanAssetCars && loanAssetCars[item] && loanAssetCars[item].brand ,
                                            rules: [{ required: true, message: Validate.warnInfo.wordLen25, validator: Validate.checkWordLen25  }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" />
                                        )}
                                    </FormItem>    
                                </Col>
                                <Col span={6}>
                                    <FormItem label="车牌" {...formItemLayout}>
                                        {getFieldDecorator('loanAssetCarDtoList['+ item +'].plateNumber', {
                                            initialValue: loanAssetCars && loanAssetCars[item] && loanAssetCars[item].plateNumber ,
                                            rules: [{ required: true, message: Validate.warnInfo.wordLen25, validator: Validate.checkWordLen25  }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" />
                                        )}
                                    </FormItem>    
                                </Col>      
                                <Col span={6}>
                                    <FormItem label="是否按揭" {...formItemLayout}>
                                        {getFieldDecorator('loanAssetCarDtoList['+ item +'].isMortgage', {
                                            valuePropName: 'checked',
                                            initialValue: loanAssetCars && loanAssetCars[item] && loanAssetCars[item].isMortgage ,
                                            rules: [{ required: false, message: '' }],
                                        })(
                                            <Switch checkedChildren={'是'} unCheckedChildren={'否'} onChange={(checked)=>this.switchBtn(checked, item, 'car')} />
                                        )}
                                    </FormItem>    
                                </Col>    
                                <Col span={6}>
                                    <FormItem label="按揭金额" {...formItemLayout}>
                                        {getFieldDecorator('loanAssetCarDtoList['+ item +'].mortgageTotal', {
                                            initialValue: loanAssetCars && loanAssetCars[item] && loanAssetCars[item].mortgageTotal ,
                                            rules: [{ required: true, message: Validate.warnInfo.numDecimalThree, validator: Validate.checkNumDecimalThree }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" addonAfter="万元" disabled={this.state['car' + item] == false? false: this.state['car' + item] || !(loanAssetCars && loanAssetCars[item] && loanAssetCars[item].isMortgage)} />
                                        )}
                                    </FormItem>    
                                </Col>       
                                <Col span={6}>
                                    <FormItem label="是否属于公司" {...formItemLayoutMore}>
                                        {getFieldDecorator('loanAssetCarDtoList['+ item +'].isCompany', {
                                            valuePropName: 'checked',
                                            initialValue: loanAssetCars && loanAssetCars[item] && loanAssetCars[item].isCompany ,
                                            rules: [{ required: false, message: '' }],
                                        })(
                                            <Switch checkedChildren={'是'} unCheckedChildren={'否'} />
                                        )}
                                    </FormItem>    
                                </Col>
                                <Col span={6}>
                                    <FormItem label="车架号" {...formItemLayout}>
                                        {getFieldDecorator('loanAssetCarDtoList['+ item +'].vinNo', {
                                            initialValue: loanAssetCars && loanAssetCars[item] && loanAssetCars[item].vinNo ,
                                            rules: [{ required: false, message: Validate.warnInfo.wordLen25, validator: Validate.checkWordLen25  }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" />
                                        )}
                                    </FormItem>    
                                </Col>  
                                <Col span={12}>
                                    <FormItem label="备注信息" {...formTextareaLayout}>
                                        {getFieldDecorator('loanAssetCarDtoList['+ item +'].remark', {
                                            initialValue: loanAssetCars && loanAssetCars[item] && loanAssetCars[item].remark ,
                                            rules: [{ required: true, message: Validate.warnInfo.wordLen64, validator: Validate.checkWordLen64 }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" />
                                        )}
                                    </FormItem>    
                                </Col> 
                            </Row>
                        </div>
                         :
                        <div className='asset-cars' key={item}>
                            <Row type="flex" justify="start">  
                                <Col span={8}>
                                    <FormItem label="购买时间" {...formItemLayout}>
                                        {getFieldDecorator('loanAssetCarDtoList['+ item +'].buyDate', {
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
                                    <FormItem label="价格" {...formItemLayout}>
                                        {getFieldDecorator('loanAssetCarDtoList['+ item +'].carTotal', {
                                            initialValue: loanAssetCars && loanAssetCars[item] && loanAssetCars[item].carTotal ,
                                            rules: [{ required: true, message: Validate.warnInfo.numberLenFtwo, validator: Validate.checkNumLenFtwo }],                                            
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" addonAfter="万元" ref={price => {this[`price${item}`] = price}} onBlur = {this.priceChange} />
                                        )}
                                    </FormItem>    
                                </Col>      
                                <Col span={8}>
                                    <FormItem label="车辆状况" {...formItemLayout}>
                                        {getFieldDecorator('loanAssetCarDtoList['+ item +'].vehicleCondition', {
                                            initialValue: loanAssetCars && loanAssetCars[item] && loanAssetCars[item].vehicleCondition ,
                                            rules: [{ required: true, message: Validate.warnInfo.wordLen25, validator: Validate.checkWordLen25 }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" />
                                        )}
                                    </FormItem>    
                                </Col> 
                            </Row>
                            <Row>
                                <Col span={6}>
                                    <FormItem label="品牌" {...formItemLayout}>
                                        {getFieldDecorator('loanAssetCarDtoList['+ item +'].brand', {
                                            initialValue: loanAssetCars && loanAssetCars[item] && loanAssetCars[item].brand ,
                                            rules: [{ required: true, message: Validate.warnInfo.wordLen25, validator: Validate.checkWordLen25  }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" />
                                        )}
                                    </FormItem>    
                                </Col>     
                                <Col span={6}>
                                    <FormItem label="车牌" {...formItemLayout}>
                                        {getFieldDecorator('loanAssetCarDtoList['+ item +'].plateNumber', {
                                            initialValue: loanAssetCars && loanAssetCars[item] && loanAssetCars[item].plateNumber ,
                                            rules: [{ required: true, message: Validate.warnInfo.wordLen25, validator: Validate.checkWordLen25  }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" />
                                        )}
                                    </FormItem>    
                                </Col>      
                                <Col span={6}>
                                    <FormItem label="是否按揭" {...formItemLayout}>
                                        {getFieldDecorator('loanAssetCarDtoList['+ item +'].isMortgage', {
                                            valuePropName: 'checked',
                                            initialValue: loanAssetCars && loanAssetCars[item] && loanAssetCars[item].isMortgage ,
                                            rules: [{ required: false, message: '' }],
                                        })(
                                            <Switch checkedChildren={'是'} unCheckedChildren={'否'} onChange={(checked)=>this.switchBtn(checked, item, 'car')} />
                                        )}
                                    </FormItem>    
                                </Col>    
                                <Col span={6}>
                                    <FormItem label="按揭金额" {...formItemLayout}>
                                        {getFieldDecorator('loanAssetCarDtoList['+ item +'].mortgageTotal', {
                                            initialValue: loanAssetCars && loanAssetCars[item] && loanAssetCars[item].mortgageTotal ,
                                            rules: [{ required: true, message: Validate.warnInfo.numDecimalThree, validator: Validate.checkNumDecimalThree }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" addonAfter="万元" disabled={this.state['car' + item] == false? false: this.state['car' + item] || !(loanAssetCars && loanAssetCars[item] && loanAssetCars[item].isMortgage)} />
                                        )}
                                    </FormItem>    
                                </Col>       
                                <Col span={6}>
                                    <FormItem label="是否属于公司" {...formItemLayoutMore}>
                                        {getFieldDecorator('loanAssetCarDtoList['+ item +'].isCompany', {
                                            valuePropName: 'checked',
                                            initialValue: loanAssetCars && loanAssetCars[item] && loanAssetCars[item].isCompany ,
                                            rules: [{ required: false, message: '' }],
                                        })(
                                            <Switch checkedChildren={'是'} unCheckedChildren={'否'} />
                                        )}
                                    </FormItem>    
                                </Col>
                                <Col span={6}>
                                    <FormItem label="车架号" {...formItemLayout}>
                                        {getFieldDecorator('loanAssetCarDtoList['+ item +'].vinNo', {
                                            initialValue: loanAssetCars && loanAssetCars[item] && loanAssetCars[item].vinNo ,
                                            rules: [{ required: false, message: Validate.warnInfo.wordLen25, validator: Validate.checkWordLen25  }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" />
                                        )}
                                    </FormItem>    
                                </Col>  
                                <Col span={12}>
                                    <FormItem label="备注信息" {...formTextareaLayout}>
                                        {getFieldDecorator('loanAssetCarDtoList['+ item +'].remark', {
                                            initialValue: loanAssetCars && loanAssetCars[item] && loanAssetCars[item].remark ,
                                            rules: [{ required: true, message: Validate.warnInfo.wordLen64, validator: Validate.checkWordLen64 }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" />
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
                        <span className='ipieces-add-detail'>添加车辆</span>
                    </div>
                </Form>
                <CarouselImg pictureInfo={pictureInfo} previewPic={this.state.preview} previewHide={this.previewHide} />                                                                                   
            </div>
        )
    }
}

const pureEditAssetCars = pureRender(EditAssetCars);

export default pureEditAssetCars;