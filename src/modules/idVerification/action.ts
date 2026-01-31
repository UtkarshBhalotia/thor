import { call, select } from 'redux-saga/effects';
import { clientPostHandler } from '../../services/request';
import { RootState } from '../../../store';
import projectEnv from '../../services/env';
import { showToast } from '../../utils/common';
import {
    TIdVerificationConditionParamActionName,
    IIdVerificationActionConditionParam,
    TGetDocumentStatusParam,
    IDocumentStatusItem,
    IUploadDocumentParam
} from './type';

export function* conditionActions<T extends TIdVerificationConditionParamActionName>(
    param: IIdVerificationActionConditionParam<T>
) {
    const { payload: { actionName, actionParam } } = param;
    switch (actionName) {
        case 'Get_Document_Status_Api':
            yield call(Get_Document_Status_Api, actionParam as TGetDocumentStatusParam);
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

        const dataObj = {
            data: [{
                userid: GlobalState.userId,
            }],
        };

        const response: IResponseParam = yield call(clientPostHandler, {
            url: projectEnv.vendor_douments_statusUrl,
            data: dataObj,
        });

        yield Get_Document_Status_Api_Response(response, actionParam.callBack, GlobalState.gstNo);
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
    gstNo?: string
) {
    try {
        let documents: IDocumentStatusItem[] = [];
        
        const defaultStatus = 'Not Uploaded';
        
        // Define the structure of documents we expect
        let docTypes = [
            { key: 'AadharStatus', name: 'Aadhaar Front', type: 'AADHAAR_FRONT' },
            { key: 'AadharStatus', name: 'Aadhaar Back', type: 'AADHAAR_BACK' },
        ];

        if (gstNo) {
            docTypes.push({ key: 'GSTStatus', name: 'GST Certificate', type: 'GST' });
        } else {
            docTypes.push({ key: 'PANStatus', name: 'PAN card', type: 'PAN' });
        }

        if (response?.body?.status === 'success') {
            const responseData = response?.body?.data?.response;
            
            // If responseData is null/undefined, it means "Not Uploaded" for all
            // If it is an object, we map the fields
            
            documents = docTypes.map(doc => ({
                DocumentID: doc.type, // Using type as ID for now since we don't have unique IDs in this response
                DocumentName: doc.name,
                DocumentStatus: responseData ? (responseData[doc.key] || defaultStatus) : defaultStatus,
                DocumentType: doc.type,
                SubmittedDate: '',
            }));
            
            callBack(documents);
        } else if (response?.body?.status === 'error') {
             // In case of explicit error, we might still want to show the list as "Not Uploaded" or empty
             // But for now let's assume error means we can't fetch status. 
             // However, user said "response is null in case of No documents uploaded".
             // Let's treat error as null/empty for safety or fallback to "Not Uploaded" list?
             // Safest to return "Not Uploaded" list to keep UI consistent.
             
             documents = docTypes.map(doc => ({
                DocumentID: doc.type,
                DocumentName: doc.name,
                DocumentStatus: defaultStatus,
                DocumentType: doc.type,
                SubmittedDate: '',
            }));
            callBack(documents);
        }
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
        const response: IResponseParam = yield call(clientPostHandler, {
            url: projectEnv.vendor_document_updateUrl,
            data: actionParam.data, // Data is already formatted in component
        });

        if (response?.body?.status === 'success') {
            showToast({
                type: 'success',
                text1: response.body.msg || 'Documents uploaded successfully',
            });
            actionParam.callBack(response.body);
        } else {
             showToast({
                type: 'error',
                text1: response?.body?.msg || 'Failed to upload documents',
            });
            actionParam.callBack(response?.body);
        }
    } catch (error) {
         showToast({
            type: 'error',
            text1: 'Error uploading documents',
        });
        actionParam.callBack(null);
    }
}
