import React, { useState, forwardRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BottomSheetModal, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import BSModal from './BSModal';

interface DeniedLeadFormModalProps {
    onSubmit: (reason: string) => void;
}

const DeniedLeadFormModal = forwardRef<
    BottomSheetModal,
    DeniedLeadFormModalProps
>(({ onSubmit }, ref) => {
    const [deniedReason, setDeniedReason] = useState('');

    const handleSubmit = () => {
        if (deniedReason.trim()) {
            onSubmit(deniedReason);
            setDeniedReason('');
            if (ref && 'current' in ref && ref.current) {
                ref.current.dismiss();
            }
        }
    };

    const handleDismiss = () => {
        setDeniedReason('');
    };

    return (
        <BSModal
            bsModalRef={ref as React.RefObject<BottomSheetModal>}
            headerTitle="Denied Lead"
            snapPoints={['45%']}
            customOnDismiss={handleDismiss}>
            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Denied Lead Reason</Text>
                    <BottomSheetTextInput
                        style={styles.textArea}
                        placeholder="Enter reason for denying this lead..."
                        placeholderTextColor="#999"
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        value={deniedReason}
                        onChangeText={setDeniedReason}
                    />
                </View>

                <TouchableOpacity
                    style={[
                        styles.submitButton,
                        !deniedReason.trim() && styles.submitButtonDisabled,
                    ]}
                    onPress={handleSubmit}
                    disabled={!deniedReason.trim()}
                    activeOpacity={0.8}>
                    <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
            </View>
        </BSModal>
    );
});

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1C1F34',
        marginBottom: 8,
    },
    textArea: {
        backgroundColor: '#F7F8FA',
        borderRadius: 10,
        padding: 14,
        fontSize: 14,
        color: '#1C1F34',
        minHeight: 120,
        borderWidth: 1,
        borderColor: '#E8E8E8',
    },
    submitButton: {
        backgroundColor: '#D32F2F',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitButtonDisabled: {
        backgroundColor: '#E0E0E0',
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default DeniedLeadFormModal;
