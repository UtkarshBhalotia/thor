type TUserBookingConditionParamActionName = 'Get_Leads_List_Api';

interface IUserBookingActionConditionParam<
    T extends TUserBookingConditionParamActionName,
> {
    type: 'Leads_Actions';
    payload: {
        actionName: T;
        actionParam: TUserBookingConditionParamActionParam<T>;
    };
}

type TUserGetLeadsListParam = {
    status: string;
    callBack: (data: any) => void;
};

type TUserBookingConditionParamActionParam<T extends TUserBookingConditionParamActionName> =
    T extends 'Get_Leads_List_Api' ? TUserGetLeadsListParam :
    never;
