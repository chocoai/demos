import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import { message, Button } from 'antd';
import { Config } from '../../Config/Index';

// import productBg from './../../Assets/Images/product_bg_exhibition.png';
import './style/prdocutMarket.less';

import Credittype from './../../Assets/Images/product_icon_credittype-step.png';
import Interest from './../../Assets/Images/product_icon_Interest-step.png';
import Repayment from './../../Assets/Images/product_icon_repayment-step.png';


class PrdocutMarket extends Component {
        constructor(props) {
        super(props);
        this.state = {
            code:props.routeParams.id,
            info:'',
            loanType:'',
            reqCondition:'',
            audience:'',
            prdAd:''
        }
    }
    componentWillMount(){
        this.getInfo();
    }
    getInfo() {
        let params = {
            code: this.state.code
        };
        Config.get('/v1/prod/info/', params, (res) => {
            if(res.code == Config.errorCode.success) {
                console.log(res.data)
                this.setState({
                    info: res.data,
                    prdAd: res.data.prdAd || '',
                    loanType: res.data.loanType || '' ,
                    reqCondition: res.data.reqCondition || '',
                    audience: res.data.audience || '',
                })
                this.contentSync('prdAd',40);
                this.contentSync('loanType',50);
                this.contentSync('reqCondition',50);
                this.contentSync('audience',50);
            } else {
                this.props.router.push({
                    pathname: '/product'
                });       
            }
        });
    }
    describe = (e,name,h,l) => {
        this.contentSync(name,h);
        if ( e.target.value.length>l ) {
            e.target.value = e.target.value.substr(0, l);
            return;
        }
        this.setState({
            [name]: e.target.value
        })
    }
    contentSync(name,h){
        //此步为了让删减的时候高度改变
        this[name].style.height = h + 'px';
        this[name].style.height = this[name].scrollHeight + 'px';    
    }
    nextStep() {
        const {state} = this;
        if( !state.prdAd) {
            message.error('广告语长度不能为空');
            return;
        }
        if ( !state.loanType ) {
            message.error('放款方式不能为空');
            return;
        }
        if ( !state.reqCondition ) {
            message.error('申请资质不能为空');
            return;
        }
        if ( !state.audience ) {
            message.error('适用人群不能为空');
            return;
        }
        let params = {
            code: state.code,
            loanType: state.loanType,
            reqCondition: state.reqCondition,
            audience: state.audience,
            prdAd: state.prdAd
        }
        let current = this.props.current + 1;
        Config.put('/v1/prod/market', params, (res) => {
            if(res.code == Config.errorCode.success) {
                Config.localItem('PRODUCT_STEP', current);
                this.props.router.push({
                    pathname: '/product/add/' + current + '/' + params.code
                });
         	} else {
                message.error(res.msg);
         	}
        });
    }
    saveStep() {
        const {state} = this;
        if( !state.prdAd) {
            message.error('广告语长度不能为空');
            return;
        }
        if ( !state.loanType ) {
            message.error('放款方式不能为空');
            return;
        }
        if ( !state.reqCondition ) {
            message.error('申请资质不能为空');
            return;
        }
        if ( !state.audience ) {
            message.error('适用人群不能为空');
            return;
        }
        let params = {
            code: state.code,
            loanType: state.loanType,
            reqCondition: state.reqCondition,
            audience: state.audience,
            prdAd: state.prdAd
        }
        Config.put('/v1/prod/market', params, (res) => {
            if(res.code == Config.errorCode.success) {
                console.log(res);
                this.props.router.push({
                    pathname: '/product/all'
                });
         	} else {
                message.error(res.msg);
         	}
        });
    }
    render() {
        const { info } = this.state;
        if(!info) return <div></div>;
        console.log(info)
        return (
            <div className='prdocutMarket-container'>
                {/*<img className="market-bg" src={productBg} alt='bg' />*/}
                <div className='content-wrapper'>
                    {/*<h3 className='prdocutMarket-title'>助贷宝</h3>*/}
                    <div className='content-bg'>
                        <div className='content-ad'>
                            <textarea className="ad-input" type="text" defaultValue={info.prdAd} ref={ref=>{this.prdAd=ref}} onChange={(e)=>this.describe(e,'prdAd',40,30)} />
                        </div>
                    </div>
                    <p className='prdocutMarket-subtitle'>{info.prdName}</p>
                    <ul className='prdocutMarket-content'>
                        <li>
                            <p className='prdocutMarket-content-title'>贷款额度</p>
                            <p className='prdocutMarket-content-detail'>最高<span className='prdocutMarket-content-number'>{info.loanLimit}</span>万</p>
                        </li>
                        <li>
                            <p className='prdocutMarket-content-title'>日利率</p>
                            <p className='prdocutMarket-content-detail'><span className='prdocutMarket-content-number'>{info.loanRate}</span>‱</p>
                        </li>
                        <li>
                            <p className='prdocutMarket-content-title'>贷款周期</p>
                            <p className='prdocutMarket-content-detail'>最长<span className='prdocutMarket-content-number'>{info.loanMonthsText}</span>期</p>
                        </li>
                    </ul>
                    <ul className='prdocutMarket-type'>
                        <li className='prdocutMarket-type-detail'>
                            <img className='prdocutMarket-type-img' src={Repayment} alt='credittype' />
                            <p className='prdocutMarket-type-detailType'>还款方式:</p>
                            <ul className='prdocutMarket-type-detailName'>
                                {info.repaymentText && info.repaymentText.split(' ').map((item,index,arr)=>
                                    (index == arr.length-1? 
                                    <li key={index} className='prdocutMarket-type-list'>{item}</li>:
                                    <li key={index} className='prdocutMarket-type-list'>{item + '、'}</li>))
                                }
                            </ul>
                        </li>
                        <li className='prdocutMarket-type-detail'>
                            <img className='prdocutMarket-type-img' src={Interest} alt='credittype' />
                            <p className='prdocutMarket-type-detailType'>计息方式:</p>
                            <ul className='prdocutMarket-type-detailName'>
                                {info.interestText && info.interestText.split(' ').map((item,index,arr)=>
                                    (index == arr.length-1? 
                                    <li key={index} className='prdocutMarket-type-list'>{item}</li>:
                                    <li key={index} className='prdocutMarket-type-list'>{item + '、'}</li>))
                                }
                            </ul>
                        </li>
                        <li className='prdocutMarket-type-detail'>
                            <img className='prdocutMarket-type-img' src={Credittype} alt='credittype' />
                            <p className='prdocutMarket-type-detailType'>授信方式:</p>
                            <ul className='prdocutMarket-type-detailName'>
                                {info.authText && info.authText.split(' ').map((item,index,arr)=>
                                    (index == arr.length-1? 
                                    <li key={index} className='prdocutMarket-type-list'>{item}</li>:
                                    <li key={index} className='prdocutMarket-type-list'>{item + '、'}</li>))
                                }
                            </ul>
                        </li>
                    </ul>
                    <div className='prdocutMarket-loanType'>
                        <p className='prdocutMarket-loanType-title'>放款方式</p>
                        <textarea className='prdocutMarket-loanType-content' defaultValue={info.loanType || ''} placeholder='请输入' ref={ref=>{this.loanType=ref}} onChange={(e)=>this.describe(e,'loanType',50,256)}></textarea>
                    </div>
                    <div className='prdocutMarket-apply'>
                        <p className='prdocutMarket-apply-title'>申请资质</p>
                        <textarea className='prdocutMarket-apply-content' defaultValue={info.reqCondition || ''} placeholder='请输入' ref={ref=>{this.reqCondition=ref}} onChange={(e)=>this.describe(e,'reqCondition',50,256)}></textarea>
                    </div>
                    <div className='prdocutMarket-eligibility'>
                        <p className='prdocutMarket-eligibility-title'>适用人群</p>
                        <textarea className='prdocutMarket-eligibility-content' defaultValue={info.audience || ''} placeholder='请输入' ref={ref=>{this.audience=ref}} onChange={(e)=>this.describe(e,'audience',50,256)}></textarea>
                    </div>
                    <div className='prdocutMarket-tip'>
                        <p className='prdocutMarket-tip-title'>温馨提示</p>
                        <p className='prdocutMarket-tip-content'>{info.prdName}支持城市为{info.citiesText && info.citiesText.split(' ').map((item,index,arr)=>(index == arr.length-1? item + '，':item + '、'))}其他城市暂缓开通</p>
                    </div>
                    <p className="apply-enterpriseName">本产品出自：{info.enterpriseName}</p>
                    {/*<p className='prdocutMarket-ready'>立即申请</p>*/}
                </div>
                <div className='productMarket-button'>
                    <Button className="productMarket-next" type="primary" size="large" onClick={()=>this.nextStep()}>下一步</Button>
                    <Button className="productMarket-save" type="primary" size="large" onClick={()=>this.saveStep()}>保存</Button>
                </div>
            </div>
        )
    }
}

const purePrdocutMarket = pureRender(PrdocutMarket);

export default purePrdocutMarket;