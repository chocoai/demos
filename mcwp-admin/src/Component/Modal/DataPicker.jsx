import React, { Component } from 'react';
import { is, fromJS } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Config } from '../../Config/Index';
import { saveCitiesId, saveIndustry } from '../../Redux/Action/Index';
import './style/dataPicker.less';

import { Modal, Tabs, Tag } from 'antd';
const TabPane = Tabs.TabPane;
const CheckableTag = Tag.CheckableTag;

/**
 * Modal对话框(数据联动) 省市区、受众行业
 *
 * @export
 * @class DataPicker
 * @extends {Component}
 */
class Datapicker extends Component {
	constructor(props) {
		super(props); //后才能用this获取实例化对象
		this.state = {
            selectedTags: [],
            selectedDatas: [],
            tabsOffsetHeight: 0,
            initCitiesId: '',
            initIndustry: ''
        };
	}
    shouldComponentUpdate(nextProps, nextState) { // 必须加上不然componentDidUpdate，会反复调用
        this.timer && clearTimeout(this.timer);
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state),fromJS(nextState))
    }
    componentDidUpdate(prevProps, prevState) {
        this.timer = setTimeout(() => {
            this.setState({
                tabsOffsetHeight: this.selectedTags ? this.selectedTags.offsetHeight : 0
            });
        }, 0);
    }
    componentDidMount() {
        const that = this;
        const { sData, mData, selectedCitiesId, selectedIndustry, actions } = that.props;
        if (mData.level == 2 && selectedIndustry) {
            that.setState({ 
                selectedTags: selectedIndustry.tags,
                selectedDatas: selectedIndustry.datas,
                initIndustry: {tags: selectedIndustry.tags || [], datas: selectedIndustry.datas || []}
            });
            return;
        }
        if (mData.level == 3 && selectedCitiesId) {
            that.setState({ 
                selectedTags: selectedCitiesId.tags,
                selectedDatas: selectedCitiesId.datas,
                initCitiesId: {tags: selectedCitiesId.tags || [], datas: selectedCitiesId.datas || []}
            });
            return;
        } 
        let nextSelectedTags = [];
        let nextSelectedDatas = []; 
        if (sData && sData.tag) {
            nextSelectedTags = sData.tag.split(',');
        }
        if (sData && sData.text) {
            let sDataText = sData.text.split(' ');
            for (let i = 0; i < sDataText.length; i++) {
                let selectedData = {
                    ddValue: nextSelectedTags[i],
                    ddText: sDataText[i]
                }
                nextSelectedDatas.push(selectedData);
            }
        }
        if (mData.level == 2) {
            actions.saveIndustry({tags: nextSelectedTags || [], datas: nextSelectedDatas || []});
            that.setState({
                initIndustry: {tags: nextSelectedTags || [], datas: nextSelectedDatas || []}
            });
        }
        if (mData.level == 3) {
            actions.saveCitiesId({tags: nextSelectedTags || [], datas: nextSelectedDatas || []});
            that.setState({
                initCitiesId: {tags: nextSelectedTags || [], datas: nextSelectedDatas || []}
            });
        } 
        that.setState({ 
            selectedTags: nextSelectedTags || [],
            selectedDatas: nextSelectedDatas || []
        });
    }
	setModalVisible (bool, title, setType) {
        const that = this;
        const { selectedTags, selectedDatas, initCitiesId, initIndustry } = that.state;
        const { actions, mData } = that.props;
        if(mData.level == 2 && setType == 'ok') {
            actions.saveIndustry({tags: selectedTags || [], datas: selectedDatas || []});
            that.props.changeValue('saveIndustry', selectedDatas);
        } else if (mData.level == 2 && setType == 'cancel') {
            actions.saveIndustry({tags: initIndustry && initIndustry.tags || [], datas: initIndustry && initIndustry.datas || []});
        }
        if(mData.level == 3 && setType == 'ok') {
            actions.saveCitiesId({tags: selectedTags || [], datas: selectedDatas || []});
            that.props.changeValue('saveCitiesId', selectedDatas);
        } else if (mData.level == 3 && setType == 'cancel') {
            actions.saveCitiesId({tags: initCitiesId && initCitiesId.tags || [], datas: initCitiesId && initCitiesId.datas || []});
        }
		that.props.cbModalVisible(bool, title);
	}
    handleChange(item, checked, fItem) {
        const that = this;
        const tag = item.ddValue;
        let { selectedTags, selectedDatas } = that.state;
        const { actions, mData } = that.props;
        let nextSelectedTags = [];
        let nextSelectedDatas = [];
        if (item.dictDTOS && item.dictDTOS.length > 0) {
            if (checked) {
                // 行业
                item.dictDTOS.map((pItem, pIndex) => {
                    for (let i = 0; i < selectedTags.length; i++) {
                        if (pItem.ddValue == selectedTags[i]) {
                            selectedTags.splice(i, 1);
                            selectedDatas.splice(i, 1);
                        }
                        // 省删除区
                        if (pItem.dictDTOS && pItem.dictDTOS.length) {
                            let len = selectedTags.length
                            pItem.dictDTOS.map(sItem => {
                                for (let i = 0; i < selectedTags.length; i++) {
                                    if (sItem.ddValue == selectedTags[i]) {
                                        selectedTags.splice(i, 1);
                                        selectedDatas.splice(i, 1);
                                    }
                                }
                            })
                            // 点击所有关闭区选项
                            if (len != selectedTags.length) {
                                const tagText = document.getElementsByClassName('picker-tag-text');
                                for(let i = 0; i < tagText.length; i++) {
                                    tagText[i].style.display = 'none'
                                }
                            }
                        }
                    }
                });
                // 删除所有
                nextSelectedTags = [...selectedTags, tag].filter(i => +i != -1);
                nextSelectedDatas = [...selectedDatas, item].filter(i => +i.ddValue != -1);
            } else {
                nextSelectedTags = selectedTags.filter(t => t !== tag);
                nextSelectedDatas = selectedDatas.filter(t => t.ddValue !== tag);
            }
        } else {
            if (checked) {
                for(let i = 0; i < selectedTags.length; i++) {
                    if (item.parentValue == selectedTags[i]) { 
                        selectedTags.splice(i, 1);
                        selectedDatas.splice(i, 1);
                    }
                }
                // 所有行业删除其他选项
                if (+tag == -1) {
                    nextSelectedTags = [tag];
                    nextSelectedDatas = [item];
                } else {
                    nextSelectedTags = [...selectedTags, tag].filter(i => +i != -1);
                    nextSelectedDatas = [...selectedDatas, item].filter(i => +i.ddValue != -1);
                }                
                // 区删除省
                if (fItem) {
                    nextSelectedTags = nextSelectedTags.filter(t => t !== fItem.ddValue);
                    nextSelectedDatas = nextSelectedDatas.filter(t => t.ddValue !== fItem.ddValue);
                }
            } else {
                nextSelectedTags = selectedTags.filter(t => t !== tag);
                nextSelectedDatas = selectedDatas.filter(t => t.ddValue !== tag);
            }
        }
        if(mData.level == 2) {
            actions.saveIndustry({tags: nextSelectedTags || [], datas: nextSelectedDatas || []});
        }
        if(mData.level == 3) {
            actions.saveCitiesId({tags: nextSelectedTags || [], datas: nextSelectedDatas || []});
        } 
        that.setState({ 
            selectedTags: nextSelectedTags,
            selectedDatas: nextSelectedDatas
        });
    }
    showContentItem(ddValue) {
        const tagText = document.getElementsByClassName('picker-tag-text');
        for(let i = 0; i < tagText.length; i++) {
            tagText[i].style.display = 'none'
        }
        document.getElementById(ddValue).style.display = 'block';
    }
    changePane = (value) => {
        const tagText = document.getElementsByClassName('picker-tag-text');
        for(let i = 0; i < tagText.length; i++) {
            tagText[i].style.display = 'none'
        }
    }
	render() {
        const that = this;
        let { mData, pData, selectedCitiesId, selectedIndustry } = that.props;
        let selectedTags = [];
        let selectedDatas = [];
        let tempData = pData
        if(mData.level == 2 && selectedIndustry && selectedIndustry.tags) {
            selectedTags = selectedIndustry.tags;
            selectedDatas = selectedIndustry.datas;
        }
        if(mData.level == 3 && selectedCitiesId && selectedCitiesId.tags) {
            selectedTags = selectedCitiesId.tags;
            selectedDatas = selectedCitiesId.datas;           
        }   
        let { tabsOffsetHeight } = that.state;
        return (
			<Modal
	          title={mData.title}
	          wrapClassName="vertical-center-modal"
	          visible={mData.visible}
              onOk={() => this.setModalVisible(false, mData.code, 'ok')}
              onCancel={() => this.setModalVisible(false, mData.code, 'cancel')}
	          className="data-picker-modal"
              width={920}
              style={{ height: 600 }}
	        >   
                { selectedDatas.length > 0 ? <div ref={ref=>{this.selectedTags=ref}} className="selected-tags">
                    { selectedDatas.map((item, index) => (
                        <Tag key={item.ddValue} closable onClick={() => this.handleChange(item, false)}>{item.ddText}</Tag>
                    )) }
                </div> : null }
                <Tabs style={{marginTop: tabsOffsetHeight}} defaultActiveKey={tempData[0].ddValue} tabPosition={'left'} onChange={this.changePane}>
                    {tempData.map((item, index) => (
                        <TabPane tab={item.ddText} key={item.ddValue}>
                            <table className="checkable-picker">
                                <tbody>
                                    { item.dictDTOS.length > 0 ? mData.level == 3 ? Config.numberArray([{}, ...item.dictDTOS].length, mData.col).map((_, tIndex) => (
                                        // 每行0，7，14      其余为区分类
                                        tIndex%(mData.col + 1) == 0 ? 
                                        <tr className="city-tr" key={tIndex}>
                                            { [{}, ...item.dictDTOS].slice(tIndex * mData.col / (mData.col + 1), tIndex * mData.col / (mData.col + 1) + mData.col).map((cItem, cIndex) => (
                                                tIndex == 0 && cIndex == 0?
                                                <td key={new Date().toString()} className="picker-tag">
                                                    <CheckableTag checked={selectedTags.indexOf(item.ddValue) > -1} onChange={checked => this.handleChange(item, checked)}>
                                                        所有
                                                    </CheckableTag>
                                                </td>: 
                                                <td key={cItem.ddValue} className="picker-tag">
                                                    <CheckableTag checked={selectedTags.indexOf(cItem.ddValue) > -1} onChange={() => this.showContentItem(cItem.ddValue)}>
                                                        {cItem.ddText}
                                                    </CheckableTag>
                                                </td>
                                            )) }
                                        </tr> : 
                                        <tr id={[{ddValue: item.ddValue}, ...item.dictDTOS][tIndex-(Math.floor(tIndex/(mData.col+1))) - 1].ddValue} className="picker-tag-text" key={tIndex}>
                                            <td key='0'>
                                                <CheckableTag checked={selectedTags.indexOf([{ddValue: item.ddValue}, ...item.dictDTOS][tIndex-(Math.floor(tIndex/(mData.col+1))) - 1].ddValue) > -1} onChange={checked => this.handleChange([{ddValue: item.ddValue}, ...item.dictDTOS][tIndex-(Math.floor(tIndex/(mData.col+1))) - 1], checked, item)}>
                                                    所有 
                                                </CheckableTag>
                                            </td>    
                                            { [{ddValue: item.ddValue, dictDTOS: []}, ...item.dictDTOS][tIndex-(Math.floor(tIndex/(mData.col+1))) - 1].dictDTOS.map((pItem, pIndex) => (
                                                <td key={pItem.ddValue}>
                                                    <CheckableTag checked={selectedTags.indexOf(pItem.ddValue) > -1} onChange={checked => this.handleChange(pItem, checked, item)}>
                                                        {pItem.ddText}
                                                    </CheckableTag>
                                                </td>
                                            )) }
                                        </tr>
                                    )) : 
                                    // 受众行业
                                    <tr className="city-tr" key={index}>
                                        <td className="picker-tag" style={mData.code == 'szhy' ? {width: '248px'} : null}>
                                            <CheckableTag checked={selectedTags.indexOf(item.ddValue) > -1} onChange={checked => this.handleChange(item, checked)}>
                                                所有
                                            </CheckableTag>
                                        </td> 
                                        { item.dictDTOS.map((cItem, cIndex) => (
                                            <td key={cItem.ddValue} className="picker-tag" style={mData.code == 'szhy' ? {width: '248px'} : null}>
                                                <CheckableTag checked={selectedTags.indexOf(cItem.ddValue) > -1} onChange={checked => this.handleChange(cItem, checked)}>
                                                    {cItem.ddText}
                                                </CheckableTag>
                                            </td>
                                        )) }
                                    </tr> : 
                                    <tr className="city-tr" key={index}>
                                        <td className="picker-tag" style={mData.code == 'szhy' ? {width: '248px'} : null}>
                                            <CheckableTag checked={selectedTags.indexOf(item.ddValue) > -1} onChange={checked => this.handleChange(item, checked)}>
                                                所有
                                            </CheckableTag>
                                        </td>
                                    </tr>  
                                }
                                </tbody>
                            </table>
                        </TabPane>
                    ))}
                </Tabs>
	        </Modal>
		)
	}
}

// 将 store 中的数据作为 props 绑定到 Datapicker 上
const mapStateToProps = (state, ownProps) => {
    let { Common } = state;
    return {
        selectedCitiesId: Common.selectedCitiesId,
        selectedIndustry: Common.selectedIndustry
    }
}

// 将 action 作为 props 绑定到 Datapicker 上。
const mapDispatchToProps = (dispatch, ownProps) => ({
    actions: bindActionCreators({ saveCitiesId, saveIndustry }, dispatch)
});

const ReduxDatapicker = connect(mapStateToProps, mapDispatchToProps)(Datapicker); // 连接redux

export default ReduxDatapicker;