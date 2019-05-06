import React from 'react';
import { Link } from 'react-router';
import { EditCitizenBaseForm,EditCarBaseForm, EditNJBaseSpouseForm, EditCredit, EditFarmSoftForm, EditSoftInfoForm, EditAssetMachineForm, EditAssetCarsForm, EditAssetHousesForm, EditLogicForm, EditFarmCashForm, EditFarmIncomeForm, EditFarmBalanceForm, EditFinanceCashForm, EditFinanceIncomeForm, EditFinanceBalanceForm, EditComGuaranForm, EditComLoanForm, EditManageProForm, EditManageTypeForm, EditManageTrendForm, EditManageStreamForm, EditProInfoForm, EditManageFarmForm, EditManageOthYearForm, EditManageOthCusForm, EditManageOthMainForm, EditManageOtherForm, EditManageSitForm, EditManageBaseForm, EditGuarantyForm, EditBaseForm } from '../Component/Ipieces/Edit';
import { EditBaseFormTmp, EditGuarantyFormTmp, EditComLoanFormTmp, EditComGuaranFormTmp } from '../Component/Ipieces/Edit';

import { Tabs } from 'antd';
import { DetailNJBaseSpouse, DetailCitizenBase,DetailCarBase, DetailProInfo, DetailFarmCash, DetailFarmIncome, DetailFarmBalance, DetailFarmSoft, DetailManageStream, DetailManageFarm, DetailSoftInfo, DetailAssetHouse, DetailRightsDTO, DetailCoBoGua, DetailAssetBank, DetailCreditHis, DetailBusAnalyse, DetailOthBusInfo, DetailBusInfo, DetailBaseInfo, DetailFinanceCash, DetailFinanceIncome, DetailFinanceBalance } from '../Component/Ipieces/Detail'
import { DetailBaseInfoTmp, DetaiNetBaseInfo, DetailCoBoGuaTmp, DetailCreditHisTmp } from '../Component/Ipieces/Detail'
import { PDFBase } from '../Component/Ipieces/PDF'

const TabPane = Tabs.TabPane;

/**
 * 进件处理
 * @param {*} that: this
 */
export default function getContent(that, typeContent) {
    const { userAction, softInfo, assetsData, farmCash, farmIncome, farmBalance, cash, income, guaranteeData, creditHisData, businessAnalysisData, balance, priceSum, businessOtherData, businessInfoData, baseData, eduDict, smdsshy,nsr,jylb, flxs,education, repaymentPeriod, code, logicData, soft, personCredit, spouseCredit, borrowerCredit, guaranteeCredit, coborrowerCredit, type, loanDownStream, setMethod, farmBase, cultiLand, defaultTab, relationship, znqkKind, repaymentKind, hyzkKind, proInfoData, ssqList } = that.state;
    const { topInfo, isFinish, hkqs, hkfs, baseInfo, loanBusinessBase, loanCreditHisData, loanGuaranteeData, analysisClass, pictureInfo, sigleSoftInfo } = that.state;
    return topInfo && topInfo.tabConfig ? [
        {
            name: '基本信息',
            formEnName: "basicInfo",
            type: ['8'],
            editContent:
                <TabPane tab={topInfo.tabName.basicInfo} key="basicInfo">
                    {
                        baseData && education ?
                            <div>
                                <EditBaseForm ref={editBaseForm => { that.editBaseForm = editBaseForm }} userAction={userAction} baseData={baseData} topInfo={topInfo} showPicture={that.showPicture} openUploadImg={that.openUploadImg} len={topInfo.loanRiskPoints && topInfo.loanRiskPoints.length || 1} code={code} education={education} personCredit={personCredit} relationship={relationship} znqkKind={znqkKind} repaymentPeriod={repaymentPeriod} repaymentKind={repaymentKind} hyzkKind={hyzkKind} type={type} />
                                <EditGuarantyForm ref={editGuarantyForm => { that.editGuarantyForm = editGuarantyForm }} baseData={baseData} len={baseData.loanPledgeInfos && baseData.loanPledgeInfos.length || 1} loanPledgeInfos={baseData.loanPledgeInfos} code={code} />
                            </div> : null
                    }
                </TabPane>,
            detailContent:
                <TabPane tab={topInfo.tabName.basicInfo} key="basicInfo">
                    {
                        baseInfo && isFinish ?
                            <DetailBaseInfo baseInfo={baseInfo} personCredit={personCredit} code={that.state.code} pictureInfo={pictureInfo} showPicture={that.showPicture} type={type} eduDict={eduDict} relationship={relationship} hkqs={hkqs} hkfs={hkfs} showDetail={that.showDetail} />
                            : null
                    }
                </TabPane>,
            pdfContent: <PDFBase key="basicInfo" baseInfo={baseInfo} />
        },
        // 动态表单临时处理，未来合并
        {
            name: '基本信息',
            formEnName: "basicInfo",
            type: ['6', '7'],
            editContent:
                <TabPane tab={topInfo.tabName.basicInfo} key="basicInfo">
                    {
                        baseData && eduDict ?
                            <div>
                                <EditBaseFormTmp ref={editBaseForm => { that.editBaseForm = editBaseForm }} userAction={userAction} baseData={baseData} topInfo={topInfo} showPicture={that.showPicture} openUploadImg={that.openUploadImg} len={topInfo.loanRiskPoints && topInfo.loanRiskPoints.length || 1} code={code} eduDict={eduDict} personCredit={personCredit} relationship={relationship} znqkKind={znqkKind} repaymentPeriod={repaymentPeriod} repaymentKind={repaymentKind} hyzkKind={hyzkKind} type={type} />
                                <EditGuarantyFormTmp ref={editGuarantyForm => { that.editGuarantyForm = editGuarantyForm }} baseData={baseData} len={baseData.loanPledgeInfos && baseData.loanPledgeInfos.length || 1} loanPledgeInfos={baseData.loanPledgeInfos} code={code} />
                            </div> : null
                    }
                </TabPane>,
            detailContent:
                <TabPane tab={topInfo.tabName.basicInfo} key="basicInfo">
                    {
                        baseInfo && isFinish ?
                            <DetailBaseInfoTmp baseInfo={baseInfo} personCredit={personCredit} code={that.state.code} pictureInfo={pictureInfo} showPicture={that.showPicture} type={type} eduDict={eduDict} relationship={relationship} hkqs={hkqs} hkfs={hkfs} showDetail={that.showDetail} />
                            : null
                    }
                </TabPane>,
            pdfContent: <PDFBase key="basicInfo" baseInfo={baseInfo} />
        },
        // 无调查
        {
            name: '基本信息',
            formEnName: "basicInfo",
            type: ['5'],
            editContent:
                <TabPane tab={topInfo.tabName.basicInfo} key="basicInfo">
                    {
                        baseData && eduDict ?
                            <div>
                                <EditBaseFormTmp ref={editBaseForm => { that.editBaseForm = editBaseForm }} userAction={userAction} baseData={baseData} topInfo={topInfo} showPicture={that.showPicture} openUploadImg={that.openUploadImg} len={topInfo.loanRiskPoints && topInfo.loanRiskPoints.length || 1} code={code} eduDict={eduDict} personCredit={personCredit} relationship={relationship} znqkKind={znqkKind} repaymentPeriod={repaymentPeriod} repaymentKind={repaymentKind} hyzkKind={hyzkKind} type={type} />
                                <EditGuarantyFormTmp ref={editGuarantyForm => { that.editGuarantyForm = editGuarantyForm }} baseData={baseData} len={baseData.loanPledgeInfos && baseData.loanPledgeInfos.length || 1} loanPledgeInfos={baseData.loanPledgeInfos} code={code} />
                            </div> : null
                    }
                </TabPane>,
            detailContent:
                <TabPane tab={topInfo.tabName.basicInfo} key="basicInfo">
                    {
                        baseInfo && isFinish ?
                            <DetaiNetBaseInfo baseInfo={baseInfo} personCredit={personCredit} code={that.state.code} pictureInfo={pictureInfo} showPicture={that.showPicture} type={type} eduDict={eduDict} relationship={relationship} hkqs={hkqs} hkfs={hkfs} showDetail={that.showDetail} />
                            : null
                    }
                </TabPane>,
            pdfContent: <PDFBase key="basicInfo" baseInfo={baseInfo} />
        },
        // 房抵贷
        {
            name: '基本信息',
            formEnName: "basicInfo",
            type: ['12', '14', '15', '16'],
            editContent:
                <TabPane tab={topInfo.tabName.basicInfo} key="basicInfo">
                    {
                        baseData && education ?
                            <div>
                                <EditCitizenBaseForm ref={editBaseForm => { that.editBaseForm = editBaseForm }} userAction={userAction} baseData={baseData} topInfo={topInfo} showPicture={that.showPicture} openUploadImg={that.openUploadImg} len={topInfo.loanRiskPoints && topInfo.loanRiskPoints.length || 1} showDetail={that.showDetail} code={code} education={education} personCredit={personCredit} relationship={relationship} znqkKind={znqkKind} repaymentPeriod={repaymentPeriod} repaymentKind={repaymentKind} hyzkKind={hyzkKind} pictureInfo={pictureInfo} type={type} eduDict={eduDict} />
                            </div> : null
                    }
                </TabPane>,
            detailContent:
                <TabPane tab={topInfo.tabName.basicInfo} key="basicInfo">
                    {
                        baseInfo && isFinish ?
                            <DetailCitizenBase baseInfo={baseInfo} personCredit={personCredit} code={that.state.code} pictureInfo={pictureInfo} showPicture={that.showPicture} type={type} eduDict={eduDict} relationship={relationship} hkqs={hkqs} hkfs={hkfs} showDetail={that.showDetail} topInfo={topInfo} />
                            : null
                    }
                </TabPane>,
            pdfContent: <PDFBase key="basicInfo" baseInfo={baseInfo} />
        },
        // 包头南郊车贷
        {
            name: '基本信息',
            formEnName: "basicInfo",
            type: ['17'],
            editContent:
                <TabPane tab={topInfo.tabName.basicInfo} key="basicInfo">
                    {
                        baseData && education ?
                            <div>
                                <EditCarBaseForm ref={editBaseForm => { that.editBaseForm = editBaseForm }} userAction={userAction} baseData={baseData} topInfo={topInfo} showPicture={that.showPicture} openUploadImg={that.openUploadImg} len={topInfo.loanRiskPoints && topInfo.loanRiskPoints.length || 1} showDetail={that.showDetail} code={code} education={education} personCredit={personCredit} relationship={relationship} znqkKind={znqkKind} repaymentPeriod={repaymentPeriod} repaymentKind={repaymentKind} hyzkKind={hyzkKind} pictureInfo={pictureInfo} type={type} eduDict={eduDict} />
                            </div> : null
                    }
                </TabPane>,
            detailContent:
                <TabPane tab={topInfo.tabName.basicInfo} key="basicInfo">
                    {
                        baseInfo && isFinish ?
                            <DetailCarBase baseInfo={baseInfo} personCredit={personCredit} code={that.state.code} pictureInfo={pictureInfo} showPicture={that.showPicture} type={type} eduDict={eduDict} relationship={relationship} hkqs={hkqs} hkfs={hkfs} showDetail={that.showDetail} topInfo={topInfo} />
                            : null
                    }
                </TabPane>,
            pdfContent: <PDFBase key="basicInfo" baseInfo={baseInfo} />
        },
        // 南郊房抵贷
        {
            name: '基本信息',
            formEnName: "basicInfo",
            type: ['13'],
            editContent:
                <TabPane tab={topInfo.tabName.basicInfo} key="basicInfo">
                    {
                        baseData && education ?
                            <EditCitizenBaseForm ref={editBaseForm => { that.editBaseForm = editBaseForm }} userAction={userAction} baseData={baseData} topInfo={topInfo} showPicture={that.showPicture} openUploadImg={that.openUploadImg} len={topInfo.loanRiskPoints && topInfo.loanRiskPoints.length || 1} showDetail={that.showDetail} code={code} education={education} personCredit={personCredit} relationship={relationship} znqkKind={znqkKind} repaymentPeriod={repaymentPeriod} repaymentKind={repaymentKind} hyzkKind={hyzkKind} pictureInfo={pictureInfo} type={type} eduDict={eduDict} />
                            : null
                    }
                    {
                        baseData && baseData.loanSpouse && education ?
                            <EditNJBaseSpouseForm ref={editNJBaseSpouseForm => { that.editNJBaseSpouseForm = editNJBaseSpouseForm }} userAction={userAction} baseData={baseData} topInfo={topInfo} showPicture={that.showPicture} openUploadImg={that.openUploadImg} len={topInfo.loanRiskPoints && topInfo.loanRiskPoints.length || 1} showDetail={that.showDetail} code={code} education={education} personCredit={personCredit} relationship={relationship} znqkKind={znqkKind} repaymentPeriod={repaymentPeriod} repaymentKind={repaymentKind} hyzkKind={hyzkKind} pictureInfo={pictureInfo} type={type} eduDict={eduDict} smdsshy={smdsshy} />
                            : null
                    }
                </TabPane>,
            detailContent:
                <TabPane tab={topInfo.tabName.basicInfo} key="basicInfo">
                    {
                        baseInfo && isFinish ?
                            <DetailCitizenBase baseInfo={baseInfo} personCredit={personCredit} code={that.state.code} pictureInfo={pictureInfo} showPicture={that.showPicture} type={type} eduDict={eduDict} relationship={relationship} hkqs={hkqs} hkfs={hkfs} showDetail={that.showDetail} topInfo={topInfo} />
                            : null
                    }
                    {
                        baseInfo && baseInfo.loanSpouse && isFinish ?
                            <DetailNJBaseSpouse loanSpouse={baseInfo.loanSpouse} spouseCredit={spouseCredit} code={that.state.code} pictureInfo={pictureInfo} showPicture={that.showPicture} type={type} eduDict={eduDict} relationship={relationship} hkqs={hkqs} hkfs={hkfs} showDetail={that.showDetail} topInfo={topInfo} />
                            : null
                    }
                </TabPane>,
            pdfContent: <PDFBase key="basicInfo" baseInfo={baseInfo} />
        },
        {
            name: '经营基本信息',
            formEnName: "businessEntity",
            type: ['6', '7', '8'],
            editContent:
                <TabPane tab={topInfo.tabName.businessEntity} key="busInfo">
                    <EditManageBaseForm ref={editManageBaseForm => { that.editManageBaseForm = editManageBaseForm }} loanBusinessEntity={businessInfoData && businessInfoData.loanBusinessEntity} openUploadImg={that.openUploadImg} loanBusinessBase={businessInfoData} code={code} type={type} nsr={nsr} jylb={jylb} flxs={flxs}/>
                    <EditManageSitForm ref={editManageSitForm => { that.editManageSitForm = editManageSitForm }} loanBusinessInfo={businessInfoData && businessInfoData.loanBusinessInfo} openUploadImg={that.openUploadImg} code={code} type={type}/>
                </TabPane>,
            detailContent:
                <TabPane tab={topInfo.tabName.businessEntity} key="busInfo">
                    <DetailBusInfo loanBusinessBase={loanBusinessBase} personCredit={personCredit} pictureInfo={pictureInfo} showPicture={that.showPicture} type={type}/>
                </TabPane>,
            pdfContent: <div key="busInfo">经营基本信息</div>
        },
        {
            name: '其他经营信息',
            formEnName: "businessOth",
            type: ['6', '7', '8'],
            editContent:
                <TabPane tab={topInfo.tabName.businessOth} key="manageOther">
                    {
                        businessOtherData ?
                            <div>
                                <EditManageOtherForm ref={editManageOtherForm => { that.editManageOtherForm = editManageOtherForm }} loanBusinessOth={businessOtherData.loanBusinessOth} />
                                <EditManageOthMainForm ref={editManageOthMainForm => { that.editManageOthMainForm = editManageOthMainForm }} loanBusinessSuppliers={businessOtherData.loanBusinessSuppliers} len={businessOtherData.loanBusinessSuppliers && businessOtherData.loanBusinessSuppliers.length || 1} />
                                <EditManageOthCusForm ref={editManageOthCusForm => { that.editManageOthCusForm = editManageOthCusForm }} loanBusinessCustomers={businessOtherData.loanBusinessCustomers} len={businessOtherData.loanBusinessCustomers && businessOtherData.loanBusinessCustomers.length || 1} />
                                <EditManageOthYearForm ref={editManageOthYearForm => { that.editManageOthYearForm = editManageOthYearForm }} loanBusinessYearFins={businessOtherData.loanBusinessYearFins} />
                            </div>
                            : null
                    }
                </TabPane>,
            detailContent:
                <TabPane tab={topInfo.tabName.businessOth} key="othBusInfo">
                    {
                        businessOtherData ?
                            <DetailOthBusInfo businessOtherData={businessOtherData} />
                            : null
                    }
                </TabPane>,
            pdfContent: <div key="othBusInfo">其他经营信息</div>
        },
        {
            name: '经营信息',
            formEnName: "agriManageInfo",
            type: ['7'],
            editContent:
                <TabPane tab={topInfo.tabName.agriManageInfo} key="manageInfo">
                    { //经营信息
                        farmBase && cultiLand ?
                            <EditManageFarmForm ref={editManageFarmForm => { that.editManageFarmForm = editManageFarmForm }} farmBase={farmBase} landLen={farmBase.businessLandList && farmBase.businessLandList.length || 1} plantLen={farmBase.businessPlantList && farmBase.businessPlantList.length || 1} breedLen={farmBase.businessBreedList && farmBase.businessBreedList.length || 1} cultiLand={cultiLand} /> : null
                    }
                </TabPane>,
            detailContent:
                <TabPane tab={topInfo.tabName.agriManageInfo} key="manageInfo">
                    <DetailManageFarm farmBase={that.state.farmBase} cultiLand={cultiLand} />
                </TabPane>,
            pdfContent: <div key="manageInfo">经营信息</div>
        },
        {
            name: '上下游单位信息',
            formEnName: "upDownStreamInfo",
            type: ['7'],
            editContent:
                <TabPane tab={topInfo.tabName.upDownStreamInfo} key="upDownInfo">
                    {
                        loanDownStream && setMethod ?
                            <EditManageStreamForm ref={editManageDownForm => { that.editManageDownForm = editManageDownForm }} loanDownStream={loanDownStream} supplyLen={loanDownStream.supplyBusinessList && loanDownStream.supplyBusinessList.length || 1} saleLen={loanDownStream.salesBusinessList && loanDownStream.salesBusinessList.length || 1} setMethod={setMethod} /> : null
                    }
                </TabPane>,
            detailContent:
                <TabPane tab={topInfo.tabName.upDownStreamInfo} key="upDownInfo">
                    <DetailManageStream loanDownStream={that.state.loanDownStream} setMethod={setMethod} />
                </TabPane>,
            pdfContent: <div key="upDownInfo">上下游单位信息</div>
        },
        {
            name: '职业信息',
            formEnName: "proInfo",
            type: ['8'],
            editContent:
                <TabPane tab={topInfo.tabName.proInfo} key="proInfo">
                    <EditProInfoForm ref={editProInfoForm => { that.editProInfoForm = editProInfoForm }} proInfoData={proInfoData} />
                </TabPane>,
            detailContent:
                <TabPane tab={topInfo.tabName.proInfo} key="othBusInfo">
                    <DetailProInfo proInfoData={proInfoData} />
                </TabPane>,
            pdfContent: <div key="othBusInfo">职业信息</div>
        },
        {
            name: '主营业务分析',
            formEnName: "mainBusiAna",
            type: ['6', '7', '8'],
            editContent:
                <TabPane tab={topInfo.tabName.mainBusiAna} key="analysisBus">
                    {
                        businessAnalysisData && businessAnalysisData.loanBusinessProfitDto ?
                            <EditManageProForm ref={editManageProForm => { that.editManageProForm = editManageProForm }} loanBusinessProfitDto={businessAnalysisData.loanBusinessProfitDto} len={businessAnalysisData.loanBusinessProfitDto.loanBusinessMajorDtos ? businessAnalysisData.loanBusinessProfitDto.loanBusinessMajorDtos.length : 1} />
                            : null
                    }
                </TabPane>,
            detailContent:
                <TabPane tab={topInfo.tabName.mainBusiAna} key="analysisBus">
                    <DetailBusAnalyse businessAnalysisData={businessAnalysisData} analysisClass={analysisClass} />
                </TabPane>,
            pdfContent: <div key="analysisBus">主营业务分析</div>
        },
        {
            name: '生产情况分析',
            formEnName: "prdStatusAna",
            type: ['6', '7', '8'],
            editContent:
                <TabPane tab={topInfo.tabName.prdStatusAna} key="analysisPro">
                    <EditManageTrendForm ref={editManageTrendForm => { that.editManageTrendForm = editManageTrendForm }} loanBusinessDevpTrends={businessAnalysisData && businessAnalysisData.loanBusinessDevpTrends} />
                    {
                        businessAnalysisData && businessAnalysisData.loanBusinessProductDto ?
                            <EditManageTypeForm ref={editManageTypeForm => { that.editManageTypeForm = editManageTypeForm }} loanBusinessProductDto={businessAnalysisData.loanBusinessProductDto} len={businessAnalysisData.loanBusinessProductDto.loanBusinessMajorDtos ? businessAnalysisData.loanBusinessProductDto.loanBusinessMajorDtos.length : 1} />
                            : null
                    }
                </TabPane>,
            detailContent:
                <TabPane tab={topInfo.tabName.prdStatusAna} key="analysisPro">
                    <DetailBusAnalyse businessAnalysisData={businessAnalysisData} analysisClass={analysisClass} />
                </TabPane>,
            pdfContent: <div tab="生产情况分析" key="analysisPro">生产情况分析</div>
        },
        {
            name: '信贷历史',
            formEnName: "creditHis",
            type: ['6'],
            editContent:
                <TabPane tab={topInfo.tabName.creditHis} key="creditHis">
                    <EditCredit showPicture={that.showPicture} personCredit={personCredit} personCredit={personCredit} showExplainModal={that.showExplainModal} coborrowerCredit={coborrowerCredit} guaranteeCredit={guaranteeCredit} creditHisData={creditHisData} loanCoBorrower={guaranteeData ? guaranteeData.loanCoBorrower : ''} loanGuarantee={guaranteeData ? guaranteeData.loanGuarantee : ''} code={code} type={type} />
                    <DetailAssetBank creditCentralBankInfo={creditHisData && creditHisData.creditCentralBankInfo} />
                </TabPane>,
            detailContent:
                <TabPane tab={topInfo.tabName.creditHis} key="creditHis">
                    {
                        loanCreditHisData ?
                            <div>
                                <DetailCreditHisTmp showPicture={that.showPicture} loanCreditHisData={loanCreditHisData} personCredit={personCredit} showExplainModal={that.showExplainModal} closeExplainModal={that.closeExplainModals} coborrowerCredit={coborrowerCredit} guaranteeCredit={guaranteeCredit} type={type} />
                                <DetailAssetBank creditCentralBankInfo={loanCreditHisData.creditCentralBankInfo} />
                            </div>
                            :
                            null
                    }
                </TabPane>,
            pdfContent: <div key="creditHis">信贷历史</div>
        },
        {
            name: '信贷历史',
            formEnName: "creditHis",
            type: ['7', '8'],
            editContent:
                <TabPane tab={topInfo.tabName.creditHis} key="creditHis">
                    <EditCredit showPicture={that.showPicture} personCredit={personCredit} personCredit={personCredit} coborrowerCredit={coborrowerCredit} guaranteeCredit={guaranteeCredit} creditHisData={creditHisData} loanCoBorrower={guaranteeData ? guaranteeData.loanCoBorrower : ''} loanGuarantee={guaranteeData ? guaranteeData.loanGuarantee : ''} code={code} type={type} />
                </TabPane>,
            detailContent:
                <TabPane tab={topInfo.tabName.creditHis} key="creditHis">
                    {
                        loanCreditHisData ?
                            <DetailCreditHisTmp showPicture={that.showPicture} loanCreditHisData={loanCreditHisData} personCredit={personCredit} coborrowerCredit={coborrowerCredit} guaranteeCredit={guaranteeCredit} type={type} /> :
                            null
                    }
                </TabPane>,
            pdfContent: <div key="creditHis">信贷历史</div>
        },
        {
            name: '征信信息',
            formEnName: "creditQueryInfo",
            type: ['8'],
            editContent:
                <TabPane tab={topInfo.tabName.creditQueryInfo} key="creditHis">
                    <EditCredit showPicture={that.showPicture} personCredit={personCredit} showExplainModal={that.showExplainModal} personCredit={personCredit} coborrowerCredit={coborrowerCredit} guaranteeCredit={guaranteeCredit} creditHisData={creditHisData} loanCoBorrower={guaranteeData ? guaranteeData.loanCoBorrower : ''} loanGuarantee={guaranteeData ? guaranteeData.loanGuarantee : ''} code={code} type={type} />
                </TabPane>,
            detailContent:
                <TabPane tab={topInfo.tabName.creditQueryInfo} key="creditHis">
                    {
                        loanCreditHisData ?
                            <DetailCreditHis showPicture={that.showPicture} pictureInfo={pictureInfo} showExplainModal={that.showExplainModal} closeExplainModal={that.closeExplainModals} loanCreditHisData={loanCreditHisData} personCredit={personCredit} coborrowerCredit={coborrowerCredit} guaranteeCredit={guaranteeCredit} type={type} /> :
                            null
                    }
                </TabPane>,
            pdfContent: <div key="creditHis">征信信息</div>
        },
        {
            name: '共同借款人及担保人信息',
            formEnName: "coBorrowAndGuarantorInfo",
            type: ['8'],
            editContent:
                <TabPane tab={topInfo.tabName.coBorrowAndGuarantorInfo} key="comLoan">
                    {
                        guaranteeData && guaranteeData.loanCoBorrower ?
                            <EditComLoanForm ref={editComLoanForm => { that.editComLoanForm = editComLoanForm }} showExplainModal={that.showExplainModal} linkTo={that.linkTo} code={code} type={type} showPicture={that.showPicture} loanCoBorrower={guaranteeData.loanCoBorrower || {}} borrowerCredit={borrowerCredit} guaranteeCredit={guaranteeCredit} len={guaranteeData.loanCoBorrower ? guaranteeData.loanCoBorrower.length : 1} postIdentityVerify={that.postIdentityVerify} postCreditVerify={that.postCreditVerify} openUploadImg={that.openUploadImg} />
                            : null
                    }
                    {
                        guaranteeData && guaranteeData.loanGuarantee ?
                            <EditComGuaranForm ref={editComGuaranForm => { that.editComGuaranForm = editComGuaranForm }} showExplainModal={that.showExplainModal} linkTo={that.linkTo} code={code} type={type} showPicture={that.showPicture} loanGuarantee={guaranteeData.loanGuarantee || {}} guaranteeCredit={guaranteeCredit} len={guaranteeData.loanGuarantee ? guaranteeData.loanGuarantee.length : 1} postIdentityVerify={that.postIdentityVerify} postCreditVerify={that.postCreditVerify} openUploadImg={that.openUploadImg} />
                            : null
                    }
                </TabPane>,
            detailContent:
                <TabPane tab={topInfo.tabName.coBorrowAndGuarantorInfo} key="comLoan">
                    <DetailCoBoGua loanGuaranteeData={loanGuaranteeData} pictureInfo={pictureInfo} showPicture={that.showPicture} showExplainModal={that.showExplainModal} closeExplainModal={that.closeExplainModals} coborrowerCredit={coborrowerCredit} guaranteeCredit={guaranteeCredit} code={code} type={type} />
                </TabPane>,
            pdfContent: <div key="comLoan">共同借款人及担保人信息</div>
        },
        {
            name: '共同借款人及担保人信息',
            formEnName: "coBorrowAndGuarantorInfo",
            type: ['6', '7'],
            editContent:
                <TabPane tab={topInfo.tabName.coBorrowAndGuarantorInfo} key="comLoan">
                    {
                        guaranteeData && guaranteeData.loanCoBorrower ?
                            <EditComLoanFormTmp ref={editComLoanForm => { that.editComLoanForm = editComLoanForm }} showExplainModal={that.showExplainModal} linkTo={that.linkTo} code={code} type={type} showPicture={that.showPicture} loanCoBorrower={guaranteeData.loanCoBorrower || {}} borrowerCredit={borrowerCredit} guaranteeCredit={guaranteeCredit} len={guaranteeData.loanCoBorrower ? guaranteeData.loanCoBorrower.length : 1} postIdentityVerify={that.postIdentityVerify} postCreditVerify={that.postCreditVerify} openUploadImg={that.openUploadImg} />
                            : null
                    }
                    {
                        guaranteeData && guaranteeData.loanGuarantee ?
                            <EditComGuaranFormTmp ref={editComGuaranForm => { that.editComGuaranForm = editComGuaranForm }} showExplainModal={that.showExplainModal} linkTo={that.linkTo} code={code} type={type} showPicture={that.showPicture} loanGuarantee={guaranteeData.loanGuarantee || {}} guaranteeCredit={guaranteeCredit} len={guaranteeData.loanGuarantee ? guaranteeData.loanGuarantee.length : 1} postIdentityVerify={that.postIdentityVerify} postCreditVerify={that.postCreditVerify} openUploadImg={that.openUploadImg} />
                            : null
                    }
                </TabPane>,
            detailContent:
                <TabPane tab={topInfo.tabName.coBorrowAndGuarantorInfo} key="comLoan">
                    <DetailCoBoGuaTmp loanGuaranteeData={loanGuaranteeData} pictureInfo={pictureInfo} showPicture={that.showPicture} showExplainModal={that.showExplainModal} closeExplainModal={that.closeExplainModals} coborrowerCredit={coborrowerCredit} guaranteeCredit={guaranteeCredit} code={code} type={type} />
                </TabPane>,
            pdfContent: <div key="comLoan">共同借款人及担保人信息</div>
        },
        {
            name: '财务情况',
            formEnName: "financeInfo",
            type: ['6', '8'],
            editContent:
                <TabPane tab={topInfo.tabName.financeInfo} key="finance" className='finance-form'>
                    {
                        defaultTab == 1 ? <Link className='finance-detail' onClick={() => that.linkTo('/ipieces/edit/detail/' + code + '/' + type)}>录入详细报表</Link>
                            : null
                    }
                    <Tabs defaultActiveKey="1" className='finance-tabs' onChange={that.financeChange}>
                        <TabPane tab="资产负债表" key="1">
                            {
                                balance ?
                                    <EditFinanceBalanceForm ref={editFinanceBalanceForm => { that.editFinanceBalanceForm = editFinanceBalanceForm }} balance={balance} code={code} linkTo={that.linkTo} priceSum={priceSum} />
                                    : null
                            }
                        </TabPane>
                        <TabPane tab="损益表" key="2">
                            <EditFinanceIncomeForm ref={editFinanceIncomeForm => { that.editFinanceIncomeForm = editFinanceIncomeForm }} income={income} />
                        </TabPane>
                        <TabPane tab="现金流量表" key="3">
                            <EditFinanceCashForm ref={editFinanceCashForm => { that.editFinanceCashForm = editFinanceCashForm }} cash={cash} />
                        </TabPane>
                    </Tabs>
                </TabPane>,
            detailContent:
                <TabPane tab={topInfo.tabName.financeInfo} key="finance" className='finance-form'>
                    <Tabs defaultActiveKey="1" className='finance-tabs'>
                        <TabPane tab="资产负债表" key="1">
                            <DetailFinanceBalance balance={that.state.balance} />
                        </TabPane>
                        <TabPane tab="损益表" key="2">
                            <DetailFinanceIncome income={that.state.income} />
                        </TabPane>
                        <TabPane tab="现金流量表" key="3">
                            <DetailFinanceCash cash={that.state.cash} />
                        </TabPane>
                    </Tabs>
                </TabPane>,
            pdfContent: <div key="finance">财务情况</div>
        },
        {
            name: '财务情况',
            formEnName: "financeInfo",
            type: ['7'],
            editContent:
                <TabPane tab={topInfo.tabName.financeInfo} key="finance" className='finance-form'>
                    {
                        defaultTab == 2 ? <Link className='finance-detail' onClick={() => that.linkTo('/ipieces/edit/detail/' + code + '/' + type)}>录入详细报表</Link>
                            : null
                    }
                    {
                        farmBalance && farmIncome && farmCash ?
                            <Tabs defaultActiveKey={defaultTab} activeKey={defaultTab} className='finance-tabs' onChange={that.financeChange}>
                                <TabPane tab="资产负债表" key="1">
                                    <EditFarmBalanceForm ref={editFarmBalanceForm => { that.editFarmBalanceForm = editFarmBalanceForm }} farmBalance={farmBalance} code={code} linkTo={that.linkTo} />
                                </TabPane>
                                <TabPane tab="损益表" key="2">
                                    <EditFarmIncomeForm ref={editFarmIncomeForm => { that.editFarmIncomeForm = editFarmIncomeForm }} farmIncome={farmIncome} code={code} linkTo={that.linkTo} pushCome={that.pushCome} />
                                </TabPane>
                                <TabPane tab="现金流量表" key="3">
                                    <EditFarmCashForm ref={editFarmCashForm => { that.editFarmCashForm = editFarmCashForm }} farmCash={farmCash} pushCash={that.pushCash} />
                                </TabPane>
                            </Tabs> : null
                    }
                </TabPane>,
            detailContent:
                <TabPane tab={topInfo.tabName.financeInfo} key="finance" className='finance-form'>
                    <Tabs defaultActiveKey="1" className='finance-tabs'>
                        <TabPane tab="资产负债表" key="1">
                            <DetailFarmBalance balance={that.state.farmBalance} />
                        </TabPane>
                        <TabPane tab="损益表" key="2">
                            <DetailFarmIncome income={that.state.farmIncome} />
                        </TabPane>
                        <TabPane tab="现金流量表" key="3">
                            <DetailFarmCash cash={that.state.farmCash} />
                        </TabPane>
                    </Tabs>
                </TabPane>,
            pdfContent: <div key="finance">财务情况</div>
        },
        {
            name: '逻辑校验',
            formEnName: "logicVerify",
            type: ['6', '8'],
            editContent:
                <TabPane tab={topInfo.tabName.logicVerify} key="logic">
                    {
                        logicData ?
                            <EditLogicForm ref={editLogicForm => { that.editLogicForm = editLogicForm }} logicData={logicData} code={code} ipiecesType={type} linkTo={that.linkTo} />
                            : null
                    }
                </TabPane>,
            detailContent:
                <TabPane tab={topInfo.tabName.logicVerify} key="logic">
                    <DetailRightsDTO logicData={logicData} />
                </TabPane>,
            pdfContent: <div key="logic">逻辑校验</div>
        },
        {
            name: '资产信息',
            formEnName: "assetInfo",
            type: ['6', '7', '8'],
            editContent:
                <TabPane tab={topInfo.tabName.assetInfo} key="assets">
                    {
                        assetsData ?
                            <div>
                                <EditAssetHousesForm ref={editAssetHousesForm => { that.editAssetHousesForm = editAssetHousesForm }} homeAddr={baseData && baseData.loanCustomer && baseData.loanCustomer.homeAddr} code={code} loanAssetHouses={assetsData.loanAssetHouses} len={assetsData.loanAssetHouses ? assetsData.loanAssetHouses.length : 0} loanAssetInfoCost={that.loanAssetInfoCost} type={type} ssqList={ssqList} openUploadImg={that.openUploadImg} />
                                {
                                    type != 8 ?
                                        <EditAssetCarsForm ref={editAssetCarsForm => { that.editAssetCarsForm = editAssetCarsForm }} code={code} loanAssetCars={assetsData.loanAssetCars} len={assetsData.loanAssetCars ? assetsData.loanAssetCars.length : 0} loanAssetInfoCost={that.loanAssetInfoCost} openUploadImg={that.openUploadImg} /> : null
                                }
                                {
                                    type != 8 ?
                                        <EditAssetMachineForm ref={editAssetMachineForm => { that.editAssetMachineForm = editAssetMachineForm }} code={code} loanAssetMachines={assetsData.loanAssetMachines} len={assetsData.loanAssetMachines ? assetsData.loanAssetMachines.length : 0} loanAssetInfoCost={that.loanAssetInfoCost} openUploadImg={that.openUploadImg} /> : null
                                }
                            </div>
                            : null
                    }
                </TabPane>,
            detailContent:
                <TabPane tab={topInfo.tabName.assetInfo} key="assets">
                    {
                        assetsData ?
                            <DetailAssetHouse assetsData={assetsData} pictureInfo={pictureInfo} showPicture={that.showPicture} type={type} /> :
                            null
                    }
                </TabPane>,
            pdfContent: <div key="assets">资产信息</div>
        },
        {
            name: '软信息',
            formEnName: "softInfo",
            type: ['6', '8'],
            editContent:
                <TabPane tab={topInfo.tabName.softInfo} key="soft">
                    <EditSoftInfoForm ref={editSoftInfoForm => { that.editSoftInfoForm = editSoftInfoForm }} softInfo={softInfo} soft={soft} type={type} />
                </TabPane>,
            detailContent:
                <TabPane tab={topInfo.tabName.softInfo} key="soft">
                    {
                        sigleSoftInfo && softInfo ?
                            <DetailSoftInfo softInfo={softInfo} sigleSoftInfo={sigleSoftInfo} type={type} />
                            : null
                    }
                </TabPane>,
            pdfContent: <div key="soft">软信息</div>
        },
        {
            name: '软信息',
            formEnName: "softInfo",
            type: ['7'],
            editContent:
                <TabPane tab={topInfo.tabName.softInfo} key="soft">
                    <EditFarmSoftForm ref={editSoftInfoForm => { that.editSoftInfoForm = editSoftInfoForm }} softInfo={softInfo} soft={soft} type={type} />
                </TabPane>,
            detailContent:
                <TabPane tab={topInfo.tabName.softInfo} key="soft">
                    {
                        sigleSoftInfo && softInfo ?
                            <DetailFarmSoft softInfo={softInfo} sigleSoftInfo={sigleSoftInfo} type={type} />
                            : null
                    }
                </TabPane>,
            pdfContent: <div key="soft">软信息</div>
        }
    ].filter(item => {
        item.position = topInfo.tabEnName.findIndex(value => value == item.formEnName);
        return topInfo.tabEnName.includes(item.formEnName) && item.type.includes(type + '')
    }).sort((i1, i2) => i1.position - i2.position).map(item => item[typeContent]) : null
}
