/**
 * InputManager
 * 负责输入事件的监听与分发
 */
export class InputManager {
    private static _instance: InputManager | null = null;

    public static get Instance(): InputManager {
        if (InputManager._instance === null) {
            InputManager._instance = new InputManager();
        }
        return InputManager._instance;
    }

    private constructor() {}

    init(): void {
    }

    destroy(): void {
    }
}
