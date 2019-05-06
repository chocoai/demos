import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import { Config } from '../../Config/Index';
import "./style/productStep.less";

import { message, Tabs, Button } from 'antd';
const TabPane = Tabs.TabPane;

class ProductStep extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: 2, //1为网贷 2为经营贷
            data: {
                code: props.routeParams.id,
                steps: [
                    // {
                    //     stepName: "",
                    //     stepIndex: 1,
                    //     itemIds: "www.baidu.com",
                    //     stepType: 1,
                    //     isshow: 1,
                    //     stepValue: "1"
                    // },
                    // {
                    //     stepName: "",
                    //     stepIndex: 2,
                    //     itemIds: "www.baidu.com",
                    //     stepType: 1,
                    //     isshow: 1,
                    //     stepValue: "2"
                    // },
                    // {
                    //     stepName: "",
                    //     stepIndex: 3,
                    //     itemIds: "www.baidu.com",
                    //     stepType: 1,
                    //     isshow: 1,
                    //     stepValue: "3"
                    // },
                    // {
                    //     stepName: "",
                    //     stepIndex: 4,
                    //     itemIds: "www.baidu.com",
                    //     stepType: 1,
                    //     isshow: 0,
                    //     stepValue: "5"
                    // },
                    // {
                    //     stepName: "",
                    //     stepIndex: 1,
                    //     itemIds: "www.baidu.com",
                    //     stepType: 2,
                    //     isshow: 1,
                    //     stepValue: "1"  
                    // },
                    // {
                    //     stepName: "",
                    //     stepIndex: 2,
                    //     itemIds: "www.baidu.com",
                    //     stepType: 2,
                    //     isshow: 1,
                    //     stepValue: "2"
                    // },
                    // {
                    //     stepName: "",
                    //     stepIndex: 3,
                    //     itemIds: "www.baidu.com",
                    //     stepType: 2,
                    //     isshow: 1,
                    //     stepValue: "3"
                    // },
                    // {
                    //     stepName: "",
                    //     stepIndex: 4,
                    //     itemIds: "www.baidu.com",
                    //     stepType: 2,
                    //     isshow: 1,
                    //     stepValue: "4"
                    // },
                    // {
                    //     stepName: "",
                    //     stepIndex: 5,
                    //     itemIds: "www.baidu.com",
                    //     stepType: 2,
                    //     isshow: 1,
                    //     stepValue: "5"
                    // }             
                ]
            }
        }
    }
    componentWillMount(){
        this.getSteps();
        this.judgeType();
        //目前不取字典值
        // this.getDictItems();
    }
    judgeType() {
        let params = {
            code: this.state.data.code
        };
        Config.get('/v1/prod/info/', params, (res) => {
            if(res.code == Config.errorCode.success) {
                this.setState({
                    type: res.data.prdType
                })
            } else {
                this.props.router.push({
                    pathname: '/product'
                });       
            }
        });
    }

    getDictItems(){
        let params = {
            code: "dclc,sqlc"
        }
        Config.get('/v1/sys/dict/items', params, (res) => {
            if(res.code == Config.errorCode.success) {
                this.changeDictItems(res.data);
         	} else {
                message.error(res.msg);
         	}
        });
    }
    //获取产品步骤
    getSteps(){
        let params = {
            code: this.state.data.code
        }
        Config.get('/v1/prod/listProdStep/' + params.code, params, (res) => {
            if(res.code == Config.errorCode.success) {
                let arr = res.data.sort((o1, o2)=>(o1.stepIndex - o2.stepIndex))
                this.setState({data: {
                    code: this.state.data.code,
                    steps:Object.assign(this.state.data.steps,arr)}
                })
         	} else {
                message.error(res.msg);
         	}
        });
    }
    //添加名称
    changeDictItems(data) {
        let sqlc = data.sqlc;
        let dclc = data.dclc;
        let steps = this.state.data.steps;

        let newSteps= [];
        for(let i=0; i < sqlc.length; i++){
            let newItem = steps.filter((item,index)=>(
                item.stepValue == sqlc[i].ddValue && item.stepType == 1
            ))
            if( newItem[0] ) {
                newItem[0].stepName = sqlc[i].ddText;
                newSteps.push(newItem[0]);
            }
        }
        for(let i=0; i < dclc.length; i++){
            let newItem = steps.filter((item,index)=>(
                item.stepValue == dclc[i].ddValue && item.stepType == 2
            ))
            if( newItem[0] ) {
                newItem[0].stepName = dclc[i].ddText;
                newSteps.push(newItem[0]);
            }
        }
        this.setState({data: {
            code: this.state.data.code,
            steps:Object.assign(this.state.data.steps,newSteps)}
        })
    }
    //显示
    showItem(item) {
        item.isshow = 1;
        let newSteps = this.state.data.steps;
        let sortSteps = newSteps.filter((oldItem,index)=>(
            oldItem.stepName != item.stepName
        ))
        sortSteps.push(item);
        this.setState({data: {
            code: this.state.data.code,
            steps:Object.assign(this.state.data.steps,sortSteps)}
        })
        sortSteps.push(item);
    }
    //固定顺序显示
    showSortItem(item) {
        item.isshow = 1;
        let newSteps = this.state.data.steps;
        let sortSteps = newSteps.filter((oldItem,index)=>(
            oldItem.stepName != item.stepName
        ))
        sortSteps.push(item);
        sortSteps.sort((one,two)=>(
            one.stepIndex - two.stepIndex
        ))
        this.setState({data: {
            code: this.state.data.code,
            steps:Object.assign(this.state.data.steps,sortSteps)}
        })
    }
    //隐藏
    deleteItem(item){
        item.isshow = 0;
        let newSteps = this.state.data.steps;
        let sortSteps = newSteps.filter((oldItem,index)=>(
            oldItem.stepName != item.stepName
        ))
        sortSteps.push(item);
        this.setState({data: {
            code: this.state.data.code,
            steps:Object.assign(this.state.data.steps,sortSteps)}
        })
    }
    //下一步
    nextStep(){
        let params = Config.serializeObjects(this.state.data);
        // let current = this.props.current + 1;
        Config.put('/v1/prod/batchInsertProdStep', params, (res) => {
            if(res.code == Config.errorCode.success) {
                // Config.localItem('PRODUCT_STEP', current);
                // this.props.router.push({
                //     pathname: '/product/add/' + current + '/' + params.code
                // });
                this.putProduct();
         	} else {
                message.error(res.msg);
         	}
        });
    }
    putProduct(){
        let params = {
            code: this.state.data.code,
            pubOp: 2
        }
        let current = this.props.current + 1;
        Config.put('/v1/prod/prodPub/' + params.code, params, (res) => {
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
    //保存
    saveStep(){
        let params = Config.serializeObjects(this.state.data);
        Config.put('/v1/prod/batchInsertProdStep', params, (res) => {
            if(res.code == Config.errorCode.success) {
                this.props.router.push({
                    pathname: '/product/all'
                });
         	} else {
                message.error(res.msg);
         	}
        });
    }
    render() {
        // const applyContent = (
        //     <div>
        //         <p className="productStep-addItem">选择元素</p>
        //         <ul className="productStep-minItem-container">
        //             {
        //                 this.state.data.steps
        //                 .filter((item,index)=>(
        //                     item.stepType ==1 && item.isshow ==0
        //                 )).map((item,index)=>(
        //                     <li className="productStep-minItem" key={index} onClick={()=>this.showItem(item)}>{item.stepName}</li>
        //                 ))
        //             }                   
        //         </ul>
        //     </div>
        // ),
        // investContent = (
        //     <div>
        //         <p className="productStep-addItem">选择元素</p>
        //         <ul className="productStep-minItem-container">
        //             {
        //                 this.state.data.steps
        //                 .filter((item,index)=>(
        //                     item.stepType ==2 && item.isshow ==0
        //                 )).map((item,index)=>(
        //                     <li className="productStep-minItem" key={index} onClick={()=>this.showSortItem(item)}>{item.stepName}</li>
        //                 ))
        //             }                
        //         </ul>
        //     </div>
        // )
        return (
            <div className='productStep-container'>
                <Tabs defaultActiveKey="1"  onChange={this.changeTab}>
					<TabPane tab="借款人" key="1">
                        <p className="productStep-title">申请流程</p>
                        <ul className="productStep-content">
                            {
                                this.state.data.steps
                                .filter((item,index)=>(
                                    item.stepType ==1 && item.isshow ==1
                                )).map((item,index)=>(
                                    <li className="productStep-item" key={index}>{item.stepName}</li>
                                ))
                            }
                            {/*item.stepType == 1 && (item.stepValue == 1 || item.stepValue == 2 || item.stepValue == 3) ?
                            <li className="productStep-item" key={index}>{item.stepName}</li>:
                            <li className="productStep-item" key={index}>{item.stepName}<img className="productStep-delete" src={deleteIcon} alt='delete' onClick={()=>this.deleteItem(item)} /></li>*/}
                            {/*{
                                this.state.data.steps
                                .filter((item,index)=>(
                                    item.stepType ==1 && item.isshow ==0
                                )).length == 0?
                                null:
                                <Popover
                                    content={applyContent}
                                    placement="right"
                                    trigger="click"
                                    getPopupContainer={triggerNode => triggerNode.parentNode}
                                >
                                    <li className="productStep-item">
                                        <img className="productStep-add" src={addIcon} alt="add" />
                                    </li>
                                </Popover>
                            }*/}
                        </ul>
                        {/*<div>
                            <p className="productStep-title">调查流程</p>
                            <ul className="productStep-content">
                                {
                                    this.state.data.steps
                                    .filter((item,index)=>(
                                        item.stepType ==2 && item.isshow ==1
                                    )).map((item,index)=>(
                                        item.stepType == 1 && (item.stepValue == 1 || item.stepValue == 2) ?
                                        <li className="productStep-item" key={index}>{item.stepName}</li>:
                                        <li className="productStep-item" key={index}>{item.stepName}<img className="productStep-delete" src={deleteIcon} alt='delete' onClick={()=>this.deleteItem(item)} /></li>
                                    ))
                                }
                                {
                                    this.state.data.steps
                                    .filter((item,index)=>(
                                        item.stepType ==2 && item.isshow ==0
                                    )).length == 0?
                                    null:
                                    <Popover
                                        content={investContent}
                                        placement="right"
                                        trigger="click"
                                        getPopupContainer={triggerNode => triggerNode.parentNode}
                                    >
                                        <li className="productStep-item">
                                            <img className="productStep-add" src={addIcon} alt="add" />
                                        </li>
                                    </Popover>
                                }
                            </ul>
                        </div>*/}
                    </TabPane>
                    {/**
                     * this.state.type == 2?
                        <TabPane tab="共同借款人" key="2">
                            <div>
                                <p className="productStep-title">申请流程</p>
                                <ul className="productStep-content">
                                    <li className="productStep-item">基本信息</li>
                                </ul>
                            </div>
                        </TabPane>: null
                     */}
                    {/**
                     *  this.state.type == 2?
					<TabPane tab="担保人" key="3">
                        <div>
                            <p className="productStep-title">申请流程</p>
                            <ul className="productStep-content">
                                <li className="productStep-item">基本信息</li>
                            </ul>
                        </div>
					</TabPane>: null
                     */}

				</Tabs>
                <Button className="productStep-next" type="primary" size="large" onClick={()=>this.nextStep()}>发布</Button>
                <Button className="productStep-save" type="primary" size="large" onClick={()=>this.saveStep()}>保存</Button>
            </div>
        )
    }
}

const pureProductStep = pureRender(ProductStep);

export default pureProductStep;