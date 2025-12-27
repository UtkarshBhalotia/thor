import { put } from "redux-saga/effects";
import { AppDispatch } from "..";

export const globalReducer_dispatch =
    (dispatch: AppDispatch) =>
        <T extends TGlobalReducerType>(type: T, value: TGlobalReducerValue<T>) =>
            dispatch({ type, value });

export function* globalReducer_put<T extends TGlobalReducerType>(
    type: T,
    value: TGlobalReducerValue<T>,
) {
    yield put({ type, value });
}
