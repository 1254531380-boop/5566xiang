/**
 * EnumTypes
 * 公共枚举定义（跨模块共用）
 * 所有业务模块共享的枚举集中于此，避免循环依赖
 */

/**
 * UI 类型（供 UIManager 统一管理 UI 显示栈）
 */
export enum UIType {
    /** 主菜单 */
    MAIN_MENU = 0,
    /** 游戏 HUD（血条、任务追踪等） */
    HUD = 1,
    /** 普通弹窗（确认框、提示框） */
    POPUP = 2,
    /** 对话框 */
    DIALOGUE = 3,
    /** 背包界面 */
    INVENTORY = 4,
    /** 任务界面 */
    QUEST = 5,
    /** 设置界面 */
    SETTINGS = 6,
}

/**
 * 物品类型（供背包/物品系统使用）
 */
export enum ItemType {
    /** 消耗品（药水、食物） */
    CONSUMABLE = 0,
    /** 装备（武器、防具） */
    EQUIPMENT = 1,
    /** 材料（ crafting 材料） */
    MATERIAL = 2,
    /** 任务道具 */
    QUEST_ITEM = 3,
    /** 其他 */
    MISC = 4,
}

/**
 * 任务状态（供任务系统使用）
 */
export enum QuestStatus {
    /** 未接取 */
    NOT_STARTED = 0,
    /** 进行中 */
    IN_PROGRESS = 1,
    /** 已完成，待领取奖励 */
    COMPLETED = 2,
    /** 已领取奖励，已归档 */
    CLAIMED = 3,
    /** 已放弃 */
    ABANDONED = 4,
}

/**
 * 存档槽类型（供存档系统使用）
 */
export enum SaveSlotType {
    /** 自动存档槽 */
    AUTO = 0,
    /** 手动存档槽 1 */
    SLOT_1 = 1,
    /** 手动存档槽 2 */
    SLOT_2 = 2,
    /** 手动存档槽 3 */
    SLOT_3 = 3,
}
