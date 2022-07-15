import { INode } from "../../data/Node";

export const SET_BASE_NODE = 'SET_BASE_NODE';
export const INCREASE_REQUEST_COUNT = 'INCREASE_REQUEST_COUNT';

export const setBaseNode = (node:INode) => ({
  type: SET_BASE_NODE,
  payload: [node.id, node.name]
});

export const increaseRequestCount = () => ({
  type: INCREASE_REQUEST_COUNT,
  payload: null
});