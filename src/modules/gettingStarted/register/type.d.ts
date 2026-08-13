export type TUserRegisterConditionParamActionName =
    | 'Get_Service_Types_Api'
    | 'Get_Country_List_Api'
    | 'Get_State_List_Api'
    | 'Get_City_List_Api'
    | 'Get_Vendor_Details_By_ID_Api'
    | 'Vendor_Registration_Api'
    | 'Update_Vendor_Profile_Api'
    | 'Map_City_List_By_Vendor_Api';

interface IUserRegisterActionConditionParam<
    T extends TUserRegisterConditionParamActionName,
> {
    type: 'Register_Actions';
    payload: {
        actionName: T;
        actionParam: TUserRegisterConditionParamActionParam<T>;
    };
}

type TUserGetServiceTypesParam = {
    callBack: (data: any[]) => void;
};

type TUserGetCountryListParam = {
    callBack: (data: any[]) => void;
};

type TUserGetStateListParam = {
    countryId: string | number;
    callBack: (data: any[]) => void;
};

type TUserGetCityListParam = {
    stateId: string | number;
    callBack: (data: any[]) => void;
};

// Vendor is derived from the JWT — no UserID in the request.
type TUserGetVendorDetailsByIDParam = {
    callBack: (data: any) => void;
};

type TUserVendorRegistrationParam = {
    data: any;
    callBack: (response: any) => void;
};

type TUserUpdateVendorProfileParam = {
    companyName: string;
    gstNo: string;
    mobileNo: string;
    address: string;
    callBack: (success: boolean, message?: string) => void;
};

type TServiceLocationMapping = {
    stateId: string | number;
    cityId: string | number;
};

type TUserMapCityListByVendorParam = {
    locations: TServiceLocationMapping[];
    callBack: (success: boolean, message?: string) => void;
};

export type TUserRegisterConditionParamActionParam<
    T extends TUserRegisterConditionParamActionName,
> = T extends 'Get_Service_Types_Api'
    ? TUserGetServiceTypesParam
    : T extends 'Get_Country_List_Api'
    ? TUserGetCountryListParam
    : T extends 'Get_State_List_Api'
    ? TUserGetStateListParam
    : T extends 'Get_City_List_Api'
    ? TUserGetCityListParam
    : T extends 'Get_Vendor_Details_By_ID_Api'
    ? TUserGetVendorDetailsByIDParam
    : T extends 'Vendor_Registration_Api'
    ? TUserVendorRegistrationParam
    : T extends 'Update_Vendor_Profile_Api'
    ? TUserUpdateVendorProfileParam
    : T extends 'Map_City_List_By_Vendor_Api'
    ? TUserMapCityListByVendorParam
    : never;

