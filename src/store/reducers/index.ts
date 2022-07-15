import { INCREASE_REQUEST_COUNT, SET_BASE_NODE } from '../actions';

export interface IState {
  baseNodeId: string;
  baseNodeName: string;
  requestCount: number;
}

const myState:IState = {
  baseNodeId: 'default',
  baseNodeName: 'default',
  requestCount: 0
};


const rootReducer = (state = myState, action: any) => {
  switch (action.type) {
    case SET_BASE_NODE:
      return {
        ...state,
        baseNodeId: action.payload[0],
        baseNodeName: action.payload[1]
      }
    case INCREASE_REQUEST_COUNT:
      return {
        ...state,
        requestCount: state.requestCount + 1
      }
    default:
      return state;
  };
}

export default rootReducer;