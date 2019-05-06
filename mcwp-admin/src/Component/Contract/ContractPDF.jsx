import React, { Component } from 'react';
import ReactPDF from 'react-pdf/build/entry.webpack';
import pureRender from 'pure-render-decorator';
import { Config } from '../../Config/Index';

import deleteImg from './../../Assets/Images/product_icon_close_pressed.png';
import previousImg from '../../Assets/Images/pop_icon_previous-page_default.png'
import nextImg from '../../Assets/Images/pop_icon_next-page_default.png'

import './style/contractPDF.less';

class ContractPDF extends Component {
    constructor(props) {
    	super(props);
      this.state = {
        file: props.file ? Config.target + props.file : Config.target + '/comm/tpl/preView/' + props.code,
        pageIndex: null,
        pageNumber: null,
        total: null,
      }
  }

  onDocumentLoad = ({ total }) => {
    this.setState({ total });
  }

  onPageLoad = ({ pageIndex, pageNumber }) => {
    this.setState({ pageIndex, pageNumber });
  }

  changePage(by) {
    this.setState(prevState => ({
      pageIndex: prevState.pageIndex + by,
    }));
  }

  render() {
    const { file, pageIndex, pageNumber, total } = this.state;
    const { width, previewClose } = this.props;
    return (
      <div className="contractPDF-container">
        <div className="page-container">
          <div className="page-change" style={{width:width+ 'px'}}>
            <img 
              src={previousImg} 
              alt='previous' 
              className="page-previous" 
              onClick={() => this.changePage(-1)}
            />
            <span className="page-number">{pageNumber || '--'} of {total || '--'}</span>
            <img 
              src={nextImg} 
              alt='previous' 
              onClick={() => this.changePage(1)}
              className="page-next" />
            {/*<button
              className="page-button"
              disabled={pageNumber <= 1}
              onClick={() => this.changePage(-1)}
            >
              Previous
            </button>
            <span className="page-number">{pageNumber || '--'} of {total || '--'}</span>
            <button
              className="page-button"
              disabled={pageNumber >= total}
              onClick={() => this.changePage(1)}
            >
              Next
            </button>*/}
            <img className='contract-preview-close' src={deleteImg} onClick={previewClose} alt="contract-preview-close"  />                        
          </div>
          <div className="contract-preview" style={{width:width+ 'px'}}>
            <ReactPDF
              file={{url: file}}
              onDocumentLoad={this.onDocumentLoad}
              onPageLoad={this.onPageLoad}
              pageIndex={pageIndex}
              width={width}
            />
          </div>
        </div>
      </div>
    );
  }
}

const pureContractPDF = pureRender(ContractPDF);

export default pureContractPDF;