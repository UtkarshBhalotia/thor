import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { useCallback, useRef } from 'react';
import { BackHandler, NativeEventSubscription } from 'react-native';

export const openBSModal = (
    modalRef: React.RefObject<BottomSheetModalMethods | null>,
) => {
    if (modalRef.current) modalRef?.current?.present();
};

export const closeBSModal = (
    modalRef: React.RefObject<BottomSheetModalMethods | null>,
) => {
    if (modalRef.current) modalRef.current.dismiss();
};

// export const useBottomSheetBackHandler = (
//     bottomSheetRef: React.RefObject<BottomSheetModal | null>,
//     customBackFn?: (() => void) | null,
// ) => {
//     const backHandlerSubscriptionRef = useRef<NativeEventSubscription | null>(
//         null,
//     );
//     const handleSheetPositionChange = useCallback(
//         (index: number) => {
//             const isBottomSheetVisible = index >= 0;
//             if (
//                 (isBottomSheetVisible && !backHandlerSubscriptionRef.current) ||
//                 (isBottomSheetVisible && backHandlerSubscriptionRef.current)
//             ) {
//                 // Resetting state
//                 backHandlerSubscriptionRef?.current?.remove();
//                 backHandlerSubscriptionRef.current = null;
//                 // setup the back handler if the bottom sheet is right in front of the user
//                 backHandlerSubscriptionRef.current =
//                     BackHandler.addEventListener('hardwareBackPress', () => {
//                         if (customBackFn !== undefined && customBackFn !== null)
//                             customBackFn();
//                         else bottomSheetRef.current?.dismiss();
//                         return true;
//                     });
//             } else if (!isBottomSheetVisible) {
//                 backHandlerSubscriptionRef.current?.remove();
//                 backHandlerSubscriptionRef.current = null;
//             }
//         },
//         [bottomSheetRef, customBackFn, backHandlerSubscriptionRef],
//     );
//     return { handleSheetPositionChange };
// };

export const useBottomSheetBackHandler = (
    bottomSheetRef: React.RefObject<BottomSheetModal | null>,
    customBackButtonFlag: boolean,
    customBackFn?: (() => void) | null,
) => {
    const backHandlerSubscriptionRef = useRef<NativeEventSubscription | null>(
        null,
    );
    const handleSheetPositionChange = useCallback(
        (index: number) => {
            if (index >= 0) {
                backHandlerSubscriptionRef?.current?.remove();
                backHandlerSubscriptionRef.current = null;
                // setup the back handler if the bottom sheet is right in front of the user
                backHandlerSubscriptionRef.current =
                    BackHandler.addEventListener('hardwareBackPress', () => {
                        if (
                            customBackFn !== undefined &&
                            customBackFn !== null &&
                            customBackButtonFlag
                        ) {
                            customBackFn();
                        } else {
                            bottomSheetRef.current?.dismiss();
                        }
                        return true;
                    });
            } else {
                // Resetting state
                backHandlerSubscriptionRef.current?.remove();
                backHandlerSubscriptionRef.current = null;
            }
        },
        [bottomSheetRef, customBackFn, backHandlerSubscriptionRef],
    );
    return { handleSheetPositionChange };
};
