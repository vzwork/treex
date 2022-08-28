import { CLEAR_TREE_DATA, SET_BASE_NODE, SET_HISTORY, SET_SHELVES } from '../actions';

export interface ITreeState {
  baseId: string
  shelves: string[][]
  history: string[]
}

const defaultState:ITreeState = {
  baseId: 'KSLC3E9YXXNJNKx23LqV',
  shelves: [],
  history: []
};


const treeReducer = (state = defaultState, action: any) => {
  switch (action.type) {
    case CLEAR_TREE_DATA:
      return {
        ...defaultState
      }
    case SET_BASE_NODE:
      return {
        ...state,
        baseNodeId: action.payload
      }
    case SET_SHELVES:
      return {
        ...state,
        shelves: action.payload
      }
    case SET_HISTORY:
      return {
        ...state,
        history: action.payload
      }
    default:
      return state;
  };
}

export default treeReducer;