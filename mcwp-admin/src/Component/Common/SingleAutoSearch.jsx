import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
import './style/singleAutoSearch.less';

import { Icon, Input, AutoComplete, Button } from 'antd';
const Option = AutoComplete.Option;

class SingleAutoSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render() {
        const { } = this.state;
        return (
            <div className="single-search-container" style={{ width: 300 }}>
                <AutoComplete
                className="single-search"
                size="large"
                style={{ width: '100%' }}

                placeholder="请输入"
                optionLabelProp="text"
                >
                <Input
                    suffix={(
                    <Button className="search-btn" size="large" type="primary">
                        <Icon type="search" />
                    </Button>
                    )}
                />
                </AutoComplete>
            </div>
        )
    }
}

const pureSingleAutoSearch = pureRender(SingleAutoSearch);

export default pureSingleAutoSearch;