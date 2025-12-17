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
    walletBalanceUrl: `${BaseUrl}GetVendorBalance`,
};

const projectEnv = {
    ...apiListing,
};

export default projectEnv;
