import { director } from 'cc';
import { BaseManager } from '../core/BaseManager';
import { ManagerRegistry } from '../core/ManagerRegistry';

/**
 * SceneManager
 * 负责场景的加载与切换
 * 全项目禁止直接调用 director.loadScene，统一走此 Manager
 */
export class SceneManager extends BaseManager {
    private static _instance: SceneManager | null = null;

    public static get Instance(): SceneManager {
        if (SceneManager._instance === null) {
            SceneManager._instance = new SceneManager();
            ManagerRegistry.register('SceneManager', SceneManager._instance);
        }
        return SceneManager._instance;
    }

    private constructor() {
        super();
    }

    init(): void {
    }

    destroy(): void {
    }

    /**
     * 加载场景
     * @param sceneName 场景名称（建议使用 SceneConst 常量）
     * @param onComplete 加载完成回调
     */
    loadScene(sceneName: string, onComplete?: (() => void) | null): void {
        director.loadScene(sceneName, () => {
            if (onComplete) {
                onComplete();
            }
        });
    }
}
