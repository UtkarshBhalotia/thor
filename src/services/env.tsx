export const ENV: 'dev' | 'prod' = 'prod';

export const BASE_ENV = {
    dev: {
        API_HOST: 'https://crm.dooda.in/MyWebService.asmx/',
    },
    prod: {
        API_HOST: 'https://serviceondoors.com/MyWebService.asmx/',
    },
};

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
};

const projectEnv = {
    ...apiListing,
};

export default projectEnv;
