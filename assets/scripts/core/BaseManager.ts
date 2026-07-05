/**
 * BaseManager
 * 所有 Manager 的抽象基类，统一生命周期接口
 * 子类必须实现 init() 与 destroy()
 */
export abstract class BaseManager {
    protected constructor() {}

    /**
     * 初始化管理器
     * 可返回 Promise 用于异步初始化
     */
    public abstract init(): void | Promise<void>;

    /**
     * 销毁管理器，释放资源
     */
    public abstract destroy(): void;
}
