import React, { Component } from 'react'; // 引入了React
import pureRender from 'pure-render-decorator';

import deleteImg from './../../Assets/Images/product_icon_close_pressed.png';

import './style/detailImg.less';

/**
 * 人脸识别详细
 * @Author: 赵俊
 * @Date:   2017-08-09
 * @Last Modified by:   赵俊
 * @Last Modified time: 2017-08-09
 */
class DetailImg extends Component {
  render() {
      const { detailPic, previewHide, pictureInfo, baseInfo, idcard } = this.props;
      return (    
          <div className={detailPic?'detailImg-container':'detailImg-close'}>                   
              <div className='detail-img'>
                      {
                          idcard=='idcard'?
                          <div style={{overflow: "scroll", height: "100%", width: "100%"}}>
                              <p className='idcard-identity'>五类证核实：</p>
                              <p className='idcard-identity'>{baseInfo.basicInfoVerifyDTO.identityIegality}</p>
                              { 
                                pictureInfo && pictureInfo.LOAN_PERSON && pictureInfo.LOAN_PERSON.length > 0 &&  pictureInfo.LOAN_PERSON.map((item, index) => (
                                  item.bizType == 'LOAN_PERSON_IDENTITY_FRONT' ? <img key={item.code} className='idcard-img' src={item.srcUrl} alt='' /> : (item.bizType == 'LOAN_PERSON_IDENTITY_BACK' ? <img key={item.code} className='idcard-img' src={item.srcUrl} alt='' /> : null)
                                ))
                              }
                          </div>
                          :
                          <div style={{overflow: "scroll", height: "100%", width: "100%"}}>
                              <p className='idcard-subtitle'>
                                  <span className={baseInfo.basicInfoVerifyDTO.faceVerifyRet ? 'face-failed': 'face-verify'}>{baseInfo.basicInfoVerifyDTO.faceVerify}</span>
                                  <span className='face-thresholds'>{baseInfo.basicInfoVerifyDTO.faceThresholds}</span>
                              </p>
                              { 
                                pictureInfo && pictureInfo.LOAN_PERSON && pictureInfo.LOAN_PERSON.length > 0 &&  pictureInfo.LOAN_PERSON.map((item, index) => (
                                  item.bizType == 'LOAN_PERSON_IDENTITY_FACE' ? <img key={item.code} className='idcard-img' src={item.srcUrl} alt='' /> : (item.bizType == 'LOAN_PERSON_IDENTITY_FRONT' ? <img key={item.code} className='idcard-img' src={item.srcUrl} alt='' /> : null)
                                ))
                              }
                          </div>
                      }
                  <img className='detail-img-close' alt="detail-img-close" src={deleteImg} onClick={()=>previewHide('detailPic')} />                        
              </div>
          </div> 
      )
  }
}


const pureDetailImg = pureRender(DetailImg);

export default pureDetailImg;