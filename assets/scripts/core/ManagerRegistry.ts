import { BaseManager } from './BaseManager';

/**
 * ManagerRegistry
 * 管理器注册中心，集中管理所有 Manager 的注册、初始化与销毁
 * 替代 GameManager 中臃肿的 init/destroy 调用列表
 */
export class ManagerRegistry {
    private static managers: Map<string, BaseManager> = new Map();

    /**
     * 注册 Manager
     * @param name 管理器名称（唯一标识）
     * @param manager 管理器实例
     * @returns 同一个 manager 实例，便于链式调用
     */
    public static register<T extends BaseManager>(name: string, manager: T): T {
        if (ManagerRegistry.managers.has(name)) {
            return ManagerRegistry.managers.get(name) as T;
        }
        ManagerRegistry.managers.set(name, manager);
        return manager;
    }

    /**
     * 获取 Manager
     */
    public static get<T extends BaseManager>(name: string): T | undefined {
        return ManagerRegistry.managers.get(name) as T | undefined;
    }

    /**
     * 初始化所有已注册的 Manager（按注册顺序串行初始化）
     * 异步 Manager 会等待其 init() 完成
     */
    public static async initAll(): Promise<void> {
        for (const [, manager] of ManagerRegistry.managers) {
            await manager.init();
        }
    }

    /**
     * 销毁所有 Manager（按注册的逆序销毁）
     */
    public static destroyAll(): void {
        const entries: Array<[string, BaseManager]> = Array.from(ManagerRegistry.managers.entries());
        for (let i: number = entries.length - 1; i >= 0; i--) {
            entries[i][1].destroy();
        }
    }

    /**
     * 清空注册表（仅用于测试或重置）
     */
    public static clear(): void {
        ManagerRegistry.managers.clear();
    }
}
