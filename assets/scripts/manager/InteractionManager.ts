import { Node } from 'cc';
import { BaseManager } from '../core/BaseManager';
import { ManagerRegistry } from '../core/ManagerRegistry';
import { NPCConst } from '../const/NPCConst';
import { InputManager } from './InputManager';
import { NPCController } from '../npc/NPCController';

/**
 * InteractionManager
 * 统一交互管理层（微信小游戏版）
 *
 * 架构原则：
 *   - Manager 是纯逻辑，不创建 Node、不监听按键/触摸、不操作 UI 组件
 *   - 交互由 InputManager.triggerInteract() → EVENT_INTERACT 驱动
 *   - 每帧 tick 由 InteractionSystem（场景级 Component）驱动
 *   - 场景引用由 System 层注入，Manager 不做 find
 *   - 距离计算使用平方比较
 *   - UI 更新由 InteractionSystem 查询 currentTarget 后自行处理
 *
 * 禁止：
 *   - Manager 监听 input.on / Keyboard / Touch
 *   - Manager 知道按键 / 触摸细节
 *   - Manager 直接操作 Label / Sprite 等 UI 组件
 */
export class InteractionManager extends BaseManager {
    private static _instance: InteractionManager | null = null;

    public static get Instance(): InteractionManager {
        if (InteractionManager._instance === null) {
            InteractionManager._instance = new InteractionManager();
            ManagerRegistry.register('InteractionManager', InteractionManager._instance);
        }
        return InteractionManager._instance;
    }

    private constructor() {
        super();
    }

    private npcList: NPCController[] = [];
    private playerNode: Node | null = null;
    private currentTarget: NPCController | null = null;
    private interactDistSq: number = 0;

    init(): void {
        // 监听 InputManager 派发的交互事件（不直接监听按键）
        InputManager.Instance.onInteract(this.onInteract, this);
        this.interactDistSq = NPCConst.INTERACTION_DISTANCE * NPCConst.INTERACTION_DISTANCE;
    }

    destroy(): void {
        InputManager.Instance.offInteract(this.onInteract, this);
        this.clearScene();
    }

    // ==================== 交互入口 ====================

    /**
     * 交互入口，由 InputManager 派发的 EVENT_INTERACT 触发
     * 替代旧版 onKeyDown(KEY_F) — Manager 不再知道按键
     */
    private onInteract(): void {
        if (this.currentTarget !== null) {
            this.currentTarget.interact();
        }
    }

    /**
     * 公开交互接口，供外部直接调用（如 UI 按钮回调）
     */
    public interact(): void {
        this.onInteract();
    }

    // ==================== 场景引用注入（由 System 层调用） ====================

    public setPlayer(player: Node | null): void {
        this.playerNode = player;
    }

    public clearScene(): void {
        this.npcList = [];
        this.playerNode = null;
        this.currentTarget = null;
    }

    // ==================== 可交互对象注册 ====================

    public registerNPC(npc: NPCController): void {
        if (this.npcList.indexOf(npc) === -1) {
            this.npcList.push(npc);
        }
    }

    public unregisterNPC(npc: NPCController): void {
        const idx: number = this.npcList.indexOf(npc);
        if (idx !== -1) {
            this.npcList.splice(idx, 1);
            if (this.currentTarget === npc) {
                this.currentTarget = null;
            }
        }
    }

    // ==================== 查询接口（供 System 层更新 UI） ====================

    /**
     * 获取当前交互目标（最近的可交互 NPC）
     * InteractionSystem 据此更新交互提示 UI
     */
    public getCurrentTarget(): NPCController | null {
        return this.currentTarget;
    }

    /**
     * 是否存在可交互目标
     */
    public hasInteractionTarget(): boolean {
        return this.currentTarget !== null;
    }

    // ==================== 每帧更新（由 System 驱动） ====================

    public tick(): void {
        if (this.playerNode === null) {
            return;
        }

        const playerPos = this.playerNode.position;
        let nearestNpc: NPCController | null = null;
        let nearestDistSq: number = Infinity;

        for (let i: number = 0; i < this.npcList.length; i++) {
            const npc = this.npcList[i];
            if (!npc.isValid || !npc.node.active) {
                continue;
            }
            const npcPos = npc.node.position;
            const dx: number = npcPos.x - playerPos.x;
            const dy: number = npcPos.y - playerPos.y;
            const distSq: number = dx * dx + dy * dy;

            if (distSq <= this.interactDistSq && distSq < nearestDistSq) {
                nearestDistSq = distSq;
                nearestNpc = npc;
            }
        }

        this.currentTarget = nearestNpc;
    }
}
