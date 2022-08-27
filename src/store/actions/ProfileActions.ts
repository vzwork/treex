export const CLEAR_PROFILE_DATA = 'CLEAR_PROFILE_DATA';
export const SET_USER_ID = 'SET_USER_ID';
export const SET_CURRENT_ID = 'SET_CURRENT_ID';
export const SET_FIRST_NAME = 'SET_FIRST_NAME';
export const SET_LAST_NAME = 'SET_LAST_NAME';
export const SET_USER_NAME = 'SET_USER_NAME';

export const clearProfileData = () => ({
    type: CLEAR_PROFILE_DATA
})

export const setUserId = (userId:string) => ({
    type: SET_USER_ID,
    payload: userId
})

export const setCurrentId = (currentId:string) => ({
    type: SET_CURRENT_ID,
    payload: currentId
})

export const setFirstName = (firstName:string) => ({
    type: SET_FIRST_NAME,
    payload: firstName
})

export const setLastName = (lastName:string) => ({
    type: SET_LAST_NAME,
    payload: lastName
})

export const setUserName = (userName:string) => ({
    type: SET_USER_NAME,
    payload: userName
})