import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';

import './style/pdfBase.less'

class PDFBase extends Component {
    constructor (props) {
    	super(props);
        this.state = {
        }
    }
    componentWillMount () {
    }

    render () {
        const { baseInfo} = this.props;
        let loanCustomer = baseInfo.loanCustomer;      // 个人信息
        return (
            <div className='ipieces-pdfBase-container'>
                <p>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</p>
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>
                <p>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</p>
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                <p>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</p>
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                <p>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</p>
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                <p>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</p>
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                <p>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</p>
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                <p>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</p>
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                <p>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</p>
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                <p>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</p>
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                <p>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</p>
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                <p>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</p>
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                <p>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</p>
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                <p>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</p>
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                <p>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</p>
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                <p>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</p>
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                <p>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</p>
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                <p>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</p>
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                <p>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</p>
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                <p>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</p>
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                <p>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</p>
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                <p>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</p>
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                <p>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</p>
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                <p>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</p>
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                <p>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</p>
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                <p>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</p>
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                <p>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</p>
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                <p>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</p>
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                <p>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</p>
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                <p>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</p>
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                <p>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</p>
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                <p>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</p>
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                <p>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</p>
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                <p>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</p>
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                <p>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</p>
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                <p>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</p>
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                <p>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</p>
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                <p>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</p>
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                <p>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</p>
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                <p>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</p>
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                <p>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</p>
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                <p>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</p>
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                <p>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</p>
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                <p>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</p>
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                <p>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</p>
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                <p>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</p>
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                <p>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</p>
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                <p>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</p>
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                <p>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</p>
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                <p>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</p>
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                <p>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</p>
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                <p>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</p>
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                <p>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</p>
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                <p>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</p>
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                <p>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</p>
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                <p>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</p>
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                <p>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</p>
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                <p>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</p>
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                <p>姓名：{loanCustomer && loanCustomer.handInputName || '未录入'}</p>
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>               
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>                
                <p>性别：{loanCustomer.sex || '未录入'}</p>
                <p>年龄：{loanCustomer && loanCustomer.age +'岁' || '未录入'}</p>
                <p>户籍：{loanCustomer.censusRegister || '未录入'}</p>
                <p>身份证号：{loanCustomer.idCardNo || '未录入'}</p>
            </div>
        )
    }
}

const purePDFBase = pureRender(PDFBase);

export default purePDFBase;