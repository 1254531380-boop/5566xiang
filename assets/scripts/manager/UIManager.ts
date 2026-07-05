/**
 * UIManager
 * 负责 UI 的创建、显示与隐藏
 */
export class UIManager {
    private static _instance: UIManager | null = null;

    public static get Instance(): UIManager {
        if (UIManager._instance === null) {
            UIManager._instance = new UIManager();
        }
        return UIManager._instance;
    }

    private constructor() {}

    init(): void {
    }

    destroy(): void {
    }
}
