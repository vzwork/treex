export const CLEAR_TREE_DATA = 'CLEAR_TREE_DATA'
export const SET_BASE_NODE = 'SET_BASE_NODE'
export const SET_SHELVES = 'SET_SHELVES'
export const SET_HISTORY = 'SET_HISTORY'
export const SET_SEARCH_RESULTS = 'SET_SEARCH_RESULTS'
export const SET_COMMENTS = 'SET_COMMENTS'
export const SET_FILE = 'SET_FILE'

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

export const setSearchResults = (results:string[][]) => ({
  type: SET_SEARCH_RESULTS,
  payload: results
})

export const setComments = (comments:object[]) => ({
  type: SET_COMMENTS,
  payload: comments
})

export const setFile = (file:string) => ({
  type: SET_FILE,
  payload: file
})