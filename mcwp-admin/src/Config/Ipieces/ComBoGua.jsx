/**
 * 共同借款人和担保人
 */
export default {
    coBorrowerInfo: {
      name: {
        position: 1,
        name: 'name',
        detailName: 'name',              // 展示字段名（可能和编辑字段不同）
        // fieldChName: "姓名",
        // fieldEnName: "name",
        // formEnName: "loanCoBorrower",
        // isrequire: true,
        // isshow: true,
        message: 'wordLen25',                      // 错误信息Validate.warnInfo
        validator: 'checkWordLen25',                    // 校验
        type: 'multiInput',                         // 表单类型
        width: 6,                         // 大小
        edit: false,                      // 是否能编辑（和配置的可编辑区分）
        unit: '',                          // 单位
        detailWidth: 12,
        h5Width: 12 || 12
      },
      age: {
        position: 2,
        name: 'age',
        detailName: 'age',              // 展示字段名（可能和编辑字段不同）
        // fieldChName: "年龄",
        // fieldEnName: "age",
        // formEnName: "loanCoBorrower",
        // isrequire: true,
        // isshow: true,
        message: 'numRange100',                      // 错误信息Validate.warnInfo
        validator: 'checkNumRange100',                    // 校验
        type: 'multiInput',                         // 表单类型
        width: 6,                         // 大小
        edit: false,                      // 是否能编辑（和配置的可编辑区分）
        unit: '岁',                          // 单位
        detailWidth: 12,
        h5Width: 12 || 12
      },
      sex: {
        position: 3,
        name: 'sex',
        detailName: 'sex',              // 展示字段名（可能和编辑字段不同）
        // fieldChName: "性别",
        // fieldEnName: "sex",
        // formEnName: "loanCoBorrower",
        // isrequire: true,
        // isshow: true,
        message: '',                      // 错误信息Validate.warnInfo
        validator: '',                    // 校验
        type: 'multiInput',                         // 表单类型
        width: 6,                         // 大小
        edit: false,                      // 是否能编辑（和配置的可编辑区分）
        unit: '',                          // 单位
        detailWidth: 12,
        h5Width: 12 || 12
      },
      relationship: {
        position: 4,
        name: 'relationship',
        detailName: 'relationship',              // 展示字段名（可能和编辑字段不同）
        // fieldChName: "与申请人关系",
        // fieldEnName: "relationship",
        // formEnName: "loanCoBorrower",
        // isrequire: true,
        // isshow: true,
        message: '',                      // 错误信息Validate.warnInfo
        validator: '',                    // 校验
        type: 'multiInput',                         // 表单类型
        width: 6,                         // 大小
        edit: false,                      // 是否能编辑（和配置的可编辑区分）
        unit: '',                          // 单位
        detailWidth: 12,
        h5Width: 12 || 12
      },
      idCardNo: {
        position: 5,
        name: 'idCardNo',
        detailName: 'idCardNo',              // 展示字段名（可能和编辑字段不同）
        // fieldChName: "身份证号",
        // fieldEnName: "idCardNo",
        // formEnName: "loanCoBorrower",
        // isrequire: true,
        // isshow: true,
        message: 'idCard',                      // 错误信息Validate.warnInfo
        validator: 'checkIdCard',                    // 校验
        type: 'multiInput',                         // 表单类型
        width: 6,                         // 大小
        edit: false,                      // 是否能编辑（和配置的可编辑区分）
        unit: '',                          // 单位
        detailVerifyRet: 'cIdCardVerifyRet',
        detailVerify: 'cIdCardVerify',
        detailType: 'verify',
        detailWidth: 12,
        h5Width: 12 || 12
      },
      telephone: {
        position: 6,
        name: 'telephone',
        detailName: 'telephone',              // 展示字段名（可能和编辑字段不同）
        // fieldChName: "联系方式",
        // fieldEnName: "telephone",
        // formEnName: "loanCoBorrower",
        // isrequire: true,
        // isshow: true,
        message: 'phoneNum',                      // 错误信息Validate.warnInfo
        validator: 'checkPhoneNum',                    // 校验
        type: 'multiInput',                         // 表单类型
        width: 6,                         // 大小
        edit: false,                      // 是否能编辑（和配置的可编辑区分）
        unit: '',                          // 单位
        detailVerifyRet: 'cTelVerifyRet',
        detailVerify: 'cTelVerify',
        detailType: 'verify',
        detailWidth: 12,
        h5Width: 12 || 12
      },
      familyAddress: {
        position: 7,
        name: 'familyAddress',
        detailName: 'familyAddress',              // 展示字段名（可能和编辑字段不同）
        // fieldChName: "家庭住址",
        // fieldEnName: "familyAddress",
        // formEnName: "loanCoBorrower",
        // isrequire: true,
        // isshow: true,
        message: '',                      // 错误信息Validate.warnInfo
        validator: '',                    // 校验
        type: '',                         // 表单类型
        width: 6,                         // 大小
        edit: false,                      // 是否能编辑（和配置的可编辑区分）
        unit: '',                          // 单位
        detailVerify: '',
        detailType: '',
        detailWidth: 12,
        h5Width: 12 || 12
      },
      mainBusiness: {
        position: 8,
        name: 'mainBusiness',
        detailName: 'mainBusiness',              // 展示字段名（可能和编辑字段不同）
        // fieldChName: "主营业务或职务",
        // fieldEnName: "mainBusiness",
        // formEnName: "loanCoBorrower",
        // isrequire: true,
        // isshow: true,
        message: 'wordLen25',                      // 错误信息Validate.warnInfo
        validator: 'checkWordLen25',                    // 校验
        type: 'multiInput',                         // 表单类型
        width: 6,                         // 大小
        edit: false,                      // 是否能编辑（和配置的可编辑区分）
        unit: '',                          // 单位
        detailWidth: 12,
        h5Width: 12 || 12
      },
      income: {
        position: 9,
        name: 'income',
        detailName: 'income',              // 展示字段名（可能和编辑字段不同）
        // fieldChName: "月收入",
        // fieldEnName: "income",
        // formEnName: "loanCoBorrower",
        // isrequire: true,
        // isshow: true,
        message: 'numType',                      // 错误信息Validate.warnInfo
        validator: 'checkNumType',                    // 校验
        type: 'multiInput',                         // 表单类型
        width: 6,                         // 大小
        edit: false,                      // 是否能编辑（和配置的可编辑区分）
        unit: '',                          // 单位
        detailWidth: 12,
        h5Width: 12 || 12
      },
      orgName: {
        position: 10,
        name: 'orgName',
        detailName: 'orgName',              // 展示字段名（可能和编辑字段不同）
        // fieldChName: "单位名称",
        // fieldEnName: "orgName",
        // formEnName: "loanCoBorrower",
        // isrequire: true,
        // isshow: true,
        message: 'wordLen25',                      // 错误信息Validate.warnInfo
        validator: 'checkWordLen25',                    // 校验
        type: 'multiInput',                         // 表单类型
        width: 6,                         // 大小
        edit: false,                      // 是否能编辑（和配置的可编辑区分）
        unit: '',                          // 单位
        detailWidth: 12,
        h5Width: 12 || 12
      },
      orgAddr: {
        position: 11,
        name: 'orgAddr',
        detailName: 'orgAddr',              // 展示字段名（可能和编辑字段不同）
        // fieldChName: "单位地址",
        // fieldEnName: "orgAddr",
        // formEnName: "loanCoBorrower",
        // isrequire: true,
        // isshow: true,
        message: 'wordLen64',                      // 错误信息Validate.warnInfo
        validator: 'checkWordLen64',                    // 校验
        type: 'multiInput',                         // 表单类型
        width: 6,                         // 大小
        edit: false,                      // 是否能编辑（和配置的可编辑区分）
        unit: '',                          // 单位
        detailWidth: 12,
        h5Width: 12 || 12
      },
      otherMessage: {
        position: 12,
        name: 'otherMessage',
        detailName: 'otherMessage',              // 展示字段名（可能和编辑字段不同）
        // fieldChName: "其他信息",
        // fieldEnName: "otherMessage",
        // formEnName: "loanCoBorrower",
        // isrequire: true,
        // isshow: true,
        message: 'wordLen100',                      // 错误信息Validate.warnInfo
        validator: 'checkWordLen100',                    // 校验
        type: 'multiInput',                         // 表单类型
        width: 6,                         // 大小
        edit: false,                      // 是否能编辑（和配置的可编辑区分）
        unit: '',                          // 单位
        detailWidth: 12,
        h5Width: 12 || 12
      }
    },
    guarantorInfo: {
      name: {
        position: 1,
        name: 'name',
        detailName: 'name',              // 展示字段名（可能和编辑字段不同）
        // fieldChName: "姓名",
        // fieldEnName: "name",
        // formEnName: "loanGuarantee",
        // isrequire: true,
        // isshow: true,
        message: 'wordLen25',                      // 错误信息Validate.warnInfo
        validator: 'checkWordLen25',                    // 校验
        type: 'multiInput',                         // 表单类型
        width: 6,                         // 大小
        edit: false,                      // 是否能编辑（和配置的可编辑区分）
        unit: '',                          // 单位
        detailWidth: 12,
        h5Width: 12 || 12
      },
      age: {
        position: 2,
        name: 'age',
        detailName: 'age',              // 展示字段名（可能和编辑字段不同）
        // fieldChName: "年龄",
        // fieldEnName: "age",
        // formEnName: "loanGuarantee",
        // isrequire: true,
        // isshow: true,
        message: 'numRange100',                      // 错误信息Validate.warnInfo
        validator: 'checkNumRange100',                    // 校验
        type: 'multiInput',                         // 表单类型
        width: 6,                         // 大小
        edit: false,                      // 是否能编辑（和配置的可编辑区分）
        unit: '岁',                          // 单位
        detailWidth: 12,
        h5Width: 12 || 12
      },
      sex: {
        position: 3,
        name: 'sex',
        detailName: 'sex',              // 展示字段名（可能和编辑字段不同）
        // fieldChName: "性别",
        // fieldEnName: "sex",
        // formEnName: "loanGuarantee",
        // isrequire: true,
        // isshow: true,
        message: '',                      // 错误信息Validate.warnInfo
        validator: '',                    // 校验
        type: 'multiInput',                         // 表单类型
        width: 6,                         // 大小
        edit: false,                      // 是否能编辑（和配置的可编辑区分）
        unit: '',                          // 单位
        detailWidth: 12,
        h5Width: 12 || 12
      },
      relationship: {
        position: 4,
        name: 'relationship',
        detailName: 'relationship',              // 展示字段名（可能和编辑字段不同）
        // fieldChName: "与申请人关系",
        // fieldEnName: "relationship",
        // formEnName: "loanGuarantee",
        // isrequire: true,
        // isshow: true,
        message: '',                      // 错误信息Validate.warnInfo
        validator: '',                    // 校验
        type: 'multiInput',                         // 表单类型
        width: 6,                         // 大小
        edit: false,                      // 是否能编辑（和配置的可编辑区分）
        unit: '',                          // 单位
        detailWidth: 12,
        h5Width: 12 || 12
      },
      idCardNo: {
        position: 5,
        name: 'idCardNo',
        detailName: 'idCardNo',              // 展示字段名（可能和编辑字段不同）
        // fieldChName: "身份证号",
        // fieldEnName: "idCardNo",
        // formEnName: "loanGuarantee",
        // isrequire: true,
        // isshow: true,
        message: 'idCard',                      // 错误信息Validate.warnInfo
        validator: 'checkIdCard',                    // 校验
        type: 'multiInput',                         // 表单类型
        width: 6,                         // 大小
        edit: false,                      // 是否能编辑（和配置的可编辑区分）
        unit: '',                          // 单位
        detailVerifyRet: 'gIdCardVerifyRet',
        detailVerify: 'gIdCardVerify',
        detailType: 'verify',
        detailWidth: 12,
        h5Width: 12 || 12
      },
      telephone: {
        position: 6,
        name: 'telephone',
        detailName: 'telephone',              // 展示字段名（可能和编辑字段不同）
        // fieldChName: "联系方式",
        // fieldEnName: "telephone",
        // formEnName: "loanGuarantee",
        // isrequire: true,
        // isshow: true,
        message: 'phoneNum',                      // 错误信息Validate.warnInfo
        validator: 'checkPhoneNum',                    // 校验
        type: 'multiInput',                         // 表单类型
        width: 6,                         // 大小
        edit: false,                      // 是否能编辑（和配置的可编辑区分）
        unit: '',                          // 单位
        detailVerifyRet: 'gTelVerifyRet',
        detailVerify: 'gTelVerify',
        detailType: 'verify',
        detailWidth: 12,
        h5Width: 12 || 12
      },
      familyAddress: {
        position: 7,
        name: 'familyAddress',
        detailName: 'familyAddress',              // 展示字段名（可能和编辑字段不同）
        // fieldChName: "家庭住址",
        // fieldEnName: "familyAddress",
        // formEnName: "loanCoBorrower",
        // isrequire: true,
        // isshow: true,
        message: '',                      // 错误信息Validate.warnInfo
        validator: '',                    // 校验
        type: '',                         // 表单类型
        width: 6,                         // 大小
        edit: false,                      // 是否能编辑（和配置的可编辑区分）
        unit: '',                          // 单位
        detailVerify: '',
        detailType: '',
        detailWidth: 12,
        h5Width: 12 || 12
      },
      mainBusiness: {
        position: 8,
        name: 'mainBusiness',
        detailName: 'mainBusiness',              // 展示字段名（可能和编辑字段不同）
        // fieldChName: "主营业务或职务",
        // fieldEnName: "mainBusiness",
        // formEnName: "loanGuarantee",
        // isrequire: true,
        // isshow: true,
        message: 'wordLen25',                      // 错误信息Validate.warnInfo
        validator: 'checkWordLen25',                    // 校验
        type: 'multiInput',                         // 表单类型
        width: 6,                         // 大小
        edit: false,                      // 是否能编辑（和配置的可编辑区分）
        unit: '',                          // 单位
        detailWidth: 12,
        h5Width: 12 || 12
      },
      income: {
        position: 9,
        name: 'income',
        detailName: 'income',              // 展示字段名（可能和编辑字段不同）
        // fieldChName: "月收入",
        // fieldEnName: "income",
        // formEnName: "loanGuarantee",
        // isrequire: true,
        // isshow: true,
        message: 'numType',                      // 错误信息Validate.warnInfo
        validator: 'checkNumType',                    // 校验
        type: 'multiInput',                         // 表单类型
        width: 6,                         // 大小
        edit: false,                      // 是否能编辑（和配置的可编辑区分）
        unit: '',                          // 单位
        detailWidth: 12,
        h5Width: 12 || 12
      },
      orgName: {
        position: 10,
        name: 'orgName',
        detailName: 'orgName',              // 展示字段名（可能和编辑字段不同）
        // fieldChName: "单位名称",
        // fieldEnName: "orgName",
        // formEnName: "loanGuarantee",
        // isrequire: true,
        // isshow: true,
        message: 'wordLen25',                      // 错误信息Validate.warnInfo
        validator: 'checkWordLen25',                    // 校验
        type: 'multiInput',                         // 表单类型
        width: 6,                         // 大小
        edit: false,                      // 是否能编辑（和配置的可编辑区分）
        unit: '',                          // 单位
        detailWidth: 12,
        h5Width: 12 || 12
      },
      orgAddr: {
        position: 11,
        name: 'orgAddr',
        detailName: 'orgAddr',              // 展示字段名（可能和编辑字段不同）
        // fieldChName: "单位地址",
        // fieldEnName: "orgAddr",
        // formEnName: "loanGuarantee",
        // isrequire: true,
        // isshow: true,
        message: 'wordLen64',                      // 错误信息Validate.warnInfo
        validator: 'checkWordLen64',                    // 校验
        type: 'multiInput',                         // 表单类型
        width: 6,                         // 大小
        edit: false,                      // 是否能编辑（和配置的可编辑区分）
        unit: '',                          // 单位
        detailWidth: 12,
        h5Width: 12 || 12
      },
      otherMessage: {
        position: 12,
        name: 'otherMessage',
        detailName: 'otherMessage',              // 展示字段名（可能和编辑字段不同）
        // fieldChName: "其他信息",
        // fieldEnName: "otherMessage",
        // formEnName: "loanGuarantee",
        // isrequire: true,
        // isshow: true,
        message: 'wordLen100',                      // 错误信息Validate.warnInfo
        validator: 'checkWordLen100',                    // 校验
        type: 'multiInput',                         // 表单类型
        width: 6,                         // 大小
        edit: false,                      // 是否能编辑（和配置的可编辑区分）
        unit: '',                          // 单位
        detailWidth: 12,
        h5Width: 12 || 12
      }
    }

  }
