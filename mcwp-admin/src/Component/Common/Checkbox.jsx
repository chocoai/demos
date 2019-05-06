import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
// import { Config } from '../../Config/Index';
import './style/checkbox.less';

class Checkbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checkboxData: props.checkboxData || [{
                roleId: 0,
                roleNickName: "管理员",
                select: false
            }, {
                roleId: 1,
                roleNickName: "主管",
                select: false
            }, {
                roleId: 2,
                roleNickName: "风控主管",
                select: false
            }],
            defaultValue: props.value || '1',
            keyName: 'roleNickName',
            keyIndex: 'roleId'
        }
    }
    componentDidMount () {
        // 初始选中
        const {checkboxData, defaultValue, keyIndex} = this.state
        let arr = defaultValue.split(',')
        checkboxData.map(i => {
            if (arr.includes(i[keyIndex] + '')) {
                i.select = true
            } else {
                i.select = false
            }
        })
        this.setState({
            checkboxData: [...checkboxData]
        })
    }
    select (item) {
        const { checkboxData, keyIndex } = this.state
        checkboxData.map(i => {
            if (i[keyIndex] != item[keyIndex]) return;
            i.select = !i.select
        })
        this.setState({
            checkboxData: [...checkboxData]
        })
        this.props.onChange(checkboxData.filter(i => i.select).map(i => i[keyIndex]).join(','))
    }
    render() {
        const { checkboxData, keyIndex, keyName } = this.state
        return (
            <div className="checkbox-container">
                {
                    checkboxData && checkboxData.length > 0 ? checkboxData.map((item, index) => {
                        return <div className={item.select ? 'list listSelected': 'list'} key={item[keyIndex]} onClick={() => this.select(item)}>{item[keyName]}</div>
                    }) : null
                }
            </div>
        )
    }
}

const pureCheckbox = pureRender(Checkbox);

export default pureCheckbox;
