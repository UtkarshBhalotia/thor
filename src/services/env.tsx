export const ENV: 'dev' | 'prod' = 'dev';

export const BASE_ENV = {
    dev: {
        API_HOST: 'https://testcrm.dooda.in/MyWebService.asmx/',
    },
    prod: {
        API_HOST: 'https://crm.dooda.in/MyWebService.asmx/',
    },
};

export const NEW_URL = {
    dev: {
        API_HOST: 'https://testcrm.dooda.in/api',
    },
    prod: {
        API_HOST: 'https://crm.dooda.in/api',
    },
};

export const BaseUrl = BASE_ENV[ENV].API_HOST;
export const NewBaseUrl = NEW_URL[ENV].API_HOST;
export const Comp_State_ID = 8;
export const APP_VERSION = '2.1';

const apiListing = {
    loginUrl: `${BaseUrl}ValidateMobileUser`,
    loginUrlPartner: `${BaseUrl}ValidateMobileUserPartner`,
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
    getVendorAppCompatibilityVersionUrl: `${BaseUrl}VendorAppCompatibilityVersion`,

    getAllTypeVendorBalanceUrl: `${NewBaseUrl}/get_all_type_vendor_balance`,
    getVendorLedgerWithOpeningBalanceUrl: `${NewBaseUrl}/vendor_ledger_with_opening_bal`,
    vendorRegistrationUrl: `${NewBaseUrl}/vendor_registration`,
    getDeniedReasonListUrl: `${NewBaseUrl}/denied_resion_list`,
    generate_hashkey_for_rechargeUrl: `${NewBaseUrl}/generate_hashkey_for_recharge`,
    vendor_douments_statusUrl: `${NewBaseUrl}/vendor_douments_status`,
    getFollowupReasonListUrl: `${NewBaseUrl}/followup_resion_list`,
    vendor_document_updateUrl: `${NewBaseUrl}/vendor_document_update`,
    getVendorRechargeDetailsUrl: `${NewBaseUrl}/get_vendor_recharge_details`,

    // PayUMoney endpoints (mock for now, replace with actual backend endpoints when available)
    initiatePaymentUrl: `${BaseUrl}InitiatePayment`, // Will generate payment hash on backend
    verifyPaymentUrl: `${BaseUrl}VerifyPayment`, // Will verify payment with PayUMoney

    getAllLeadListUrl: `${BaseUrl}GetAllLeadList`,
    getLeadHistoryDetUrl: `${BaseUrl}GetLeadHistory`,
    getWorkReportForAdminUrl: `${BaseUrl}GetWorkReportForAdmin`,
    getUserListByCityAndStateUrl: `${BaseUrl}GetUserListByCityAndState`,
    getInvoiceDetailsUrl: `${BaseUrl}GetInvoiceDetailsForApp`,

    // RazorPay new API's
    createOrderIDUrl: `${NewBaseUrl}/create_orderid_for_razorpay`,
    verifySignatureUrl: `${NewBaseUrl}/verify_signature_from_razorpay`,
};

const projectEnv = {
    ...apiListing,
};

export default projectEnv;
