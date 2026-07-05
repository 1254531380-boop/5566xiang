/**
 * NPCConst
 * NPC 与交互相关常量（微信小游戏版）
 * 移除键盘相关常量，交互改为按钮驱动
 */
export class NPCConst {
    /** 村长 NPC ID */
    public static readonly NPC_OLDMAN: string = 'npc_oldman';

    /** 村长显示名 */
    public static readonly OLDMAN_DISPLAY_NAME: string = '村长';

    /** 村长节点名 */
    public static readonly OLDMAN_NODE_NAME: string = 'OldMan';

    /** 交互触发距离 */
    public static readonly INTERACTION_DISTANCE: number = 120;

    /** 交互提示文本（按钮交互版） */
    public static readonly INTERACTION_PROMPT: string = '交互';
}
