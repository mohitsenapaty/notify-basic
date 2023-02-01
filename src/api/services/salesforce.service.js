const {
  map, reduce, has, keys, includes, assign,
} = require('lodash');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const constants = require('../utils/constants');
const { logger } = require('../../config/logger');

exports.send = async ({
  endpoint, key, password, message, custom, correlationid,
}) => {
  assign(custom, { correlationid });

  const requestPayload = getRequestPayload(custom, constants, message);

  const options = {
    method: 'POST',
    url: `${endpoint}${includes(keys(constants.caseCreation.partReleaseAttributes), custom.processType) ? '/api/v1/ticket/partrelease' : '/api/v1/ticket/create'}`,
    auth: {
      username: key,
      password,
    },
    data: requestPayload,
    json: true,
  };

  logger.info(`creating ticket with details : ${JSON.stringify(options)}`);
  const response = await axios(options);

  return {
    trackingid: response.data.data.id || map(response.data.data.results, 'id').toString(),
  };
};

exports.details = async ({
  endpoint, password, key, trackingid,
}) => {
  const options = {
    method: 'GET',
    url: `${endpoint}/api/v1/ticket/${trackingid}`,
    auth: {
      username: key,
      password,
    },
  };
  const response = await axios(options);
  if (response.data) {
    return {
      status: 'success',
    };
  }
  return {
    status: 'pending',
  };
};

// eslint-disable-next-line consistent-return
const getRequestPayload = (data, constantData, message) => {
  if (data.processType === constantData.caseCreation.fullRelease.key) {
    return getReleasePayload(data, constantData);
  }
  if (data.processType === constantData.caseCreation.renewal.key) {
    return getRenewalPayload(data, constantData, message);
  }
  if (data.processType === constantData.caseCreation.loanEnhancement.key) {
    return getLoanEnhancementPayload(data, constantData, message);
  }
  if (has(constantData.caseCreation.partReleaseAttributes, data.processType)) {
    return getPartPaymentPayload(data, constantData);
  }
};

const getReleasePayload = (data, constantData) => ({
  records: [
    {
      attributes: {
        type: constantData.caseCreation[data.processType].attributeType,
        referenceId: uuidv4(),
      },
      Loan_Type__c: data.loanType,
      Lead_Id__c: data.leadId,
      Customer_Rupeek_Id__c: data.customerId,
      SuppliedPhone: data.customerPhone,
      Lender_Id__c: data.lenderId,
      Branch_Id__c: data.branchId,
      Lender_Name__c: data.lenderName,
      Branch_Name__c: data.lenderBranch,
      Case_Tag__c: data.caseTag,
      Loan_Reference_Number__c: data.LoanReferenceId,
      City__c: data.city,
      City_Id__c: data.cityId,
      Pincode__c: data.pincode,
      Release_Loan_Amount__c: reduce(data.releaseamountdata, (sum, n) => sum + n.paidsecuredcomponent + n.paidunsecuredcomponent, 0), // eslint-disable-line max-len
      Total_Release_Amount__c: data.totalReleaseAmount,
      Release_Amount_with_Cashback__c: ((data.securedReleaseAmountWithCashback || 0) + (data.unsecuredReleaseAmountWithCashback || 0)), // eslint-disable-line max-len
      ...(data.lmsId && data.lmsId.length && {
        Loan_Lender_Id__c: data.lmsId.toString(),
      }),
      Address_Latitude__c: data.latitude,
      Address_Longitude__c: data.longitude,
      ...(data.loanId && data.loanId.length && {
        Loan_Id__c: data.loanId.toString(),
      }),
      Origin: constantData.caseCreation[data.processType].origin,
      Category_1__c: constantData.caseCreation[data.processType].category1,
      Category_2__c: constantData.caseCreation[data.processType].category2,
      Status: constantData.caseCreation[data.processType].category2,
      Product_category__c: data.productCategory,
      Record_Type__c: constantData.caseCreation[data.processType].recordType,
      Transaction_Id__c: data.transactionId,
      General_Ledger__r: {
        records: map(data.releaseamountdata, (payment) => ({
          attributes: {
            type: constantData.caseCreation[data.processType].ledgerAttributeType,
            referenceId: uuidv4(),
          },
          Secured_Release_Amount__c: payment.securedReleaseAmountWithCashback,
          Unsecured_Release_Amount__c: payment.unsecuredReleaseAmountWithCashback,
          Secured_GL_Number__c: payment.secured_gl_no,
          Unsecured_GL_Number__c: payment.unsecured_gl_no,
          Old_GL__c: true,
        })),
      },
      ...(data.productCategory === 'Gold Loan' && { Payment_Id__c: data.paymentRequestId || data.correlationid }),
    },
  ],
});

const getRenewalPayload = (data, constantData, message) => {
  const caseCreationConstants = constantData.caseCreation[data.processType];

  return {
    records: [
      {
        attributes: {
          type: caseCreationConstants.attributeType,
          referenceId: uuidv4(),
        },
        Status: caseCreationConstants.status[data.signingStatus],
        // eslint-disable-next-line max-len
        ...(data.orderAutomationState && { Order_Automation_State__c: caseCreationConstants.orderAutomationState[data.orderAutomationState] }),
        Origin: caseCreationConstants.origin,
        Category_1__c: caseCreationConstants.category1,
        Category_2__c: caseCreationConstants.status[data.signingStatus],
        Record_Type__c: caseCreationConstants.recordType[data.signingStatus],
        Customer_Rupeek_Id__c: data.customerId,
        SuppliedPhone: data.customerPhone,
        Lender_Id__c: data.lenderId,
        Branch_Id__c: data.branchId,
        Lender_Name__c: data.lenderName,
        Branch_Name__c: data.lenderBranch,
        City__c: data.city,
        Loan_Id__c: data.loanId.join(', '),
        Loan_Lender_Id__c: data.lmsId.join(', '),
        Order_Id__c: data.orderId,
        HTML_Details__c: message,
        Loan_Type__c: '',
        Digital_Sign_Status__c: data.signingStatus,
        Digital_Sign_Type__c: data.signingType,
        Digital_Sign_Timestamp__c: data.signingTime,
        General_Ledger__r: {
          records: map(data.general_ledger, (record) => ({
            attributes: {
              type: caseCreationConstants.ledgerAttributeType,
              referenceId: uuidv4(),
            },
            Secured_Loan_Amount__c: record.securedLoanAmount,
            Unsecured_Loan_Amount__c: record.unsecuredLoanAmount,
            Secured_GL_Number__c: record.securedLoanId,
            Unsecured_GL_Number__c: record.unsecuredLoanId,
            Old_GL__c: true,
          })),
        },
      },
    ],
  };
};

const getLoanEnhancementPayload = (data, constantData, message) => {
  let pennyTestingStatus = null;
  if (data && data.bankAccount && data.bankAccount.pennyTestingStatus) {
    // eslint-disable-next-line max-len
    pennyTestingStatus = constants.caseCreation[data.processType].pennyTestingStatus[data.bankAccount.pennyTestingStatus];
  }

  let otpConsentStatus = null;
  if (data && data.bankAccount && data.bankAccount.otpConsentStatus) {
    // eslint-disable-next-line max-len
    otpConsentStatus = constants.caseCreation[data.processType].otpConsentStatus[data.bankAccount.otpConsentStatus];
  }

  return {
    records: [
      {
        attributes: {
          type: constantData.caseCreation[data.processType].attributeType,
          referenceId: uuidv4(),
        },
        Status: constantData.caseCreation[data.processType].status[data.loanEnhancementStatus],
        Origin: constantData.caseCreation[data.processType].origin,
        Category_1__c: constantData.caseCreation[data.processType].category1,
        Category_2__c: constantData.caseCreation[data.processType].status[data.loanEnhancementStatus], // eslint-disable-line max-len
        Record_Type__c: constantData.caseCreation[data.processType].recordType[data.loanEnhancementStatus], // eslint-disable-line max-len
        Customer_Rupeek_Id__c: data.customerId,
        SuppliedPhone: data.customerPhone,
        Lender_Id__c: data.lenderId,
        Branch_Id__c: data.branchId,
        Lender_Name__c: data.lenderName,
        Branch_Name__c: data.lenderBranch,
        Loan_Lender_Id__c: data.lmsId.join(', '),
        Loan_Id__c: data.loanId.join(', '),
        Order_Id__c: data.orderId,
        Loan_Type__c: '',
        HTML_Details__c: message,
        Penny_Testing_Status__c: pennyTestingStatus,
        ...(otpConsentStatus && {
          OTP_Consent_Status__c: otpConsentStatus,
        }),
        Digital_Sign_Type__c: data.signingType,
        Digital_Sign_Status__c: data.signingStatus,
        ...(data.bankAccount && data.bankAccount.accountNumber && {
          Account_Number__c: data.bankAccount.accountNumber,
          IFSC_Code__c: data.bankAccount.ifsc,
          Bank_Name__c: data.bankAccount.bankName,
          OTP_Consent_Attempts__c: data.bankAccount.otpConsentAttempts,
          OTP_Timestamp__c: data.bankAccount.otpTimestamp,
          Account_Entry_Attempts__c: data.bankAccount.accountEntryAttempts,
          Account_Entry_Timestamp__c: data.bankAccount.accountEntryTimestamp,
        }),
        City__c: data.city,
        Digital_Sign_Timestamp__c: data.signingTime,
        General_Ledger__r: {
          records: map(data.general_ledger, (record) => ({
            attributes: {
              type: constantData.caseCreation[data.processType].ledgerAttributeType,
              referenceId: uuidv4(),
            },
            Secured_Loan_Amount__c: record.securedLoanAmount,
            Unsecured_Loan_Amount__c: record.unsecuredLoanAmount,
            Secured_GL_Number__c: record.securedLoanId,
            Unsecured_GL_Number__c: record.unsecuredLoanId,
            Old_GL__c: true,
          })),
        },
      },
    ],
  };
};

/**
 * creates a payload for Part Release case
 */
const getPartPaymentPayload = (data, constantData) => ({
  LeadId: data.leadId,
  LoanType: data.loanType,
  CustomerRupeekId: data.customerRupeekId,
  SuppliedPhone: data.suppliedPhone,
  LenderId: data.lenderId,
  LenderName: data.lenderName,
  LoanTransactionId: data.loanTransactionId,
  LoanReferenceId: data.loanReferenceId,
  BranchId: data.branchId,
  BranchName: data.branchName,
  City: data.city,
  CityId: data.cityId,
  Pincode: data.pincode,
  AddressLatitude: data.addressLatitude,
  AddressLongitude: data.addressLongitude,
  LoanId: data.loanId,
  OldGL: data.oldGL,
  ProductCategory: data.productCategory,
  Origin: data.productCategory === 'Gold Loan' ? constantData.caseCreation.partReleaseAttributes[data.processType].origin : constantData.caseCreation.partReleaseAttributes[data.processType].rupeekQuick.origin,
  Category1: data.productCategory === 'Gold Loan' ? constantData.caseCreation.partReleaseAttributes[data.processType].category1 : constantData.caseCreation.partReleaseAttributes[data.processType].rupeekQuick.category1,
  Category2: data.productCategory === 'Gold Loan' ? constantData.caseCreation.partReleaseAttributes[data.processType].category2 : constantData.caseCreation.partReleaseAttributes[data.processType].rupeekQuick.category2,
  Status: data.productCategory === 'Gold Loan' ? constantData.caseCreation.partReleaseAttributes[data.processType].status : constantData.caseCreation.partReleaseAttributes[data.processType].rupeekQuick.status,
  RecordType: data.productCategory === 'Gold Loan' ? constantData.caseCreation.partReleaseAttributes[data.processType].recordType : constantData.caseCreation.partReleaseAttributes[data.processType].rupeekQuick.recordType,
  IsJewelExport: data.isJewelExport || false,
  ReleaseAmountWithCashback: data.releaseAmountWithCashback,
  SecureLoanAmount: data.secureLoanAmount,
  UnsecureLoanAmount: data.unsecureLoanAmount,
  ...(data.isJewelExport && {
    PartReleaseWeight: data.partReleaseWeight,
    FreshLoanAmount: data.newLoanAmount,
    ComputedSecuredFreshLoanAmount: data.computedSecuredFreshLoanAmount,
    ComputedUnsecuredFreshLoanAmount: data.computedUnsecuredFreshLoanAmount,
    newSchemeType: data.newSchemeType,
    computedTotalPartReleaseAmount: data.computedTotalPartReleaseAmount,
    computedSecuredPartReleaseAmount: data.computedSecuredPartReleaseAmount,
    computedUnsecuredPartReleaseAmount: data.computedUnsecuredPartReleaseAmount,
    newLenderId: data.newLenderId,
    newLenderName: data.newLenderName,
    newBranchId: data.newBranchId,
    newBranchName: data.newBranchName,
  }),
  CaseTag: data.caseTag,
  CaseType: data.caseType,
  TotalWeight: data.totalWeight,
  SecureGLNumber: data.secureGL,
  UnsecureGLNumber: data.unsecureGL,
  SecureReleaseAmount: data.secureReleaseAmount,
  SecureCashback: data.secureCashback,
  UnsecureReleaseAmount: data.unsecureReleaseAmount,
  UnsecureCashback: data.unsecureCashback,
  Payment: data.paymentDetails ? map(data.paymentDetails, (payments) => ({
    SecurePartPaymentAmount: payments.securePartPaymentAmount,
    UnsecurePartPaymentAmount: payments.unsecurePartPaymentAmount,
    TotalPartPaymentAmountPaid: payments.totalPartPaymentAmountPaid,
    SecurePartPaymentAmountWithCashback: payments.securePartPaymentAmountWithCashback,
    UnsecurePartPaymentAmountWithCashback: payments.unsecurePartPaymentAmountWithCashback,
    TotalPartPaymentCashBack: payments.totalPartPaymentCashBack,
    PaymentTransactionId: payments.rpkId,
    PaymentDateTime: payments.paidAt,
  })) : [],
});
