/**
 * ConfigTypes
 * 配置类型定义（类型安全）
 *
 * 所有 JSON 配置文件的结构在此集中定义，供 ConfigManager 加载与业务代码消费。
 * 与 ConfigManager 解耦，避免循环依赖。
 */

/**
 * 游戏基础配置（对应 config/game.json）
 */
export interface GameConfig {
    gameName: string;
    version: string;
}

/**
 * 玩家配置（对应 config/player.json）
 */
export interface PlayerConfig {
    moveSpeed: number;
}

/**
 * 场景配置（对应 config/scene.json）
 */
export interface SceneConfig {
    boot: string;
    mainMenu: string;
    game: string;
}
