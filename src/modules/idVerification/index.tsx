import React, { useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParamList } from '../../navigations/navigation';
import { idVerificationStyles } from '../../assets/css/idVerificationStyles';
import { RootState } from '../../../store';
import { IDocumentStatusItem } from './type';
import BSModal from '../../components/BSModal';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { launchCamera, launchImageLibrary, ImagePickerResponse, MediaType, PhotoQuality, Asset } from 'react-native-image-picker';
import { useRef, useState } from 'react';
import Toast from 'react-native-toast-message';

const IdVerification = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const dispatch = useDispatch();
    const { documents, loading } = useSelector(
        (state: RootState) => state.idVerificationState
    );

    const documentUploadModalRef = useRef<BottomSheetModal>(null);
    const [currentDocument, setCurrentDocument] = useState<IDocumentStatusItem | null>(null);
    const [localImages, setLocalImages] = useState<Record<string, Asset>>({});

    const handleDocumentUpload = (doc: IDocumentStatusItem) => {
        setCurrentDocument(doc);
        documentUploadModalRef.current?.present();
    };

    const handleCamera = () => {
        documentUploadModalRef.current?.dismiss();
        const options = {
            mediaType: 'photo' as MediaType,
            includeBase64: true,
            maxHeight: 2000,
            maxWidth: 2000,
            quality: 0.8 as PhotoQuality,
        };

        setTimeout(() => {
            launchCamera(options, (response: ImagePickerResponse) => {
                if (response.didCancel || response.errorMessage) {
                    return;
                }
                if (response.assets && response.assets[0] && currentDocument) {
                    const asset = response.assets[0];
                    setLocalImages(prev => ({
                        ...prev,
                        [currentDocument.DocumentID]: asset
                    }));
                }
            });
        }, 300);
    };

    const handleGallery = () => {
        documentUploadModalRef.current?.dismiss();
        const options = {
            mediaType: 'photo' as MediaType,
            includeBase64: true,
            maxHeight: 2000,
            maxWidth: 2000,
            quality: 0.8 as PhotoQuality,
        };

        setTimeout(() => {
            launchImageLibrary(options, (response: ImagePickerResponse) => {
                if (response.didCancel || response.errorMessage) {
                    return;
                }
                 if (response.assets && response.assets[0] && currentDocument) {
                    const asset = response.assets[0];
                    setLocalImages(prev => ({
                        ...prev,
                        [currentDocument.DocumentID]: asset
                    }));
                }
            });
        }, 300);
    };



    useEffect(() => {
        dispatch({
            type: 'IdVerification_Actions',
            payload: {
                actionName: 'Get_Document_Status_Api',
                actionParam: {
                    callBack: (data: IDocumentStatusItem[] | null) => {
                        dispatch({
                            type: 'ID_VERIFICATION_SUCCESS',
                            payload: data,
                        });
                    },
                },
            },
        });
    }, [dispatch]);

    const getStatusType = (status: string) => {
        switch (status) {
            case 'Approved':
            case 'Verified':
                return 'verified';
            case 'Pending':
                return 'pending';
            case 'Rejected':
                return 'rejected';
            case 'Not Uploaded':
                return 'not_uploaded';
            default:
                return 'pending';
        }
    };

    const getActionText = (status: string) => {
        if (status === 'Approved' || status === 'Verified') return 'View Details'; // Or Keep as is? "Request for update" was for Verified.
        if (status === 'Not Uploaded') return 'Upload';
        if (status === 'Rejected') return 'Re-upload';
        return status;
    };

    const getImageType = (type?: string) => {
        if (!type) {
            return '';
        }
        const parts = type.split('/');
        return parts.length > 1 ? parts[1] : type;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Approved':
            case 'Verified':
                return '#4CAF50'; // Green
            case 'Pending':
                return '#FF9800'; // Orange
            case 'Rejected':
                return '#F44336'; // Red
            case 'Not Uploaded':
                return '#9E9E9E'; // Gray
            default:
                return '#8F8F8F';
        }
    };

    const handleSubmit = () => {
        // Validate if there are any documents to submit
        const docsToSubmit = documents?.filter(doc => 
            doc.DocumentStatus === 'Not Uploaded' || doc.DocumentStatus === 'Rejected'
        ) || [];

        if (docsToSubmit.length === 0) {
            Toast.show({
                type: 'info',
                text1: 'No documents to submit',
            });
            return;
        }

        // Validate mandatory fields: Every doc in docsToSubmit MUST have a localImage
        const missingDocs = docsToSubmit.filter(doc => !localImages[doc.DocumentID]);

        if (missingDocs.length > 0) {
            Toast.show({
                type: 'error',
                text1: 'Missing Documents',
                text2: `Please upload: ${missingDocs.map(d => d.DocumentName).join(', ')}`,
            });
            return;
        }

        // Prepare data
        const getLocalImage = (id: string) => localImages[id];
        
        // New REST API: a flat JSON body — the vendor comes from the JWT, so
        // there is no UserID and no `data: [{...}]` wrapper.
        const dataObj = {
            profileImageType: "",
            profileImageBase64: "", // Assuming empty as requested

            panImageType: getImageType(getLocalImage('PAN')?.type),
            panImageBase64: getLocalImage('PAN')?.base64 || "",

            aadhaarFrontImageType: getImageType(getLocalImage('AADHAAR_FRONT')?.type),
            aadhaarFrontImageBase64: getLocalImage('AADHAAR_FRONT')?.base64 || "",

            aadhaarBackImageType: getImageType(getLocalImage('AADHAAR_BACK')?.type),
            aadhaarBackImageBase64: getLocalImage('AADHAAR_BACK')?.base64 || "",

            gstFileType: getImageType(getLocalImage('GST')?.type),
            gstFileBase64: getLocalImage('GST')?.base64 || "",
        };

        dispatch({
            type: 'IdVerification_Actions',
            payload: {
                actionName: 'Upload_Document_Api',
                actionParam: {
                    data: dataObj,
                    callBack: (success: boolean) => {
                         if(success) {
                             // Refresh list
                             setLocalImages({}); // Clear local images
                              dispatch({
                                type: 'IdVerification_Actions',
                                payload: {
                                    actionName: 'Get_Document_Status_Api',
                                    actionParam: {
                                        callBack: (data: IDocumentStatusItem[] | null) => {
                                            dispatch({
                                                type: 'ID_VERIFICATION_SUCCESS',
                                                payload: data,
                                            });
                                        },
                                    },
                                },
                            });
                         }
                    },
                },
            },
        });
    };

    const renderDocumentCard = (doc: IDocumentStatusItem) => {
        const statusType = getStatusType(doc.DocumentStatus);
        const localImage = localImages[doc.DocumentID];
        
        return (
        <View key={doc.DocumentID} style={idVerificationStyles.card}>
            <View style={idVerificationStyles.imageContainer}>
                {localImage ? (
                    <Image 
                        source={{ uri: localImage.uri }} 
                        style={idVerificationStyles.documentImage} 
                        resizeMode="cover" 
                    />
                ) : doc.DocumentName.includes('Driving licence') || doc.DocumentType === 'DL' ? (
                    <View style={{ width: '80%', height: '80%', backgroundColor: '#E3F2FD', borderRadius: 8, padding: 12 }}>
                        <View style={{ height: 12, width: '60%', backgroundColor: '#1976D2', marginBottom: 8, borderRadius: 2 }} />
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                            <View style={{ width: 40, height: 40, backgroundColor: '#BBDEFB', borderRadius: 4 }} />
                            <View style={{ flex: 1 }}>
                                <View style={{ height: 8, width: '100%', backgroundColor: '#90CAF9', marginBottom: 4, borderRadius: 2 }} />
                                <View style={{ height: 8, width: '80%', backgroundColor: '#90CAF9', borderRadius: 2 }} />
                            </View>
                        </View>
                        <View style={{ marginTop: 'auto', height: 10, width: '100%', backgroundColor: '#90CAF9', borderRadius: 2 }} />
                    </View>
                ) : doc.DocumentName.includes('PAN') || doc.DocumentType === 'PAN' ? (
                    <View style={{ width: '80%', height: '80%', backgroundColor: '#F1F8E9', borderRadius: 8, padding: 12 }}>
                        <View style={{ height: 10, width: '40%', backgroundColor: '#388E3C', marginBottom: 4, alignSelf: 'flex-end', borderRadius: 2 }} />
                        <View style={{ height: 10, width: '40%', backgroundColor: '#388E3C', marginBottom: 16, alignSelf: 'flex-end', borderRadius: 2 }} />
                        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                            <View style={{ flex: 1 }}>
                                <View style={{ height: 8, width: '90%', backgroundColor: '#A5D6A7', marginBottom: 4, borderRadius: 2 }} />
                                <View style={{ height: 8, width: '70%', backgroundColor: '#A5D6A7', borderRadius: 2 }} />
                            </View>
                            <View style={{ width: 30, height: 40, backgroundColor: '#C8E6C9', borderRadius: 4 }} />
                        </View>
                    </View>
                ) : (
                    <View style={{ width: '80%', height: '80%', backgroundColor: '#FFF3E0', borderRadius: 8, padding: 12 }}>
                        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
                            <View style={{ width: 40, height: 50, backgroundColor: '#FFE0B2', borderRadius: 4 }} />
                            <View style={{ flex: 1 }}>
                                <View style={{ height: 8, width: '100%', backgroundColor: '#FFCC80', marginBottom: 6, borderRadius: 2 }} />
                                <View style={{ height: 8, width: '100%', backgroundColor: '#FFCC80', marginBottom: 6, borderRadius: 2 }} />
                                <View style={{ height: 8, width: '100%', backgroundColor: '#FFCC80', borderRadius: 2 }} />
                            </View>
                        </View>
                        <View style={{ height: 20, width: '40%', backgroundColor: '#FFCC80', alignSelf: 'flex-end', borderRadius: 4 }} />
                    </View>
                )}
            </View>

            <View style={idVerificationStyles.cardFooter}>
                <View style={idVerificationStyles.docTitleContainer}>
                    {statusType === 'verified' && (
                        <Ionicons
                            name="checkmark-circle"
                            size={18}
                            color="#4CAF50"
                            style={idVerificationStyles.checkIcon}
                        />
                    )}
                    {statusType === 'rejected' && (
                         <Ionicons
                             name="alert-circle"
                             size={18}
                             color="#F44336"
                             style={idVerificationStyles.checkIcon}
                         />
                     )}
                    <Text style={idVerificationStyles.docTitle}>{doc.DocumentName}</Text>
                </View>

                {statusType === 'pending' ? (
                    <View style={idVerificationStyles.statusContainer}>
                        <Text style={[idVerificationStyles.dot, { color: getStatusColor(doc.DocumentStatus) }]}>•</Text>
                        <Text style={[idVerificationStyles.statusText, { color: getStatusColor(doc.DocumentStatus) }]}>
                            {doc.DocumentStatus}
                        </Text>
                    </View>
                ) : (
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                         {/* Show Status Text for all non-pending statuses */}
                         {(statusType === 'rejected' || statusType === 'not_uploaded' || statusType === 'verified') && (
                            <Text style={[
                                idVerificationStyles.statusText, 
                                { color: getStatusColor(doc.DocumentStatus), marginRight: 10 }
                            ]}>
                                {doc.DocumentStatus}
                            </Text>
                        )}
                        <TouchableOpacity 
                            style={idVerificationStyles.statusContainer}
                            onPress={() => {
                                if (statusType === 'not_uploaded' || statusType === 'rejected') {
                                    handleDocumentUpload(doc);
                                }
                            }}
                        >
                            <Text style={[
                                idVerificationStyles.statusText, 
                                idVerificationStyles.statusUpdate,
                                statusType === 'rejected' ? { color: '#F44336' } : {}
                            ]}>
                                {getActionText(doc.DocumentStatus)}
                            </Text>
                            <Ionicons
                                name="chevron-forward"
                                size={14}
                                color={statusType === 'rejected' ? "#F44336" : "#5F60B9"}
                                style={{ marginLeft: 4 }}
                            />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
    };

    return (
        <SafeAreaView style={idVerificationStyles.container} edges={['top']}>
            <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
            <View style={idVerificationStyles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="#1C1F34" />
                </TouchableOpacity>
                <Text style={idVerificationStyles.headerTitle}>Document Verification</Text>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={idVerificationStyles.scrollContent}>
                {/* <Text style={idVerificationStyles.subtitle}>Submitted document</Text> */}

                {loading ? (
                     <View style={{ padding: 20, alignItems: 'center' }}>
                         <Text>Loading...</Text>
                     </View>
                ) : (
                    (documents || []).map(renderDocumentCard)
                )}

                 {/* Submit Button - Visible if there are actions to take */}
                 {documents && documents.some(doc => doc.DocumentStatus === 'Not Uploaded' || doc.DocumentStatus === 'Rejected') && (
                     <View style={{ padding: 16 }}>
                         <TouchableOpacity
                             onPress={handleSubmit}
                             style={{
                                 backgroundColor: '#5F60B9',
                                 paddingVertical: 16,
                                 borderRadius: 12,
                                 alignItems: 'center',
                                 shadowColor: '#5F60B9',
                                 shadowOffset: { width: 0, height: 4 },
                                 shadowOpacity: 0.3,
                                 shadowRadius: 8,
                                 elevation: 6,
                             }}>
                             <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '700' }}>
                                 Submit Documents
                             </Text>
                         </TouchableOpacity>
                     </View>
                 )}
            </ScrollView>

            <BSModal
                bsModalRef={documentUploadModalRef}
                index={0}
                snapPoints={['30%']}
                headerTitle={`Upload ${currentDocument?.DocumentName || 'Document'}`}
                headerRightButtonComponent={
                    <TouchableOpacity
                        onPress={() => documentUploadModalRef.current?.dismiss()}
                        style={{
                            width: 32,
                            height: 32,
                            borderRadius: 16,
                            backgroundColor: '#F0F0F0',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <Text style={{ fontSize: 16, fontWeight: '600', color: '#666666' }}>✕</Text>
                    </TouchableOpacity>
                }>
                <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingVertical: 16,
                            paddingHorizontal: 20,
                            backgroundColor: '#F8F9FA',
                            borderRadius: 12,
                            marginBottom: 12,
                            borderWidth: 1,
                            borderColor: '#E0E0E0',
                        }}
                        onPress={handleCamera}
                        activeOpacity={0.7}>
                        <Text style={{ fontSize: 24, marginRight: 16 }}>📷</Text>
                        <Text style={{ fontSize: 16, fontWeight: '600', color: '#333333' }}>Take Photo</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingVertical: 16,
                            paddingHorizontal: 20,
                            backgroundColor: '#F8F9FA',
                            borderRadius: 12,
                            marginBottom: 12,
                            borderWidth: 1,
                            borderColor: '#E0E0E0',
                        }}
                        onPress={handleGallery}
                        activeOpacity={0.7}>
                        <Text style={{ fontSize: 24, marginRight: 16 }}>🖼️</Text>
                        <Text style={{ fontSize: 16, fontWeight: '600', color: '#333333' }}>
                            Choose from Gallery
                        </Text>
                    </TouchableOpacity>
                </View>
            </BSModal>
        </SafeAreaView>
    );
};

export default IdVerification;
