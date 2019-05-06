//基本信息
import EditBase from '../EditBase';
//房抵贷基本信息
import EditCitizenBase from './EditCitizenBase'
//南郊车贷基本信息
import EditCarBase from './EditCarBase'
// 南郊配偶基本信息
import EditNJBaseSpouse from './EditNJBaseSpouse'
//抵质押信息
import EditGuaranty from '../EditGuaranty';
//经营基本信息
import EditManageBase from '../EditManageBase';
import EditManageSit from '../EditManageSit';
//其他经营信息
import EditManageOther from '../EditManageOther';
import EditManageOthMain from '../EditManageOthMain';
import EditManageOthCus from '../EditManageOthCus';
import EditManageOthYear from '../EditManageOthYear';
//经营信息
import EditManageFarm from '../EditManageFarm';
//职业信息
import EditProInfo from '../EditProInfo';
//上下游单位信息
import EditManageStream from '../EditManageStream';
//主营业务分析 生产情况分析
import EditManageTrend from '../EditManageTrend';
import EditManageType from '../EditManageType';
import EditManagePro from '../EditManagePro';
//共同借款人及担保人信息
import EditComLoan from '../EditComLoan';
import EditComGuaran from '../EditComGuaran';
//财务情况
import EditFinanceBalance from '../EditFinanceBalance';
import EditFinanceIncome from '../EditFinanceIncome';
import EditFinanceCash from '../EditFinanceCash';
//农贷财务情况
import EditFarmBalance from '../EditFarmBalance';
import EditFarmIncome from '../EditFarmIncome';
import EditFarmCash from '../EditFarmCash';
//逻辑校验
import EditLogic from '../EditLogic';
//资产信息
import EditAssetHouses from '../EditAssetHouses';
import EditAssetCars from '../EditAssetCars';
import EditAssetMachine from '../EditAssetMachine';
//软信息
import EditSoftInfo from '../EditSoftInfo';
//农贷软信息
import EditFarmSoft from '../EditFarmSoft';

//基本信息临时
import EditBaseTmp from '../EditBaseTmp';
//抵质押信息临时
import EditGuarantyTmp from '../EditGuarantyTmp';
// 共同借款人临时
import EditComLoanTmp from '../EditComLoanTmp'
// 共同担保人临时
import EditComGuaranTmp from '../EditComGuaranTmp'

import { Form } from 'antd';

//信贷历史，暂时不用表单处理
export { default as EditCredit } from '../EditCredit';

//基本信息
export const EditBaseForm = Form.create()(EditBase)
//房抵贷基本信息
export const EditCitizenBaseForm = Form.create()(EditCitizenBase)
//南郊车贷基本信息
export const EditCarBaseForm = Form.create()(EditCarBase)
// 南郊配偶基本信息
export const EditNJBaseSpouseForm = Form.create()(EditNJBaseSpouse)
//基本信息临时
export const EditBaseFormTmp = Form.create()(EditBaseTmp)
//抵质押信息
export const EditGuarantyForm = Form.create()(EditGuaranty)
//抵质押信息
export const EditGuarantyFormTmp = Form.create()(EditGuarantyTmp)
//经营基本信息
export const EditManageBaseForm = Form.create()(EditManageBase)
export const EditManageSitForm = Form.create()(EditManageSit)
//其他经营信息
export const EditManageOtherForm = Form.create()(EditManageOther)
export const EditManageOthMainForm = Form.create()(EditManageOthMain)
export const EditManageOthCusForm = Form.create()(EditManageOthCus)
export const EditManageOthYearForm = Form.create()(EditManageOthYear)
//经营信息
export const EditManageFarmForm = Form.create()(EditManageFarm)
//职业信息
export const EditProInfoForm = Form.create()(EditProInfo)
//上下游单位信息
export const EditManageStreamForm = Form.create()(EditManageStream)
//主营业务分析 生产情况分析
export const EditManageTrendForm = Form.create()(EditManageTrend)
export const EditManageTypeForm = Form.create()(EditManageType)
export const EditManageProForm = Form.create()(EditManagePro)
//共同借款人及担保人信息
export const EditComLoanForm = Form.create()(EditComLoan)
export const EditComGuaranForm = Form.create()(EditComGuaran)
export const EditComLoanFormTmp = Form.create()(EditComLoanTmp)
export const EditComGuaranFormTmp = Form.create()(EditComGuaranTmp)

//财务情况
export const EditFinanceBalanceForm = Form.create()(EditFinanceBalance)
export const EditFinanceIncomeForm = Form.create()(EditFinanceIncome)
export const EditFinanceCashForm = Form.create()(EditFinanceCash)
//农贷财务情况
export const EditFarmBalanceForm = Form.create()(EditFarmBalance)
export const EditFarmIncomeForm = Form.create()(EditFarmIncome)
export const EditFarmCashForm = Form.create()(EditFarmCash)
//逻辑校验
export const EditLogicForm = Form.create()(EditLogic)
//资产信息
export const EditAssetHousesForm = Form.create()(EditAssetHouses)
export const EditAssetCarsForm = Form.create()(EditAssetCars)
export const EditAssetMachineForm = Form.create()(EditAssetMachine)
//软信息
export const EditSoftInfoForm = Form.create()(EditSoftInfo)
//农贷软信息
export const EditFarmSoftForm = Form.create()(EditFarmSoft)
