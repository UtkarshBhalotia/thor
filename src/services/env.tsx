export const ENV: 'dev' | 'prod' = 'dev';

export const BASE_ENV = {
    dev: {
        API_HOST: 'http://103.13.114.225/MyWebService.asmx/',
    },
    prod: {
        API_HOST: 'https://crm.dooda.in/MyWebService.asmx/',
    },
};

export const NEW_URL = 'http://103.13.114.225/api/'

export const BaseUrl = BASE_ENV[ENV].API_HOST;

const apiListing = {
    loginUrl: `${BaseUrl}ValidateMobileUser`,
    registerUrl: `${BaseUrl}InsertUserMaster`,
    getStateListUrl: `${BaseUrl}GetAllActiveStateList`,
    getCityListUrl: `${BaseUrl}GetAllActiveCityList`,
    getAllCountryListUrl: `${BaseUrl}GetAllCountryList`,
    getAllServiceTypeListUrl: `${BaseUrl}GetAllActiveServiceTypeList`,
    walletBalanceUrl: `${BaseUrl}GetVendorBalance`,
    totalSecurityDepositUrl: `${BaseUrl}GetTotalSecurityDepositeByVendorID`,
    getAllOngoingLeadForVendorUrl: `${BaseUrl}GetAllOngoingLeadForVendor`,
    getAllRechargeListForVendorUrl: `${BaseUrl}GetAllRechargeListForVendor`,
    getAllNewLeadForVendorUrl: `${BaseUrl}GetAllNewLeadForVendor`,
    getAllFollowUpLeadForVendorUrl: `${BaseUrl}GetAllFollowupLeadForVendor`,
    getAllDeniedLeadForVendorUrl: `${BaseUrl}GetAllDeniedLeadForVendor`,
    getAllCompletedLeadForVendorUrl: `${BaseUrl}GetAllCompletedLeadForVendor`,
    getAllComplaintLeadForVendorUrl: `${BaseUrl}GetAllReComplaintLeadForVendor`,
    forgotPasswordUrl: `${BaseUrl}ForgotPasswordForVendor`,
    getReportForVendorUrl: `${BaseUrl}GetWorkReportForVendor`,
    getLeadDetailByLeadIdForVendorUrl: `${BaseUrl}GetLeadDetailsByLeadIDForVendor`,
    acceptLeadByVendorUrl: `${BaseUrl}AcceptLeadByVendor`,
    insertRechargeDetailsUrl: `${BaseUrl}InsertRechargeDetails`,
    insertSecurityDepositUrl: `${BaseUrl}InsertSecurityDetails`,
    UpdateUserPasswordUrl: `${BaseUrl}UpdateUserPassword`,
    insertLeadCompletedByVendorUrl: `${BaseUrl}LeadCompletedByVendor`,
    insertLeadFollowUpByVendorUrl: `${BaseUrl}InsertFollowupLeadByVendor`,
    insertLeadDeniedByVendorUrl: `${BaseUrl}LeadDeniedByVendor`,
    getVendorMinRechargeAmtUrl: `${BaseUrl}GetVendorMinRechargeAmt`,

    getAllTypeVendorBalanceUrl: `${NEW_URL}/get_all_type_vendor_balance`,
    getVendorLedgerWithOpeningBalanceUrl: `${NEW_URL}/vendor_ledger_with_opening_balance`,


    // PayUMoney endpoints (mock for now, replace with actual backend endpoints when available)
    initiatePaymentUrl: `${BaseUrl}InitiatePayment`, // Will generate payment hash on backend
    verifyPaymentUrl: `${BaseUrl}VerifyPayment`, // Will verify payment with PayUMoney
};

const projectEnv = {
    ...apiListing,
};

export default projectEnv;
