export type TPartnerListActionName = 'GET_USER_LIST_BY_CITY_STATE_API';

export interface IPartnerListActionParam<T extends TPartnerListActionName> {
    type: 'PartnerList_Actions';
    payload: {
        actionName: T;
        actionParam: TPartnerListConditionParamActionParam<T>;
    };
}

export type TGetUserListByCityStateParam = {
    data: {
        StateID: string | number;
        CityID: string | number;
        ServiceType: string | number;
    };
    callBack?: (data: any[]) => void;
};

export type TPartnerListConditionParamActionParam<T extends TPartnerListActionName> =
    T extends 'GET_USER_LIST_BY_CITY_STATE_API'
    ? TGetUserListByCityStateParam
    : never;

export interface IPartnerListState {
    partnerList: any[];
    loading: boolean;
    hasSearched: boolean;
}
