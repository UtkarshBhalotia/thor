export type TLeadHistoryActionName =
    | 'Get_Lead_History_Api';

export interface ILeadHistoryActionParam<T extends TLeadHistoryActionName> {
    type: 'LeadHistory_Actions';
    payload: {
        actionName: T;
        actionParam: T extends 'Get_Lead_History_Api' ? TGetLeadHistoryParam : never;
    };
}

export type TGetLeadHistoryParam = {
    data: {
        LeadNo: string;
        MobileNo: string;
    };
    callBack: (data: any) => void;
};

export interface ILeadHistoryState {
    historyList: any[];
    loading: boolean;
    hasSearched: boolean;
}
