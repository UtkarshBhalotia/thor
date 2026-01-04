export type TReportConditionParamActionName = 'Get_Work_Report_For_Vendor_Api';

export interface IReportActionConditionParam<
    T extends TReportConditionParamActionName,
> {
    type: 'Report_Actions';
    payload: {
        actionName: T;
        actionParam: TReportConditionParamActionParam<T>;
    };
}

export type TReportData = {
    ongoing: number;
    denied: number;
    completed: number;
    follow: number;
    reCompleted: number;
    reComplaint: number;
    totalRevenue: number;
};

export type TUserGetWorkReportForVendorParam = {
    fromDate: string;
    toDate: string;
    callBack: (data: TReportData) => void;
};

export type TReportConditionParamActionParam<
    T extends TReportConditionParamActionName,
> = T extends 'Get_Work_Report_For_Vendor_Api'
    ? TUserGetWorkReportForVendorParam
    : never;

export interface IResponseParam {
    body: any;
    status: number;
    message: string;
    data: any;
}
