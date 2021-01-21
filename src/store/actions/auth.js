import * as actionTypes from './actionTypes'
import axios from 'axios'


export const authStart = () =>{
    return{
        type: actionTypes.AUTH_START
    }
}

export const authSuccess = data=>{
    return{
        type: actionTypes.AUTH_SUCCESS,
        idToken: data.idToken,
        userId: data.localId
    }
}

export const authFailed = error =>{
    return{
        type: actionTypes.AUTH_FAILED,
        error: error.response.data.error
    }
}

export const logout= ()=>{
    return{
        type: actionTypes.AUTH_LOGOUT
    }
}

export const checkAuthTimeout = (expirationTime)=>{
    return dispatch =>{
        setTimeout(() => {
            dispatch(logout())
        }, expirationTime * 1000);
    }
}

export const auth = (email, password, isSignup) =>{
    return dispatch =>{
        dispatch(authStart())
        
        const apiKey = process.env.REACT_APP_FIREBASE_API_KEY
        let url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`
        
        if(!isSignup){
            url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`
        }
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        }
        axios.post(url, authData)
        .then(response=>{
            console.log(response);
            dispatch(authSuccess(response.data))
            dispatch(checkAuthTimeout(response.data.expiresIn))
        })
        .catch(error=>{
            console.log(error);
            dispatch(authFailed(error))
        })
    }
}

export const setAuthRedirectPath = (path) =>{
    return{
        type: actionTypes.AUTH_REDIRECT_PATH,
        path: path
}
}