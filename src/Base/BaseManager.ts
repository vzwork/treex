// 

export class BaseManager {
  // vvv fields vvv
  // ^^^ fields ^^^

  // vvv Singleton vvv
  private static instance: BaseManager
  public static getInstance(): BaseManager {
    if (!BaseManager.instance) {
      BaseManager.instance = new BaseManager()
    }
    return BaseManager.instance;
  }
  private constructor() {
  }
  // ^^^ Singleton ^^^
}