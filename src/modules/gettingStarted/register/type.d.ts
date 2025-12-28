type TUserRegisterConditionParamActionName =
    | 'Get_Service_Types_Api'
    | 'Get_Country_List_Api'
    | 'Get_State_List_Api'
    | 'Get_City_List_Api';

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

type TUserRegisterConditionParamActionParam<
    T extends TUserRegisterConditionParamActionName,
> = T extends 'Get_Service_Types_Api'
    ? TUserGetServiceTypesParam
    : T extends 'Get_Country_List_Api'
    ? TUserGetCountryListParam
    : T extends 'Get_State_List_Api'
    ? TUserGetStateListParam
    : T extends 'Get_City_List_Api'
    ? TUserGetCityListParam
    : never;

