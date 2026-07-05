import { BaseManager } from '../core/BaseManager';
import { ManagerRegistry } from '../core/ManagerRegistry';

/**
 * UIManager
 * 负责 UI 的创建、显示与隐藏
 */
export class UIManager extends BaseManager {
    private static _instance: UIManager | null = null;

    public static get Instance(): UIManager {
        if (UIManager._instance === null) {
            UIManager._instance = new UIManager();
            ManagerRegistry.register('UIManager', UIManager._instance);
        }
        return UIManager._instance;
    }

    private constructor() {
        super();
    }

    init(): void {
    }

    destroy(): void {
    }
}
