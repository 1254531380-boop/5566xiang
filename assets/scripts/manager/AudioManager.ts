import { BaseManager } from '../core/BaseManager';
import { ManagerRegistry } from '../core/ManagerRegistry';

/**
 * AudioManager
 * 负责音频的播放与控制
 */
export class AudioManager extends BaseManager {
    private static _instance: AudioManager | null = null;

    public static get Instance(): AudioManager {
        if (AudioManager._instance === null) {
            AudioManager._instance = new AudioManager();
            ManagerRegistry.register('AudioManager', AudioManager._instance);
        }
        return AudioManager._instance;
    }

    private constructor() {
        super();
    }

    init(): void {
    }

    destroy(): void {
    }
}
