import { call, select } from 'redux-saga/effects';
import { clientRestHandler } from '../../services/request';
import { RootState } from '../../../store';
import projectEnv from '../../services/env';
import { showToast } from '../../utils/common';
import {
    TIdVerificationConditionParamActionName,
    IIdVerificationActionConditionParam,
    TGetDocumentStatusParam,
    IDocumentStatusItem,
    IUploadDocumentParam,
} from './type';
import { IResponseParam } from '../dashboard/type';

export function* conditionActions<
    T extends TIdVerificationConditionParamActionName,
>(param: IIdVerificationActionConditionParam<T>) {
    const {
        payload: { actionName, actionParam },
    } = param;
    switch (actionName) {
        case 'Get_Document_Status_Api':
            yield call(
                Get_Document_Status_Api,
                actionParam as TGetDocumentStatusParam,
            );
            break;
        case 'Upload_Document_Api':
            yield call(Upload_Document_Api, actionParam as any);
            break;
    }
}

function* Get_Document_Status_Api(actionParam: TGetDocumentStatusParam) {
    try {
        const GlobalState: IGlobalInitialState = yield select(
            (state: RootState) => state.globalState,
        );

        // New REST API: GET /vendor/documents (JWT; vendor from the token).
        const response: IResponseParam = yield call(clientRestHandler, {
            url: projectEnv.vendorDocumentsRestUrl,
            method: 'GET',
        });

        yield Get_Document_Status_Api_Response(
            response,
            actionParam.callBack,
            GlobalState.gstNo,
        );
    } catch (error) {
        showToast({
            type: 'error',
            text1: 'Failed to fetch document status',
            visibilityTime: 2000,
        });
        actionParam.callBack([]);
    }
}

function* Get_Document_Status_Api_Response(
    response: IResponseParam,
    callBack: (data: IDocumentStatusItem[]) => void,
    gstNo?: string,
) {
    try {
        let documents: IDocumentStatusItem[] = [];

        const defaultStatus = 'Not Uploaded';

        // Define the structure of documents we expect
        let docTypes = [
            {
                key: 'aadharStatus',
                name: 'Aadhaar Front',
                type: 'AADHAAR_FRONT',
            },
            { key: 'aadharStatus', name: 'Aadhaar Back', type: 'AADHAAR_BACK' },
        ];

        if (gstNo) {
            docTypes.push({
                key: 'gstStatus',
                name: 'GST Certificate',
                type: 'GST',
            });
        } else {
            docTypes.push({ key: 'panStatus', name: 'PAN card', type: 'PAN' });
        }

        // Body holds the statuses directly (same field names as before). A null
        // or empty body means nothing has been uploaded yet.
        const responseData = response?.body;

        documents = docTypes.map((doc) => ({
            DocumentID: doc.type, // Using type as ID for now since we don't have unique IDs in this response
            DocumentName: doc.name,
            DocumentStatus: responseData
                ? responseData[doc.key] || defaultStatus
                : defaultStatus,
            DocumentType: doc.type,
            SubmittedDate: '',
        }));

        callBack(documents);
    } catch (error) {
        showToast({
            type: 'error',
            text1: 'Error processing document status',
            visibilityTime: 2000,
        });
        callBack([]);
    }
}

function* Upload_Document_Api(actionParam: IUploadDocumentParam) {
    try {
        // New REST API: POST /vendor/documents (JWT; vendor from the token).
        const response: IResponseParam = yield call(clientRestHandler, {
            url: projectEnv.vendorDocumentUploadRestUrl,
            method: 'POST',
            data: actionParam.data, // Data is already formatted in component
        });

        // clientRestHandler resolves only on 2xx.
        const message =
            response?.body?.message || 'Documents uploaded successfully';
        showToast({
            type: 'success',
            text1: message,
        });
        actionParam.callBack(true, message);
    } catch (error: any) {
        const message =
            error?.body?.message ||
            error?.body?.error?.message ||
            'Failed to upload documents';
        showToast({
            type: 'error',
            text1: message,
        });
        actionParam.callBack(false, message);
    }
}
