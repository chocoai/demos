import React, { Component } from 'react'; // 引入了React
import { Row, Col } from 'antd';

/**
 * 表单展示基本单元
 * @Author: 赵俊
 * @Date:   2018-03-19
 * @Last Modified by:   赵俊
 * @Last Modified time: 2018-03-19
 */
class CommonDetail extends Component {
    // moduleType模块, fieldConfig配置，detailData获取内容，tmpImg图片信息， tmpVerify验证结果
    render() {
        let { moduleType, fieldConfig, detailData, tmpImg, tmpVerify } = this.props;
        let arr = ['verified', 'inconsistent', 'unknown', 'unverified']  //0核实匹配1核实不匹配2未知3未核实
        // 模块是否存在校验项或者图片查看项
        if (tmpImg[moduleType] || tmpVerify[moduleType]) {
            return (
                <Row className="personal-info-content" type="flex" justify="start">
                    {
                        Object.values(fieldConfig[moduleType]).sort((i1, i2) => i1.position - i2.position).filter(i => i.isshow && !(i.detailRely && detailData[i.detailRely.target] === i.detailRely.result)).map((i, index) => {
                            switch (i.detailType) {
                                case "whether":
                                    return <Col key={index} span={i.detailWidth} className="subtitle">
                                        <span>{i.fieldChName}：{detailData[i.detailName] == null ? '暂无信息' : detailData[i.detailName] ? '是' : '否'}</span>
                                    </Col>
                                default:
                                    return <Col key={index} span={i.detailWidth} className="subtitle">
                                        <span>{i.fieldChName}：{detailData[i.detailName] && `${detailData[i.detailName]}${i.unit || ''}` || '暂无信息'}</span>{tmpImg[i.formEnName][i.fieldEnName]}{tmpVerify[i.formEnName][i.fieldEnName]}
                                    </Col>
                            }
                        })
                    }
                </Row>
            )
        } else {
            return (
                <Row className="personal-info-content" type="flex" justify="start">
                    {
                        Object.values(fieldConfig[moduleType]).sort((i1, i2) => i1.position - i2.position).filter(i => i.isshow && !(i.detailRely && detailData[i.detailRely.target] === i.detailRely.result)).map((i, index) => {
                            switch (i.detailType) {
                                case "whether":
                                    return <Col key={index} span={i.detailWidth} className="subtitle">
                                        <span>{i.fieldChName}：{detailData[i.detailName] == null ? '暂无信息' : detailData[i.detailName] ? '是' : '否'}</span>
                                    </Col>
                                case "verify":
                                    return <Col key={index} span={i.detailWidth} className="subtitle">
                                        <span>{i.fieldChName}：{detailData[i.detailName] && `${detailData[i.detailName]}${i.unit || ''}` || '暂无信息'}</span>
                                        {detailData[i.detailVerifyRet] == null || detailData[i.detailVerifyRet] == 3 ? <span className={arr[3]}>未核实</span> : <span className={arr[detailData[i.detailVerifyRet]]}>{detailData[[i.detailVerify]]}</span>}
                                    </Col>
                                default:
                                    return <Col key={index} span={i.detailWidth} className="subtitle">
                                        <span>{i.fieldChName}：{detailData[i.detailName] && `${detailData[i.detailName]}${i.unit || ''}` || '暂无信息'}</span>
                                    </Col>
                            }
                        })
                    }
                </Row>
            )
        }
    }
}

export default CommonDetail;
