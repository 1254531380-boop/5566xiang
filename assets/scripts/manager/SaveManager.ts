import { BaseManager } from '../core/BaseManager';
import { ManagerRegistry } from '../core/ManagerRegistry';

/**
 * SaveManager
 * 负责存档的读写
 * 后续将提供统一的 save/load/delete/autoSave 接口
 */
export class SaveManager extends BaseManager {
    private static _instance: SaveManager | null = null;

    public static get Instance(): SaveManager {
        if (SaveManager._instance === null) {
            SaveManager._instance = new SaveManager();
            ManagerRegistry.register('SaveManager', SaveManager._instance);
        }
        return SaveManager._instance;
    }

    private constructor() {
        super();
    }

    init(): void {
    }

    destroy(): void {
    }
}
