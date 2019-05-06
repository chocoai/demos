import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import './style/editSoftInfo.less';

import { Form, Radio } from 'antd';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;

/**
 * 农贷进件编辑软信息
 * @Author: 钟观发
 * @Date:   2017-10-11
 * @Last Modified by:   钟观发
 * @Last Modified time: 2017-10-11
 */
class EditFarmSoft extends Component {
        constructor(props) {
        super(props);
        this.state = {
            checkedHappy:' checkedHappy',   //乐观选项选中时 className
            checkedFocus:' checkedFocus',   //关注选项选中时 className
            checkedWarn:' checkedWarn',     //警惕选项选中时 className
            age: props.soft.age && props.soft.age.toString() || '',
            marriage: props.soft.marriage && props.soft.marriage.toString() || '',
            familyrelationship: props.soft.familyrelationship && props.soft.familyrelationship.toString() || '',
            businessconcerns: props.soft.businessconcerns && props.soft.businessconcerns.toString() || '',
            socialcommunication: props.soft.socialcommunication && props.soft.socialcommunication.toString() || '',
            assetsaccumulation: props.soft.assetsaccumulation && props.soft.assetsaccumulation.toString() || '',
            creditrecord: props.soft.creditrecord && props.soft.creditrecord.toString() || '',
            operatingcondition: props.soft.operatingcondition && props.soft.operatingcondition.toString() || '',
        }
    }
    //修改样式,className
    //添加选中不选中
    //行高
    //代码名称修改，优化

    componentWillMount() {
        const { softInfo } = this.props;
            this.setState({
                nl: softInfo.nl,
                hy: softInfo.hy,
                jtgx: softInfo.jtgx,
                jyqk: softInfo.jyqk,
                shjw: softInfo.shjw,
                sygzd: softInfo.sygzd,
                xyjl: softInfo.xyjl,
                zcjl: softInfo.zcjl,
            })
    }

    //单击时确定，再次点击时取消
    handleClick = (choice,value) => {
        if(value == this.state[choice]){
            this.setState({
                [choice] : '0'
            })
            this.props.form.setFieldsValue({
                [choice]: '0',
            });
        } else {
             this.setState({
                [choice] : value
            })
        }
    }


    render() {
        let {age,marriage,familyrelationship,businessconcerns,socialcommunication,assetsaccumulation,creditrecord,operatingcondition} = this.state;
        let {checkedHappy,checkedFocus,checkedWarn} = this.state;
        const { soft} = this.props;
        let {nl,hy,jtgx,sygzd,shjw,zcjl,xyjl,jyqk} = this.state;
        const { getFieldDecorator } = this.props.form;
        return (
            <div className='soft-edit-container'>
                <div  className='soft-warn'>
                    <span className='soft-warnInfo soft-top'>乐观</span>
                    <span className='soft-warnInfo soft-mid'>关注</span>
                    <span className='soft-warnInfo soft-foot'>警惕</span>
                </div>
                <div className='soft-choice'>
                    <RadioGroup  disabled value={soft && soft.age && soft.age.toString() || ''} >
                        <RadioButton value="1" className={age==1?checkedHappy:''}>{nl[0].ddText}</RadioButton>
                        <RadioButton value="2" className={age==2?checkedFocus:''}>{nl[1].ddText}</RadioButton>
                        <RadioButton value="3" className={age==3?checkedWarn:''}>{nl[2].ddText}</RadioButton>
                    </RadioGroup>
                    <span className='option-describe'>年龄</span>
                </div>
               <div className='soft-choice'>
                    <RadioGroup  disabled value={soft && soft.marriage && soft.marriage.toString() || ''} >
                        <RadioButton value="1" className={marriage==1?checkedHappy:''}>{hy[0].ddText}</RadioButton>
                        <RadioButton value="2" className={marriage==2?checkedFocus:''}>{hy[1].ddText}</RadioButton>
                        <RadioButton value="3" className={marriage==3?checkedWarn:''}>{hy[2].ddText}</RadioButton>
                    </RadioGroup>
                    <span className='option-describe'>婚姻</span>
                </div>
                <div className='soft-choice' >
                <FormItem>
                    {getFieldDecorator('familyrelationship', {
                        initialValue: soft && soft.familyrelationship && soft.familyrelationship.toString() || '',
                        rules: [{ required: false }],
                    })(
                        <RadioGroup>
                            <RadioButton value="1" className={familyrelationship==1?checkedHappy:''} onClick={this.handleClick.bind(this,'familyrelationship',1)}>{jtgx[0].ddText}</RadioButton>
                            <RadioButton value="2" className={familyrelationship==2?checkedFocus:''} onClick={this.handleClick.bind(this,'familyrelationship',2)}>{jtgx[1].ddText}</RadioButton>
                            <RadioButton value="3" className={familyrelationship==3?checkedWarn:''} onClick={this.handleClick.bind(this,'familyrelationship',3)}>{jtgx[2].ddText}</RadioButton>
                        </RadioGroup>
                    )}
                </FormItem>
                <span className='option-describe'>家庭关系</span>

                </div>
                 <div className='soft-choice'>
                    <FormItem>
                        {getFieldDecorator('businessconcerns', {
                            initialValue: soft && soft.businessconcerns && soft.businessconcerns.toString() || '',
                            rules: [{ required: false }],
                        })(
                        <RadioGroup>
                            <RadioButton value="1" className={businessconcerns==1?checkedHappy:''} onClick={this.handleClick.bind(this,'businessconcerns',1)} >{sygzd[0].ddText}</RadioButton>
                            <RadioButton value="2" className={businessconcerns==2?checkedFocus:''} onClick={this.handleClick.bind(this,'businessconcerns',2)}>{sygzd[1].ddText}</RadioButton>
                            <RadioButton value="3" className={businessconcerns==3?checkedWarn:''} onClick={this.handleClick.bind(this,'businessconcerns',3)}>{sygzd[2].ddText}</RadioButton>
                        </RadioGroup>
                        )}
                    </FormItem>
                    <span className='option-describe'>生意关注度</span>
                </div>
                <div className='soft-choice'>
                    <FormItem>
                        {getFieldDecorator('socialcommunication', {
                            initialValue: soft && soft.socialcommunication && soft.socialcommunication.toString() || '',
                            rules: [{ required: false }],
                        })(
                            <RadioGroup >
                                <RadioButton value="1" className={socialcommunication==1?checkedHappy:''}  onClick={this.handleClick.bind(this,'socialcommunication',1)}>{shjw[0].ddText}</RadioButton>
                                <RadioButton value="2" className={socialcommunication==2?checkedFocus:''}  onClick={this.handleClick.bind(this,'socialcommunication',2)}>{shjw[1].ddText}</RadioButton>
                                <RadioButton value="3" className={socialcommunication==3?checkedWarn:''}  onClick={this.handleClick.bind(this,'socialcommunication',3)}>{shjw[2].ddText}</RadioButton>
                            </RadioGroup>
                        )}
                    </FormItem>
                    <span className='option-describe'>社会交往</span>
                </div>
                <div className='soft-choice'>
                    <FormItem>
                        {getFieldDecorator('assetsaccumulation', {
                            initialValue: soft && soft.assetsaccumulation && soft.assetsaccumulation.toString() || '',
                            rules: [{ required: false }],
                        })(
                            <RadioGroup >
                                <RadioButton value="1" className={assetsaccumulation==1?checkedHappy:''} onClick={this.handleClick.bind(this,'assetsaccumulation',1)} >{zcjl[0].ddText}</RadioButton>
                                <RadioButton value="2" className={assetsaccumulation==2?checkedFocus:''} onClick={this.handleClick.bind(this,'assetsaccumulation',2)} >{zcjl[1].ddText}</RadioButton>
                                <RadioButton value="3" className={assetsaccumulation==3?checkedWarn:''} onClick={this.handleClick.bind(this,'assetsaccumulation',3)} >{zcjl[2].ddText}</RadioButton>
                            </RadioGroup>
                        )}
                    </FormItem>
                    <span className='option-describe'>资产积累</span>
                </div>
                <div className='soft-choice'>
                    <FormItem>
                        {getFieldDecorator('creditrecord', {
                            initialValue: soft && soft.creditrecord && soft.creditrecord.toString() || '',
                            rules: [{ required: false }],
                        })(
                            <RadioGroup >
                                <RadioButton value="1" className={creditrecord==1?checkedHappy:''}  onClick={this.handleClick.bind(this,'creditrecord',1)} >{xyjl[0].ddText}</RadioButton>
                                <RadioButton value="2" className={creditrecord==2?checkedFocus:''} onClick={this.handleClick.bind(this,'creditrecord',2)} >{xyjl[1].ddText}</RadioButton>
                                <RadioButton value="3" className={creditrecord==3?checkedWarn:''} onClick={this.handleClick.bind(this,'creditrecord',3)} >{xyjl[2].ddText}</RadioButton>
                            </RadioGroup>
                        )}
                    </FormItem>
                    <span className='option-describe'>信用记录</span>
                </div>
                <div className='soft-choice'>
                    <FormItem>
                        {getFieldDecorator('operatingcondition', {
                            initialValue: soft && soft.operatingcondition && soft.operatingcondition.toString() || '',
                            rules: [{ required: false }],
                        })(
                            <RadioGroup >
                                <RadioButton value="1" className={operatingcondition==1?checkedHappy:''} onClick={this.handleClick.bind(this,'operatingcondition',1)} >{jyqk[0].ddText}</RadioButton>
                                <RadioButton value="2" className={operatingcondition==2?checkedFocus:''} onClick={this.handleClick.bind(this,'operatingcondition',2)} >{jyqk[1].ddText}</RadioButton>
                                <RadioButton value="3" className={operatingcondition==3?checkedWarn:''} onClick={this.handleClick.bind(this,'operatingcondition',3)} >{jyqk[2].ddText}</RadioButton>
                            </RadioGroup>
                        )}
                    </FormItem>
                    <span className='option-describe'>经营情况</span>
                </div>
            </div>
        )
    }
}

const pureEditFarmSoft = pureRender(EditFarmSoft);

export default pureEditFarmSoft;
