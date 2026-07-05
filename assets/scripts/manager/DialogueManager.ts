import { BaseManager } from '../core/BaseManager';
import { ManagerRegistry } from '../core/ManagerRegistry';

/**
 * DialogueManager
 * 负责对话的解析与展示
 */
export class DialogueManager extends BaseManager {
    private static _instance: DialogueManager | null = null;

    public static get Instance(): DialogueManager {
        if (DialogueManager._instance === null) {
            DialogueManager._instance = new DialogueManager();
            ManagerRegistry.register('DialogueManager', DialogueManager._instance);
        }
        return DialogueManager._instance;
    }

    private constructor() {
        super();
    }

    init(): void {
    }

    destroy(): void {
    }
}
