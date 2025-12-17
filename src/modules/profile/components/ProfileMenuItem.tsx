import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { profileStyles } from '../../../assets/css/profileStyles';

interface ProfileMenuItemProps {
    icon?: string;
    title: string;
    onPress?: () => void;
    isAlert?: boolean;
    isLogout?: boolean;
}

const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({
    icon,
    title,
    onPress,
    isAlert = false,
    isLogout = false,
}) => {
    const getStyles = () => {
        if (isAlert) {
            return {
                container: profileStyles.alertMenuItem,
                left: profileStyles.alertMenuItemLeft,
                iconContainer: profileStyles.alertMenuIcon,
                text: profileStyles.alertMenuItemText,
            };
        }
        if (isLogout) {
            return {
                container: profileStyles.logoutMenuItem,
                left: profileStyles.logoutMenuItemLeft,
                iconContainer: profileStyles.logoutMenuIcon,
                text: profileStyles.logoutMenuItemText,
            };
        }
        return {
            container: profileStyles.menuItem,
            left: profileStyles.menuItemLeft,
            iconContainer: profileStyles.menuIcon,
            text: profileStyles.menuItemText,
        };
    };

    const styles = getStyles();

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.left}>
                <View style={styles.iconContainer}>
                    <Text style={{ fontSize: 18 }}>{icon || '📄'}</Text>
                </View>
                <Text style={styles.text}>{title}</Text>
            </View>
            {!isAlert && !isLogout && (
                <Text style={profileStyles.menuItemArrow}>›</Text>
            )}
        </TouchableOpacity>
    );
};

export default ProfileMenuItem;
