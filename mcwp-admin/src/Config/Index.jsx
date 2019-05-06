import { browserHistory } from 'react-router'; // 创建route所需
import get from 'lodash.get'

const Config = {
    target: process.env.NODE_ENV == 'development' ? '/api' : (process.env.NODE_ENV == 'production_test' ? 'http://mcwp.test.zhudb.com/backend' : (process.env.NODE_ENV == 'production_advance' ? window.location.protocol + '//' + window.location.host + '/backend' : window.location.protocol + '//' + window.location.host + '/backend')), //接口配置
    domain: window.location.protocol + '//' + window.location.host,
    baseText: {
        name: '微贷作业管理平台',
        pScript: 'https://www.promisejs.org/polyfills/promise-6.1.0.min.js',
        oScript: 'https://gosspublic.alicdn.com/aliyun-oss-sdk.min.js',
        footer: 'Copyright © 杭州钱袋金融信息服务有限公司',
        custTemplate: 'http://pfile.zhudb.com/template/%E6%89%B9%E9%87%8F%E5%AF%BC%E5%85%A5%E5%AE%A2%E6%88%B7%E6%A8%A1%E6%9D%BF.xlsx'
    },
    menuKey: {
        logout: 'logout', // 退出登录
        modpwd: 'modpwd', // 修改密码
        addcc: 'addcc', // 创建企业账户
        addnew: 'addnew', // 新增用户
        alltask: 'alltask', // 全部任务
        delaytask: 'delaytask', // 延期任务
        awaittask: 'awaittask', // 待完成任务
        completetask: 'completetask' // 已完成任务
    },
    // 自制类型
    showType: {
        loanPersonSpouse: 'LOAN_PERSON_SPOUSE',
        loanPledgeAll: 'LOAN_PLEDGE_ALL'
    },
    // oss类型
    bizType: {
        loanPerson: 'LOAN_PERSON',      // 个人信息
        loanSpouse: 'LOAN_SPOUSE',      // 配偶信息
        loanEmergency: 'LOAN_EMERGENCY_CONTRACT', // 紧急联系人
        loanPledge: 'LOAN_PLEDGE',         // 抵质押
        loanPledgehouse: 'LOAN_PLEDGEHOUSE',    // 抵质押房产
        loanFamily: 'LOAN_FAMILY',      // 家庭信息
        loanBusiBase: 'LOAN_BUSIBASE',  // 经营基本
        loanBusiInfo: 'LOAN_BUSIINFO',  // 经营信息
        loanCoborrower: 'LOAN_COBORROWER',      // 共同借款人
        loanGuarantee: 'LOAN_GUARANTEE',        // 共同担保人
        loanHouse: 'LOAN_HOUSE',                // 房产
        loanCar: 'LOAN_CAR',                    // 车辆
        loanCarinfo: 'LOAN_CARINFO',                    // 车辆信息
        loanMachine: 'LOAN_MACHINE_INFO',       // 机械设备
        loanPersonOth: 'LOAN_PERSON_OTH',      // 个人信息其他
        loanSpouseOth: 'LOAN_SPOUSE_OTH',      // 配偶信息其他
        loanEmergencyOth: 'LOAN_EMERGENCY_CONTRACT_OTH', // 紧急联系人
        loanFamilyOth: 'LOAN_FAMILY_OTH',      // 家庭信息
        loanBusiBaseOth: 'LOAN_BUSIBASE_OTH',  // 经营基本
        loanBusiInfoOth: 'LOAN_BUSIINFO_OTH',  // 经营信息
        loanCoborrowerOth: 'LOAN_COBORROWER_OTH',      // 共同借款人
        loanGuaranteeOth: 'LOAN_GUARANTEE_OTH',        // 共同担保人
        loanHouseOth: 'LOAN_HOUSE_OTH',                // 房产
        loanCarOth: 'LOAN_CAR_OTH',                    // 车辆
        loanMachineOth: 'LOAN_MACHINE_INFO_OTH',       // 机械设备
        loanPersonCredit: 'LOAN_PERSON_CREDIT', // 进件.个人信息.征信报告
        loanPersonCreditWhiteIdentity: 'LOAN_PERSON_CREDIT_WHITE_IDENTITY', // 进件.个人信息. 征信白户图片
        loanSpouseCredit: 'LOAN_SPOUSE_CREDIT', // 进件.配偶信息.征信报告
        loanSpouseCreditWhiteIdentity: 'LOAN_SPOUSE_CREDIT_WHITE_IDENTITY', // 进件.配偶信息.征信报告白户证明
        loanCoborrowerCredit: 'LOAN_COBORROWER_CREDIT', // 进件.共同借款人.征信报告
        loanGuaranteeCredit: 'LOAN_GUARANTEE_CREDIT', // 进件.担保人.征信报告
        borrow: 'BORROW', // 借款管理.查看文件
        borrowPic: 'BORROW_PIC', // 借款管理.微信文件
        borrowAccessory: 'BORROW_ACCESSORY', // 借款管理.文件上传
        loanCreditPerson: 'LOAN_CREDIT_PERSON',  // 征信情况.借款人征信
        loanCreditSpouse: 'LOAN_CREDIT_SPOUSE',  // 征信情况.配偶征信
        loanCreditCoborrower: 'LOAN_CREDIT_COBORROWER', // 征信情况.共同借款人征信
        loanCreditGuarantee: 'LOAN_CREDIT_GUARANTEE', // 征信情况.担保人征信
        loanCreditPledge: 'LOAN_CREDIT_PLEDGE',  // 征信情况.抵押人征信
        loanPersonFront: 'LOAN_PERSON_IDENTITY_FRONT',
        loanPersonBack: 'LOAN_PERSON_IDENTITY_BACK',
        loanPersonFace: 'LOAN_PERSON_IDENTITY_FACE',
        citizenLoan: 'CITIZEN_LOAN',             // 市民贷
        merchantInfoFile: 'OPERATE_MERCHANT_INFO_FILE', //商家渠道
        merchantInfoFileOth: 'OPERATE_MERCHANT_INFO_FILE_OTH', //商家渠道其他
        jigsawActivityConfLogo: 'JIGSAW_ACTIVITY_CONF_LOGO',//拼图活动银行logo
        jigsawActivityConfQrcode: 'JIGSAW_ACTIVITY_CONF_QRCODE',//拼图活动银行二维码
        jigsawConfigGameImg: 'JIGSAW_CONFIG_GAME_IMG',//拼图活动游戏图片
        borrowAfterData: 'BORROW_AFTER_DATA',//借款.贷后资料
        shakeConfigGameImg: 'SHAKE_CONFIG_GAME_IMG',//"摇一摇.配置.游戏图片"
        shakeActivityConfLogo: 'SHAKE_ACTIVITY_CONF_LOGO',//"摇一摇.活动配置.银行logo"
        shakeActivityConfQrcode: 'SHAKE_ACTIVITY_CONF_QRCODE',//"摇一摇.活动配置.银行二维码"
        shareShake: 'SHARE_SHAKE',//"摇一摇.分享图片"
        shareJigsaw: 'SHARE_JIGSAW',//"拼图.分享图片"
        shareLottery: 'SHARE_LOTTERY',//"抽奖.分享图片"
        shareRate: 'SHARE_RATE',//"砍利率.分享图片"
        shareBonus: 'SHARE_BONUS',//"抵息红包.分享图片"
        shareShare: 'SHARE_SHARE',//"分享有礼.分享图片"
        shareIndex: 'SHARE_INDEX',//"首页.分享图片"
        rateKnifeBg: 'RATE_KNIFE_BG',//"砍刀页面背景"
        rateHelpBg: 'RATE_HELP_BG',//"好友助力页面背景"
        rateProdImg: 'RATE_PROD_IMG',//"好友产品页面背景"
        rateQrcode: 'RATE_QRCODE',//"好友助力二维码"
        shareActivity: 'SHARE_ACTIVITY',//"分享活动页面"
        microstationBanner: 'MICROSTATION_BANNER',//"微站热门活动"
        microstationIndexBanner: 'MICROSTATION_INDEX_BANNER',//"微站banner"
        activityBonusGraphic: 'ACTIVITY_BONUS_GRAPHIC',//"抵息红包.活动图文配置"
        activityBonusHelp: 'ACTIVITY_BONUS_HELP',//"抵息红包.好友助力背景"
        activityBonusHelpProd: 'ACTIVITY_BONUS_HELP_PROD',//"抵息红包.好友助力.产品图片"
        activityBonusHelpQrcode: 'ACTIVITY_BONUS_HELP_QRCODE',//"抵息红包.好友助力.二维码"
        borrowMortgageAndOtherData: 'BORROW_MORTGAGE_AND_OTHER_DATA',//借款.抵押登记证和其他照片
        borrowGuaranteeAndOtherData: 'BORROW_GUARANTEE_AND_OTHER_DATA',  //借款.担保函和其他照片
        loanPersonReplenishData: 'LOAN_PERSON_REPLENISH_DATA',  //进件.个人信息.补充信息
        loanCreditFamily:'LOAN_CREDIT_FAMILY', //信用家庭证书
    },
    tplType: {
        tplProductCover: 'TPL_PRODUCT_COVER',
        tplMarkey: 'TPL_MARKET',
        tplProductPage: 'TPL_PRODUCT_PAGE',
    },
    ossKey: {
        bucket: 'zhudaibao',
        region: 'oss-cn-hangzhou',
        prodNet: '006|001', // 表示某银行下网贷类产品通用模板
        prodOpe: '006|002'  // 表示某银行下经营贷类产品通用营销模板
    },
    // 13 双签移除、市民贷 15 syns、市民贷 14 btnj、市民贷 12 lc、市民贷 16 sxdt、车贷 17btnj
    // 进件不同类型的配置
    ipiecesTypeConfig: {
        12: {
            city: 'lc',
            finalAuditUrl: '/v1/loan/citizen/finalAudit'
        },
        14: {
            city: 'btnj',
            finalAuditUrl: '/v1/loan/citizen/btnj/finalAudit'
        },
        15: {
            city: 'syns',
            finalAuditUrl: '/v1/loan/citizen/syns/finalAudit'
        },
        16: {
            city: 'sxdt',
            finalAuditUrl: '/v1/loan/citizen/sxdt/finalAudit'
        },
        17: {
            city: 'nj',
            finalAuditUrl: '/v1/loan/car/nj/finalAudit'
        }
    },
    ipiecesShow: {
        detailVerifyResult: [12, 14, 15, 16, 17], // 头部结果：通常显示
        detailVerifyResultAuthMoney: [12], // 授信金额
        detailVerifyResultOrgScore: [12], // 初审评分
        detailVerifyResultOrgRank: [12], // 初审评级
        detailVerifyResultFnlScore: [12, 14, 15, 17], // 综合授信审核通过评分
        detailVerifyResultFnlRank: [12, 14, 15, 17], // 综合授信审核通过评级
        ipiecesBreadcrumb: [12, 14, 15, 16, 17],
        ipiecesEditReject: [12, 14, 15, 16, 17], // 审批拒绝
        approveCheckApproveStatus: [12, 14, 15, 16, 17], // 审批直接进入编辑状态，不展示已有数据
        approveCheckApproveTip: [12, 14, 15, 16], // 审批编辑状态顶部 tip
        approveCheckApproveDailyRate: [12, 14, 15, 16], // 审批中借款日利率回显
        approveCheckApprovePeriod: [12, 14, 15, 16, 17], // 审批还款期数，全可选
        approveCheckApproveKind: [12, 14, 15, 16], // 审批还款方式，全可选
        approveCheckCheckStatus: [12, 14, 15, 16, 17], // 审查直接进入编辑状态，不展示已有数据
        approveCheckCheckDailyRate: [12, 14, 15, 16], // 审查中借款日利率回显
        approveCheckVoiceShorts: [17], // 审批时语音速记显示
        approveCheckReBackApprove: [12, 14, 15, 16], // 审批时无打回
        approveCheckReBackCheck: [12, 14, 15, 16, 17], // 审查时无打回
        approveCheckReBackTip:[17],//打回时无tip提示
        dataSum: [12, 14, 15, 16]
    },
    login: {
        usernameNull: '请输入您的用户名',
        passwordNull: '请输入您的密码',
        captchaNull: '请输入验证码',
        loginError: '您输入的账号或密码不正确,请重新输入',
        captchaImg: '/user/captcha?w=200&h=100'
    },
    warnInfo: {
        manageNull: '请选择归属客户经理',
        spinText: 'Loading...',
        usernameNull: '请输入您的用户名！',
        usernameRule: '用户名由数字或字母组成，长度4位到16位',
        amountRule: '请输入0.01至1000之间的数',
        nameNull: '请输入您的姓名',
        customerNameNull: '请输入客户姓名',
        idCardNoNull: '请输入身份证号',
        custTypeNull: '请选择客户类型',
        dotAddressNull: '请输入网点地址',
        nameRule: '姓名最长不超过16位',
        passwordNull: '请输入您的密码',
        passwordRule: '密码由数字和字母组成，长度8到20位',
        telephoneNull: '请输入您的联系方式',
        telephoneRule: '请输入有效的联系方式',
        maritalStatusNull: '请选择婚姻状况',
        orgNameNull: '请输入企业名称',
        addressNull: '请输入居住地址',
        emailNull: '请输入您的邮箱',
        emailRule: '请输入有效的邮箱',
        roleNull: '请选择您的角色',
        accountNull: '请输入企业账户',
        accountMax: '企业账户最长不超过32位',
        accountEnNumber: '只能输入英文字符和数字',
        busNameNull: '请输入企业名称',
        busNameMax: '企业名称最长不超过64位',
        linkManNull: '请输入联系人',
        linkManMax: '联系人最长不超过16位',
        linkPhoneNull: '请输入手机号',
        enterpriseTypeNull: '请选择企业类型',
        statusNull: '请选择账户类型',
        userScaleNull: '请选择用户规模',
        cusManagerNull: '请输入客户经理',
        agentNull: '请选择代理商',
        domainNull: '请输入二级域名',
        domainMin: '二级域名最短不少于3位',
        domainMax: '二级域名最长不超过32位',
        expireDateNull: '请设置到期时间',
        systemError: '后台系统异常，请联系管理员！',
        passwordError: '两次密码不相同，请重新输入！',
        prdNameNull: '请输入产品名称',
        prdNameRule: '产品名称不超过64个字符',
        preAdword: '宣传语不超过10个字',
        prdTypeNull: '请选择产品类型',
        loanLimitNull: '请输入最高额度',
        LoanLimitMax: '最高额度不超过9999.999',
        loanAuthDaysNull: '请输入最长授信周期',
        LoanAuthDaysRule: '最长授信周期范围(1-360)',
        LoanMonthsNull: '请输入最长用信周期',
        LoanMonthsRule: '最长用信周期范围(1-360)',
        loanRateNull: '请输入日利率',
        loanRateRule: '日利率范围(0-0.9999)',
        loanRateRuleLength: '日利率最多保留4位小数',
        ageLimitNull: '年龄限制必填',
        ageLimitRule: '年龄不合法',
        ageOrderRule: '最小年龄不能大于最大年龄',
        custIndustryNull: '请选择受众行业',
        audienceNull: '适用人群必填',
        audienceRule: '适用人群字数不超过100',
        loanTypeNull: '放款方式必填',
        loanTypeRule: '放款方式字数不超过256',
        reqConditionNull: '申请资质必填',
        reqConditionRule: '申请资质字数不超过256',
        repaymentKindNull: '请选择还款方式',
        interestTypeNull: '请选择计息方式',
        textareaLimit: '最少两个字符',
        textareaMax: '超过最大长度',
        dataTypeError: '数据类型不符合要求',
        authMoneyNull: '请输入授信金额',
        authMoneyError: '授信金额只能输入数字和小数且最多两位小数',
        authTypeNull: '请选择授信类型',
        ageMaxNull: '请输入年龄限制',
        pointNull: '请输入网点名称',
        adressNull: '请输入网点地址',
        startTimeNull: '请输入网点开始营业时间',
        endTimeNull: '请输入网点结束营业时间',
        citiesTextNull: '请选择支持城市',
        industryTextNull: '请选择受众行业',
        coverTpl: '请选择模板',
        productAd: '请输入宣传语',
        uploadImg: '暂无照片',
        bankNameNull: '请输入支行名称',
        bankPhoneNull: '请输入支行电话'
    },
    errorCode: {
        success: 0, // 请求成功
        userNotExist: 'USER_NOT_EXIST', // 用户不存在
        userDisable: 'USER_DISABLE', // 用户不可用
        accountExist: 'ACCOUNT_EXIST', // 账号已存在
        accountLocked: 'ACCOUNT_LOCKED', // 账号被锁定
        passwordIncorrect: 'PASSWORD_INCORRECT', // 密码不正确
        loginCaptcha: 'PASSWORD_INCORRECT_CODE', // 登录图片验证码
        invalidLoginCaptcha: 'REGISTER_CODE_INVALID', // 无效的图片验证码
        authorityWithout: 'AUTHORITY_WITHOUT', // 权限不足
        tokenExpire: 'TOKEN_EXPIRE', // Token到期
        notActive: 'not active', // 账号未激活
        userKickout: 'USER_KICKOUT',
        qrCodeTimeout: 'QRCODE_TIMEOUT',  // 二维码过期
        cannotDelTeam: 'CANNOT_DELETE_TEAM',//不能删除小组
        channelImportError: 'CHANNEL_IMPORT_ERROR',
    },
    constants: {
        repeatReq: 'REPEAT_REQ'
    },
    // 表单本地存储，可替换为redux
    formConfLocal: {
        formConf: 'FORM_CONF',
        formApplyConf: 'FORM_APPLY_CONF',
        formInvestigateConf: 'FORM_INVESTIGATE_CONF',
        formInvestigateModule: 'FORM_INVESTIGATE_MODULE'
    },
    fetchParams: {
        userType: 1 // 用户类型，1为运营平台用户(登界面录)
    },
    ueditor: process.env.NODE_ENV == 'development' ? '/mcwpadmin/dist/ueditor/' : '/dist/ueditor/',
    // select中有没有当前的值
    setValueInNot(value, arr) {
        if (arr && arr.length > 0) {
            return arr.filter(item => item.ddValue == value).length
        } else {
            return 0
        }

    },
    // select中有没有当前的值
    setValueInNot2(value, arr) {
        if (arr && arr.length > 0) {
            return arr.filter(item => item.code == value).length
        } else {
            return 0
        }

    },
    // 将数字转化为数组
    numberArray(n, c) {
        const len = Math.ceil(n / c) + n; // 获取tr的个数
        return [...Array(len)].map((_, i) => i);
    },
    // 只能输入10个字
    WordLen10(e, Message) {
        let value = e.target.value;
        if (value.length > 10) {
            e.target.value = value.slice(0, 10);
            Message.error('最多10个字');
        }
    },
    //只能输入15个字
    WordLen15(e, Message) {
        let value = e.target.value;
        if (value.length > 15) {
            e.target.value = value.slice(0, 15);
            Message.error('最多15个字');
        }
    },
    //只能输入25个字
    WordLen25(e, Message) {
        let value = e.target.value;
        if (value.length > 25) {
            e.target.value = value.slice(0, 25);
            Message.error('最多25个字');
        }
    },
    //只能输入数字和小数点，小数点后面最多两位
    NumberOnly(e) {
        let value = e.target.value;
        let number = parseFloat(value);
        if (value == '-' || value == '0-' || value == '--') return e.target.value = '-';
        if (isNaN(number)) {
            let numString = value.toString();
            //排除首位不为数字和符号的情况
            if (/([-]?)(\d{1,10})(\.?)(\d{0,2})$/.test(value)) {
                numString = numString.slice(1);
                //排除在首位之后插入其他字符的情况
                //此处为判断NaN
                if (parseFloat(numString) != parseFloat(numString)) {
                    numString = numString.slice(1);
                }
                e.target.value = numString;
                return;
            }
            e.target.value = 0;
            return;
        }
        if (/^([-]?)(\d{1,10})(\.?)(\d{0,2})$/.test(value)) {
            //排除首位为0的情况
            let numString = value.toString();
            if (numString[0] == 0 && numString[1] != '.') {
                e.target.value = number;
            }
            return;
        }
        if (/^([-]?)(\d{1,10})(\.?)(\d{0,2})$/.test(number)) {
            //排除倒数第二位为.的时候重置
            let numString = value.toString();
            if (numString.slice(-2, -1) == '.') {
                e.target.value = number + '.';
                return;
            }
            e.target.value = number;
        } else {
            number = number.toString().slice(0, -1);
            e.target.value = number;
        }
    },
    //1到31，整数
    changeDay31(e, Message) {
        if (e.target.value == '') return;
        let number = parseInt(e.target.value, 10);
        if (isNaN(number)) {
            e.target.value = 1;
            return;
        }
        if (number >= 1 && number <= 31) {
            e.target.value = number;
            return;
        }
        if (number > 31) {
            e.target.value = 31;
            Message.error('日期为1到31整数');
            return;
        }
        if (number < 1) {
            e.target.value = 1;
            return;
        }
    },
    //1到12，整数
    changeMonth12(e, Message) {
        if (e.target.value == '') return;
        let number = parseInt(e.target.value, 10);
        if (isNaN(number)) {
            e.target.value = 1;
            return;
        }
        if (number >= 1 && number <= 12) {
            e.target.value = number;
            return;
        }
        if (number > 12) {
            e.target.value = 12;
            Message.error('月份为1到12整数');
            return;
        }
        if (number < 1) {
            e.target.value = 1;
            return;
        }
    },
    //整数
    changeValueInt(e, Message) {
        if (e.target.value == '') return;
        let number = parseInt(e.target.value, 10);
        if (isNaN(number)) {
            e.target.value = 1;
            return;
        }
        if (number >= 1) {
            e.target.value = number;
            return;
        }
        if (number < 1) {
            e.target.value = 1;
            return;
        }
    },
    //0到10000，两位小数
    changeValue9999(e) {
        let value = e.target.value;
        let number = parseFloat(e.target.value);
        if (isNaN(number)) {
            e.target.value = 0;
            return;
        }
        if (/^(\d{1,4})(\.)(\d{0,2})$/.test(value)) {
            return;
        }
        if (/^(\d{1,4})(\.)(\d{3})$/.test(value)) {
            e.target.value = value.toString().slice(0, -1);
            return;
        }
        if (number >= 0 && number < 9999.99) {
            e.target.value = number;
            return;
        }
        if (number >= 9999.99) {
            e.target.value = 9999.99;
            return;
        }
        if (number <= 9999.99) {
            e.target.value = 0;
            return;
        }
    },
    //0.01到10000，两位小数
    changeValue10000(e) {
        let value = e.target.value;
        let number = parseFloat(e.target.value);
        if (isNaN(number)) {
            e.target.value = 0.01;
            return;
        }
        if (/^(\d{1,4})(\.)(\d{0,2})$/.test(value)) {
            return;
        }
        if (/^(\d{1,4})(\.)(\d{3})$/.test(value)) {
            e.target.value = value.toString().slice(0, -1);
            return;
        }
        if (number > 0 && number < 9999.99) {
            e.target.value = number;
            return;
        }
        if (number >= 9999.99) {
            e.target.value = 9999.99;
            return;
        }
        if (number <= 9999.99) {
            e.target.value = 0.01;
            return;
        }
    },
    //0到1000，两位小数
    changeValue1000(e) {
        let value = e.target.value;
        let number = parseFloat(e.target.value);
        if (/^(\d{1,2})(\.)(\d{0,2})$/.test(value)) {
            return;
        }
        if (/^(\d{1,2})(\.)(\d{3})$/.test(value)) {
            e.target.value = value.toString().slice(0, -1);
            return;
        }
        if (number >= 0 && number < 999.99) {
            e.target.value = number;
            return;
        }
        if (number >= 999.99) {
            e.target.value = 999.99;
            return;
        }
        if (number <= 999.99) {
            e.target.value = 0;
            return;
        }
    },
    //0到99.99，两位小数
    changeValue(e) {
        let value = e.target.value;
        let number = parseFloat(e.target.value);
        if (isNaN(number)) {
            e.target.value = 0;
            return;
        }
        if (/^(\d{1,2})(\.)(\d{0,2})$/.test(value)) {
            return;
        }
        if (/^(\d{1,2})(\.)(\d{3})$/.test(value)) {
            e.target.value = value.toString().slice(0, -1);
            return;
        }
        if (number >= 0 && number < 99.99) {
            e.target.value = number;
            return;
        }
        if (number >= 99.99) {
            e.target.value = 99.99;
            return;
        }
        if (number <= 99.99) {
            e.target.value = 0;
            return;
        }
    },
    //0到100，两位小数
    changeValue100(e) {
        let value = e.target.value;
        let number = parseFloat(e.target.value);
        if (isNaN(number)) {
            e.target.value = 0;
            return;
        }
        if (/^(\d{1,2})(\.)(\d{0,2})$/.test(value)) {
            return;
        }
        if (/^(\d{1,2})(\.)(\d{3})$/.test(value)) {
            e.target.value = value.toString().slice(0, -1);
            return;
        }
        if (number >= 0 && number < 100) {
            e.target.value = number;
            return;
        }
        if (number >= 100) {
            e.target.value = 100;
            return;
        }
        if (number <= 100) {
            e.target.value = 0;
            return;
        }
    },
    //-99.99到99.99，两位小数
    changeTypeValue(e) {
        let value = e.target.value;
        let number = parseFloat(e.target.value);
        if (isNaN(number) && (value != '-') && (value != '')) {
            e.target.value = '';
            return;
        }
        if (/^(\d{1,2})(\.)(\d{0,2})$/.test(value)) {
            return;
        }
        if (/^(-)(\d{1,2})(\.)(\d{0,2})$/.test(value)) {
            return;
        }
        if (/^(\d{1,2})(\.)(\d{3})$/.test(value)) {
            e.target.value = value.toString().slice(0, -1);
            return;
        }
        if (number >= -99.99 && number < 99.99) {
            e.target.value = number;
            return;
        }
        if (number >= 99.99) {
            e.target.value = 99.99;
            return;
        }
        if (number <= -99.99) {
            e.target.value = -99.99;
            return;
        }
    },
    //临时验证，以后删除
    checkNum(rule, value, callback) {
        if (!value) {
            callback();
            return;
        }
        if (value >= 1) {
            callback();
            return;
        }
        callback('请输入正整数!');
    },
    //身份证验证
    checkIdCard(rule, value, callback) {
        if (!value) {
            callback();
            return;
        }
        // if ( /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(value) ) {
        if (/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(value)) {
            callback();
            return;
        }
        callback('请输入正确的身份证号');
    },
    //比例验证
    checkScale(rule, value, callback) {
        if (!value) {
            callback();
            return;
        }
        if (value < 100 && value >= 1) {
            callback();
            return;
        }
        callback('范围1到100!');
    },
    // 打开征信报告
    creditOpen(credit) {
        credit.map((item, index) => {
            return window.open(item['srcUrl'], '_blank')
        })

    },
    newWin(url, id) {
        var a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('target', '_blank');
        a.click();
    },
    formatDateTime(inputTime) {
        var date = new Date(inputTime);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        var minute = date.getMinutes();
        var second = date.getSeconds();
        minute = minute < 10 ? ('0' + minute) : minute;
        second = second < 10 ? ('0' + second) : second;
        return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
    },
    formatDateTimeChar(inputTime) {
        var dates = parseInt(inputTime)
        var date = new Date(dates);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        return y + '年' + m + '月' + d + '日';
    },
    formatStrTime(inputTime) {
        // var date = new Date(inputTime.replace(/-/g, '/'));
        return Date.parse(inputTime);
    },
    // 千位符
    numberWithCommas(num) {
        return num.toString().includes('.') ?
            num.toString().replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
                return $1 + ",";
            }) :
            num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
	/**
	 * 对ajax数据进行特殊转化
	 *
	 * @param {any} params:数据
	 * @returns
	 */
    serializeObjects(params) {
        var obj = {};
        for (var k in params) {
            var o = params[k];
            if ('[object Array]' === Object.prototype.toString.call(o))
                for (var i = 0; i < o.length; i++) {
                    var o1 = o[i];
                    if ('[object Object]' === Object.prototype.toString.call(o1))
                        for (var k1 in o1) {
                            var o2 = o1[k1];
                            if ('[object Array]' === Object.prototype.toString.call(o2)) {
                                for (var i2 = 0; i2 < o2.length; i2++) {
                                    var o3 = o2[i2];
                                    for (var k3 in o3) {
                                        obj[(k + '[' + i + '].' + k1 + '[' + i2 + '].' + k3).toString()] = o3[k3];
                                    }
                                }
                            } else {
                                obj[(k + '[' + i + '].' + k1).toString()] = o1[k1];
                            }
                        }
                    else obj[(k + '[' + i + ']').toString()] = o1;
                } else if ('[object Object]' === Object.prototype.toString.call(o))
                for (var k2 in o) obj[(k + '.' + k2).toString()] = o[k2];
            else obj[k.toString()] = o;
        }
        return obj;
    },
	/**
	 * 对ajax数据进行特殊转化两层
	 *
	 * @param {any} params:数据
	 * @returns
	 */
    serializeObjectsTwo(params) {
        var obj = {};
        for (var k in params) {
            var o = params[k];
            if ('[object Array]' === Object.prototype.toString.call(o))
                for (var i = 0; i < o.length; i++) {
                    var o1 = o[i];
                    if ('[object Object]' === Object.prototype.toString.call(o1))
                        for (var k1 in o1) obj[(k + '[' + i + '].' + k1).toString()] = o1[k1];
                    else obj[(k + '[' + i + ']').toString()] = o1;
                } else if ('[object Object]' === Object.prototype.toString.call(o))
                for (var k2 in o) obj[(k + '.' + k2).toString()] = o[k2];
            else obj[k.toString()] = o;
        }
        return obj;
    },
	/**
	 * 对ajax数据进行特殊转化
	 *
	 * @param {any} params:数据
	 * @returns
	 */
    conversion(value) {
        let minute = Math.floor(value / 60);
        minute = minute.toString().length === 1 ? ('0' + minute) : minute;
        let second = Math.floor(value % 60);
        second = second.toString().length === 1 ? ('0' + second) : second;
        return `${minute}:${second}`;
    },
    conversionHour(value) {
        let minute = Math.floor(value / 60 % 60);
        minute = minute.toString().length === 1 ? ('0' + minute) : minute;
        let second = Math.floor(value % 60);
        second = second.toString().length === 1 ? ('0' + second) : second;
        let hour = Math.floor(value / 3600);
        hour = hour.toString().length === 1 ? ('0' + hour) : hour;
        return `${hour}:${minute}:${second}`;
    },
    /**
	 * 获取OSS UUID
	 *
	 * @param {any} len:长度
	 * @returns
	 */
    getOssUUID(len) {
        len = len || 11;
        var $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        var maxPos = $chars.length;
        var str = '';
        for (let i = 0; i < len; i++) {
            str += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return str;
    },
	/**
	 * 获取链接参数信息
	 *
	 * @param {any} name:参数名
	 * @returns
	 */
    getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)
            // return unescape(r[2]);
            return r[2];
        return null;
    },
	/**
	 * 获取图形验证码
	 *
	 * @param {any} scene场景，宽，高
	 * @returns
	 */
    getCaptchaImg(scene, w, h) {
        return '/comm/captcha?scene=' + scene + '&width=' + w + '&height=' + h + '&v=' + Math.random();
    },
	/**
	 * 变量是否为空
	 *
	 * @param {any} data
	 * @returns
	 */
    isNull(data) {
        return data == '' || data == undefined || data == null || JSON.stringify(data) == "{}";
    },
	/**
	 * 只能输入英文
	 *
	 * @param {any} str
	 * @returns
	 */
    limitEn(str) {
        var reg = new RegExp(/^[A-Za-z]+$/);
        if (!reg.test(str)) {
            return false;
        }
        return true;
    },
	/**
	 * 只能输入英文和数字
	 *
	 * @param {any} str
	 * @returns
	 */
    limitEnNumber(str) {
        var reg = new RegExp(/^[0-9A-Za-z]+$/);
        if (!reg.test(str)) {
            return false;
        }
        return true;
    },
	/**
	 * 验证密码(8到20位，数字和英文的结合)
	 *
	 * @param {any} password
	 * @returns
	 */
    checkPassword(password) {
        let str = password;
        var reg = new RegExp(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/);
        if (!reg.test(str)) {
            return false;
        }
        return true;
    },
	/**
	 * 验证用户名(4-16位数字或字母组成)
	 *
	 * @param {any} username
	 * @returns
	 */
    checkUsername(username) {
        let str = username;
        if (this.isNull(str) || str.length < 4 || str.length > 16) {
            return false;
        }
        var reg1 = new RegExp(/^[0-9A-Za-z]+$/);
        if (!reg1.test(str)) {
            return false;
        }
        return true;
    },
	/**
	 * 验证手机号
	 *
	 * @param {any} phone
	 * @returns
	 */
    checkTelephone(phone) {
        let reg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
        phone = phone.replace(/[\u202D+\u202C+\s+]/g, '');
        if (!reg.test(phone)) {
            return false;
        } else {
            return true;
        }
    },
    /**
     * 去除特殊字符 空格/左对齐/右对齐
     *
     */
    clearSpecChars(str) {
        return str.replace(/[\u202D+\u202C+\s+]/g, '')
    },
	/**
	 *  变量只能输入数字和小数点（保留2位小数）
	 *
	 * @param {any} phone
	 * @returns
	 */
    checkNumberTwo(str) {
        var reg = /^[0-9]{1}\d*(\.\d{1,2})?$/;
        if (!reg.test(str)) {
            return false;
        }
        return true;
    },
    /**
	 *  变量只能输入数字和小数点（保留4位小数）
	 *
	 * @param {any} phone
	 * @returns
	 */
    checkNumberFour(str) {//0-0.9999
        var reg = /^0.\d{1,4}$/;
        if (!reg.test(str)) {
            return false;
        }
        return true;
    },
	/**
	 *  变量只能输入数字
	 *
	 * @param {any} phone
	 * @returns
	 */
    checkNumber(str) {
        var reg = /^[1-9]{1}\d*$/;
        if (!reg.test(str)) {
            return false;
        }
        return true;
    },
	/**
	 * 变量只能输入数字和小数点（保留3位小数）
	 *
	 * @param {any} data
	 * @returns
	 */
    checkNumberThree(data) {
        var reg = /^\d*\.{0,1}\d{1,3}$/;
        if (!reg.test(data)) {
            return false;
        }
        return true;
    },
	/**
	 * 验证年龄（只能是不超过三位数的数字）
	 *
	 * @param {any} phone
	 * @returns
	 */
    checkAgeLimit(str) {
        var reg = new RegExp(/^[0-9]*[1-9][0-9]*$/);
        if (!reg.test(str) || str.length > 3) {
            return false;
        }
        return true;
    },
	/**
	 * 判断是否过期
	 *
	 * @param {any}
	 * @returns
	 */
    isExpire() {
        return new Date().getTime() > (this.localItem('CAPTCHA_EXPIRE') || 0);
    },
	/**
	 * 获取到期时间
	 *
	 * @param {any} num
	 * @returns
	 */
    getExpire(num) {
        return new Date().getTime() + num * 1000;
    },
	/**
	 * 参数格式化
	 *
	 * @param {any} data
	 * @returns
	 */
    paramFormat(data) {
        let paramArr = [];
        let paramStr = '';
        for (let attr in data) {
            paramArr.push(attr + '=' + data[attr]);
        }
        paramStr = paramArr.join('&');
        return paramStr ? '?' + paramStr : paramStr;
    },
	/**
	 * 对象转化为数组
	 *
	 * @param {any} obj
	 * @returns
	 */
    objectToArray(obj) {
        let arr = [];
        for (let key in obj) {
            //key是属性,object[key]是值
            arr.push(key); //往数组中放属性
        }
    },
    /**
	 * 获取对象的值
	 *
	 * @param {any} obj
	 * @returns
	 */
    objectV(obj) {
        let arr = [];
        for (let key in obj) {
            arr.push(obj[key]);
        }
        return arr;
    },
    /**
	 * 字典数据格式转换
	 *
	 * @param {any} obj
	 * @returns
	 */
    sysDictFormat(obj) {
        if (!obj) return;
        let options = [];
        obj.map((item, index) => {
            let option = {
                value: item.ddValue,
                label: item.ddText
            };
            if (item.dictDTOS.length > 0) {
                let childrenOptions = [];
                item.dictDTOS.map((childrenItem, childrenIndex) => {
                    let childrenOption = {
                        value: childrenItem.ddValue,
                        label: childrenItem.ddText
                    };
                    if (childrenItem.dictDTOS.length > 0) {
                        let grandsonOptions = [];
                        childrenItem.dictDTOS.map((grandsonItem, grandsonIndex) => {
                            let grandsonOption = {
                                value: grandsonItem.ddValue,
                                label: grandsonItem.ddText
                            };
                            return grandsonOptions.push(grandsonOption);
                        });
                        childrenOption.children = grandsonOptions;
                    }
                    return childrenOptions.push(childrenOption);
                });
                option.children = childrenOptions;
            }
            return options.push(option);
        });
        return options;
    },
	/**
	 * 字典数据回填
	 *
	 * @param {any} type:字典类型， value：入参
	 * @returns
	 */
    backfillData(type, value) {
        if (!type || !value) return;
        let szOptions = [];
        for (let i = 0; i < type.length; i++) {
            let ddValue = type[i].ddValue;
            if (ddValue == value) {
                szOptions = ddValue + ',';
                return szOptions.split(',');
            } else {
                let dictDTOS = type[i].dictDTOS;
                for (let j = 0; j < dictDTOS.length; j++) {
                    let dValue = dictDTOS[j].ddValue;
                    if (dValue == value) {
                        szOptions = '' + ddValue + ',' + dValue;
                        return szOptions.split(',');
                    }
                }
            }
        }
    },
    /**
     * 获取A4大小
     * @param {this} this
     * @returns
     */
    calculateSize(that) {
        let div = document.createElement("div");
        div.style.width = "1in";
        div.style.height = "1in";
        let body = document.getElementsByTagName("body")[0];
        body.appendChild(div);
        // let devicePixelRatio = window.devicePixelRatio || 1;
        let devicePixelRatio = 1;
        let dpi_x = div.offsetWidth * devicePixelRatio;
        // let dpi_y = div.offsetHeight * devicePixelRatio;
        body.removeChild(div);
        that.setState({
            width: 210 / 25.4 * dpi_x,
            // height: 300
        })
    },
    /**
	 * 添加新的js文件
     *
	 * @param {url} js链接
	 * @returns
	 */
    appendScript(url) {
        const oScript = document.createElement('script');
        oScript.src = url;
        oScript.type = 'text/javascript';
        document.head.appendChild(oScript);
        return oScript;
    },
    /**
     * 获取字符串实际长度(包含汉字)
     */
    getLength(str) {
        return str.replace(/[\u0391-\uFFE5]/g, 'aa').length;
    },
    /**
     * 数组判断是否包含某元素
     */
    isContain(arr, ele) {
        for (let i in arr) {
            if (arr[i] === ele) return true;
        }
        return false;
    },
    /**
     * 重复某个字符串n次
     */
    repeatStr(str, n) {
        return new Array(n + 1).join(str);
    },
    /**
     * 查找数组元素位置
     */
    indexofArr(arr, item) {
        if (arr.indexOf) {
            return arr.indexOf(item);
        } else {
            let index = -1;
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] === item) index = i;
            }
            return index;
        }
    },
    confusionStr(str, frontLen, endLen) {
        const len = str.length - frontLen - endLen
        let xing = ''
        for (let i = 0; i < len; i++) {
            xing += '*'
        }
        return str.substring(0, frontLen) + xing + str.substring(str.length - endLen)
    },
    /**
     * 给字段添加单位
     */
    addUnit(field, unit, handle) {
        if (handle && this[handle]) return field == '未录入' || field == null ? '未录入' : `${this[handle](field)}${unit}`
        return field == '未录入' || field == null ? '未录入' : `${field}${unit}`
    },
    /**
     * 展示字段处理
     * @param obj 字段所在对象
     * @param field 字段位置，String
     * @param unit 单位
     * @param handle 特殊处理
     */
    field(obj, field, unit, handle) {
        return this.addUnit(get(obj, field, '未录入'), unit, handle)
    },
    /**
     * 埋点设置
     */
    countPlus(data, type) {
        if (type === 'register') {
            for (let key in data) {
                if (data[key] === undefined || data[key] === null || data[key] === '') {
                    data[key] = '-1'
                }
                data[key] = data[key].toString()
            }
            window.dplus.register(data)
        }
        if (type === 'save') {
            for (let key in data) {
                if (data[key] === undefined || data[key] === null || data[key] === '') {
                    data[key] = '-1'
                }
                data[key] = data[key].toString()
            }
            Config.localItem('COUNT_PLUS', JSON.stringify(data))
        }
        if (type === 'send') {
            let sendData = Object.assign({
                'prodName': '-1',
                // 'prodCode': '-1',
                'prodType': '-1',
                // 'managerCode': '-1'
            }, JSON.parse(Config.localItem('COUNT_PLUS')))
            let registerData = Object.assign({
                'userName': window.dplus.get_property('userName') || '-1',
                'env': window.dplus.get_property('env') || '-1',
                'enterCode': window.dplus.get_property('enterCode') || '-1'
            })
            window.dplus.unregister(['userName', 'env', 'enterCode', 'prodName', 'prodCode', 'prodType', 'managerCode'])
            window.dplus.register(registerData)
            window.dplus.track(data, sendData, () => (console.log(data + 'success')))
        }
    },
    // 获取不同环境
    getReferer() {
        const currentUrl = window.location.href
        if (currentUrl.indexOf('mp-test.zhudb.com') > -1) {
            return 'pre' // 预生产
        }
        if (currentUrl.indexOf('mp.zhudb.com') > -1) {
            return 'prod' // 生产
        }
        return 'test' // 测试
    },
    // 是否是客户经理
    isRoleCustomer(role) {
        return role == 'ROLE_CUSTOMER_MANAGER';
    },
    // 是否是贷审员
    isRoleCr(role) {
        // 由于贷审员和审查员权限一样 故将两者放在一起
        const roles = ['ROLE_CR_MANAGER', 'ROLE_EXAMINANT', 'ROLE_CR_MANAGER&ROLE_EXAMINANT', 'ROLE_EXAMINANT&ROLE_CR_MANAGER']
        return roles.indexOf(role) > -1
    },
    // 两个数组取差集，用作角色判断
    intersectLen() {
        let roles = Config.localItem('CUR_ROLE');
        // 超级管理员、管理员、一级主管、二级主管、风控主管、客户经理、贷审员
        let allRoles = ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_TOP_MANAGER', 'ROLE_MID_MANAGER', 'ROLE_RISK_MANAGER', 'ROLE_CUSTOMER_MANAGER', 'ROLE_CR_MANAGER'];
        if (typeof roles == 'string' && roles.constructor == String) roles = [roles];
        return allRoles.filter(function (role) { return roles.indexOf(role) > -1; });
    },
    // 是否是管理员(单角色)
    isRoleAdmin() {
        return this.intersectLen()[0] == 'ROLE_ADMIN';
    },
    // 是且仅是风控主管
    isOnlyRoleRiskManager() {
        return this.intersectLen().length == 1 && this.intersectLen()[0] == 'ROLE_RISK_MANAGER';
    },
    // 判断两个对象是否相等
    getNotEqualProps(o1, o2) {
        let props = [];
        for (var o in arguments[0]) {
            if (arguments[0][o] != arguments[1][o]) props.push(o);
        }
        return props;
    },
    /**
    * @description 判断变量是不是引用类型
    * @param {*} variable - 待判定的变量。接受任意类型
    * @returns {Boolean} 如果返回true则表示是引用类型，反之则不是
    */
    variableIsReference(variable) {
        return (
            variable !== null &&
            variable !== undefined &&
            typeof variable !== "string" &&
            typeof variable !== "number" &&
            typeof variable !== "boolean" &&
            typeof variable !== "symbol"
        );
    },

    /**
     * @description 两个对象字面量比较  注意，如果obj1 = {a:"123",b:456}, ob2 = {b:456,a:"123"};本方法也会判定他们完全相等
     * @param {Object} o1 - 必填。要比较的对象
     * @param {Object} o2 - 必填。被比较的对象
     * @param {Array<String>} keys - 选填。仅检查指定的keys
     * @returns {Object} 返回的结果 包含两个属性
     *          {Boolean} isAllSame 表明是否完全相同
     *          {Object} diffObj 被检查出来不相同的项
     */
    diff(o1, o2, keys = null, __isRecursion__ = false) {
        let that = this;
        let isAllSame = true,
            diffObj = {};
        let list = Object.entries(o1);
        let list2 = Object.entries(o2);
        if (Array.isArray(keys) && keys.length > 0) {
            list = list.filter(([k, v]) => keys.includes(k));
            list2 = list2.filter(([k, v]) => keys.includes(k));
        }
        if (__isRecursion__ && list.length !== list2.length) {
            isAllSame = false;
            //递归模式下，上一级只读取isAllSame
            //参见下面的那句 const { isAllSame: _isAllSame } = diff(v1, v2);
            return {
                isAllSame,
            };
        }
        // 递归模式下，有一项不同则终止循环，所以有every
        if (__isRecursion__) {
            list.every(__fetchDiff__);
        } else {
            list.forEach(__fetchDiff__);
        }

        function __fetchDiff__([key, v1]) {
            const v2 = o2[key];
            let isSame = v1 == v2;
            //区分其是基本类型还是引用类型,如果是引用类型还需要进一步判断（递归本方法）
            // v2也要校验，否则v1为引用类型 v2为基本类型则无需diff就可判定isSame一定为false
            const isReference = that.variableIsReference(v1) && that.variableIsReference(v2);
            if (isReference) {
                // 递归的时候要传入第四参数表明是递归
                const { isAllSame: _isAllSame } = that.diff(v1, v2, null, true);
                isSame = _isAllSame;
            }

            if (!isSame) {
                isAllSame = false;
                diffObj[key] = v1;
            }
            return v1 == v2;
        }
        return {
            isAllSame,
            diffObj,
        };
    },

    /**
     * 防止POST重复请求
     * @param type 类型 url 存储地址
     * @return
     */
    repeatReq(type, url) {
        let tmpReq
        if (type === 'save') {
            tmpReq = sessionStorage.getItem(Config.constants.repeatReq);
            tmpReq = tmpReq ? tmpReq.split(',') : [];
            if (tmpReq.includes(url)) return true
            tmpReq.push(url);
            sessionStorage.setItem(Config.constants.repeatReq, tmpReq);
        }
        if (type === 'clear') {
            tmpReq = sessionStorage.getItem(Config.constants.repeatReq);
            tmpReq = tmpReq ? tmpReq.split(',') : [];
            tmpReq = tmpReq.filter(i => url !== i);
            // setTimeout (() => sessionStorage.setItem(Config.constants.repeatReq, tmpReq), 3000)
            sessionStorage.setItem(Config.constants.repeatReq, tmpReq)
        }
    },
    /**
     * 去左右空格
     * @param 字符串
     * @return
     */
    trimSides(s) {
        return (s && s.replace(/(^\s*)|(\s*$)/g, '')) || '';
    }
};

const target = Config.target;

/**
 * 本地数据存储或读取
 *
 * @param {any} key
 * @param {any} value
 * @returns
 */
Config.localItem = function (key, value) {
    if (arguments.length == 1) {
        return localStorage.getItem(key) && localStorage.getItem(key) !== 'null' ? localStorage.getItem(key) : null;
    } else {
        return localStorage.setItem(key, value);
    }
}

/**
 * 删除本地数据
 *
 * @param {any} k
 * @returns
 */
Config.removeLocalItem = function (key) {
    if (arguments.length == 1) {
        return localStorage.removeItem(key);
    } else {
        let defaultUsername = this.localItem('REMEMBER_USERNAME');
        let captchaExpire = this.localItem('CAPTCHA_EXPIRE');
        localStorage.clear();
        this.localItem('CAPTCHA_EXPIRE', captchaExpire)
        return this.localItem('REMEMBER_USERNAME', defaultUsername);
    }
}

/**
 * 发送ajax请求和服务器交互
 * @param {object} mySetting 配置ajax的配置
 */
Config.ajax = function (mySetting) {
    var setting = {
        url: window.location.pathname, //默认ajax请求地址
        async: true, //true。默认设置下，所有请求均为异步请求。如果需要发送同步请求，请将此选项设置为 false
        type: 'GET', //请求的方式
        data: {}, //发给服务器的数据
        dataType: 'json',
        success: function (text) { }, //请求成功执行方法
        error: function () { } //请求失败执行方法
    };

    var aData = []; //存储数据
    var sData = ''; //拼接数据
    //属性覆盖
    for (let attr in mySetting) {
        setting[attr] = mySetting[attr];
    }
    for (let attr in setting.data) {
        aData.push(attr + '=' + filter(setting.data[attr]));
    }
    sData = aData.join('&');
    setting.type = setting.type.toUpperCase();
    var xhr = new XMLHttpRequest();
    try {
        if (setting.type == 'POST' || setting.type == 'PUT') {
            // 此处对连续请求有限制，影响暂不可知，可通过在方法中增加url取消限制
            let result = Config.repeatReq('save', setting.url);
            if (result) return result;
            var reqTimer = setTimeout(() => {
                Config.repeatReq('clear', setting.url)
            }, 3000);
        }

        if (setting.type == 'GET' || setting.type == 'DELETE') { //get方式请求
            sData = setting.url + '?' + sData;
            xhr.open(setting.type, sData + '&' + new Date().getTime(), setting.async);
            xhr.setRequestHeader("Authorization", Config.localItem('USER_AUTHORIZATION'));
            xhr.setRequestHeader("EnterpriseCode", Config.localItem('ENTERP_CODE'));
            xhr.send();
        } else { //post方式请求
            xhr.open(setting.type, setting.url, setting.async);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.setRequestHeader("Authorization", Config.localItem('USER_AUTHORIZATION'));
            xhr.setRequestHeader("EnterpriseCode", Config.localItem('ENTERP_CODE'));
            xhr.send(sData);
        }

    } catch (e) {
        return httpEnd(setting.type, setting.url, reqTimer);
    }

    if (setting.async) {
        xhr.addEventListener('readystatechange', () => httpEnd(setting.type, setting.url, reqTimer), false);
    } else {
        httpEnd(setting.type, setting.url, reqTimer);
    }

    function httpEnd(setType, setUrl, reqTimer) {
        if (xhr.readyState == 4) {
            if (setType == 'POST' || setType == 'PUT') {
                Config.repeatReq('clear', setUrl)
                clearTimeout(reqTimer)
            }
            var head = xhr.getAllResponseHeaders();
            var response = xhr.responseText;
            //将服务器返回的数据，转换成json

            if (/application\/json/.test(head) || setting.dataType === 'json' && /^(\{|\[)([\s\S])*?(\]|\})$/.test(response)) {
                response = JSON.parse(response);
            }
            if (xhr.status == 200) { // 请求成功
                if (response.code == Config.errorCode.tokenExpire || response.code == Config.errorCode.authorityWithout || response.code == Config.errorCode.userKickout) { // 权限不足或Token到期
                    // 登录超时
                    browserHistory.push('/error/timeout');
                    return;
                }
                var Authorization = xhr.getResponseHeader("Authorization");
                if (Authorization) Config.localItem('USER_AUTHORIZATION', Authorization); // 重新覆盖新Token
                setting.success(response, setting, xhr);
            } else { // 请求失败
                if (setType == 'POST' || setType == 'PUT') {
                    Config.repeatReq('clear', setUrl)
                    clearTimeout(reqTimer)
                }
                // if(!xhr.withCredentials) {
                //     // 重新登录
                //     Config.removeLocalItem();
                //     window.location.href = '/login';
                // } else {
                //     setting.error(setting, xhr);
                // }
            }
        }
    }
    xhr.end = function () {
        xhr.removeEventListener('readystatechange', httpEnd, false);
    }

    function filter(str) { //特殊字符转义
        str += ''; //隐式转换
        str = str.replace(/%/g, '%25');
        str = str.replace(/\+/g, '%2B');
        str = str.replace(/ /g, '%20');
        str = str.replace(/\//g, '%2F');
        str = str.replace(/\?/g, '%3F');
        str = str.replace(/&/g, '%26');
        str = str.replace(/=/g, '%3D');
        str = str.replace(/#/g, '%23');
        return str;
    }
    return xhr;
};

/**
 * 封装ajax put请求
 * @param {string} pathname 服务器请求地址
 * @param {object} data     发送给服务器的数据
 * @param {function} success  请求成功执行方法
 * @param {function} error    请求失败执行方法
 */
Config.put = function (pathname, data, success, error) {
    var setting = {
        url: target + pathname, //默认ajax请求地址
        type: 'PUT', //请求的方式
        data: data, //发给服务器的数据
        success: success || function () { }, //请求成功执行方法
        error: error || function () { } //请求失败执行方法
    };
    return Config.ajax(setting);
};

/**
 * 封装ajax delete请求
 * @param {string} pathname 服务器请求地址
 * @param {object} data     发送给服务器的数据
 * @param {function} success  请求成功执行方法
 * @param {function} error    请求失败执行方法
 */
Config.delete = function (pathname, data, success, error) {
    var setting = {
        url: target + pathname, //默认ajax请求地址
        type: 'DELETE', //请求的方式
        data: data, //发给服务器的数据
        success: success || function () { }, //请求成功执行方法
        error: error || function () { } //请求失败执行方法
    };
    return Config.ajax(setting);
};

/**
 * 封装ajax post请求
 * @param {string} pathname 服务器请求地址
 * @param {object} data     发送给服务器的数据
 * @param {function} success  请求成功执行方法
 * @param {function} error    请求失败执行方法
 */
Config.post = function (pathname, data, success, error) {
    var setting = {
        url: target + pathname, //默认ajax请求地址
        type: 'POST', //请求的方式
        data: data, //发给服务器的数据
        success: success || function () { }, //请求成功执行方法
        error: error || function () { } //请求失败执行方法
    };
    return Config.ajax(setting);
};

/**
 * 封装ajax get请求
 * @param {string} pathname 服务器请求地址
 * @param {object} data     发送给服务器的数据
 * @param {function} success  请求成功执行方法
 * @param {function} error    请求失败执行方法
 */

Config.get = function (pathname, data, success, error) {
    var setting = {
        url: target + pathname, //默认ajax请求地址
        type: 'GET', //请求的方式
        data: data, //发给服务器的数据
        success: success || function () { }, //请求成功执行方法
        error: error || function () { } //请求失败执行方法
    };
    return Config.ajax(setting);
};

export { Config };
