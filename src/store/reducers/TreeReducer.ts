import { NodeReference } from '../../data/Node';
import { CLEAR_TREE_DATA, SET_BASE_NODE, SET_SHELVES } from '../actions';

export interface ITreeState {
  baseId: string
  shelves: string[][]
}

const defaultState:ITreeState = {
  baseId: 'KSLC3E9YXXNJNKx23LqV',
  shelves: []
};


const rootReducer = (state = defaultState, action: any) => {
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
    default:
      return state;
  };
}

export default rootReducer;