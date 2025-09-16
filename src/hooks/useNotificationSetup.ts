import { useEffect } from 'react';
import {
    createNotificationChannel,
    requestUserPermission,
} from '../utils/notifications';

const useNotificationSetup = () => {
    useEffect(() => {
        requestUserPermission();
        createNotificationChannel();
    }, []);
};

export default useNotificationSetup;
