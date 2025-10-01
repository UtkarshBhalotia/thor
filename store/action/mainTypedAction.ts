import { AppDispatch } from '..';

export const loginActions_dispatch =
    (dispatch: AppDispatch) =>
    <T extends TLoginConditionParamActionName>(
        actionName: T,
        arg: TLoginConditionParamActionParam<T>,
    ) => {
        dispatch({
            type: 'Login_Actions',
            payload: { actionName, actionParam: arg } as {
                actionName: T;
                actionParam: TLoginConditionParamActionParam<T>;
            },
        });
    };
