import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';
// import { Config } from '../../Config/Index';
import './style/button.less';

class Button extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: props.type || 'login',
            text: props.text || '登录'
        }
    }
    componentDidMount() {
    }
    render() {
        const {type, text} = this.state
        return (
            <div className='button-container'>
                <button className={type}>{text}</button>
            </div>
        )
    }
}

const pureButton = pureRender(Button);

export default pureButton;