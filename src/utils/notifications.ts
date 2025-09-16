// utils/notifications.ts
import notifee, {
    AndroidImportance,
    RepeatFrequency,
    TimestampTrigger,
    TriggerType,
} from '@notifee/react-native';

export const requestUserPermission = async () => {
    const settings = await notifee.requestPermission();
    console.log('Permission settings:', settings);
};

export const createNotificationChannel = async () => {
    await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
    });
};

export const scheduleNotification = async (
    title: string,
    body: string,
    triggerTime: Date,
) => {
    const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: triggerTime.getTime(), // fire time in milliseconds
        alarmManager: true, // keeps it running even if app is closed
    };

    await notifee.createTriggerNotification(
        {
            title,
            body,
            android: {
                channelId: 'default',
                pressAction: {
                    id: 'default',
                },
            },
        },
        trigger,
    );
};

export async function onScheduleNoti() {
    // Set a trigger time (10 seconds from now)
    const date = new Date(Date.now() + 10 * 1000); // 10 seconds delay

    const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: Date.now() + 10000, // in 10 seconds
        // timestamp: date.getTime(), // time in milliseconds
        //   repeatFrequency: RepeatFrequency.DAILY, // or HOURLY, WEEKLY
        // alarmManager: true, // makes it more reliable on Android (optional)
    };

    // Create and schedule the notification
    const id = await notifee.createTriggerNotification(
        {
            title: '⏰ Scheduled Notification',
            body: 'This notification was scheduled 10 seconds ago!',
            android: {
                channelId: 'default',
                smallIcon: 'ic_launcher',
            },
        },
        trigger,
    );

    console.log('Scheduled notification with ID:', id);
}

// export async function onDisplayNotification() {
//     await notifee.displayNotification({
//         title: 'Hello 👋',
//         body: 'This is a Notifee local notification!',
//         android: {
//             channelId: 'default',
//             smallIcon: 'ic_launcher',
//             pressAction: {
//                 id: 'default',
//             },
//         },
//     });
// }
