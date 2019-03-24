import { GoogleSignin, statusCodes } from "react-native-google-signin";
import firebase from "react-native-firebase";

import {
  loginRequested,
  loginFailed,
  loginSucceeded,
  loginInitRequested,
  loginInitAuthenticated,
  loginInitNoUser,
  loginInitError,
  logoutAuth,
} from "./auth";
import { getUserData, syncUserData } from "../db";

export function initAuth() {
  return (dispatch, getState) => {
    dispatch(loginInitRequested());
    return loginIfPossible()
      .then(response => {
        if (response) {
          const user = response;
          const userId = user.uid;
          dispatch(getUserData(userId));
          dispatch(loginInitAuthenticated(user));
          console.log("sync user data 1");
          dispatch(syncUserData());
        } else {
          return dispatch(loginInitNoUser());
        }
      })
      .catch(error => {
        return dispatch(loginInitError(error));
      });
  };
}

export function login() {
  return (dispatch, getState) => {
    dispatch(loginRequested());

    return loginWithGoogle()
      .then(response => {
        const user = response;
        const userId = user.uid;
        dispatch(loginSucceeded(response));
        dispatch(getUserData(userId));
        dispatch(syncUserData());
      })
      .catch(error => {
        console.log(error);
        return dispatch(loginFailed(error));
      });
  };
}

export function logout() {
  return (dispatch, getState) => {
    dispatch(logoutAuth());
    return logoutWithGoogle();
  };
}

const loginWithGoogle = async () => {
  try {
    await GoogleSignin.configure();
    const data = await GoogleSignin.signIn();

    // create a new firebase credential with the token
    const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken);
    // login with credential
    const currentUser = await firebase.auth().signInWithCredential(credential);
    return currentUser.user.toJSON();
  } catch (e) {
    console.log("ERROR LOGGING IN::: ", e);
    throw e;
  }
};

const loginIfPossible = async () => {
  try {
    await GoogleSignin.configure();
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (!isSignedIn) {
      return undefined;
    }
    const data = await getCurrentUserInfo();
    if (data) {
      // create a new firebase credential with the token
      const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken);
      // login with credential
      const currentUser = await firebase.auth().signInWithCredential(credential);
      return currentUser.user.toJSON();
    } else {
      throw "no user";
    }
  } catch (error) {
    console.log("loginIfPossible error: ", error);
    throw "Login Error";
  }
};

const getCurrentUserInfo = async () => {
  try {
    const authData = await GoogleSignin.signInSilently();
    return authData;
  } catch (error) {
    if (error.code === statusCodes.SIGN_IN_REQUIRED) {
      // user has not signed in yet
      return undefined;
    } else {
      throw error;
    }
  }
};

const logoutWithGoogle = async () => {
  try {
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
  } catch (e) {
    console.log("logoutWithGoogle error: ", e);
    throw e;
  }
};
