import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import './style/editSoftInfo.less';

import { Form, Radio } from 'antd';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;

/**
 * 进件编辑软信息
 * @Author: 赵俊
 * @Date:   2017-07-25
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-07-25
 */
class EditSoftInfo extends Component {
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
            placebusiness: props.soft.placebusiness && props.soft.placebusiness.toString() || '',
            staff: props.soft.staff && props.soft.staff.toString() || '',
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
            sygzd: softInfo.sygzd,
            shjw: softInfo.shjw,
            zcjl: softInfo.zcjl,
            xyjl: softInfo.xyjl,
            jycs: softInfo.jycs,
            yg: softInfo.yg,
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
        let {age,marriage,familyrelationship,businessconcerns,socialcommunication,assetsaccumulation,creditrecord,placebusiness,staff} = this.state;
        let {checkedHappy,checkedFocus,checkedWarn} = this.state;
        const { soft,type} = this.props;
        let {nl,hy,jtgx,sygzd,shjw,zcjl,xyjl,jycs,yg} = this.state;
        const { getFieldDecorator } = this.props.form;
        return (
            <div className='soft-edit-container'>
                <div  className='soft-warn'>
                    <span className='soft-warnInfo soft-top'>乐观</span>
                    <span className='soft-warnInfo soft-mid'>关注</span>
                    <span className='soft-warnInfo soft-foot'>警惕</span>
                </div>
                {
                    nl ?
                    <div className='soft-choice'>
                        <RadioGroup  disabled value={soft && soft.age && soft.age.toString() || ''} >
                            <RadioButton value="1" className={age==1?checkedHappy:''}>{nl[0].ddText}</RadioButton>
                            <RadioButton value="2" className={age==2?checkedFocus:''}>{nl[1].ddText}</RadioButton>
                            <RadioButton value="3" className={age==3?checkedWarn:''}>{nl[2].ddText}</RadioButton>
                        </RadioGroup>
                        <span className='option-describe'>年龄</span>
                    </div> : null
                }
                {
                    hy ?
                    <div className='soft-choice'>
                    {/* {type==6?<FormItem>
                        {getFieldDecorator('marriage', {
                            initialValue: soft && soft.marriage && soft.marriage.toString() || '',
                            rules: [{ required: false }],
                        })(
                        <RadioGroup value={soft && soft.marriage && soft.marriage.toString() || ''} >
                            <RadioButton value="1" className={marriage==1?checkedHappy:''} onClick={this.handleClick.bind(this,'marriage',1)}>{hy[0].ddText} </RadioButton>
                            <RadioButton value="2" className={marriage==2?checkedFocus:''} onClick={this.handleClick.bind(this,'marriage',2)}>{hy[1].ddText} </RadioButton>
                            <RadioButton value="3" className={marriage==3?checkedWarn:''} onClick={this.handleClick.bind(this,'marriage',3)}>{hy[2].ddText} </RadioButton>
                        </RadioGroup>
                    )}
                    </FormItem>: */}
                        <RadioGroup  disabled value={soft && soft.marriage && soft.marriage.toString() || ''} >
                            <RadioButton value="1" className={marriage==1?checkedHappy:''}>{hy[0].ddText} </RadioButton>
                            <RadioButton value="2" className={marriage==2?checkedFocus:''}>{hy[1].ddText} </RadioButton>
                            <RadioButton value="3" className={marriage==3?checkedWarn:''}>{hy[2].ddText} </RadioButton>
                        </RadioGroup>}
                        <span className='option-describe'>婚姻</span>
                    </div> 
                    : null
                }
                {
                    jtgx ?
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
                    </div> : null
                }
                {
                    sygzd ?
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
                    </div> : null
                }
                { shjw ?
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
                    </div> : null
                }
                {
                    zcjl ?
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
                    </div> : null
                }
                {
                    xyjl ?
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
                    </div> : null
                }
                {
                    jycs ?
                    <div className='soft-choice'>
                        <FormItem>
                            {getFieldDecorator('placebusiness', {
                                initialValue: soft && soft.placebusiness && soft.placebusiness.toString() || '',
                                rules: [{ required: false }],
                            })(
                                <RadioGroup >
                                    <RadioButton value="1" className={placebusiness==1?checkedHappy:''} onClick={this.handleClick.bind(this,'placebusiness',1)} >{jycs[0].ddText}</RadioButton>
                                    <RadioButton value="2" className={placebusiness==2?checkedFocus:''} onClick={this.handleClick.bind(this,'placebusiness',2)} >{jycs[1].ddText}</RadioButton>
                                    <RadioButton value="3" className={placebusiness==3?checkedWarn:''} onClick={this.handleClick.bind(this,'placebusiness',3)} >{jycs[2].ddText}</RadioButton>
                                </RadioGroup>
                            )}
                        </FormItem>
                        <span className='option-describe'>经营场所</span>
                    </div> : null
                }
                {
                    yg ?
                    <div className='soft-choice'>
                        <FormItem>
                            {getFieldDecorator('staff', {
                                initialValue: soft && soft.staff && soft.staff.toString() || '',
                                rules: [{ required: false }],
                            })(
                                <RadioGroup >
                                    <RadioButton value="1" className={staff==1?checkedHappy:''} onClick={this.handleClick.bind(this,'staff',1)} >{yg[0].ddText}</RadioButton>
                                    <RadioButton value="2" className={staff==2?checkedFocus:''} onClick={this.handleClick.bind(this,'staff',2)} >{yg[1].ddText}</RadioButton>
                                    <RadioButton value="3" className={staff==3?checkedWarn:''} onClick={this.handleClick.bind(this,'staff',3)} >{yg[2].ddText}</RadioButton>
                                </RadioGroup>
                            )}
                        </FormItem>
                        <span className='option-describe'>员工</span>
                    </div> : null
                }
            </div>
        )
    }
}

const pureEditSoftInfo = pureRender(EditSoftInfo);

export default pureEditSoftInfo;
