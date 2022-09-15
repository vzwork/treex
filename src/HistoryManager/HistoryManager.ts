const DEFAULT_NODE_ID = 'KSLC3E9YXXNJNKx23LqV'

export class HistoryManager {
  // vvv fields vvv
  nodeHistory = []

  // ^^^ fields ^^^

  // vvv Singleton vvv
  private constructor() {
  }
  private static instance: HistoryManager
  public static getInstance(): HistoryManager {
    if (!HistoryManager.instance) {
      HistoryManager.instance = new HistoryManager()
    }
    return HistoryManager.instance;
  }
  // ^^^ Singleton ^^^

  // vvv public methods vvv
  public getNodeId() {
    if (this.nodeHistory.length == 0) {
      return DEFAULT_NODE_ID
    }
    return this.nodeHistory[0]
  }
  // ^^^ public methods ^^^
}