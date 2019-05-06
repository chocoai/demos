import React, { Component } from 'react'; // 引入了React
import { browserHistory } from 'react-router';
import pureRender from 'pure-render-decorator';
import './style/resetSearch.less';
import { Button } from 'antd';

class ResetSearch extends Component {
    // 重置按钮作用 
    resetOptions = () => { 
        const defaultRouter = window.location.pathname;
        browserHistory.push(`${defaultRouter}`);
    }
    render() {
        return (
            <Button className="common-small-btn reset-button" onClick={this.resetOptions}>重置</Button>
        )
    }
}

const pureResetSearch = pureRender(ResetSearch);

export default pureResetSearch;