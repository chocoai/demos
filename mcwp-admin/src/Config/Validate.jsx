const Validate = {
    warnInfo: {
        nullPeriod: '请选择还款期数',
        nullKind: '请选择还款方式',
        moreDrawTimes: '0-100之间',
        wordLen8: '最多输入8个字',
        wordLen10: '最多输入10个字',
        wordLen15: '最多输入15个字',
        wordLen20: '最多输入20个字',
        wordLen25: '最多输入25个字',
        wordLen30: '最多输入30个字',
        wordLen64:'最多输入64个字',
        wordLen100:'最多输入100个字',
        wordLen300:'最多输入300个字',
        wordLen500:'最多输入500个字',
        wordLen256: '最多可输入256个字',
        wordLen2to15:'2-15个字',
        wordLen2to20:'2-20个字',
        wordLen2to60:'2-60个字',
        numRange10: '1到10正整数',
        numRange20: '1到20正整数',
        numRange100: '1到100正整数',
        numRange60: '1到60正整数',
        numRange300: '1到300正整数',
        numRange365: '1到365正整数',
        numRange600: '1到600正整数',
        numRange200: '1到200正整数',
        numRange1000: '1到1000正整数',
        numRange100000: '1到100000正整数',
        numRange10000: '1到10000正整数',
        selectNotNull:'请选择',
        numType: '请输入正整数',
        prizeAmountWrong: '0.01到9999.99之间',
        numTypeInteger: '请输入非负整数',
        numTypeInteger100: '请输入0至100之间的整数',
        numLen6: '最多输入6位数字',
        numLen7: '请输入7位数字',
        numLen10: '请输入10位数字',
        numLen15: '请输入15位数字',
        numberLen10: '最多输入10个数字',
        numberLen15: '最多输入15个数字',
        numDecimal: '数字且小数点后最多两位',
        numDecimalOne: '数字且小数点后最多一位',
        numberLenTtwo: '只能在3位整数和2位小数之内',
        numberLenFtwo: '只能在4位整数和2位小数之内',
        numberLenStwo: '只能在7位整数和2位小数之内',
        numberLenEtwo: '只能在8位整数和2位小数之内',
        numberLenEtwo01: '只能在8位整数和2位小数之内并大于0.01',
        NumDecimal60:'0.1到60.0',
        NumDecimal1000:'0.1到1000.0',
        numDecimal100: '0.00到99.99',
        numDecimalFull100: '0.00到100.00',
        numDecimalFull1000000: '0.00到1000000.00',
        numDecimalFull100000000: '0.00到100000000.00',
        numDecimalFull99999999: '0.00到99999999.99',
        numDecimal10000: '0.00到9999.99',
        numDecimalTwo: '7位数字且小数点后最多二位',
        numDecimalThree: '数字且小数点后最多三位',
        idCard: '请输入正确的身份证号',
        phoneNum: '请输入正确的手机号',
        numDecimalPercent: ' 请输入数字范围0.00-0.99',
        wordLen15AndNotNull: '请输入1-15个字',
        activeTime: '请选择活动时间',
        prizeType: '请选择奖品类型',
        prizeTime: '请选择兑奖时间',
        prizeChanceCount: '总中奖概率0.00到100.00',
        prizeChanceCounts: '单个奖品中奖概率0.00到100.00',
        custmerServicePhone: '请输入客户电话',
        custmerPhone: '请输入正确的客户电话',
        monthIncome: '月收入请在1000-200000范围内输入',
        monthDebt: '当前月还贷金额请在0-500000范围内输入',
        creditcardSumamt: '信用卡汇总额度请在0-10000000范围内输入'
    },
    checkNothing(rule, value, callback){
        callback();
    },
    checkNotNull(rule, value, callback){
        if ( value ) {
            callback();
            return;
        }
        callback({});
    },
    checkWordLen8(rule, value, callback){
        if ( !value ) {
            callback();
            return;
        }
        if ( value.length < 9) {
            callback();
            return;
        }
        callback({});
    },
    checkWordLen10(rule, value, callback){
        if ( !value ) {
            callback();
            return;
        }
        if ( value.length < 11) {
            callback();
            return;
        }
        callback({});
    },
    checkWordLen15(rule, value, callback){
        if ( !value ) {
            callback();
            return;
        }
        if ( value.length < 16) {
            callback();
            return;
        }
        callback({});
    },
    checkWordLen15AndNotNull(rule, value, callback){
        if ( value && value.length > 0 && value.length < 16) {
            callback();
            return;
        }
        callback({});
    },
    checkWordLen20(rule, value, callback){
        if ( !value ) {
            callback();
            return;
        }
        if ( value.length < 21) {
            callback();
            return;
        }
        callback({});
    },
    checkWordLen25(rule, value, callback){
        if ( !value ) {
            callback();
            return;
        }
        if ( value.length < 26) {
            callback();
            return;
        }
        callback({});
    },
    checkWordLen30(rule, value, callback){
        if ( !value ) {
            callback();
            return;
        }
        if ( value.length < 31) {
            callback();
            return;
        }
        callback({});
    },
    checkWordLen64(rule, value, callback){
        if ( !value ) {
            callback();
            return;
        }
        if ( value.length < 65) {
            callback();
            return;
        }
        callback({});
    },
    checkWordLen100(rule, value, callback){
        if ( !value ) {
            callback();
            return;
        }
        if ( value.length < 101) {
            callback();
            return;
        }
        callback({});
    },
    checkWordLen256(rule, value, callback){
        if ( !value ) {
            callback();
            return;
        }
        if ( value.length < 257) {
            callback();
            return;
        }
        callback({});
    },
    checkWordLen300(rule, value, callback){
        if ( !value ) {
            callback();
            return;
        }
        if ( value.length < 301) {
            callback();
            return;
        }
        callback({});
    },
    checkWordLen500(rule, value, callback){
        if ( !value ) {
            callback();
            return;
        }
        if ( value.length < 501) {
            callback();
            return;
        }
        callback({});
    },
    // 2-15个汉字
    checkWordLen2to15(rule, value, callback){
        if ( !value ) {
            callback();
            return;
        }
        if ( value.length < 16&&value.length >1) {
            callback();
            return;
        }
        callback({});
    },
    // 2-20个汉字
    checkWordLen2to20(rule, value, callback){
        if ( !value ) {
            callback();
            return;
        }
        if ( value.length < 21&&value.length >1) {
            callback();
            return;
        }
        callback({});
    },
     // 2-60个汉字
     checkWordLen2to60(rule, value, callback){
        if ( !value ) {
            callback();
            return;
        }
        if ( value.length < 61&&value.length >1) {
            callback();
            return;
        }
        callback({});
    },
    checkNumRange10(rule, value, callback) {
        if ( !value ) {
            callback();
            return;
        }
        //验证正整数
        if( parseInt(value) != value ) {
            callback({});
            return;
        }
        if ( value <= 10 && value >= 1 ) {
            callback();
            return;
        }
        callback({});
    },
    checkNumRange20(rule, value, callback) {
        if ( !value ) {
            callback();
            return;
        }
        //验证正整数
        if( parseInt(value) != value ) {
            callback({});
            return;
        }
        if ( value <= 20 && value >= 1 ) {
            callback();
            return;
        }
        callback({});
    },
    checkNumRange60(rule, value, callback) {
        if ( !value ) {
            callback();
            return;
        }
        //验证正整数
        if( parseInt(value) != value ) {
            callback({});
            return;
        }
        if ( value <= 60 && value >= 1 ) {
            callback();
            return;
        }
        callback({});
    },
    checkNumRange100(rule, value, callback) {
        if ( !value ) {
            callback();
            return;
        }
        //验证正整数
        if( parseInt(value) != value ) {
            callback({});
            return;
        }
        if ( value <= 100 && value >= 1 ) {
            callback();
            return;
        }
        callback({});
    },
    checkNumRange200(rule, value, callback) {
        if ( !value ) {
            callback();
            return;
        }
        //验证正整数
        if( parseInt(value) != value ) {
            callback({});
            return;
        }
        if ( value <= 200 && value >= 1 ) {
            callback();
            return;
        }
        callback({});
    },
    checkNumRange300(rule, value, callback) {
        if ( !value ) {
            callback();
            return;
        }
        //验证正整数
        if( parseInt(value) != value ) {
            callback({});
            return;
        }
        if ( value <= 300 && value >= 1 ) {
            callback();
            return;
        }
        callback({});
    },
    checkNumRange365(rule, value, callback) {
        if ( !value ) {
            callback();
            return;
        }
        //验证正整数
        if( parseInt(value) != value ) {
            callback({});
            return;
        }
        if ( value <= 365 && value >= 1 ) {
            callback();
            return;
        }
        callback({});
    },
    checkNumRange600(rule, value, callback) {
        if ( !value ) {
            callback();
            return;
        }
        //验证正整数
        if( parseInt(value) != value ) {
            callback({});
            return;
        }
        if ( value <= 600 && value >= 1 ) {
            callback();
            return;
        }
        callback({});
    },
    checkNumRange1000(rule, value, callback) {
        if ( !value ) {
            callback();
            return;
        }
        //验证正整数
        if( parseInt(value) != value ) {
            callback({});
            return;
        }
        if ( value <= 1000 && value >= 1 ) {
            callback();
            return;
        }
        callback({});
    },
    checkNumRange100000(rule, value, callback) {
        if ( !value ) {
            callback();
            return;
        }
        //验证正整数
        if( parseInt(value) != value ) {
            callback({});
            return;
        }
        if ( value <= 100000 && value >= 1 ) {
            callback();
            return;
        }
        callback({});
    },
    checkNumRange10000(rule, value, callback) {
        if ( !value ) {
            callback();
            return;
        }
        //验证正整数
        if( parseInt(value) != value ) {
            callback({});
            return;
        }
        if ( value <= 10000 && value >= 1 ) {
            callback();
            return;
        }
        callback({});
    },
    checkNumType (rule, value, callback) {
        if ( !value ) {
            callback();
            return;
        }
        //验证正整数
        if( parseInt(value) != value ) {
            callback({});
            return;
        }
        if ( value >= 1 ) {
            callback();
            return;
        }
        callback({});
    },
    checkNumTypeNum1 (rule, value, callback) {
        if ( !value ) {
            callback();
            return;
        }
        //验证正整数
        if( parseInt(value) != value ) {
            callback({});
            return;
        }
        if( String(value).indexOf(".")!=-1) {
            callback({});
            return;
        }
        if ( value >0 ) {
            callback();
            return;
        }
        callback({});
    },
    checkNumTypeNotNull (rule, value, callback) {
        if ( !value ) {
            callback({});
            return;
        }
        //验证正整数
        if( parseInt(value) != value ) {
            callback({});
            return;
        }
        if ( value >= 1 ) {
            callback();
            return;
        }
        callback({});
    },
    checkNumIntegerNotNull (rule, value, callback) {
        if ( !value ) {
            callback({});
            return;
        }
        //验证非负整数
        if( parseInt(value) != value ) {
            callback({});
            return;
        }
        if ( value >= 0 ) {
            callback();
            return;
        }
        callback({});
    },
    checkNumIntegerNotNull100 (rule, value, callback) {
        if ( !value ) {
            callback({});
            return;
        }
        //验证100之内的非负整数
        if( parseInt(value) != value ) {
            callback({});
            return;
        }
        if ( value >= 0 && value <= 100) {
            callback();
            return;
        }
        callback({});
    },
    checkNumLen7 (rule, value, callback) {
        if ( !value ) {
            callback();
            return;
        }
        if( /^(\d{7})$/.test(value)){
            callback();
            return;
        }
        callback({});
        return;
    },
    checkNumLen15 (rule, value, callback) {
        if ( !value ) {
            callback();
            return;
        }
        if( /^(\d{15})$/.test(value)){
            callback();
            return;
        }
        callback({});
        return;
    },
    checkNumberLen6 (rule, value, callback) {
        if ( !value ) {
            callback();
            return;
        }
        if( /^(\d{1,6})$/.test(value)){
            callback();
            return;
        }
        callback({});
        return;
    },
    checkNumbersLen7 (rule, value, callback) {
        if ( !value ) {
            callback();
            return;
        }
        if( /^\d{1,7}(\.\d{1,2})?$/.test(value)){
            callback();
            return;
        }
        callback({});
        return;
    },
    checkNumbers1E (rule, value, callback) {//0.00到100000000.00
        if ( !value ) {
            callback();
            return;
        }
        // if( /^(\d+)(\.?)(\d{0,2})$/.test(value)){
        //     console.log(value);
        //     callback();
        //     return;
        // }
        if ( value >= 0 && value <= 100000000.00 && /^(\d+)(\.?)(\d{0,2})$/.test(value) ){
            callback();
            return;
        }
        callback({});
        return;
    },
    checkNumbersLen9 (rule, value, callback) {//0.00到1000000.00
        if ( !value ) {
            callback();
            return;
        }
        if ( value >= 0 && value <= 1000000.00 && /^(\d+)(\.?)(\d{0,2})$/.test(value) ){
            callback();
            return;
        }
        callback({});
        return;
    },
    checkNumbersLen8 (rule, value, callback) {//0.00到99999999
        if ( !value ) {
            callback();
            return;
        }
        if ( value >= 0 && value < 100000000.00 && /^(\d+)(\.?)(\d{0,2})$/.test(value) ){
            callback();
            return;
        }
        callback({});
        return;
    },
    checkNumberLen10 (rule, value, callback) {
        if ( !value ) {
            callback();
            return;
        }
        if( /^(\d{1,10})$/.test(value)){
            callback();
            return;
        }
        callback({});
        return;
    },
    checkNumberLen15 (rule, value, callback) {
        if ( !value ) {
            callback();
            return;
        }
        if( /^(\d{1,15})$/.test(value)){
            callback();
            return;
        }
        callback({});
        return;
    },
    checkNumDecimalOne(rule, value, callback) {
        if ( !value ) {
            callback();
            return;
        }
        if (parseFloat(value) != value) {
            callback({});
            return;
        }
        if( /^(\d+)(\.?)(\d{0,1})$/.test(value)){
            callback();
            return;
        }
        callback({});
        return;
    },
    checkNumDecimal(rule, value, callback) {
        if ( !value ) {
            callback();
            return;
        }
        if (parseFloat(value) != value) {
            callback({});
            return;
        }
        if( /^(\d+)(\.?)(\d{0,2})$/.test(value)){
            callback();
            return;
        }
        callback({});
        return;
    },
    //数字且小数点后最多两位(可为负数)
    checkNumDecimalMinus(rule, value, callback) {
        if ( !value ) {
            callback();
            return;
        }
        if (parseFloat(value) != value) {
            callback({});
            return;
        }
        if( /^(-?)(\d+)(\.?)(\d{0,2})$/.test(value)){
            callback();
            return;
        }
        callback({});
        return;
    },
    checkNumDecimalInteger100(rule, value, callback) {
        if ( !value ) {
            callback();
            return;
        }
        if (parseFloat(value) != value) {
            callback({});
            return;
        }
        if ( value >= 100 || value < 0 ) {
            callback({});
            return;
        }
        if( /^(\d+)$/.test(value)){
            callback();
            return;
        }
        callback({});
        return;
    },
    checkNumDecimal100(rule, value, callback) {
        if ( !value ) {
            callback();
            return;
        }
        if (parseFloat(value) != value) {
            callback({});
            return;
        }
        if ( value >= 100 || value < 0 ) {
            callback({});
            return;
        }
        if( /^(\d+)(\.?)(\d{0,2})$/.test(value)){
            callback();
            return;
        }
        callback({});
        return;
    },
    checkNumDecimalFull100(rule, value, callback) {
        if ( !value ) {
            callback();
            return;
        }
        if (parseFloat(value) != value) {
            callback({});
            return;
        }
        if ( value > 100 || value < 0 ) {
            callback({});
            return;
        }
        if( /^(\d+)(\.?)(\d{0,2})$/.test(value)){
            callback();
            return;
        }
        callback({});
        return;
    },
    checkNumDecimal60(rule, value, callback) {
        if ( !value ) {
            callback();
            return;
        }
        if (parseFloat(value) != value) {
            callback({});
            return;
        }
        if ( value > 60 || value < 0.1 ) {
            callback({});
            return;
        }
        if( /^(\d+)(\.?)(\d{0,1})$/.test(value)){
            callback();
            return;
        }
        callback({});
        return;
    },
    checkNumDecimal1000(rule, value, callback) {
        if ( !value ) {
            callback();
            return;
        }
        if (parseFloat(value) != value) {
            callback({});
            return;
        }
        if ( value > 1000 || value < 0.1 ) {
            callback({});
            return;
        }
        if( /^(\d+)(\.?)(\d{0,1})$/.test(value)){
            callback();
            return;
        }
        callback({});
        return;
    },
    checkNumRangeOne(rule, value, callback) {
        if ( !value ) {
            callback();
            return;
        }
        if (parseFloat(value) != value) {
            callback({});
            return;
        }
        if ( value > 100 || value < 0.1 ) {
            callback({});
            return;
        }
        if( /^(\d+)(\.?)(\d{0,2})$/.test(value)){
            callback();
            return;
        }
        callback({});
        return;
    },
    checkNumDecimal10000(rule, value, callback) {
        if ( !value ) {
            callback();
            return;
        }
        if (parseFloat(value) != value) {
            callback({});
            return;
        }
        if ( value >= 10000 || value < 0 ) {
            callback({});
            return;
        }
        if( /^(\d+)(\.?)(\d{0,2})$/.test(value)){
            callback();
            return;
        }
        callback({});
        return;
    },
    checkNumLenFtwo(rule, value, callback) {
        if ( !value ) {
            callback();
            return;
        }
        if (parseFloat(value) != value) {
            callback({});
            return;
        }
        if( /^(\d{1,4})$/.test(value) || /^(\d{1,4})\.(\d{0,2})$/.test(value)){
            callback();
            return;
        }
        callback({});
        return;
    },
    checkNumLenTtwo(rule, value, callback) {
        if ( !value ) {
            callback();
            return;
        }
        if (parseFloat(value) != value) {
            callback({});
            return;
        }
        if( /^(\d{1,3})$/.test(value) || /^(\d{1,3})\.(\d{0,2})$/.test(value)){
            callback();
            return;
        }
        callback({});
        return;
    },
    checkNumLenStwo(rule, value, callback) {
        if ( !value ) {
            callback();
            return;
        }
        if (parseFloat(value) != value) {
            callback({});
            return;
        }
        if( /^(\d{1,7})$/.test(value) || /^(\d{1,7})\.(\d{0,2})$/.test(value)){
            callback();
            return;
        }
        callback({});
        return;
    },
    checkNumLenEtwo(rule, value, callback) {
        if ( !value ) {
            callback();
            return;
        }
        if (parseFloat(value) != value) {
            callback({});
            return;
        }
        if( /^(\d{1,8})$/.test(value) || /^(\d{1,8})\.(\d{0,2})$/.test(value)){
            callback();
            return;
        }
        callback({});
        return;
    },
    checkNumLenEtwo01(rule, value, callback) {
        if ( !value ) {
            callback();
            return;
        }
        if (parseFloat(value) != value) {
            callback({});
            return;
        }
        if(parseFloat(value)<0.01){
            callback({});
            return;
        }
        if( /^(\d{1,8})$/.test(value) || /^(\d{1,8})\.(\d{0,2})$/.test(value)){
            callback();
            return;
        }
        callback({});
        return;
    },
    checkNumDecimalThree(rule, value, callback) {
        if ( !value ) {
            callback();
            return;
        }
        if (parseFloat(value) != value) {
            callback({});
            return;
        }
        if( /^(\d+)(\.?)(\d{0,3})$/.test(value)){
            callback();
            return;
        }
        callback({});
        return;
    },
	//身份证验证
    checkIdCard(rule, value, callback){
        if ( !value ) {
            callback();
            return;
        }
        // if ( /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(value) ) {
        if(/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(value)){
            callback();
            return;
        }
        callback({});
    },
    checkIdCardAndNotNull (rule, value, callback){
        // if ( !value ) {
        //     callback();
        //     return;
        // }
        // if ( /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(value) ) {
        if(/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(value)){
            callback();
            return;
        }
        callback({});
    },
    checkPhoneNum(rule, value, callback){
        if ( !value ) {
            callback();
            return;
        }
        if(/^1[34578]\d{9}$/i.test(value)){
            callback();
            return;
        }
        callback({});
    },
    checkPhoneNumAndNotNull(rule, value, callback){
        // if ( !value ) {
        //     callback();
        //     return;
        // }
        if(value && /^1[34578]\d{9}$/i.test(value)){
            callback();
            return;
        }
        callback({});
    },
    checkPhoneAndMobile (rule, value, callback) { // 验证手机号 和 电话号
        if ( !value ) {
            callback();
            return;
        }
        if (/(^(\+\d+)?(\d{3,4}-?)?\d{7,8}$)|(^1[3456789]\d{9}$)/.test(value)) {
            callback();
            return;
        }
        callback({});
    },
    checkMonthIncome (rule, value, callback) {
        if ( !value ) {
            callback();
            return;
        }
        if ( value >= 1000 && value < 200000 ){
            callback();
            return;
        }
        callback({});
        return;
    },
    checkMonthDebt (rule, value, callback) {
        if ( !value ) {
            callback();
            return;
        }
        if ( value >= 0 && value < 500000 ){
            callback();
            return;
        }
        callback({});
        return;
    },
    checkcreditcardSumamt (rule, value, callback) {
        if ( !value ) {
            callback();
            return;
        }
        if ( value >= 0 && value < 10000000 ){
            callback();
            return;
        }
        callback({});
        return;
    },
}
export { Validate };
