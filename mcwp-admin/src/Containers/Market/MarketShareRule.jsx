import React, { Component } from 'react'; // 引入了React
import { Config } from '../../Config/Index';
import { Spin , message , Input , Button  , Modal , Select } from 'antd';
import BcrumbItem from '../../Component/Breadcrumb/BcrumbItem';
import ruleDescription from './../../Assets/Images/icon_ruledescription.png';
import './style/marketShareRule.less';
import { browserHistory } from 'react-router';
const Option = Select.Option;
// const RadioGroup = Radio.Group;

class MarketShareRule extends Component {
    constructor(props) {
    	super(props);
    	this.state = {
            loading: false,
            surplus:'',
            awardRule:'',
            sAwardRule:'',
            awardAmount:'',
            modalString:'',
            modalGetString:'',
            // value:'',
            amountDisable:false,
            visible: false,
            buttonStatus:false,
            ruleStatus:false,
            }
        }
    componentDidMount () {
        this.getMarShareInfo()
    }
    getMarShareInfo (params) {//获取当前设置状态
        Config.get('/v1/share/rule', params, (res) => {
            if(res.code == Config.errorCode.success) {
            	this.setState({
                    surplus: res.data,
                    // value: res.data.awardRule,
                    sAwardRule: res.data.awardRule,
                    awardRule:res.data.awardRule,
                    awardAmount: res.data.awardAmount,
                    modalGetString:res.data.awardRule,
                });
                if(res.data.awardRule == 1){
                    this.setState({
                        amountDisable:false,
                    });
                }else{
                    this.setState({
                        amountDisable:true,
                    });
                }
         	} else {
                message.error(res.msg);
         	}
        });
    }
    putMarShareInfo (params) {//修改分享规则
        Config.put('/v1/share/rule', params, (res) => {
            if(res.code == Config.errorCode.success) {
         	} else {
                message.error(res.msg);
         	}
        });
    }
    onSave(){//保存
        const { awardRule , awardAmount } = this.state;
        let params = {
            awardRule:awardRule,
            awardAmount:awardAmount,
        }
        if( awardRule == 1 ){
            delete params.awardAmount
            this.putMarShareInfo(params)
        }else{
            this.putMarShareInfo(params)
        }
    }
    onExit(){
        browserHistory.push('/market/share' );
    }
    showModal = () => {
        this.setState({
          visible: true,
        });
      }
    handleOk = (e) => {
        this.onSave();
        this.setState({
          visible: false,
        });
        browserHistory.push('/market/share' );
      }
    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }
    // awarChange = (e) => {//单选框改变选项
    //     console.log(e.target.value)
    //     this.setState({
    //         awardRule: e.target.value,
    //         value: e.target.value,
    //     });
    // }
    awarChange = (value) => {//改变奖励规则
        this.setState({
            sAwardRule:value.key,
            buttonStatus:true,
            ruleStatus:true,
        });
        // let params = this.state.params;
        if( value && value.key == 2 || value.key == 3 ) {
            this.setState({
                awardRule:value.key,
                amountDisable:true,
                modalString:value.label,
            });
        }else if(value && value.key == 1){
             // let params = this.state.params;
            this.setState({
                awardRule:value.key,
                amountDisable:false,
                modalString:value.label,
            });
        }
    }
    amountChange(e){//改变金额
        let { surplus } = this.state;
        Config.changeValue1000(e)
        if(e.target.value - surplus.balance > 0 ){
            this.setState({
               buttonStatus:false,
            });
        }else if(e.target.value.length == 0){
            this.setState({
                buttonStatus:false,
            });
        }else if(e.target.value == 0){
            this.setState({
                buttonStatus:false,
            });
        }else{
            this.setState({
                buttonStatus:true,
            });
        }
        this.setState({
            awardAmount: e.target.value
        });
    }
	render() {
        const { loading , surplus , amountDisable , awardAmount , sAwardRule , modalString , buttonStatus ,
             ruleStatus , modalGetString} = this.state;
        let sKey = { key: sAwardRule.toString() }

        let balance = 0;
        if( surplus && surplus.balance ){
            balance = surplus.balance;
        }
        let modalGetStr = ''
        if( modalGetString && modalGetString == 1 ){
            modalGetStr = '关闭'
        }else if( modalGetString && modalGetString == 2 ){
            modalGetStr = '申请进件'
        }else if( modalGetString && modalGetString == 3 ){
            modalGetStr = '进件审核通过'
        }else{
            modalGetStr = '关闭'
        }
        const bcrumb = [{
            'link': '/market/share',
            'value': '分享管理'
        }, {
            'link': null,
            'value':'规则设置',
		}];
        return (
            <Spin tip={Config.warnInfo.spinText} spinning={loading}>
                <div className="marketShareRule-container">
                <BcrumbItem bcrumb={bcrumb} />
                    <div className = 'common-console-container marketShareRule-content'>
                        <div className='rule-description'>
                            <h3 className='rule-description-title'><img className='rule-description-img' src={ ruleDescription } alt='ruleDescription'/><span className='rule-description-word'>分享规则说明</span></h3>
                            <div className='rule-description-content'>
                                <p className='rule-description-p'> 平台用户A分享产品给B，B在平台进行注册/进件且通过审核，则A获得现金红包奖励。</p>
                                <p className='rule-description-p'>分享营销是银行提供的一种营销形式，让客户能自主进行传播，从而增大获客量。</p>
                            </div>
                        </div>
                        <div className = 'marketShareRule-box'>
                            {/* <RadioGroup onChange={this.awarChange} value={this.state.value}>
                                <Radio value={1}>关闭</Radio>
                                <Radio value={2}>申请进件</Radio>
                                <Radio value={3}>进件审核通过</Radio>
                            </RadioGroup> */}
                            <div className='share-rule'>
                            奖励条件：
                            <Select
                                labelInValue
                                placeholder="奖励条件"
                                optionFilterProp="children"
                                onChange={this.awarChange}
                                filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                getPopupContainer={trigger => trigger.parentNode}
                                value={sKey}
                                >
                                <Option key={1} value='1'>关闭</Option>
                                <Option key={2} value='2'>申请进件</Option>
                                <Option key={3} value='3'>进件审核通过</Option>
                            </Select>
                            </div>
                            { amountDisable ?
                            <div className = 'amount'>奖励金额：
                                { awardAmount ?
                                <Input ref="amount"
                                placeholder="请输入金额"
                                value={awardAmount}
                                onChange={this.amountChange.bind(this)} style = {{width:'60px'}}/>:
                                <Input ref="amount"
                                placeholder="请输入金额"
                                onChange={this.amountChange.bind(this)} style = {{width:'60px'}}/>
                                }
                                <span style={{marginLeft:'10px'}}>元</span>
                                { surplus ?
                                <p className = 'surplus'>企业余额: {surplus.balance && surplus.balance || '0' } 元</p>
                                :<p className = 'surplus'>企业余额: 0 元</p>
                                }
                            </div>
                           :null
                            }

                            { awardAmount > balance ?
                           <p className = 'surplus-rule'>余额不足，将无法发送红包</p>:null}
                            { buttonStatus ?
                            <Button className = 'button' type="primary"  onClick={this.showModal}>保存设置</Button>
                            :<Button className = 'button' type="primary" disabled>保存设置</Button>}
                            <Button className = 'button button-exit' onClick={()=>this.onExit()} >取消</Button>
                            <div>
                                <Modal
                                visible={this.state.visible}
                                onOk={this.handleOk}
                                onCancel={this.handleCancel}
                                className='rule-visible'
                                >
                                { sAwardRule && sAwardRule == 1 ?
                                <p>奖励规则已关闭，是否保存？</p>:
                                    ( ruleStatus ?
                                    <p>奖励条件修改成{ modalString }，红包金额已修改成{awardAmount}元，是否保存修改？</p>:
                                    <p>{ modalGetStr }红包金额已修改成{awardAmount}元，是否保存修改？</p>
                                    )
                                }
                                </Modal>
                            </div>
                        </div>
                    </div>
                </div>
            </Spin>
        )
    }
}

export default MarketShareRule;
