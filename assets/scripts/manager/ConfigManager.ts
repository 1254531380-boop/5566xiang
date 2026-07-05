import { resources, JsonAsset } from 'cc';

/**
 * GameConfig
 * 游戏基础配置
 */
export interface GameConfig {
    gameName: string;
    version: string;
}

/**
 * PlayerConfig
 * 玩家配置
 */
export interface PlayerConfig {
    moveSpeed: number;
}

/**
 * SceneConfig
 * 场景配置
 */
export interface SceneConfig {
    boot: string;
    mainMenu: string;
    village: string;
}

/**
 * ConfigManager
 * 负责加载和管理游戏配置
 */
export class ConfigManager {
    private static _instance: ConfigManager | null = null;

    public static get Instance(): ConfigManager {
        if (ConfigManager._instance === null) {
            ConfigManager._instance = new ConfigManager();
        }
        return ConfigManager._instance;
    }

    private constructor() {}

    private gameConfig: GameConfig | null = null;
    private playerConfig: PlayerConfig | null = null;
    private sceneConfig: SceneConfig | null = null;
    private isInitialized: boolean = false;

    /**
     * 初始化：启动时一次加载所有配置并缓存
     */
    init(): Promise<void> {
        if (this.isInitialized) {
            return Promise.resolve();
        }
        this.isInitialized = true;

        return new Promise<void>((resolve) => {
            let loadedCount: number = 0;
            const total: number = 3;

            const checkComplete = (): void => {
                loadedCount++;
                if (loadedCount >= total) {
                    console.log('========================');
                    console.log(`GameName: ${this.gameConfig ? this.gameConfig.gameName : ''}`);
                    console.log(`Version: ${this.gameConfig ? this.gameConfig.version : ''}`);
                    console.log(`MoveSpeed: ${this.playerConfig ? this.playerConfig.moveSpeed : 0}`);
                    console.log('Config Loaded Success');
                    console.log('========================');
                    resolve();
                }
            };

            resources.load('config/game', JsonAsset, (err, data) => {
                if (err || !data) {
                    console.error('Failed to load game.json:', err);
                    checkComplete();
                    return;
                }
                this.gameConfig = data.json as GameConfig;
                checkComplete();
            });

            resources.load('config/player', JsonAsset, (err, data) => {
                if (err || !data) {
                    console.error('Failed to load player.json:', err);
                    checkComplete();
                    return;
                }
                this.playerConfig = data.json as PlayerConfig;
                checkComplete();
            });

            resources.load('config/scene', JsonAsset, (err, data) => {
                if (err || !data) {
                    console.error('Failed to load scene.json:', err);
                    checkComplete();
                    return;
                }
                this.sceneConfig = data.json as SceneConfig;
                checkComplete();
            });
        });
    }

    /**
     * 获取游戏配置
     */
    getGameConfig(): GameConfig | null {
        return this.gameConfig;
    }

    /**
     * 获取玩家配置
     */
    getPlayerConfig(): PlayerConfig | null {
        return this.playerConfig;
    }

    /**
     * 获取场景配置
     */
    getSceneConfig(): SceneConfig | null {
        return this.sceneConfig;
    }

    destroy(): void {
        this.gameConfig = null;
        this.playerConfig = null;
        this.sceneConfig = null;
        this.isInitialized = false;
    }
}
