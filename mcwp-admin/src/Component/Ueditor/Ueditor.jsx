import React, { Component } from 'react'; // 引入了React
import { Config } from '../../Config/Index';
import pureRender from 'pure-render-decorator';

// import './ueditor/ueditor.config.js';
import './ueditor/ueditor.all.min.js';
import './ueditor/lang/zh-cn/zh-cn.js';
import './ueditor/ueditor.parse.min.js';
// 引入方式有待修改
/**
 * 富文本编辑器
 * @Author: 赵俊
 * @Date:   2017-08-08
 * @Last Modified by: 赵俊
 * @Last Modified time: 2017-08-08
 */
class Ueditor extends Component {
    constructor(props) {
    	super(props);
    	this.state = {
		};
	}

    componentDidMount(){
        this.initEditor();
    }
    componentWillUnmount() {
        // 组件卸载后，清除放入库的id
        let UE = window.UE;
        UE.delEditor(this.props.id);
    }
    initEditor() {
        const { id, toolbars, content, htbl, wordCount, maximumWords } = this.props;
        let blArr = [];
        htbl && htbl.map((item, index)=>(
            blArr.push({tag:'input', name:`${item.ddText}`, label:`{${item.ddText}}`, value: `{${item.ddText}}`, readonly: '', style:`font-family:FangSong;font-size:16px;text-align:center;width:${item.ddText.length * 16 + 12}px;border:none;`})
        ))
        let UE = window.UE;
        const ueEditor = UE.getEditor(id, {
            // 工具栏，不配置有默认项目
            toolbars: toolbars?toolbars:[[
                'fullscreen', 'undo', 'redo', '|',
                'bold', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch',
                '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
                'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
                'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
                'indent', '|',
                'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
                'horizontal'
            ]],
            lang: 'zh-cn',
            // 字体
            'fontfamily': [
                {label: '', name: 'songti', val: 'SimSun'},
                {label: '', name: 'heiti', val: 'SimHei'},
                {label: '仿宋', name: 'fangsong', val: 'FangSong'},
                {label: '', name: 'arial', val: 'arial, helvetica,sans-serif'},
                {label: '', name: 'timesNewRoman', val: 'times new roman'}
            ],
            // 字号
            'fontsize': [16],
            // 为编辑器实例添加一个路径，必需项
            'UEDITOR_HOME_URL': Config.ueditor,
            // 上传图片时后端提供的接口
            // serverUrl: window.api_host + '/innerMessage/uploadImage',
            enableAutoSave: false,
            autoHeightEnabled: false,
            initialFrameHeight: this.props.height,
            initialFrameWidth: this.props.width,
            // 是否允许编辑
            readonly: this.props.disabled,
            // 元素路径
            elementPathEnabled : false,
            // 字数统计
            wordCount: wordCount? wordCount : false,    
            maximumWords: maximumWords,   
            //自动同步编辑器要提交的数据,该处有待验证
            autoSyncData: false,
            customstyle:blArr,
            //粘贴只保留标签，去除标签所有属性
            // retainOnlyLabelPasted: true
        });
        // ueEditor.commands['customstyle'] = { execCommand: function(e) { console.log(e);this.execCommand('insertHtml', "<img src='http://www.hougelou.com/images/logo.png' />"); return true; }, queryCommandState: function() { } };
        const that = this;
        ueEditor.ready((ueditor) => {
            // 初始化内容
            ueEditor.execCommand('inserthtml', content);
            if (!ueditor) {
                let UE = window.UE;
                UE.delEditor(id);
                that.initEditor();
            }
        })
    }
    // search = () => {
    //      var location = UE.dom.domUtils.getXY( window.frames[1].document.getElementsByClassName("variable")[0] );
    //      console.log(location)
    // }

	render() {
        const { id } = this.props;
		return (
			<div className="ueditor-container">
                {/*<button onClick={this.insert}>插入变量</button>*/}
                {/*<button onClick={this.search}>计算距离</button>*/}
                <script id={id} name="content" type="text/plain">
                </script>
                {/*<button onClick={submit}>保存</button>*/}
		    </div>
		);
	}
}

const pureUeditor = pureRender(Ueditor);

export default pureUeditor;

