/**
 * SaveManager
 * 负责存档的读写
 */
export class SaveManager {
    private static _instance: SaveManager | null = null;

    public static get Instance(): SaveManager {
        if (SaveManager._instance === null) {
            SaveManager._instance = new SaveManager();
        }
        return SaveManager._instance;
    }

    private constructor() {}

    init(): void {
    }

    destroy(): void {
    }
}
