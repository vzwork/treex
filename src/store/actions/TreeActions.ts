export const CLEAR_TREE_DATA = 'CLEAR_TREE_DATA'
export const SET_BASE_NODE = 'SET_BASE_NODE'
export const SET_SHELVES = 'SET_SHELVES'
export const SET_HISTORY = 'SET_HISTORY'

export const clearTreeData = () => ({
  type: CLEAR_TREE_DATA
})

export const setBaseNode = (nodeId:string) => ({
  type: SET_BASE_NODE,
  payload: nodeId
});

export const setShelves = (shelves:string[][]) => ({
  type: SET_SHELVES,
  payload: shelves
})

export const setHistory = (nodes:string[]) => ({
  type: SET_HISTORY,
  payload: nodes
})