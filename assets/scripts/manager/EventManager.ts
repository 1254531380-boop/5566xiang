/**
 * EventManager
 * 负责事件的注册、派发与移除
 */
export class EventManager {
    private static _instance: EventManager | null = null;

    public static get Instance(): EventManager {
        if (EventManager._instance === null) {
            EventManager._instance = new EventManager();
        }
        return EventManager._instance;
    }

    private constructor() {}

    init(): void {
    }

    destroy(): void {
    }
}
