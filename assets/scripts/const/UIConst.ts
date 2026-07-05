/**
 * UIConst
 * UI 节点路径常量，用于 find() 查找
 */
export class UIConst {
    /** Canvas 根节点 */
    public static readonly CANVAS: string = 'Canvas';

    /** 主菜单开始按钮 */
    public static readonly MAIN_MENU_BUTTON: string = 'Canvas/Button';

    /** 玩家出生点 */
    public static readonly PLAYER_SPAWN: string = 'Canvas/PlayerSpawn';

    /** 玩家节点 */
    public static readonly PLAYER: string = 'Canvas/Player';

    /** 交互提示 UI 节点 */
    public static readonly INTERACTION_UI: string = 'Canvas/InputRoot/InteractButton/Label';

    /** InputRoot 节点 */
    public static readonly INPUT_ROOT: string = 'Canvas/InputRoot';

    /** UIRoot 节点 */
    public static readonly UI_ROOT: string = 'Canvas/UIRoot';

    /** GameRoot 节点 */
    public static readonly GAME_ROOT: string = 'Canvas/GameRoot';
}
