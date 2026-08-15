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

// New REST API (JWT based). Endpoints being migrated off the ASMX/PHP services
// point here. See "Old ASMX method" migration doc.
export const REST_URL = {
    dev: {
        API_HOST: 'https://api.roexpertindia.com/api/mobile',
    },
    prod: {
        API_HOST: 'https://api.roexpertindia.com/api/mobile',
    },
};

export const BaseUrl = BASE_ENV[ENV].API_HOST;
export const NewBaseUrl = NEW_URL[ENV].API_HOST;
export const RestBaseUrl = REST_URL[ENV].API_HOST;
export const Comp_State_ID = 8;
export const APP_VERSION = '2.0';

const apiListing = {
    loginUrl: `${RestBaseUrl}/login`,
    // Migrated to new REST API (JWT). POST { email, password, FCMTokenID } -> { token, user }
    loginUrlPartner: `${RestBaseUrl}/partner/login`,
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

    // ---- New REST API (JWT, HTTP-status based). Migration in progress. ----
    // Dashboard module. Same field names as the old responses, but returned as
    // plain JSON in the body (no `.d` / `{status,data}` wrapper) and success is
    // signalled by the HTTP status code.
    vendorBalanceRestUrl: `${RestBaseUrl}/vendor/balance`,
    vendorSecurityDepositRestUrl: `${RestBaseUrl}/vendor/security-deposit`,
    vendorAllTypeBalanceRestUrl: `${RestBaseUrl}/vendor/all-type-balance`,
    vendorOngoingLeadsRestUrl: `${RestBaseUrl}/vendor/leads/ongoing`,
    // GET `/{leadId}` for the detail. The booking actions live underneath it:
    // POST `/{leadId}/accept|deny|complete|follow-up|recomplaint-complete`.
    vendorLeadDetailRestUrl: `${RestBaseUrl}/vendor/lead`,
    vendorWorkReportRestUrl: `${RestBaseUrl}/vendor/work-report`, // ?from=&to=
    appVersionRestUrl: `${RestBaseUrl}/app-version`,
    // Anon. POST { mobileNo } -> 2xx, SMS sent to the registered mobile.
    forgotPasswordRestUrl: `${RestBaseUrl}/forgot-password`,

    // ---- Sign-up / register module (anon, HTTP-status based). ----
    serviceTypesRestUrl: `${RestBaseUrl}/service-types`,
    countriesRestUrl: `${RestBaseUrl}/countries`,
    statesRestUrl: `${RestBaseUrl}/states`, // ?countryId=
    citiesRestUrl: `${RestBaseUrl}/cities`, // ?stateId=
    vendorRegistrationRestUrl: `${RestBaseUrl}/vendor-registration`,

    // ---- Wallet module (JWT, HTTP-status based). User derived from token. ----
    // Balance reuses `vendorBalanceRestUrl` (GET /vendor/balance).
    // Insert security deposit reuses `vendorSecurityDepositRestUrl` (POST /vendor/security-deposit).
    vendorMinRechargeRestUrl: `${RestBaseUrl}/vendor/min-recharge`,
    vendorRechargeRestUrl: `${RestBaseUrl}/vendor/recharge`,
    vendorRechargeDetailsRestUrl: `${RestBaseUrl}/vendor/recharge-details`, // ?from=&to=
    vendorPayuHashRestUrl: `${RestBaseUrl}/vendor/payu-hash`,
    razorpayOrderRestUrl: `${RestBaseUrl}/vendor/razorpay/order`,
    razorpayVerifyRestUrl: `${RestBaseUrl}/vendor/razorpay/verify`,

    // ---- Profile module (JWT, HTTP-status based). User derived from token. ----
    // GET  -> vendor profile details, PUT -> update the editable fields.
    vendorProfileRestUrl: `${RestBaseUrl}/vendor/profile`,
    // POST { locations: [{ stateId, cityId }] } -> replaces the vendor's
    // mapped service locations (was the `jsonString` MapCityListByVendor call).
    vendorServiceLocationsRestUrl: `${RestBaseUrl}/vendor/service-locations`,

    // ---- More section (JWT, HTTP-status based). User derived from token. ----
    // POST { oldPassword, newPassword } -> 2xx; 401 = wrong current password.
    changePasswordRestUrl: `${RestBaseUrl}/vendor/change-password`,
    // Report screen. Vendors use `vendorWorkReportRestUrl`; admins use this one.
    adminWorkReportRestUrl: `${RestBaseUrl}/admin/work-report`, // ?from=&to=
    // Tax invoice. GET ?month=&year= -> { HeadTable, ... } (same shape as before).
    vendorInvoiceRestUrl: `${RestBaseUrl}/vendor/invoice`,
    // Document verification. GET -> upload statuses, POST -> upload/replace.
    vendorDocumentsRestUrl: `${RestBaseUrl}/vendor/document-status`,
    //Document Upload
    vendorDocumentUploadRestUrl: `${RestBaseUrl}/vendor/document-update`,

    // ---- Booking module (JWT, HTTP-status based). User derived from token. ----
    // One list endpoint per tab; "Ongoing" reuses `vendorOngoingLeadsRestUrl`.
    vendorNewLeadsRestUrl: `${RestBaseUrl}/vendor/leads/new`,
    vendorFollowUpLeadsRestUrl: `${RestBaseUrl}/vendor/leads/followup`,
    vendorDeniedLeadsRestUrl: `${RestBaseUrl}/vendor/leads/denied`,
    vendorCompletedLeadsRestUrl: `${RestBaseUrl}/vendor/leads/completed`,
    vendorComplaintLeadsRestUrl: `${RestBaseUrl}/vendor/leads/recomplaint`,
    // Master data for the deny / follow-up sheets. Bodies are the arrays
    // directly (no stringified JSON payload as in the old PHP endpoints).
    deniedReasonsRestUrl: `${RestBaseUrl}/denied-reasons`,
    followUpReasonsRestUrl: `${RestBaseUrl}/followup-reasons`,

    // ---- Admin section (JWT, HTTP-status based). Admin from the token. ----
    adminLeadsRestUrl: `${RestBaseUrl}/admin/leads`, // ?from=&to=
    adminLeadHistoryRestUrl: `${RestBaseUrl}/admin/lead-history`, // ?leadNo=&mobileNo=
    adminPartnersRestUrl: `${RestBaseUrl}/admin/partners`, // ?stateId=&cityId=&serviceType=
    // Admin work report lives above as `adminWorkReportRestUrl`.
};

const projectEnv = {
    ...apiListing,
};

export default projectEnv;
