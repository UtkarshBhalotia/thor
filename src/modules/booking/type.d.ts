type TUserBookingConditionParamActionName = 'Get_Leads_List_Api' | 'Get_Lead_Detail_By_LeadId_Api' | 'Accept_Lead_By_Vendor_Api';

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

type TUserGetLeadDetailByLeadIdParam = {
    leadId: string;
    callBack: (data: any) => void;
};

type TAcceptLeadByVendorParam = {
    leadId: string;
    amount: string;
    callBack: (success: boolean, message: string) => void;
};

type TUserBookingConditionParamActionParam<T extends TUserBookingConditionParamActionName> =
    T extends 'Get_Leads_List_Api' ? TUserGetLeadsListParam :
    T extends 'Get_Lead_Detail_By_LeadId_Api' ? TUserGetLeadDetailByLeadIdParam :
    T extends 'Accept_Lead_By_Vendor_Api' ? TAcceptLeadByVendorParam :
    never;
