import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import moment from 'moment';
import { Validate } from '../../Config/Validate';
import { message } from 'antd';
import { Config } from '../../Config/Index';
import './style/editAssetHouses.less';
import CarouselImg from './CarouselImg';
import ipiecesAdd from './../../Assets/Images/entrymanagement_icon_add.png';
import ipiecesDelete from './../../Assets/Images/icon_remove.png';

import { Form, Input, Row, Col, Switch, DatePicker, Cascader } from 'antd';
const FormItem = Form.Item;
/**
 * 进件编辑资产信息房产信息
 * @Author: 赵俊
 * @Date:   2017-05-31 
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-07-25
 */
class EditAssetHouses extends Component {
        constructor(props) {
        super(props);
        this.state = {
            pictureInfo:'',
            homeAddr: props.homeAddr,
            preview: false,
            itemArr:[...Array(props.len || 1)].map((_, i)=> i),
            max: props.len || 1,
            checkArr: [],
        }
    }

    componentWillMount() {
        // this.getPictureCars()
        this.getDict()
        const { loanAssetHouses } = this.props;
        let checkArr = [];
        if ( loanAssetHouses && loanAssetHouses.length > 0) {
            for (let i = 0; i < loanAssetHouses.length ; i++) {
                checkArr.push(loanAssetHouses[i].isowner)
            }
        }
        this.setState({ 
            checkArr: checkArr   
        })
    }
    getDict(){
        let params = {
            code: 'ssq',
        }
        Config.get('/v1/sys/dict/items', params, (res) => {
            if(res.code == Config.errorCode.success) {
                this.setState({
                    ssqList: res.data.ssq,
                })
         	} else {
                message.error(res.msg);
         	}
        });
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
    switchBtn = (checked, item, type) => {
        let checkArr = this.state.checkArr;
        let homeAddr = this.state.homeAddr;
        if (!checked) {
            if( type == 'house' ) {
                this.props.form.setFieldsValue({
                    ['loanAssetHouseDtolist['+ item +'].mortgageTotal']: '',
                });
            } else {
                checkArr[item] = 'false'
                this.props.form.setFieldsValue({
                    ['loanAssetHouseDtolist['+ item +'].isowner']: '',
                    ['loanAssetHouseDtolist['+ item +'].address']: ''
                });
            }
        }else {
            if( type == 'owner' ) {
                checkArr[item]= 'true'
                this.props.form.setFieldsValue({
                    ['loanAssetHouseDtolist['+ item +'].address']: homeAddr
                });
            }
        }
        this.setState({
            ['' + type + item]: !checked,
            checkArr: checkArr
        })
    }
    previewHide = () => {
        this.setState({
            preview: false,
            pictureInfo: ''
        })
    }
    getPictureCars = () => {  // 房屋照片信息
    	let code = this.props.code; 
    	Config.get('/v1/oss/'+ code + '/LOAN_HOUSE/*', {}, (res) => {
            if(res.code == Config.errorCode.success) {  
            	if(res.data && res.data.LOAN_HOUSE && res.data.LOAN_HOUSE.length){   
            		this.setState({
                        pictureInfo: res.data.LOAN_HOUSE,
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
        this.props.loanAssetInfoCost('housePrice', itemArr.reduce((sum, i) => sum += +this[`price${i}`].refs.input.value, 0))
    }
    changeInput = (e,item) => {
       
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 16 }
        };
        const formItemLayoutMore = {
            labelCol: { span: 12 },
            wrapperCol: { span: 12 }
        };
        const formTextareaLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 }
        };
        const { loanAssetHouses, type, openUploadImg } = this.props;
        const { checkArr, homeAddr, ssqList} = this.state;
        if( ssqList && ssqList.length > 0 ) {
            var newArray = [];
            for (var i = 0; i < ssqList.length ; i++){
                newArray.push({label:ssqList[i].ddText,value:ssqList[i].ddValue,children:[]})
                if( ssqList[i].dictDTOS && ssqList[i].dictDTOS.length > 0){
                    for (var j = 0; j < ssqList[i].dictDTOS.length ; j++){
                        newArray[i].children.push({label:ssqList[i].dictDTOS[j].ddText,value:ssqList[i].dictDTOS[j].ddValue,children:[]})
                        if( ssqList[i].dictDTOS[j].dictDTOS && ssqList[i].dictDTOS[j].dictDTOS.length > 0){
                            for (var k = 0; k < ssqList[i].dictDTOS[j].dictDTOS.length ; k++){
                                if(newArray[i].children.length > 0){
                                    newArray[i].children[j].children.push({label:ssqList[i].dictDTOS[j].dictDTOS[k].ddText,value:ssqList[i].dictDTOS[j].dictDTOS[k].ddValue})
                                }
                            }
                        }
                    }
                }
            }
        }
        let dateGet = [];
        if(loanAssetHouses && loanAssetHouses[0] && loanAssetHouses[0].buyDate){
            loanAssetHouses.map((item,index)=>{
                if (item.buyDate) {
                    dateGet[index] = moment(item.buyDate)
                } else {
                    dateGet[index] = null;
                }
            })
        }
        const {pictureInfo} = this.state
        return (
            <div className='editAssetHouses-container'>
                <Form>
                <p className='ipieces-subtitle'>房产信息
                    {/* {
                        pictureInfo && pictureInfo.length > 0 ? */}
                    <span className='ipieces-subtitle-attachment' onClick={this.getPictureCars}>查看文件</span>
                        {/* : null
                    } */}
                    <span className='ipieces-subtitle-attachment' onClick={()=>openUploadImg(Config.bizType.loanHouse)}>添加文件</span>
                    {/* <span className='ipieces-subtitle-attachment' onClick={this.getPictureCars}>照片信息</span> */}
                </p>
                {
                    this.state.itemArr.map((item,index)=>(
                        item == 0 ?
                        <Row className='asset-houses' key={item}>  
                            <Col span={8}>
                                <FormItem label="购买时间" {...formItemLayout}>
                                    {getFieldDecorator('loanAssetHouseDtolist['+ item +'].buyDate', {
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
                                    {getFieldDecorator('loanAssetHouseDtolist['+ item +'].houseTotal', {
                                        initialValue: loanAssetHouses && loanAssetHouses[item] && loanAssetHouses[item].houseTotal ,
                                        rules: [{ required: true, message: Validate.warnInfo.numberLenFtwo, validator: Validate.checkNumLenFtwo }],                                        
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" addonAfter="万元" ref={price => {this[`price${item}`] = price}} onBlur = {this.priceChange} />
                                    )}
                                </FormItem>    
                            </Col>      
                            <Col span={8}>
                                <FormItem label="面积" {...formItemLayout}>
                                    {getFieldDecorator('loanAssetHouseDtolist['+ item +'].houseSize', {
                                        initialValue: loanAssetHouses && loanAssetHouses[item] && loanAssetHouses[item].houseSize ,
                                        rules: [{ required: true, message: Validate.warnInfo.numDecimal, validator: Validate.checkNumDecimal }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" addonAfter='㎡' />
                                    )}
                                </FormItem>    
                            </Col>
                            <Col span={8}>
                                <FormItem label="是否按揭" {...formItemLayout}>
                                    {getFieldDecorator('loanAssetHouseDtolist['+ item +'].isMortgage', {
                                        valuePropName: 'checked',
                                        initialValue: loanAssetHouses && loanAssetHouses[item] && loanAssetHouses[item].isMortgage,
                                        rules: [{ required: false, message: '' }],
                                    })(
                                        <Switch checkedChildren={'是'} unCheckedChildren={'否'} onChange={(checked)=>this.switchBtn(checked, item, 'house')}/>
                                    )}
                                </FormItem>    
                            </Col>      
                            <Col span={8}>
                                <FormItem label="按揭金额" {...formItemLayout}>
                                    {getFieldDecorator('loanAssetHouseDtolist['+ item +'].mortgageTotal', {
                                        initialValue: loanAssetHouses && loanAssetHouses[item] && loanAssetHouses[item].mortgageTotal ,
                                        rules: [{ required: true, message: Validate.warnInfo.numDecimalThree, validator: Validate.checkNumDecimalThree }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入"  addonAfter="万元" disabled={this.state['house' + item] == false? false: this.state['house' + item] || !(loanAssetHouses && loanAssetHouses[item] && loanAssetHouses[item].isMortgage)} />
                                    )}
                                </FormItem>    
                            </Col>
                            <Col span={8}>
                                <FormItem label="家庭住址是否自有房产" {...formItemLayoutMore}>
                                    {getFieldDecorator('loanAssetHouseDtolist['+ item +'].isowner', {
                                        valuePropName: 'checked',
                                        initialValue: loanAssetHouses && loanAssetHouses[item] && loanAssetHouses[item].isowner,
                                        rules: [{ required: false, message: '' }],
                                    })(
                                        <Switch checkedChildren={'是'} unCheckedChildren={'否'} onChange={(checked)=>this.switchBtn(checked, item, 'owner')}/>
                                    )}
                                </FormItem>    
                            </Col>   
                            {
                                type == '6' ? 
                                <Col span={12} style={{display:'none'}}>
                                    <FormItem {...formTextareaLayout} label="房屋地址" hasFeedback>
                                        <Col span={22}>
                                        {getFieldDecorator('loanAssetHouseDtolist['+ item +'].provinceRegion', {initialValue: loanAssetHouses && loanAssetHouses[item] && loanAssetHouses[item].provinceRegion && loanAssetHouses[item].provinceRegion.split(","), rules: [{required: false, message: Config.warnInfo.dotAddressNull}]})(
                                        <span></span>
                                        )}                     
                                        </Col>
                                    </FormItem>    
                                </Col> : null
                            }
                            {
                                type == '6' ? 
                                <Col span={12}>
                                    <FormItem {...formTextareaLayout} label="房屋地址" hasFeedback>
                                        <Col span={22}>
                                        {getFieldDecorator('loanAssetHouseDtolist['+ item +'].provinceRegion', {initialValue: loanAssetHouses && loanAssetHouses[item] && loanAssetHouses[item].provinceRegion && loanAssetHouses[item].provinceRegion.split("/"), rules: [{required: false, message: Config.warnInfo.dotAddressNull}]})(
                                        <Cascader options={newArray}  placeholder="请选择"   onChange={(e)=>this.changeInput(e,item)}/>
                                        )}                     
                                        </Col>
                                    </FormItem>    
                                </Col> : null
                            }
                            {
                                checkArr[item] == true ?
                                <Col span={12}>
                                    <FormItem {...formTextareaLayout}>
                                        {getFieldDecorator('loanAssetHouseDtolist['+ item +'].address', {
                                            initialValue: loanAssetHouses && loanAssetHouses[item] && loanAssetHouses[item].address || homeAddr ,
                                            rules: [{ required: true, message: Validate.warnInfo.wordLen64, validator: Validate.checkWordLen64 }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入详细地址" />
                                        )}
                                    </FormItem>    
                                </Col>  :
                                <Col span={12}>
                                    <FormItem {...formTextareaLayout}>
                                        {getFieldDecorator('loanAssetHouseDtolist['+ item +'].address', {
                                            initialValue: loanAssetHouses && loanAssetHouses[item] && loanAssetHouses[item].address ,
                                            rules: [{ required: true, message: Validate.warnInfo.wordLen64, validator: Validate.checkWordLen64 }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入详细地址" />
                                        )}
                                    </FormItem>    
                                </Col>  
                            }    
                            <Col span={12}>
                                <FormItem label="备注" {...formTextareaLayout}>
                                    {getFieldDecorator('loanAssetHouseDtolist['+ item +'].remark', {
                                        initialValue: loanAssetHouses && loanAssetHouses[item] && loanAssetHouses[item].remark ,
                                        rules: [{ required: true, message: Validate.warnInfo.wordLen64, validator: Validate.checkWordLen64 }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" />
                                    )}
                                </FormItem>    
                            </Col>        
                        </Row> : 
                        <Row className='asset-houses' key={item}>  
                            <Col span={8}>
                                <FormItem label="购买时间" {...formItemLayout}>
                                    {getFieldDecorator('loanAssetHouseDtolist['+ item +'].buyDate', {
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
                                    {getFieldDecorator('loanAssetHouseDtolist['+ item +'].houseTotal', {
                                        initialValue: loanAssetHouses && loanAssetHouses[item] && loanAssetHouses[item].houseTotal ,
                                        rules: [{ required: true, message: Validate.warnInfo.numberLenFtwo, validator: Validate.checkNumLenFtwo }],                                        
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" addonAfter="万元" ref={price => {this[`price${item}`] = price}} onBlur = {this.priceChange} />
                                    )}
                                </FormItem>    
                            </Col>      
                            <Col span={8}>
                                <FormItem label="面积" {...formItemLayout}>
                                    {getFieldDecorator('loanAssetHouseDtolist['+ item +'].houseSize', {
                                        initialValue: loanAssetHouses && loanAssetHouses[item] && loanAssetHouses[item].houseSize ,
                                        rules: [{ required: true, message: Validate.warnInfo.numDecimal, validator: Validate.checkNumDecimal }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" addonAfter='㎡' />
                                    )}
                                </FormItem>    
                            </Col>
                            <Col span={8}>
                                <FormItem label="是否按揭" {...formItemLayout}>
                                    {getFieldDecorator('loanAssetHouseDtolist['+ item +'].isMortgage', {
                                        valuePropName: 'checked',
                                        initialValue: loanAssetHouses && loanAssetHouses[item] && loanAssetHouses[item].isMortgage,
                                        rules: [{ required: false, message: '' }],
                                    })(
                                        <Switch checkedChildren={'是'} unCheckedChildren={'否'} onChange={(checked)=>this.switchBtn(checked, item, 'house')} />
                                    )}
                                </FormItem>    
                            </Col>      
                            <Col span={8}>
                                <FormItem label="按揭金额" {...formItemLayout}>
                                    {getFieldDecorator('loanAssetHouseDtolist['+ item +'].mortgageTotal', {
                                        initialValue: loanAssetHouses && loanAssetHouses[item] && loanAssetHouses[item].mortgageTotal ,
                                        rules: [{ required: true, message: Validate.warnInfo.numDecimalThree, validator: Validate.checkNumDecimalThree }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入"  addonAfter="万元" disabled={this.state['house' + item] == false? false: this.state['house' + item] || !(loanAssetHouses && loanAssetHouses[item] && loanAssetHouses[item].isMortgage)} />
                                    )}
                                </FormItem>    
                            </Col>
                            <Col span={8}>
                                <FormItem label="家庭住址是否自有房产" {...formItemLayoutMore}>
                                    {getFieldDecorator('loanAssetHouseDtolist['+ item +'].isowner', {
                                        valuePropName: 'checked',
                                        initialValue: loanAssetHouses && loanAssetHouses[item] && loanAssetHouses[item].isowner,
                                        rules: [{ required: false, message: '' }],
                                    })(
                                        <Switch checkedChildren={'是'} unCheckedChildren={'否'} onChange={(checked)=>this.switchBtn(checked, item, 'owner')}/>
                                    )}
                                </FormItem>    
                            </Col>  
                            {
                                type == '6' ? 
                                <Col span={12} style={{display:'none'}}>
                                    <FormItem {...formTextareaLayout} label="房屋地址" hasFeedback>
                                        <Col span={22}>
                                        {getFieldDecorator('loanAssetHouseDtolist['+ item +'].provinceRegion', {initialValue: loanAssetHouses && loanAssetHouses[item] && loanAssetHouses[item].provinceRegion && loanAssetHouses[item].provinceRegion.split(","), rules: [{required: false, message: Config.warnInfo.dotAddressNull}]})(
                                        <span></span>
                                        )}                     
                                        </Col>
                                    </FormItem>    
                                </Col> : null
                            }
                            {
                                type == '6' ? 
                                <Col span={12}>
                                    <FormItem {...formTextareaLayout} label="房屋地址" hasFeedback>
                                        <Col span={22}>
                                        {getFieldDecorator('loanAssetHouseDtolist['+ item +'].provinceRegion', {initialValue: loanAssetHouses && loanAssetHouses[item] && loanAssetHouses[item].provinceRegion && loanAssetHouses[item].provinceRegion.split("/"), rules: [{required: false, message: Config.warnInfo.dotAddressNull}]})(
                                        <Cascader options={newArray}  placeholder="请选择省市区"   onChange={(e)=>this.changeInput(e,item)}/>
                                        )}                     
                                        </Col>
                                    </FormItem>    
                                </Col> : null
                            }
                            {
                                checkArr[item] == true ?
                                <Col span={12}>
                                    <FormItem {...formTextareaLayout}>
                                        {getFieldDecorator('loanAssetHouseDtolist['+ item +'].address', {
                                            initialValue: loanAssetHouses && loanAssetHouses[item] && loanAssetHouses[item].address || homeAddr ,
                                            rules: [{ required: true, message: Validate.warnInfo.wordLen64, validator: Validate.checkWordLen64 }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入详细地址" />
                                        )}
                                    </FormItem>    
                                </Col>  :
                                <Col span={12}>
                                    <FormItem {...formTextareaLayout}>
                                        {getFieldDecorator('loanAssetHouseDtolist['+ item +'].address', {
                                            initialValue: loanAssetHouses && loanAssetHouses[item] && loanAssetHouses[item].address ,
                                            rules: [{ required: true, message: Validate.warnInfo.wordLen64, validator: Validate.checkWordLen64 }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入详细地址" />
                                        )}
                                    </FormItem>    
                                </Col>  
                            }         
                            {/* <Col span={12}>
                                <FormItem label="房屋地址" {...formTextareaLayout}>
                                    {getFieldDecorator('loanAssetHouseDtolist['+ item +'].address', {
                                        initialValue: loanAssetHouses && loanAssetHouses[item] && loanAssetHouses[item].address || homeAddr ,
                                        rules: [{ required: true, message: Validate.warnInfo.checkWordLen64, validator: Validate.checkWordLen64 }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" />
                                    )}
                                </FormItem>    
                            </Col>     */}
                            <Col span={12}>
                                <FormItem label="备注" {...formTextareaLayout}>
                                    {getFieldDecorator('loanAssetHouseDtolist['+ item +'].remark', {
                                        initialValue: loanAssetHouses && loanAssetHouses[item] && loanAssetHouses[item].remark ,
                                        rules: [{ required: true, message: Validate.warnInfo.checkWordLen64, validator: Validate.checkWordLen64 }],
                                    })(
                                        <Input autoComplete="off" placeholder="请输入" />
                                    )}
                                </FormItem>    
                            </Col>        
                            <img className='ipieces-delete' src={ipiecesDelete} alt='delete' onClick={()=>this.ipiecesItemDelete(item)} />
                        </Row>
                    ))
                }
                    <div className='ipieces-add' onClick={this.ipiecesItemAdd}>
                        <img className='ipieces-add-img' src={ipiecesAdd} alt='add' />
                        <span className='ipieces-add-detail'>添加房产</span>
                    </div>
                </Form>
                <CarouselImg pictureInfo={pictureInfo} previewPic={this.state.preview} previewHide={this.previewHide} />                                                                   
            </div>
        )
    }
}

const pureEditAssetHouses = pureRender(EditAssetHouses);

export default pureEditAssetHouses;