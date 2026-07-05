/**
 * DialogueManager
 * 负责对话的解析与展示
 */
export class DialogueManager {
    private static _instance: DialogueManager | null = null;

    public static get Instance(): DialogueManager {
        if (DialogueManager._instance === null) {
            DialogueManager._instance = new DialogueManager();
        }
        return DialogueManager._instance;
    }

    private constructor() {}

    init(): void {
    }

    destroy(): void {
    }
}
