import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import './style/detailSoftInfo.less';

import { Radio } from 'antd';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

/**
 * 进件编辑软信息
 * @Author: 赵俊
 * @Date:   2017-07-25
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-07-25
 */
class DetailSoftInfo extends Component {
        constructor(props) {
        super(props);
        this.state = {
            checkedHappy:'  checked-happy',   //乐观选项选中时 className
            checkedFocus:'  checked-focus',   //关注选项选中时 className
            checkedWarn:'  checked-warn',     //警惕选项选中时 className
            arrItem: [],
            arrClass: [],
            description: [],
        }
    }

    componentDidMount() {

    }
    componentWillMount() {
        const { softInfo, type } = this.props;
        let {age,marriage,familyrelationship,businessconcerns,socialcommunication,assetsaccumulation,creditrecord,placebusiness,staff} = this.props.sigleSoftInfo;
        if(type == 6) {
            this.setState({
                arrItem: [softInfo.nl,softInfo.hy,softInfo.jtgx,softInfo.sygzd,softInfo.shjw,softInfo.zcjl,softInfo.xyjl,softInfo.jycs,softInfo.yg],
                arrClass: [age,marriage,familyrelationship,businessconcerns,socialcommunication,assetsaccumulation,creditrecord,placebusiness,staff],
                description: ['年龄','婚姻','家庭关系','生意关注度','社会交往','资产积累','信用记录','经营场所','员工'],
            })
        } else{
            this.setState({
                arrItem: [softInfo.nl,softInfo.hy,softInfo.jtgx,softInfo.shjw,softInfo.zcjl,softInfo.xyjl],
                arrClass: [age,marriage,familyrelationship,socialcommunication,assetsaccumulation,creditrecord],
                description: ['年龄','婚姻','家庭关系','社会交往','资产积累','信用记录'],
            })
        }
    }
    render() {
        let {checkedHappy,checkedFocus,checkedWarn} = this.state;
        const { arrItem, arrClass, description} = this.state;
        return (
            <div className='soft-detail-container'>
                <div style={{ float:'left' }} className='soft-warn'>
                    <span className='soft-warnInfo soft-top'>乐观</span>
                    <span className='soft-warnInfo soft-mid'>关注</span>
                    <span className='soft-warnInfo soft-foot'>警惕</span>
                </div>
                {
                  arrItem.map( (info,index) => (
                        <div className='soft-choice' key={index}>
                            <RadioGroup >
                                <RadioButton value="a" className={arrClass[index]==1?checkedHappy:''}  >{info[0].ddText}</RadioButton>
                                <RadioButton value="b" className={arrClass[index]==2?checkedFocus:''} >{info[1].ddText}</RadioButton>
                                <RadioButton value="c" className={arrClass[index]==3?checkedWarn:''} >{info[2].ddText}</RadioButton>
                                <span className='option-describe'>{description[index]}</span>
                            </RadioGroup>
                        </div>
                  ))
                }

            </div>
        )
    }
}

const pureDetailSoftInfo = pureRender(DetailSoftInfo);

export default pureDetailSoftInfo;
