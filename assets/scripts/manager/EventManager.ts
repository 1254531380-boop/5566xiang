import { BaseManager } from '../core/BaseManager';
import { ManagerRegistry } from '../core/ManagerRegistry';

/**
 * EventManager
 * 负责事件的注册、派发与移除
 * 后续所有跨系统通信统一走此 Manager，禁止 Player → NPC 直接调用
 */
export class EventManager extends BaseManager {
    private static _instance: EventManager | null = null;

    public static get Instance(): EventManager {
        if (EventManager._instance === null) {
            EventManager._instance = new EventManager();
            ManagerRegistry.register('EventManager', EventManager._instance);
        }
        return EventManager._instance;
    }

    private constructor() {
        super();
    }

    init(): void {
    }

    destroy(): void {
    }
}
