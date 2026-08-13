/**
 * Id Verification Module Types
 */

export type TIdVerificationConditionParamActionName =
    | 'Get_Document_Status_Api'
    | 'Upload_Document_Api';

export interface IUploadDocumentParam {
    data: any;
    callBack: (success: boolean, message?: string) => void;
}

export interface IIdVerificationActionConditionParam<
    T extends TIdVerificationConditionParamActionName,
> {
    type: 'IdVerification_Actions';
    payload: {
        actionName: T;
        actionParam: TIdVerificationConditionParamActionParam<T>;
    };
}

export type TGetDocumentStatusParam = {
    callBack: (data: IDocumentStatusItem[] | null) => void;
};

export type TIdVerificationConditionParamActionParam<T extends TIdVerificationConditionParamActionName> =
    T extends 'Get_Document_Status_Api' ? TGetDocumentStatusParam :
    never;

export interface IDocumentStatusItem {
    DocumentID: string;
    DocumentName: string;
    DocumentStatus: string; // 'Verified', 'Pending', 'Rejected'
    DocumentType: string; // 'DL' | 'PAN' | 'AADHAAR'
    SubmittedDate: string;
    VerifiedDate?: string;
    Remarks?: string;
}

export interface IDocumentStatusResponse {
    UserID: number;
    AadharStatus: string;
    GSTStatus: string;
    PANStatus: string;
}

// State interface
export interface IIdVerificationState {
    documents: IDocumentStatusItem[] | null;
    loading: boolean;
    error: string | null;
}

