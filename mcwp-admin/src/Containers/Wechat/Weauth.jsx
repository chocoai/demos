import React, { Component } from 'react'; // 引入了React
import { Config } from '../../Config/Index';


/* 以类的方式创建一个组件 */
class Main extends Component {
    constructor(props) {
    	super(props);
        this.state = {};
    }
    componentDidMount() {
        window.location.href = decodeURIComponent(Config.getQueryString('redirectUrl'));
    }
	render() { 
		return (
            <div></div>
		);
	}
}

export default Main;