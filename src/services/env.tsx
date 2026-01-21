export const ENV: 'dev' | 'prod' = 'dev';

export const BASE_ENV = {
    dev: {
        API_HOST: 'https://testcrm.dooda.in/MyWebService.asmx/',
    },
    prod: {
        API_HOST: 'https://crm.dooda.in/MyWebService.asmx/',
    },
};

export const NEW_URL = 'https://testcrm.dooda.in/api';

export const BaseUrl = BASE_ENV[ENV].API_HOST;
export const Comp_State_ID = 8;

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
    getVendorDetailsByIDUrl: `${BaseUrl}GetVendorDetailsByID`,
    insertReComplaintCompletedByVendorUrl: `${BaseUrl}ReComplaintCompletedByVendor`,
    updateVendorProfileUrl: `${BaseUrl}UpdateVendorProfile`,
    mapCityListByVendorUrl: `${BaseUrl}MapCityListByVendor`,

    getAllTypeVendorBalanceUrl: `${NEW_URL}/get_all_type_vendor_balance`,
    getVendorLedgerWithOpeningBalanceUrl: `${NEW_URL}/vendor_ledger_with_opening_bal`,
    vendorRegistrationUrl: `${NEW_URL}/vendor_registration`,
    getDeniedReasonListUrl: `${NEW_URL}/denied_resion_list`,

    // PayUMoney endpoints (mock for now, replace with actual backend endpoints when available)
    initiatePaymentUrl: `${BaseUrl}InitiatePayment`, // Will generate payment hash on backend
    verifyPaymentUrl: `${BaseUrl}VerifyPayment`, // Will verify payment with PayUMoney
};

const projectEnv = {
    ...apiListing,
};

export default projectEnv;
