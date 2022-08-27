import { CLEAR_PROFILE_DATA, SET_CURRENT_ID, SET_FIRST_NAME, SET_LAST_NAME, SET_USER_ID, SET_USER_NAME } from "../actions";

export interface IProfileState {
    userId: string;
    currentId: string;
    firstName: string;
    lastName: string;
    userName: string;
}

const defaultState:IProfileState = {
    userId: 'default',
    currentId: 'default',
    firstName: 'FirstName',
    lastName: 'LastName',
    userName: 'UserName'
}

const profileReducer = (state = defaultState, action: any) => {
    switch (action.type) {
        case CLEAR_PROFILE_DATA:
            return {
                ...defaultState
            }
        case SET_USER_ID:
            return {
                ...state,
                userId: action.payload
            }
        case SET_CURRENT_ID:
            return {
                ...state,
                currentId: action.payload
            }
        case SET_FIRST_NAME:
            return {
                ...state,
                firstName: action.payload
            }
        case SET_LAST_NAME:
            return {
                ...state,
                lastName: action.payload
            }
        case SET_USER_NAME:
            return {
                ...state,
                userName: action.payload
            }
        default:
            return state;
    }
}

export default profileReducer;