import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import { Validate } from '../../Config/Validate';
import './style/editManageFarm.less';
import ipiecesAdd from './../../Assets/Images/entrymanagement_icon_add.png';
import ipiecesDelete from './../../Assets/Images/icon_remove.png';
import { Form, Input, Row, Col, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
/**
 * 进件编辑上下游信息
 * @Author: 钟观发
 * @Date:   2017-09-29 
 * @Last Modified by:   钟观发
 * @Last Modified time: 2017-09-29
 */
class EditManageFarm extends Component {
        constructor(props) {
        super(props);
        this.state = {
            landArr:[...Array(props.landLen || 1)].map((_, i)=> i),
            landMax: props.landLen || 1,
            plantArr:[...Array(props.plantLen || 1)].map((_, i)=> i),
            plantMax: props.plantLen || 1,
            breedArr:[...Array(props.breedLen || 1)].map((_, i)=> i),
            breedMax: props.breedLen || 1,
        }
    }

    componentWillMount() {
    }
     //增加
    ipiecesItemAdd = (type) => {
        if ( type == 'land') {
            let landMax = this.state.landMax;
            this.setState({ 
                'landArr': [...this.state.landArr, landMax],
                landMax: landMax + 1                
            })
        }else if ( type == 'plant'){
            let plantMax = this.state.plantMax;
            this.setState({ 
                'plantArr': [...this.state.plantArr, plantMax],
                plantMax: plantMax + 1                
            })
        }else {
            let breedMax = this.state.breedMax;
            this.setState({ 
                'breedArr': [...this.state.breedArr, breedMax],
                breedMax: breedMax + 1                
            })
        }
    }
    //删除
    ipiecesItemDelete = (itemDelete,type) => {
        if (type == 'land') {
            this.setState({ 'landArr': [...this.state.landArr.filter((item,index)=>item != itemDelete)]})
        }else if (type == 'plant') {
            this.setState({ 'plantArr': [...this.state.plantArr.filter((item,index)=>item != itemDelete)]})
        }else {
            this.setState({ 'breedArr': [...this.state.breedArr.filter((item,index)=>item != itemDelete)]})
        }
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 16 }
        };
        const { farmBase, cultiLand} = this.props;
        const businessLandList = farmBase.businessLandList;
        const businessPlantList = farmBase.businessPlantList;
        const businessBreedList = farmBase.businessBreedList;
        return (
            <div className='editManageFarm-container'>
                <div className="land-container">
                    <p className="editManageFarm-title">耕地信息</p>
                    <Form>
                    {
                        this.state.landArr.map((item,index)=>(
                            item == 0?
                            <Row className='main-farm' key={item}>    
                            <Col span={12}>
                                    <FormItem label="耕地类型" {...formItemLayout}>
                                        {getFieldDecorator('businessLandList[' + item + '].ltype', {
                                            initialValue: businessLandList && businessLandList[item] && businessLandList[item].ltype && businessLandList[item].ltype.toString(),
                                            rules: [{ required: false, message: '' }],
                                        })(
                                            <Select
                                                placeholder="请选择"
                                                style={{ width: '100%' }}
                                                getPopupContainer={trigger => trigger.parentNode}
                                                >
                                                {
                                                    cultiLand.map((item,index)=>(
                                                        <Option key={index} value={item.ddValue}>{item.ddText}</Option>
                                                    ))
                                                }
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col> 
                                <Col span={12}>
                                    <FormItem label="上一周期租赁耕地" {...formItemLayout}>
                                        {getFieldDecorator('businessLandList[' + item + '].previousLland', {
                                            initialValue: businessLandList && businessLandList[item] && businessLandList[item].previousLland,
                                            rules: [{required: false, message: Validate.warnInfo.numDecimalTwo, validator: Validate.checkNumbersLen7 }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" addonAfter="亩" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="上一周期自有耕地" {...formItemLayout}>
                                        {getFieldDecorator('businessLandList[' + item + '].previousHaveland', {
                                            initialValue: businessLandList && businessLandList[item] && businessLandList[item].previousHaveland,
                                            rules: [{required: false, message: Validate.warnInfo.numDecimalTwo, validator: Validate.checkNumbersLen7 }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" addonAfter="亩" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="下一周期租赁耕地" {...formItemLayout}>
                                        {getFieldDecorator('businessLandList[' + item + '].nextLland', {
                                            initialValue: businessLandList && businessLandList[item] && businessLandList[item].nextLland,
                                            rules: [{required: false, message: Validate.warnInfo.numDecimalTwo, validator: Validate.checkNumbersLen7 }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" addonAfter="亩" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="下一周期自有耕地" {...formItemLayout}>
                                        {getFieldDecorator('businessLandList[' + item + '].nextHaveland', {
                                            initialValue: businessLandList && businessLandList[item] && businessLandList[item].nextHaveland,
                                            rules: [{required: false, message: Validate.warnInfo.numDecimalTwo, validator: Validate.checkNumbersLen7 }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" addonAfter="亩" />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            :
                            <Row className='main-farm' key={item}>    
                            <Col span={12}>
                                    <FormItem label="耕地类型" {...formItemLayout}>
                                        {getFieldDecorator('businessLandList[' + item + '].ltype', {
                                            initialValue: businessLandList && businessLandList[item] && businessLandList[item].ltype && businessLandList[item].ltype.toString(),
                                            rules: [{ required: false, message: '' }],
                                        })(
                                            <Select
                                                placeholder="请选择"
                                                style={{ width: '100%' }}
                                                getPopupContainer={trigger => trigger.parentNode}
                                                >
                                                {
                                                    cultiLand.map((item,index)=>(
                                                        <Option key={index} value={item.ddValue}>{item.ddText}</Option>
                                                    ))
                                                }
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col> 
                                <Col span={12}>
                                    <FormItem label="上一周期租赁耕地" {...formItemLayout}>
                                        {getFieldDecorator('businessLandList[' + item + '].previousLland', {
                                            initialValue: businessLandList && businessLandList[item] && businessLandList[item].previousLland,
                                            rules: [{required: false,message: Validate.warnInfo.numDecimalTwo, validator: Validate.checkNumbersLen7 }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" addonAfter="亩" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="上一周期自有耕地" {...formItemLayout}>
                                        {getFieldDecorator('businessLandList[' + item + '].previousHaveland', {
                                            initialValue: businessLandList && businessLandList[item] && businessLandList[item].previousHaveland,
                                            rules: [{required: false, message: Validate.warnInfo.numDecimalTwo, validator: Validate.checkNumbersLen7 }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" addonAfter="亩" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="下一周期租赁耕地" {...formItemLayout}>
                                        {getFieldDecorator('businessLandList[' + item + '].nextLland', {
                                            initialValue: businessLandList && businessLandList[item] && businessLandList[item].nextLland,
                                            rules: [{required: false, message: Validate.warnInfo.numDecimalTwo, validator: Validate.checkNumbersLen7 }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" addonAfter="亩" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="下一周期自有耕地" {...formItemLayout}>
                                        {getFieldDecorator('businessLandList[' + item + '].nextHaveland', {
                                            initialValue: businessLandList && businessLandList[item] && businessLandList[item].nextHaveland,
                                            rules: [{required: false, message: Validate.warnInfo.numDecimalTwo, validator: Validate.checkNumbersLen7 }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" addonAfter="亩" />
                                        )}
                                    </FormItem>
                                </Col>
                                <img className='farm-delete' src={ipiecesDelete} alt='delete' onClick={()=>this.ipiecesItemDelete(item,'land')} />
                            </Row>
                        ))
                    }
                        <div className='ipieces-add' onClick={()=>this.ipiecesItemAdd('land')}>
                            <img className='ipieces-add-img' src={ipiecesAdd} alt='add' />
                            <span className='ipieces-add-detail'>添加耕地类型</span>
                        </div>
                    </Form>
                </div>
                <div className="plant-container">
                    <p className="editManageFarm-title">种植结构</p>
                    <Form>
                    {
                        this.state.plantArr.map((item,index)=>(
                            item == 0?
                            <Row className='main-farm' key={item}>    
                                <Col span={12}>
                                    <FormItem label="农作物名称" {...formItemLayout}>
                                        {getFieldDecorator('businessPlantList[' + item + '].pname', {
                                            initialValue: businessPlantList && businessPlantList[item] && businessPlantList[item].pname,
                                            rules: [{ required: false, message: Validate.warnInfo.wordLen25, validator: Validate.checkWordLen25 }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入"  />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="上一周期种植面积" {...formItemLayout}>
                                        {getFieldDecorator('businessPlantList[' + item + '].previousPlant', {
                                            initialValue: businessPlantList && businessPlantList[item] && businessPlantList[item].previousPlant,
                                            rules: [{required: false, message: Validate.warnInfo.numDecimalTwo, validator: Validate.checkNumbersLen7 }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" addonAfter="亩" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="上一周期平均产值" {...formItemLayout}>
                                        {getFieldDecorator('businessPlantList[' + item + '].previousAvgyield', {
                                            initialValue: businessPlantList && businessPlantList[item] && businessPlantList[item].previousAvgyield,
                                            rules: [{required: false, message: Validate.warnInfo.numDecimalTwo, validator: Validate.checkNumbersLen7 }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" addonAfter="吨/亩" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="下一周期种植面积" {...formItemLayout}>
                                        {getFieldDecorator('businessPlantList[' + item + '].nextPlant', {
                                            initialValue: businessPlantList && businessPlantList[item] && businessPlantList[item].nextPlant,
                                            rules: [{required: false, message: Validate.warnInfo.numDecimalTwo, validator: Validate.checkNumbersLen7 }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" addonAfter="亩" />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            :
                            <Row className='main-farm' key={item}>    
                                <Col span={12}>
                                    <FormItem label="农作物名称" {...formItemLayout}>
                                        {getFieldDecorator('businessPlantList[' + item + '].pname', {
                                            initialValue: businessPlantList && businessPlantList[item] && businessPlantList[item].pname,
                                            rules: [{ required: false, message: Validate.warnInfo.wordLen25, validator: Validate.checkWordLen15 }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入"  />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="上一周期种植面积" {...formItemLayout}>
                                        {getFieldDecorator('businessPlantList[' + item + '].previousPlant', {
                                            initialValue: businessPlantList && businessPlantList[item] && businessPlantList[item].previousPlant,
                                            rules: [{required: false, message: Validate.warnInfo.numDecimalTwo, validator: Validate.checkNumbersLen7 }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" addonAfter="亩" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="上一周期平均产值" {...formItemLayout}>
                                        {getFieldDecorator('businessPlantList[' + item + '].previousAvgyield', {
                                            initialValue: businessPlantList && businessPlantList[item] && businessPlantList[item].previousAvgyield,
                                            rules: [{required: false, message: Validate.warnInfo.numDecimalTwo, validator: Validate.checkNumbersLen7 }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" addonAfter="吨/亩" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="下一周期种植面积" {...formItemLayout}>
                                        {getFieldDecorator('businessPlantList[' + item + '].nextPlant', {
                                            initialValue: businessPlantList && businessPlantList[item] && businessPlantList[item].nextPlant,
                                            rules: [{required: false, message: Validate.warnInfo.numDecimalTwo, validator: Validate.checkNumbersLen7 }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" addonAfter="亩" />
                                        )}
                                    </FormItem>
                                </Col>
                                    <img className='farm-delete' src={ipiecesDelete} alt='delete' onClick={()=>this.ipiecesItemDelete(item,'plant')} />
                            </Row>
                        ))
                    }
                        <div className='ipieces-add' onClick={()=>this.ipiecesItemAdd('plant')}>
                            <img className='ipieces-add-img' src={ipiecesAdd} alt='add' />
                            <span className='ipieces-add-detail'>添加农作物类型</span>
                        </div>
                    </Form>
                </div>
                <div className="plant-container">
                    <p className="editManageFarm-title">养殖结构</p>
                    <Form>
                    {
                        this.state.breedArr.map((item,index)=>(
                            item == 0?
                            <Row className='main-farm' key={item}>    
                                <Col span={12}>
                                    <FormItem label="牲畜名称" {...formItemLayout}>
                                        {getFieldDecorator('businessBreedList[' + item + '].bname', {
                                            initialValue: businessBreedList && businessBreedList[item] && businessBreedList[item].bname,
                                            rules: [{ required: true, message: Validate.warnInfo.wordLen25, validator: Validate.checkWordLen25 }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入"  />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="数量" {...formItemLayout}>
                                        {getFieldDecorator('businessBreedList[' + item + '].btotal', {
                                            initialValue: businessBreedList && businessBreedList[item] && businessBreedList[item].btotal,
                                            rules: [{required: false, message: Validate.warnInfo.numberLen10, validator: Validate.checkNumberLen10 }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" addonAfter="头" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="年龄" {...formItemLayout}>
                                        {getFieldDecorator('businessBreedList[' + item + '].age', {
                                            initialValue: businessBreedList && businessBreedList[item] && businessBreedList[item].age,
                                            rules: [{required: false, message: Validate.warnInfo.numberLen10, validator: Validate.checkNumberLen10 }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" addonAfter="岁" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="市场价值" {...formItemLayout}>
                                        {getFieldDecorator('businessBreedList[' + item + '].marketvalue', {
                                            initialValue: businessBreedList && businessBreedList[item] && businessBreedList[item].marketvalue,
                                            rules: [{required: false, message: Validate.warnInfo.numDecimalTwo, validator: Validate.checkNumbersLen7 }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" addonAfter="元" />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            :
                            <Row className='main-farm' key={item}>    
                                <Col span={12}>
                                    <FormItem label="牲畜名称" {...formItemLayout}>
                                        {getFieldDecorator('businessBreedList[' + item + '].bname', {
                                            initialValue: businessBreedList && businessBreedList[item] && businessBreedList[item].bname,
                                            rules: [{ required: true, message: Validate.warnInfo.wordLen25, validator: Validate.checkWordLen25 }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入"  />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="数量" {...formItemLayout}>
                                        {getFieldDecorator('businessBreedList[' + item + '].btotal', {
                                            initialValue: businessBreedList && businessBreedList[item] && businessBreedList[item].btotal,
                                            rules: [{required: false, message: Validate.warnInfo.numberLen10, validator: Validate.checkNumberLen10 }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" addonAfter="头" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="年龄" {...formItemLayout}>
                                        {getFieldDecorator('businessBreedList[' + item + '].age', {
                                            initialValue: businessBreedList && businessBreedList[item] && businessBreedList[item].age,
                                            rules: [{required: false, message: Validate.warnInfo.numberLen10, validator: Validate.checkNumberLen10 }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" addonAfter="岁" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="市场价值" {...formItemLayout}>
                                        {getFieldDecorator('businessBreedList[' + item + '].marketvalue', {
                                            initialValue: businessBreedList && businessBreedList[item] && businessBreedList[item].marketvalue,
                                            rules: [{required: false, message: Validate.warnInfo.numDecimalTwo, validator: Validate.checkNumbersLen7 }],
                                        })(
                                            <Input autoComplete="off" placeholder="请输入" addonAfter="元" />
                                        )}
                                    </FormItem>
                                </Col>
                                    <img className='farm-delete' src={ipiecesDelete} alt='delete' onClick={()=>this.ipiecesItemDelete(item,'breed')} />
                            </Row>
                        ))
                    }
                        <div className='ipieces-add' onClick={()=>this.ipiecesItemAdd('breed')}>
                            <img className='ipieces-add-img' src={ipiecesAdd} alt='add' />
                            <span className='ipieces-add-detail'>添加牲畜类型</span>
                        </div>
                    </Form>
                </div>
            </div>
        )
    }
}

const pureEditManageFarm = pureRender(EditManageFarm);

export default pureEditManageFarm;