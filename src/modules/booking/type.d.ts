export type TUserBookingConditionParamActionName =
    | 'Get_Leads_List_Api'
    | 'Get_Lead_Detail_By_LeadId_Api'
    | 'Accept_Lead_By_Vendor_Api'
    | 'Deny_Lead_By_Vendor_Api'
    | 'Complete_Lead_By_Vendor_Api'
    | 'FollowUp_Lead_By_Vendor_Api'
    | 'Get_Denied_Reason_List_Api'
    | 'Get_FollowUp_Reason_List_Api';

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

type TDenyLeadByVendorParam = {
    leadId: string;
    reason: string;
    amount: string;
    callBack: (success: boolean, message: string) => void;
};

type TCompleteLeadByVendorParam = {
    leadId: string;
    partsDesc: string;
    remarks: string;
    customerAmount: string;
    status?: string;
    reComplaintId?: string;
    callBack: (success: boolean, message: string) => void;
};

type TFollowUpLeadByVendorParam = {
    leadId: string;
    desc: string;
    nextDate: string;
    callBack: (success: boolean, message: string) => void;
};

type TGetDeniedReasonListParam = {
    callBack: (data: any[]) => void;
};

type TGetFollowUpReasonListParam = {
    callBack: (data: any[]) => void;
};

export type TUserBookingConditionParamActionParam<
    T extends TUserBookingConditionParamActionName,
> = T extends 'Get_Leads_List_Api'
    ? TUserGetLeadsListParam
    : T extends 'Get_Lead_Detail_By_LeadId_Api'
    ? TUserGetLeadDetailByLeadIdParam
    : T extends 'Accept_Lead_By_Vendor_Api'
    ? TAcceptLeadByVendorParam
    : T extends 'Deny_Lead_By_Vendor_Api'
    ? TDenyLeadByVendorParam
    : T extends 'Complete_Lead_By_Vendor_Api'
    ? TCompleteLeadByVendorParam
    : T extends 'FollowUp_Lead_By_Vendor_Api'
    ? TFollowUpLeadByVendorParam
    : T extends 'Get_Denied_Reason_List_Api'
    ? TGetDeniedReasonListParam
    : T extends 'Get_FollowUp_Reason_List_Api'
    ? TGetFollowUpReasonListParam
    : never;
