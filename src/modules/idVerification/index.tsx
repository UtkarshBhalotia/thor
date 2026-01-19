import React from 'react';
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
import { RootStackParamList } from '../../navigations/navigation';
import { idVerificationStyles } from '../../assets/css/idVerificationStyles';

const IdVerification = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const documents = [
        {
            id: 1,
            title: 'Driving licence',
            status: 'Request pending',
            statusType: 'pending',
            // image: require('../../assets/img/license_placeholder.png'), // Placeholder or mock
        },
        {
            id: 2,
            title: 'PAN card',
            status: 'Verified',
            statusType: 'verified',
            action: 'Request for update',
            actionIcon: 'chevron-forward',
        },
        {
            id: 3,
            title: 'Aadhaar',
            status: 'Verified',
            statusType: 'verified',
            action: 'Request for update',
            actionIcon: 'chevron-forward',
        },
    ];

    const renderDocumentCard = (doc: any) => (
        <View key={doc.id} style={idVerificationStyles.card}>
            <View style={idVerificationStyles.imageContainer}>
                {doc.title === 'Driving licence' ? (
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
                ) : doc.title === 'PAN card' ? (
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
                    {doc.statusType === 'verified' && (
                        <Ionicons
                            name="checkmark-circle"
                            size={18}
                            color="#4CAF50"
                            style={idVerificationStyles.checkIcon}
                        />
                    )}
                    <Text style={idVerificationStyles.docTitle}>{doc.title}</Text>
                </View>

                {doc.statusType === 'pending' ? (
                    <View style={idVerificationStyles.statusContainer}>
                        <Text style={[idVerificationStyles.dot, idVerificationStyles.statusPending]}>•</Text>
                        <Text style={[idVerificationStyles.statusText, idVerificationStyles.statusPending]}>
                            {doc.status}
                        </Text>
                    </View>
                ) : (
                    <TouchableOpacity style={idVerificationStyles.statusContainer}>
                        <Text style={[idVerificationStyles.statusText, idVerificationStyles.statusUpdate]}>
                            {doc.action}
                        </Text>
                        <Ionicons
                            name={doc.actionIcon}
                            size={14}
                            color="#5F60B9"
                            style={{ marginLeft: 4 }}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    return (
        <SafeAreaView style={idVerificationStyles.container} edges={['top']}>
            <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
            <View style={idVerificationStyles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={idVerificationStyles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#1C1F34" />
                </TouchableOpacity>
                <Text style={idVerificationStyles.headerTitle}>ID verification</Text>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={idVerificationStyles.scrollContent}>
                <Text style={idVerificationStyles.subtitle}>Submitted document</Text>

                {documents.map(renderDocumentCard)}
            </ScrollView>
        </SafeAreaView>
    );
};

export default IdVerification;
