/**
 * ResourceConst
 * resources 目录下的资源路径常量
 * 路径相对于 resources/ 目录，不含后缀
 */
export class ResourceConst {
    /** 游戏配置 */
    public static readonly CONFIG_GAME: string = 'config/game';

    /** 玩家配置 */
    public static readonly CONFIG_PLAYER: string = 'config/player';

    /** 场景配置 */
    public static readonly CONFIG_SCENE: string = 'config/scene';

    /** NPC 预制体 */
    public static readonly PREFAB_NPC: string = 'prefabs/NPC';

    /** 摇杆 UI */
    public static readonly PREFAB_JOYSTICK: string = 'prefabs/Joystick';

    /** 交互按钮 UI */
    public static readonly PREFAB_INTERACT_BUTTON: string = 'prefabs/InteractButton';

    /** 弹窗 UI */
    public static readonly PREFAB_POPUP: string = 'prefabs/Popup';
}
