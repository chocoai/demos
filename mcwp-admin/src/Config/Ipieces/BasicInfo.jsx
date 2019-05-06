/**
 * 基本信息
 */
export default {
    loanAdvice: {
        adviceLoanAmount: {
            position: 1,
            detailName: 'adviceLoanAmount',              // 展示字段名（可能和编辑字段不同）
            // fieldChName: "建议贷款金额",
            width: 6,                         // 大小
            unit: '万元',                          // 单位
            detailWidth: 12
        },
        annualInterestRate: {
            position: 2,
            detailName: 'annualInterestRate',              // 展示字段名（可能和编辑字段不同）
            // fieldChName: "年化利率",
            width: 6,                         // 大小
            unit: '%',                          // 单位
            detailWidth: 12
        },
        repaymentPeriod: {
            position: 3,
            detailName: 'repaymentPeriodText',              // 展示字段名（可能和编辑字段不同）
            // fieldChName: "还款期数",
            width: 6,                         // 大小
            unit: '期',                          // 单位
            detailWidth: 12
        },
        repaymentKind: {
            position: 4,
            detailName: 'repaymentKindText',              // 展示字段名（可能和编辑字段不同）
            // fieldChName: "还款方式",
            width: 6,                         // 大小
            detailWidth: 12
        },
        loanPurposeDesp: {
            position: 5,
            detailName: 'loanPurposeDesp',              // 展示字段名（可能和编辑字段不同）
            // fieldChName: "贷款目的说明",
            width: 6,                         // 大小
            detailWidth: 12
        }
    },
    // 基本信息
    loanCustomer: {
        cname: {
            position: 1,
            detailName: 'handInputName',              // 展示字段名（可能和编辑字段不同）
            // fieldChName: "姓名",
            width: 6,                         // 大小
            detailWidth: 12
        },
        sex: {
            position: 2,
            detailName: 'sex',                 // 展示字段名（可能和编辑字段不同）
            // fieldChName: "性别",
            width: 6,                         // 大小
            detailWidth: 12
        },
        age: {
            position: 3,
            detailName: 'age',                // 展示字段名（可能和编辑字段不同）
            // fieldChName: "年龄",
            width: 6,                         // 大小
            unit: '岁',                        // 单位
            detailWidth: 12
        },
        censusRegister: {
            position: 4,
            detailName: 'censusRegister',               // 展示字段名（可能和编辑字段不同）
            // fieldChName: "户籍",
            message: 'wordLen25',       // 错误信息Validate.warnInfo
            validator: 'checkWordLen25',     // 校验
            type: 'input',                   // 表单类型
            width: 6,                        // 大小
            edit: true,                      // 是否能编辑（和配置的可编辑区分）
            detailWidth: 12
        },
        maritalStatus: {
            position: 5,
            detailName: 'maritalStatusText',               // 展示字段名（可能和编辑字段不同）
            // fieldChName: "婚姻状况",
            type: 'select',                   // 表单类型
            selectDict: 'hyzkKind',             // 选项字典值
            width: 6,                        // 大小
            edit: {
                6: false,
                7: false,
                8: true
            },                      // 是否能编辑（和配置的可编辑区分）
            switch: 'type',
            detailWidth: 12,
            h5Width: 6
        },
        topEducation: {
            position: 6,
            detailName: 'topEducationText',               // 展示字段名（可能和编辑字段不同）
            // fieldChName: "学历",
            type: 'select',                   // 表单类型
            selectDict: 'education',             // 选项字典值
            width: 6,                        // 大小
            dict: 'education',                 // 字典值
            detailWidth: 12
        },
        applyBalance: {
            position: 7,
            detailName: 'applyBalance',               // 展示字段名（可能和编辑字段不同）
            // fieldChName: "申请金额",
            message: 'numberLenEtwo',       // 错误信息Validate.warnInfo
            validator: 'checkNumLenEtwo',     // 校验
            type: 'input',                   // 表单类型
            width: 6,                        // 大小
            edit: true,                      // 是否能编辑（和配置的可编辑区分）
            unit: '元',                    // 单位
            detailWidth: 12
        },
        estimateAmount: {
            position: 8,
            detailName: 'estimateAmount',               // 展示字段名（可能和编辑字段不同）
            // fieldChName: "客户经理预估金额",
            message: 'numberLenEtwo',       // 错误信息Validate.warnInfo
            validator: 'checkNumLenEtwo',     // 校验
            type: 'input',                   // 表单类型
            width: 6,                        // 大小
            edit: true,                      // 是否能编辑（和配置的可编辑区分）
            unit: '万元',                    // 单位
            detailWidth: 12
        },
        allBalance: {
            position: 9,
            detailName: 'allBalance',               // 展示字段名（可能和编辑字段不同）
            // fieldChName: "总项目资金",
            message: 'numberLenEtwo',       // 错误信息Validate.warnInfo
            validator: 'checkNumLenEtwo',     // 校验
            type: 'input',                   // 表单类型
            width: 6,                        // 大小
            edit: true,                      // 是否能编辑（和配置的可编辑区分）
            unit: '万元',                    // 单位
            detailWidth: 12
        },
        repaymentPeriod: {
            position: 10,
            detailName: 'repaymentPeriodText',               // 展示字段名（可能和编辑字段不同）
            // fieldChName: "还款期数",
            message: 'nullPeriod',       // 错误信息Validate.warnInfo
            validator: '',     // 校验
            type: 'select',                   // 表单类型
            selectDict: 'repaymentPeriod',             // 选项字典值
            width: 6,                        // 大小
            edit: true,                      // 是否能编辑（和配置的可编辑区分）
            unit: '期',                       // 单位
            detailWidth: 12
        },
        repaymentKind: {
            position: 11,
            detailName: 'repaymentKindText',               // 展示字段名（可能和编辑字段不同）
            // fieldChName: "还款方式",
            message: 'nullKind',       // 错误信息Validate.warnInfo
            type: 'select',                   // 表单类型
            selectDict: 'repaymentKind',             // 选项字典值
            width: 6,                        // 大小
            edit: true,                      // 是否能编辑（和配置的可编辑区分）
            detailWidth: 12
        },
        idCardNo: {
            position: 12,
            detailName: 'idCardNo',               // 展示字段名（可能和编辑字段不同）
            // fieldChName: "身份证号",
            width: 6,                        // 大小
            detailWidth: 12
        },
        telephone: {
            position: 13,
            detailName: 'telephone',               // 展示字段名（可能和编辑字段不同）
            // fieldChName: "联系方式",
            width: 6,                        // 大小
            detailWidth: 12
        },
        idCardAddr: {
            position: 14,
            detailName: 'idCardAddr',               // 展示字段名（可能和编辑字段不同）
            // fieldChName: "户籍地址",
            width: 12,                        // 大小
            detailWidth: 12
        },
        homeAddr: {
            position: 15,
            detailName: 'homeAddr',               // 展示字段名（可能和编辑字段不同）
            // fieldChName: "家庭地址",
            message: 'wordLen64',       // 错误信息Validate.warnInfo
            validator: 'checkWordLen64',     // 校验
            type: 'input',                   // 表单类型
            width: 12,                        // 大小
            edit: true,                      // 是否能编辑（和配置的可编辑区分）
            detailWidth: 12
        },
        workType: {
            position: 15,
            detailName: 'workTypeText',               // 展示字段名（可能和编辑字段不同）
            // fieldChName: "工作类型",
            message: 'wordLen64',       // 错误信息Validate.warnInfo
            validator: 'checkWordLen64',     // 校验
            type: 'input',                   // 表单类型
            width: 12,                        // 大小
            edit: true,                      // 是否能编辑（和配置的可编辑区分）
            detailWidth: 12
        },
        familyBusiStatusDesp: {
            position: 16,
            detailName: 'familyBusiStatusDesp',               // 展示字段名（可能和编辑字段不同）
            // fieldChName: "家庭状况与生意状况描述",
            message: 'wordLen64',       // 错误信息Validate.warnInfo
            validator: 'checkWordLen64',     // 校验
            type: 'input',                   // 表单类型
            width: 12,                        // 大小
            edit: true,                      // 是否能编辑（和配置的可编辑区分）
            detailWidth: 12
        }
    },
    // 亲属
    relativeInfo: {
        name: {
            position: 1,
            detailName: 'name',              // 展示字段名（可能和编辑字段不同）
            // fieldChName: "姓名",
            message: 'wordLen15AndNotNull',                      // 错误信息Validate.warnInfo
            validator: 'checkWordLen15',                    // 校验
            type: 'input',                         // 表单类型
            width: 6,                         // 大小
            edit: {
                6: false,
                7: true,
                8: true
            },                      // 是否能编辑（和配置的可编辑区分）
            switch: 'type',                       // 多个条件判断编辑，如果为type，代表是否编辑与类型有关
            detailWidth: 12
        },
        sex: {
            position: 2,
            detailName: 'sex',              // 展示字段名（可能和编辑字段不同）
            // fieldChName: "性别",
            width: 6,                         // 大小
            detailWidth: 12
        },
        age: {
            position: 3,
            detailName: 'age',              // 展示字段名（可能和编辑字段不同）
            // fieldChName: "年龄",
            width: 6,                         // 大小
            unit: '岁',
            detailWidth: 12
        },
        education: {
            position: 4,
            detailName: 'educationText',              // 展示字段名（可能和编辑字段不同）
            // fieldChName: "学历",
            type: 'select',                     // 表单类型
            selectDict: 'education',             // 选项字典值
            width: 6,                         // 大小
            edit: true,                      // 是否能编辑（和配置的可编辑区分）
            detailWidth: 12
        },
        income: {
            position: 5,
            detailName: 'income',              // 展示字段名（可能和编辑字段不同）
            // fieldChName: "月收入",
            message: 'numType',                      // 错误信息Validate.warnInfo
            validator: 'checkNumType',                    // 校验Validate
            type: 'input',                      // 表单类型
            width: 6,                           // 大小
            edit: true,                         // 是否能编辑（和配置的可编辑区分）
            unit: '元',                         // 单位
            detailWidth: 12
        },
        idCardNo: {
            position: 6,
            detailName: 'idCardNo',              // 展示字段名（可能和编辑字段不同）
            // fieldChName: "身份证号",
            message: 'idCard',                   // 错误信息Validate.warnInfo
            validator: 'checkIdCard',            // 校验Validate
            type: 'input',                       // 表单类型
            width: 6,                            // 大小
            edit: {
                6: false,
                7: false,
                8: true
            },                                   // 是否能编辑（和配置的可编辑区分）
            switch: 'type',                         // 多个条件判断编辑，如果为type，代表是否编辑与类型有关
            detailWidth: 12
        },
        telephone: {
            position: 7,
            detailName: 'telephone',             // 展示字段名（可能和编辑字段不同）
            // fieldChName: "联系方式",
            message: 'phoneNum',                 // 错误信息Validate.warnInfo
            validator: 'checkPhoneNum',          // 校验Validate
            type: 'input',                       // 表单类型
            width: 6,                            // 大小
            edit: {
                6: false,
                7: true,
                8: true
            },                                  // 是否能编辑（和配置的可编辑区分）
            switch: 'type',                        // 多个条件判断编辑，如果为type，代表是否编辑与类型有关
            detailWidth: 12
        },
        relationship: {
            position: 8,
            detailName: 'relationshipText',              // 展示字段名（可能和编辑字段不同）
            // fieldChName: "与申请人关系",
            message: 'selectNotNull',               // 错误信息Validate.warnInfo
            validator: 'checkNotNull',                          // 校验Validate
            type: 'select',                         // 表单类型
            selectDict: 'relationship',             // 选项字典值
            width: 6,                               // 大小
            edit: {
                6: false,
                7: true,
                8: true
            },                                      // 是否能编辑（和配置的可编辑区分）
            switch: 'type',                           // 多个条件判断编辑，如果为type，代表是否编辑与类型有关
            detailWidth: 12
        }
    },
    // 紧急联系人
    emergencyContactInfo: {
        name: {
            position: 1,
            detailName: 'name',              // 展示字段名（可能和编辑字段不同）
            // fieldChName: "姓名",
            message: 'wordLen15AndNotNull',                      // 错误信息Validate.warnInfo
            validator: 'checkWordLen15AndNotNull',                    // 校验
            type: 'input',                         // 表单类型
            width: 6,                         // 大小
            edit: {
                6: false,
                7: true,
                8: true
            },                      // 是否能编辑（和配置的可编辑区分）
            switch: 'type',                       // 多个条件判断编辑，如果为type，代表是否编辑与类型有关
            detailWidth: 12
        },
        telephone: {
            position: 2,
            detailName: 'telephone',             // 展示字段名（可能和编辑字段不同）
            // fieldChName: "联系方式",
            message: 'phoneNum',                 // 错误信息Validate.warnInfo
            validator: 'checkPhoneNumAndNotNull',          // 校验Validate
            type: 'input',                       // 表单类型
            width: 6,                            // 大小
            edit: {
                6: false,
                7: true,
                8: true
            },                                  // 是否能编辑（和配置的可编辑区分）
            switch: 'type',                        // 多个条件判断编辑，如果为type，代表是否编辑与类型有关
            detailWidth: 12
        },
        relationship: {
            position: 3,
            detailName: 'relationshipText',              // 展示字段名（可能和编辑字段不同）
            // fieldChName: "与申请人关系",
            message: 'selectNotNull',               // 错误信息Validate.warnInfo
            validator: 'checkNotNull',                          // 校验Validate
            type: 'select',                         // 表单类型
            selectDict: 'relationship',             // 选项字典值
            width: 6,                               // 大小
            edit: {
                6: false,
                7: true,
                8: true
            },                                      // 是否能编辑（和配置的可编辑区分）
            switch: 'type',                           // 多个条件判断编辑，如果为type，代表是否编辑与类型有关
            detailWidth: 12
        }
    },

    // 抵质押
    pledgeInfo: {
        pledgeName: {
            position: 1,
            detailName: 'pledgeName',              // 展示字段名（可能和编辑字段不同）
            // fieldChName: "抵质押物名称",
            message: 'wordLen25',               // 错误信息Validate.warnInfo
            validator: 'checkWordLen25',                          // 校验Validate
            type: 'multiInput',                         // 表单类型
            selectDict: '',             // 选项字典值
            width: 12,                               // 大小
            edit: true,                                      // 是否能编辑（和配置的可编辑区分）
            detailWidth: 12 || 12
        },
        pledgeType: {
            position: 2,
            name: 'pledgeType',
            detailName: 'pledgeTypeText',              // 展示字段名（可能和编辑字段不同）
            // fieldChName: "类型",
            type: 'multiSelect',                         // 表单类型
            selectDict: 'dzy',             // 选项字典值
            width: 12,                               // 大小
            edit: true,                                      // 是否能编辑（和配置的可编辑区分）
            detailWidth: 12 || 12
        },
        name: {
            position: 3,
            detailName: 'name',              // 展示字段名（可能和编辑字段不同）
            // fieldChName: "抵押人姓名",
            message: 'wordLen25',               // 错误信息Validate.warnInfo
            validator: 'checkWordLen25',                          // 校验Validate
            type: 'multiInput',                         // 表单类型
            detailRely: {
                target: 'isowner',
                result: true
            },
            selectDict: '',             // 选项字典值
            width: 12,                               // 大小
            edit: true,                                      // 是否能编辑（和配置的可编辑区分）
            detailWidth: 12 || 12
        },
        idCardNo: {
            position: 4,
            detailName: 'idCardNo',              // 展示字段名（可能和编辑字段不同）
            // fieldChName: "抵押人身份证号",
            type: 'multiInput',                         // 表单类型
            detailRely: {
                target: 'isowner',
                result: true
            },
            selectDict: '',             // 选项字典值
            width: 12,                               // 大小
            edit: true,                                      // 是否能编辑（和配置的可编辑区分）
            detailWidth: 12 || 12
        },
        relationship: {
            position: 5,
            detailName: 'relationshipText',              // 展示字段名（可能和编辑字段不同）
            // fieldChName: "与申请人关系",
            message: 'wordLen10',               // 错误信息Validate.warnInfo
            validator: 'checkWordLen10',                          // 校验Validate
            type: 'multiInput',                         // 表单类型
            detailRely: {
                target: 'isowner',
                result: true
            },
            selectDict: '',             // 选项字典值
            width: 12,                               // 大小
            edit: true,                                      // 是否能编辑（和配置的可编辑区分）
            detailWidth: 12 || 12
        },
        houseType: {
            position: 6,
            detailName: 'houseTypeText',              // 展示字段名（可能和编辑字段不同）
            // fieldChName: "房产类型",
            width: 12,                               // 大小
            edit: false,                                      // 是否能编辑（和配置的可编辑区分）
            detailWidth: 12 || 12
        },
        houseUnitPrice: {
            position: 7,
            detailName: 'houseUnitPrice',              // 展示字段名（可能和编辑字段不同）
            // fieldChName: "房屋单价",
            width: 12,                               // 大小
            edit: false,                                      // 是否能编辑（和配置的可编辑区分）
            unit: '元/平',                               // 单位
            detailWidth: 12 || 12
        },
        houseTotal: {
            position: 8,
            detailName: 'houseTotal',              // 展示字段名（可能和编辑字段不同）
            // fieldChName: "房屋总估值",
            message: 'numberLenEtwo',               // 错误信息Validate.warnInfo
            validator: 'checkNumLenEtwo',                          // 校验Validate
            type: 'multiInput',                         // 表单类型
            width: 12,                               // 大小
            edit: true,                                      // 是否能编辑（和配置的可编辑区分）
            unit: '万元',                               // 单位
            detailWidth: 12 || 12
        },
        houseSize: {
            position: 9,
            detailName: 'houseSize',              // 展示字段名（可能和编辑字段不同）
            // fieldChName: "房屋面积",
            message: 'numberLenTtwo',               // 错误信息Validate.warnInfo
            validator: 'checkNumLenTtwo',                          // 校验Validate
            type: 'multiInput',                         // 表单类型
            width: 12,                               // 大小
            edit: true,                                      // 是否能编辑（和配置的可编辑区分）
            unit: '㎡',                               // 单位
            detailWidth: 12 || 12
        },
        address: {
            position: 10,
            detailName: 'address',              // 展示字段名（可能和编辑字段不同）
            // fieldChName: "房屋位置",
            message: 'wordLen25',               // 错误信息Validate.warnInfo
            validator: 'checkWordLen25',                          // 校验Validate
            type: 'multiInput',                         // 表单类型
            width: 12,                               // 大小
            edit: true,                                      // 是否能编辑（和配置的可编辑区分）
            detailWidth: 12 || 12
        },
        isowner: {
            position: 11,
            detailName: 'isowner',              // 展示字段名（可能和编辑字段不同）
            // fieldChName: "是否自有房产抵押",
            message: 'wordLen25',               // 错误信息Validate.warnInfo
            validator: 'checkWordLen25',                          // 校验Validate
            type: 'multiInput',                         // 表单类型
            width: 12,                               // 大小
            detailType: 'whether',
            edit: true,                                      // 是否能编辑（和配置的可编辑区分）
            detailWidth: 12 || 12
        },
        iscurrentMortgage: {
            position: 12,
            detailName: 'iscurrentMortgage',              // 展示字段名（可能和编辑字段不同）
            // fieldChName: "目前是否有抵押",
            type: 'multiInput',                         // 表单类型
            width: 12,                               // 大小
            detailType: 'whether',
            detailRely: {
                target: 'isowner',
                result: false
            },
            edit: true,                                      // 是否能编辑（和配置的可编辑区分）
            detailWidth: 12 || 12
        },
        houseGetMethod: {
            position: 13,
            detailName: 'houseGetMethodText',              // 展示字段名（可能和编辑字段不同）
            // fieldChName: "房产取得方式",
            type: 'multiInput',                         // 表单类型
            width: 12,                               // 大小
            edit: true,                                      // 是否能编辑（和配置的可编辑区分）
            detailWidth: 12 || 12
        },
        pledgeTelephone: {
            position: 14,
            detailName: 'pledgeTelephone',              // 展示字段名（可能和编辑字段不同）
            // fieldChName: "抵押人联系方式",
            message: 'wordLen25',               // 错误信息Validate.warnInfo
            validator: 'checkWordLen25',                          // 校验Validate
            type: 'multiInput',                         // 表单类型
            detailRely: {
                target: 'isowner',
                result: true
            },
            width: 12,                               // 大小
            edit: true,                                      // 是否能编辑（和配置的可编辑区分）
            detailWidth: 12 || 12
        },
        houseAge: {
            position: 15,
            detailName: 'houseAge',              // 展示字段名（可能和编辑字段不同）
            // fieldChName: "房龄",
            message: 'numDecimalOne',               // 错误信息Validate.warnInfo
            validator: 'checkNumDecimalOne',                          // 校验Validate
            type: 'multiInput',                         // 表单类型
            width: 12,                               // 大小
            edit: true,                                      // 是否能编辑（和配置的可编辑区分）
            unit: '年',                               // 单位
            detailWidth: 12 || 12
        },
        warrentNumber: {
            position: 16,
            detailName: 'warrentNumber',              // 展示字段名（可能和编辑字段不同）
            // fieldChName: "权证号",
            message: 'wordLen20',               // 错误信息Validate.warnInfo
            validator: 'checkWordLen20',                          // 校验Validate
            type: 'multiInput',                         // 表单类型
            width: 12,                               // 大小
            edit: true,                                      // 是否能编辑（和配置的可编辑区分）
            detailWidth: 12 || 12
        },
        pledgeStatus: {
            position: 17,
            detailName: 'pledgeStatusText',              // 展示字段名（可能和编辑字段不同）
            // fieldChName: "房屋是否已抵押给其他银行或个人",
            type: 'multiSwitch',                         // 表单类型
            detailType: 'whether',
            width: 12,                               // 大小
            edit: true,                                      // 是否能编辑（和配置的可编辑区分）
            detailWidth: 12 || 12
        },
        remark: {
            position: 18,
            detailName: 'remark',              // 展示字段名（可能和编辑字段不同）
            // fieldChName: "备注",
            message: 'wordLen256',               // 错误信息Validate.warnInfo
            validator: 'checkWordLen256',                          // 校验Validate
            type: 'multiTextarea',                         // 表单类型
            width: 12,                               // 大小
            edit: true,                                      // 是否能编辑（和配置的可编辑区分）
            detailWidth: 12 || 12
        }
    }
}
