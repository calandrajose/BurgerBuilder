import * as actionTypes from "./actionTypes";
import axios from "axios";

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START,
    };
};

export const authSuccess = (data) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: data.idToken,
        userId: data.localId,
    };
};

export const authFailed = (error) => {
    return {
        type: actionTypes.AUTH_FAILED,
        error: error.response.data.error,
    };
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationDate");
    localStorage.removeItem("userId");
    return {
        type: actionTypes.AUTH_LOGOUT,
    };
};

export const checkAuthTimeout = (expirationTime) => {
    return (dispatch) => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime * 1000);
    };
};

export const auth = (email, password, isSignup) => {
    return (dispatch) => {
        dispatch(authStart());

        const apiKey = process.env.REACT_APP_FIREBASE_API_KEY;
        let url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`;

        if (!isSignup) {
            url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;
        }
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true,
        };
        axios
            .post(url, authData)
            .then((response) => {
                const expirationDate = new Date(
                    new Date().getTime() + response.data.expiresIn * 1000
                );
                localStorage.setItem("token", response.data.idToken);
                localStorage.setItem("expirationDate", expirationDate);
                localStorage.setItem("userId", response.data.localId);

                dispatch(authSuccess(response.data));
                dispatch(checkAuthTimeout(response.data.expiresIn));
            })
            .catch((error) => {
                console.log(error);
                dispatch(authFailed(error));
            });
    };
};

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.AUTH_REDIRECT_PATH,
        path: path,
    };
};

export const authCheckState = () => {
    return (dispatch) => {
        const token = localStorage.getItem("token");
        if (!token) {
            dispatch(logout());
        } else {
            const expirationDate = new Date(localStorage.getItem("expirationDate"));
            if (expirationDate < new Date()) {
                dispatch(logout());
            } else {
                const userId = localStorage.getItem('userId');
                dispatch(authSuccess({token:token, userId:userId}));
                dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime())/1000));
            }
        }
    };
};
