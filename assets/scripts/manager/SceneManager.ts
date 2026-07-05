import { director } from 'cc';

/**
 * SceneManager
 * 负责场景的加载与切换
 */
export class SceneManager {
    private static _instance: SceneManager | null = null;

    public static get Instance(): SceneManager {
        if (SceneManager._instance === null) {
            SceneManager._instance = new SceneManager();
        }
        return SceneManager._instance;
    }

    private constructor() {}

    init(): void {
    }

    destroy(): void {
    }

    /**
     * 加载场景
     * @param sceneName 场景名称
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
