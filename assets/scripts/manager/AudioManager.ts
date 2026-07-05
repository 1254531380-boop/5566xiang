/**
 * AudioManager
 * 负责音频的播放与控制
 */
export class AudioManager {
    private static _instance: AudioManager | null = null;

    public static get Instance(): AudioManager {
        if (AudioManager._instance === null) {
            AudioManager._instance = new AudioManager();
        }
        return AudioManager._instance;
    }

    private constructor() {}

    init(): void {
    }

    destroy(): void {
    }
}
